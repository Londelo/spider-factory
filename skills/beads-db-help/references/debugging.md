# A tower that is not moving

Everything above §"The reaper" is a **read**, so all of it is safe for an agent to run. If it is
*your own* ticket that is stuck, comment on it and let the lease expire — do not go near the
recovery commands.

## Diagnose in this order

Cheapest first, each step ruling something out. `bd where` goes first because every answer below is
only as good as the database you are actually asking — bd resolves its DB by walking **up** from
`$PWD` and **ignores `BEADS_DIR`**.

```bash
bd where
bd status                                              # open / in-progress / blocked / closed / ready
bd ready --explain                                     # per-ticket: why ready, why held — the honest answer
bd blocked                                             # dependency-blocked work, blocker named
bd list --include-gates --json | jq -r '.[] | select(.issue_type=="gate") | "\(.id)  \(.title)  \(.status)"'
bd label list-all                                      # stamps as they actually exist
claude agents --json                                   # which background sessions are genuinely alive
tail -n 50 ~/.binary-obelisk/logs/*/errors             # the alarm — never rate-limited
tail -n 50 ~/.binary-obelisk/logs/*/waiting           # frontier_empty / max_parallel / max_parallel_stalled
```

## Symptom → cause

| Symptom | Look at | Almost always |
|---|---|---|
| `bd ready` is empty but tickets are open | `bd ready --explain`, `bd dep tree <id> --direction=up` | An upstream `blocks` edge nobody closed, or an unclosed gate |
| Nothing looks ready and workers are all full | `claude agents --json`, `bd list --status in_progress --json` | `max_parallel_stalled` — ghost slots. That line is the alarm, not a calm tower |
| A ticket is stuck `in_progress` forever | `bd stale`, then `bd reclaim --older-than 10m` (**operator**) | A dead worker stopped heartbeating; its lease lapsed and nothing reaped it |
| The loop logs `stamp-ambiguous` | `bd show --json <id>` → `labels` | 0 or 2 matching labels. It stays claimed **on purpose** — fix the ticket; restarting the loop does nothing |
| A ticket never dispatches | `labels` is empty, or holds a *category* (`unit-test`, `frontend-ux`) | The creator never stamped it, or stamped a category |
| The epic/feature "vanished" | `bd list -t gate`, `bd list --include-gates`, `bd query "type=gate"` | Custom types are hidden from default queries — it is not gone, it is hidden |
| Your `jq` returns `null` for something you set | `bd show --json <id> --long` | Wrong key, or the field is only present when non-empty — see [`json-and-jq.md`](./json-and-jq.md) |

## A calm tower and a broken one look identical

This is the section that decides whether you leave the loop alone.

- `frontier_empty` in `waiting` **is normal**. Open gates and unfinished upstreams hold work off the
  frontier; the loop does not log it as an error, and neither should you.
- `max_parallel` is also normal — capacity full with something genuinely `in_progress`.
- `max_parallel_stalled` is **not** normal: capacity full, nothing `in_progress`. Those are ghost
  slots — claimed tickets with no live session behind them, which is precisely what an agent that
  claimed for itself produces. The tower looks quiet and is doing nothing.

`stamp-ambiguous` tickets are left claimed deliberately: the five-minute lease parks the broken ticket
off the frontier so the error keeps repeating until a human fixes the ticket. A repeating
`stamp-ambiguous` is therefore the alarm *working*. Fix the labels — `bd update <id> --add-label …`,
`bd label remove <id> …`, `bd label list <id>` to confirm — and never restart the loop or edit the
script to make an unstamped ticket disappear.

When the read disagrees with what you expect, suspect the database before the loop: `bd where` that
you are in the DB you think you are, then re-read the ticket with `bd show --json --long <id>`.
A freshly created ticket has been observed absent from the immediately following `bd list --json`
while `bd status` already counted it — re-read before concluding a write failed.

## The reaper — operator only

```bash
bd stale                          # in_progress issues not updated recently
bd reclaim                        # revert expired leases (default grace = 2× the lease TTL)
bd reclaim --older-than 10m       # narrower grace window past expiry
bd reclaim --label lane-a --assignee worker-7 --id <id>    # scope it
bd unclaim <id> --if-assignee worker-7    # atomic compare-and-swap release; exits nonzero on mismatch
```

Run `bd reclaim` from a supervisor on a timer at roughly 2× the claim TTL — the lease is 300s from
`started_at`. `--force` on `unclaim` releases someone else's claim: coordinate first, because their
claim can be live on an issue that looks idle.

An agent's entire response to a stuck own-ticket is:

```bash
bd comment <id> "exactly what remains, and what you found"
```

then let the lease expire. Releasing claims and reaping stale leases are supervisor jobs.
