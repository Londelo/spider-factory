---
name: bead-initialize
description: >
  Initialize beads (bd) for Claude Code in a project repository. Use this skill
  whenever the user says "initialize beads", "set up beads in this repo",
  "install beads here", "beads-init", or wants beads issue tracking + Claude Code
  hooks set up in a project. Triggers on any phrase mentioning beads initialization,
  beads setup, or beads installation for Claude Code.
---

## What this skill does

Bootstraps a repository for beads (bd) issue tracking with Claude Code integration:
installs the `bd` CLI if missing, runs `bd init`, registers the `gate` type the tower needs, sets up
Claude Code hooks, and installs git hooks.

## Prerequisites

- macOS, Linux, or Windows
- Target repo must be a git repository
- Internet access (for `bd` installation if needed)

## Workflow

### Step 1: Verify target repo

Confirm the user has a git repo they want to initialize beads in. If they say "this repo", use the current working directory. If they provide a path, `cd` to it first.

```bash
git rev-parse --show-toplevel
```

Record the repo path.

### Step 2: Check if `bd` is installed

```bash
which bd && bd version
```

If `bd` is not installed, install it:

- **macOS/Linux (Homebrew):** `brew install beads`
- **npm:** `npm install -g @beads/bd`
- **install script:** `curl -fsSL https://raw.githubusercontent.com/gastownhall/beads/main/scripts/install.sh | bash`

If Homebrew fails, fall back to the install script. If neither works, tell the user and stop.

### Step 3: Initialize beads in the repo

```bash
cd <repo-path>
BD_NON_INTERACTIVE=1 bd init
bd where
```

This creates `.beads/` with the Dolt-backed database and writes a beads section to `CLAUDE.md`.
`bd where` proves which database this directory resolves to — bd walks **up**, so it answers for the
nearest `.beads/` above you, not the one you think you are in.

### Step 3b: Register the `gate` type and the `failed-agent` status (the tower does not work without them)

Epics and features are `-t gate`, a **custom** type. `bd` does not refuse an unregistered type — it
accepts `gate`, writes the row, and hides it, so a broken tower and a working one look identical.

`failed-agent` is a **custom status**, and it is what parks a dead worker's ticket. **A person sets it** —
`bd update <ticket> --status failed-agent` — and nothing else ever does: the only hook in the system is the
worker's own `Stop` hook, which commits, pushes, closes and stops there. The overseer's job
when it finds a worker that died quietly is to name the ticket and hand that command to a human to run. An
unregistered status is refused outright
(`invalid status "failed-agent"`), so a dead worker's ticket stays `in_progress` — invisible to `bd ready`,
and **nothing notices**. beads has a reaper, `bd reclaim`, which is exactly what it does: it finds
`in_progress` issues whose lease expired and puts them back to ready. **Nothing in this system ever runs
it** — the loop, the hooks and the overseer never call it, and beads does not run it for you. That is why
the status has to be set by hand: it is the whole of the parking, and nothing parks a ticket that never got
it.

```bash
bd config set types.custom "gate"
bd types                                    # `gate` must be listed here before you create anything
bd config set status.custom "failed-agent:frozen"
bd config get status.custom                 # must read back `failed-agent:frozen`
```

Both are per-database settings, so a tower created before these lines existed does not have them — run the
two `bd config set` lines in it too, before you dispatch anything there.

### Step 4: Set up Claude Code integration

```bash
bd setup claude
```

This installs:
- SessionStart hook that runs `bd prime --hook-json` (injects ~1-2k tokens of workflow context at session start)
- Minimal beads section in `CLAUDE.md`

Restart Claude Code after this step for hooks to take effect.

### Step 5: Install git hooks

```bash
bd hooks install
```

This installs pre-commit, post-merge, pre-push, and post-checkout hooks for export refresh and Dolt sync.

### Step 6: Verify

```bash
bd setup claude --check
bd doctor
bd version
bd types          # `gate` still listed
```

Report the results to the user. If anything is stale or missing, note it.

### Step 7: Give the user a starting prompt

Tell the user:
- Where to look for ready work: `bd ready` — claiming is the dispatcher's job (`sf loop`), not something
  to do by hand
- How to create an issue: `bd create "title" -p 2 -t task` (an epic or feature is `-t gate`, unlabelled)
- That they should restart Claude Code for hooks to activate
- What `bd prime` does (prints workflow context and persistent memories)

## Notes

- If `bd init` was already run, it updates the existing setup idempotently.
- If the user wants stealth mode (no git ops, no remote sync), run `bd init --stealth` instead.
- If the user wants server mode (external Dolt SQL server), run `bd init --server`.
- To skip Claude Code setup, pass `--skip-agents` to `bd init`.
