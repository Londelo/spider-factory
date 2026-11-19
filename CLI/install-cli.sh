#!/usr/bin/env bash
# install-cli.sh — put `sf` on PATH as a real file at ~/.local/bin/sf, never a symlink, so it outlives an
# uninstalled plugin and can name its own problem. No node, no package manager.
#   bash "$(claude plugin details spider-factory --json | jq -r '.root')/CLI/install-cli.sh"
# It also puts the environment file at CLI/spider-factory.env, copied from CLI/spider-factory.example.env.
# Re-running it overwrites the launcher, which is how you repoint it after a reinstall — but it never
# touches CLI/spider-factory.env once it exists: those are your edits by then. Delete it to get the defaults back.
set -euo pipefail

source "$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)/src/console.sh"
nameTheSpeaker sf

locateLauncherPaths() {
    here="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
    pluginRoot="$(cd "$here/.." && pwd)"
    binDir="$HOME/.local/bin"
    launcher="$binDir/sf"
    envFile="$here/spider-factory.env"
    exampleEnvFile="$here/spider-factory.example.env"
}

writeLauncher() {
    mkdir -p "$binDir"
    cat > "$launcher" <<EOF
#!/usr/bin/env bash
# sf launcher — written by spider-factory's CLI/install-cli.sh. Do not edit; re-run that.
# Plugin: $pluginRoot
set -uo pipefail
plugin="$pluginRoot"
if [[ ! -f "\$plugin/CLI/bin/sf" ]]; then
    printf 'sf: the spider-factory plugin is gone from:\\n      %s\\n' "\$plugin" >&2
    printf '    The plugin was uninstalled, moved, or updated — nothing else on your system changed.\\n' >&2
    printf '    remove this launcher:  rm -f "%s"\\n' "$launcher" >&2
    printf '    get it back:           reinstall the plugin, then run its CLI/install-cli.sh again\\n' >&2
    exit 1
fi
exec bash "\$plugin/CLI/bin/sf" "\$@"
EOF
    chmod +x "$launcher"
}

installExampleEnvFile() {
    if [[ -f "$envFile" ]]; then
        envFileState="kept your edits"
        return 0
    fi
    [[ -f "$exampleEnvFile" ]] || reportMissingFromInstall "environment example" "$exampleEnvFile"
    cp "$exampleEnvFile" "$envFile"
    chmod 600 "$envFile"
    envFileState="wrote the example"
}

warnWhenBinDirMissingFromPath() {
    case ":$PATH:" in
        *":$binDir:"*) ;;
        *) tell "add  export PATH=\"$binDir:\$PATH\"  to your shell profile." ;;
    esac
}

announceInstallation() {
    plain "installed: $launcher -> $pluginRoot/CLI/bin/sf"
    plain "env:       $envFile ($envFileState) — edit it by hand, the CLI reads it on every run"
}

locateLauncherPaths
writeLauncher
installExampleEnvFile
warnWhenBinDirMissingFromPath
announceInstallation
