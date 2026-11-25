### Summary

Spider Factory is an SDL toolkit for building web applications with Claude Code, driven by Beads (`bd`).
You plan a tower of tickets top-down with three plan agents, then `sf loop` turns that tower into background
workers: each ready ticket is claimed, worked on the branch its own id names, committed, pushed, opened as a
pull request, and closed. The only hands on the code are workers in their own worktrees; a person plans a tier
and closes a gate. Agents and skills are ordinary files under `.claude/agents/` and `.claude/skills/`, each
spawned by its bare name. Locked to Claude Code and locked to Beads — decisions, not preferences.

### The flow, end to end

The causal chain. Everything else here is a detail of one of these stages, and the code owns the detail.

**Plan, top-down — three foreground agents, one tier each.** `sf plan:epic <idea>` mints the one epic gate
plus its e2e suite and its review. `sf plan:feature <epic-id>` mints one feature gate per complete user-facing
flow, each with its own `branch`, plus that feature's suite and review, and writes the edge that holds the
epic tier off the frontier until every feature has merged. `sf plan:task <feature-id>` mints that feature's
worker tasks — logic, its micro test immediately behind it, then the UI — in one linked chain. Every id comes
from `CLI/src/create-beads/`, never from an eye, and the one uuid minted at the epic binds the whole tower.

**Run — `sf loop`, one tick at a time.** A ready gate whose tier flag is on goes to `lead`. Otherwise
`bd ready --claim --json` takes the next ticket; its **exactly one** dispatching label picks the worker out of
the `AGENT` map, its id resolves the `branch` the work lands on and the `prTarget` the PR aims at, a worktree
is built or reused for that branch, and `spawnBackgroundAgent` starts the session inside it — **with no
environment at all**, so every fact the worker needs is a literal in its prompt.

**The worker** reads its ticket, works, `bd heartbeat`s to hold the lease, and `sf commit`s as it goes. It
never closes its own ticket and never touches a branch. Each of the seven worker agents registers `sf hook stop`
on its own `Stop` event.

**The Stop hook is what finishes a ticket.** `CLI/src/agent-hooks/worker-stop.sh` finds its worker by session
id from its own stdin JSON, matched against the loop's `reason=dispatched` claims line — no such line means a
human's session, and it exits silently. Only a session the harness reports `done` may land work: it commits,
pushes, finds or opens the branch's PR, writes `pr`, and closes the task. `blocked`, `failed`, `stopped` or an
unreadable verdict leave the ticket claimed with nothing pushed.

**A gate is a checkpoint, not work.** `bd ready` never shows one, and by default only a human closes one. With
its tier flag on the loop claims the gate itself and spawns `lead`, which proves the tier — its tickets closed,
its review fixed, its tests and pipeline green — and merges that branch's PR **through the forge**, never a
local `git merge`.

### The tower, and how its shape drives the loop

Every node is a real beads issue; the only two types are `gate` and `task`. **The tower is `blocks` edges and
nothing else** — no `parent-child`, no `--parent`: beads refuses a `blocks` edge from an ancestor to its own
descendant, so parenthood is precisely what made a gate unenforceable. What a tier *is* = the tickets that
block its gate. Nothing walks a graph at run time — the id says everything.

**The three names — never interchangeable**

| Name | What it is | Examples |
|---|---|---|
| **category** | a display hint, and the key that picks which brief under `.claude/shared/plan-tasks/` `plan-task` copies a ticket's shape from — the brief file is named for the **agent** that fills it, never for the category | `backend-logic` → `engineer.md`, `frontend-ux` → `frontend.md`, `unit-tests` → `tester-unit.md` |
| **label** | a string on a ticket, `bd create -l`. Any number may be attached; **exactly one** must be a key of the dispatcher's `AGENT` map — that one decides the worker | `backend-logic`, `frontend-ui`, `unit-tests`, `feature-test`, `epic-e2e-test`, `feature-review`, `epic-review` |
| **agent** | a real file in `.claude/agents/`, spawned by that bare name | `engineer`, `frontend`, `tester-unit`, `tester-feature`, `tester-e2e`, `review`, `lead` |

The binding lives only in the `AGENT` map in `CLI/src/beads-loop/index.sh`; nothing derives an agent name from
a label. The three test labels are three **tiers**, and there the three names collapse to one string while the
agent carries its own name: `unit-tests` → `tester-unit` (one function alone), `feature-test` →
`tester-feature` (one feature's pieces wired), `epic-e2e-test` → `tester-e2e` (journeys across features on the
real stack). A tier is named for the **test**, never the tester and never the framework — a tier owns *what to
cover and how deep*, a `framework-*` skill owns *the tool*. That is why no ticket description carries framework
syntax, and why a mis-labelled ticket silently gets the wrong depth.

**The id grammar is the whole git world.** `<repo>-<kind>-<uuid>-<hierarchy>`, as in `foobar-task-a7f3c9-5.3`.
`kind` is `epic` or `feature` **on a gate only**, `task` on everything else; one lowercase-hex `uuid` binds a
whole tower; the hierarchy is `0` for the epic gate, `1 2 3` for its features, `<gate number>.<m>` below one —
`.1` that gate's suite, `.2` its review, the worker chain from `.3`. Swap the kind word and cut at the last dot
and you hold the gate whose `branch` the work lands on; the epic gate's `branch` is the **`prTarget`**. Two
metadata keys exist: **`branch`**, on a gate only, and **`pr`**, written by the loop or the hook, never by a
plan agent. No `base` key, no `tier` key — a copy of either is a fact that can disagree with the gate that
decides it. The worktree belongs to the *branch*, not the ticket. An id that reaches no gate is refused, logged
`reason=no-epic-gate`, and left claimed on purpose — which is why every id comes out of `CLI/src/create-beads/`
with an explicit `--id`, never from an eye.

**One linked line, never a fan.** The `blocks` chain is the **only** thing keeping two workers off one branch:
one feature's tasks sit on its gate's branch in a single chain, so only one is ever ready. The loop does not
check. A tower that fans into two ready tickets on one branch is a mis-built tower, and the loop will happily
work both.

### Settings

`CLI/spider-factory.env`, copied from `spider-factory.example.env` on install and edited by hand after that.
Everything in it is **CLI-side** — a worker session is handed none of it — and a value you exported already
beats the file.

| Knob | Default | What it does |
|---|---|---|
| `SF_MAX_PARALLEL` | 4 | background workers at once |
| `SF_POLL_S` | 3 | seconds per tick; must divide 60 or the loop refuses to start |
| `SF_MAX_TICKETS` | 0 | tickets the loop ends itself after; 0 never ends |
| `SF_ALLOWED_LABELS` | `*` | which dispatching labels this loop may claim; a comma list narrows it |
| `SF_LOG_ROOT` | `~/.spider-factory/logs` | one directory per run under here |
| `SF_AGENT_COMMAND` | `claude` | the command that runs an agent — the spawn, the worker count, the planners |
| `SF_AGENT_FEATURE_GATES` / `SF_AGENT_EPIC_GATES` | 0 | hand that tier's gate to `lead` instead of a human; one flag per tier, because they are different amounts of trust |

`SF_AGENT_LAUNCH_COMMAND` is derived and cannot be set: `SF_AGENT_COMMAND` plus `--add-dir <factory root>`,
which is the only reason the agent files and the skills are discoverable at all when the session's cwd is a
worktree or a tower.

### The moving parts

| Part | Owns |
|---|---|
| `CLI/bin/sf` | the eight commands — `loop`, `plan:epic`, `plan:feature`, `plan:task`, `overseer`, `tower`, `commit`, `hook` — each one an engine under `CLI/src/`. Bare `sf` opens a session at the factory root from anywhere; every other command refuses to run unless `$PWD` is under the factory root |
| `CLI/src/beads-loop/` | the dispatcher. `index.sh` is the whole run — the knobs, the `AGENT` map, the source order, `tick()`, `runLoop()`, the startup checks in order — and the nine files beside it each own one concern and nothing else: `claim.sh` the frontier, `tower-id.sh` the id grammar and branch resolution, `git.sh` the worktree and the epic PR, `worker.sh` the prompt, the dispatch record and the spawn, `gates.sh` the gate side, `beads.sh` the reads, `config.sh`/`preflight.sh` the knobs and their checks, `logs.sh` the prose |
| `CLI/utils/spawn.sh` | the only place a claude session gets started and the only place an agent's existence is proved: `requireAgentDefinition` before every spawn, `checkBackgroundAgentLoaded` after a `--bg` one. It logs nothing |
| `CLI/utils/user-env.sh` + `CLI/spider-factory.env` | every knob. `SF_AGENT_COMMAND` (`claude`) is yours; `SF_AGENT_LAUNCH_COMMAND` is derived — that command plus `--add-dir <factory root>` — and is the only one the loader writes |
| `CLI/utils/logging.sh` | the one definition of a log line: nine fixed keys, `-` for the unknown, the tag naming the file under `$logDir`. Sourced by the engine and the Stop hook and by nothing else |
| `CLI/utils/console.sh` | the only file in `CLI/` that writes to a terminal (`nameTheSpeaker`, `say`/`tell`/`plain`/`die`), and the one beads probe every command runs (`requireBeadsProject`) |
| `CLI/utils/forge.sh` | GitHub vs GitLab, and which tool names the right CLI |
| `CLI/src/agent-hooks/worker-stop.sh` | the `Stop` hook — stage 6 above. Reached only as `sf hook stop` |
| `CLI/src/commit.sh` | the only thing that commits, anywhere: `git add -A`, one subject `agent:branch:message`, `git push -u origin <branch>`. The agent comes off the dispatch context for the folder you are standing in, `manual` when there is none |
| `CLI/src/plan-agent.sh`, `CLI/src/overseer-agent.sh` | the two foreground engines; both go through `runForegroundAgent`, which `exec`s, so the pre-flight is their only check. The overseer is handed its log root and agent command as literals in its prompt |
| `CLI/src/tower/` | the picture, and the only engine that writes nothing: `bd ready --json` and `bd export --json` into `tower.jq`, one tree, per-epic ordinals and status glyphs, unfiled ids last |
| `CLI/src/create-beads/` | `create-gate.sh` and `create-task.sh`, the only two things that mint an id. They live in the factory checkout and are run by a plan agent whose cwd is the tower — the cwd is what decides which beads database `bd` reads |
| `.claude/agents/` | 7 worker agents + 3 plan agents + the overseer. The seven workers' frontmatter is what registers the one worker hook; the other four carry none |
| `.claude/shared/plan-tasks/` | the three briefs `plan-task` copies a ticket's shape from — `engineer.md`, `frontend.md`, `tester-unit.md`, one per category, each named for the agent that fills it |
| `.claude/skills/` | every beads query: `bead-initialize`, `bead-create`, `bead-read`, `bead-comment`, `pr-comments`, the `standards-*`, the `framework-*`, and `sf-documentation` — the whole doc-pass procedure |
| `webs/` + `scripts/clone-webs.sh` | the webs the factory builds. One repo url a line in `webs/webs.yml` (gitignored; `webs.example.yml` is the tracked template), cloned into `webs/`. The directory ships by `.gitkeep` alone |
| `scripts/tower-walk.sh` | the experiment harness: builds a throwaway tower and walks the frontier by hand |

### Documentation

Three tiers — `README.md` the snapshot, this file the reference, `.claude/diagram/` the account — and the
whole procedure for keeping them true lives in the **`sf-documentation` skill**: what each tier owns, how
deep each goes, the three agents spawned at once, and the rule that docs move only when Londelo asks. Load
that skill before writing a line of documentation. **The code is the only source of truth** — when a tier
disagrees with it, that tier is wrong.

The one fact that stays here, because the skill reads it from nowhere else — the commit the last pass ran
from, which is that pass's whole brief and the next pass's starting point:

DOCS LAST RUN FROM: 9715bd2

### Gotchas and decisions

One line each. These are memories, so the next agent does not rediscover them.

- Locked to Claude Code and locked to Beads — decisions, not preferences.
- `claude --bg` sessions run through one shared daemon that **freezes the environment at the run's first
  spawn**, so anything the CLI exported would reach a later worker, and its hook, as the *first* worker's
  values. `spawnWorker` therefore exports nothing; the `SF_*` knobs are CLI-side only.
- Because of that: facts reach a worker as **literals in its prompt** and reach the CLI as the **dispatch
  record** — the claims line plus the worker-context file. Put a fact in one and not the other and `sf commit`
  and the Stop hook go blind on it.
- `--add-dir <factory root>` on every spawn is what makes `.claude/agents` and `.claude/skills` discoverable
  when the session's cwd is a worktree or a tower. It is **discovery**, not a sandbox and not a permission
  grant.
- Every spawn goes through `CLI/utils/spawn.sh`, and nothing outside it starts a session. It is the only
  reader of `$SF_AGENT_LAUNCH_COMMAND`, so the plain `$SF_AGENT_COMMAND` cannot reach a spawn by accident.
- The sites that read the plain `$SF_AGENT_COMMAND` are reads, never spawns (`agents --json`, `logs`) —
  `--add-dir` is variadic and would swallow the positional.
- The launcher's `no agent named X, starting with the default template` warning proves nothing — those words
  print whenever its cwd is not the factory root — and its exit status is always 0.
- A `--bg` session is proved on two things, state **and** its log header naming `@<agent>`; the state alone
  lies, because a name that resolves to nothing comes up `working` and dies seconds later.
- An unproved spawn **ends the run** — every worker left in it would be the same worker with no agent. Never
  soften that into a warning.
- There is **no `StopFailure` hook event** — the harness refuses the key outright — and nothing else detects a
  dead worker: it leaves its ticket `in_progress`, invisible to `bd ready`, with no log line anywhere.
- The overseer is the only thing that finds a dead worker, and all it does is name the ticket and hand a
  person `bd update <ticket> --status failed-agent`.
- The event that fires is `Stop`, never `SubagentStop`: `--bg --agent X` is a top-level session with an agent
  attached.
- Each worker agent's own `hooks:` frontmatter is the **only** hook registration; there is no
  `.claude/settings.json` and never was a need for one. Give a `hooks:` block to `overseer` or a `plan-*`
  agent and you have a watcher closing tickets.
- The Stop hook finds its worker by **session id** from its own stdin JSON, matched against the
  `reason=dispatched` claims line — never off its environment or its cwd.
- The cwd is not frozen and *is* the worktree, but a worktree belongs to a branch and not to a ticket, so it
  names nothing.
- The Stop event says a turn ended, not that the work ended: only a session the harness reports `done` lands
  work, and `blocked` leaves the ticket claimed with the worker parked on a person.
- `bd` accepts an unknown type or status **silently** and then refuses it, so a broken gate and a working one
  look identical.
- `gate` and `failed-agent` are per-database custom settings; `bead-initialize` registers both, and an older
  tower needs the two `bd config set` lines run in it.
- The worker's tower is a **literal in its prompt**, and `bd where` is what proves it; when `bd` answers a
  different database the remedy is `-C '<tower>'` on every beads command, never a `cd` into someone else's
  tower.
- Every worker puts **one report on its own ticket before it stops**, through `bead-comment` — the final
  message dies with the session, so a worker that stops without one leaves the next reader nothing but the
  diff.
- `bd ready` is not atomic — always `bd ready --claim`, or two loops steal the ticket.
- A gate never appears in `bd ready`; it is claimed by status, moved to `in_progress` by the loop itself,
  guarded by `--if-status open`.
- Every id comes from `create-gate.sh` / `create-task.sh`; a bare `bd create` mints a flat id that reaches no
  gate.
- `sf` refuses to run from outside the factory root — including `sf hook stop`, which is why a tower outside
  the factory is not a state the system supports (and why such a worker leaves no log line at all).
- `SF_POLL_S` must divide 60, or the loop refuses to start; the waiting-line cadence is `60 / SF_POLL_S`.
- `SF_MAX_TICKETS` counts tickets the Stop hook **closed** this run (the `closes` file), not ticks.
- The overseer has no Write, Edit or Agent tools and never claims, closes, commits or pushes — but `sf` is no
  longer denied to it; the `--disallowedTools` flag was dropped.

### Rules that break the system when broken

- **Workers run unattended** — the loop spawns them with no human in the session, so a plan agent must never
  stall the pipeline with a question a worker could have answered itself, and nothing in a worker's world is
  sandboxed: only run the loop on a tower you intend it to write into.
- **Always `bd ready --claim`**, never a bare `bd ready` — it is not atomic and two loops steal the ticket.
- **Never dispatch on a guess** (zero or two dispatching labels → left claimed, never a chosen worker), and
  **never invent a branch** (no `branch` on the owning gate → left claimed). Left claimed is deliberate: the
  lease parks the unworkable ticket off the frontier instead of the loop spinning on it.
- **Never work two tickets on one branch at a time.** The `blocks` chain is the only thing preventing it, and
  the loop does not check. Keep one feature's tasks in a single linked line.
- **Nobody but the Stop hook closes a task, and no worker closes its own** — a ticket already closed makes the
  hook exit before it commits, so the work never lands. Only a human closes a gate, unless its tier's flag is
  on.
- **A worker agent that does not register its own `hooks:` block is a worker that never finishes** — it
  commits nothing, pushes nothing, opens no PR, and leaves its ticket claimed, silently.
- **`review` hands each finding to one fixer, one at a time, never two on the branch together.** They share
  one worktree and one branch. `review` commits nothing; each fixer's own `sf commit` is what lands its fix.
- **The lead agent merges through the forge** — `gh pr merge` / `glab mr merge` — never a local `git merge`
  into the target.
- **The `AGENT` map is the only label→agent binding**, and `lead` is the one worker no label reaches: a gate
  carries no labels at all.
- **No `parent-child` edge and no `--parent`, anywhere.** The tower is `blocks` edges only.
