#!/usr/bin/env bash
# console.sh — the only file in the CLI that writes to a terminal. Sourced by every engine, the CLI itself,
#   and both installers; nothing else in CLI/ runs echo or printf at a screen.
#   nameTheSpeaker <name> once at the top of a script and every line it says comes out "<name>: <line>".
#   say and tell take a whole sentence; plain takes one exactly as written, for the key=value event lines
#   that carry no speaker. die is tell and then exit 1.
#   The beads question every command asks before it asks anything else is asked here too — it is nothing but
#   these refusals in order: name a tool that is not on PATH, then name the missing database. Every command
#   that asks it sources this file already, so it is asked once.
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

requireBeadsToolsOnPath() {
    local requiredTool
    for requiredTool in bd jq; do
        command -v "$requiredTool" >/dev/null 2>&1 || reportToolNotOnPath "$requiredTool"
    done
}

requireBeadsProject() {
    requireBeadsToolsOnPath
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1 ||
        reportNoBeadsDatabase
}

announceRunLogDirectory() {
    say "logging to $logDir  (Ctrl-C to stop)"
}

reportStopped() {
    printf '\n'
    say "stopped. claimed=$claimedThisRun  log: $logDir"
}
