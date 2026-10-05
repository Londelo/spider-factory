---
name: create-bead
description: >
  How to form a bead (beads `bd` ticket) and write it so the dispatcher can actually work it — the
  ticket anatomy per tier (epic, feature, worker task), the one-stamp rule, gates vs tasks, the
  parent-child vs blocks edges, and the read-back that proves the ticket exists as you meant it.
  Use it whenever you are CREATING tickets: plan-epic, plan-feature, plan-task, any "make me a
  ticket/epic/feature" request, or a tower that came out with no stamps, two stamps, or no merge
  ticket. Use it when nothing has been claimed yet: this is for the author who has nothing, while a
  worker already holding a claimed ticket reads `read-bead`.
version: 0.1.0
---

# Creating a bead

## You are working in a beads system

**Beads** is the issue tracker this whole toolkit runs on: a local database per repository, driven by
the `bd` command-line tool, where every unit of work is a real issue row — an id (`bd-42`), a title, a
description, acceptance criteria, a priority, a type, labels, a status (`open` → `in_progress` →
`closed`, with `blocked`/`deferred` off the frontier) and an owner. It is not a scratchpad and not a
markdown file: the database *is* the plan, and it is the only thing anything reads at runtime. No plan
document, no stdout, no chat summary survives the handoff — **a closed ticket is the only proof of work
anyone will ever see.**

Three shapes hold it together, and every command in this skill is about one of them:

| Shape | What it is | How you set it |
|---|---|---|
| **the tower** | epic → feature → worker task, the hierarchy | `parent-child` edges (`--parent`) |
| **the ordering** | what may not start yet | `blocks` edges (`bd dep add`) |
| **the frontier** | every ticket whose blockers are all closed | what `bd ready` lists; the loop claims from it |

Ground yourself before you write anything: `bd where` says which database you are actually talking to —
it resolves by walking **up** from `$PWD` and ignores `BEADS_DIR`, so one stray `cd` has you authoring
into somebody else's tower — and `bd status` gives the open/blocked/ready totals. What is written here
was verified against `bd` 1.3.0 by running it; when a flag is unfamiliar, check
`bd <command> --help` rather than remembering one, and the read side lives in `skills/read-bead`.

A bead is not a note about work; it is the unit the dispatcher consumes. `scripts/beads-loop.sh` reads
exactly three things off every ticket — the description, the single stamp label, and the dependency
edges — and spawns a worker from them alone. Nobody reads a plan agent's prose, a summary, or a chat
message. So the ticket *is* the deliverable, and a ticket that is unstamped, double-stamped, or wired
with the wrong edge kind is work that never happens, discovered only as a silent, calm, empty frontier.

**Schema here, framework there.** This skill and its [references/ticket-schema.md](./references/ticket-schema.md)
own *what a ticket must contain* — the field list, per tier, independent of any tracker. The `bd` read
surface lives in `skills/read-bead`; holding a claimed ticket open and closing it are commands that
arrive with the ticket itself, and an unfamiliar write flag is settled by `bd <command> --help`. Where the two disagree about what a stamp is, the loop's `AGENT` map wins: it is the
only source of specialists in existence, and a label it does not name dispatches nothing.

## The four things that make a ticket real

1. **A description an agent can execute with no other context.** The worker is spawned into a worktree
   knowing only its id. Anything you knew and did not write down, it does not know.
2. **Exactly one stamp**, from the closed set, written at create time and read back. A stamp is what
   names the agent; a ticket with zero or two is left claimed and logged `ERROR reason=stamp-ambiguous`.
   Stamps: `backend-logic` · `frontend-ui` · `unit-tests` · `feature-test` ·
   `epic-e2e-test` · `feature-lead-review` · `epic-lead-review`, plus `feature-merge-pr` and
   `epic-merge-pr` for the two tickets the loop deliberately never dispatches.
3. **A parent**, so the tower has a shape: `--parent <id>` or `--deps "parent-child:<id>"`. Note the
   grammar is `type:id` — `--deps type:parent-child:<id>` is rejected outright.
4. **`blocks` edges for anything that must wait.** A `parent-child` edge is bookkeeping and holds
   nothing back — verified, a child of an open gate sits on the ready frontier immediately. Ordering is
   real only where someone wrote `bd dep add <blocked> <blocker> --type blocks`.

## Gates are a type, not a stamp

Epics and features are `-t gate`: a custom type, registered once with
`bd config set types.custom "gate"` and checkable with `bd types`. `bd create -t gate` will *not* refuse
an unregistered type — it accepts it and hides it, so a broken gate and a working gate look identical.

- **Never** put a gate on a built-in type (`epic`, `feature`, `story`, `bug`): built-ins show up in
  `bd ready` and become claimable work, and a gate a worker can claim is a model bug.
- **A gate carries no label at all.** Labels are inherited by children: a gate labelled anything lands
  that label on every task below it, which turns one stamp into two and kills the ticket at dispatch.
  If a parent might carry one, pass `--no-inherit-labels`.
- Gates are invisible to default queries. Surveying them takes `bd list -t gate` (or `--include-gates`);
  `bd list` alone will convince you your epic vanished.

## Who creates what

Each plan agent owns one ticket type, and the structural tickets hang with the gate they complete:

| Agent | Creates | Never creates |
|---|---|---|
| `plan-epic` | the epic gate, then `epic-e2e-test`, `epic-lead-review`, `epic-merge-pr` under it | features, worker tasks |
| `plan-feature` | each feature gate, then `feature-test`, `feature-lead-review`, `feature-merge-pr` under **every** feature | epic-tier tickets (it links one), worker tasks |
| `plan-task` | `backend-logic`, `frontend-ui`, `unit-tests` under one feature | gates, epic/feature-tier test tickets, reviews, merges |

Two tickets that nobody creates is a tower that builds and never ships: no review ticket means no
reviewer is ever dispatched, no merge ticket means no PR is ever merged, and the gate can never close.
Create the whole subtree of the gate you are holding, every time.

## You own the edges you can see

`blocks` edges are not the dispatcher's job and not a later cleanup — the agent that knows both ticket
ids is the only agent that can ever write the edge, and if it doesn't, the edge never exists.

- `plan-epic` wires `epic-e2e-test → epic-lead-review → epic-merge-pr` (all three are its own).
- `plan-feature` wires `feature-test → feature-lead-review → feature-merge-pr` for each
  feature, and holds the epic's e2e ticket back until that feature ships:
  `bd dep add <epic-e2e-test> <feature-merge-pr> --type blocks`.
- `plan-task` wires its workers up into the tickets `plan-feature` already made: `unit-tests` blocked by
  `backend-logic` and `frontend-ui`; `feature-test` blocked by both as well;
  `feature-lead-review` blocked by both test tickets.

Order that must be true at the frontier: implementation before its tests, tests before review, review
before merge, merges before the gate closes.

## Write it, then prove it

```bash
bd create "Task title" -d "<the full brief>" --acceptance "<done criteria>" \
  -t task -p 2 -l backend-logic --parent <feature-id> --silent

bd show --json <the-new-id>      # immediately, this ticket, before creating the next one
```

- One positional only — the title. Everything else is a flag; a second positional errors loudly.
- `--silent` prints just the id; capture it, you need it for the read-back and for edges.
- Read-back expectations: exactly one label drawn from the closed set, the right `issue_type`
  (`task` or `gate`), and a description that stands alone. The JSON keys are `issue_type`, `owner`,
  `acceptance_criteria`, and `labels` may be `null` — use `.labels // []`. Wrong keys return `null`
  **without erroring**, which is how a broken write survives an entire session.
- **Never batch the read-back to the end.** A stamp you have not verified is a stamp you did not write.
- `-t gate` tickets are expected to show zero labels; that is the pass condition, not a failure.

## You do not claim

`bd ready --claim`, `bd update <id> --claim`, `unclaim`, `reclaim`, `bd close` on someone else's ticket
— all belong to the loop and the operator. A plan agent's work is finished the moment its tickets exist
and read back right. Claiming behind the loop's back seizes a live lease or parks a ticket with no
worker and no worktree behind it, which surfaces later as `max_parallel_stalled`: slots full, nothing
running, tower looks calm and is not.

## Before you finish

Run the definition-of-ready check in [references/ticket-schema.md](./references/ticket-schema.md) over
every ticket you wrote, and report what you created by id, with its stamp, its parent, and its blockers
named. If you could not satisfy the check on some ticket, say so out loud rather than closing the
report with a ✅ — an honest `ERROR reason=…` line is a fixable state, and a ✅ over a dead ticket is a
lie that costs an afternoon to find.
