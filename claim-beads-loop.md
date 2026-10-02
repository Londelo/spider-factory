# Claim Beads Loop

The dispatcher: `scripts/beads-loop.sh`. It claims tickets and launches workers. It does no
thinking of its own, and it reads nothing but the beads database — not this file, not the
design YAML. Where code and spec disagree, fix whichever is wrong.

The tower itself is described in [`.claude/binary-obelisk-v1-design.yaml`](./.claude/binary-obelisk-v1-design.yaml).

## 1. What it does

Every tick:

1. **Claim** — `bd ready --claim --json` takes one unblocked ticket atomically (assignee +
   `in_progress` + a ~5-minute lease).
2. **Check the stamp** — exactly one label from the closed set must match, and it names the
   agent. Zero or two means the tower was built wrong: log an error, never guess.
3. **Spawn** — `claude --bg -w <ticket> --agent <agent> --permission-mode bypassPermissions`,
   which puts the worker in its own git worktree. Spawn and forget.
4. **Log** — one line, into one of four files.

Then back to step 1. It never stops for an empty frontier and never counts tickets: it runs
until you Ctrl-C it, at which point it logs the tally.

## 2. Config

| Env | Default | Meaning |
|---|---|---|
| `BO_MAX_PARALLEL` | 4 | workers spawned at once — gates spawning, never the loop |
| `BO_POLL_S` | 3 | seconds between polls; must divide 60 (the idle rate limit divides by it) |
| `BO_MAX_TICKS` | 0 | stop after N ticks — **test seam only**, so a smoke run can finish |
| `BO_LOG_ROOT` | `~/.binary-obelisk/logs` | one timestamped directory per run |
| `BO_ALLOWED_STAMPS` | unset | comma list that replaces the stamp set |

Nothing else is configurable. The claimer is whoever runs the script — `bd` gives no way to set
an identity, and `ready --claim` overwrites `assignee`.

## 3. Stamps — the label is the dispatch key

Every claimable task is created with **exactly one** label naming its node, and that label alone:

```bash
bd create "Title" "desc" -t task -l backend-logic --deps type:parent-child:<feature>
```

The closed set is the keys of the script's `AGENT` map, so the gate, the lookup and the spawn
flag can never drift apart:

| Stamp | Agent |
|---|---|
| `backend-logic` | `engineer` |
| `frontend-ui` | `frontend` |
| `unit-tests` | `jester` |
| `feature-playwright-tests` | `playwrite` |
| `epic-e2e-tests` | `playwrite` |
| `feature-lead-review` | `lead-review` |
| `epic-lead-review` | `lead-review` |

- **Stamp ≠ category ≠ agent.** Category is a display hint in `bd list`; a stamp is the one
  label the dispatcher matches; an agent is a file in `agents/`. Two stamps share `playwrite`
  (feature and epic scope), which is exactly why the stamp — not `--agent` — carries the tier.
- **Merge stamps are not here.** `feature-merge-pr` / `epic-merge-pr` are excluded at the claim
  itself (`--exclude-label`), so the loop never dispatches them.
- **Gates carry no stamp.** `epic`/`feature` are `type: gate`, structurally invisible to
  `bd ready`. Beware: children *inherit* parent labels, so a stamp on a gate silently stamps
  every descendant.
- **`plan-task` must stamp at creation** and verify it round-trips (`bd show --json <id>` after
  each create). The loop only reads labels; if the creator didn't stamp, nothing dispatches.
- A stamp is not a `tag:` — `tag:` is the personal Obsidian-style system and nothing dispatches on it.

## 4. Workers

One ticket, one worker, one worktree. The worktree is Claude's to make (`-w <ticket>`), never
the loop's to build — no workspace folders, no clones, no cleanup here.

The **ticket is the prompt**: the worker is told to run `bd show --json <ticket>` first and to
treat that description and those acceptance criteria as its complete brief. Nothing is
transcribed — transcription is lossy. The prompt also carries: heartbeat between steps (the
lease must never lapse), `bd close` when its own tests pass, a `bd comment` if work remains,
and "spawn nothing, you and your ticket are one and the same."

Workers run `--permission-mode bypassPermissions` unattended, so nothing may ever wait on a
human, and **the loop is only ever run inside a repo you fully trust**. There is no report
contract: nobody reads worker output. The closed ticket is the proof of work.

`respawn_agent: true` on a task means a fresh session of the same agent re-checks the work —
that is a *step inside* the one ticket, never a second ticket.

## 5. Logs

`$LOG_ROOT/<run timestamp>/`, TAB-separated, `EVENT <ts>\t<key=value…>`, tee'd to stdout so a
failure can never be silent. Fields stay stable: the future viewer is a parser, not a redesign.

| File | Line |
|---|---|
| `claims` | `CLAIMED <ts> ticket=<id> stamp=<s> agent=<a> worktree="<path>"` |
| `errors` | `ERROR <ts> ticket=<id> reason=<bd-failure\|stamp-ambiguous\|worker-not-dispatched> …` |
| `waiting` | `WAITING <ts> reason=<frontier_empty\|max_parallel\|max_parallel_stalled> working=<n> next=<id>` |
| `results` | `RESULT <ts> ticks=<n> claimed=<n>` |

- **The ticket and its agent appear together in every line** — that pair is the relationship the
  whole system keeps honest.
- **Waiting lines are rate-limited to one a minute per reason**, decided from live sources each
  tick (`claude agents --json` + `bd list --status in_progress`). A quiet tower must not bury the
  errors file under 20 000 identical lines. Errors are never rate-limited.
- **`max_parallel_stalled` is the alarm**: slots read full while beads has nothing in progress.
  A broken tower must never read as a calm one.
- Every workspace/spawn failure **releases its claim** so the ticket drifts back instead of
  burning in place. The one exception is `stamp-ambiguous`: nothing is unclaimed, the lease
  holds the broken ticket off the frontier, and the errors file is the alarm until a human
  fixes the tower.

## 6. Gates

Gates are the epic and feature nodes. They are checkpoints, not work: the loop never claims,
dispatches or closes one. `bd ready` structurally hides them, and tasks behind an open gate
stay off the frontier, so the loop's only experience of a gate is an empty claim. The human
reads the merged PR and closes the gate; the freed tickets simply appear on the next pass.

There is no human agent, and a claimable ticket assigned to a human is a model bug.

## 7. Rules of the road

1. **Always claim with `bd ready --claim`.** A bare `bd ready` isn't atomic — two loops would
   take the same ticket. It is allowed only as a non-binding peek to name `next=` in a waiting line.
2. **One ticket per tick, one worker per ticket.**
3. **Never guess a specialist.** Zero or two stamps = error, not a coin flip. The wildcard
   (`BO_ALLOWED_STAMPS=*`) is an opt-out you have to ask for, not a default.
4. **A slot means "a worker might be working in here right now".** Counted fresh every tick from
   `claude agents --json` (background sessions under this project, minus finished ones) — no
   ledger, no marker files, no pid hunting.
5. **The loop never ends itself.** No exit-on-exhaustion, no progress clock, no timeout. Only a
   stop signal does, and `BO_MAX_TICKS` exists so tests can end, not so towers can.
6. **Nothing answers into `/dev/null`.** `claude --bg` reports "no agent named X here" on stderr;
   that output goes to the log directory or the failure is invisible.
7. **Not built here, on purpose:** gate watching, worker polling or reaping, merge-back, respawn
   machinery, a results viewer. Each is its own future system.
