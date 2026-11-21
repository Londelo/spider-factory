### Summary
Spider Factory is a plain repo — an SDL toolkit for building web applications with
Claude Code, driven by Beads (`bd`). Everything it is lives in this checkout: the agents and the skills are
ordinary project-level files under `.claude/agents/` and `.claude/skills/`, and every one of them is spawned
by its bare name, never a namespaced one. You plan a tower of tickets top-down, then one command turns that tower
into background workers — each ticket claimed, worked on the branch its own id names, committed, pushed, and
put up as a pull request — while you stay out of the way and close the gates when a tier is proved.

### Documentation — three tiers, and the rule before every commit

There are three documents. They are not interchangeable: each has its reader and its depth, a fact belongs
at the deepest tier that owns it, and the shallower tiers point down instead of repeating it.

| Tier | File | Reader | Depth |
|---|---|---|---|
| 1 · the snapshot | `README.md` (repo root) | a human passing through | the idea, the setup, the webs, the CLI, the workflow, and where to read more. Brief, always — it owns no fact nobody else owns. |
| 2 · the reference | `.claude/CLAUDE.md` (this file) | an agent doing the work | the vocabulary, the moving parts, the rules that break the system. Detailed, not exhaustive — it points down, it never duplicates. |
| 3 · the account | [`diagram/`](./diagram/) | a human who is not in the code | the most detailed thing outside the code: the machine, the tower, the workers, every alarm, step by step. The **translated** source of truth, and the thing people quote — so it must not drift. |

Above all three: **the code is the only source of truth.** A document is a set of claims about the code, and
a claim nobody checked is a bug. When any tier disagrees with the code, that tier is wrong — including the
one you wrote yesterday.

**The rule: nothing commits until all three match the code.** Before every `commit` — every commit, every
push — **spawn an agent** to bring `README.md`, this file, and `diagram/` in line with what the code now
does, and commit the code and the documents together. A change that leaves a document stale is not finished.
The agent you spawn reads the code, never its own memory of it; the diagram half of the job reads
`diagram/REFERENCE.md` before it touches a box and rebuilds `dist/` when it is done.

### Source of truth — read this first

| You want | Go to |
|---|---|
| what a thing actually does | the file it lives in |
| the system in human terms — the machine, the tower, the workers, every alarm | `diagram/model.c4`, and the four walkthroughs in `diagram/views.c4` (`index` the plan · `theLoop` the run · `theLogs` the log · `everyFailure` the alarms) |
| how to edit those diagrams without breaking them | `diagram/REFERENCE.md` |
| the words that mean something specific here | below |

### File structure
```
spider-factory/
├── README.md                       # Tier 1 — the snapshot a human passing through reads
├── KNOWN_BUGS.md                   # the open bug board: every known defect, its proof, and its file:line
├── package.json                    # the npm entry points — cli:install, cli:uninstall, webs:clone
├── .claude/CLAUDE.md               # this file — pointer and vocabulary
├── .claude/diagram/                # the translated source of truth — likec4 model, specification, views,
│                                   #   likec4.config.json, build.sh, and the built dist/
├── .claude/agents/                 # 7 tower agents + 3 plan agents + the overseer watcher — project-level
│                                   #   files, each one spawned by its bare name; the 7 tower agents' frontmatter
│                                   #   is what registers the one worker hook, the other four carry none
├── .claude/skills/                 # bead-initialize, bead-create, bead-read, bead-comment,
│                                   #   pr-comments, standards-{coding,naming,errors,file-organization},
│                                   #   framework-{jest,playwright}
├── .claude/shared/plan-tasks/      # the three briefs plan-task copies a ticket's shape from: engineer.md,
│                                   #   frontend.md, tester-unit.md — one per category, each named for the agent
│                                   #   that fills it, never for the category. They live here, in the factory
│                                   #   checkout, and nowhere in the tower: a plan agent's cwd is the tower, so
│                                   #   it must name each template by the checkout to open it at all
├── CLI/                            # the `sf` package — bash, no node
│   ├── bin/sf                      # bare `sf` = an agent session at the factory root, from anywhere; each of the
│                                   #   seven commands — loop, plan:epic, plan:feature, plan:task, overseer,
│                                   #   commit, hook — refuses to run unless $PWD is the factory root itself
│                                   #   or anything nested under it
│   ├── spider-factory.example.env  # what you get when you set nothing, copied to CLI/spider-factory.env on install
│   ├── install-cli.sh              # puts a real launcher on PATH and CLI/spider-factory.env down the first time
│   ├── uninstall-cli.sh            # removes that launcher, and only that launcher
│   ├── utils/                      # the shared bash — a file two or more commands source, never run on its own
│   │   ├── console.sh              # the only file in CLI/ that writes to a terminal: `nameTheSpeaker` once per
│   │   │                           #   script, then `say` / `tell` / `plain` / `die`, and the four reused refusals
│   │   └── logging.sh              # the one definition of a log line: nine fixed keys, `-` for the unknown;
│   │                               #   sourced by the engine and by the Stop hook, and by nothing else
│   └── src/                        # the commands bin/sf runs, and the concern files under each one.
│       │                           #   Nothing here is shared: if two of them want the same bash, it moves to utils/
│       ├── beads-loop/             # the dispatcher engine — ten files, one a concern, `index.sh` the one `sf loop`
│       │                           #   runs: it holds the knobs, the `AGENT` map, the order the other nine are
│       │                           #   sourced in, the tick, the loop, and the startup checks in order
│       ├── plan-agent.sh           # the planner engine — one plan agent, foreground, through
│       │                           #   `$SF_AGENT_LAUNCH_COMMAND --agent <name>`
│       ├── overseer-agent.sh       # the reader engine — the overseer agent, foreground, through
│       │                           #   `$SF_AGENT_LAUNCH_COMMAND --agent overseer`, `sf` denied to it
│       ├── commit.sh               # the only thing that commits, anywhere
│       ├── forge.sh                # GitHub vs GitLab, and which tool names the right CLI
│       ├── user-env.sh             # the loader for CLI/spider-factory.env
│       ├── create-beads/           # create-gate.sh + create-task.sh, the only two things that mint an id —
│                                   #   they live here, in the factory checkout, and never in the tower; the plan
│                                   #   agent that runs them stands in the tower anyway, because its cwd is what
│                                   #   decides which beads database bd reads and so which tower gets the id
│       └── agent-hooks/            # worker-stop.sh — one engine like every other one, reached only as
│                                   #   `sf hook stop`, which the seven worker agents' frontmatter registers on
│                                   #   its own Stop event: see its row in the moving parts
├── webs/                           # every web the workers build — the directory is in the repo, nothing inside it is
│   ├── .gitkeep                    # the one tracked file, so webs/ exists in a fresh checkout
│   ├── webs.example.yml            # the shipped empty list, tracked — clone-webs.sh copies it to webs.yml only when that is missing
│   └── webs.yml                    # your repo urls, gitignored — the list clone-webs.sh actually reads
└── scripts/                        # what npm runs, outside the `sf` command set
    ├── clone-webs.sh               # the cloner — `npm run webs:clone`, reads webs/webs.yml, clones each repo into webs/
    └── tower-walk.sh               # experiment harness — builds a tower and walks the frontier by hand
```

### The three names — never interchangeable
| Name | What it is | Examples |
|---|---|---|
| **category** | a display hint, and the key that picks which brief under `.claude/shared/plan-tasks/` `plan-task` copies a ticket's shape from — the brief file is named for the **agent** that fills it, never for the category | `backend-logic` → `engineer.md`, `frontend-ux` → `frontend.md`, `unit-tests` → `tester-unit.md` |
| **label** | a string on a ticket, `bd create -l`. Any number may be attached; **exactly one** must be a key of the dispatcher's `AGENT` map — that one decides the worker | `backend-logic`, `frontend-ui`, `unit-tests`, `feature-test`, `epic-e2e-test`, `feature-review`, `epic-review` |
| **agent** | a real file in `.claude/agents/`, spawned by that bare name | `engineer`, `frontend`, `tester-unit`, `tester-feature`, `tester-e2e`, `review`, `lead` |

The three test labels are three **tiers**, and there the three names collapse to one string — the node key IS
the label IS the category — while the agent carries its own name: `unit-tests` → `tester-unit` (micro, one
function alone), `feature-test` → `tester-feature` (composition, one feature's pieces wired), `epic-e2e-test` →
`tester-e2e` (broad, journeys across features on the real stack). The binding lives only in the `AGENT` map;
nothing derives an agent name from a label. A tier is named for the **test**, never the tester and never the
framework — a tier owns *what to cover and how deep*, and a `framework-*` skill owns *the tool*. That is why no
ticket description carries framework syntax, and why a mis-labelled ticket silently gets the wrong depth.

### The tower, in one breath
Every node is a real beads issue; types are `gate` and `task`. The tower is **dependencies and nothing else** —
one edge type, `blocks`, written `bd dep add <blocked> <blocker> --type blocks`. There is no `parent-child`
edge in a tower and no `--parent` at create time: beads refuses a `blocks` edge from an ancestor to its own
descendant, so parenthood is what made gates unenforceable in the first place. What a tier *is* = the tickets
that block its gate.

Epic gate (the *what*) → feature gates (one complete user-facing flow each) → each feature's tasks in **one
linked line, never a fan**: logic, then its micro tests, then the UI. Then the composition suite, then the
review, then the gate. At the epic: the broad suite, then the review, then the gate. There is no merge ticket.

**Gates are checkpoints, not work.** `bd ready` never shows one. Every ticket of a tier blocks its gate, and
what holds the *next* tier off the frontier is an explicit `blocks` edge onto the gate itself. **Only a human
closes a gate** — until `SF_AGENT_FEATURE_GATES=1` / `SF_AGENT_EPIC_GATES=1`
hands that tier to the `lead` agent, which the loop spawns for a ready gate each tick. There is no `human`
agent; nothing is ever spawned for the person.

### Branches — one per epic, one per feature; a task is a commit
No branch per ticket and none per worker. Two metadata keys exist and one is the plan's: **`branch`**, on a
**gate only** — the epic gate and each feature gate carry their own and nobody else's, no task or suite or
review carries any — and **`pr`** (the url, written by the loop or the Stop hook, never by a plan agent).
Everything else about a ticket's git world is **derived from its id**, which is the point. An id reads
`<repo>-<kind>-<uuid>-<hierarchy>`, as in `foobar-task-a7f3c9-5.3`: `kind` is `epic` or `feature` **on a
gate only** and `task` on everything else, one lowercase-hex `uuid` binds a whole tower, and the hierarchy is
`0` for the epic gate, `1 2 3` for its features, `<gate number>.<m>` for a ticket below a gate — `.1` always
that gate's suite, `.2` always its review, the worker chain from `.3`. Swap the kind word to `feature` and
cut the hierarchy at the last dot and you hold the feature gate whose `branch` the work lands on; swap it to
`epic` and set the hierarchy to `0` and you hold the epic gate whose `branch` is the **`prTarget`** — `main`
when the owner is the epic gate itself. There is no `base` key and no `tier` key; a copy of either is a fact
that can disagree with the gate that decides it, and which tier a gate is is its own kind word — read off the
id, never a graph walked. An id that does not read that grammar, a task whose hierarchy carries no gate
number, or an epic gate that is not a gate row belongs to no tower: the loop refuses it, logs
`ERROR reason=no-epic-gate ticket=<id>`, and leaves it claimed, unworked, on purpose. That is why every
ticket in a tower is created with an explicit `--id`, and why every id comes out of
`CLI/src/create-beads/create-gate.sh` or `CLI/src/create-beads/create-task.sh` and never from an eye — both
of them in the **factory checkout**, run by a plan agent whose cwd is the tower: see the `create-beads/` row.
A bare `bd create` mints a flat id, and a flat id reaches no gate. The worktree is `.claude/worktrees/<branch with / → +>`, and it belongs to
the *branch*, not the ticket.

### The moving parts, and who owns what
| Part | Owns |
|---|---|
| `CLI/src/beads-loop/` | the tick: dispatch any ready gate its tier flag opens, `bd ready --claim`, match the one dispatching label, derive `branch` and `prTarget` off the ticket's id, publish the epic branch and PR if there is none, build the worktree, spawn the worker **with cwd inside it** through `$SF_AGENT_LAUNCH_COMMAND --bg --agent <name>` — the bare agent name, never a namespaced one, and the launch command not the plain one: see the `user-env.sh` row — log one line per event. `index.sh` is the whole run — the knobs, the `AGENT` map, the source order, `tick()`, `runLoop()`, and the startup checks in order; the nine files beside it each own one concern and nothing else. What `sf loop` actually executes is `CLI/src/beads-loop/index.sh` |
| `CLI/src/agent-hooks/` | **one engine, registered by the seven worker agents themselves.** Each of `engineer`, `frontend`, `tester-unit`, `tester-feature`, `tester-e2e`, `review`, `lead` carries a `hooks:` block in its frontmatter — `Stop` → `sf hook stop` (timeout 300), the only event there is — and `sf hook stop` in `CLI/bin/sf` execs the script under `CLI/src/agent-hooks/`, which
`locateEngines` locates the same way it locates every other engine; a second word dies naming the one. `overseer` and the three `plan-*` agents carry none on purpose: a watcher or a planner ending its session must never commit, push, open a PR, or park a ticket. There is no `.claude/settings.json` and never was a need for one — an agent's own frontmatter is what loads it, and it does fire under the loop's spawn form (`$SF_AGENT_LAUNCH_COMMAND --bg --agent <bare name>`). The event that arrives is `Stop`, never `SubagentStop`: `--bg --agent X` is a top-level session with an agent attached, not a subagent. **There is no `StopFailure`** — see the rule below, and never put that key back. The script finds its worker by **session id** — read from the hook's own stdin JSON, the one thing that is per-session correct — matched against the `session=` field of the `reason=dispatched` line the loop wrote to `$SF_LOG_ROOT/<run>/claims`; ticket, branch, target, worktree and run all come off that line, and a session with no such line is a human's, which leaves silently and writes nothing. It sits inside `CLI/src/` beside the shared bash it sources and takes it one level up — `$here/../user-env.sh`, `$here/../forge.sh`, and `$here/../../utils/logging.sh`; a path saying two levels loads nothing and fails silently |
| `CLI/src/agent-hooks/worker-stop.sh` | the `Stop` hook. **fail-closed on `$SF_DONE_FILE`**: no marker → no commit, no push, no PR, no close. Then it closes the *task*; on a gate claim (`kind=gate`) it commits and pushes, finds that branch's PR at any state, and closes the **gate** without ever opening a new PR. It writes its own log lines: it sources `CLI/utils/logging.sh`, exports `SF_LOG_QUIET=1`, and its `logLine <tag> [detail...]` sets `$logDir` from `SF_LOG_DIR` → `SF_LOG_ROOT` → the default, `mkdir -p`s it, calls `takeLogFieldsFromEnvironment`, then `writeLog` |
| `CLI/src/commit.sh` | **the only way anything commits in this repo** — `sf commit` = `git add -A`, one commit subject `agent:branch:message`, `git push -u origin <branch>` |
| `CLI/utils/console.sh` | **the only file in `CLI/` that writes to a terminal** — sourced by every engine, by `bin/sf`, and by both installers; nothing else there runs `echo` or `printf` at a screen. `nameTheSpeaker <name>` once per script, and every line it says comes out `<name>: <line>` (`sf`, `beads-loop`, `plan-agent`, `overseer`, `commit`, `webs`, `create-gate`, `create-task`); `say` → stdout, `tell` → stderr, `plain` → stdout unprefixed (the key=value event lines), `die` = `tell` then exit 1. The four reused refusals — no beads database, a file missing from the install, a tool not on `PATH`, the agent command not on `PATH` — are each worded here and nowhere else. A run's log lines are **not** here: those are `logging.sh`'s, and a `printf` whose stdout a caller captures with `$( )` is that caller's return value, not output |
| `CLI/utils/logging.sh` | the one definition of a log line — nine fixed keys, `-` for the unknown, the tag naming the file under `$logDir` the line appends to. Sourced by **exactly two things** — the engine and the Stop hook — and by **nothing else at all**; there is no logging command to go through, and a hook that shelled out to one would log nothing. The engine keeps the fields in **process memory**: it seeds them once with `seedStartingLogFields`, carries them with `setLogField`, and drops all but run and repo with `clearLogFields`. The hook has no process to keep them in, so `takeLogFieldsFromEnvironment` fills all nine from **its own environment** on every line — `SF_LOG_RUN` (falling back to the name of `$logDir`), `SF_PROJECT_DIR`, `SF_TICKET`, `SF_LABEL`, `SF_AGENT`, `SF_BRANCH`, `SF_PR_TARGET`, `SF_SESSION`, `SF_WORKTREE` — and an unset one comes out `-`. There is deliberately **no cross-process persistence and no scratch file**: two shells have two environments, so the hook exports them once in its own process — off the dispatched claims line, the loop's own spawn environment being uninheritable — and every line after carries them. Since `bin/sf` refuses from outside the factory, **every caller of `sf` needs its cwd under the factory root** — the Stop hook has it, the worktree being `<tower>/.claude/worktrees/…` and the loop itself refusing to run from anywhere else. `SF_LOG_QUIET=1` keeps a line out of stdout: the hook exports it, the engine does not |
| `CLI/src/user-env.sh` + `CLI/spider-factory.env` | every knob; `spider-factory.example.env` is copied there on install and never touched again. `loadSpiderFactoryEnv` fills what is unset and never overwrites a value you exported, then exports `SF_AGENT_LAUNCH_COMMAND` itself — the one name the loader owns, and the only one it writes; every other `SF_*`, `SF_AGENT_COMMAND` included, reaches the environment only through the fill above. **`SF_AGENT_COMMAND`** (default `claude`) is yours: it comes from the env file or your own export, it is split on spaces so it may carry its own arguments, and it is what the PATH checks read and what `beads.sh` runs `agents --json` through. **`SF_AGENT_LAUNCH_COMMAND`** is ours: that same command with `--add-dir <factory root>` appended — the root derived from `user-env.sh`'s own path, not from `PWD` — recomputed on every load, never read out of the env file, and never anything to edit. Every spawn that has to *resolve* an agent goes through it: the worker, the three plan agents, the overseer. All three run with their cwd somewhere else than here — the worker inside a worktree, the planners and the watcher inside a tower — so the session's project root is the tower, and without the added directory Claude Code never scans `spider-factory/.claude/agents` or `.claude/skills`: `--agent <name>` resolves to nothing and no skill loads. `--add-dir` is a **discovery** flag, not a sandbox and not a permission grant — a `bypassPermissions` worker could already read and write the whole factory without it. Two sites stay on plain `$SF_AGENT_COMMAND` on purpose: `beads.sh`'s `agents --json`, because `--add-dir` is variadic and would swallow the `agents` positional as a second directory, and `preflight.sh`, which only asks whether the command's first word is on `PATH`. Bare `sf` needs neither flag because it opens its session at the factory root |
| `scripts/clone-webs.sh` + `webs/webs.yml` | the webs the factory builds, and nothing to do with `sf` or the installer — one repo url a line, cloned into `webs/`; `webs/webs.example.yml` is the tracked template that engine copies to `webs/webs.yml` and nothing else ever writes that file |
| `webs/` | in the repo by `.gitkeep` alone — `webs/*` is ignored, so the directory ships and the clones inside it never do |
| `.claude/agents/*.md` | the worker's own contract — the lease, never closing its own ticket, `sf commit` as it goes, the done marker last, and the `hooks:` frontmatter that puts the one worker hook on its own Stop event |

### Rules that break the system when broken
- **Always `bd ready --claim`**, never a bare `bd ready` — it is not atomic and two loops steal the ticket.
- **Never dispatch on a guess** (zero or two dispatching labels → left claimed, never a chosen worker), and
  **never invent a branch** (no `branch` in the claim → left claimed). Left claimed is deliberate: the lease
  parks the unworkable ticket off the frontier instead of the loop spinning on it.
- **Never work two tickets on one branch at a time.** The `blocks` chain is the **only** thing that guarantees
  it: one feature's tasks sit on its gate's branch in a single linked line, so only one of them is ever ready,
  so only one is ever `in_progress` on that branch. Same at the epic. The loop no longer checks — there is no
  busy-branch sweep and no second claim a tick. A tower that fans into two ready tickets on one branch is a
  mis-built tower, and the loop will happily work both.
- **Nobody but the Stop hook closes a task, and no worker closes its own** — a ticket already closed makes the
  hook exit before it commits, so the work never lands. Only a human closes a gate, unless its tier's flag is on.
- **A worker agent that does not register its own hook is a worker that never finishes.** The hook runs
  because each of the seven worker agents carries the `hooks:` frontmatter — there is no settings file and no
  registration step anywhere else. Add an eighth worker agent without that block and it commits nothing, pushes
  nothing, opens no PR, and leaves its ticket claimed, silently. Give a `hooks:` block to `overseer` or to a
  `plan-*` agent and you have a watcher or a planner closing tickets and opening PRs.
- **Every spawn that names an `--agent` goes through `$SF_AGENT_LAUNCH_COMMAND`, never the plain
  `$SF_AGENT_COMMAND`.** The factory root it adds is the only reason the agent file and the skills are
  discoverable at all when the session's cwd is a worktree or a tower instead of the factory. Revert one
  spawn to the plain command and that session has no agent to load: the only trace is whatever the CLI
  said, sitting in the run's `spawn-<ticket>` file, and whether the loop even notices depends on whether
  the CLI exits non-zero. The two sites that keep the plain command, and why, are in the `user-env.sh` row.
- **There is no `StopFailure` event, and nothing detects a dead worker.** Claude Code's hook events are
  SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PreCompact, SubagentStart, SubagentStop and `Stop` —
  that is the whole list. Proven, not assumed: with both `Stop` and `StopFailure` keys in one agent's frontmatter,
  `Stop` fires and `StopFailure` is refused outright as `Unknown hook event type 'StopFailure'`. So a worker
  killed by an API error leaves its ticket `in_progress`, invisible to `bd ready`, with **no log line anywhere** —
  the engine still seeds the `failures` file and nothing has ever written to it. A gate whose lead agent died reads
  exactly the same. The overseer's check for a worker that died quietly is the only thing that finds one, and all
  it does is name the ticket and hand a person `bd update <ticket> --status failed-agent` to run. Never add a
  `StopFailure:` block back: the harness refuses the key, and the loop's `sf hook` has no arm for it.
- **A hook never reads its worker off its own environment or its cwd.** `claude --bg` runs every session through
  one shared daemon that freezes the **first** spawn's environment, and every later session and every hook it runs
  inherits that frozen copy — so `SF_TICKET` in a hook is whatever the first worker of the run was, and the hook
  input's cwd is a pooled process's cwd, not the worktree's. The hook takes the session id from its own stdin
  JSON and looks up that worker's `reason=dispatched` claims line; anything else commits, pushes and closes the
  wrong ticket.
- **No `parent-child` edge, and no `--parent`, anywhere.** The tower is `blocks` edges only. Parenthood is
  what made a gate unenforceable: beads refuses a `blocks` edge from an ancestor to its own descendant, so a
  plan agent with `--parent` in hand could only ever write an edge that nothing enforces.
- **A gate is claimed by status, never by `bd ready --claim`** — a gate never shows in `bd ready`, so the loop
  moves it to `in_progress` itself, guarded by `--if-status open` (which is also what takes it off the ready
  list until its lead agent dies).
- **The lead agent is the one worker no label reaches.** It is spawned for a ready gate whose
  `SF_AGENT_FEATURE_GATES` / `SF_AGENT_EPIC_GATES` flag is on, and it merges through the forge — never a local
  `git merge` into the target.
- **`failed-agent` and `gate` are per-database custom settings.** `bd` accepts an unknown type or status
  silently and then refuses it, so a broken gate and a working one look identical. `bead-initialize` registers
  both; an older tower needs the two `bd config set` lines run in it.
- **Beads queries belong to the skills, not to an agent file.** A worker file names the skill to load —
  `bead-read`, `bead-create`, `bead-comment` — and writes no query of its own; a plan agent names only the
  `blocks` edges its own tier owns, and the overseer only the whole-tower reads nobody else makes. The two
  commands a worker runs about itself — `bd heartbeat` and `sf commit` — are named in its own file, because
  nothing else is theirs to name.
- **Workers run `bypassPermissions` unattended** → only run the loop in a repo you fully trust.
