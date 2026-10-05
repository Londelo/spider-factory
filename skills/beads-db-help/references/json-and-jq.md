# `bd --json` field names and jq recipes

This exists because of one specific failure: `bd`'s JSON keys are **not** the flag names you used
to write the value, and reading a wrong key returns `null` **without erroring**. A script that asks
for `.assignee` on a list row gets `null` for every row, prints nothing, and looks like a tower
with no work in it. The loop's own preflight is a guard against exactly this class of bug —
`bd list --limit 1 --json | jq -e 'type == "array"'` asks "is this even a list?" before trusting
it, and a `bd` failure that emits an error object instead of an array is how a whole run goes
quiet.

Key sets below were read out of a live database on `bd` 1.3.0, not inferred.

## The three renames that bite

| You wrote it with | …but the key is | Wrong key returns |
|---|---|---|
| `-t` / `--type` | **`issue_type`** | `.type` → `null` |
| `-a` / `--assignee` | **`owner`** (and `assignee` only on a claim row) | `.assignee` → `null` on list/ready/show |
| `--acceptance` | **`acceptance_criteria`** | `.acceptance` → `null` |

All three fail silently. There is no error, no warning, no nonzero exit — just `null` and a
conclusion you should not have drawn.

## Every write flag and its read key

| Field | Write it with | Read key | Watch out |
|---|---|---|---|
| Title | positional, or `--title` | `title` | `bd create` takes **one** positional; a second errors `accepts at most 1 arg(s), received 2` — loud, therefore self-teaching |
| Description | `-d` / `--description` | `description` | on `show`, present only when non-empty |
| Design notes | `--design`, `--design-file` | `design` | ask `--long`, or you cannot tell unwritten from empty |
| Acceptance criteria | `--acceptance` | `acceptance_criteria` | silent rename |
| Notes | `--notes`; appended by `bd note` | `notes` | `bd comment` is a different place — the comment thread |
| Type | `-t` / `--type` | `issue_type` | silent rename |
| Stamp / label | `-l` / `--labels` (comma list) | `labels` | may be `null`, never `[]` — always `.labels // []` |
| Priority | `-p` 0–4, default **2** | `priority` | |
| Parent | `--parent`, or `--deps "parent-child:<id>"` | `parent` | `null` on a root, absent from `ready` rows |
| Assignee | `-a` / `--assignee` | `owner` (`assignee` on a claim row only) | silent rename |

Capture ids with `--silent` whenever a script needs one — it prints only the id. Without it you are
parsing human output, and human output is not a contract.

## Row shapes differ per command — this is the part people assume

| Command | Keys |
|---|---|
| `bd list --json` / `bd list --all --json` | `id title description status priority issue_type owner labels parent dependencies comment_count dependency_count dependent_count created_at created_by updated_at` |
| `bd ready --json` | same **minus `parent` and `dependencies`** — a ready row cannot tell you what it waits on |
| `bd children <id> --json` | same as `list` (incl. `parent`, `dependencies`) |
| `bd show --json <id>` | `id title description status priority issue_type owner labels revision comment_count dependency_count dependent_count created_at created_by updated_at` + **text fields appear only when non-empty** (`design`, `notes`, `acceptance_criteria`) |
| `bd show --json --long <id>` | adds every extended field — `design`, `notes`, `acceptance_criteria`, gate fields, agent identity |
| `bd ready --claim --json` | a **one-element array** adding `assignee`, `started_at`, `lease_expires_at`, `heartbeat_at` |

Three consequences:

- **Keys are present only when the value is non-empty.** A missing key and an empty value are the
  same output. If the question is "did anyone write the design notes?", ask `--long`, or `bd show`
  without `--json`.
- **`bd ready --json` has no dependency edges.** To reason about the frontier you need
  `bd show --json <id>` or `bd dep list <id>` per ticket — a `dependencies` lookup against a ready
  row yields `null`, not an empty list.
- **`--claim` returns an array**, so the loop correctly reads `.[0].id`. Anything reading it as an
  object breaks.

`bd show` on a **missing or empty id** returns an *object*, not an array — so `jq '.[0]'` dies with
`Cannot index object with number`. Capture ids with `bd create --silent`, and test them non-empty
before interpolating.

## `dependencies` is nested full issues

`list`/`children` embed whole blocker objects, which is expensive and noisy:

```bash
bd list --json | jq -r '.[] | "\(.id) waits on [\(.dependencies|map(.id)|join(" "))]"'
```

Use `--brief-deps` on `show` to reduce each dependency to its identity fields (drops description,
design, notes, acceptance criteria). Prefer it on anything with many edges.

## Nulls

- `labels` can be `null`, not `[]` — see a child created with no labels come back
  `labels: null`. **Always `.labels // []`**, which is what the dispatcher does.
- `parent` is `null` on a root node.
- `dependencies` is absent on `ready` rows, so `(.dependencies // [])` everywhere.

## Recipes you will actually want

```bash
# The frontier, with each ticket's single stamp named — the loop's view of the world
bd ready --json | jq -r '.[] | "\(.id)  \(.issue_type)  stamps=\(.labels // [] | join(","))"'

# Tickets the dispatcher can NEVER dispatch: zero matching stamps
bd list --json | jq -r '.[] | select((.labels // []) | length == 0) | "\(.id)  UNSTAMPED  \(.title)"'

# Two stamps — the stamp-ambiguous case. (The loop's own set is the AGENT map in beads-loop.sh.)
bd list --json | jq -r '.[] | select((.labels // []) | length > 1) | "\(.id)  \(.labels|join(" + "))"'

# Who holds what, and for how long — the lease is 300s from started_at
bd list --status in_progress --json | jq -r '.[] | "\(.id)  owner=\(.owner)  updated=\(.updated_at)"'

# Did the stamp survive the write? (the per-ticket round trip a plan agent owes)
bd show --json <id> | jq -e '((. [0].labels // []) | length) == 1' >/dev/null && echo "stamped ✓" || echo "NOT DISPATCHABLE"

# Everything the ticket actually says, in reading order — the worker's brief
bd show --json --long <id> | jq '.[0] | {title, description, design, acceptance_criteria, notes, issue_type, labels}'

# Is a gate really holding this ticket back? (ready rows have no edges — go to show)
bd show --json <id> | jq -r '.[0] | "\(.id) ← [\(.dependencies // [] | map("\(.id):\(.status)") | join(" "))]"'

# Gates, which default queries hide
bd list --include-gates --json | jq -r '.[] | select(.issue_type=="gate") | "\(.id)  \(.title)  labels=\(.labels // [])"'

# A ticket's whole text at once, to grep the brief for a section a plan agent promised
bd show --json --long <id> | jq -r '.[0] | [.title, .description, .design, .acceptance_criteria, .notes] | join("\n---\n")'
```

## Counting and auditing the tower

```bash
bd count 2>/dev/null                       # matching-issue count
bd label list-all                          # every distinct label — spot a category used as a stamp
bd query "label=backend-logic"             # who carries a given stamp
bd query "type=gate AND status=open"       # gates still open = the checkpoints nobody closed
bd list --empty-description --json | jq -r '.[].id'   # tickets nobody can be briefed on
bd lint                                    # issues missing required template sections
```

`bd label list-all` is the fastest way to catch the two failure modes the whole tower is designed
against: a stamp spelled as a category (`unit-test` where `unit-tests` belongs), or a stamp that
wandered onto a gate and is now inherited by every descendant.

## Reading the claim row — dispatcher only

This subsection describes what `scripts/beads-loop.sh` does, so you can read a stuck tower's
behaviour out of the database. **Run none of it from an agent.** The claim below is the loop's
single point of authority over ticket state; an agent claiming is a worker stealing a leased ticket
and spawning itself without a worktree. What you may do with the *shape* of this row is everything
in §"Row shapes differ per command" — read it, never take it.

```bash
row="$(bd ready --claim --json --exclude-type gate \
        --exclude-label feature-merge-pr,epic-merge-pr 2>errs)"; rc=$?
```

Order of checks, and why each is where it is:

1. **`rc != 0`** → the database itself failed. Log `reason=bd-failure exit=$rc` with the captured
   stderr. Never send that stderr to `/dev/null`; a failure nobody can read is a failure that never
   happened.
2. **empty output or `[]`** → *normal*. Open gates and unfinished upstreams hold work back; this is
   not an error and must not be logged as one.
3. **`.[0].id` empty despite rc 0** → the claim lied. Log it with a truncated body; this is a
   different bug from an empty frontier.
4. **labels** → `jq -r '.[0].labels // [] | .[]'`, then keep only labels the `AGENT` map names an
   agent for. Exactly one survives → dispatch. Zero or two → `stamp-ambiguous`, leave the claim in
   place; the lease parks the broken ticket off the frontier so the alarm keeps ringing.

`--exclude-type` and `--exclude-label` are the filters `bd ready` genuinely supports (also
`--label`, `--label-any`, `--label-pattern`, `--label-regex`, `--parent`, `-t`, `-a`, `-p`,
`--unassigned`, `-n/--limit`, `--sort priority|hybrid|oldest`). Merge tickets are excluded at the
*claim*, not filtered after it — that ordering is what makes "the loop never merges" true rather
than merely intended.

## Two consistency traps

**Reads can lag writes.** A freshly created ticket has been observed absent from `bd list --json`
in the immediately following invocation while `bd status` already counted it. Do not conclude a
`bd create` failed because the next read is empty — re-read, and prefer reading the id you captured
with `--silent` back via `bd show --json <id>` over searching for it. This matters most for the
per-ticket stamp round trip: a falsely-empty read is a false "the stamp did not survive" report.

**A lock, not a folder.** `bd` finds its DB by walking up from `$PWD`, so the honest preflight is a
real probe (`bd list --limit 1 --json` returning an array), not a check for a `.beads` directory.
`.beads/embeddeddolt.gate.lock` and `.beads/last-touched` are live state; two dispatchers against
one DB is a real contention, not a theoretical one.
