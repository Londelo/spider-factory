### Summary
Binary Obelisk is a plugin in the High Magic marketplace: an SDL toolkit for building web
applications with Claude Code, orchestrated through Beads (`bd`). It ships the agents that do
the work, the plan agents that build the ticket tower, the coding/review standards, and the
claim-beads dispatcher that turns tickets into background workers.

### Source of truth
[`.claude/binary-obelisk-v1-design.yaml`](./binary-obelisk-v1-design.yaml) is the design model —
databases, skills, agents, tasks. `.claude/CLAUDE.md` (this file) is transcribed from it; when
the two disagree, the YAML wins. The dispatcher's contract is now this section plus
[`CLI/beads-loop.sh`](../CLI/beads-loop.sh) itself — `claim-beads-loop.md` was deleted in
commit `fc49051` and exists nowhere else. **None of these are read at runtime** — the loop's only
input is the beads database.

### File Structure
```
plugins/binary-obelisk/
├── .claude-plugin/plugin.json            # manifest
├── .claude/binary-obelisk-v1-design.yaml # EDITABLE design model
├── agents/                               # engineer, frontend, tester-unit, tester-feature, tester-e2e, review, merge + 3 plan agents
├── skills/                               # bead-read, bead-create, bead-initialize, bead-heartbeat, setup-cli, pr-comments, standards-*, framework-jest, framework-playwright
├── standards/                            # coding/review standards
├── CLI/                                  # the `bo` command — a bin package, no node, installed by a launcher script
│   ├── bin/bo                            # the entrypoint `bo` — one command, `bo loop`, foreground
│   ├── beads-loop.sh                     # the claim-beads dispatcher engine
│   ├── forge.sh                          # detects GitHub vs GitLab and names the right tool; sourced by the engine and the Stop hook
│   ├── loop-log.sh                       # the one log-line definition, sourced by the engine AND both hooks
│   └── install-cli.sh                    # writes a real launcher onto PATH (not a symlink, so it survives uninstall)
├── scripts/tower-walk.sh                 # experiment harness — builds a tower and walks the frontier by hand
└── shared/plan-tasks/                    # the three task templates plan-task fills: engineer.md, frontend.md, tester-unit.md
```

### The three names — never interchangeable
| Name | What it is | Examples |
|---|---|---|
| **category** | display hint in `bd list`; names a plan-task template | `backend-logic`, `frontend-ux`, `unit-tests`, `feature-test`, `epic-e2e-test`, `review`, `merge` |
| **label** | a string attached with `bd create -l`. A ticket may carry any number of them, but exactly one must be a name the `AGENT` map holds — that is the **dispatching** label, and it alone decides the worker | `backend-logic`, `frontend-ui`, `unit-tests`, `feature-test`, `epic-e2e-test`, `feature-review`, `epic-review`, `epic-merge-pr` |
| **agent** | a real file in `agents/` | `engineer`, `frontend`, `tester-unit`, `tester-feature`, `tester-e2e`, `review`, `merge` |

A task may list two categories; a ticket has exactly one dispatching label. The three test labels are three
**tiers**, each with its own agent. There the label and the category deliberately collapse to **one
string** — the node key IS the label IS the category — while the agent carries its own name, `tester-` plus
the scope it owns: `unit-tests` → `tester-unit` (micro), `feature-test` → `tester-feature` (composition),
`epic-e2e-test` → `tester-e2e` (broad). That binding lives only in the dispatcher's `AGENT` map; nothing
derives an agent name from a label. A tier is named for the **test**, never the tester and never
the framework. That is exactly why the label — not `--agent` — has to carry the tier: a ticket
mis-labeled one tier up or down gets the wrong depth of coverage, and no worker can tell you it did.

### Agents (the spokes)
| Agent | Does | Spawn | Certify | Skills |
|---|---|---|---|---|
| `engineer` | business logic, endpoints, hooks, types, error factories | s b w | ✓ | files, naming |
| `frontend` | components, layout, styling, component system | s b w | ✓ | coding, files, naming |
| `tester-unit` | **micro tier** — one back-end function alone; every branch, boundary, empty/null, error; never a component (the UI is proved by the composition tier) | s b w | ✓ | **bead-heartbeat**, **bead-read**, coding, files, naming, errors, **framework-jest** |
| `tester-feature` | **composition tier** — one feature's pieces proved wired; its errors/successes surface | s b w | ✓ | **bead-heartbeat**, **bead-read**, coding, files, naming, errors, **framework-playwright** |
| `tester-e2e` | **broad tier** — journeys across features on the real stack; cross-feature state, one success+failure per feature | s b w | ✓ | **bead-heartbeat**, **bead-read**, coding, files, naming, errors, **framework-playwright** |
| `review` | **three questions, from first principles** — does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system the change sits in (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments — files no tickets, and commits or pushes nothing | s b w | ✓ | **bead-heartbeat**, **bead-read**, coding, files, naming, errors, **pr-comments** |
| `merge` | **epic tier only** — assembles the epic's finished feature branches onto the epic branch, resolves the conflicts between them, runs the tests and reports — writes no code, no tests; never merges into `main`, never opens a PR | s b w | ✓ | **bead-heartbeat**, **bead-read** |

**Tiers vs. tools.** A test agent owns a **tier** — what to cover and how deep — and is deliberately
agnostic about the framework. A `framework-*` skill owns the **tool**: syntax, config, run and debug
commands (`framework-jest`, `framework-playwright`). That is why no ticket description carries
framework syntax, and why the feature and epic tiers load the *same* skill: they differ in scope, not
in spelling. The three tiers must never overlap — one test per behavior, at the tier that owns that
depth; each test template's `Owned Elsewhere` field is how the boundary survives contact with a plan.

**There is no `human` agent.** The person enters through **gates** and closes them; nothing is
spawned for them. `plan-epic`/`plan-feature`/`plan-task` build the tower and do no work in it;
`bead-initialize` and `setup-cli` are utilities outside the tower.

### Tower — beads issue hierarchy
Every node is a real beads issue; types are `gate` and `task`. bd does **not** reject an
unregistered type — it accepts `gate` and hides it — so a broken gate and a working one look
identical; register it (`bd config set types.custom "gate"`) and check `bd types` before you trust it.

```
Epic  (gate — the "what"; the human closes it once epic-review is done)      epic/<slug> → PR → main
 ├── epic-merge-pr (merge) → epic-e2e-test (tester-e2e, respawn) → epic-review (review)
 └── Feature  (gate — one complete user-facing flow; human closes it once feature-review is done)
 │                                                                            feature/<slug> → PR → the epic branch
      ├── feature-test (tester-feature, respawn) → feature-review (review)
      └── backend-logic → unit-tests → frontend-ui → (more backend-logic → unit-tests …)
          (engineer, tester-unit, frontend — each respawned; the micro tier tests back-end functions only)
```

Arrows are the `depends-on` chain and read left to right, oldest first. **A feature's tasks are one
linked line, never a fan** — each waits on the one before it, so the frontier can only ever hand out one
task per feature and the branch is never written by two workers at once. Two features still run side by
side; a feature runs alone. **The order inside the line is the logic, then its tests, then the UI** — a
`unit-tests` ticket waits on the back-end ticket it tests and is claimed before anything is built on that
function, and the UI ticket comes after the logic holds. The last task — the UI — is what unblocks
`feature-test`, then review, then the gate.

**Gates are checkpoints, not work.** `bd ready` never shows a gate — it is structurally invisible,
so there is nothing to exclude. A gate does **not** block its own children: they are claimable while
the gate is open (verified — the feature's base tasks were claimed with its gate still open). What
holds the *next* tier off the frontier is an explicit `blocked-by` edge onto the gate itself, and only
a human closes a gate — so the tower stalls there until they verify and close it. A claimable ticket
assigned to a human is a model bug.

**Respawn** (`respawn-agent: true` — on the five worker nodes above) means a fresh session of the
same agent re-checks the work before the ticket may close. It is a **step inside that one
ticket**, never a second ticket: one ticket, one worker.

### Branches — one per epic, one per feature; a task is a commit
There is no branch per ticket, and no branch per worker. **Two metadata keys, and only one is the plan's**:
`branch` (the branch this ticket's work lands on — the gate's own value, copied verbatim onto every row of
that gate's tier) and `pr`, the url of the PR that exists on that branch: no plan agent writes it —
the loop writes it onto the epic gate when it publishes that branch, and `hooks/worker-stop.sh` writes it
onto each ticket whose work landed (it used to go in `notes`; it does not go there any more).
**A PR's base is not a key at all**: it is the epic gate's own `branch`, and the parent chain names that
gate (ticket → feature → epic), so the loop walks up and reads it there — `main` when the ticket hangs
under the epic itself. It used to be copied down onto every ticket as `epicBranch`; that copy is gone,
because a copy can drift from the gate it copies and nothing compared the two — the loop published one
while the hook aimed at the other. Branch names are `epic/<slug>` / `feature/<slug>`, 2–4 lowercase words
saying what the thing *is*; a colliding sibling gets **different words**, never `-2`. A task's ticket copies
its feature's `branch` verbatim — three tasks inventing three names is three branches and one feature.

| Fact | Where it lives | Who reads it |
|---|---|---|
| `branch` | the ticket's `metadata`, written by `plan-*` | the loop reads `.[0].metadata.branch` off the claim and hands it down as `BO_BRANCH` — nothing re-derives it and nothing parses text |
| `pr` | the same `metadata`, written by the loop (epic gate) or the Stop hook (any ticket) | a human, and the hook when it looks for the PR already on a branch — verified: `bd update --set-metadata` **merges**, so it never disturbs the plan's `branch` |
| the PR's base | the **epic gate's** `branch`; `main` when the claim's own parent is that topmost gate | `tick()` walks `.[0].parent` (helper `epicGateOf`, two hops at most), reads it via `readFieldOf`, and hands it down as `BO_PR_TARGET`; an orphaned feature is topmost itself, so it targets `main` |
| the worktree | `.claude/worktrees/<branch with / → +>` | the loop creates it for the branch's first task, every later task re-enters it |
| the PR | head = `branch`, base = the epic's `branch` (`main` at the epic tier) | `hooks/worker-stop.sh` creates it once per branch and reuses it after that |

`metadata` is a structured field of the `bd ready --claim --json` payload, so the keys arrive exact and
in one query — unlike `external_ref`, which round-trips through `bd show` but is **absent** from the claim.
A ticket missing `branch` is left claimed and logged `ERROR reason=metadata-missing`, exactly like a
mislabelled one.

**The epic branch has no other publisher.** Nothing but the loop ever pushes `epic/<slug>` or opens its PR
into `main`, and every feature PR below it targets that branch — so `tick()` walks the claim's `parent`
chain to the epic gate and, when the gate carries no `pr`, pushes the gate's branch off `main`, opens the
PR, and writes the url onto the gate as `pr` (`ensureEpicGatePr`). Where that cannot happen the ticket is
LEFT CLAIMED and the run logs `ERROR reason=epic-pr-failed step=…` (`walk`, `gate-branch`, `forge`,
`missing-tool`, `push`, `pr`, `annotate`): a worker spawned under an epic branch that does not exist burns
a slot and files a commit nobody can pull.

### Dependencies
- `epic-merge-pr` waits on the feature gates; then `epic-e2e-test → epic-review`.
- Inside a feature: the tasks form one chain in this order — `backend-logic` → its `unit-tests` →
  `frontend-ui` → (more back-end with its test …) → `feature-test` waits on the **last** task,
  `feature-review` waits on `feature-test`, the gate waits on the review. The micro tier follows the
  back-end ticket it tests and never a component; the UI is built last, against functions already proved.
- Nothing is proved against half a feature: the suite runs only after every task has landed on the
  feature branch, and the review only after the suite.
- The first task of each feature has no deps — with several features it is the frontier, and they are
  claimed together; the rest of a feature's line opens one ticket at a time.
- Extra `blocks` edges order features against features.
- Release order (bottom → top): a feature's tasks in order → its suite → its review → human closes the
  feature (its PR merges into the epic branch) → the epic merge assembles the feature branches →
  epic e2e → epic review → human closes the epic → thumbs-up on the merged epic PR.

### Plan agents (top-down build)
Each plan agent writes exactly one metadata key — its own gate's `branch` — onto that gate and copied
verbatim onto the rows of its own tier; no plan agent writes a `pr`, and none writes a PR base.

1. **plan-epic** — vague idea → clarifying questions → research → exactly one epic, and its
   `epic/<slug>` written onto the gate and its three tickets as their **only** key, `branch`.
2. **plan-feature** — epic → feature-sized features (complete user-facing flows), `parent-child`
   to the epic, phased foundations → core → dependent → polish; each feature gets its own
   `feature/<slug>`. An orphaned feature (the human said there is no epic) has no epic gate above it, so
   its PR aims at `main`.
3. **plan-task** — feature → its tasks, each `parent-child` to the feature, **labeled at creation**
   with `bd create -l <label>`, the feature's `branch` copied **verbatim** (a plan agent never
   invents a branch name below its own tier), the tasks chained onto their predecessor, and every
   ticket verified with a `bd show --json` round trip.

### The dispatcher — CLI/beads-loop.sh
The contract file `claim-beads-loop.md` was deleted in commit `fc49051` and exists nowhere else —
this section and the YAML are the only remaining accounts of the dispatcher's behaviour.

Each tick: read the branches already at work (`branchesCurrentlyAtWork`), claim with
`bd ready --claim`, match the single label against the `AGENT` map, read `branch` (and `parent`) off the
claim, walk that parent to the epic gate and read the PR base off the gate itself (`main` when the claim's
parent **is** that topmost gate — the tick tests it with `[[ "$gateId" == "$claimParent" ]]`), publish the
epic gate's branch and PR if it has none
(`ensureEpicGatePr <gate-id>` — see §Branches), make sure that branch's worktree exists (`ensureWorktree` → `git worktree add` under
`.claude/worktrees/`, starting at `origin/<branch>` else `origin/<base>` else `<base>` else `HEAD`),
then spawn `claude --bg --agent <agent> --permission-mode bypassPermissions` **with cwd inside that
worktree** — no `-w`, because claude's `--worktree` only ever *creates* one and this branch already owns
its own. That is a deliberate reversal of the old rule "Claude makes the worktree, the loop builds no
folders": the loop owns the folders now, because a worktree belongs to a *branch*, not to a ticket.
Then it logs one line and moves on. The worker prompt hands the worker six rules — keep the lease alive,
never close the ticket (report in the final message instead), comment what remains, spawn nothing, stay
on your branch and never commit/branch/merge/push, and `touch $BO_DONE_FILE` as the very last action
**only** if the brief is genuinely complete — and nothing more; the loop itself never polls a worker,
never reads output, never reaps, never merges, never ends itself.

- **One pair of hands per branch.** `BO_DONE_FILE` is the worker's declaration, and
  `hooks/worker-stop.sh` is **fail-closed** on it: no marker → no commit, no push, no PR, no close, and
  `ERROR reason=not-declared-done`. The ticket stays claimed so its lease parks it off the frontier and
  every task chained behind it waits. The graph makes a feature sequential; this guard is the fallback
  for a tower that wasn't chained — a claimed ticket whose branch is already at work goes straight back
  (`bd unclaim`) and the tick tries the next one, up to `max_parallel + 2` claims per tick.
- **Never guesses a specialist:** zero or two dispatching labels → `ERROR reason=label-ambiguous`, left claimed
  so its lease parks it off the frontier, and the errors file is the alarm.
- **Never invents a branch:** no `branch` in the claim's `metadata` → `ERROR reason=metadata-missing`,
  same treatment. The PR base is never missing from a ticket because it is never on one; the two ways it can
  fail to resolve are a gate carrying no `branch` of its own (`reason=epic-pr-failed step=gate-branch`) and a
  claim with no parent to walk (`step=walk`), both left claimed.
  `reason=worktree-failed` (left claimed) and `reason=worker-not-dispatched` (unclaimed) are
  the others, plus `reason=epic-pr-failed step=…` (§Branches). The Stop hook's own alarm for a target the
  loop never handed down is `reason=no-pr-target` — named for the target, since `pr` now means the url.
- **Capacity** is counted fresh each tick from `claude agents --json` (background sessions whose `cwd`
  is under this tower's `.claude/worktrees`, plus the tower itself, minus finished ones); at capacity
  with nothing `in_progress` logs `max_parallel_stalled`.
- **An empty frontier is two states, and the waiting line names which:** `reason=frontier_empty`
  (nothing left to do) vs `reason=tower_stalled waiting=N` (work exists but sits off the frontier
  behind an open blocker — an open gate, most often, which only a human can clear). `tick()` probes
  the difference with `bd list --status open,blocked --limit 0`. `reason=branch_busy held=N` is the
  third: tickets exist and are claimable, but every branch they want is already working.
- **Waiting lines are capped at one a minute per reason**; errors are never capped.
- Workers run `bypassPermissions` unattended → **only run this loop in a repo you fully trust**.

### The log — CLI/loop-log.sh
One directory per run under `BO_LOG_ROOT` (`~/.binary-obelisk/logs/<date_time>` — the binary obelisk
is the central home for everything the loop leaves behind). The engine creates **every** file up
front, so a missing file and an empty file look the same and neither hides a silent failure:
`claims`, `errors`, `waiting`, `results`, `closes`, `failures`, plus `spawn-<ticket>` (that one
worker's raw spawn output) and `done-<ticket>` (the worker's own declaration).

`CLI/loop-log.sh` is the single definition of a line, **sourced by the engine and by both hooks** —
one format for the whole system, or the files cannot be read against each other:

```
<tag padded to 8> <ISO time>\trun=… repo=… ticket=… label=… agent=… branch=… target=… session=… worktree=… <detail>
```

Those nine keys are the whole contract and they are on **every line of every file**, `"-"` for
whatever is not known at that moment — an absent field would be indistinguishable from a field
nobody set, and an error line is worth nothing if it cannot say what it happened to. The engine
sets them as a claim resolves (`boIdent` at each step, `boClearIdentity` at the top of every attempt
so no line inherits a ticket from the tick before); the hooks set theirs from the `BO_*` environment
the spawn carried plus the `session_id` the hook input hands them. So an `errors` line names the
ticket, the label, the specialist, the branch, its PR target, the repo and the session, and the same
keys lead from it into `claims` (what was taken), `closes` (what landed) or `failures` (what died)
by grep alone.

- **`session=` is the id `claude --bg` prints** (`backgrounded · 287d3c4c`), read off that worker's
  own `spawn-<ticket>` file by `sessionFromSpawn`. It used to go into one shared `last-spawn` that
  every spawn overwrote, so the id survived only for the run's final worker — the one thing a human
  needs to `claude attach`, read logs of, or stop. The hooks log the same id from their own hook
  input, which is what ties a Stop alarm to the claims line that spawned it.
- **`agent=` and `label=` reach the hooks** because the spawn line carries `BO_AGENT` and `BO_LABEL`;
  the hook cannot look a specialist up from anything else.
- A value beyond the nine keys (a `step=`, a `gate=`, an exit code, `msg=`) is passed as detail to
  `logTo`, never added to the identity — the key set is closed, or joining stops working.
- The engine sets identity from the **claim in hand**; `ensureEpicGatePr` logs no ticket of its own
  for that reason, and the epic gate's own branch is `gateBranch=` on the line, never `branch=` —
  that key belongs to the claim, and the two differ.
- The hooks write with `BO_LOG_QUIET=1` (a hook must not print into a session); the engine leaves it
  unset and every line also goes to the terminal.

### Key Beads Commands
| Command | Purpose |
|---|---|
| `bd init` (with `BD_NON_INTERACTIVE=1`) | create the DB |
| `bd where` | which DB a directory resolves (bd walks **up**; it ignores your `BEADS_DIR`) |
| `bd create -t <type> -l <label> --parent <id>` | create a node under its parent (`--deps parent-child:<id>` also works; the `type:parent-child:` form is rejected) |
| `bd dep add <a> <b> --type blocks` | order two nodes |
| `bd dep tree <id>` | show the dependency tree |
| `bd ready --claim` | atomically claim the next unblocked ticket |
| `bd unclaim <id>` | put a claim back — the loop does this when the branch it just claimed is already working |
| `bd heartbeat <id>` | the worker keeps its five-minute lease alive (verified: claim stamps `lease_expires_at` +5 min, heartbeat pushes it out another five) — it never closes its own ticket; the reaper (`bd reclaim`, supervisor-run) is what recycles a lapsed one |

### Rules
- Always `bd ready --claim`, never a bare `bd ready` (not atomic — two loops would steal the ticket).
- Never dispatch on a guess; never dispatch a gate (they are invisible to `bd ready` anyway). The one
  merge ticket, `epic-merge-pr`, IS dispatched — the `AGENT` map names `merge` for it, so it is claimed
  and worked like any other stamp; there is no exclusion filter at the claim.
- Never work two tickets on one branch at a time. The chain inside a feature is what guarantees it; the
  loop's unclaim-and-skip is the fallback, not the mechanism.
- Respect the chains: one task at a time onto the feature branch, no suite before the last task landed,
  no review before the suite, no gate closed before its review, nothing assembled until the feature
  gates close. Tests, then review, then a human closes the gate.
- The human closes the gates. No agent closes anything a worker can close: workers leave their ticket
  open and report in their final message; the human reads the report, verifies, and closes. A
  self-closed ticket is a bug. The Stop hook closes a *task* only on its done marker — a worker that
  touches that marker before the brief is complete has filed half a task onto a shared branch, which is
  the one failure this model cannot undo on its own.
- No agent file hardcodes a beads command. Commands belong to the skills — `bead-read`, `bead-create`,
  `bead-initialize`, `bead-heartbeat` — and an agent file carries only the descriptor plus the skill to
  load, so the worker references the skills context instead of duplicating commands into the context
  window. Where a command must be forbidden, the rule names the act (`never unclaim`, `never reopen`),
  not the invocation. The loop and the hooks are not agents; they run the commands directly.
