---
name: setup-cli
description: >
  Guided setup conversation for spider-factory in a repo. Use this whenever the user says
  "setup spider-factory", "set up the spider factory", "install the CLI", "uninstall the CLI",
  "is beads installed", "initialize this repo", or otherwise wants to install/uninstall the
  `sf` CLI or beads in a project. It checks the current state (repo? beads? CLI?) and walks
  the user through exactly what to install or remove — it does not blind-run anything.
---

# Setup — spider-factory in a repo

This skill runs a short conversation: **detect the state, report it, offer the actions that
actually apply.** Never install or remove anything the user has not confirmed. Everything here is
install *or* uninstall of two things only — the `sf` CLI and beads — plus confirming the right repo.

## Step 1 — Detect the state (read-only, run all three)

```bash
git rev-parse --show-toplevel 2>/dev/null || echo "NO-REPO"   # are we in a git repo?
bd where 2>/dev/null || echo "NO-BEADS"                        # is beads initialized here?
command -v sf && sf help >/dev/null 2>&1 && echo "CLI-OK" || echo "NO-CLI"  # is the CLI installed?
```

Report the three answers plainly before offering anything, e.g.:

> "Repo: `~/work/foo` · beads: not initialized · CLI: installed (`/home/you/.local/bin/sf`).
> Want to initialize beads here, or is something else off?"

## Step 2 — Branch on what's missing

**Not in a git repo** → stop. spider-factory plans and runs a tower inside one repo. Ask the user
to `cd` into the project they mean, and confirm that's the right repo before touching it.

**In a repo, beads not initialized** → offer to initialize. **Use the `bead-initialize` skill for
the full procedure** (`bd` install if missing, `bd init`, Claude Code hooks, git hooks). Do not
re-implement it here — hand off to that skill and come back.

**CLI not installed** → offer to install it (Step 3).

**Everything present** → nothing to do. Say so, and mention `sf loop` to run the dispatcher.

## Step 3 — Install the CLI

The CLI lives inside the plugin; its installer writes a small REAL file at `~/.local/bin/sf` that execs
the plugin's `CLI/bin/sf` (no node, no symlink — a real file survives an uninstalled plugin and can name
its own problem). Run the installer:

```bash
bash "$(claude plugin details spider-factory --json | jq -r '.root')/CLI/install-cli.sh"
```

That writes `~/.local/bin/sf`, and — only the first time — `CLI/spider-factory.env`, a copy of `CLI/default.env`
holding every setting the CLI reads at its default. That file belongs to the user: re-running the installer
never touches it, and both engines read it on every run, so it is where they change how the CLI behaves
(`SF_MAX_PARALLEL`, `SF_AGENT_COMMAND`, `SF_POLL_S` …). Tell them it exists and what it is for. Re-running
the installer overwrites the launcher, which is how you repoint it after a reinstall. If it prints a PATH
warning, tell the user to add that `export PATH=...` line to their shell profile. Then confirm with `sf help`.

## Step 4 — Uninstall (either or both — confirm each)

**Uninstall the CLI** — remove only the launcher, the plugin files stay put:
```bash
rm -f "$HOME/.local/bin/sf"
```

**If the plugin was uninstalled instead** — the launcher is still on PATH and `sf` prints a warning naming
the plugin path it can no longer find, plus the two ways out: remove the launcher, or reinstall the plugin
and run its `CLI/install-cli.sh` again. If they report that message, ask which they want — the reinstall is
Step 3, the removal is the `rm` above. Either way nothing else on the machine needs cleaning, except
`CLI/spider-factory.env` if they want it gone too — that one is their own edits, so never remove it unasked.

**Uninstall beads from this repo** — this deletes the beads database. Confirm the repo path first;
this is destructive to the tower:
```bash
# confirm: echo "removing beads from $(pwd)"; then remove the DB and its CLAUDE.md section
rm -rf .beads
```
For removing `bd` itself from the machine, refer to the `bead-initialize` skill's install steps in
reverse (`brew uninstall beads` / `npm rm -g @beads/bd`).

## Reference

| Need | Do |
|---|---|
| init beads / install `bd` / hooks | **`bead-initialize` skill** (defer to it) |
| install the CLI | `bash "$(claude plugin details spider-factory --json \| jq -r '.root')/CLI/install-cli.sh"` |
| uninstall the CLI | `rm -f ~/.local/bin/sf` |
| uninstall beads (repo) | `rm -rf .beads` (destructive — confirm path) |
| run the dispatcher | `sf loop` (foreground — Ctrl-C stops it) |
| change how the CLI behaves | edit `CLI/spider-factory.env` — read on every run; an exported value still wins |
