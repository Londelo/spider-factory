#!/usr/bin/env bash
# uninstall-cli.sh — take `sf` off PATH by removing the launcher CLI/install-cli.sh wrote, and nothing else.
# Your ~/.spider-factory.env survives: those are your edits by then. Delete it yourself for a clean slate.
set -euo pipefail

launcher="$HOME/.local/bin/sf"
marker="written by spider-factory's CLI/install-cli.sh"

refuseForeignLauncher() {
    if [[ ! -e "$launcher" ]]; then
        echo "sf: nothing to remove — no launcher at $launcher"
        exit 0
    fi
    grep -q "$marker" "$launcher" || {
        echo "sf: $launcher was not written by this repo — leaving it alone." >&2
        echo "    remove it yourself if it is really yours to remove:  rm -f $launcher" >&2
        exit 1
    }
}

removeLauncher() {
    rm -f "$launcher"
    echo "removed: $launcher"
    echo "env:     $HOME/.spider-factory.env kept — delete it to get the defaults back"
}

refuseForeignLauncher
removeLauncher
