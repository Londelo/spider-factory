---
name: bead-create
description: >
  The beads issue tracker and its create command: what a bead is, the `bd create` CLI, and every
  parameter it takes — what each flag sets, the key it lands in, which flags the binary silently
  ignores, and the traps that never error. Use it whenever a bead is being CREATED: plan-epic,
  plan-feature, plan-task, any "make me a ticket/epic/feature" request, or a tower that came out with
  no dispatching labels, two dispatching labels, the wrong type, no gate above it, or a `parent-child`
  edge in it.
---

# Creating a bead

## You are working in a beads system

**Beads** is the issue tracker this toolkit plans and ships on: one local database per repository,
driven by the `bd` command-line tool. Every unit of work — epic, feature, task — is a real row in that
database: an id (`foobar-task-a7f3c9-1.3`), a title, a description, acceptance criteria, a priority, a type, labels, a
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
block its gate; what a ticket belongs to = the gate it blocks. An edge you did not write is a ticket that
belongs to nothing.

**The id is the other half of the place, and it is never typed by hand — a generator prints it.** Every id in
a tower reads `<repo>-<kind>-<uuid>-<hierarchy>`, four pieces and no other separator:

| Piece | What it is |
|---|---|
| `<repo>` | this database's own issue prefix, verbatim — beads refuses any id that does not begin with it |
| `<kind>` | `epic` or `feature`, **and only on a gate**. Every other row reads `task` — the suites, the reviews and the worker tasks alike. The word says *who you are*, never what your job is |
| `<uuid>` | lowercase hex, **one per tower**: minted with its epic gate and copied down from that gate's id ever after. A second uuid inside one tower splits it in two, and every ticket under the split reaches no gate |
| `<hierarchy>` | where it lives: `0` is the epic gate, `1 2 3` are its feature gates, and `<gate number>.<m>` is a ticket belonging to that gate |

```
foobar-epic-a7f3c9-0              foobar-feature-a7f3c9-1         foobar-task-a7f3c9-1.3
foobar-task-a7f3c9-0.1              the epic's e2e suite              foobar-task-a7f3c9-1.4
foobar-task-a7f3c9-0.2              the epic's review                 foobar-task-a7f3c9-1.5
                                    foobar-feature-a7f3c9-2         foobar-task-a7f3c9-2.3
```

The loop reads a ticket's whole git world off that id and nothing else: the kind word swapped to `feature`
with the hierarchy cut at the last dot names the **feature gate** whose `branch` the work lands on; swapped
to `epic` with the hierarchy set to `0` it names the **epic gate** whose `branch` the pull request aims at.
That is why the pieces are fixed words and numbers and none of it is a free choice — one misspelled word and
the ticket belongs to no tower.

**Under every gate the first two numbers are taken, always the same two:** `.1` is that gate's suite, `.2` is
that gate's review, and the worker chain starts at `.3`. Under the epic the same rule reads `0.1`, `0.2`,
`0.3`. A gate has exactly one of each, so a second suite is not a numbering problem, it is a plan bug.

A bare `bd create` mints a **flat** id (`bo1-7f3a`) — no hierarchy, therefore no gate above it, and the loop
refuses it, logged `ERROR reason=no-epic-gate ticket=<id>`, leaving it claimed. `--parent` mints a dotted
shape too and is still forbidden: it puts the ticket inside a hierarchy nothing enforces, and beads then
refuses the `blocks` edge that would have made it real. `--id` gives the shape without the hidden link.
Read `issue_type` and the graph for what a ticket *is*; read the id for where it lives.

## The two id generators

The only two things in this system that decide a number are `create-gate.sh` and `create-task.sh`, and they
live in the **factory checkout**, under `CLI/src/create-beads/` — that path is not inside the tower. The
checkout is one of your working directories, so name the scripts by it; stand in the tower when you run them,
because it is your cwd that decides which beads database `bd` reads and therefore which tower gets counted.
Both print **one id on stdout and nothing else**; every failure writes to stderr, prints nothing on stdout,
and exits non-zero — so a failed run can never feed a half id into a `bd create` command line.

```bash
# cwd: the tower.  <factory> = the spider-factory checkout, your other working directory.
EPIC=$(<factory>/CLI/src/create-beads/create-gate.sh foobar)                    # foobar-epic-a7f3c9-0
FEAT=$(<factory>/CLI/src/create-beads/create-gate.sh foobar "$EPIC")            # foobar-feature-a7f3c9-1
SUITE=$(<factory>/CLI/src/create-beads/create-task.sh foobar "$FEAT" suite)     # foobar-task-a7f3c9-1.1
REVIEW=$(<factory>/CLI/src/create-beads/create-task.sh foobar "$FEAT" review)   # foobar-task-a7f3c9-1.2
TASK=$(<factory>/CLI/src/create-beads/create-task.sh foobar "$FEAT")            # foobar-task-a7f3c9-1.3
```

| Script | Takes | Prints |
|---|---|---|
| `create-gate.sh <repo>` | nothing above it | the epic gate of a new tower, with a uuid minted here |
| `create-gate.sh <repo> <epicGateId>` | the epic gate | the next feature gate under it, carrying that epic's uuid |
| `create-task.sh <repo> <gateId> suite` | any gate | that gate's `.1` — and refuses if it already exists |
| `create-task.sh <repo> <gateId> review` | any gate | that gate's `.2` — and refuses if it already exists |
| `create-task.sh <repo> <gateId> [task]` | any gate | the next free number above `.2` |

They create nothing — they are arithmetic, not writers, and the row is still made by `bd create --id`. They
check what you handed them and refuse the four ways a plan goes wrong: a repo that is not this database's
prefix, a gate that is not a row, a row that is not a gate, and a gate whose kind word is not `epic` when one
is required. A plain task's number is counted off the **ids already in the database**, not off the graph —
a ticket whose edge was never written still holds its number, and counting the graph would hand you its
collision. Never compute a number yourself, and never copy one from a sibling: run the script.

## The five row shapes, and nothing else is a row

Every ticket in a tower is one of these five, and each carries exactly what its column says — nothing more.

| Row | id from | `-t` | `-l` | `--metadata` | the `blocks` edges it gets |
|---|---|---|---|---|---|
| the epic gate | `create-gate.sh <repo>` | `gate` | **none** | `branch: epic/<slug>` | none at create — its tier's tickets block *it* |
| an epic-tier ticket | `create-task.sh <repo> <epic> suite\|review` | `task` | `epic-e2e-test` · `epic-review` | none | the epic gate |
| a feature gate | `create-gate.sh <repo> <epic>` | `gate` | **none** | `branch: feature/<slug>` | none at create — its tier's tickets block *it* |
| a feature's suite / review | `create-task.sh <repo> <feature> suite\|review` | `task` | `feature-test` · `feature-review` | none | the feature gate; the review also waits on its suite |
| a worker task | `create-task.sh <repo> <feature>` | `task` | exactly one of `backend-logic` · `frontend-ui` · `unit-tests` | none | the feature gate, and its one predecessor in the chain |

Two rows carry a label set and get none of it wrong only if the label is read from this table: **a gate never
carries a label** — a gate is a checkpoint and no worker is chosen for it — and **a ticket that is not a gate
always carries exactly one**, because zero or two leaves it claimed and unworked. Type and label and the id's
kind word are three separate facts: `-t` says gate or task, `-l` says which specialist, and the id's kind word
says which gate you belong to. Only the dispatcher's map binds a label to an agent, so never spell an agent
name out of a label.

## The command

```bash
bd create "Create formatCurrency function" \
  --id "$TASK" \
  -d "<the complete brief — everything the worker needs, inside the row itself>" \
  --acceptance "<the observable evidence that it is done>" \
  -t task -p 2 -l backend-logic \
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
| `--metadata '<json>'` | a JSON object of your own keys | `metadata` | `branch`, on a **gate** only, and nothing else — see §The metadata keys |

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
bd dep add "$gate" "$task" --type blocks      # the gate waits on this task — it is one of the gate's tier
bd dep add "$next" "$task" --type blocks      # and the next task waits on this one
```

**The second id is always the one that comes first**, the one that must be finished before the first may
start. Read an edge aloud as "`<first id>` waits on `<second id>`" before you run it. Wiring a tier the other
way round — `bd dep add "$task" "$gate"` — makes the gate block its own tier: nothing in the tier ever
reaches `bd ready`, the loop reports `tower_stalled`, and every command still exits `0`.

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
| `--id <id>` | explicit id instead of an assigned one | **every ticket in a tower needs one, and it comes from a generator** — `CLI/src/create-beads/create-gate.sh` or `create-task.sh`, never typed by hand. A flat id reaches no gate and the loop refuses it. Must match the database prefix or it errors; `--force` overrides |
| `--validate` | refuses when the description lacks the sections its type requires | `-t task` demands `## Acceptance Criteria` **in the description** |
| `--force` | create despite a prefix mismatch | almost never what you meant |

## The label

`-l` is not decoration — it is the entire dispatch decision. The dispatcher reads the labels off the row and keeps the ones the map names
and that alone names the specialist, so a ticket with **zero or two** is left claimed and logged
`ERROR reason=label-ambiguous`: work that silently never happens.

The dispatchable set is closed and the loop owns it (`CLI/src/beads-loop/index.sh`, the `AGENT` map):
`backend-logic` · `frontend-ui` · `unit-tests` · `feature-test` · `epic-e2e-test` ·
`feature-review` · `epic-review`. Anything the map does not name dispatches nothing, however
plausible it reads. Two things have no label because no label reaches them: **a gate** (the loop dispatches
a ready gate to the `lead` agent by its type and its tier's flag, never by a label — and a gate carrying a
label is a checkpoint pretending to be work), and **the human**, who has no agent and is never spawned.

## The metadata keys

Two keys exist in this system, and a plan agent writes one of them.

| Key | Who writes it | What it is | On |
|---|---|---|---|
| `branch` | the plan agent that owns the tier | that gate's own branch — the worktree the loop enters (creating it only for the tier's first ticket), the commit's branch, the pull request's head | **gates only** — the epic gate and each feature gate, each carrying its own and nobody else's |
| `pr` | the loop, then the Stop hook | the url of the pull request that exists on that branch | **never written by a plan agent**: it is a url of something that does not exist yet |

Everything else about a ticket's git world is **derived**, from the one thing that cannot drift — its id:

- **Where the work lands** — the branch of the gate its id names. A task works on its feature gate's branch;
  an epic-tier ticket, and the epic gate itself, on the epic gate's own.
- **What its pull request aims at** — `main` when that owner is the epic gate, otherwise the epic gate's
  `branch`. The loop calls this value `prTarget`, and nothing on a ticket ever says it.
- **Which tier a gate is** — the kind word of its own id, `epic` or `feature`. Read off the string; no graph
  is walked and no key says it. The graph says only which tickets are *in* the tier — the ones that block it.

```bash
bd create "Feature: checkout flow" \
  --id "$FEAT" \
  -t gate \
  -d "<the whole feature brief>" --acceptance "<how the closer knows it is done>" \
  --metadata '{"branch":"feature/checkout-flow"}' \
  --silent
```

Rules that keep the model true:

- **Format:** `epic/<slug>` or `feature/<slug>` — a lowercase slug of two or three words saying what the thing
  *is*, single dashes between them. Never a ticket id, never an appended number: a sibling whose slug
  collides gets **different words**, not `checkout-flow-2`, because a number is a name nobody can read
  back six weeks later.
- **One `branch` per gate, written once, never copied.** A task, a suite, a review carries no branch
  metadata at all. Copying a gate's branch down its tier writes the same fact N+1 times, and the copies are
  the ones that go stale when the gate is renamed — silently, because the loop reads whichever it was told
  to read and nothing compares them.
- **Metadata is the carrier for what is left.** Verified against the binary: `metadata` comes back as one
  JSON object under `bd show --json` AND is present in the `bd ready --claim --json` payload, so the loop
  reads `.metadata.branch` exactly — no second query, no parsing a stray colon can break. `notes` is prose
  and nothing else; `external_ref` round-trips through `bd show` but is **absent** from the claim payload.
  A branch name anywhere else is a fact the loop cannot see.
- **A gate with no `branch` is unworkable**, and the loop says so rather than guessing: `waiting
  gate_unworkable gate=<id> step=owner-carries-no-branch` for the ready gate, `ERROR reason=gate-unworkable
  ticket=<id>` for anything claimed under it. A ticket whose id reaches no gate is refused outright —
  `ERROR reason=no-epic-gate ticket=<id>` — and stays claimed until a human puts it in a tower. A ticket
  with no `pr` is normal: that key appears only once a pull request exists.

Read the keys back with the rest of the row, exactly as written, at creation. To fix one after the fact:
`bd update <id> --set-metadata branch=feature/checkout-flow`. Verified: `--set-metadata` **merges** — the
keys already on the ticket survive, which is how the hook can add `pr` to a ticket without disturbing the
`branch` the plan wrote.

## Gates are a type, not a label

An epic or a feature is `-t gate`: a **custom** type, registered once per database with
`bd config set types.custom "gate"` and checkable with `bd types`. Three verified consequences:

- `bd create -t gate` **does not refuse** an unregistered type — it accepts it and hides it, so a broken
  gate and a working gate look identical. Register it first, check `bd types`, then create.
- **A gate carries no label at all**, and carries `branch` in its metadata. Labels are how a worker gets
  chosen; a gate is a checkpoint and no worker is chosen for it. Which tier it is comes from the kind word of
  its own id.
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
bd show --json "$TASK" | jq '.[-1] | {issue_type, labels: (.labels // []), acceptance_criteria, metadata}'
bd show --json "$TASK" | jq '.[-1].dependencies'    # the edges you wrote, with dependency_type
```

Three things that bite: `bd show --json` returns a **JSON array**, so a bare `.labels` fails — index
`.[-1]` (or `.[0]`); `labels` can be JSON `null` rather than `[]`, so default it; and a wrong key returns
`null` **without erroring**, which is how a broken write survives a whole session. `-t gate` rows are
expected to show zero labels and a `branch` — that is the pass condition, not a failure. Every row is read
back and **its id must be the exact string the generator printed**; a flat id, a uuid that differs from its
tower's, or a number nobody ran means the row was written by hand, and the loop will refuse it.

**One edge per pair, and a second add is swallowed without a word.** Verified: beads keeps a single edge
between any two issues whatever its type, so an edge of another type already on the pair eats your
`blocks` add and reports success. Read `.dependencies` back after wiring, not just before — an edge that
isn't there is a ticket that belongs to no tier and blocks nothing.

## Not this command

`bd create` makes rows. It does not order them beyond the edges you pass at create (real ordering is
`bd dep add <blocked> <blocker> --type blocks`), and it does not claim, unclaim, close or heartbeat —
`bd ready --claim` and `bd unclaim` belong to `CLI/src/beads-loop/claim.sh` and the
operator alone. A creator's job is finished when the rows exist, carry their keys, and read back right.
