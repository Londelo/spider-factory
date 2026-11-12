### Summary
Binary Obelisk is a plugin in the High Magic marketplace: an SDL toolkit for building web applications with
Claude Code, driven by Beads (`bd`). You plan a tower of tickets top-down, then one command turns that tower
into background workers — each ticket claimed, worked on its own branch, committed, pushed, and put up as a
pull request — while you stay out of the way and close the gates when a tier is proved.

### Source of truth — read this first
**The code is the only source of truth.** [`diagram/`](./diagram/) is its **translated** source of truth: the
account a human reads when they are not in the code, and the thing people quote, so it must not drift. This
file is neither — it is a pointer and a vocabulary list. It holds no fact you cannot get from the code, and
when it disagrees with either of the two above, it is wrong.

| You want | Go to |
|---|---|
| what a thing actually does | the file it lives in |
| the system in human terms — the machine, the tower, the workers, every alarm | `diagram/model.c4`, and the four walkthroughs in `diagram/views.c4` (`index` the plan · `theLoop` the run · `theLogs` the log · `everyFailure` the alarms) |
| how to edit those diagrams without breaking them | `diagram/REFERENCE.md` |
| the words that mean something specific here | below |

### File structure
```
plugins/binary-obelisk/
├── .claude-plugin/plugin.json      # manifest
├── .claude/diagram/                # the translated source of truth — likec4 model, views, build.sh, dist/
├── agents/                         # 7 tower agents + 3 plan agents
├── skills/                         # bead-initialize, bead-create, bead-read, bead-comment, overseer,
│                                   #   setup-cli, pr-comments, standards-{coding,naming,errors,file-organization},
│                                   #   framework-{jest,playwright}
├── CLI/                            # the `bo` package — bash, no node
│   ├── bin/bo                      # five commands: loop, plan:epic, plan:feature, plan:task, commit
│   ├── beads-loop.sh               # the dispatcher engine
│   ├── plan-agent.sh               # the planner engine — one plan agent, foreground
│   ├── commit.sh                   # the only thing that commits, anywhere
│   ├── loop-log.sh                 # one log-line definition, sourced by the engine and both hooks
│   ├── forge.sh                    # GitHub vs GitLab, and which tool names the right CLI
│   ├── user-env.sh + default.env   # the loader for ~/.obelisk.env, and what it holds
│   └── install-cli.sh              # puts a real launcher on PATH and ~/.obelisk.env down the first time
├── hooks/                          # hooks.json, worker-stop.sh (fail-closed), worker-fail.sh (parks a dead worker)
├── scripts/tower-walk.sh           # experiment harness — builds a tower and walks the frontier by hand
└── shared/plan-tasks/              # the templates plan-task fills: engineer, frontend, tester-unit
```

### The three names — never interchangeable
| Name | What it is | Examples |
|---|---|---|
| **category** | a display hint, and the name of a `plan-task` template | `backend-logic`, `frontend-ux`, `unit-tests` |
| **label** | a string on a ticket, `bd create -l`. Any number may be attached; **exactly one** must be a key of the dispatcher's `AGENT` map — that one decides the worker | `backend-logic`, `frontend-ui`, `unit-tests`, `feature-test`, `epic-e2e-test`, `feature-review`, `epic-review`, `epic-merge-pr` |
| **agent** | a real file in `agents/` | `engineer`, `frontend`, `tester-unit`, `tester-feature`, `tester-e2e`, `review`, `merge` |

The three test labels are three **tiers**, and there the three names collapse to one string — the node key IS
the label IS the category — while the agent carries its own name: `unit-tests` → `tester-unit` (micro, one
function alone), `feature-test` → `tester-feature` (composition, one feature's pieces wired), `epic-e2e-test` →
`tester-e2e` (broad, journeys across features on the real stack). The binding lives only in the `AGENT` map;
nothing derives an agent name from a label. A tier is named for the **test**, never the tester and never the
framework — a tier owns *what to cover and how deep*, and a `framework-*` skill owns *the tool*. That is why no
ticket description carries framework syntax, and why a mis-labelled ticket silently gets the wrong depth.

### The tower, in one breath
Every node is a real beads issue; types are `gate` and `task`. Epic gate (the *what*) → feature gates (one
complete user-facing flow each) → each feature's tasks in **one linked line, never a fan**: logic, then its
micro tests, then the UI. Then the composition suite, then the review, then the gate. At the epic: one merge
ticket assembles the finished feature branches, then the broad suite, then the review, then the gate.

**Gates are checkpoints, not work.** `bd ready` never shows one. A gate does not block its own children — what
holds the next tier off the frontier is an explicit `blocked-by` edge onto the gate itself, and **only a human
closes a gate**, so the tower waits there until someone verifies it. There is no `human` agent; nothing is ever
spawned for the person.

### Branches — one per epic, one per feature; a task is a commit
No branch per ticket and none per worker. Two metadata keys, and only one is the plan's: **`branch`** (written
by the plan agent that owns the tier, copied verbatim down every row of it) and **`pr`** (the url, written by
the loop or the Stop hook — never by a plan agent). A PR's **base is not a key at all**: it is the epic gate's
own `branch`, found by walking the parent chain, `main` when the ticket hangs under the topmost gate. The
worktree is `.claude/worktrees/<branch with / → +>`, and it belongs to the *branch*, not the ticket.

### The moving parts, and who owns what
| Part | Owns |
|---|---|
| `CLI/beads-loop.sh` | the tick: read the busy branches, `bd ready --claim`, match the one dispatching label, read `branch` and the PR base off the claim and its gate, publish the epic branch and PR if there is none, build the worktree, spawn the worker **with cwd inside it**, log one line |
| `hooks/worker-stop.sh` | **fail-closed on `$BO_DONE_FILE`**: no marker → no commit, no push, no PR, no close. Then it closes the *task* |
| `hooks/worker-fail.sh` | parks a dead worker's ticket in `failed-agent` with the reason, and commits nothing |
| `CLI/commit.sh` | **the only way anything commits in this plugin** — `bo commit` = `git add -A`, one commit subject `agent:branch:message`, `git push -u origin <branch>` |
| `CLI/loop-log.sh` | the one line format, sourced by the engine and both hooks: nine fixed keys, `-` for the unknown |
| `CLI/user-env.sh` + `~/.obelisk.env` | every knob; `default.env` is copied there on install and never touched again |
| `agents/*.md` | the worker's own contract — the lease, never closing its own ticket, `bo commit` as it goes, the done marker last |

### Rules that break the system when broken
- **Always `bd ready --claim`**, never a bare `bd ready` — it is not atomic and two loops steal the ticket.
- **Never dispatch on a guess** (zero or two dispatching labels → left claimed, never a chosen worker), and
  **never invent a branch** (no `branch` in the claim → left claimed). Left claimed is deliberate: the lease
  parks the unworkable ticket off the frontier instead of the loop spinning on it.
- **Never work two tickets on one branch at a time.** The chain inside a feature guarantees it; the loop's
  unclaim-and-skip is the fallback, not the mechanism.
- **Nobody but the Stop hook closes a task, and no worker closes its own** — a ticket already closed makes the
  hook exit before it commits, so the work never lands. Only a human closes a gate.
- **`failed-agent` and `gate` are per-database custom settings.** `bd` accepts an unknown type or status
  silently and then refuses it, so a broken gate and a working one look identical. `bead-initialize` registers
  both; an older tower needs the two `bd config set` lines run in it.
- **No agent file hardcodes a beads query.** Reading, authoring and commenting belong to the skills; an agent
  file names the skill to load. The two commands a worker runs about itself — `bd heartbeat` and `bo commit` —
  are named in its own file, because nothing else is theirs to name.
- **Workers run `bypassPermissions` unattended** → only run the loop in a repo you fully trust.
