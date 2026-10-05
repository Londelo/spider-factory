# The bd command map

Every command here was run against `bd` 1.3.0, or quoted from its own `--help`. Syntax not in
this file has not been verified — run `bd <cmd> --help` rather than guessing it, because several
plausible-looking forms in this corner of bd fail *silently* rather than erroring.

`bd` global flags worth knowing on any command: `--json`, `-q/--quiet`, `-v/--verbose`,
`--readonly` (blocks writes — right flag for a reviewing agent that should not mutate),
`-C <dir>` (run as if from that directory, like `git -C`), `--db <path>`.

## 1. Where am I? Which database?

| Command | What it tells you |
|---|---|
| `bd where` | The resolved DB path and prefix. bd walks **up** from `$PWD` and ignores your `BEADS_DIR` |
| `bd status` | Totals: total / open / in-progress / blocked / closed / ready |
| `bd doctor` | Install and schema sanity, ID scheme, CLI currency, circular deps, git hooks |
| `bd types` | Built-in types plus whatever `types.custom` registers |
| `bd statuses` | `open` `in_progress` `blocked` `deferred` `closed` `pinned` `hooked` |

Built-in types: `task` (default) `bug` `feature` `chore` `epic` `decision` `spike` `story`
`milestone`. Anything else must be registered with
`bd config set types.custom "gate"` — and note that `bd create -t gate` does **not** refuse an
unregistered type; it accepts it and then hides it from default queries, which is a silent
divergence, not a guard rail. Verified in a fresh database by typing `gate` and a nonsense
`mystery-type` with nothing registered: both vanished from `bd list` and `bd ready`, and surfaced only
under `-t gate`, `--include-gates`, or `bd query "type=gate"`. An unregistered `gate` therefore looks
exactly like a working one while being unreachable — check `bd types` before blaming the loop.

## 2. Read the tower

```bash
bd show --json <id>                  # one ticket, full text — the brief
bd show --json --long <id>           # every field, including design / acceptance_criteria / notes
bd show --json --include-comments <id>   # comment bodies too (slow on long threads)
bd children <parent-id> --json       # all children incl. closed (alias of list --parent --status all)
bd dep tree <id> --direction=up      # what this ticket is holding back
bd dep list <id>                     # this issue's own edges
bd dep tree <id> --direction=both --status=open
bd graph --open <id>                 # layered DAG: layer 0 = no deps, same layer = parallel
bd blocked                           # blocked issues, each with its open blockers named
bd ready --explain                   # per-ticket reasoning: why ready, why held
```

`bd show` also takes `--children`, `--refs` (reverse references), `--current` (the last-touched /
in-progress ticket), `--short`, `--brief-deps`, and `--as-of <commit|branch>` for Dolt history.

`bd close` and `bd update` with **no id** fall back to that last-touched issue — but only on an
interactive terminal; in a script or a pipe an empty id is an error. Pass the id explicitly anyway.
A worker that "just closes the last ticket" closes whichever ticket the DB last touched, which need
not be its own, and nothing warns it.

## 3. Find things

```bash
bd list --status open
bd list --status in_progress --limit 50 --json
bd list -l backend-logic                 # labels AND-combine; also --label-any, --label-pattern 'tech-*'
bd list --empty-description              # tickets no worker can be briefed on
bd list -t gate                          # gates, explicitly — see the gate note below
bd list --include-gates                  # same, via the flag bd provides for it
bd query "type=gate AND status=open"     # the query language sees gates that `list` hides
bd query "label=unit-tests AND priority<=2"
```

`bd list` filters: `--all` (incl. closed), `-a/--assignee`, `--id a,b,c`, `--parent <id>`,
`-t/--type`, `--exclude-type`, `-l/--label`, `--label-any`, `--exclude-label`, `--desc-contains`,
`--empty-description`, `--external-ref`, `--created-after/-before`, `--closed-after/-before`,
`--deferred`, `--has-metadata-key`, `-n/--limit`, `--format` (`digraph` | `dot` | Go template).

`bd query` fields: `status`, `priority`, `type`, `assignee` (`none` = unassigned), `owner`,
`label` (`none` = unlabeled), `title`, `description` (`none` = empty), `notes`, `created`,
`updated`; operators `= != > >= < <=`, `AND` `OR` `NOT`, and parentheses.

Two traps. A dependency-blocked issue **stays `status=open`** — that is what the `blocked` status
is for in the query language, so use `bd blocked` to find dependency-blocked work. And `bd list
--brief` omits description/design/acceptance/notes from each row while still *filtering* on them,
which makes a missing field indistinguishable from an empty one — fetch the whole issue with
`bd show` when the text is the question.

## 4. Gates

Our gates are issues of the custom **type** `gate`. bd hides them from `bd list` and `bd ready` by
design — it ships `--include-gates` precisely because they are "normally hidden" — and that is
what makes a gate structurally undispatchable. To see them: `bd list --include-gates`,
`bd list -t gate`, or `bd query "type=gate"`.

What actually holds a gate's children off the frontier is a `blocks` edge, verified end to end:
a `parent-child` edge alone leaves the child sitting on the ready frontier. `bd ready --explain`
names the blocker when you need to prove it:

```
bo-probe-dpp [P2] Task-under-gate-blocks
  ← blocked by bo-probe-cek: G2-block [open]
```

The human closes a gate with a plain `bd close <gate-id> --reason "…"`. `bd close --force` will
close an unsatisfied gate; use it only when you mean to skip a checkpoint.

Do not confuse this with **`bd gate`**, bd's own unrelated async-wait machinery — gate types
`human` `timer` `gh:run` `gh:pr` `bead`, with `bd gate list`, `bd gate check`,
`bd gate resolve <id>`, `bd gate create`, `bd gate show`, `bd gate add-waiter`,
`bd gate discover`. The tower does not use it. If a ticket is stuck and you find yourself typing
`bd gate`, check whether you meant `bd close` on a `type=gate` issue.

## 5. Finish work — and never claim it

**The claim side of this section is not for agents.** Claiming is `scripts/beads-loop.sh`'s
exclusive act; it is documented here so an operator debugging a tower can read the loop's behaviour
in the database. An agent reading this file uses only §5a. If you are an agent and you are about to
run anything in §5b, stop — your ticket was already claimed for you, which is why you exist.

### 5a. Worker surface — everything an agent may do to its own ticket

```bash
bd show --json <id>                              # the brief, read IN FULL first
bd heartbeat <id>                                # push the lease out (alias: bd hb)
bd close <id> --reason "<what you did + the evidence>"
bd comment <id> "exactly what remains"            # shorthand for: bd comments add <id> "…"
bd note <id> "appended to the notes field"        # shorthand for: bd update <id> --append-notes "…"
```

On `close`, `--suggest-next` (what the close just freed) is fine. `--force` is available but blunt: it
closes **pinned issues** and **unsatisfied gates**, so it can step over a checkpoint the human was
meant to close — use it only when you mean to skip one. **`--claim-next` is not fine** — it claims the
next issue, which is §5b behaviour wearing a close flag.

`--force` on `bd update` lets you overwrite another actor's live claim. Prefer `bd reclaim`, which
exists for exactly that and does it on a timer rather than on a hunch.

`bd comments <id>` lists a thread — the singular `bd comment` **only adds**, it has no list
subcommand, so reading comments means the plural form or `bd show --include-comments`.

Lease mechanics, verified: `started_at` + 300s = `lease_expires_at`. `heartbeat` pushes
`lease_expires_at` forward and stamps `heartbeat_at`; it writes **no commit and no history**, so a
generous cadence costs nothing. Only the current owner may heartbeat, and heartbeating a
reclaimed or closed ticket **fails on purpose** — that failure is the signal to stop working, not to
retry. When a brief is wrong or too large, comment on it; do not try to hand the ticket back.

### 5b. Dispatcher and operator only — never an agent

```bash
bd ready --claim --json                        # atomic: assignee + in_progress + 5-min lease
bd ready --claim --json --exclude-type gate --exclude-label feature-merge-pr,epic-merge-pr
bd update <id> --claim                         # claim one named ticket
bd unclaim <id> --reason "why it is going back"
```

The loop claims because the claim is what binds ticket → worker → worktree into one unit. An agent
that claims breaks that binding: it takes a ticket another worker may hold a live lease on, routes
work past the stamp that named a different specialist, and leaves a claimed ticket with no session
behind it. That is the `max_parallel_stalled` alarm's whole story — slots full, nothing really
working.

Recovery, when a worker died without closing its ticket:

```bash
bd stale                          # in_progress issues not updated recently
bd reclaim                        # revert expired leases (default grace = 2× the lease TTL)
bd reclaim --older-than 10m       # narrower grace window past expiry
bd reclaim --label lane-a --assignee worker-7 --id <id>    # scope it
bd unclaim <id> --if-assignee worker-7     # atomic compare-and-swap release; exits nonzero on mismatch
```

Run `bd reclaim` from a supervisor on a timer at roughly 2× the claim TTL. `--force` on `unclaim`
releases someone else's claim — coordinate first, their claim can be live on an issue that looks
idle.

## 6. Build the tower (plan agents)

```bash
bd create "Title" -d "<full brief>" --design "…" --acceptance "…" \
  -t task -p 2 -l backend-logic \
  --deps "parent-child:<parent-id>" --silent

bd create "Title" -d "…" --parent <id> --no-inherit-labels -l unit-tests --silent
bd create "Title" -d "…" -t gate --silent        # epic / feature node — NO label on a gate
bd create --dry-run …                            # preview without writing
bd create -f plan.md                             # batch from markdown
bd create --graph plan.json                      # batch a whole graph from a JSON plan
```

Guarded field edits — the atomic shapes a supervisor wants:

```bash
bd update <id> -d "…" --if-assignee worker-7    # mismatch: writes nothing, exits 13
bd update <id> -s closed --if-status open       # mismatch: writes nothing, exits 13
bd update <id> --add-label done-review
bd update <id> --design-file design.md
bd update <id> --metadata '{"tier":"feature"}'
```

Exit **13** means a precondition guard lost a race — another actor won. Retrying the same guard is
pointless; re-read the ticket instead. Exit 1 is a general failure. Multi-id updates apply per id,
not atomically: partial success is possible, failures are named on stderr, exit is nonzero.

Wiring edges after creation:

```bash
bd dep add <blocked> <blocker>                      # type defaults to `blocks`
bd dep add <blocked> <blocker> --type parent-child
bd dep add <a> <b> --depends-on <b>                 # alias of --blocked-by
bd dep <blocker> --blocks <blocked>                 # same edge, seen from the other side
bd dep remove <blocked> <blocker>                   # aliases: rm
bd dep relate <a> <b> / bd dep unrelate <a> <b>     # bidirectional relates_to
bd dep cycles                                       # circular dependencies
bd dep add --file edges.jsonl                       # bulk: {"from":"bd-42","to":"bd-41"} per line
```

Full valid dependency types: `approved-by assigned-to attests authored-by blocked-by blocks
caused-by conditional-blocks delegated-from depends-on discovered-from duplicates parent-child
related relates-to replies-to supersedes tracks until validates waits-for`. `blocked-by` and
`depends-on` are accepted aliases of `blocks`.

With no `-t/--type`, `bd dep add` creates a `blocks` edge — the edge that removes the dependent
from `bd ready`. Forgetting `--type parent-child` therefore silently turns a hierarchy edge into a
gate.

## 7. Labels and stamps

```bash
bd label add <id> label1,label2       # ids first, labels last
bd label remove <id> stale-label
bd label list <id>
bd label list-all                     # every distinct label in the DB — audit the stamp set
bd label propagate <parent> <label>   # push a label down to all children (this is how a bad gate label spreads)
bd tag <id> sometag                   # personal tagging; nothing dispatches on it
```

Children inherit parent labels (`bd create --parent`, or the `parent-child` dep form).
`--no-inherit-labels` opts out. Verified: a child created under a gate labelled `gate-stamp` comes
back `labels=["gate-stamp","unit-tests"]`, and the loop reads that as two candidate specialists →
`stamp-ambiguous`.

## 8. The dispatcher, and what it deliberately is not

`scripts/beads-loop.sh` claims one ticket per tick, matches its single stamp against the `AGENT`
map, spawns `claude --bg -w <ticket> --agent <agent> --permission-mode bypassPermissions`, logs a
line, moves on. Env: `BO_MAX_PARALLEL` (4), `BO_POLL_S` (3, must divide 60), `BO_MAX_TICKS`
(test seam only), `BO_LOG_ROOT` (`~/.binary-obelisk/logs`), `BO_ALLOWED_STAMPS` (narrows the set).

Its logs are the diagnostic surface, one timestamped dir per run:
`claims`, `errors`, `waiting`, `results` — TAB-separated `EVENT <ts>\tkey=value…`.

```bash
tail -f ~/.binary-obelisk/logs/*/errors        # the alarm — never rate-limited
tail -f ~/.binary-obelisk/logs/*/waiting       # frontier_empty / max_parallel / max_parallel_stalled
grep -o 'ticket=[^ ]*' ~/.binary-obelisk/logs/*/claims | sort -u
claude agents --json                           # who is actually alive (the loop's capacity source)
```

`stamp-ambiguous` errors are left claimed **on purpose**: the lease parks the broken ticket off the
frontier so the error keeps repeating until a human fixes the ticket. Restarting the loop does not
fix it; `bd show --json <id>` and fixing the labels does.

Spawn and forget by contract. Not built here, on purpose: gate watching, worker polling or reaping,
merge-back, respawn machinery, a results viewer. If you find yourself adding one, it is its own
system, not a patch to this loop. Workers run `bypassPermissions` unattended — only ever run this
loop in a repository you fully trust.

## 9. Data and sync

```bash
bd sync                    # pull, detect conflicts positively, recompute is_blocked, push
bd diff                    # changes between two commits or branches
bd history <id>            # version history of one issue
bd search "<text>"         # full-text search — TITLES, not labels
bd lint                    # issues missing required template sections
bd find-duplicates         # semantically similar issues
bd provenance              # append-only provenance event log
```

`bd sync` step 3 recomputes the denormalised `is_blocked` flag, which is what keeps `bd ready`
honest after edges arrive from another replica. Sync exit codes: **2** = conflicts it will not
auto-resolve (halts before pushing, repeats until an operator acts); **4** = a non-transient
uncommitted working set only an operator can clear. Never infer a conflict from a pull's exit
status.

`bd search` searches **titles and IDs** — text queries never read a description. Use
`bd list --desc-contains "<phrase>"` for description text, and `--external-contains` for external
refs. Title-only matching is a live trap for stamp auditing: a search can appear to confirm a
ticket's state while the label you care about was never examined. Audit labels with
`bd label list <id>` or `bd query "label=…"`, never with a text search.

`bd search` includes closed issues by default — which is the point ("was this already filed?") —
but matches past `--limit` are dropped *status-blind*, so narrow live work with `--status open`
rather than raising `--limit` and hoping.
