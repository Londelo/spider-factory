#!/usr/bin/env bash
# beads-loop.sh — the claim-beads dispatcher: each tick claims one ready ticket and spawns its worker.
#   bo loop   (or ./beads-loop.sh) from inside the tower project; Ctrl-C stops dispatching.
#   BO_MAX_PARALLEL (4) workers at once | BO_POLL_S (3) seconds per tick, must divide 60 | BO_MAX_TICKS (0 = never ends)
#   BO_LOG_ROOT (~/.binary-obelisk/logs) one directory per run | BO_ALLOWED_LABELS unset or * = the whole AGENT set, a comma list narrows it
#   BO_AGENT_COMMAND (claude) the command that runs an agent — every worker spawn and the worker count go through it
#   Every one of them may live in ~/.obelisk.env, which CLI/install-cli.sh puts there and you edit by hand.
#   Contract: this file is the contract. .claude/diagram/ is its human-terms account; .claude/CLAUDE.md points at both.
set -uo pipefail

engineDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$engineDir/user-env.sh"
loadObeliskEnv

declare -A AGENT=(
    [backend-logic]=engineer
    [frontend-ui]=frontend
    [unit-tests]=tester-unit
    [feature-test]=tester-feature
    [epic-e2e-test]=tester-e2e
    [feature-review]=review
    [epic-review]=review
    [epic-merge-pr]=merge
)

declare -A numericSettingEnvName=(
    [maximumParallelWorkers]=BO_MAX_PARALLEL
    [pollSeconds]=BO_POLL_S
    [maximumTicks]=BO_MAX_TICKS
)

declare -A allowedLabel=()
declare -A lastTickForWaitingReason=()

maximumParallelWorkers=0
pollSeconds=0
maximumTicks=0
logRoot=""
agentCommand=""
waitingLineCadence=0
maximumClaimsPerTick=0
tickCount=0
claimedThisRun=0
tryNextClaim=0

configureFromEnvironment() {
    maximumParallelWorkers="${BO_MAX_PARALLEL:-4}"
    pollSeconds="${BO_POLL_S:-3}"
    maximumTicks="${BO_MAX_TICKS:-0}"
    logRoot="${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}"
    agentCommand="${BO_AGENT_COMMAND:-claude}"
}

configureAllowedLabels() {
    local labelKey
    local -a configuredLabels=()
    if [[ -z "${BO_ALLOWED_LABELS:-}" || "${BO_ALLOWED_LABELS:-}" == "*" ]]; then
        for labelKey in "${!AGENT[@]}"; do
            allowedLabel["$labelKey"]=1
        done
        return
    fi
    IFS=',' read -ra configuredLabels <<< "$BO_ALLOWED_LABELS"
    for labelKey in "${configuredLabels[@]}"; do
        allowedLabel["$labelKey"]=1
    done
}

isLabel() {
    [[ -n "${AGENT["$1"]+set}" ]] && [[ -n "${allowedLabel["$1"]+set}" ]]
}

requireToolsOnPath() {
    local requiredTool
    for requiredTool in bd jq git "${agentCommand%% *}"; do
        command -v "$requiredTool" >/dev/null 2>&1 || {
            echo "beads-loop: $requiredTool not found on PATH" >&2
            exit 1
        }
    done
}

requireNumericSettingsFromEnvironment() {
    local settingName
    for settingName in maximumParallelWorkers pollSeconds maximumTicks; do
        [[ "${!settingName}" =~ ^[0-9]+$ ]] || {
            echo "beads-loop: ${numericSettingEnvName[$settingName]}=${!settingName} is not a number" >&2
            exit 1
        }
    done
}

requireUsablePollInterval() {
    (( pollSeconds > 0 && 60 % pollSeconds == 0 )) || {
        echo "beads-loop: BO_POLL_S=$pollSeconds is unusable — it must divide 60 (1 2 3 4 5 6 10 12 15 20 30 60)" >&2
        exit 1
    }
}

configureWaitingLineCadence() {
    waitingLineCadence=$(( 60 / pollSeconds ))
}

configureMaximumClaimsPerTick() {
    maximumClaimsPerTick=$(( maximumParallelWorkers + 2 ))
}

runningInABeadsProject() {
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1
}

requireBeadsProject() {
    runningInABeadsProject || {
        echo "beads-loop: no beads database found from $PWD — cd into the tower project and re-run" >&2
        exit 1
    }
}

createRunLogDirectory() {
    local logFileName
    logDir="$logRoot/$(date +%F_%H-%M-%S)"
    mkdir -p "$logDir" 2>/dev/null || { echo "beads-loop: cannot create $logDir" >&2; exit 1; }
    for logFileName in claims errors waiting results closes failures; do : > "$logDir/$logFileName"; done
}

resolveTowerPaths() {
    towerDir="$PWD"
    worktreesRoot="$towerDir/.claude/worktrees"
}

announceRunLogDirectory() {
    echo "beads-loop: logging to $logDir  (Ctrl-C to stop)"
}

lastLineOf() { tail -1 "$1" 2>/dev/null; }

countOf() {
    local digits="${1-}"
    digits="${digits//[!0-9]/}"
    printf '%s' "${digits:-0}"
}

numberOfBusyWorkers() {
    $agentCommand agents --json 2>"$logDir/claude-stderr" \
        | jq --arg root "$worktreesRoot" --arg tower "$towerDir" \
          '[ .[] | select(.kind == "background")
                 | select((.cwd // "") | startswith($root) or . == $tower) ] | length' 2>/dev/null
}

branchesCurrentlyAtWork() {
    bd list --status in_progress --limit 0 --json 2>/dev/null \
        | jq -r '.[] | .metadata.branch // empty' | sort -u
}

worktreePathFor() { echo "$worktreesRoot/${1//\//+}"; }

branchAlreadyCheckedOut() {
    git -C "$towerDir" worktree list --porcelain 2>/dev/null \
        | awk -v want="refs/heads/$1" '$1=="worktree"{path=$2} $1=="branch" && $2==want {print path; exit}'
}

startingCommitFor() {
    local candidate resolved
    for candidate in "$@"; do
        resolved="$(git -C "$towerDir" rev-parse --verify --quiet "${candidate}^{commit}" 2>/dev/null)" || continue
        [[ -n "$resolved" ]] || continue
        printf '%s' "$resolved"
        return 0
    done
    return 1
}

remoteShaOfBranch() {
    git -C "$towerDir" ls-remote --heads origin "$1" 2>/dev/null \
        | awk -v want="refs/heads/$1" '$2 == want {print $1; exit}'
}

branchSeedFailure=""

ensureBranchAheadOfBase() {
    local branch="$1" baseSha="$2" remoteSha seedSha
    branchSeedFailure=""
    remoteSha="$(remoteShaOfBranch "$branch")"
    [[ -z "$remoteSha" || "$remoteSha" == "$baseSha" ]] || return 0
    seedSha="$(git -C "$towerDir" commit-tree "${baseSha}^{tree}" -p "$baseSha" \
        -m "chore: open $branch" 2>/dev/null)" || {
        branchSeedFailure="commit-tree-failed"
        return 1
    }
    git -C "$towerDir" push --quiet origin "$seedSha:refs/heads/$branch" >/dev/null 2>&1 || {
        branchSeedFailure="push-failed"
        return 1
    }
}

unseenCommitsOn() {
    git -C "$towerDir" rev-list --count "$1" --not --remotes=origin 2>/dev/null
}

moveStrayFolderAside() {
    local dir="$1" aside
    [[ -d "$dir" ]] || return 0
    [[ -z "$(ls -A "$dir" 2>/dev/null)" ]] && return 0
    aside="$dir.stale-$(date +%s)"
    mv "$dir" "$aside" 2>/dev/null || return 1
    printf '%s' "$aside"
}

ensureWorktree() {
    local branch="$1" prTarget="$2" existing start unseen
    worktreePath=""
    worktreeAside=""
    worktreeFailure="add-failed"
    existing="$(branchAlreadyCheckedOut "$branch")"
    if [[ -n "$existing" && -d "$existing" ]]; then
        worktreePath="$existing"
        worktreeFailure=""
        return 0
    fi
    worktreePath="$(worktreePathFor "$branch")"
    [[ -e "$worktreePath" ]] || mkdir -p "$worktreesRoot"
    git -C "$towerDir" fetch --quiet origin 2>/dev/null || true
    git -C "$towerDir" worktree prune >/dev/null 2>&1 || true
    unseen="$(unseenCommitsOn "$branch")"
    if [[ -n "$unseen" && "$unseen" -gt 0 ]]; then
        worktreeFailure="unpushed-commits"
        return 1
    fi
    worktreeAside="$(moveStrayFolderAside "$worktreePath")" || {
        worktreeFailure="folder-immovable"
        return 1
    }
    start="$(startingCommitFor "origin/$branch" "origin/$prTarget" "$prTarget" "HEAD")" || {
        worktreeFailure="no-start"
        return 1
    }
    git -C "$towerDir" worktree add -B "$branch" "$worktreePath" "$start" >/dev/null 2>&1 || return 1
    [[ -d "$worktreePath" ]] || { worktreePath=""; return 1; }
    worktreeFailure=""
}

readFieldOf() {
    local id="$1" key="$2"
    [[ -n "$id" ]] || return 1
    bd -C "$towerDir" show --json "$id" 2>/dev/null \
        | jq -r --arg k "$key" 'if type == "array" then .[0] else . end
            | if $k == "parent" then (.parent // empty) else ((.metadata // {})[$k] // empty) end' 2>/dev/null
}

epicGateOf() {
    local id="$1" hop=0 parentId
    [[ -n "$id" ]] || return 1
    while (( hop++ < 4 )); do
        parentId="$(readFieldOf "$id" parent)"
        [[ -n "$parentId" ]] || { echo "$id"; return 0; }
        id="$parentId"
    done
    return 1
}

ensureEpicGatePr() {
    local gateId="$1"
    local gateBranch forge forgeTool prUrl bodyFile start prBody
    [[ -n "$(readFieldOf "$gateId" pr)" ]] && return 0

    gateBranch="$(readFieldOf "$gateId" branch)"
    if [[ -z "$gateBranch" ]]; then
        logTo errors "reason=epic-pr-failed step=gate-branch gate=$gateId msg=\"the epic gate carries no branch metadata, so nothing beneath it has a base branch\""
        return 1
    fi
    forge="$(detectForge "$towerDir")"
    if [[ -z "$forge" ]]; then
        logTo errors "reason=epic-pr-failed step=forge gate=$gateId gateBranch=$gateBranch remote=\"$remoteUrl\""
        return 1
    fi
    forgeTool="$(forgeToolFor "$forge")"
    if ! command -v "$forgeTool" >/dev/null 2>&1; then
        logTo errors "reason=epic-pr-failed step=missing-tool tool=$forgeTool forge=$forge gate=$gateId"
        return 1
    fi

    start="$(startingCommitFor "origin/main" "main" "HEAD")" || {
        logTo errors "reason=epic-pr-failed step=push gate=$gateId gateBranch=$gateBranch msg=\"the epic branch could not be published off main\""
        return 1
    }
    if ! ensureBranchAheadOfBase "$gateBranch" "$start"; then
        if [[ "$branchSeedFailure" == commit-tree-failed ]]; then
            logTo errors "reason=epic-pr-failed step=seed gate=$gateId gateBranch=$gateBranch msg=\"the epic branch could not be given its own first commit — git has no user.name and user.email to sign one with\""
        else
            logTo errors "reason=epic-pr-failed step=push gate=$gateId gateBranch=$gateBranch msg=\"the epic branch could not be published off main\""
        fi
        return 1
    fi

    if [[ "$forge" == gitlab ]]; then
        prUrl="$(cd "$towerDir" && glab mr list --source-branch "$gateBranch" --target-branch main -F json 2>/dev/null \
            | jq -r '.[0].web_url // empty')"
    else
        prUrl="$(cd "$towerDir" && gh pr list --head "$gateBranch" --base main --state open --json url -q '.[0].url // empty' 2>/dev/null)"
    fi
    if [[ -z "$prUrl" ]]; then
        bodyFile="$(mktemp)" || return 1
        printf 'The epic branch. Every feature branch under **%s** aims its pull request at this one; it is assembled ticket by ticket by the binary-obelisk loop and merged into `main` when the epic gate closes.\n' \
            "$gateId" > "$bodyFile"
        if [[ "$forge" == gitlab ]]; then
            prBody="$(cd "$towerDir" && glab mr create --title "$gateBranch" --description-file "$bodyFile" \
                --source-branch "$gateBranch" --target-branch main --push=false --yes 2>&1)"
        else
            prBody="$(cd "$towerDir" && gh pr create --title "$gateBranch" --body-file "$bodyFile" \
                --head "$gateBranch" --base main 2>&1)"
        fi
        rm -f "$bodyFile"
        prUrl="$(grep -oE 'https?://[^[:space:]]+' <<<"$prBody" | grep -E '/(pull|merge_requests)/[0-9]+' | tail -1)"
    fi
    if ! [[ "$prUrl" =~ ^https?://[^[:space:]]+$ ]]; then
        logTo errors "reason=epic-pr-failed step=pr gate=$gateId gateBranch=$gateBranch forge=$forge msg=\"$(tr '\n' ' ' <<<"${prBody-$prUrl}" | cut -c1-160)\""
        return 1
    fi
    if ! bd -C "$towerDir" update "$gateId" --set-metadata "pr=$prUrl" >/dev/null 2>&1; then
        logTo errors "reason=epic-pr-failed step=annotate gate=$gateId pr=$prUrl"
        return 1
    fi
    logTo claims "gate=$gateId reason=epic-published gateBranch=$gateBranch pr=$prUrl"
    return 0
}

numberOfTicketsInWork() {
    bd list --status in_progress --limit 50 --json 2>/dev/null | jq 'length' 2>/dev/null
}

numberOfStalledTickets() {
    bd list --status open,blocked --limit 0 --json 2>/dev/null | jq 'length' 2>/dev/null
}

nameOfNextReadyTicket() {
    local peekedTicketId
    peekedTicketId="$(bd ready --json 2>/dev/null | jq -r '.[0].id // empty' 2>/dev/null)"
    echo "${peekedTicketId:-(none)}"
}

waiting() {
    local waitingReason="$1" extraFields="${2-}"
    local lastTick="${lastTickForWaitingReason["$waitingReason"]-$(( -waitingLineCadence ))}"
    (( tickCount - lastTick < waitingLineCadence )) && return 0
    lastTickForWaitingReason["$waitingReason"]=$tickCount
    logTo waiting "reason=$waitingReason working=$(numberOfBusyWorkers) next=$(nameOfNextReadyTicket)${extraFields:+ $extraFields}"
}

atDispatchCapacity() {
    local busyWorkers inProgressTickets
    busyWorkers="$(countOf "$(numberOfBusyWorkers)")"
    (( busyWorkers < maximumParallelWorkers )) && return 1
    inProgressTickets="$(countOf "$(numberOfTicketsInWork)")"
    if [[ "$inProgressTickets" == "0" ]]; then
        waiting max_parallel_stalled "in_progress=0"
    else
        waiting max_parallel "in_progress=$inProgressTickets"
    fi
    return 0
}

readClaimFromFrontier() {
    claimExitCode=0
    claimJson="$(bd ready --claim --json 2>"$logDir/bd-stderr")" || claimExitCode=$?
    (( claimExitCode == 0 )) && return 0
    logTo errors "reason=bd-failure exit=$claimExitCode msg=\"$(lastLineOf "$logDir/bd-stderr")\""
    return 1
}

frontierHeldNoTicket() { [[ -z "$claimJson" || "$claimJson" == "[]" ]]; }

readTicketIdentityFromClaim() {
    ticketId="$(jq -r '.[0].id // empty' <<< "$claimJson" 2>/dev/null)"
    boIdent ticket "$ticketId"
    [[ -n "$ticketId" ]] && return 0
    logTo errors "reason=bd-failure exit=0 msg=\"claim returned no id: $(tr -d '\n' <<< "$claimJson" | head -c 60)\""
    return 1
}

readClaimFields() {
    mapfile -t ticketLabels < <(jq -r '.[0].labels // [] | .[]' <<< "$claimJson" 2>/dev/null)
    branch="$(jq -r '.[0].metadata.branch // empty' <<< "$claimJson" 2>/dev/null)"
    claimParent="$(jq -r '.[0].parent // empty' <<< "$claimJson" 2>/dev/null)"
    boIdent branch "$branch"
}

claimCarriesExactlyOneDispatchLabel() {
    local ticketLabel
    matchedLabels=()
    for ticketLabel in "${ticketLabels[@]}"; do
        isLabel "$ticketLabel" && matchedLabels+=("$ticketLabel")
    done
    if (( ${#matchedLabels[@]} == 1 )); then
        boIdent label "${matchedLabels[0]}"
        return 0
    fi
    logTo errors "reason=label-ambiguous matched=\"${matchedLabels[*]-}\" labels=\"${ticketLabels[*]-}\""
    return 1
}

claimCarriesBranch() {
    [[ -n "$branch" ]] && return 0
    logTo errors "reason=metadata-missing msg=\"the plan agents create every ticket with --metadata carrying a branch; with no branch key the loop has nowhere to put this work\""
    return 1
}

claimWasAlreadySkippedThisTick() { [[ -n "${skippedTicket["$ticketId"]-}" ]]; }

claimedBranchIsAlreadyAtWork() { [[ "$busyBranches" == *$'\n'"$branch"$'\n'* ]]; }

releaseClaim() { bd unclaim "$1" >/dev/null 2>&1 || true; }

skipClaimedTicketForThisTick() {
    logTo claims "reason=branch-busy unclaimed"
    releaseClaim "$ticketId"
    skippedTicket["$ticketId"]=1
}

reportEmptyFrontier() {
    local stalledTickets
    if (( ${#skippedTicket[@]} > 0 )); then
        waiting branch_busy "held=${#skippedTicket[@]}"
        return
    fi
    stalledTickets="$(countOf "$(numberOfStalledTickets)")"
    if [[ "$stalledTickets" == "0" ]]; then
        waiting frontier_empty
    else
        waiting tower_stalled "waiting=$stalledTickets"
    fi
}

resolvePullRequestTarget() {
    gateId="$(epicGateOf "$claimParent")" || {
        logTo errors "reason=epic-pr-failed step=walk msg=\"no epic gate above this ticket's parent\""
        return 1
    }
    if [[ "$gateId" == "$claimParent" ]]; then
        prTarget="main"
    else
        prTarget="$(readFieldOf "$gateId" branch)"
        [[ -n "$prTarget" ]] || {
            logTo errors "reason=epic-pr-failed step=gate-branch gate=$gateId msg=\"the epic gate carries no branch metadata, so nothing beneath it has a base branch\""
            return 1
        }
    fi
    boIdent target "$prTarget"
}

buildWorkerPrompt() {
    local ticketId="$1" branch="$2" doneFile="$3" agentName="$4"
    local stayOnBranchRule
    if [[ "$agentName" == merge ]]; then
        stayOnBranchRule="5. Stay on \`${branch}\`, in this folder. This ticket's work IS the merge:
   bring each branch named in your brief into \`${branch}\` with \`git merge\`, resolving what
   collides between them. Still never create a branch, never check one out, never rebase, never
   push, never commit — the merge lives in the working tree; when you stop, it becomes one commit
   on this branch carrying your ticket's title."
    else
        stayOnBranchRule="5. Stay on \`${branch}\`, in this folder. Never create a branch, never check one out, never merge,
   never rebase, and never a bare \`git commit\` or \`git push\` — the branch is shared work and
   those are not a worker's calls. Commit as your agent file tells you, as you go. Whatever is
   still uncommitted when you stop becomes one last commit on this branch carrying your ticket's
   title."
    fi
    printf '%s' "Your ticket: $ticketId.
FIRST: bd show --json $ticketId — the description, design notes, and acceptance criteria in that output are your complete brief; read them IN FULL before touching code.

You are standing in the worktree of the branch \`${branch}\`, which is shared by every task in your
feature. Earlier tasks are already committed there — read the log before you assume the tree is clean.

Rules:
1. Keep your claim lease alive — the 5-minute lease must NEVER lapse. Run
   bd heartbeat $ticketId
   between long steps; a lapsed lease reads as death — the reaper takes your ticket back to ready mid-work.
2. Do NOT close your ticket — never run \`bd close\`, whatever the outcome. Keep the lease
   (bd heartbeat $ticketId) and state your proof of work in your final message: what you did and the
   test evidence that proves it. The Stop hook closes $ticketId for you once you declare done; close it
   by hand and the hook walks past it — no commit, no push, no PR, your work never lands.
3. If the brief needs more work than you can finish: write a beads comment on $ticketId
   describing exactly what remains (check bd comment --help). Never half-do and hide it.
4. Spawn nothing. Work nothing but $ticketId. You and your ticket are one and the same.
${stayOnBranchRule}
6. Declare that you finished, and declare nothing else. As your VERY LAST action, and only when
   the brief is genuinely complete and you would hand it to a human as it stands, run:
   touch '$doneFile'
   If you ran out of room, hit a blocker, or left something for the next worker, do not create
   that file — the ticket then stays open and the tasks behind yours wait for you."
}

doneFileFor() { printf '%s' "$logDir/done-${1//\//+}"; }

spawnFileFor() { printf '%s' "$logDir/spawn-${1//\//+}"; }

spawnWorker() {
    local worktreePath="$1" ticketId="$2" agentName="$3" branch="$4" prTarget="$5" label="$6" doneFile="$7" spawnFile="$8"
    ( cd "$worktreePath" \
        && BO_TICKET="$ticketId" BO_BRANCH="$branch" BO_PR_TARGET="$prTarget" \
           BO_AGENT="$agentName" BO_LABEL="$label" \
           BO_PROJECT_DIR="$towerDir" BO_LOG_DIR="$logDir" BO_DONE_FILE="$doneFile" \
           $agentCommand --bg --agent "$agentName" --permission-mode bypassPermissions \
           "$(buildWorkerPrompt "$ticketId" "$branch" "$doneFile" "$agentName")" ) >"$spawnFile" 2>&1
}

dispatchWorker() {
    local ticketId="$1" agentName="$2" branch="$3" prTarget="$4" label="$5"
    local worktreePath worktreeAside worktreeFailure doneFile spawnFile

    boIdent agent "$agentName"

    if ! ensureWorktree "$branch" "$prTarget" || [[ -z "$worktreePath" ]]; then
        boIdent worktree "$(worktreePathFor "$branch")"
        case "$worktreeFailure" in
            unpushed-commits)
                logTo errors "reason=branch-has-unpushed-commits msg=\"the local branch $branch holds commits origin has never seen, and the loop will not reset a branch that does — recover them with git reflog, or push them, then run the loop again\""
                ;;
            no-start)
                logTo errors "reason=worktree-failed step=no-start msg=\"no starting commit: neither origin/$branch nor its target $prTarget resolves\""
                ;;
            folder-immovable)
                logTo errors "reason=worktree-failed step=stray-folder msg=\"the branch folder $worktreePath exists, is not a registered worktree, and could not be moved aside\""
                ;;
            *)
                logTo errors "reason=worktree-failed msg=\"the branch folder could not be made from origin/$branch or from its target $prTarget\""
                ;;
        esac
        return 1
    fi
    boIdent worktree "$worktreePath"
    [[ -n "$worktreeAside" ]] &&
        logTo errors "reason=worktree-folder-moved-aside msg=\"the branch folder held files from an interrupted build; kept as ${worktreeAside##*/} rather than overwritten\""

    doneFile="$(doneFileFor "$ticketId")"
    spawnFile="$(spawnFileFor "$ticketId")"
    rm -f "$doneFile"
    if ! spawnWorker "$worktreePath" "$ticketId" "$agentName" "$branch" "$prTarget" "$label" "$doneFile" "$spawnFile"; then
        logTo errors "reason=worker-not-dispatched msg=\"$(lastLineOf "$spawnFile")\""
        releaseClaim "$ticketId"
        return 1
    fi

    boIdent session "$(sessionFromSpawn "$spawnFile")"
    claimedThisRun=$((claimedThisRun + 1))
    logTo claims "reason=dispatched"
}

claimAndDispatchOneTicket() {
    tryNextClaim=0
    readClaimFromFrontier || return
    if frontierHeldNoTicket; then
        reportEmptyFrontier
        return
    fi
    readTicketIdentityFromClaim || return
    if claimWasAlreadySkippedThisTick; then
        releaseClaim "$ticketId"
        tryNextClaim=1
        return
    fi
    readClaimFields
    claimCarriesExactlyOneDispatchLabel || return
    claimCarriesBranch || return
    if claimedBranchIsAlreadyAtWork; then
        skipClaimedTicketForThisTick
        tryNextClaim=1
        return
    fi
    resolvePullRequestTarget || return
    ensureEpicGatePr "$gateId" || {
        releaseClaim "$ticketId"
        return 1
    }
    dispatchWorker "$ticketId" "${AGENT["${matchedLabels[0]}"]}" "$branch" "$prTarget" "${matchedLabels[0]}"
}

tick() {
    local -A skippedTicket=()
    local busyBranches claimAttempts claimJson claimExitCode ticketId ticketLabels matchedLabels branch claimParent prTarget gateId

    busyBranches=$'\n'"$(branchesCurrentlyAtWork)"$'\n'
    claimAttempts=0
    while (( claimAttempts < maximumClaimsPerTick )); do
        claimAttempts=$((claimAttempts + 1))
        boClearIdentity
        atDispatchCapacity && return
        claimAndDispatchOneTicket
        (( tryNextClaim )) || return
    done

    waiting branch_busy "held=${#skippedTicket[@]}"
}

logRunTallyForTickLimit() {
    boClearIdentity
    logTo results "ticks=$tickCount claimed=$claimedThisRun note=\"hit BO_MAX_TICKS: this run was configured to end, the tower did not run out of work\""
}

runLoop() {
    while true; do
        if (( maximumTicks > 0 && tickCount >= maximumTicks )); then
            logRunTallyForTickLimit
            break
        fi
        tickCount=$((tickCount + 1))
        tick
        sleep "$pollSeconds"
    done
}

onInterrupt() {
    boClearIdentity
    logTo results "ticks=$tickCount claimed=$claimedThisRun"
    printf "\nbeads-loop: stopped. claimed=%d  log: %s\n" "$claimedThisRun" "$logDir"
    exit 0
}

installInterruptTrap() { trap 'onInterrupt' INT TERM; }

configureFromEnvironment
configureAllowedLabels
requireToolsOnPath
requireNumericSettingsFromEnvironment
requireUsablePollInterval
requireBeadsProject
createRunLogDirectory
source "$engineDir/loop-log.sh"
source "$engineDir/forge.sh"
resolveTowerPaths
boSeedIdentity "$logDir" "$towerDir"
configureWaitingLineCadence
configureMaximumClaimsPerTick
installInterruptTrap
announceRunLogDirectory
runLoop
