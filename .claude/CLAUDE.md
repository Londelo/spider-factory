### Summary
Spider Factory is a plugin: an SDL toolkit for building web applications with
Claude Code, driven by Beads (`bd`). You plan a tower of tickets top-down, then one command turns that tower
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
├── .claude/CLAUDE.md               # this file — pointer and vocabulary
├── .claude/diagram/                # the translated source of truth — likec4 model, specification, views,
│                                   #   build.sh, and the built dist/
├── .claude/agents/                 # 7 tower agents + 3 plan agents + the overseer watcher
├── .claude/skills/                 # bead-initialize, bead-create, bead-read, bead-comment,
│                                   #   setup-cli, pr-comments, standards-{coding,naming,errors,file-organization},
│                                   #   framework-{jest,playwright}
├── CLI/                            # the `sf` package — bash, no node
│   ├── bin/sf                      # bare `sf` = an agent session at the factory root; six commands:
│                                   #   loop, plan:epic, plan:feature, plan:task, overseer, commit
│   ├── spider-factory.example.env  # what you get when you set nothing, copied to CLI/spider-factory.env on install
│   ├── install-cli.sh              # puts a real launcher on PATH and CLI/spider-factory.env down the first time
│   ├── uninstall-cli.sh            # removes that launcher, and only that launcher
│   └── src/                        # the engines bin/sf runs
│       ├── beads-loop.sh           # the dispatcher engine
│       ├── plan-agent.sh           # the planner engine — one plan agent, foreground
│       ├── overseer-agent.sh       # the reader engine — the overseer agent, foreground, `sf` denied to it
│       ├── commit.sh               # the only thing that commits, anywhere
│       ├── loop-log.sh             # one log-line definition, sourced by the engine and both hooks
│       ├── forge.sh                # GitHub vs GitLab, and which tool names the right CLI
│       ├── user-env.sh             # the loader for CLI/spider-factory.env
│       ├── clone-webs.sh           # the cloner — `npm run webs:clone`, reads webs/webs.yml, clones each repo into webs/
│       └── create-beads/           # create-gate.sh + create-task.sh, the only two things that mint an id
├── webs/                           # every web the workers build — the directory is in the repo, nothing inside it is
│   ├── .gitkeep                    # the one tracked file, so webs/ exists in a fresh checkout
│   ├── webs.example.yml            # the shipped empty list, tracked — clone-webs.sh copies it to webs.yml only when that is missing
│   └── webs.yml                    # your repo urls, gitignored — the list clone-webs.sh actually reads
├── .claude/hooks/                  # hooks.json, worker-stop.sh (fail-closed), worker-fail.sh (parks a dead worker)
├── scripts/tower-walk.sh           # experiment harness — builds a tower and walks the frontier by hand
└── .claude/shared/plan-tasks/      # the templates plan-task fills: engineer, frontend, tester-unit
```

### The three names — never interchangeable
| Name | What it is | Examples |
|---|---|---|
| **category** | a display hint, and the name of a `plan-task` template | `backend-logic`, `frontend-ux`, `unit-tests` |
| **label** | a string on a ticket, `bd create -l`. Any number may be attached; **exactly one** must be a key of the dispatcher's `AGENT` map — that one decides the worker | `backend-logic`, `frontend-ui`, `unit-tests`, `feature-test`, `epic-e2e-test`, `feature-review`, `epic-review` |
| **agent** | a real file in `agents/` | `engineer`, `frontend`, `tester-unit`, `tester-feature`, `tester-e2e`, `review`, `lead` |

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
`CLI/src/create-beads/create-gate.sh` or `CLI/src/create-beads/create-task.sh` and never from an eye: a bare
`bd create` mints a flat id, and a flat id reaches no gate. The worktree is `.claude/worktrees/<branch with / → +>`, and it belongs to
the *branch*, not the ticket.

### The moving parts, and who owns what
| Part | Owns |
|---|---|
| `CLI/src/beads-loop.sh` | the tick: read the busy branches, dispatch any ready gate its tier flag opens, `bd ready --claim`, match the one dispatching label, derive `branch` and `prTarget` off the ticket's id, publish the epic branch and PR if there is none, build the worktree, spawn the worker **with cwd inside it**, log one line per event |
| `.claude/hooks/worker-stop.sh` | **fail-closed on `$SF_DONE_FILE`**: no marker → no commit, no push, no PR, no close. Then it closes the *task*; on a gate claim (`kind=gate`) it commits and pushes, finds that branch's PR at any state, and closes the **gate** without ever opening a new PR |
| `.claude/hooks/worker-fail.sh` | the StopFailure hook: parks a dead worker's ticket in `failed-agent` with the reason, and commits nothing |
| `CLI/src/commit.sh` | **the only way anything commits in this plugin** — `sf commit` = `git add -A`, one commit subject `agent:branch:message`, `git push -u origin <branch>` |
| `CLI/src/loop-log.sh` | the one line format, sourced by the engine and both hooks: nine fixed keys, `-` for the unknown |
| `CLI/src/user-env.sh` + `CLI/spider-factory.env` | every knob; `spider-factory.example.env` is copied there on install and never touched again |
| `CLI/src/clone-webs.sh` + `webs/webs.yml` | the webs the factory builds, and nothing to do with `sf` or the installer — one repo url a line, cloned into `webs/`; `webs/webs.example.yml` is the tracked template that engine copies to `webs/webs.yml` and nothing else ever writes that file |
| `webs/` | in the repo by `.gitkeep` alone — `webs/*` is ignored, so the directory ships and the clones inside it never do |
| `agents/*.md` | the worker's own contract — the lease, never closing its own ticket, `sf commit` as it goes, the done marker last |

### Rules that break the system when broken
- **Always `bd ready --claim`**, never a bare `bd ready` — it is not atomic and two loops steal the ticket.
- **Never dispatch on a guess** (zero or two dispatching labels → left claimed, never a chosen worker), and
  **never invent a branch** (no `branch` in the claim → left claimed). Left claimed is deliberate: the lease
  parks the unworkable ticket off the frontier instead of the loop spinning on it.
- **Never work two tickets on one branch at a time.** The chain inside a feature guarantees it; the loop's
  unclaim-and-skip is the fallback, not the mechanism.
- **Nobody but the Stop hook closes a task, and no worker closes its own** — a ticket already closed makes the
  hook exit before it commits, so the work never lands. Only a human closes a gate, unless its tier's flag is on.
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
