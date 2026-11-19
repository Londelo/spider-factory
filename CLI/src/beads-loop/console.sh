#!/usr/bin/env bash
# console.sh — the only thing in the dispatcher that writes to the terminal, sourced by beads-loop/index.sh.
#   Everything else a run says goes into a log file through logTo in loop-log.sh.

die() {
    echo "beads-loop: $*" >&2
    exit 1
}

announceRunLogDirectory() {
    echo "beads-loop: logging to $logDir  (Ctrl-C to stop)"
}

reportStopped() {
    printf "\nbeads-loop: stopped. claimed=%d  log: %s\n" "$claimedThisRun" "$logDir"
}
