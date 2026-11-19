#!/usr/bin/env bash
# uninstall-cli.sh — take `sf` off PATH by removing the launcher CLI/install-cli.sh wrote, and nothing else.
# Your CLI/spider-factory.env survives: those are your edits by then. Delete it yourself for a clean slate.
set -euo pipefail

source "$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)/src/console.sh"
nameTheSpeaker sf

launcher="$HOME/.local/bin/sf"
marker="written by spider-factory's CLI/install-cli.sh"

refuseForeignLauncher() {
    if [[ ! -e "$launcher" ]]; then
        say "nothing to remove — no launcher at $launcher"
        exit 0
    fi
    grep -q "$marker" "$launcher" || {
        tell "$launcher was not written by this repo — leaving it alone."
        tell "    remove it yourself if it is really yours to remove:  rm -f $launcher"
        exit 1
    }
}

removeLauncher() {
    rm -f "$launcher"
    plain "removed: $launcher"
    plain "env:     $(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/spider-factory.env kept — delete it to get the defaults back"
}

refuseForeignLauncher
removeLauncher
