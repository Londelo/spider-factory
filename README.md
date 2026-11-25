# spider-factory

An SDL toolkit for building web applications with Claude Code, driven by Beads. You plan a tower of tickets
top-down; one command turns that tower into background workers — each claims its ticket, works it, commits,
pushes, and opens its pull request — while you stay out of the way and close the gates.

Your projects live inside the factory, in `webs/` — `npm run webs:clone` clones the urls listed in
`webs/webs.yml` in beside the factory's own code. The planners, the workers, the dispatcher and the `sf` CLI
all live here too.

## Requirements

Locked to Beads (`bd`) for tickets and to Claude Code for the harness — decisions, not preferences. On `PATH`:
`bd`, `jq`, `git`, `claude`, and `gh` or `glab` for whichever forge your remote is. `SF_AGENT_COMMAND` points
the whole thing at your own build of the agent command, but that build has to answer the same `--bg --agent`
flags and keep the same per-session record the Stop hook reads.

## How we build

- **Functional core, imperative shell.** The `standards-coding` skill is the authority and every worker that
  writes code loads it; nothing is reproduced here.
- **Testing is a ticket, not an afterthought.** Three tiers, each its own ticket at its own depth:
  `unit-tests` (one function alone), `feature-test` (one feature's pieces wired), `epic-e2e-test` (journeys
  across features on the real stack).
- **The front end is abstracted out of the business logic.** `frontend` writes no business logic; `engineer`
  writes no JSX.
- **One branch per epic and one per feature.** A task is a commit, never a branch: everything a ticket needs
  about its git world is derived from its own id.

## The tower

Every node is a real `bd` issue, the only edge is `blocks`, and that graph is the whole flow control.

```
epic gate  (the what)
  └─ feature gate  (one complete user-facing flow, its own branch, its own PR)
       └─ logic → its unit tests → its UI        (one linked line, never a fan)
       └─ the feature's suite → its review → the gate
  └─ the epic's e2e suite → its review → the gate
```

The loop is as simple as it is *because* the tower is: `bd ready --claim` returns exactly what is unblocked,
the one dispatching label on the ticket picks the worker, and the ticket's own id names the gate whose branch
it lands on and whose target its PR asks for. Nothing else decides what runs next.

**Gates are checkpoints, not work.** They never appear in `bd ready`, and only a human closes one — until
`SF_AGENT_FEATURE_GATES` / `SF_AGENT_EPIC_GATES` hands that tier to the `lead` agent, which proves the tier and
merges its PR.

## Quick start

```bash
npm run cli:install    # writes ~/.local/bin/sf and CLI/spider-factory.env
npm run cli:uninstall  # removes that launcher, and only that launcher
```

In the project you are building — under `webs/` — say "initialize beads" first. The `bead-initialize` skill
installs `bd`, runs `bd init`, and registers the `gate` type and `failed-agent` status the tower needs.

Then run these from inside that project, anywhere under the factory:

```bash
sf plan:epic a record box for my diary entries  # one epic gate, its e2e suite, its review
sf plan:feature <epic-id>                       # the epic into feature gates, each with branch, PR, suite, review
sf plan:task <feature-id>                       # one feature into logic → unit tests → UI, all blocking its gate
sf loop                                         # dispatch the tower here — Ctrl-C stops dispatching
sf tower                                        # the whole database as one tree, in the order the loop works it
sf overseer                                     # read the tower and its logs and say what is stuck
```

Every knob — workers at once, tick length, log root, which labels may dispatch, whether the lead agent closes
gates — lives in `CLI/spider-factory.env`. Something you export yourself still wins for one run.

## Read more

The code is the only source of truth.

- [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) — the agent reference: the vocabulary, the moving parts, and the
  rules that break the system when broken.
- [`.claude/diagram/`](./.claude/diagram/) — the human account of the machine: the model, the four
  walkthroughs, and `build.sh` to render them.
