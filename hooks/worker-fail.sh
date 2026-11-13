#!/usr/bin/env bash
# worker-fail.sh — the StopFailure hook: a dispatched worker's session died on an API error.
# Parks its ticket in failed-agent with the reason appended and raises the failures line, out of
# reach of `bd reclaim`. A session the loop did not spawn carries no BO_TICKET and leaves at once.
# Every step is attempted, never forced, and the hook never blocks a session. The BO_* keys usually
# arrive only through the dispatch context the loop wrote under $BO_LOG_ROOT/worker-context/, keyed by
# the worktree's folder name — `claude --bg` runs the worker in a pooled process that never inherited
# the spawn's environment. A session whose cwd is not a loop worktree is a human's and leaves at once.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BO_LOG_QUIET=1
source "$here/../CLI/user-env.sh"
loadObeliskEnv
source "$here/../CLI/loop-log.sh"

logDir="${BO_LOG_DIR:-${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}}"
mkdir -p "$logDir" 2>/dev/null || true
boSeedIdentity "$logDir" "${BO_PROJECT_DIR:-$PWD}"

alarmAndExit() {
    logTo errors "$1"
    exit 0
}

hookInput=""

adoptDispatchContext() {
    [[ -n "${BO_TICKET:-}" ]] && return 0
    hookInput="$(cat)"
    local cwd slug contextFile
    cwd="$(jq -r '.cwd // empty' <<<"$hookInput" 2>/dev/null)"
    [[ "$(basename "$(dirname "${cwd:-/nonexistent}")")" == "worktrees" ]] || exit 0
    slug="$(basename "$cwd")"
    contextFile="${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}/worker-context/$slug"
    if [[ ! -r "$contextFile" ]]; then
        boIdent worktree "$cwd"
        alarmAndExit "reason=no-context worktree=$slug msg=\"a worker died in a loop worktree with no dispatch context; its ticket stays claimed and nobody parks it\""
    fi
    source "$contextFile"
    export BO_TICKET="${ticket:-}" BO_BRANCH="${branch:-}" BO_PR_TARGET="${pr_target:-}" \
        BO_AGENT="${agent:-}" BO_LABEL="${label:-}" BO_PROJECT_DIR="${tower:-}" \
        BO_LOG_DIR="${done_file%/*}"
}

adoptDispatchContext

ticket="$BO_TICKET"
towerDir="${BO_PROJECT_DIR:-$PWD}"
logDir="${BO_LOG_DIR:-${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}}"
mkdir -p "$logDir" 2>/dev/null || true
boSeedIdentity "$logDir" "$towerDir"

oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-200; }

declareRunIdentity() {
    boIdent ticket "$ticket"
    boIdent agent "${BO_AGENT:-}"
    boIdent label "${BO_LABEL:-}"
    boIdent branch "${BO_BRANCH:-}"
    boIdent target "${BO_PR_TARGET:-}"
}

readHookInput() {
    [[ -n "$hookInput" ]] || hookInput="$(cat)"
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
