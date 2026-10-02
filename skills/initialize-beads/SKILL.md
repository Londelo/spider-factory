---
name: initialize-beads
description: >
  Initialize beads (bd) for Claude Code in a project repository. Use this skill
  whenever the user says "initialize beads", "set up beads in this repo",
  "install beads here", "beads-init", or wants beads issue tracking + Claude Code
  hooks set up in a project. Triggers on any phrase mentioning beads initialization,
  beads setup, or beads installation for Claude Code.
version: 0.1.0
---

## What this skill does

Bootstraps a repository for beads (bd) issue tracking with Claude Code integration:
installs the `bd` CLI if missing, runs `bd init`, sets up Claude Code hooks, and installs git hooks.

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
bd init
```

This creates `.beads/` with the Dolt-backed database and writes a beads section to `CLAUDE.md`.

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
```

Report the results to the user. If anything is stale or missing, note it.

### Step 7: Give the user a starting prompt

Tell the user:
- Where to find ready work: `bd ready`
- How to create an issue: `bd create "title" -p 2 -t task`
- That they should restart Claude Code for hooks to activate
- What `bd prime` does (prints workflow context and persistent memories)

## Notes

- If `bd init` was already run, it updates the existing setup idempotently.
- If the user wants stealth mode (no git ops, no remote sync), run `bd init --stealth` instead.
- If the user wants server mode (external Dolt SQL server), run `bd init --server`.
- To skip Claude Code setup, pass `--skip-agents` to `bd init`.
