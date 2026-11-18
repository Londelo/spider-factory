---
name: bead-create
description: >
  The beads issue tracker and its create command: what a bead is, the `bd create` CLI, and every
  parameter it takes — what each flag sets, the key it lands in, which flags the binary silently
  ignores, and the traps that never error. Use it whenever a bead is being CREATED: plan-epic,
  plan-feature, plan-task, any "make me a ticket/epic/feature" request, or a tower that came out with
  no dispatching labels, two dispatching labels, the wrong type, no `base` key, or a `parent-child`
  edge in it.
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
does not know. A worker never closes its own ticket — the Stop hook closes a task once its worker declares
done, and a gate waits for a human or the lead agent — so **the ticket and the worker's final report
together are the proof of work anyone sees.**

Two shapes hold the database together, and every parameter below sets one of them:

| Shape | What it is | Set by |
|---|---|---|
| **the tower and the ordering** | what must be finished before what may start — the tier relationship *and* the sequence inside it | `blocks` edges: `bd dep add <blocked> <blocker> --type blocks`, or `--deps "blocks:<id>"` at create |
| **the dispatch** | which specialist this ticket is for | `-l` — exactly one dispatching label |

**There is no third shape and no parenthood.** A tower is `blocks` edges and nothing else: no `--parent`,
no `--deps "parent-child:<id>"`, no `bd link --type parent-child`. What a tier *is* = the tickets that
block its gate; what a ticket belongs to = the gate it blocks. Nothing else in the database records which
tier a ticket is in, so an edge you did not write is a ticket that belongs to nothing — and an id tells
you nothing either, because with no parent link `bd create` mints a flat id (`bd-7f3a`) and there is no
dotted `bd-cub.1` to read a tier out of. Read `issue_type` and the graph, never the id.

## The command

```bash
bd create "Create formatCurrency function" \
  -d "<the complete brief — everything the worker needs, inside the row itself>" \
  --acceptance "<the observable evidence that it is done>" \
  -t task -p 2 -l backend-logic \
  --metadata '{"branch":"feature/checkout-flow","base":"epic/checkout-flow"}' \
  --silent
```

`--silent` prints only the new id. Capture it — it is the argument to every `bd dep add` you run next, and
human-readable output is not a contract.

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
| `--notes` | notes | `notes` | worth keeping, not part of the brief — prose only; the keys below are not notes, see §The metadata keys |
| `--context` | extra context | **appended to `description`** as a `## Context` section | verified: it is not its own field, so it reads back inside the brief |
| `--metadata '<json>'` | a JSON object of your own keys | `metadata` | `branch`, `base`, and `tier` on a gate live here — see §The metadata keys |

### The kind — what the row is

| Flag | Sets | Lands in | Note |
|---|---|---|---|
| `-t`, `--type` | issue type (default `task`) | `issue_type` | `task` for anything worked, `gate` for an epic/feature — see §Gates |
| `-p`, `--priority` | `0`–`4` (`P0`–`P4`, 0 highest), default **2** | `priority` | inherit your tier's gate; P4 when nothing is set |
| `-l`, `--labels` | labels, comma-separated | `labels` | the **exactly one dispatching label** — see §The label |
| `--no-inherit-labels` | stop a parent's labels copying down | — | does nothing in a tower you built right: inheritance came from `--parent`, and you never pass one |
| `-s`, `--status` | initial status | `status` | leave it alone — `open` is what a ticket waiting to be claimed looks like |

### The place — where it sits

There is no place to declare at create time. A ticket's position **is** its edges, and you write them with
`bd dep add` the moment the row exists:

```bash
bd dep add "$task" "$gate" --type blocks      # this task is one of the gate's tier
bd dep add "$next" "$task" --type blocks      # and the next one waits on it
```

At create time `--deps <type:id>` writes the same edge: bare `id`, `depends-on:` and `blocked-by:` make
**this** issue wait on it; `blocks:` reverses it (that issue waits on this one).

`--deps` types the binary accepts, verbatim from its own error: `approved-by`, `assigned-to`, `attests`,
`authored-by`, `blocked-by`, `blocks`, `caused-by`, `conditional-blocks`, `delegated-from`, `depends-on`,
`discovered-from`, `duplicates`, `parent-child`, `related`, `relates-to`, `replies-to`, `supersedes`,
`tracks`, `until`, `waits-for`, `validates`. **`blocks` is the only one a tower uses.** `parent-child` is
accepted and is exactly what you must never write: it puts a ticket inside a hierarchy nothing enforces,
and beads then refuses the `blocks` edge that would have made it real.

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
`feature-review` · `epic-review`. Anything the map does not name dispatches nothing, however
plausible it reads. Two things have no label because no label reaches them: **a gate** (the loop dispatches
a ready gate to the `lead` agent by type and `tier`, never by a label — and a gate carrying a label is a
checkpoint pretending to be work), and **the human**, who has no agent and is never spawned.

## The metadata keys

One branch per epic, one per feature, and a task is a commit on its feature's branch. The name is not
chosen at work time — the plan agents write it at create time as **metadata**, and the dispatcher reads
those keys straight off the claim. With no parent chain there is nowhere to *walk* to find a branch, so a
key that is missing is a ticket the loop cannot place.

```bash
bd create "Create formatCurrency function" \
  -d "<the complete brief>" --acceptance "<the observable evidence>" \
  -t task -l backend-logic \
  --metadata '{"branch":"feature/checkout-flow","base":"epic/checkout-flow"}' \
  --silent
```

| Key | Who writes it | What it is | On |
|---|---|---|---|
| `branch` | the plan agent that owns the tier | the ticket's own branch — the worktree the loop enters (creating it only for the tier's first ticket), the commit's branch, the pull request's head | every row, copied verbatim down the tier |
| `base` | the plan agent that owns the tier | the base branch of that branch's pull request — `main` for every epic-tier ticket and the epic gate, the epic's own `branch` for every feature-tier ticket and the feature gate | every row, copied verbatim down the tier |
| `tier` | the plan agent creating a gate | `epic` or `feature`, and nothing else | gates only — nothing else may carry it |
| `pr` | the loop, then the Stop hook | the url of the pull request that exists on that branch | **never written by a plan agent**: it is a url of something that does not exist yet |

Rules that keep the model true:

- **Format:** `epic/<slug>` or `feature/<slug>` — a lowercase slug of two or three words saying what the thing
  *is*, single dashes between them. Never a ticket id, never an appended number: a sibling whose slug
  collides gets **different words**, not `checkout-flow-2`, because a number is a name nobody can read
  back six weeks later.
- **One value per tier**, copied verbatim from the gate's own metadata into every ticket of it — three
  tasks that each invented a name are three branches and one feature. The epic's e2e and review tickets
  carry the **epic's** `branch` and `base: main`; a feature's suite and review carry the **feature's**
  `branch` and the epic's branch as their `base`. The gates carry their own pair plus `tier`.
- **Metadata is the carrier.** Verified against the binary: `metadata` comes back as one JSON object
  under `bd show --json` AND is present in the `bd ready --claim --json` payload, so the loop reads
  `.metadata.branch` and `.metadata.base` exactly — no second query, no parsing a stray colon can break.
  `notes` is prose and nothing else; `external_ref` round-trips through `bd show` but is **absent** from
  the claim payload. A branch name anywhere else is a fact the loop cannot see.
- **A ticket with no `branch` or no `base` is left claimed** and logged `ERROR reason=metadata-missing` —
  a task with nowhere to put its work is as dead as one with no label, and a task that does not know what
  its pull request aims at cannot ship. A gate with no `tier` waits, logged `waiting gate_tier_missing`. A
  ticket with no `pr` is normal: that key appears only once a pull request exists.

Read the keys back with the rest of the row, exactly as written, at creation. To fix one after the fact:
`bd update <id> --set-metadata branch=feature/checkout-flow`. Verified: `--set-metadata` **merges** — the
keys already on the ticket survive, which is how the hook can add `pr` to a ticket without disturbing the
`branch` and `base` the plan wrote.

## Gates are a type, not a label

An epic or a feature is `-t gate`: a **custom** type, registered once per database with
`bd config set types.custom "gate"` and checkable with `bd types`. Three verified consequences:

- `bd create -t gate` **does not refuse** an unregistered type — it accepts it and hides it, so a broken
  gate and a working gate look identical. Register it first, check `bd types`, then create.
- **A gate carries no label at all**, and carries `tier` in its metadata. Labels are how a worker gets
  chosen; a gate is a checkpoint and no worker is chosen for it.
- Gates are invisible to the default queries. `bd list` reported *no issues* while two gates existed.
  Surveying them takes `bd list -t gate --json`, and any listing that must show one alongside ordinary
  tasks takes `--include-gates`. A bare `bd list` will convince you your epic vanished.

Never put a gate on a built-in type (`epic`, `feature`, `story`, `bug`): built-ins show up in `bd ready`
as claimable work, and a gate a worker can claim is a model bug.

## Accepted, and quietly ignored

Verified against the binary: `-e`/`--estimate`, `--due`, `--skills` and `-a`/`--assignee` are all
**accepted at create and never come back** — `bd show --json` has no key for them and `bd list --json`
carries no `labels` either. Never put a fact in a flag that does not survive the write: put it in `-d`.

And these belong to other subsystems, not to planning: `--graph`, `--waits-for`, `--waits-for-gate`,
`--mol-type`, `--wisp-type`, `--event-*`, `--ephemeral`, `--storage-class`, `--no-history`, `--repo`,
`--spec-id`. (`--metadata` is not on that list — it round-trips and reaches the dispatcher, see §The
metadata keys. `--external-ref` round-trips too, for when a bead mirrors something outside, but it is
absent from the claim payload, so nothing the loop needs may live there.)

## Proving the write

The failure mode of `bd create` is not an error, it is a row that looks fine and dispatches nothing, so
read each ticket back the moment you create it:

```bash
bd show --json bd-42 | jq '.[-1] | {issue_type, labels: (.labels // []), acceptance_criteria, metadata}'
bd show --json bd-42 | jq '.[-1].dependencies'      # the edges you wrote, with dependency_type
```

Three things that bite: `bd show --json` returns a **JSON array**, so a bare `.labels` fails — index
`.[-1]` (or `.[0]`); `labels` can be JSON `null` rather than `[]`, so default it; and a wrong key returns
`null` **without erroring**, which is how a broken write survives a whole session. `-t gate` rows are
expected to show zero labels and a `tier` — that is the pass condition, not a failure.

**One edge per pair, and a second add is swallowed without a word.** Verified: beads keeps a single edge
between any two issues whatever its type, so an edge of another type already on the pair eats your
`blocks` add and reports success. Read `.dependencies` back after wiring, not just before — an edge that
isn't there is a ticket that belongs to no tier and blocks nothing.

## Not this command

`bd create` makes rows. It does not order them beyond the edges you pass at create (real ordering is
`bd dep add <blocked> <blocker> --type blocks`), and it does not claim, unclaim, close or heartbeat —
`ready --claim`, `update --claim`, `unclaim` and `reclaim` belong to `CLI/beads-loop.sh` and the
operator alone. A creator's job is finished when the rows exist, carry their keys, and read back right.
