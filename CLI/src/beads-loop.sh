#!/usr/bin/env bash
# beads-loop.sh — the claim-beads dispatcher: each tick claims one ready ticket and spawns its worker.
#   sf loop   (or ./beads-loop.sh) from inside the tower project; Ctrl-C stops dispatching.
#   SF_MAX_PARALLEL (4) workers at once | SF_POLL_S (3) seconds per tick, must divide 60 | SF_MAX_TICKETS (0 = never ends)
#   SF_MAX_TICKETS counts tickets the Stop hook closed this run, not ticks — the loop keeps ticking while it waits
#   SF_LOG_ROOT (~/.spider-factory/logs) one directory per run | SF_ALLOWED_LABELS unset or * = the whole AGENT set, a comma list narrows it
#   SF_AGENT_COMMAND (claude) the command that runs an agent — every worker spawn and the worker count go through it
#   SF_AGENT_FEATURE_GATES / SF_AGENT_EPIC_GATES (0) — 1 lets the lead agent verify and merge that tier's gate every tick
#   Every one of them may live in CLI/spider-factory.env, which CLI/install-cli.sh puts there and you edit by hand.
#   Contract: this file is the contract. .claude/diagram/ is its human-terms account; .claude/CLAUDE.md points at both.
set -uo pipefail

engineDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$engineDir/user-env.sh"
loadSpiderFactoryEnv

agentPluginName="${SF_AGENT_PLUGIN:-spider-factory}"

declare -A AGENT=(
    [backend-logic]=engineer
    [frontend-ui]=frontend
    [unit-tests]=tester-unit
    [feature-test]=tester-feature
    [epic-e2e-test]=tester-e2e
    [feature-review]=review
    [epic-review]=review
)

leadAgentName="lead"

declare -A numericSettingEnvName=(
    [maximumParallelWorkers]=SF_MAX_PARALLEL
    [pollSeconds]=SF_POLL_S
    [maximumTicketsDone]=SF_MAX_TICKETS
)

declare -A allowedLabel=()
declare -A lastTickForWaitingReason=()

maximumParallelWorkers=0
pollSeconds=0
maximumTicketsDone=0
logRoot=""
agentCommand=""
agentHandlesFeatureGates=0
agentHandlesEpicGates=0
waitingLineCadence=0
maximumClaimsPerTick=0
tickCount=0
claimedThisRun=0
tryNextClaim=0

configureFromEnvironment() {
    maximumParallelWorkers="${SF_MAX_PARALLEL:-4}"
    pollSeconds="${SF_POLL_S:-3}"
    maximumTicketsDone="${SF_MAX_TICKETS:-0}"
    logRoot="${SF_LOG_ROOT:-$HOME/.spider-factory/logs}"
    agentCommand="${SF_AGENT_COMMAND:-claude}"
    agentHandlesFeatureGates="${SF_AGENT_FEATURE_GATES:-0}"
    agentHandlesEpicGates="${SF_AGENT_EPIC_GATES:-0}"
}

requireGateFlagsAreSwitches() {
    local flagName flagValue
    for flagName in SF_AGENT_FEATURE_GATES SF_AGENT_EPIC_GATES; do
        flagValue="${!flagName}"
        [[ "$flagValue" == "0" || "$flagValue" == "1" ]] || {
            echo "beads-loop: $flagName=$flagValue is not a switch — it is either 0 (a human closes that gate) or 1 (the lead agent does)" >&2
            exit 1
        }
    done
}

gateTierIsSwitchedOn() {
    case "$1" in
        feature) [[ "$agentHandlesFeatureGates" == "1" ]] ;;
        epic)    [[ "$agentHandlesEpicGates" == "1" ]] ;;
        *) return 1 ;;
    esac
}

configureAllowedLabels() {
    local labelKey
    local -a configuredLabels=()
    if [[ -z "${SF_ALLOWED_LABELS:-}" || "${SF_ALLOWED_LABELS:-}" == "*" ]]; then
        for labelKey in "${!AGENT[@]}"; do
            allowedLabel["$labelKey"]=1
        done
        return
    fi
    IFS=',' read -ra configuredLabels <<< "$SF_ALLOWED_LABELS"
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
    for settingName in maximumParallelWorkers pollSeconds maximumTicketsDone; do
        [[ "${!settingName}" =~ ^[0-9]+$ ]] || {
            echo "beads-loop: ${numericSettingEnvName[$settingName]}=${!settingName} is not a number" >&2
            exit 1
        }
    done
}

requireUsablePollInterval() {
    (( pollSeconds > 0 && 60 % pollSeconds == 0 )) || {
        echo "beads-loop: SF_POLL_S=$pollSeconds is unusable — it must divide 60 (1 2 3 4 5 6 10 12 15 20 30 60)" >&2
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
    local id
    bd list --status in_progress --limit 0 --json 2>/dev/null \
        | jq -r '.[].id' | while read -r id; do
            ( resolveTicketBranches "$id" && printf '%s\n' "$branch" ) 2>/dev/null
        done | sort -u
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

ensureBranchAheadOfTarget() {
    local branch="$1" targetSha="$2" remoteSha seedSha
    branchSeedFailure=""
    remoteSha="$(remoteShaOfBranch "$branch")"
    [[ -z "$remoteSha" || "$remoteSha" == "$targetSha" ]] || return 0
    seedSha="$(git -C "$towerDir" commit-tree "${targetSha}^{tree}" -p "$targetSha" \
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
        | jq -r --arg k "$key" 'if type == "array" then .[0] else . end | ((.metadata // {})[$k] // empty)' 2>/dev/null
}

# An id reads <repo>-<kind>-<uuid>-<hierarchy>, as in foobar-task-a7f3c9-1.3. The kind word is
# epic or feature on a gate and task on everything else; one uuid binds a whole tower; the
# hierarchy is 0 for the epic gate, 1 2 3 for its features, and <gate number>.<m> for a ticket
# below a gate. The repo may itself carry dashes, so everything is read off the right.
towerIdPattern='^(.+)-(epic|feature|task)-([0-9a-f]+)-([0-9]+(\.[0-9]+)*)$'

idRepo=""
idKind=""
idUuid=""
idHierarchy=""

splitTowerId() {
    local id="$1"
    idRepo=""
    idKind=""
    idUuid=""
    idHierarchy=""
    [[ "$id" =~ $towerIdPattern ]] || return 1
    idRepo="${BASH_REMATCH[1]}"
    idKind="${BASH_REMATCH[2]}"
    idUuid="${BASH_REMATCH[3]}"
    idHierarchy="${BASH_REMATCH[4]}"
}

epicGateOf() {
    local id="$1"
    splitTowerId "$id" || return 1
    printf '%s-epic-%s-0' "$idRepo" "$idUuid"
}

featureGateOf() {
    local id="$1" head
    splitTowerId "$id" || return 1
    [[ "$idKind" == task ]] || return 1
    head="${idHierarchy%%.*}"
    [[ "$head" != "$idHierarchy" ]] || return 1
    [[ "$head" != 0 ]] || return 1
    printf '%s-feature-%s-%s' "$idRepo" "$idUuid" "$head"
}

issueTypeOf() {
    local id="$1"
    [[ -n "$id" ]] || return 1
    bd -C "$towerDir" show --json "$id" 2>/dev/null \
        | jq -r 'if type == "array" then .[0] else . end | .issue_type // empty' 2>/dev/null
}

gateTierOf() {
    local id="$1"
    [[ "$id" =~ ^(.+)-(epic|feature)-([0-9a-f]+)-([0-9]+)$ ]] || return 1
    printf '%s' "${BASH_REMATCH[2]}"
}

# The branch a ticket's work lands on and the branch its pull request aims at, both read off the
# gates its id names. The owner is the gate whose `branch` the work lands on: a gate owns its own
# branch, a task owns its feature gate's, an epic-tier ticket owns the epic gate's. The pull
# request aims at main when the owner is the epic gate, and at the epic gate's branch otherwise.
# Fails when the id reaches no gate — a ticket belonging to no tower is not work.
branchResolveFailure=""

resolveTicketBranches() {
    local id="$1" epicGate owner
    branch=""
    prTarget=""
    branchResolveFailure=""
    splitTowerId "$id" || { branchResolveFailure="malformed"; return 1; }
    if [[ "$idKind" == task && "$idHierarchy" != *.* ]]; then
        branchResolveFailure="task-not-below-a-gate"
        return 1
    fi
    epicGate="$(epicGateOf "$id")"
    [[ "$(issueTypeOf "$epicGate")" == gate ]] || { branchResolveFailure="not-a-gate"; return 1; }
    gateId="$epicGate"
    owner="$epicGate"
    if [[ "$(issueTypeOf "$id")" == gate ]]; then
        owner="$id"
    elif featureGateOf "$id" >/dev/null; then
        owner="$(featureGateOf "$id")"
    fi
    branch="$(readFieldOf "$owner" branch)"
    if [[ "$owner" == "$epicGate" ]]; then
        prTarget="main"
    else
        prTarget="$(readFieldOf "$epicGate" branch)"
    fi
    [[ -n "$branch" ]] || { branchResolveFailure="owner-carries-no-branch"; return 1; }
    [[ -n "$prTarget" ]] || { branchResolveFailure="epic-carries-no-branch"; return 1; }
}

ensureEpicGatePr() {
    local gateId="$1"
    local gateBranch forge forgeTool prUrl bodyFile start prBody
    [[ -n "$(readFieldOf "$gateId" pr)" ]] && return 0

    gateBranch="$(readFieldOf "$gateId" branch)"
    if [[ -z "$gateBranch" ]]; then
        logTo errors "reason=epic-pr-failed step=gate-branch gate=$gateId msg=\"the epic gate carries no branch, so nothing beneath it has a pull-request target\""
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
    if ! ensureBranchAheadOfTarget "$gateBranch" "$start"; then
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
        printf 'The epic branch. Every feature branch under **%s** aims its pull request at this one; it is assembled ticket by ticket by the spider-factory loop and merged into `main` when the epic gate closes.\n' \
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

numberOfTicketsDoneThisRun() {
    [[ -s "$logDir/closes" ]] || { printf '0'; return; }
    printf '%s' "$(wc -l < "$logDir/closes" | tr -d '[:space:]')"
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

claimBelongsToATower() {
    local why
    if resolveTicketBranches "$ticketId"; then
        boIdent branch "$branch"
        boIdent target "$prTarget"
        return 0
    fi
    why="$branchResolveFailure"
    case "$why" in
        malformed)
            logTo errors "reason=no-epic-gate ticket=$ticketId msg=\"the id does not read <repo>-<kind>-<uuid>-<hierarchy>, so it names no ticket in any tower — nothing was dispatched and the ticket stays claimed until a human puts it in one\"" ;;
        task-not-below-a-gate)
            logTo errors "reason=no-epic-gate ticket=$ticketId step=not-below-a-gate msg=\"a task's hierarchy is <gate number>.<m> and this one carries no gate number, so it hangs below no gate — nothing was dispatched and the ticket stays claimed until a human fixes the id\"" ;;
        not-a-gate)
            logTo errors "reason=no-epic-gate ticket=$ticketId gate=$(epicGateOf "$ticketId") msg=\"the epic gate this id names is not a gate, so this ticket belongs to no tower — nothing was dispatched and the ticket stays claimed until a human puts it in one\"" ;;
        owner-carries-no-branch)
            logTo errors "reason=gate-unworkable ticket=$ticketId msg=\"the gate this id names carries no branch, so the loop has nowhere to put this work — nothing was dispatched and the ticket stays claimed\"" ;;
        *)
            logTo errors "reason=gate-unworkable ticket=$ticketId gate=$gateId msg=\"the epic gate carries no branch, so this ticket's pull request has nothing to aim at — nothing was dispatched and the ticket stays claimed\"" ;;
    esac
    return 1
}

buildWorkerPrompt() {
    local ticketId="$1" branch="$2" doneFile="$3" agentName="$4" prTarget="$5"
    local stayOnBranchRule
    if [[ "$agentName" == "$leadAgentName" ]]; then
        stayOnBranchRule="5. Stay on \`${branch}\`, in this folder. This ticket is a GATE: you verify the tier it
   stands for, and when it is proved you merge this branch's own pull request into \`${prTarget}\`.
   Never create a branch, never check one out, never rebase, and never a bare \`git commit\` or
   \`git push\` — commit with \`sf commit\` as your agent file tells you, as you go. The merge is the
   forge's own command on the pull request (\`gh pr merge\`, or \`glab mr merge\`), never a local
   \`git merge\` into \`${prTarget}\`."
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

contextFileFor() { printf '%s' "$logRoot/worker-context/${1//\//+}"; }

spawnWorker() {
    local worktreePath="$1" ticketId="$2" agentName="$3" branch="$4" prTarget="$5" label="$6" doneFile="$7" spawnFile="$8" contextFile="$9" kind="${10:-task}"
    mkdir -p "$(dirname "$contextFile")" 2>/dev/null
    { printf 'ticket=%s\n' "$ticketId"
      printf 'branch=%s\n' "$branch"
      printf 'pr_target=%s\n' "$prTarget"
      printf 'agent=%s\n' "$agentName"
      printf 'label=%s\n' "$label"
      printf 'tower=%s\n' "$towerDir"
      printf 'done_file=%s\n' "$doneFile"
      printf 'kind=%s\n' "$kind"
    } >"$contextFile.tmp" && mv -f "$contextFile.tmp" "$contextFile"
    ( cd "$worktreePath" \
        && SF_TICKET="$ticketId" SF_BRANCH="$branch" SF_PR_TARGET="$prTarget" \
           SF_AGENT="$agentName" SF_LABEL="$label" \
           SF_PROJECT_DIR="$towerDir" SF_LOG_DIR="$logDir" SF_DONE_FILE="$doneFile" \
           $agentCommand --bg --agent "$agentPluginName:$agentName" --permission-mode bypassPermissions \
           "$(buildWorkerPrompt "$ticketId" "$branch" "$doneFile" "$agentName" "$prTarget")" ) >"$spawnFile" 2>&1
}

dispatchWorker() {
    local ticketId="$1" agentName="$2" branch="$3" prTarget="$4" label="$5"
    local worktreePath worktreeAside worktreeFailure doneFile spawnFile contextFile

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
    contextFile="$(contextFileFor "$branch")"
    rm -f "$doneFile"
    if ! spawnWorker "$worktreePath" "$ticketId" "$agentName" "$branch" "$prTarget" "$label" "$doneFile" "$spawnFile" "$contextFile"; then
        logTo errors "reason=worker-not-dispatched msg=\"$(lastLineOf "$spawnFile")\""
        releaseClaim "$ticketId"
        return 1
    fi

    boIdent session "$(sessionFromSpawn "$spawnFile")"
    claimedThisRun=$((claimedThisRun + 1))
    logTo claims "reason=dispatched"
}

readyGates() {
    bd -C "$towerDir" list --include-gates --ready --type gate --limit 0 --json 2>/dev/null \
        | jq -r '.[].id' 2>/dev/null
}

moveGateTo() { bd -C "$towerDir" update "$1" --status "$2" --if-status "$3" >/dev/null 2>&1; }

dispatchOneGate() {
    local gateId="$1" tier="$2"
    local gateBranch gatePrTarget worktreePath worktreeAside worktreeFailure doneFile spawnFile contextFile

    resolveTicketBranches "$gateId" || { waiting gate_unworkable "gate=$gateId step=$branchResolveFailure"; return 1; }
    gateBranch="$branch"
    gatePrTarget="$prTarget"
    if [[ "$busyBranches" == *$'\n'"$gateBranch"$'\n'* ]]; then
        waiting branch_busy "held=1 gate=$gateId"
        return 1
    fi
    moveGateTo "$gateId" in_progress open || {
        logTo errors "reason=gate-claim-lost gate=$gateId msg=\"the gate was no longer open the moment the loop reached for it — another loop or a human has it, so no lead agent was spawned\""
        return 1
    }
    boClearIdentity
    boIdent ticket "$gateId"
    boIdent agent "$leadAgentName"
    boIdent label "gate:$tier"
    boIdent branch "$gateBranch"
    boIdent target "$gatePrTarget"
    if ! ensureWorktree "$gateBranch" "$gatePrTarget" || [[ -z "$worktreePath" ]]; then
        moveGateTo "$gateId" open in_progress
        logTo errors "reason=worktree-failed step=gate gate=$gateId msg=\"the gate's branch folder could not be made from origin/$gateBranch or from its target $gatePrTarget\""
        return 1
    fi
    boIdent worktree "$worktreePath"
    doneFile="$(doneFileFor "$gateId")"
    spawnFile="$(spawnFileFor "$gateId")"
    contextFile="$(contextFileFor "$gateBranch")"
    rm -f "$doneFile"
    if ! spawnWorker "$worktreePath" "$gateId" "$leadAgentName" "$gateBranch" "$gatePrTarget" \
            "gate:$tier" "$doneFile" "$spawnFile" "$contextFile" gate; then
        moveGateTo "$gateId" open in_progress
        logTo errors "reason=worker-not-dispatched gate=$gateId msg=\"$(lastLineOf "$spawnFile")\""
        return 1
    fi
    boIdent session "$(sessionFromSpawn "$spawnFile")"
    claimedThisRun=$((claimedThisRun + 1))
    logTo claims "reason=dispatched kind=gate gate=$gateId tier=$tier"
}

dispatchReadyGates() {
    local gateId tier
    [[ "$agentHandlesFeatureGates" == "1" || "$agentHandlesEpicGates" == "1" ]] || return 0
    while IFS= read -r gateId; do
        [[ -n "$gateId" ]] || continue
        tier="$(gateTierOf "$gateId")"
        if [[ -z "$tier" ]]; then
            logTo errors "reason=gate-unworkable gate=$gateId msg=\"the id does not read <repo>-<epic|-feature>-<uuid>-<number>, so this row is no gate of any tower — no lead agent was spawned for it\""
            continue
        fi
        gateTierIsSwitchedOn "$tier" || continue
        atDispatchCapacity && return
        dispatchOneGate "$gateId" "$tier"
    done < <(readyGates)
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
    claimBelongsToATower || return
    if claimedBranchIsAlreadyAtWork; then
        skipClaimedTicketForThisTick
        tryNextClaim=1
        return
    fi
    ensureEpicGatePr "$gateId" || {
        releaseClaim "$ticketId"
        return 1
    }
    dispatchWorker "$ticketId" "${AGENT["${matchedLabels[0]}"]}" "$branch" "$prTarget" "${matchedLabels[0]}"
}

tick() {
    local -A skippedTicket=()
    local busyBranches claimAttempts claimJson claimExitCode ticketId ticketLabels matchedLabels branch prTarget gateId

    busyBranches=$'\n'"$(branchesCurrentlyAtWork)"$'\n'
    dispatchReadyGates
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

logRunTallyForTicketLimit() {
    boClearIdentity
    logTo results "ticks=$tickCount claimed=$claimedThisRun done=$(numberOfTicketsDoneThisRun) note=\"hit SF_MAX_TICKETS=$maximumTicketsDone: this run was configured to end here\""
}

runLoop() {
    while true; do
        if (( maximumTicketsDone > 0 )) && (( $(numberOfTicketsDoneThisRun) >= maximumTicketsDone )); then
            logRunTallyForTicketLimit
            break
        fi
        tickCount=$((tickCount + 1))
        tick
        sleep "$pollSeconds"
    done
}

onInterrupt() {
    boClearIdentity
    logTo results "ticks=$tickCount claimed=$claimedThisRun done=$(numberOfTicketsDoneThisRun)"
    printf "\nbeads-loop: stopped. claimed=%d  log: %s\n" "$claimedThisRun" "$logDir"
    exit 0
}

installInterruptTrap() { trap 'onInterrupt' INT TERM; }

configureFromEnvironment
configureAllowedLabels
requireToolsOnPath
requireNumericSettingsFromEnvironment
requireGateFlagsAreSwitches
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
