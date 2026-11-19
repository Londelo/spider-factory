#!/usr/bin/env bash
# worker-stop.sh — the Stop hook that finishes a dispatched worker's ticket: guard, commit through
# `sf commit`, push, the branch's PR, annotate, close. FAIL-CLOSED on $SF_DONE_FILE — no marker, nothing
# lands, the ticket stays claimed, ERROR reason=not-declared-done (.claude/CLAUDE.md
# §The dispatcher). The hook finds its worker by SESSION ID, never by cwd: `claude --bg` hands the worker a
# pooled process that inherited neither the spawn's environment nor its working directory, so the cwd the
# hook input carries is not evidence of anything. The record of the dispatch is the claims line the loop
# wrote at $SF_LOG_ROOT/<run>/claims — ticket, branch, target, worktree and run all come off that line, and
# $SF_DONE_FILE is rebuilt from it as $SF_LOG_ROOT/<run>/done-<ticket>. The dispatch context under
# $SF_LOG_ROOT/worker-context/, keyed by the worktree's folder name (`/` as `+`), is read only as a fallback
# for what a thin claims line omits. A session with no dispatched claims line is a human's: it leaves at
# once, silently, and writes nothing anywhere.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SF_LOG_QUIET=1
source "$here/../CLI/src/user-env.sh"
loadSpiderFactoryEnv
source "$here/../CLI/src/loop-log.sh"
source "$here/../CLI/src/forge.sh"

claimsRoot="${SF_LOG_ROOT:-$HOME/.spider-factory/logs}"
logDir="${SF_LOG_DIR:-$claimsRoot}"
mkdir -p "$logDir" 2>/dev/null || true
boSeedIdentity "$logDir" "${SF_PROJECT_DIR:-$PWD}"

alarmAndExit() {
    logTo errors "$1"
    exit 0
}

hookInput=""
worktreeDir=""

contextFileForWorktree() {
    printf '%s/%s' "$claimsRoot/worker-context" "$(basename "$1")"
}

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
    local sessionId claimLine claimTicket claimBranch claimTarget claimWorktree claimRun claimAgent claimLabel claimRepo claimKind contextFile
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
    claimKind="$(claimField kind "$claimLine")"
    if [[ -z "$claimTicket" || -z "$claimRun" ]]; then
        alarmAndExit "reason=claim-malformed msg=\"the dispatched claims line for this session carries no ticket or no run, so the hook cannot tell what it stands for\""
    fi
    worktreeDir="$claimWorktree"
    contextFile="$(contextFileForWorktree "$claimWorktree")"
    if [[ ! -r "$contextFile" ]] && { [[ -z "$claimBranch" ]] || [[ -z "$claimTarget" ]]; }; then
        boIdent worktree "$claimWorktree"
        alarmAndExit "reason=no-context worktree=$(basename "$claimWorktree") msg=\"a worker stopped in a loop worktree with no dispatch context; nothing landed and the ticket stays claimed\""
    fi
    [[ -r "$contextFile" ]] && source "$contextFile"
    export SF_TICKET="$claimTicket" \
        SF_BRANCH="${claimBranch:-${branch:-}}" \
        SF_PR_TARGET="${claimTarget:-${pr_target:-}}" \
        SF_AGENT="${claimAgent:-${agent:-}}" \
        SF_LABEL="${claimLabel:-${label:-}}" \
        SF_PROJECT_DIR="${claimRepo:-${tower:-}}" \
        SF_LOG_DIR="$claimsRoot/$claimRun" \
        SF_DONE_FILE="$claimsRoot/$claimRun/done-${claimTicket//\//+}" \
        SF_WORK_KIND="${claimKind:-${kind:-task}}"
}

adoptDispatchContext

ticket="$SF_TICKET"
branch="${SF_BRANCH:-}"
prTarget="${SF_PR_TARGET:-}"
towerDir="${SF_PROJECT_DIR:-$PWD}"
logDir="${SF_LOG_DIR:-${SF_LOG_ROOT:-$HOME/.spider-factory/logs}}"
mkdir -p "$logDir" 2>/dev/null || true
boSeedIdentity "$logDir" "$towerDir"

oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-160; }

declareRunIdentity() {
    boIdent ticket "$ticket"
    boIdent branch "$branch"
    boIdent target "$prTarget"
    boIdent agent "${SF_AGENT:-}"
    boIdent label "${SF_LABEL:-}"
}

requireTools() {
    local requiredTool
    for requiredTool in bd jq git sf; do
        command -v "$requiredTool" >/dev/null 2>&1 ||
            alarmAndExit "reason=missing-tool tool=$requiredTool"
    done
}

readHookInput() {
    [[ -n "$hookInput" ]] || hookInput="$(cat)"
    [[ -n "$worktreeDir" && -d "$worktreeDir" ]] ||
        alarmAndExit "reason=no-worktree msg=\"the dispatched claims line for this session names no worktree that exists, so the worktree the work sits in is unknown; the hook will not guess it from the hook input's cwd\""
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
        alarmAndExit "reason=no-branch msg=\"SF_BRANCH was not on the spawn; the loop reads it off the gate the ticket's id names, so that gate carries no 'branch' key\""
    fi
    if [[ -z "$prTarget" ]]; then
        alarmAndExit "reason=no-pr-target msg=\"SF_PR_TARGET was not on the spawn; the loop reads the target off the ticket's epic gate, and says main when the ticket sits under the epic itself\""
    fi
}

requireWorkerDeclaredDone() {
    if [[ ! -e "${SF_DONE_FILE:-/nonexistent-sf-done-file}" ]]; then
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
    ( cd "$worktreeDir" && sf commit "$title

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

prUrlOfBranchWhateverItsState() {
    if [[ "$forge" == gitlab ]]; then
        (cd "$worktreeDir" && glab mr list --source-branch "$branch" --target-branch "$prTarget" --all -F json 2>/dev/null) |
            jq -r '.[0].web_url // empty'
    else
        (cd "$worktreeDir" && gh pr list --head "$branch" --base "$prTarget" --state all --json url -q '.[0].url // empty' 2>/dev/null)
    fi
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
    printf 'Branch `%s` into `%s`, assembled one task at a time by the spider-factory loop.\n\nLast task closed onto it: **%s** (%s)\n' \
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

if [[ "${SF_WORK_KIND:-task}" == gate ]]; then
    prUrl="$(prUrlOfBranchWhateverItsState)"
    [[ "$prUrl" =~ ^https?://[^[:space:]]+$ ]] ||
        alarmAndExit "reason=pr-not-found forge=$forge msg=\"the lead agent stopped on a gate whose branch has no pull request at all, so there was nothing for it to merge and the gate stays claimed\""
    annotateTicketWithThePr || alarmAndExit "reason=ticket-not-annotated pr=$prUrl"
    closeTicketAsItsClaimant || alarmAndExit "reason=close-failed pr=$prUrl"
    logTo closes "url=$prUrl gate=true"
    rm -f "$(contextFileForWorktree "$worktreeDir")"
    exit 0
fi

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
