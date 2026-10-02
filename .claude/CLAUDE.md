### Summary
Binary Obelisk is a plugin in the High Magic marketplace: an SDL toolkit for building web
applications with Claude Code, orchestrated through Beads (`bd`). It ships the agents that do
the work, the plan agents that build the ticket tower, the coding/review standards, and the
claim-beads dispatcher that turns tickets into background workers.

### Source of truth
[`.claude/binary-obelisk-v1-design.yaml`](./binary-obelisk-v1-design.yaml) is the design model —
databases, skills, agents, tasks. `.claude/CLAUDE.md` (this file) is transcribed from it; when
the two disagree, the YAML wins. [`claim-beads-loop.md`](../claim-beads-loop.md) is the
dispatcher's contract. **None of these are read at runtime** — the loop's only input is the
beads database.

### File Structure
```
plugins/binary-obelisk/
├── .claude-plugin/plugin.json            # manifest
├── .claude/binary-obelisk-v1-design.yaml # EDITABLE design model
├── agents/                               # engineer, frontend, jester, playwrite, lead-review, merge + 3 plan agents
├── skills/                               # initialize-beads, review-code, …
├── standards/                            # coding/review standards
├── scripts/beads-loop.sh                 # the claim-beads dispatcher
├── shared/                               # plan-task and review templates/formats
└── claim-beads-loop.md                   # the dispatcher's contract (same level as the folders)
```

### The three names — never interchangeable
| Name | What it is | Examples |
|---|---|---|
| **category** | display hint in `bd list`; names a plan-task template | `backend-logic`, `frontend-ux`, `unit-test`, `playwright-test`, `review`, `merge` |
| **stamp** | the ONE label a ticket carries (`bd create -l <stamp>`); what the dispatcher matches | `backend-logic`, `frontend-ui`, `unit-tests`, `feature-playwright-tests`, `epic-e2e-tests`, `feature-lead-review`, `epic-lead-review` |
| **agent** | a real file in `agents/` | `engineer`, `frontend`, `jester`, `playwrite`, `lead-review`, `merge` |

A task may list two categories; a ticket carries exactly one stamp. `feature-playwright-tests`
and `epic-e2e-tests` both dispatch `playwrite`, which is exactly why the stamp — not `--agent` —
has to carry the tier.

### Agents (the spokes)
| Agent | Does | Spawn | Certify | Skills |
|---|---|---|---|---|
| `engineer` | business logic, endpoints, hooks, types, error factories | s b w | ✓ | files, naming |
| `frontend` | components, layout, styling, component system | s b w | ✓ | coding, files, naming |
| `jester` | Jest unit tests for pure logic | s b w | ✓ | coding, files, naming, errors |
| `playwrite` | Playwright browser tests (feature or epic scope) | s b w | ✓ | coding, files, naming, errors |
| `lead-review` | traces the change, instruments, runs tests, certifies | s b w | ✓ | errors, coding, files, naming |
| `merge` | merges the PR once the frontier is clear | s b w | ✓ | files, naming |

**There is no `human` agent.** The person enters through **gates** and closes them; nothing is
spawned for them. `plan-epic`/`plan-feature`/`plan-task` build the tower and do no work in it;
`initialize-beads` and `stand` are utilities outside the tower.

### Tower — beads issue hierarchy
Every node is a real beads issue; types are `gate` and `task` (bd rejects unregistered types).

```
Epic  (gate — the "what"; the human closes it once epic-merge-pr is done)
 ├── epic-e2e-tests        (playwrite,      respawn)  → epic-lead-review (lead-review) → epic-merge-pr (merge)
 └── Feature  (gate — one complete user-facing flow; human closes it once feature-merge-pr is done)
      ├── feature-playwright-tests (playwrite, respawn) → feature-lead-review (lead-review) → feature-merge-pr (merge)
      └── backend-logic (engineer, respawn) · frontend-ui (frontend, respawn) → unit-tests (jester, respawn)
```

**Gates are checkpoints, not work.** `bd ready` structurally never shows them and tasks behind
an open gate never reach the ready frontier. A claimable ticket assigned to a human is a model bug.

**Respawn** (`respawn-agent: true` — on the five worker nodes above) means a fresh session of the
same agent re-checks the work before the ticket may close. It is a **step inside that one
ticket**, never a second ticket: one ticket, one worker.

### Dependencies
- `epic-e2e-tests` waits on the features; then `epic-e2e-tests → epic-lead-review → epic-merge-pr`.
- `feature-playwright-tests` and `unit-tests` both wait on `backend-logic` **and** `frontend-ui`;
  `feature-lead-review` waits on both test suites; then `feature-merge-pr`.
- `backend-logic` and `frontend-ui` have no deps — they are the frontier, claimed first.
- Extra `blocks` edges order features against features and tasks against tasks.
- Release order (bottom → top): base tasks → feature tasks → human closes feature → epic tasks →
  human closes epic → thumbs-up on the merged epic PR.

### Plan agents (top-down build)
1. **plan-epic** — vague idea → clarifying questions → research → exactly one epic.
2. **plan-feature** — epic → feature-sized features (complete user-facing flows), `parent-child`
   to the epic, phased foundations → core → dependent → polish.
3. **plan-task** — feature → its tasks, each `parent-child` to the feature, **stamped at creation**
   with `bd create -l <stamp>` and verified with a `bd show --json` round trip per ticket.

### The dispatcher — scripts/beads-loop.sh
Contract: [`claim-beads-loop.md`](../claim-beads-loop.md). Every tick it claims one ticket with
`bd ready --claim`, matches its single stamp against the `AGENT` map, spawns
`claude --bg -w <ticket> --agent <agent> --permission-mode bypassPermissions` — Claude makes the
worktree itself, the loop builds no folders — logs one line, and moves on. Spawn and forget: it
never polls a worker, never reads output, never reaps, never merges, never ends itself.

- **Never guesses a specialist:** zero or two stamps → `ERROR reason=stamp-ambiguous`, left claimed
  so its lease parks it off the frontier, and the errors file is the alarm.
- **Capacity** is counted fresh each tick from `claude agents --json` (background sessions under
  this project, minus finished ones); at capacity with nothing `in_progress` logs `max_parallel_stalled`.
- **Waiting lines are capped at one a minute per reason**; errors are never capped.
- Workers run `bypassPermissions` unattended → **only run this loop in a repo you fully trust**.

### Key Beads Commands
| Command | Purpose |
|---|---|
| `bd init` (with `BD_NON_INTERACTIVE=1`) | create the DB |
| `bd where` | which DB a directory resolves (bd walks **up**; it ignores your `BEADS_DIR`) |
| `bd create -t <type> -l <stamp> --deps type:parent-child:<parent>` | create a node under its parent |
| `bd dep add <a> <b> --type blocks` | order two nodes |
| `bd dep tree <id>` | show the dependency tree |
| `bd ready --claim` | atomically claim the next unblocked ticket |
| `bd heartbeat <id>` / `bd close <id> --reason …` | the worker keeps its lease / closes its ticket |

### Rules
- Always `bd ready --claim`, never a bare `bd ready` (not atomic — two loops would steal the ticket).
- Never dispatch on a guess; never dispatch a gate; never dispatch a merge ticket (excluded at the claim).
- Respect the chains: no review before its tests, no merge before its review.
- The human closes the gates. The closed ticket is the worker's proof of work; nothing it prints is read back.
