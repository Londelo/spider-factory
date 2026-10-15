#!/usr/bin/env bash
# bo loop status  (or --logs to tail the live log)
set -euo pipefail
key="$(basename "$PWD")"
pidDir="$HOME/.binary-obelisk"
pidFile="$pidDir/loop-$key.pid"
logFile="$pidDir/loop-$key.log"
follow="${1:-}"

running=0
if [[ -f "$pidFile" ]] && kill -0 "$(cat "$pidFile")" 2>/dev/null; then
    running=1
    echo "bo: running (pid $(cat "$pidFile")) in $PWD"
else
    echo "bo: not running."
fi

[[ -f "$logFile" ]] || { echo "bo: no log yet at $logFile."; exit 0; }
if [[ "$follow" == "--logs" ]]; then
    tail -f "$logFile"
elif (( running )); then
    echo "--- last lines ---"; tail -n 15 "$logFile"
fi
