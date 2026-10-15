#!/usr/bin/env bash
# bo loop start — launch the dispatcher detached in the current tower.
set -euo pipefail
here="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"   # .../CLI
engine="$here/beads-loop.sh"
key="$(basename "$PWD")"
pidDir="$HOME/.binary-obelisk"
pidFile="$pidDir/loop-$key.pid"
logFile="$pidDir/loop-$key.log"

# refuse to start outside a tower, or twice
bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1 || {
    echo "bo: no beads DB found from $PWD — cd into a tower project and re-run." >&2; exit 1; }
[[ -f "$pidFile" ]] && kill -0 "$(cat "$pidFile")" 2>/dev/null && {
    echo "bo: already running (pid $(cat "$pidFile")). Use 'bo loop stop' first." >&2; exit 1; }

mkdir -p "$pidDir"
setsid bash "$engine" >"$logFile" 2>&1 &
echo $! > "$pidFile"
echo "bo: loop started (pid $(cat "$pidFile")) in $PWD"
echo "     log: $logFile"
