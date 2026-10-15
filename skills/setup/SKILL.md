---
name: setup
description: >
  Guided setup conversation for binary-obelisk in a repo. Use this whenever the user says
  "setup binary-obelisk", "set up the obelisk", "install the CLI", "uninstall the CLI",
  "is beads installed", "initialize this repo", or otherwise wants to install/uninstall the
  `bo` CLI or beads in a project. It checks the current state (repo? beads? CLI?) and walks
  the user through exactly what to install or remove — it does not blind-run anything.
version: 0.1.0
---

# Setup — binary-obelisk in a repo

This skill runs a short conversation: **detect the state, report it, offer the actions that
actually apply.** Never install or remove anything the user has not confirmed. Everything here is
install *or* uninstall of two things only — the `bo` CLI and beads — plus confirming the right repo.

## Step 1 — Detect the state (read-only, run all three)

```bash
git rev-parse --show-toplevel 2>/dev/null || echo "NO-REPO"   # are we in a git repo?
bd where 2>/dev/null || echo "NO-BEADS"                        # is beads initialized here?
command -v bo && bo help >/dev/null 2>&1 && echo "CLI-OK" || echo "NO-CLI"  # is the CLI installed?
```

Report the three answers plainly before offering anything, e.g.:

> "Repo: `~/work/foo` · beads: not initialized · CLI: installed (`/home/you/.local/bin/bo`).
> Want to initialize beads here, or is something else off?"

## Step 2 — Branch on what's missing

**Not in a git repo** → stop. binary-obelisk plans and runs a tower inside one repo. Ask the user
to `cd` into the project they mean, and confirm that's the right repo before touching it.

**In a repo, beads not initialized** → offer to initialize. **Use the `initialize-beads` skill for
the full procedure** (`bd` install if missing, `bd init`, Claude Code hooks, git hooks). Do not
re-implement it here — hand off to that skill and come back.

**CLI not installed** → offer to install it (Step 3).

**Everything present** → nothing to do. Say so, and mention `bo loop start` to run the dispatcher.

## Step 3 — Install the CLI

The CLI lives inside the plugin and is installed by a symlink (no node). Run its installer:

```bash
bash "$(claude plugin details binary-obelisk --json | jq -r '.root')/CLI/install-cli.sh"
```

That symlinks `bin/bo` into `~/.local/bin`. If it prints a PATH warning, tell the user to add that
`export PATH=...` line to their shell profile. Then confirm with `bo help`.

## Step 4 — Uninstall (either or both — confirm each)

**Uninstall the CLI** — remove only the symlink, the plugin files stay put:
```bash
rm -f "$HOME/.local/bin/bo"
```

**Uninstall beads from this repo** — this deletes the beads database. Confirm the repo path first;
this is destructive to the tower:
```bash
# confirm: echo "removing beads from $(pwd)"; then remove the DB and its CLAUDE.md section
rm -rf .beads
```
For removing `bd` itself from the machine, refer to the `initialize-beads` skill's install steps in
reverse (`brew uninstall beads` / `npm rm -g @beads/bd`).

## Reference

| Need | Do |
|---|---|
| init beads / install `bd` / hooks | **`initialize-beads` skill** (defer to it) |
| install the CLI | `bash "$(claude plugin details binary-obelisk --json \| jq -r '.root')/CLI/install-cli.sh"` |
| uninstall the CLI | `rm -f ~/.local/bin/bo` |
| uninstall beads (repo) | `rm -rf .beads` (destructive — confirm path) |
| run the dispatcher | `bo loop start` (see the CLI's `bo help`) |
