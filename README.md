# spider-factory

An agent factory for the web.

You plan a tower of tickets top-down. One command turns that tower into background workers — each ticket
claimed, built on the branch its own id names, committed, pushed, and put up as a pull request — while you
stay out of the way and close the gates when a tier is proved.

## The idea in one breath

Every ticket is a real beads (`bd`) issue. Tickets are wired together with `blocks` edges and nothing else,
and that graph is the whole tower:

```
epic gate  (the what)
  └─ feature gate  (one complete user-facing flow, its own branch, its own PR)
       └─ logic → its unit tests → its UI      (one linked line, never a fan)
       └─ the feature's suite → its review → the gate
  └─ the broad e2e suite → the epic review → the gate
```

Three tiers of test, three depths: `unit-tests` (one function alone), `feature-test` (one feature's pieces
wired), `epic-e2e-test` (journeys across features on the real stack). A label decides which worker the loop
spawns, and a mis-labelled ticket silently gets the wrong depth — so labels are the plan, not decoration.

**Gates are checkpoints, not work.** They never show in `bd ready`, and only a human closes one — unless
`SF_AGENT_FEATURE_GATES` / `SF_AGENT_EPIC_GATES` hands that tier to the `lead` agent instead.

## Setup

**1 · Install the plugin and the CLI.** The plugin ships the agents and skills to Claude Code; the CLI is a
separate thing on your PATH. From a clone of this repo:

```bash
npm run cli:install      # writes ~/.local/bin/sf and CLI/spider-factory.env
npm run cli:uninstall    # removes that launcher, and only that launcher
```

Or skip the ceremony and say "setup spider-factory" to your AI agent — the `setup-cli` skill checks the
repo, the ticket database and the CLI, then installs on your say-so.

**2 · Initialize beads in the project you want to build.** The tower lives in the target repo, not here.
Say "initialize beads" there, or use the `bead-initialize` skill — it installs `bd`, runs `bd init`, and
registers the `gate` type and `failed-agent` status the tower needs.

**3 · Every setting lives in `CLI/spider-factory.env`** — copied down from
`CLI/spider-factory.example.env` on install and never touched again. Workers at once, tick length, how many
tickets end a run, log root, which labels may dispatch, whether the lead agent closes gates, which command
runs an agent, and which plugin the agents ship in. Edit that file; something you export yourself still wins
for one run.

## Webs

`webs/` is where the repos the factory builds live. The directory ships (by its `.gitkeep` alone); nothing
inside it is tracked. Your list is `webs/webs.yml`, one repo url a line:

```yaml
repos:
  - https://github.com/Londelo/my-web.git
  - git@github.com:Londelo/my-other-web.git
```

```bash
npm run webs:clone
```

Each url lands in `webs/` beside the list, in a directory named after the last segment of its url. A repo
already sitting there is left alone — it never pulls, never resets, never deletes. When `webs.yml` is
missing it is copied from the tracked `webs/webs.example.yml` and never written after that; delete it to get
the shipped one back.

## The CLI

Six commands. The loop, the three planners and the watcher run from inside a tower project; `sf commit` only
needs a git repo.

```bash
sf                     # open an agent session at the factory root
sf --help              # all six, explained
sf plan:epic a record box for my diary entries
sf plan:feature SF-12
sf plan:task SF-31
sf loop                # dispatch the tower in the current directory — Ctrl-C stops dispatching
sf overseer            # read the tower and report on it — reads only, writes nothing
sf commit save a diary entry   # stage everything, commit as agent:branch:message, push
```

## The workflow

1. **Plan top-down.** `sf plan:epic` turns a vague idea into one epic gate plus its e2e and review tickets.
   `sf plan:feature` breaks that epic into feature-sized flows, each with its own branch, PR, suite and
   review, phased by dependency. `sf plan:task` lays one feature's chain: logic, its unit tests, its UI.
   Every id is minted by `CLI/src/create-beads/` — a hand-typed id reaches no gate.
2. **Run the loop.** `sf loop` claims what is ready, derives the branch and the PR target off the ticket's
   own id, builds the worktree, and spawns the worker inside it. Every line it logs prints to your screen
   as it goes.
3. **Workers commit as they go** with `sf commit`, and declare themselves done with a marker file. No worker
   ever closes its own ticket — the Stop hook commits, pushes, opens the PR and closes it. No marker, no
   commit.
4. **You close the gates** when a tier is proved, then run the loop again for the next tier. `sf overseer`
   tells you what is stuck and why, and hands you the command when the fix is a mutation.

Workers run `bypassPermissions` unattended — only run the loop in a repo you fully trust.

## Where the real detail lives

**The code is the only source of truth.** The diagrams are its translated account — the thing you read when
you are not in the code, and the thing people quote.

| You want | Go to |
|---|---|
| the system in human terms — the machine, the tower, the workers, every alarm | [`.claude/diagram/model.c4`](./.claude/diagram/model.c4) and the four walkthroughs in [`.claude/diagram/views.c4`](./.claude/diagram/views.c4): `index` the plan · `theLoop` the run · `theLogs` the log · `everyFailure` the alarms |
| read them rendered | `.claude/diagram/build.sh`, then open `.claude/diagram/dist/index.html` |
| edit those diagrams without breaking them | [`.claude/diagram/REFERENCE.md`](./.claude/diagram/REFERENCE.md) |
| the vocabulary — category vs label vs agent, the id grammar, the moving parts | [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) |
| what a thing actually does | the file it lives in |
