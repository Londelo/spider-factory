---
name: bead-never-close
description: >
  Why you never close your own ticket, whatever the outcome. The Stop hook that fires when your turn
  ends is the only thing that closes a task — it commits, pushes, opens the branch's pull request and
  then closes the ticket. Close it yourself with `bd close` and that hook walks past a ticket it already
  sees closed: nothing commits, nothing pushes, no pull request opens, and your work never lands while
  the ticket reads done. So you keep your lease, you state your proof of work in your final message and
  in a comment on the ticket, and you stop with it still open. Use it whenever you are about to run
  `bd close`, whenever you think you are finished, whenever the work failed and you want to bail, and
  whenever a ticket you are holding already reads closed.
  Trigger: "bd close", "close the ticket", "close my ticket", "I am done", "mark it done", "close it
  myself", "ticket already closed".
---

# Never close your own ticket

**Never run `bd close` on the ticket you are working. Whatever the outcome — done, half done, broken,
blocked — you do not close it.**

Something else closes it. When your turn ends, a Stop hook runs: it commits what you left, pushes the
branch, opens or updates the branch's pull request, and only then closes the ticket. That hook is the
only thing that ever closes a task.

Close it yourself and the hook sees a ticket already closed and leaves at once — before the commit,
before the push, before the pull request. Your work sits uncommitted in a worktree, the ticket reads
done, and nothing tells you.

What you do instead:

- finish the work, then stop — stopping is what finishes the ticket
- keep your lease while you work (`bead-lease`)
- put your proof of work in your final message and in a comment on the ticket (`bead-comment`): what
  you did, and the test evidence that proves it

If the ticket you are holding already reads closed, stop and say so. Do not reopen it, and do not work
it further.
