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
├── skills/                               # setup, initialize-beads, pr-comments, standards-*, read-bead, create-bead, framework-jest, framework-playwright, …
├── standards/                            # coding/review standards
├── CLI/                                  # the `bo` command — a bin package, no node, installed by a launcher script
│   ├── bin/bo                            # the entrypoint `bo` — one command, `bo loop`, foreground
│   ├── beads-loop.sh                     # the claim-beads dispatcher engine
│   └── install-cli.sh                    # writes a real launcher onto PATH (not a symlink, so it survives uninstall)
├── scripts/tower-walk.sh                 # experiment harness — builds a tower and walks the frontier by hand
└── shared/                               # plan-task and review templates/formats — the three test-tier templates are tester-unit.md, tester-feature.md, tester-e2e.md
```

### The three names — never interchangeable
| Name | What it is | Examples |
|---|---|---|
| **category** | display hint in `bd list`; names a plan-task template | `backend-logic`, `frontend-ux`, `unit-tests`, `feature-test`, `epic-e2e-test`, `review`, `merge` |
| **label** | a string attached with `bd create -l`. A ticket may carry any number of them, but exactly one must be a name the `AGENT` map holds — that is the **dispatching** label, and it alone decides the worker | `backend-logic`, `frontend-ui`, `unit-tests`, `feature-test`, `epic-e2e-test`, `feature-review`, `epic-review`, `feature-merge-pr`, `epic-merge-pr` |
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
| `tester-unit` | **micro tier** — one function alone; every branch, boundary, empty/null, error | s b w | ✓ | **read-bead**, coding, files, naming, errors, **framework-jest** |
| `tester-feature` | **composition tier** — one feature's pieces proved wired; its errors/successes surface | s b w | ✓ | **read-bead**, coding, files, naming, errors, **framework-playwright** |
| `tester-e2e` | **broad tier** — journeys across features on the real stack; cross-feature state, one success+failure per feature | s b w | ✓ | **read-bead**, coding, files, naming, errors, **framework-playwright** |
| `review` | **three questions, from first principles** — does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system the change sits in (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments — files no tickets, and commits or pushes nothing | s b w | ✓ | **read-bead**, coding, files, naming, errors, **pr-comments** |
| `merge` | assembles a merge ticket's child branches onto one integration branch, resolves the conflicts between them, runs the tests and reports — writes no code, no tests; never merges into `main`, never opens a PR | s b w | ✓ | **read-bead** |

**Tiers vs. tools.** A test agent owns a **tier** — what to cover and how deep — and is deliberately
agnostic about the framework. A `framework-*` skill owns the **tool**: syntax, config, run and debug
commands (`framework-jest`, `framework-playwright`). That is why no ticket description carries
framework syntax, and why the feature and epic tiers load the *same* skill: they differ in scope, not
in spelling. The three tiers must never overlap — one test per behavior, at the tier that owns that
depth; each test template's `Owned Elsewhere` field is how the boundary survives contact with a plan.

**There is no `human` agent.** The person enters through **gates** and closes them; nothing is
spawned for them. `plan-epic`/`plan-feature`/`plan-task` build the tower and do no work in it;
`initialize-beads` and `stand` are utilities outside the tower.

### Tower — beads issue hierarchy
Every node is a real beads issue; types are `gate` and `task`. bd does **not** reject an
unregistered type — it accepts `gate` and hides it — so a broken gate and a working one look
identical; register it (`bd config set types.custom "gate"`) and check `bd types` before you trust it.

```
Epic  (gate — the "what"; the human closes it once epic-review is done)
 ├── epic-merge-pr (merge) → epic-e2e-test (tester-e2e, respawn) → epic-review (review)
 └── Feature  (gate — one complete user-facing flow; human closes it once feature-review is done)
      ├── feature-merge-pr (merge) → feature-test (tester-feature, respawn) → feature-review (review)
      └── backend-logic (engineer, respawn) · frontend-ui (frontend, respawn) → unit-tests (tester-unit, respawn)
```

Arrows are the `depends-on` chain and read left to right, oldest first. **Merge is always first** — the
tower assembles the children into one branch, resolves what clashed, and only then proves the result.
Nothing is ever proved against a lone branch, which is why the merge ticket sits at the head of its chain.

**Gates are checkpoints, not work.** `bd ready` never shows a gate — it is structurally invisible,
so there is nothing to exclude. A gate does **not** block its own children: they are claimable while
the gate is open (verified — the feature's base tasks were claimed with its gate still open). What
holds the *next* tier off the frontier is an explicit `blocked-by` edge onto the gate itself, and only
a human closes a gate — so the tower stalls there until they verify and close it. A claimable ticket
assigned to a human is a model bug.

**Respawn** (`respawn-agent: true` — on the five worker nodes above) means a fresh session of the
same agent re-checks the work before the ticket may close. It is a **step inside that one
ticket**, never a second ticket: one ticket, one worker.

### Dependencies
- `epic-merge-pr` waits on the feature gates; then `epic-e2e-test → epic-review`.
- `feature-merge-pr` and `unit-tests` both wait on `backend-logic` **and** `frontend-ui`;
  `feature-test` waits on `feature-merge-pr`; `feature-review` waits on `feature-test`.
- Nothing is proved against a lone branch. The merge ticket assembles the children first, and every
  tier above it is proved against that assembled result.
- `backend-logic` and `frontend-ui` have no deps — they are the frontier, claimed first.
- Extra `blocks` edges order features against features and tasks against tasks.
- Release order (bottom → top): base tasks → feature tasks → human closes feature → epic tasks →
  human closes epic → thumbs-up on the merged epic PR.

### Plan agents (top-down build)
1. **plan-epic** — vague idea → clarifying questions → research → exactly one epic.
2. **plan-feature** — epic → feature-sized features (complete user-facing flows), `parent-child`
   to the epic, phased foundations → core → dependent → polish.
3. **plan-task** — feature → its tasks, each `parent-child` to the feature, **labeled at creation**
   with `bd create -l <label>` and verified with a `bd show --json` round trip per ticket.

### The dispatcher — CLI/beads-loop.sh
The contract file `claim-beads-loop.md` was deleted in commit `fc49051` and exists nowhere else —
this section and the YAML are the only remaining accounts of the dispatcher's behaviour.

Every tick it claims one ticket with
`bd ready --claim`, matches its single label against the `AGENT` map, spawns
`claude --bg -w <ticket> --agent <agent> --permission-mode bypassPermissions` — Claude makes the
worktree itself, the loop builds no folders — logs one line, and moves on. The worker prompt hands
the worker four rules — keep the lease alive, never close the ticket (report in the final message
instead), comment what remains, and spawn nothing — and nothing more; the loop itself never polls a worker, never reads
output, never reaps, never merges, never ends itself.

- **Never guesses a specialist:** zero or two dispatching labels → `ERROR reason=label-ambiguous`, left claimed
  so its lease parks it off the frontier, and the errors file is the alarm.
- **Capacity** is counted fresh each tick from `claude agents --json` (background sessions under
  this project, minus finished ones); at capacity with nothing `in_progress` logs `max_parallel_stalled`.
- **An empty frontier is two states, and the waiting line names which:** `reason=frontier_empty`
  (nothing left to do) vs `reason=tower_stalled waiting=N` (work exists but sits off the frontier
  behind an open blocker — an open gate, most often, which only a human can clear). `tick()` probes
  the difference with `bd list --status open,blocked --limit 0`.
- **Waiting lines are capped at one a minute per reason**; errors are never capped.
- Workers run `bypassPermissions` unattended → **only run this loop in a repo you fully trust**.

### Key Beads Commands
| Command | Purpose |
|---|---|
| `bd init` (with `BD_NON_INTERACTIVE=1`) | create the DB |
| `bd where` | which DB a directory resolves (bd walks **up**; it ignores your `BEADS_DIR`) |
| `bd create -t <type> -l <label> --parent <id>` | create a node under its parent (`--deps parent-child:<id>` also works; the `type:parent-child:` form is rejected) |
| `bd dep add <a> <b> --type blocks` | order two nodes |
| `bd dep tree <id>` | show the dependency tree |
| `bd ready --claim` | atomically claim the next unblocked ticket |
| `bd heartbeat <id>` | the worker keeps its lease alive — it never closes its own ticket |

### Rules
- Always `bd ready --claim`, never a bare `bd ready` (not atomic — two loops would steal the ticket).
- Never dispatch on a guess; never dispatch a gate (they are invisible to `bd ready` anyway). Merge
  tickets ARE dispatched — the `AGENT` map names `merge` for both merge labels, so they are claimed
  and worked like any other stamp; there is no exclusion filter at the claim.
- Respect the chains: no test tier before its merge, no review before its tests, no gate closed before
  its review. Merge first, then tests, then review, then a human closes the gate.
- The human closes the gates. No agent closes anything: workers leave their ticket open and report in
  their final message; the human reads the report, verifies, and closes. A self-closed ticket is a bug.
