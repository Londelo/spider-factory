#!/usr/bin/env bash
# console.sh — the only file in the CLI that writes to a terminal. Sourced by every engine, the CLI itself,
#   and both installers; nothing else in CLI/ runs echo or printf at a screen.
#   nameTheSpeaker <name> once at the top of a script and every line it says comes out "<name>: <line>".
#   say and tell take a whole sentence; plain takes one exactly as written, for the key=value event lines
#   that carry no speaker. die is tell and then exit 1.
#   A run's log lines are not here — those are writeLog's, in CLI/utils/logging.sh.

sfConsoleName=""

nameTheSpeaker() {
    sfConsoleName="$1"
}

say() {
    printf '%s\n' "${sfConsoleName:+$sfConsoleName: }$*"
}

tell() {
    printf '%s\n' "${sfConsoleName:+$sfConsoleName: }$*" >&2
}

plain() {
    printf '%s\n' "$*"
}

die() {
    tell "$*"
    exit 1
}

reportNoBeadsDatabase() {
    die "no beads database found from $PWD — cd into the tower project and re-run"
}

reportMissingFromInstall() {
    die "the $1 is missing at $2 — this install is broken.${3:+ $3.}"
}

reportToolNotOnPath() {
    die "$1 not found on PATH"
}

reportAgentCommandNotOnPath() {
    die "the agent command '$1' is not on PATH — fix SF_AGENT_COMMAND, or leave it unset to get 'claude'"
}

announceRunLogDirectory() {
    say "logging to $logDir  (Ctrl-C to stop)"
}

reportStopped() {
    printf '\n'
    say "stopped. claimed=$claimedThisRun  log: $logDir"
}
