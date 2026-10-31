#!/usr/bin/env bash
# worker-fail.sh — the StopFailure hook: a dispatched worker's session died on an API error.
# Parks its ticket in failed-agent with the reason appended and raises the failures line, out of
# reach of `bd reclaim`. A session the loop did not spawn carries no BO_TICKET and leaves at once.
# Every step is attempted, never forced, and the hook never blocks a session.
set -uo pipefail

[[ -n "${BO_TICKET:-}" ]] || exit 0

ticket="$BO_TICKET"
towerDir="${BO_PROJECT_DIR:-$PWD}"
logDir="${BO_LOG_DIR:-$HOME/.binary-obelisk/logs}"
mkdir -p "$logDir" 2>/dev/null || true

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BO_LOG_QUIET=1
source "$here/../CLI/loop-log.sh"
boSeedIdentity "$logDir" "$towerDir"

alarmAndExit() {
    logTo errors "$1"
    exit 0
}

oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-200; }

declareRunIdentity() {
    boIdent ticket "$ticket"
    boIdent agent "${BO_AGENT:-}"
    boIdent label "${BO_LABEL:-}"
    boIdent branch "${BO_BRANCH:-}"
    boIdent target "${BO_PR_TARGET:-}"
}

readHookInput() {
    local hookInput
    hookInput="$(cat)"
    sessionId="$(jq -r '.session_id // empty' <<<"$hookInput" 2>/dev/null)"
    boIdent session "$sessionId"
    boIdent worktree "$(jq -r '.cwd // empty' <<<"$hookInput" 2>/dev/null)"
    failureKind="$(jq -r '.error // "unknown"' <<<"$hookInput" 2>/dev/null)"
    lastMessage="$(jq -r '.last_assistant_message // empty' <<<"$hookInput" 2>/dev/null)"
}

ticketState() {
    bd -C "$towerDir" show --json "$ticket" 2>/dev/null \
        | jq -r 'if type == "array" then .[0] else . end | .status // empty' 2>/dev/null
}

requireTicketStillInWork() {
    priorState="$(ticketState)"
    if [[ -z "$priorState" ]]; then
        alarmAndExit "reason=ticket-not-found"
    fi
    [[ "$priorState" == "in_progress" ]] || exit 0
}

appendTheFailureReason() {
    bd -C "$towerDir" update "$ticket" --append-notes "Worker session $(oneLine <<<"$sessionId") failed: $failureKind
Last message: $(oneLine <<<"$lastMessage")" >/dev/null 2>&1
}

parkTicketInFailure() {
    bd -C "$towerDir" update "$ticket" --status failed-agent >/dev/null 2>&1
}

declareRunIdentity
readHookInput
requireTicketStillInWork
appendTheFailureReason || alarmAndExit "reason=ticket-not-annotated kind=$failureKind"
parkTicketInFailure || alarmAndExit "reason=status-not-set kind=$failureKind from=$priorState"
logTo failures "from=$priorState kind=$failureKind msg=\"$(oneLine <<<"$lastMessage")\""
exit 0
