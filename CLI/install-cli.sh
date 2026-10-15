#!/usr/bin/env bash
# install-cli.sh — put `bo` on PATH. No node, no package manager.
#
# It writes a small REAL file at ~/.local/bin/bo rather than symlinking into the plugin.
# That is deliberate: a symlink dies the moment the plugin is uninstalled, and a dead
# symlink can't run far enough to explain itself — the shell just says
# "No such file or directory". A real launcher outlives the plugin and names the problem.
#
# Run this once after installing the plugin:
#   bash "$(claude plugin details binary-obelisk --json | jq -r '.root')/CLI/install-cli.sh"
# Re-running it overwrites the launcher, which is how you repoint it after a reinstall.
set -euo pipefail
here="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"   # .../CLI
pluginRoot="$(dirname "$here")"
binDir="$HOME/.local/bin"
launcher="$binDir/bo"

mkdir -p "$binDir"
cat > "$launcher" <<EOF
#!/usr/bin/env bash
# bo launcher — written by binary-obelisk's CLI/install-cli.sh. Do not edit; re-run that.
# Plugin: $pluginRoot
set -uo pipefail
plugin="$pluginRoot"
if [[ ! -f "\$plugin/CLI/bin/bo" ]]; then
    printf 'bo: the binary-obelisk plugin is gone from:\\n      %s\\n' "\$plugin" >&2
    printf '    The plugin was uninstalled, moved, or updated — nothing else on your system changed.\\n' >&2
    printf '    remove this launcher:  rm -f "%s"\\n' "$launcher" >&2
    printf '    get it back:           reinstall the plugin, then run its CLI/install-cli.sh again\\n' >&2
    exit 1
fi
exec bash "\$plugin/CLI/bin/bo" "\$@"
EOF
chmod +x "$launcher"

case ":$PATH:" in
    *":$binDir:"*) ;;
    *) echo "bo: add  export PATH=\"$binDir:\$PATH\"  to your shell profile." >&2 ;;
esac
echo "installed: $launcher -> $pluginRoot/CLI/bin/bo"
