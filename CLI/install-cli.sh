#!/usr/bin/env bash
# install-cli.sh — put `bo` on PATH as a real file at ~/.local/bin/bo, never a symlink, so it outlives an
# uninstalled plugin and can name its own problem. No node, no package manager.
#   bash "$(claude plugin details binary-obelisk --json | jq -r '.root')/CLI/install-cli.sh"
# Re-running it overwrites the launcher, which is how you repoint it after a reinstall.
set -euo pipefail

locateLauncherPaths() {
    here="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
    pluginRoot="$(dirname "$here")"
    binDir="$HOME/.local/bin"
    launcher="$binDir/bo"
}

writeLauncher() {
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
}

warnWhenBinDirMissingFromPath() {
    case ":$PATH:" in
        *":$binDir:"*) ;;
        *) echo "bo: add  export PATH=\"$binDir:\$PATH\"  to your shell profile." >&2 ;;
    esac
}

announceInstallation() {
    echo "installed: $launcher -> $pluginRoot/CLI/bin/bo"
}

locateLauncherPaths
writeLauncher
warnWhenBinDirMissingFromPath
announceInstallation
