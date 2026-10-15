#!/usr/bin/env bash
# bo loop stop — stop the dispatcher running in the current tower.
set -euo pipefail
key="$(basename "$PWD")"
pidDir="$HOME/.binary-obelisk"
pidFile="$pidDir/loop-$key.pid"

[[ -f "$pidFile" ]] || { echo "bo: not running (no pid file for $key)."; exit 0; }
pid="$(cat "$pidFile")"
if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" && echo "bo: stopped (pid $pid)."
else
    echo "bo: stale pid $pid — cleaning up."
fi
rm -f "$pidFile"
