#!/usr/bin/env bash
# worker-fail.sh — the StopFailure hook: a dispatched worker's session died on an API error.
# Parks its ticket in failed-agent with the reason appended and raises the failures line, out of
# reach of `bd reclaim`. Every step is attempted, never forced, and the hook never blocks a session.
# Registered as the `StopFailure` hook in the frontmatter of the seven worker agents, which reaches this
# file as `sf hook fail`; nothing else calls it. The hook finds its worker by SESSION ID, never by cwd:
# `claude --bg` runs the worker in a pooled process whose environment was frozen by the daemon at its
# first spawn, so neither the spawn's `SF_*` nor the cwd the hook input carries proves anything. The record of the dispatch is the claims line the loop wrote at
# $SF_LOG_ROOT/<run>/claims — ticket, branch, target, worktree and run all come off that line. The
# dispatch context under $SF_LOG_ROOT/worker-context/, keyed by the worktree's folder name (`/` as `+`),
# is read only as a fallback for what a thin claims line omits. A session with no dispatched claims line
# is a human's: it leaves at once, silently, and writes nothing anywhere.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SF_LOG_QUIET=1
source "$here/../user-env.sh"
loadSpiderFactoryEnv

claimsRoot="${SF_LOG_ROOT:-$HOME/.spider-factory/logs}"

alarmAndExit() {
    sf log write errors "$1"
    exit 0
}

hookInput=""
worktreeDir=""

dispatchLineForSession() {
    local sessionId="$1" claimFile claim="" found=""
    [[ -n "$sessionId" ]] || { printf '%s' ''; return 0; }
    for claimFile in "$claimsRoot"/*/claims; do
        [[ -r "$claimFile" ]] || continue
        found="$(awk -v want="$sessionId" '
            {
                token = ""; dispatched = 0
                for (i = 1; i <= NF; i++) {
                    if ($i ~ /^session=/) token = substr($i, 9)
                    if ($i == "reason=dispatched") dispatched = 1
                }
                if (token != "" && dispatched &&
                    (token == want ||
                     (length(want) > length(token) && substr(want, 1, length(token) + 1) == token "-"))) line = $0
            }
            END { if (line != "") print line }' "$claimFile")"
        [[ -n "$found" ]] && claim="$found"
    done
    printf '%s' "$claim"
}

claimField() {
    local key="$1" line="$2" field
    for field in $line; do
        [[ "$field" == "$key="* ]] || continue
        field="${field#*=}"
        printf '%s' "${field//\"/}"
        return 0
    done
    return 1
}

adoptDispatchContext() {
    hookInput="$(cat)"
    local sessionId claimLine claimTicket claimBranch claimTarget claimWorktree claimRun claimAgent claimLabel claimRepo slug contextFile
    sessionId="$(jq -r '.session_id // empty' <<<"$hookInput" 2>/dev/null)"
    claimLine="$(dispatchLineForSession "$sessionId")"
    [[ -n "$claimLine" ]] || exit 0
    claimTicket="$(claimField ticket "$claimLine")"
    claimBranch="$(claimField branch "$claimLine")"
    claimTarget="$(claimField target "$claimLine")"
    claimWorktree="$(claimField worktree "$claimLine")"
    claimRun="$(claimField run "$claimLine")"
    claimAgent="$(claimField agent "$claimLine")"
    claimLabel="$(claimField label "$claimLine")"
    claimRepo="$(claimField repo "$claimLine")"
    if [[ -z "$claimTicket" || -z "$claimRun" ]]; then
        alarmAndExit "reason=claim-malformed msg=\"the dispatched claims line for this session carries no ticket or no run, so the hook cannot tell what it stands for\""
    fi
    worktreeDir="$claimWorktree"
    export SF_WORKTREE="$claimWorktree"
    slug="$(basename "$claimWorktree")"
    contextFile="$claimsRoot/worker-context/$slug"
    if [[ ! -r "$contextFile" ]] && { [[ -z "$claimBranch" ]] || [[ -z "$claimTarget" ]]; }; then
        alarmAndExit "reason=no-context worktree=$slug msg=\"a worker died in a loop worktree with no dispatch context; its ticket stays claimed and nobody parks it\""
    fi
    [[ -r "$contextFile" ]] && source "$contextFile"
    export SF_TICKET="$claimTicket" \
        SF_BRANCH="${claimBranch:-${branch:-}}" \
        SF_PR_TARGET="${claimTarget:-${pr_target:-}}" \
        SF_AGENT="${claimAgent:-${agent:-}}" \
        SF_LABEL="${claimLabel:-${label:-}}" \
        SF_PROJECT_DIR="${claimRepo:-${tower:-}}" \
        SF_LOG_DIR="$claimsRoot/$claimRun"
}

adoptDispatchContext

ticket="$SF_TICKET"
towerDir="${SF_PROJECT_DIR:-$PWD}"

oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-200; }

readHookInput() {
    [[ -n "$hookInput" ]] || hookInput="$(cat)"
    sessionId="$(jq -r '.session_id // empty' <<<"$hookInput" 2>/dev/null)"
    export SF_SESSION="$sessionId" SF_WORKTREE="$worktreeDir"
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

readHookInput
requireTicketStillInWork
appendTheFailureReason || alarmAndExit "reason=ticket-not-annotated kind=$failureKind"
parkTicketInFailure || alarmAndExit "reason=status-not-set kind=$failureKind from=$priorState"
sf log write failures "from=$priorState kind=$failureKind msg=\"$(oneLine <<<"$lastMessage")\""
exit 0
