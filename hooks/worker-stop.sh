#!/usr/bin/env bash
# worker-stop.sh — the Stop hook that finishes a dispatched worker's ticket: guard, commit through
# `bo commit`, push, the branch's PR, annotate, close. FAIL-CLOSED on $BO_DONE_FILE — no marker, nothing
# lands, the ticket stays claimed, ERROR reason=not-declared-done (.claude/CLAUDE.md
# §The dispatcher). `claude --bg` hands the worker a pooled process that never inherited the spawn's
# environment, so the BO_* keys usually arrive only through the dispatch context the loop wrote under
# $BO_LOG_ROOT/worker-context/, keyed by the worktree's folder name — which is the branch, `/` as `+`.
# A session whose cwd is not a loop worktree is a human's and leaves at once.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BO_LOG_QUIET=1
source "$here/../CLI/user-env.sh"
loadObeliskEnv
source "$here/../CLI/loop-log.sh"
source "$here/../CLI/forge.sh"

logDir="${BO_LOG_DIR:-${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}}"
mkdir -p "$logDir" 2>/dev/null || true
boSeedIdentity "$logDir" "${BO_PROJECT_DIR:-$PWD}"

alarmAndExit() {
    logTo errors "$1"
    exit 0
}

hookInput=""

contextFileForWorktree() {
    printf '%s/%s' "${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}/worker-context" "$(basename "$1")"
}

adoptDispatchContext() {
    [[ -n "${BO_TICKET:-}" ]] && return 0
    hookInput="$(cat)"
    local cwd contextFile
    cwd="$(jq -r '.cwd // empty' <<<"$hookInput" 2>/dev/null)"
    [[ "$(basename "$(dirname "${cwd:-/nonexistent}")")" == "worktrees" ]] || exit 0
    contextFile="$(contextFileForWorktree "$cwd")"
    if [[ ! -r "$contextFile" ]]; then
        boIdent worktree "$cwd"
        alarmAndExit "reason=no-context worktree=$(basename "$cwd") msg=\"a worker stopped in a loop worktree with no dispatch context; nothing landed and the ticket stays claimed\""
    fi
    source "$contextFile"
    export BO_TICKET="${ticket:-}" BO_BRANCH="${branch:-}" BO_PR_TARGET="${pr_target:-}" \
        BO_AGENT="${agent:-}" BO_LABEL="${label:-}" BO_PROJECT_DIR="${tower:-}" \
        BO_DONE_FILE="${done_file:-}" BO_LOG_DIR="${done_file%/*}"
}

adoptDispatchContext

ticket="$BO_TICKET"
branch="${BO_BRANCH:-}"
prTarget="${BO_PR_TARGET:-}"
towerDir="${BO_PROJECT_DIR:-$PWD}"
logDir="${BO_LOG_DIR:-${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}}"
mkdir -p "$logDir" 2>/dev/null || true
boSeedIdentity "$logDir" "$towerDir"

oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-160; }

declareRunIdentity() {
    boIdent ticket "$ticket"
    boIdent branch "$branch"
    boIdent target "$prTarget"
    boIdent agent "${BO_AGENT:-}"
    boIdent label "${BO_LABEL:-}"
}

requireTools() {
    local requiredTool
    for requiredTool in bd jq git bo; do
        command -v "$requiredTool" >/dev/null 2>&1 ||
            alarmAndExit "reason=missing-tool tool=$requiredTool"
    done
}

readHookInput() {
    [[ -n "$hookInput" ]] || hookInput="$(cat)"
    worktreeDir="$(jq -r '.cwd // empty' <<<"$hookInput" 2>/dev/null)"
    [[ -n "$worktreeDir" && -d "$worktreeDir" ]] ||
        alarmAndExit "reason=no-worktree msg=\"the hook input carried no cwd, so the worktree the work sits in is unknown; the hook will not guess from its own directory\""
    sessionId="$(jq -r '.session_id // empty' <<<"$hookInput" 2>/dev/null)"
    boIdent worktree "$worktreeDir"
    boIdent session "$sessionId"
}

ticketState() {
    bd -C "$towerDir" show --json "$ticket" 2>/dev/null \
        | jq -r 'if type == "array" then .[0] else . end | .status // empty' 2>/dev/null
}

requireTicketStillInWork() {
    local state
    state="$(ticketState)"
    if [[ "$state" == "closed" ]]; then
        exit 0
    fi
    if [[ "$state" != "in_progress" ]]; then
        alarmAndExit "reason=ticket-not-in-work state=\"${state:-not-found}\""
    fi
}

requireSpawnEnvironment() {
    if [[ -z "$branch" ]]; then
        alarmAndExit "reason=no-branch msg=\"BO_BRANCH was not on the spawn; the ticket's metadata should carry a 'branch' key\""
    fi
    if [[ -z "$prTarget" ]]; then
        alarmAndExit "reason=no-pr-target msg=\"BO_PR_TARGET was not on the spawn; the loop reads the target off the ticket's epic gate, and says main when the ticket sits under the epic itself\""
    fi
}

requireWorkerDeclaredDone() {
    if [[ ! -e "${BO_DONE_FILE:-/nonexistent-bo-done-file}" ]]; then
        alarmAndExit "reason=not-declared-done msg=\"the worker stopped without touching its done file; nothing was committed and the ticket stays open — the tasks behind it wait\""
    fi
}

requireWorkOnItsOwnBranch() {
    local currentBranch
    currentBranch="$(git -C "$worktreeDir" branch --show-current 2>/dev/null)"
    if [[ "$currentBranch" != "$branch" ]]; then
        alarmAndExit "reason=wrong-branch want=$branch got=\"${currentBranch:-detached}\""
    fi
}

ticketTitleOf() {
    bd -C "$towerDir" show --json --long "$ticket" 2>/dev/null \
        | jq -r 'if type == "array" then .[0] else . end | .title // ""' 2>/dev/null
}

stageTheWork() {
    git -C "$worktreeDir" add -A >/dev/null 2>&1
    ! git -C "$worktreeDir" diff --cached --quiet 2>/dev/null
}

commitTheTask() {
    ( cd "$worktreeDir" && bo commit "$title

Ticket: $ticket" ) >/dev/null 2>&1
    git -C "$worktreeDir" diff --cached --quiet 2>/dev/null
}

pushTheBranch() {
    pushOutput="$(git -C "$worktreeDir" push -u origin "$branch" 2>&1)"
}

requireForge() {
    forge="$(detectForge "$worktreeDir")"
    if [[ -z "$forge" ]]; then
        alarmAndExit "reason=forge-unknown remote=\"$remoteUrl\""
    fi
    forgeTool="$(forgeToolFor "$forge")"
    command -v "$forgeTool" >/dev/null 2>&1 ||
        alarmAndExit "reason=missing-tool tool=$forgeTool forge=$forge"
}

prUrlAlreadyOnBranch() {
    if [[ "$forge" == gitlab ]]; then
        (cd "$worktreeDir" && glab mr list --source-branch "$branch" --target-branch "$prTarget" -F json 2>/dev/null) |
            jq -r '.[0].web_url // empty'
    else
        (cd "$worktreeDir" && gh pr list --head "$branch" --base "$prTarget" --state open --json url -q '.[0].url // empty' 2>/dev/null)
    fi
}

openThePrForBranch() {
    printf 'Branch `%s` into `%s`, assembled one task at a time by the binary-obelisk loop.\n\nLast task closed onto it: **%s** (%s)\n' \
        "$branch" "$prTarget" "$title" "$ticket" >"$bodyFile"
    if [[ "$forge" == gitlab ]]; then
        (cd "$worktreeDir" && glab mr create \
            --title "$branch" \
            --description-file "$bodyFile" \
            --source-branch "$branch" \
            --target-branch "$prTarget" \
            --push=false --yes 2>&1)
    else
        (cd "$worktreeDir" && gh pr create \
            --title "$branch" \
            --body-file "$bodyFile" \
            --head "$branch" \
            --base "$prTarget" 2>&1)
    fi
}

pullRequestUrlOnly() {
    grep -oE 'https?://[^[:space:]]+' | grep -E '/(pull|merge_requests)/[0-9]+' | tail -1
}

annotateTicketWithThePr() {
    bd -C "$towerDir" update "$ticket" --set-metadata "pr=$prUrl" >/dev/null 2>&1
}

closeTicketAsItsClaimant() {
    bd -C "$towerDir" close "$ticket" --session "$sessionId" \
        --reason "worker session $(oneLine <<<"$sessionId") finished; PR $prUrl" >/dev/null 2>&1
}

declareRunIdentity
requireTools
readHookInput
requireTicketStillInWork
requireSpawnEnvironment
requireWorkerDeclaredDone
requireWorkOnItsOwnBranch

title="$(ticketTitleOf)"
[[ -n "$title" ]] || alarmAndExit "reason=ticket-has-no-title"

if stageTheWork; then
    commitTheTask || alarmAndExit "reason=commit-failed msg=\"the commit for this task did not land on its branch\""
fi
pushTheBranch || alarmAndExit "reason=push-failed msg=\"$(oneLine <<<"$pushOutput")\""
requireForge

bodyFile="$(mktemp)" || exit 0
trap 'rm -f "$bodyFile"' EXIT

prUrl="$(prUrlAlreadyOnBranch)"
[[ -n "$prUrl" ]] || prUrl="$(openThePrForBranch | pullRequestUrlOnly)"
[[ "$prUrl" =~ ^https?://[^[:space:]]+$ ]] ||
    alarmAndExit "reason=pr-not-created forge=$forge msg=\"$(oneLine <<<"$prUrl")\""

annotateTicketWithThePr || alarmAndExit "reason=ticket-not-annotated pr=$prUrl"
closeTicketAsItsClaimant || alarmAndExit "reason=close-failed pr=$prUrl"

logTo closes "url=$prUrl"
rm -f "$(contextFileForWorktree "$worktreeDir")"
exit 0
