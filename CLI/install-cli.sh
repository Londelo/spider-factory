#!/usr/bin/env bash
# install-cli.sh — put `sf` on PATH as a real file at ~/.local/bin/sf, never a symlink, so it outlives the
# repo it came from and can name its own problem. No node, no package manager.
#   bash ~/CastleLondelo/spider-factory/CLI/install-cli.sh
# It also puts the environment file at CLI/spider-factory.env, copied from CLI/spider-factory.example.env.
# Re-running it overwrites the launcher, which is how you repoint it after a reinstall — but it never
# touches CLI/spider-factory.env once it exists: those are your edits by then. Delete it to get the defaults back.
set -euo pipefail

source "$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)/utils/console.sh"
nameTheSpeaker sf

locateLauncherPaths() {
    here="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
    repoRoot="$(cd "$here/.." && pwd)"
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
# Repo: $repoRoot
set -uo pipefail
repo="$repoRoot"
if [[ ! -f "\$repo/CLI/bin/sf" ]]; then
    printf 'sf: the spider-factory repo is gone from:\\n      %s\\n' "\$repo" >&2
    printf '    The repo was moved, renamed, or deleted — nothing else on your system changed.\\n' >&2
    printf '    remove this launcher:  rm -f "%s"\\n' "$launcher" >&2
    printf '    get it back:           clone the repo again, then run its CLI/install-cli.sh again\\n' >&2
    exit 1
fi
exec bash "\$repo/CLI/bin/sf" "\$@"
EOF
    chmod +x "$launcher"
}

reportKeysMissingFromLiveEnvFile() {
    local line key
    local -a missing=()
    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)= ]] || continue
        key="${BASH_REMATCH[1]}"
        grep -qsE "^[[:space:]]*${key}=" "$envFile" || missing+=("$key")
    done < "$exampleEnvFile"
    if (( ${#missing[@]} > 0 )); then
        tell "your $envFile lacks ${#missing[@]} key(s) the example ships: ${missing[*]}"
        tell "    add them by hand, or delete the file and re-run this to get the example back"
    fi
}

installExampleEnvFile() {
    if [[ -f "$envFile" ]]; then
        envFileState="kept your edits"
        reportKeysMissingFromLiveEnvFile
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
    plain "installed: $launcher -> $repoRoot/CLI/bin/sf"
    plain "env:       $envFile ($envFileState) — edit it by hand, the CLI reads it on every run"
}

locateLauncherPaths
writeLauncher
installExampleEnvFile
warnWhenBinDirMissingFromPath
announceInstallation
