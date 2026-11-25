#!/usr/bin/env bash
# worker-stop.sh — the Stop hook that finishes a dispatched worker's ticket: guard, commit through
# `sf commit`, push, the branch's PR, annotate, close. The Stop event itself is the only signal that a
# worker finished: a session whose dispatch is on the claims line is authority to land the work
# (.claude/CLAUDE.md §The dispatcher). Registered as the `Stop` hook in the frontmatter of the seven
# worker agents, which reaches this file as `sf hook stop`; nothing else calls it. The hook finds its
# worker by SESSION ID, never by cwd: `claude --bg` hands the worker a pooled process whose environment
# was frozen by the daemon at its first spawn, and the spawn writes no environment at all, so nothing in
# this shell says anything about the session it runs for.
# The cwd is not frozen — a claimed spare is chdir'd to the spawn's cwd, so `$PWD` and the hook input's
# `cwd` are the worktree — but a worktree belongs to a branch and not to a ticket, so it names nothing
# here. The record of the dispatch is the claims line the loop wrote at $SF_LOG_ROOT/<run>/claims —
# ticket, branch, target, worktree and run all come off that line. The dispatch context under
# $SF_LOG_ROOT/worker-context/, keyed by the worktree's folder name (`/` as `+`), is read only as a
# fallback for what a thin claims line omits. A session with no dispatched claims line is a human's: it
# leaves at once, silently, and writes nothing anywhere.
# The Stop event says a turn ended, not that the work ended: a worker whose last message asks a question
# has finished responding, so Stop fires for it too, and closing that ticket buries unfinished work. The
# verdict comes from the session's own job record, $CLAUDE_CONFIG_DIR/jobs/<first 8 of the session id>/
# state.json, which the supervisor writes before Stop fires. 'claude agents --json' is read by nothing
# here and cannot be: the session is busy running this hook, so it reports state=working for every
# worker, finished or not, for as long as this script lives. Only state=done closes; blocked means the
# session is parked on a person — a question, a permission it was denied, an API error only a human can
# clear — and the ticket stays claimed, uncommitted, until someone answers it and it stops again clean.
# That record is Claude Code's own and undocumented, and it is the only thing this hook asks. A verdict the
# hook cannot read is never a verdict it guesses at: it closes nothing.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export SF_LOG_QUIET=1
source "$here/../../utils/user-env.sh"
loadSpiderFactoryEnv
source "$here/../../utils/forge.sh"
source "$here/../../utils/logging.sh"

claimsRoot="${SF_LOG_ROOT:-$HOME/.spider-factory/logs}"

logLine() {
    local tag="$1"
    shift
    logDir="${SF_LOG_DIR:-${SF_LOG_ROOT:-$HOME/.spider-factory/logs}}"
    mkdir -p "$logDir" 2>/dev/null || return 0
    takeLogFieldsFromEnvironment
    writeLog "$tag" "$@"
}

alarmAndExit() {
    logLine errors "$1"
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
    local sessionId claimLine claimTicket claimBranch claimTarget claimWorktree claimRun claimAgent claimLabel claimRepo claimKind contextFile contextLine contextKind
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
    export SF_WORKTREE="$claimWorktree"
    contextFile="$(contextFileForWorktree "$claimWorktree")"
    if [[ ! -r "$contextFile" ]] && { [[ -z "$claimBranch" ]] || [[ -z "$claimTarget" ]]; }; then
        alarmAndExit "reason=no-context worktree=$(basename "$claimWorktree") msg=\"a worker stopped in a loop worktree with no dispatch context; nothing landed and the ticket stays claimed\""
    fi
    contextLine=""
    [[ -r "$contextFile" ]] && contextLine="$(cat "$contextFile")"
    contextKind="$(claimField kind "$contextLine")"
    export SF_TICKET="$claimTicket" \
        SF_BRANCH="${claimBranch:-$(claimField branch "$contextLine")}" \
        SF_PR_TARGET="${claimTarget:-$(claimField pr_target "$contextLine")}" \
        SF_AGENT="${claimAgent:-$(claimField agent "$contextLine")}" \
        SF_LABEL="${claimLabel:-$(claimField label "$contextLine")}" \
        SF_PROJECT_DIR="${claimRepo:-$(claimField tower "$contextLine")}" \
        SF_LOG_DIR="$claimsRoot/$claimRun" \
        SF_WORK_KIND="${claimKind:-${contextKind:-task}}"
}

adoptDispatchContext

ticket="$SF_TICKET"
branch="${SF_BRANCH:-}"
prTarget="${SF_PR_TARGET:-}"
towerDir="${SF_PROJECT_DIR:-$PWD}"

oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-160; }

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
    export SF_WORKTREE="$worktreeDir" SF_SESSION="$sessionId"
}

sessionVerdict=""
sessionNeeds=""

readVerdictFromJobRecord() {
    local jobFile
    jobFile="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/jobs/${sessionId:0:8}/state.json"
    [[ -r "$jobFile" ]] || {
        sessionVerdict="no-record"
        return 0
    }
    sessionVerdict="$(jq -r '.state // empty' "$jobFile" 2>/dev/null)"
    sessionNeeds="$(jq -r '.needsAsk.text // empty' "$jobFile" 2>/dev/null)"
    [[ -n "$sessionVerdict" ]] || sessionVerdict="unreadable"
}

requireSessionFinished() {
    readVerdictFromJobRecord
    case "$sessionVerdict" in
        done) return 0 ;;
        blocked)
            alarmAndExit "reason=worker-needs-input needs=\"$(oneLine <<<"$sessionNeeds")\" msg=\"the worker stopped to ask for something only a person can give it, so its work is not finished; the ticket stays claimed and nothing landed until someone answers the session and it stops again with nothing pending\""
            ;;
        failed | stopped)
            alarmAndExit "reason=worker-$sessionVerdict msg=\"the worker's session ended in state=$sessionVerdict, which is not a finished turn; the ticket stays claimed\""
            ;;
        *)
            alarmAndExit "reason=session-verdict-unknown verdict=$sessionVerdict msg=\"the hook could not read a verdict for session $sessionId, and will not close a ticket on one it cannot read; the ticket stays claimed\""
            ;;
    esac
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

requireDispatchRecord() {
    if [[ -z "$branch" ]]; then
        alarmAndExit "reason=no-branch msg=\"no branch on the dispatch record for this worktree; the loop reads it off the gate the ticket's id names, so that gate carries no 'branch' key\""
    fi
    if [[ -z "$prTarget" ]]; then
        alarmAndExit "reason=no-pr-target msg=\"no pull-request target on the dispatch record for this worktree; the loop derives it off the ticket's epic gate, and says main when the ticket sits under the epic itself\""
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

requireTools
readHookInput
requireSessionFinished
requireTicketStillInWork
requireDispatchRecord
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
    logLine closes "url=$prUrl gate=true"
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

logLine closes "url=$prUrl"
rm -f "$(contextFileForWorktree "$worktreeDir")"
exit 0
