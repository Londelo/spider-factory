---
name: bead-heartbeat
description: >
  Keeps your claimed ticket alive while you work it: the claim is a five-minute lease, so run
  `bd heartbeat <ticket>` between long steps; plus the worker's other obligations — never close
  your own ticket, write what remains on it, spawn nothing, stay in the folder you were given,
  and touch `$BO_DONE_FILE` last and only when truly done. Load it the moment you are spawned on
  a ticket.
---

## Keep the ticket alive

You and your ticket are one and the same. The claim is a **five-minute lease**, and only you can
renew it:

```bash
bd heartbeat <ticket>
```

Run it **between long steps** — before anything that will run for minutes, and never let five
minutes pass in silence. A lapsed lease is read as death: a reaper (`bd reclaim`) takes the ticket
back to ready and another worker gets it mid-work, your half-done branch behind them.

## The rest of the contract

1. **Never close your ticket** — whatever the outcome. State your proof of work in your final
   message; a human verifies and closes. A ticket you close yourself closes unverified.
2. **Write what remains** — if the brief outruns you, put a comment on the ticket saying exactly
   what is left. Never half-do and hide it.
3. **Spawn nothing.** Work nothing but this ticket.
4. **Stay on your branch, in this folder** — never branch, check out, merge, rebase, push, or
   commit; the Stop hook files your one commit when you stop.
5. **Declare it only when it is truly done** — as your very last action, and only when you would
   hand the brief to a human as it stands, `touch $BO_DONE_FILE`. No marker means nothing is
   committed: the ticket stays claimed and the tasks behind yours wait.

## What each role bends

- **Tester tiers** — rule 1: the tier's own evidence (test, spec, or journey) goes in your final
  message; rule 2: say what remains in the tier's terms (branches, seams, journeys unwalked);
  rule 3: a gap in another tier is that tier's ticket, report it, don't fix it; rule 5: a TDD
  ticket whose tests fail first is a complete brief. e2e adds to rule 4: the epic branch was
  assembled for you; do not rewrite it.
- **Review** — rule 1: never close whatever you found; rule 2: name exactly which question went
  undone and why — never post a partial review as a whole one; rule 3: a defect is a comment,
  never a ticket; rule 5: strip the instrumentation first, and leave no marker unless every
  question is answered and the findings posted.
- **Merge** — rule 4 has one granted exception, given by the dispatch prompt itself: this ticket's
  work IS the merge — bring each branch named in your brief in with `git merge`, resolving what
  collides. Still never create a branch, check out, rebase, push, or commit: the merge lives in the
  working tree and becomes one commit when you stop. Rules 1, 2, 3 and 5 apply whole.
