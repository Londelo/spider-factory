#!/usr/bin/env bash
# beads-loop.sh — the claim-beads dispatcher. Its contract is this header + .claude/CLAUDE.md
# (the old claim-beads-loop.md was deleted in fc49051).
#
#   ./beads-loop.sh                     BO_MAX_TICKS=40 ./beads-loop.sh   (test seam)
#
# Env: BO_MAX_PARALLEL (4)              workers spawned at once
#      BO_POLL_S (3)                    seconds between polls; must divide 60
#      BO_MAX_TICKS (0)                 stop after N ticks — test seam only, 0 = endless
#      BO_LOG_ROOT (~/.binary-obelisk/logs)  one timestamped dir per run
#      BO_ALLOWED_LABELS                unset or * = the whole AGENT set; a comma list narrows it
#                     valid labels (the AGENT keys below, verbatim): backend-logic, frontend-ui,
#                     unit-tests, feature-test, epic-e2e-test, feature-review, epic-review,
#                     epic-merge-pr.
#                     A name the map doesn't hold is not a label — it matches nothing and only
#                     starves the frontier. The three test tiers are unit-tests / feature-test /
#                     epic-e2e-test: micro, composition, broad. See .claude/binary-obelisk-v1-design.yaml.
#
# ONE BRANCH PER EPIC, ONE PER FEATURE; A TASK IS A COMMIT ON ITS FEATURE BRANCH.
# Two keys live in a ticket's `metadata`; the one this loop needs is read straight off the claim payload
# (verified against the binary), so no second query:
#     branch:      feature/checkout-flow   the branch this ticket's work lands on — the plan agents' key
#     pr:          https://…/pull/7         the pull request itself, once one exists on that branch —
#                                          this loop's key, and the Stop hook's
# A pull request's BASE is not stored anywhere: it is the epic gate's own `branch`, and the parent chain
# on the claim names that gate (ticket → feature → epic). A copy of it on every ticket would be a fact
# that goes stale the moment the gate's is corrected, and the two would silently disagree — the loop
# publishes one and the hook aims at the other. So the target is read where it lives, once per tick.
# A ticket whose parent IS the topmost gate sits under the epic itself, and its pull request goes to main.
#
# THE EPIC BRANCH IS PUBLISHED BEFORE ANYTHING CAN LAND IN IT. A feature's pull request targets the epic
# branch, so that branch must already exist on the forge — and nothing but this loop ever touches it. So
# on every claim the loop reads the ticket's EPIC GATE: if the gate carries no `pr`, the loop pushes the
# gate's branch off main, opens its pull request into main, and writes the url onto the gate's `pr`
# metadata. From then on every ticket beneath it has a base to aim at, and the gate's `pr` is the proof.
# Where that publish cannot happen the ticket is LEFT CLAIMED and the run logs `reason=epic-pr-failed`:
# a worker spawned into a tower whose base branch does not exist burns a slot and files a commit
# nobody can pull.
# A worktree belongs to a BRANCH, never to a ticket: the first task of a feature creates it, every
# later task on that branch re-enters it. Two tickets never share a branch at the same time, so
# the loop unclaims and moves on when the branch it just claimed is already at work; the frontier
# hands out at most one task per feature anyway, because the plan chains a feature's tasks.
#
# A tick that dispatches nothing is THREE states, and the waiting line names which one it is:
#   reason=frontier_empty          nothing exists to do — idle, or the tower is finished
#   reason=tower_stalled waiting=N N work tickets still exist but sit OFF the frontier behind an
#                                  open blocker (an open gate, or a ticket nobody is working), so
#                                  only a human can unstick them. tick() probes the difference.
#   reason=branch_busy held=N      claimable tickets exist, but every branch they want is already
#                                  being written by a worker; each was unclaimed and skipped.
# THE LOG — one directory per run under BO_LOG_ROOT, and every file in it created up front, so an
# empty file and a missing file look the same and neither hides a silent failure:
#   claims            every ticket taken, and every one put back
#   errors            the alarm: every failure, whoever saw it
#   waiting           the quiet ticks, one a minute per reason
#   closes            the Stop hook's proof of work — what landed and its pull request
#   failures          the StopFailure hook's account of a session that died mid-turn
#   results           the run's tally, at the end or on Ctrl-C
#   spawn-<ticket>    that one worker's raw spawn output, which holds its session id
#   done-<ticket>     the worker's own declaration that its brief is complete
# CLI/loop-log.sh owns the line format: tag, timestamp, then the SAME nine identity keys on every
# line of every file — run repo ticket label agent branch target session worktree — "-" for whatever
# is not known yet. That shared key set is what makes the files JOIN: a line in errors names the
# ticket, the label, the agent, the branch, its pull request target, the repo and the session, and
# the same keys lead from it into claims, closes or failures by grep alone.
set -uo pipefail

maximumParallelWorkers="${BO_MAX_PARALLEL:-4}"
pollSeconds="${BO_POLL_S:-3}"
maximumTicks="${BO_MAX_TICKS:-0}"
logRoot="${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}"

# The keys ARE the closed label set; the merge label dispatches to the merge agent like any
# other. Gates never appear on the frontier — they are structurally invisible to
# `bd ready`, so there is nothing to exclude and no exclusion filters exist.
# This map is the only binding between a label and an agent — never derive an agent name from a label.
# There is no feature-merge label: a feature IS a branch, so there is nothing to assemble.
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

declare -a allowedLabels=()
declare -A allowedLabel=()
# unset or "*" both mean "the whole AGENT set" — narrowing is the exception, not the default.
# (An unset var used to populate nothing, so isLabel failed for every valid label and the
#  loop dispatched nothing while logging label-ambiguous on good tickets.)
if [[ -z "${BO_ALLOWED_LABELS:-}" || "${BO_ALLOWED_LABELS:-}" == "*" ]]; then
    for labelKey in "${!AGENT[@]}"; do
        allowedLabel["$labelKey"]=1
    done
elif [[ -n "${BO_ALLOWED_LABELS:-}" ]]; then
    IFS=',' read -ra allowedLabels <<< "$BO_ALLOWED_LABELS"
    for labelKey in "${allowedLabels[@]}"; do
        allowedLabel["$labelKey"]=1
    done
fi

isLabel() {
    [[ -n "${AGENT["$1"]+set}" ]] && [[ -n "${allowedLabel["$1"]+set}" ]]
}

for requiredTool in bd jq claude git; do
    command -v "$requiredTool" >/dev/null 2>&1 || {
        echo "beads-loop: $requiredTool not found on PATH" >&2
        exit 1
    }
done

for numericVariableName in maximumParallelWorkers pollSeconds maximumTicks; do
    [[ "${!numericVariableName}" =~ ^[0-9]+$ ]] || {
        echo "beads-loop: BO_${numericVariableName^^}=${!numericVariableName} is not a number" >&2
        exit 1
    }
done

# the idle rate limit divides by pollSeconds, so a non-divisor of 60 is a bug, not a preference
(( pollSeconds > 0 && 60 % pollSeconds == 0 )) || {
    echo "beads-loop: BO_POLL_S=$pollSeconds is unusable — it must divide 60 (1 2 3 4 5 6 10 12 15 20 30 60)" >&2
    exit 1
}

# a real probe of "can we do anything here", not a check for a .beads folder:
# bd walks UP from the current directory, ignoring BEADS_DIR
runningInABeadsProject() {
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1
}

if ! runningInABeadsProject; then
    echo "beads-loop: no beads database found from $PWD — cd into the tower project and re-run" >&2
    exit 1
fi

logDir="$logRoot/$(date +%F_%H-%M-%S)"
mkdir -p "$logDir" 2>/dev/null || { echo "beads-loop: cannot create $logDir" >&2; exit 1; }
# every file a run can write is created up front, so a missing file and an empty file are the
# same sight — closes and failures are written by the hooks, possibly long after this run ends.
for logFileName in claims errors waiting results closes failures; do : > "$logDir/$logFileName"; done

engineDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$engineDir/loop-log.sh"

lastLineOf() { tail -1 "$1" 2>/dev/null; }

# The tower root owns the beads DB; the worktrees hang off it and each belongs to one branch.
towerDir="$PWD"
worktreesRoot="$towerDir/.claude/worktrees"
boSeedIdentity "$logDir" "$towerDir"

# Workers now live in their branch's worktree, not in a per-ticket one the spawner named, so the
# count is "background sessions whose cwd is this tower or one of its worktrees" — the sessions
# are no longer found by an exact --cwd match, and --cwd is not passed at all.
numberOfBusyWorkers() {
    claude agents --json 2>"$logDir/claude-stderr" \
        | jq --arg root "$worktreesRoot" --arg tower "$towerDir" \
          '[ .[] | select(.kind == "background")
                 | select((.cwd // "") | startswith($root) or . == $tower) ] | length' 2>/dev/null
}

# every ticket in work, mapped to the branch it is sitting on — that set, not a counter, is what
# keeps two workers off one branch, and a lapsed lease frees the branch on its own
branchesCurrentlyAtWork() {
    bd list --status in_progress --limit 0 --json 2>/dev/null \
        | jq -r '.[] | .metadata.branch // empty' | sort -u
}

# A worktree belongs to a branch, so it is looked up BY BRANCH and reused; the directory is named
# for the branch it holds, with the sole "/" in the name flattened so one directory holds one branch.
worktreePathFor() { echo "$worktreesRoot/${1//\//+}"; }

branchAlreadyCheckedOut() {
    git -C "$towerDir" worktree list --porcelain 2>/dev/null \
        | awk -v want="refs/heads/$1" '$1=="worktree"{path=$2} $1=="branch" && $2==want {print path; exit}'
}

# create it once, from the remote copy of the branch if somebody pushed one, otherwise off the
# branch this ticket's pull request targets — the feature starts where it is going to land
ensureWorktree() {
    local branch="$1" prTarget="$2" existing path
    existing="$(branchAlreadyCheckedOut "$branch")"
    if [[ -n "$existing" && -d "$existing" ]]; then echo "$existing"; return 0; fi
    path="$(worktreePathFor "$branch")"
    [[ -e "$path" ]] || mkdir -p "$worktreesRoot"
    git -C "$towerDir" fetch --quiet origin 2>/dev/null || true
    local start=""
    for candidate in "origin/$branch" "origin/$prTarget" "$prTarget" "HEAD"; do
        if git -C "$towerDir" rev-parse --verify --quiet "$candidate^{commit}" >/dev/null 2>&1; then
            start="$candidate"; break
        fi
    done
    [[ -n "$start" ]] || return 1
    git -C "$towerDir" worktree add -B "$branch" "$path" "$start" >/dev/null 2>&1 || return 1
    [[ -d "$path" ]] && echo "$path"
}

readFieldOf() { # readFieldOf <id> <metadata-key | "parent"> — one field off one ticket
    local id="$1" key="$2"
    [[ -n "$id" ]] || return 1
    bd -C "$towerDir" show --json "$id" 2>/dev/null \
        | jq -r --arg k "$key" 'if type == "array" then .[0] else . end
            | if $k == "parent" then (.parent // empty) else ((.metadata // {})[$k] // empty) end' 2>/dev/null
}

# the epic gate is the node at the top of the parent chain; a claim's parent is the feature gate for a
# feature's task and the epic gate itself for an epic ticket, so this is two hops at the most
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

# The remote names the forge, never the machine — the same three-step settle the Stop hook uses:
# an honest host, then the refs it publishes, then a machine holding exactly one of the two CLIs.
detectForge() {
    local remoteUrl remoteRefs
    remoteUrl="$(git -C "$towerDir" remote get-url origin 2>/dev/null)"
    case "$remoteUrl" in
        *gitlab*) echo gitlab; return 0 ;;
        *github*) echo github; return 0 ;;
    esac
    remoteRefs="$(git -C "$towerDir" ls-remote origin 2>/dev/null)"
    if grep -qE '[[:space:]]refs/(merge-requests|pipelines|environments)/' <<<"$remoteRefs"; then
        echo gitlab
    elif grep -qE '[[:space:]]refs/pull/' <<<"$remoteRefs"; then
        echo github
    elif command -v glab >/dev/null 2>&1 && ! command -v gh >/dev/null 2>&1; then
        echo gitlab
    elif command -v gh >/dev/null 2>&1 && ! command -v glab >/dev/null 2>&1; then
        echo github
    fi
}

# ensureEpicGatePr <epic-gate-id> — zero when the epic gate carries a `pr`, which is the
# only state in which a feature's pull request has a base to aim at. Where it does not, this publishes
# the gate's branch and opens its pull request into main, then writes the url onto the gate's metadata.
# It names no ticket: the identity the tick carries for the claim that needed this gate is already on
# every line. The gate's own branch is gateBranch= — branch= belongs to the claim, and the two differ.
ensureEpicGatePr() {
    local gateId="$1"
    local gateBranch forge forgeTool prUrl bodyFile start prBody
    [[ -n "$(readFieldOf "$gateId" pr)" ]] && return 0

    gateBranch="$(readFieldOf "$gateId" branch)"
    if [[ -z "$gateBranch" ]]; then
        logTo errors "reason=epic-pr-failed step=gate-branch gate=$gateId msg=\"the epic gate carries no branch metadata, so nothing beneath it has a base branch\""
        return 1
    fi
    forge="$(detectForge)"
    if [[ -z "$forge" ]]; then
        logTo errors "reason=epic-pr-failed step=forge gate=$gateId gateBranch=$gateBranch"
        return 1
    fi
    forgeTool=gh
    [[ "$forge" == gitlab ]] && forgeTool=glab
    if ! command -v "$forgeTool" >/dev/null 2>&1; then
        logTo errors "reason=epic-pr-failed step=missing-tool tool=$forgeTool forge=$forge gate=$gateId"
        return 1
    fi

    if [[ -z "$(git -C "$towerDir" ls-remote --heads origin "$gateBranch" 2>/dev/null)" ]]; then
        start=""
        for candidate in "origin/main" "main" "HEAD"; do
            if git -C "$towerDir" rev-parse --verify --quiet "$candidate^{commit}" >/dev/null 2>&1; then
                start="$candidate"; break
            fi
        done
        if [[ -z "$start" ]] || ! git -C "$towerDir" push --quiet origin "$start:refs/heads/$gateBranch" 2>/dev/null; then
            logTo errors "reason=epic-pr-failed step=push gate=$gateId gateBranch=$gateBranch msg=\"the epic branch could not be published off main\""
            return 1
        fi
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

# Work that still EXISTS but is not on the frontier — an active blocker keeps a ticket off
# `bd ready` while its own status stays `open`, so a status filter alone cannot tell
# "nothing to do" from "stalled". `bd list` hides closed tickets and gates by default, so this
# counts work tickets only, and --limit 0 lifts the default cap of 50. It runs only when the
# frontier is already empty, so every ticket it counts is off the frontier by definition.
numberOfStalledTickets() {
    bd list --status open,blocked --limit 0 --json 2>/dev/null | jq 'length' 2>/dev/null
}

# the one sanctioned bare `bd ready`: a peek that names next=, never a claim
nameOfNextReadyTicket() {
    local peekedTicketId
    peekedTicketId="$(bd ready --json 2>/dev/null | jq -r '.[0].id // empty' 2>/dev/null)"
    echo "${peekedTicketId:-(none)}"
}

waitingLineCadence=$(( 60 / pollSeconds ))
declare -A lastTickForWaitingReason=()

waiting() {
    local waitingReason="$1" extraFields="${2-}"
    local lastTick="${lastTickForWaitingReason["$waitingReason"]-$(( -waitingLineCadence ))}"
    (( tickCount - lastTick < waitingLineCadence )) && return 0
    lastTickForWaitingReason["$waitingReason"]=$tickCount
    logTo waiting "reason=$waitingReason working=$(numberOfBusyWorkers) next=$(nameOfNextReadyTicket)${extraFields:+ $extraFields}"
}

# The ticket IS the brief — the worker reads it from beads, nothing is transcribed.
# The branch and its worktree are already yours: the loop put you in the folder that holds your
# feature's branch, and your finished work is ONE COMMIT there, made by the Stop hook, not by you.
buildWorkerPrompt() {
    local ticketId="$1" branch="$2" doneFile="$3"
    printf '%s' "Your ticket: $ticketId.
FIRST: bd show --json $ticketId — the description, design notes, and acceptance criteria in that output are your complete brief; read them IN FULL before touching code.

You are standing in the worktree of the branch \`${branch}\`, which is shared by every task in your
feature. Earlier tasks are already committed there — read the log before you assume the tree is clean.

Rules:
1. Keep your claim lease alive — the 5-minute lease must NEVER lapse. Run
   bd heartbeat $ticketId
   between long steps; a lapsed lease means another dispatcher can seize your ticket mid-work.
2. Do NOT close your ticket — never run \`bd close\`, whatever the outcome. When your work is
   done, keep the lease (bd heartbeat $ticketId) and state your proof of work in your final message:
   what you did and the test evidence that proves it. A human reads the final message,
   checks the work, and closes the ticket; a ticket you close yourself closes unverified.
3. If the brief needs more work than you can finish: write a beads comment on $ticketId
   describing exactly what remains (check bd comment --help). Never half-do and hide it.
4. Spawn nothing. Work nothing but $ticketId. You and your ticket are one and the same.
5. Stay on \`${branch}\`, in this folder. Never create a branch, never check one out, never merge,
   never rebase, never push, and never commit — the branch is shared work and those are not a
   worker's calls. Leave your work in the working tree; when you stop, your work becomes one
   commit on this branch carrying your ticket's title.
6. Declare that you finished, and declare nothing else. As your VERY LAST action, and only when
   the brief is genuinely complete and you would hand it to a human as it stands, run:
   touch '$doneFile'
   If you ran out of room, hit a blocker, or left something for the next worker, do not create
   that file — the ticket then stays open and the tasks behind yours wait for you."
}

claimedThisRun=0
tickCount=0
onInterrupt() {
    boClearIdentity
    logTo results "ticks=$tickCount claimed=$claimedThisRun"
    printf "\nbeads-loop: stopped. claimed=%d  log: %s\n" "$claimedThisRun" "$logDir"
    exit 0
}
trap 'onInterrupt' INT TERM

echo "beads-loop: logging to $logDir  (Ctrl-C to stop)"

# BO_* is how the Stop hook knows which ticket to finish, and what to say about it on every log line
# it writes; without them the worker just stops and its ticket sits in_progress until the lease lapses.
# The spawn runs INSIDE the branch's worktree and carries no -w: claude's --worktree only ever
# CREATES one, and this branch already has its.
dispatchWorker() {
    local ticketId="$1" agentName="$2" branch="$3" prTarget="$4" label="$5"
    local worktreePath doneFile spawnFile session

    boIdent agent "$agentName"

    if ! worktreePath="$(ensureWorktree "$branch" "$prTarget")" || [[ -z "$worktreePath" ]]; then
        # left claimed, like a mislabelled ticket: its lease parks the unworkable one off the
        # frontier instead of the loop spinning on a branch it cannot build
        boIdent worktree "$(worktreePathFor "$branch")"
        logTo errors "reason=worktree-failed msg=\"the branch folder could not be made from origin/$branch or from its target $prTarget\""
        return 1
    fi
    boIdent worktree "$worktreePath"

    doneFile="$logDir/done-${ticketId//\//+}"
    rm -f "$doneFile"
    # One spawn output file PER TICKET. It used to be one shared last-spawn that every spawn
    # overwrote, so the session id claude printed survived only for the run's final worker — the id
    # a human needs to attach to the session, read its logs, or stop it.
    spawnFile="$logDir/spawn-${ticketId//\//+}"
    if ! ( cd "$worktreePath" \
            && BO_TICKET="$ticketId" BO_BRANCH="$branch" BO_PR_TARGET="$prTarget" \
               BO_AGENT="$agentName" BO_LABEL="$label" \
               BO_PROJECT_DIR="$towerDir" BO_LOG_DIR="$logDir" BO_DONE_FILE="$doneFile" \
               claude --bg --agent "$agentName" --permission-mode bypassPermissions \
               "$(buildWorkerPrompt "$ticketId" "$branch" "$doneFile")" ) >"$spawnFile" 2>&1; then
        logTo errors "reason=worker-not-dispatched msg=\"$(lastLineOf "$spawnFile")\""
        bd unclaim "$ticketId" >/dev/null 2>&1 || true
        return 1
    fi

    boIdent session "$(sessionFromSpawn "$spawnFile")"
    claimedThisRun=$((claimedThisRun + 1))
    logTo claims "reason=dispatched"
}

# one claim per dispatch, but a ticket whose BRANCH is already at work goes straight back and the
# tick tries the next one — a branch has one pair of hands at a time, and the set of busy branches
# is read BEFORE this tick claims anything so the ticket in hand is never counted against itself
tick() {
    local busyWorkers ticketsInWork stalledTickets claimResult claimExitCode ticketId
    local ticketLabels matchedLabels=() branch prTarget claimParent gateId busyBranches
    local -A skippedTicket=()
    local attempts=0 attemptCap=$(( maximumParallelWorkers + 2 ))

    busyBranches=$'\n'"$(branchesCurrentlyAtWork)"$'\n'

    while (( attempts < attemptCap )); do
        attempts=$((attempts + 1))
        boClearIdentity

        # at capacity with nothing in progress means the slots are ghosts —
        # a broken tower must never read as a calm one
        busyWorkers="$(numberOfBusyWorkers)"
        busyWorkers="${busyWorkers//[!0-9]/}"
        busyWorkers="${busyWorkers:-0}"
        if (( busyWorkers >= maximumParallelWorkers )); then
            ticketsInWork="$(numberOfTicketsInWork)"
            ticketsInWork="${ticketsInWork//[!0-9]/}"
            if [[ -z "$ticketsInWork" || "$ticketsInWork" == "0" ]]; then
                waiting max_parallel_stalled "in_progress=0"
            else
                waiting max_parallel "in_progress=$ticketsInWork"
            fi
            return
        fi

        # claimed atomically (assignee + in_progress + 5-min lease);
        # no --exclude-type/--exclude-label filters — gates are invisible to `bd ready` anyway
        claimResult="$(bd ready --claim --json 2>"$logDir/bd-stderr")"
        claimExitCode=$?
        if (( claimExitCode != 0 )); then
            logTo errors "reason=bd-failure exit=$claimExitCode msg=\"$(lastLineOf "$logDir/bd-stderr")\""
            return
        fi

        # an EMPTY FRONTIER IS NOT ONE STATE. It can mean there is nothing left to do, or it can
        # mean work exists that an open blocker holds off the frontier — an open gate two levels
        # below, most often, which only a human may close. The two need different alarms, so count
        # the off-frontier work tickets and name the state honestly. One line a minute PER REASON.
        if [[ -z "$claimResult" || "$claimResult" == "[]" ]]; then
            if (( ${#skippedTicket[@]} > 0 )); then
                waiting branch_busy "held=${#skippedTicket[@]}"
            else
                stalledTickets="$(numberOfStalledTickets)"
                stalledTickets="${stalledTickets//[!0-9]/}"
                if [[ -z "$stalledTickets" || "$stalledTickets" == "0" ]]; then
                    waiting frontier_empty
                else
                    waiting tower_stalled "waiting=$stalledTickets"
                fi
            fi
            return
        fi

        ticketId="$(jq -r '.[0].id // empty' <<< "$claimResult" 2>/dev/null)"
        boIdent ticket "$ticketId"
        if [[ -z "$ticketId" ]]; then
            logTo errors "reason=bd-failure exit=0 msg=\"claim returned no id: $(tr -d '\n' <<< "$claimResult" | head -c 60)\""
            return
        fi
        if [[ -n "${skippedTicket["$ticketId"]-}" ]]; then
            bd unclaim "$ticketId" >/dev/null 2>&1 || true
            continue
        fi
        mapfile -t ticketLabels < <(jq -r '.[0].labels // [] | .[]' <<< "$claimResult" 2>/dev/null)
        branch="$(jq -r '.[0].metadata.branch // empty' <<< "$claimResult" 2>/dev/null)"
        claimParent="$(jq -r '.[0].parent // empty' <<< "$claimResult" 2>/dev/null)"
        boIdent branch "$branch"

        # zero or two specialist names among the labels is the tower's bug, not ours,
        # and the claim is LEFT in place: its lease parks the broken ticket off the frontier
        matchedLabels=()
        for ticketLabel in "${ticketLabels[@]}"; do
            if isLabel "$ticketLabel"; then
                matchedLabels+=("$ticketLabel")
            fi
        done
        if (( ${#matchedLabels[@]} != 1 )); then
            logTo errors "reason=label-ambiguous matched=\"${matchedLabels[*]-}\" labels=\"${ticketLabels[*]-}\""
            return
        fi
        boIdent label "${matchedLabels[0]}"

        # the branch is not decoration — with no branch there is no folder to work in and nothing
        # to push, so this is a plan bug and it gets the same treatment as a mislabelled ticket.
        if [[ -z "$branch" ]]; then
            logTo errors "reason=metadata-missing msg=\"the plan agents create every ticket with --metadata carrying a branch; with no branch key the loop has nowhere to put this work\""
            return
        fi

        if [[ "$busyBranches" == *$'\n'"$branch"$'\n'* ]]; then
            logTo claims "reason=branch-busy unclaimed"
            bd unclaim "$ticketId" >/dev/null 2>&1 || true
            skippedTicket["$ticketId"]=1
            continue
        fi

        # the pull request's base is never stored on the ticket — it is the epic gate's own `branch`,
        # which the parent chain already names. When the claim's parent is that topmost gate itself the
        # ticket sits right under the epic, and the only pull request above it goes into main.
        gateId="$(epicGateOf "$claimParent")" || {
            logTo errors "reason=epic-pr-failed step=walk msg=\"no epic gate above this ticket's parent\""
            return
        }
        if [[ "$gateId" == "$claimParent" ]]; then
            prTarget="main"
        else
            prTarget="$(readFieldOf "$gateId" branch)"
            [[ -n "$prTarget" ]] || {
                logTo errors "reason=epic-pr-failed step=gate-branch gate=$gateId msg=\"the epic gate carries no branch metadata, so nothing beneath it has a base branch\""
                return
            }
        fi
        boIdent target "$prTarget"

        # nothing beneath the epic branch can open a pull request until that branch exists on the
        # forge, and nothing but this loop ever puts it there
        ensureEpicGatePr "$gateId" || return

        dispatchWorker "$ticketId" "${AGENT["${matchedLabels[0]}"]}" "$branch" "$prTarget" "${matchedLabels[0]}"
        return
    done

    waiting branch_busy "held=${#skippedTicket[@]}"
}

while true; do
    if (( maximumTicks > 0 && tickCount >= maximumTicks )); then
        boClearIdentity
        logTo results "ticks=$tickCount claimed=$claimedThisRun note=\"hit BO_MAX_TICKS: this run was configured to end, the tower did not run out of work\""
        break
    fi
    tickCount=$((tickCount + 1))
    tick
    sleep "$pollSeconds"
done
