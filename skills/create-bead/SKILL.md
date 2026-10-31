---
name: create-bead
description: >
  The beads issue tracker and its create command: what a bead is, the `bd create` CLI, and every
  parameter it takes — what each flag sets, the key it lands in, which flags the binary silently
  ignores, and the traps that never error. Use it whenever a bead is being CREATED: plan-epic,
  plan-feature, plan-task, any "make me a ticket/epic/feature" request, or a tower that came out with
  no dispatching labels, two dispatching labels, the wrong type, or no merge ticket.
version: 0.2.0
---

# Creating a bead

## You are working in a beads system

**Beads** is the issue tracker this toolkit plans and ships on: one local database per repository,
driven by the `bd` command-line tool. Every unit of work — epic, feature, task — is a real row in that
database: an id (`bd-42`), a title, a description, acceptance criteria, a priority, a type, labels, a
status (`open` → `in_progress` → `closed`, with `blocked`/`deferred` off the frontier) and an owner.

It is not a markdown file and not a scratchpad. The database **is** the plan, and it is the only thing
anything reads at runtime: a worker is spawned from its own ticket and nothing else — nobody reads a plan
document, a stdout, or a chat summary. So whatever you knew and did not write into the row, the worker
does not know. A worker never closes its own ticket — a human reads the worker's report and closes it —
so **the ticket, its notes, and the worker's final report together are the proof of work anyone sees.**

Three shapes hold the database together, and every parameter below sets one of them:

| Shape | What it is | Set by |
|---|---|---|
| **the tower** | epic → feature → task, who belongs to whom | `--parent`, or `--deps "parent-child:<id>"` |
| **the ordering** | what may not start yet | `--deps "blocks:<id>"`, or a `blocks` edge |
| **the dispatch** | which specialist this ticket is for | `-l` — exactly one dispatching label |

## The command

```bash
bd create "Create formatCurrency function" \
  -d "<the complete brief — everything the worker needs, inside the row itself>" \
  --acceptance "<the observable evidence that it is done>" \
  -t task -p 2 -l backend-logic \
  --parent bd-42 \
  --silent
```

`--silent` prints only the new id. Capture it — you need it as the `--parent`/edge argument for the next
ticket, and human-readable output is not a contract.

## Parameters

### The body — what the worker actually reads

| Flag | Sets | Lands in | Note |
|---|---|---|---|
| `"title"` (positional) | the title | `title` | **one positional only** — a second errors `accepts at most 1 arg(s), received 2` |
| `--title` | the title | `title` | the flag form, for a title that could read as a flag |
| `-d`, `--description` | the brief | `description` | the complete brief. Self-contained: executable with nothing else open |
| `--body-file <f>`, `--stdin` | the brief from a file/stdin | `description` | use for a long brief — shell quoting mangles a multi-line `-d` |
| `--acceptance` | done criteria | `acceptance_criteria` | observable evidence, written for a human to verify |
| `--design` | design notes | `design` | your reasoning; never the worker's instructions |
| `--notes` | notes | `notes` | worth keeping, not part of the brief — prose only; the branch keys are not notes, see §The branch keys |
| `--context` | extra context | **appended to `description`** as a `## Context` section | verified: it is not its own field, so it reads back inside the brief |
| `--metadata '<json>'` | a JSON object of your own keys | `metadata` | the branch keys live here — see §The branch keys |

### The kind — what the row is

| Flag | Sets | Lands in | Note |
|---|---|---|---|
| `-t`, `--type` | issue type (default `task`) | `issue_type` | `task` for anything worked, `gate` for an epic/feature — see §Gates |
| `-p`, `--priority` | `0`–`4` (`P0`–`P4`, 0 highest), default **2** | `priority` | inherit the parent's; P4 when nothing is set |
| `-l`, `--labels` | labels, comma-separated | `labels` | the **exactly one dispatching label** — see §The label |
| `--no-inherit-labels` | stop the parent's labels copying down | — | needed only when a parent is wrongly labelled; the real rule is gates carry no label |
| `-s`, `--status` | initial status | `status` | leave it alone — `open` is what a ticket waiting to be claimed looks like |

### The place — where it sits

| Flag | Sets | Lands in | Note |
|---|---|---|---|
| `--parent <id>` | its parent in the tower | `parent` | also gives a dotted id: a child of `bd-cub` comes back `bd-cub.1` |
| `--deps <type:id>` | a dependency edge at create time | `dependencies` | bare `id`, `depends-on:` and `blocked-by:` make **this** issue wait on it; `blocks:` reverses it (that issue waits on this one); `parent-child:` is the tower edge |

`--deps` types the binary accepts, verbatim from its own error: `approved-by`, `assigned-to`, `attests`,
`authored-by`, `blocked-by`, `blocks`, `caused-by`, `conditional-blocks`, `delegated-from`, `depends-on`,
`discovered-from`, `duplicates`, `parent-child`, `related`, `relates-to`, `replies-to`, `supersedes`,
`tracks`, `until`, `waits-for`, `validates`.

### Bulk and scripting

| Flag | What it does | Note |
|---|---|---|
| `-f`, `--file <file.md>` | creates many issues from one markdown file | one `## Heading` + body per issue; prints every id |
| `--dry-run` | shows what would be created, writes nothing | the cheap way to check your flags before you commit a row |
| `--json` | machine-readable output | pair with `jq` |
| `--id <id>` | explicit id instead of an assigned one | must match the database prefix or it errors; `--force` overrides |
| `--validate` | refuses when the description lacks the sections its type requires | `-t task` demands `## Acceptance Criteria` **in the description** |
| `--force` | create despite a prefix mismatch | almost never what you meant |

## The label

`-l` is not decoration — it is the entire dispatch decision. The dispatcher reads the labels off the row and keeps the ones the map names
and that alone names the specialist, so a ticket with **zero or two** is left claimed and logged
`ERROR reason=label-ambiguous`: work that silently never happens.

The dispatchable set is closed and the loop owns it (`CLI/beads-loop.sh`, the `AGENT` map):
`backend-logic` · `frontend-ui` · `unit-tests` · `feature-test` · `epic-e2e-test` ·
`feature-review` · `epic-review` · `epic-merge-pr`. The last one is the merge tier and it DOES
dispatch — the map names `merge` for it, so a merge ticket is claimed and worked like any other.
Anything the map does not name dispatches nothing, however plausible it reads. **There is no
`feature-merge-pr`:** a feature is a branch, its tasks land on it one commit at a time, and there is
nothing left to assemble.

## The branch keys

One branch per epic, one per feature, and a task is a commit on its feature's branch. The name is not
chosen at work time — the plan agents write it at create time as **metadata**, and the dispatcher reads
that key straight off the claim. Two keys exist and only one is yours:

```bash
bd create "Create formatCurrency function" \
  -d "<the complete brief>" --acceptance "<the observable evidence>" \
  -t task -l backend-logic --parent <feature-id> \
  --metadata '{"branch":"feature/checkout-flow"}' \
  --silent
```

| Key | Who writes it | What it is |
|---|---|---|
| `branch` | the plan agents | the ticket's own branch — the worktree the loop enters (creating it only for the feature's first task), the commit's branch, the pull request's head |
| `pr` | the loop, then the Stop hook | the url of the pull request that exists on that branch — the loop writes it onto the epic gate when it publishes it, the hook onto each ticket whose work landed. **Never written by a plan agent**: it is a url of something that does not exist yet |

**A pull request's base is not a key.** It is the epic gate's own `branch`, and the parent chain already
names that gate — ticket → feature → epic — so the loop walks up and reads it there, reading `main` when
the ticket hangs under the epic itself. Writing the epic's branch down onto every ticket underneath would
put the same fact in many rows, where a corrected gate and its copies silently disagree.

Rules that keep the model true:

- **Format:** `epic/<slug>` or `feature/<slug>` — a lowercase slug of 2–4 words saying what the thing
  *is*, single dashes between them. Never a ticket id, never an appended number: a sibling whose slug
  collides gets **different words**, not `checkout-flow-2`, because a number is a name nobody can read
  back six weeks later.
- **One value per feature**, copied verbatim from the feature's own metadata into every task under it —
  three tasks that each invented a name are three branches and one feature. The epic's tasks, its
  e2e/review/merge tickets all carry the **epic's** `branch`, and so do the gates. The merge agent finds the
  feature branches by reading the feature gates' `branch`.
- **Metadata is the carrier.** Verified against the binary: `metadata` comes back as one JSON object
  under `bd show --json` AND is present in the `bd ready --claim --json` payload, so the loop reads
  `.metadata.branch` exactly — no second query, no parsing a stray colon can
  break. `notes` is prose and nothing else; `external_ref` round-trips through `bd show` but is **absent**
  from the claim payload. A branch name anywhere else is a fact the loop cannot see.
- A ticket with no `branch` key is left claimed and logged `ERROR reason=metadata-missing` — a task with
  nowhere to put its work is as dead as one with no label. A ticket with no `pr` is normal: that key appears
  only once a pull request exists.

Read the keys back with the rest of the row, exactly as written, at creation. To fix one after the fact:
`bd update <id> --set-metadata branch=feature/checkout-flow`. Verified: `--set-metadata` **merges** — the
keys already on the ticket survive, which is how the hook can add `pr` to a ticket without disturbing the
`branch` the plan wrote.

## Gates are a type, not a label

An epic or a feature is `-t gate`: a **custom** type, registered once per database with
`bd config set types.custom "gate"` and checkable with `bd types`. Three verified consequences:

- `bd create -t gate` **does not refuse** an unregistered type — it accepts it and hides it, so a broken
  gate and a working gate look identical. Register it first, check `bd types`, then create.
- **A gate carries no label at all.** Labels are inherited by children — verified, a child under a
  labelled parent comes back carrying the parent's label — and a gate labelled anything turns every task
  below it into a ticket carrying two dispatching labels, which is a dead ticket.
- Gates are invisible to the default queries. `bd list` reported *no issues* while two gates existed, and
  `bd children <gate>` answered *"no children"* while a whole subtree hung there. Surveying them takes
  `bd list -t gate`, or `bd list --parent <id> --include-gates` for the subtree. A bare `bd list` will
  convince you your epic vanished.

Never put a gate on a built-in type (`epic`, `feature`, `story`, `bug`): built-ins show up in `bd ready`
as claimable work, and a gate a worker can claim is a model bug.

## Accepted, and quietly ignored

Verified against the binary: `-e`/`--estimate`, `--due`, `--skills` and `-a`/`--assignee` are all
**accepted at create and never come back** — `bd show --json` has no key for them and `bd list --json`
carries no `labels` either. Never put a fact in a flag that does not survive the write: put it in `-d`.

And these belong to other subsystems, not to planning: `--graph`, `--waits-for`, `--waits-for-gate`,
`--mol-type`, `--wisp-type`, `--event-*`, `--ephemeral`, `--storage-class`, `--no-history`, `--repo`,
`--spec-id`. (`--metadata` is not on that list — it round-trips and reaches the dispatcher, see §The
branch keys. `--external-ref` round-trips too, for when a bead mirrors something outside, but it is
absent from the claim payload, so nothing the loop needs may live there.)

## Proving the write

The failure mode of `bd create` is not an error, it is a row that looks fine and dispatches nothing, so
read each ticket back the moment you create it:

```bash
bd show --json bd-42 | jq '.[-1] | {issue_type, labels: (.labels // []), acceptance_criteria, parent, metadata}'
```

Two things that bite: `bd show --json` returns a **JSON array**, so a bare `.labels` fails — index
`.[-1]` (or `.[0]`); and `labels` can be JSON `null` rather than `[]`, so default it. A wrong key returns
`null` **without erroring**, which is how a broken write survives a whole session. `-t gate` rows are
expected to show zero labels — that is the pass condition, not a failure.

## Not this command

`bd create` makes rows. It does not order them beyond the edges you pass at create (real ordering is
`bd dep add <blocked> <blocker> --type blocks`), and it does not claim, unclaim, close or heartbeat —
`ready --claim`, `update --claim`, `unclaim` and `reclaim` belong to `CLI/beads-loop.sh` and the
operator alone. A creator's job is finished when the rows exist and read back right.
