---
name: beads-db-help
description: >
  Exact `bd` commands to read a ticket, hold its lease, stamp it and prove the stamp survived, wire
  dependencies, close it, and debug a tower that is not moving. Use before running ANY `bd` command,
  and whenever a ticket, stamp, gate, frontier, lease or heartbeat is involved — a wrong flag here
  often does not error, it silently stores the wrong thing and the tower dispatches nothing. Absolute,
  overriding anything remembered from elsewhere: an agent NEVER claims — `ready --claim`,
  `update --claim`, `unclaim`, `reclaim` belong to scripts/beads-loop.sh and the operator alone.
version: 0.1.0
---

# The beads database

The database is the only thing that is real: the `description`, the single stamp label and the
dependency edges are the entire state of a ticket — nothing else is read at runtime. **A closed ticket
is the only proof of work anyone will ever read**: nobody polls a worker and nobody reads stdout, so
write the evidence into the ticket or your work does not exist. Verified against `bd` 1.3.0 by running
it; where this skill and `scripts/beads-loop.sh` disagree on the stamp set, the script's `AGENT` map
wins — it is the only source of specialists in existence.

## First three commands, every time

```bash
bd where                 # which DB am I actually talking to?
bd status                # totals: open / in-progress / blocked / ready
bd show --json <id>      # the brief — read it IN FULL before touching code
```

bd walks **up** from `$PWD` and ignores your `BEADS_DIR`: one `cd` in a worktree is enough to be
editing tickets in the wrong database, quietly.

## 1. `bd create` takes ONE positional — the title; everything else is a flag

```bash
bd create "Task title" -d "the full description" \
  --design "notes" --acceptance "AC one; AC two" \
  -t task -p 2 -l backend-logic --deps "parent-child:<parent-id>" --silent
```

A second positional errors `accepts at most 1 arg(s), received 2` — loud, so the error is the teacher.
`--silent` prints only the id; use it whenever a script captures one, because human output is not a
contract. Every write flag and its read key: [references/json-and-jq.md](./references/json-and-jq.md).

## 2. The stamp is the whole dispatch decision — and it must round-trip

Exactly **one** stamp per ticket, written with `-l` at create time; the dispatcher reads its agent off
that one label. The seven valid stamps:

`backend-logic` · `frontend-ui` · `unit-tests` · `feature-test` · `epic-e2e-test` · `feature-lead-review` · `epic-lead-review`

Zero or two matches is never guessed at: the ticket stays claimed and the loop logs `ERROR
reason=stamp-ambiguous`. An unstamped ticket is not slightly degraded, it is unworkable. **Never trust
a write you have not read back** — per ticket, immediately, not batched to the end: `bd show --json
<new-id>` must show exactly one label from the closed set, or you wrote an unworkable ticket.

Three traps, all real, all silent:

- **A child inherits its parent's labels.** Verified: a child under a gate labelled `gate-stamp` comes
  back `["gate-stamp","unit-tests"]` → two stamps → `stamp-ambiguous` → a dead ticket. Hence **gates
  carry no label at all**; if a parent somehow does, pass `--no-inherit-labels`.
- **A stamp is not a category, and not a `tag:`.** `frontend-ux`, `unit-test`, `e2e-test`, `review`,
  `merge` are *categories* — display hints and template names. `unit-tests` is a stamp and `unit-test`
  is a dead end wearing a label; tags dispatch nothing at all. The three test tiers are the exception
  worth knowing: there the stamp and the category are deliberately the **same** string
  (`unit-tests` / `feature-test` / `epic-e2e-test`), so spelling can't save you — draw the label from
  the loop's `AGENT` map and you cannot be wrong.
- **The JSON keys are `issue_type`, `owner`, `acceptance_criteria`.** `.type`, `.assignee` and
  `.acceptance` return `null` **without erroring**, so a script keeps reading a field that was never
  there. `labels` can be JSON `null`, not `[]`: always `.labels // []`.

## 3. Agents never claim. The loop claims.

**`bd ready --claim` belongs to `scripts/beads-loop.sh` and to nothing else** — nor `bd update <id>
--claim`, nor `bd unclaim`, nor `bd reclaim`. Not to a worker, not to a plan agent, not to you because
the frontier looked inviting. The claim is what binds ticket → worker → worktree into one unit;
claiming behind the loop's back breaks all three at once — a seized live lease, work routed past the
stamp that named another specialist, or a claimed ticket with no session and no worktree behind it.
That last shape *is* the `max_parallel_stalled` alarm: slots full, nothing really working, a tower that
looks calm and is not.

**Your ticket arrived already claimed — you were spawned *because* the loop claimed it.** Your whole
surface is these ([command-map §5a](./references/command-map.md)):

```bash
bd show --json <id>                          # the brief — read it IN FULL before touching code
bd heartbeat <id>                            # between long steps; the lease must never lapse
bd close <id> --reason "<what you did + the test evidence that proves it>"
bd comment <id> "exactly what remains"       # when the brief is bigger than you can finish
```

The lease is exactly **five minutes** (`started_at` + 300s = `lease_expires_at`, verified) and a lapsed
lease lets another dispatcher seize your ticket mid-work. Heartbeat writes no commit and no history, so
run it freely between long steps rather than racing the clock; only the current owner may, and **a
heartbeat that fails is the database telling you your ticket is gone** — stop rather than retry into the
void. When the brief is wrong or bigger than you: **comment, do not release** — `bd comment` posts to
the comment thread, `bd note` appends to the notes field, and instructions for whoever comes next mean a
comment. Releasing claims and reaping stale leases are supervisor jobs. Spawn nothing: you and your
ticket are one and the same.

## 4. `parent-child` organises; only `blocks` holds work back

```bash
bd dep add <blocked> <blocker> --type blocks   # keeps <blocked> off the frontier until <blocker> closes
bd dep tree <id> --direction=up                # what this issue is holding
bd ready --explain                             # WHY an issue is ready or blocked — the honest answer
```

Verified, and it surprises people: **a `parent-child` edge does not block anything** — a child of an
open gate sits on the ready frontier like any other ticket. `bd ready --explain` is the only honest way
to see what holds work back (`← blocked by bo-probe-cek: G2-block [open]`). `blocks` is the default type
for `bd dep add`, which is why the edge that keeps the tower honest is also the easy one to forget — and
why forgetting `--type parent-child` silently turns a hierarchy edge into a gate.

The `--deps` grammar is `type:id`, so **`--deps "parent-child:<parent-id>"`**. The form
`--deps type:parent-child:<id>` is rejected (`unknown dependency type "type"`); if you see it anywhere in
this plugin it is wrong, and `--parent <id>` is the unambiguous alternative. Full type list:
[command-map §6](./references/command-map.md).

## 5. Gates are a custom *type*, and the type is what hides them

Epic and feature nodes are `-t gate`, and `gate` is not a built-in — register it before creating gates:
`bd config set types.custom "gate"`.

- **Never use a built-in (`epic`, `story`, `bug`, `feature`) for a gate node.** Built-ins appear in
  `bd ready` and become claimable work. **A gate a worker can claim is a model bug**; custom `gate` is
  what makes gates structurally unclaimable.
- **A gate carries no label at all** — see the inheritance trap in §2.
- **`bd create -t gate` does not refuse an unregistered type** — it accepts it, then hides it. A silent
  divergence, not a guard rail.

Gates are absent from every default query (`list`, `ready`, `--json`) — that is the mechanism, not a
bug, and the reason the loop never dispatches one; an epic that "isn't there" is `bd list
--include-gates` away. Keep the loop's `--exclude-type gate` as belt-and-braces over an
already-invisible type. `bd gate` is bd's unrelated async-wait machinery; our gates are ordinary issues
of a custom type that a human closes with `bd close`
([command-map §4](./references/command-map.md)).

## When the tower is not moving

Every command below is a read, so all are safe for an agent. If it is *your own* ticket that is stuck,
comment on it and let the lease expire — `bd stale` and `bd reclaim` are the operator's reaper.

| Symptom | Run | Almost always |
|---|---|---|
| `bd ready` empty, tickets open | `bd ready --explain` | an upstream `blocks` edge, or an unclosed gate |
| Nothing ready, workers all full | `claude agents --json` | `max_parallel_stalled` — ghost slots; the alarm, not a calm tower |
| `stamp-ambiguous` in the log | `bd show --json <id>` → `labels` | 0 or 2 stamps, left claimed on purpose: **fix the ticket, do not restart the loop** |
| A ticket never dispatches | `labels` empty, or holding a *category* | the creator did not stamp, or stamped a category |
| The epic/feature "vanished" | `bd list -t gate` | custom types are hidden from default queries |
| `jq` returns `null` for a field you set | `bd show --json <id> --long` | wrong key, or the field is omitted when empty |

Diagnosis order, the calm-vs-broken test, the reaper: [references/debugging.md](./references/debugging.md).

## House rules

- Inside the loop: **always `bd ready --claim`, never a bare `bd ready`** — bare is not atomic, so two
  loops take the same ticket; it is legal only as a non-binding peek to name what is next.
- **`bd update` flags over `bd edit`**, which opens an interactive editor and hangs an unattended agent;
  **`--json` for anything parsed**; and never send `bd` output to `/dev/null` — a failure you cannot read
  is a failure that never happened.
- **Release order, bottom-up:** base tasks → feature tasks → the human closes the feature gate → epic
  tasks → the human closes the epic gate → thumbs-up on the merged epic PR. The human closes the gates;
  there is no human agent, and a claimable ticket assigned to a human is a model bug.
- **A re-check is not a new ticket.** Where a task carries `respawn-agent: true`, a fresh session of the
  same agent re-checks the work before the ticket may close — a step *inside* this one ticket. One
  ticket, one worker; never create a second ticket to hold the review.
- The loop never merges: `feature-merge-pr` / `epic-merge-pr` are excluded **at the claim**, not filtered
  after it — that ordering is what makes it true rather than merely intended.
