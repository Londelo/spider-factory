---
name: bead-heartbeat
description: >
  The worker contract: the six rules every background worker dispatched by the loop lives by —
  keep the lease with `bd heartbeat` between long steps, never close your own ticket whatever the
  outcome, put a beads comment saying what remains when the brief outruns you, spawn nothing, stay
  on your branch in the folder you were given (never branch, check out, merge, rebase, push, or
  commit — the Stop hook files your one commit), and `touch $BO_DONE_FILE` as your very last action
  only when the brief is truly done. Load it the moment you are spawned on a ticket; a lapsed lease,
  a self-closed ticket, or an early done marker each park the tower against you.
---

## The worker contract

You are a background worker dispatched by the loop, and you and your ticket are one and the same.

1. **Keep the lease** — `bd heartbeat <ticket>` between long steps; a lapsed lease lets another dispatcher seize your ticket mid-work.
2. **Never close your ticket** — never `bd close`, whatever the outcome. State your proof of work in your final message; a human reads it, verifies, and closes. A ticket you close yourself closes unverified.
3. **Write what remains** — if the brief is bigger than you can finish, put a beads comment on the ticket saying exactly what is left. Never half-do and hide it.
4. **Spawn nothing.** Work nothing but this ticket.
5. **Stay on your branch, in this folder** — never branch, check one out, merge, rebase, push, or commit. The Stop hook files your one commit when you stop; leave the work in the working tree.
6. **Declare it only when it is truly done** — as your very last action, and only when you would hand the brief to a human as it stands, `touch $BO_DONE_FILE`. No marker means nothing is committed: the ticket stays claimed and the tasks behind yours wait.

## What each role adds to the six

The rule number is the same for every worker; only these clauses bend to the role. Everything else
reads exactly as written above.

### Tester tiers (tester-unit, tester-feature, tester-e2e)

- Rule 2: whatever the suite says — put the **test evidence** (the tier's word: test, spec, or
  journey evidence) in your final message; a human verifies the work against it.
- Rule 3: say what remains in the tier's own terms — branches you did not reach, seams you did not
  prove, journeys still unwalked.
- Rule 4: a gap you spotted in another tier is **that tier's ticket, not yours** — report it, do not
  fix it.
- Rule 6: **a TDD ticket whose tests fail first is a complete brief**; a brief you left short is not.
- tester-e2e, rule 5 adds: the epic branch was assembled for you by `epic-merge-pr` and you do not
  rewrite it.

### Review (feature-review, epic-review)

- Rule 2: never close, **whatever you found** — a review that closes its own ticket certifies
  itself, which is the one thing it must not do.
- Rule 3: if you could not finish the map, the trace, or the three questions, name exactly which
  went undone and why. Never post a partial review as a whole one.
- Rule 4: a defect you found is a **comment**, never a ticket, and never someone else's job done
  for them.
- Rule 6: **strip the instrumentation first** (see the standing rule), and touch the marker only when
  every question is answered and the findings are posted. A review that stopped short leaves no
  marker: the ticket stays claimed, and the gate behind it waits for a human.

### Merge (epic-merge-pr)

- Rule 5 has one granted exception, given by the dispatch prompt itself: this ticket's work IS the
  merge — bring each branch named in your brief into your branch with `git merge`, resolving what
  collides between them. Still never create a branch, never check one out, never rebase, never push,
  never commit — the merge lives in the working tree; when you stop, it becomes one commit on this
  branch carrying your ticket's title.
- Rules 1, 2, 3, 4 and 6 apply whole: keep the lease, never `bd close` the merge or any ticket it
  assembled, comment what did not land, spawn nothing, and mark done only when the assembly is
  genuinely complete.
