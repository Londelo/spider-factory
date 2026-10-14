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
#                     feature-merge-pr, epic-merge-pr.
#                     A name the map doesn't hold is not a label — it matches nothing and only
#                     starves the frontier. The three test tiers are unit-tests / feature-test /
#                     epic-e2e-test: micro, composition, broad. See .claude/binary-obelisk-v1-design.yaml.
#
# An empty frontier is TWO states and the waiting line names which one it is:
#   reason=frontier_empty          nothing exists to do — idle, or the tower is finished
#   reason=tower_stalled waiting=N N work tickets still exist but sit OFF the frontier behind an
#                                  open blocker (an open gate, or a ticket nobody is working), so
#                                  only a human can unstick them. tick() probes the difference.
set -uo pipefail

maximumParallelWorkers="${BO_MAX_PARALLEL:-4}"
pollSeconds="${BO_POLL_S:-3}"
maximumTicks="${BO_MAX_TICKS:-0}"
logRoot="${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}"

# The keys ARE the closed label set; the two merge labels dispatch to the merge agent like
# any other label. Gates never appear on the frontier — they are structurally invisible to
# `bd ready`, so there is nothing to exclude and no exclusion filters exist.
# This map is the only binding between a label and an agent — never derive an agent name from a label.
declare -A AGENT=(
    [backend-logic]=engineer
    [frontend-ui]=frontend
    [unit-tests]=tester-unit
    [feature-test]=tester-feature
    [epic-e2e-test]=tester-e2e
    [feature-review]=review
    [epic-review]=review
    [feature-merge-pr]=merge
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

for requiredTool in bd jq claude; do
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
for logFileName in claims errors waiting results; do : > "$logDir/$logFileName"; done

# logTo <file> <message…> — the first argument is BOTH the display tag and the file it appends
# to, so a log line can never land in a file nobody watches. (It used to take a separate
# filename argument, and the calls passed claimed/error/result there, silently writing past the
# claims/errors/results files the loop pre-creates — leaving the errors "alarm" file forever empty.)
logTo() { printf '%-8s %s\t%s\n' "$1" "$(date +%FT%T)" "${*:2}" | tee -a "$logDir/$1"; }

lastLineOf() { tail -1 "$1" 2>/dev/null; }

numberOfBusyWorkers() {
    claude agents --json --cwd "$PWD" 2>"$logDir/claude-stderr" \
        | jq '[ .[] | select(.kind == "background") ] | length' 2>/dev/null
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

# the ticket IS the brief — the worker reads it from beads, nothing is transcribed
buildWorkerPrompt() {
    printf '%s' "Your ticket: $1.
FIRST: bd show --json $1 — the description, design notes, and acceptance criteria in that output are your complete brief; read them IN FULL before touching code.

Rules:
1. Keep your claim lease alive — the 5-minute lease must NEVER lapse. Run
   bd heartbeat $1
   between long steps; a lapsed lease means another dispatcher can seize your ticket mid-work.
2. Do NOT close your ticket — never run \`bd close\`, whatever the outcome. When your work is
   done, keep the lease (bd heartbeat $1) and state your proof of work in your final message:
   what you did and the test evidence that proves it. A human reads the final message,
   checks the work, and closes the ticket; a ticket you close yourself closes unverified.
3. If the brief needs more work than you can finish: write a beads comment on $1
   describing exactly what remains (check bd comment --help). Never half-do and hide it.
4. Spawn nothing. Work nothing but $1. You and your ticket are one and the same."
}

claimedThisRun=0
tickCount=0
onInterrupt() {
    logTo results "ticks=$tickCount claimed=$claimedThisRun"
    printf "\nbeads-loop: stopped. claimed=%d  log: %s\n" "$claimedThisRun" "$logDir"
    exit 0
}
trap 'onInterrupt' INT TERM

echo "beads-loop: logging to $logDir  (Ctrl-C to stop)"

# Claude makes the worktree itself (-w names it after the ticket, so it is never shared)
dispatchWorker() {
    local ticketId="$1" agentName="$2"
    if ! claude --bg -w "$ticketId" --agent "$agentName" --permission-mode bypassPermissions \
            "$(buildWorkerPrompt "$ticketId")" >"$logDir/last-spawn" 2>&1; then
        logTo errors "ticket=$ticketId agent=$agentName reason=worker-not-dispatched msg=\"$(lastLineOf "$logDir/last-spawn")\""
        bd unclaim "$ticketId" >/dev/null 2>&1 || true
        return
    fi
    claimedThisRun=$((claimedThisRun + 1))
    logTo claims "ticket=$ticketId label=${matchedLabels[0]} agent=$agentName worktree=\"$PWD/.claude/worktrees/$ticketId\""
}

tick() {
    local busyWorkers ticketsInWork stalledTickets claimResult claimExitCode ticketId
    local ticketLabels matchedLabels=()

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

    # one ticket per tick, claimed atomically (assignee + in_progress + 5-min lease);
    # no --exclude-type/--exclude-label filters — gates are invisible to `bd ready` anyway
    claimResult="$(bd ready --claim --json 2>"$logDir/bd-stderr")"
    claimExitCode=$?
    if (( claimExitCode != 0 )); then
        logTo errors "reason=bd-failure exit=$claimExitCode msg=\"$(lastLineOf "$logDir/bd-stderr")\""
        return
    fi

    # an EMPTY FRONTIER IS NOT ONE STATE. It can mean there is nothing left to do, or it can mean
    # work exists that an open blocker holds off the frontier — an open gate two levels below, most
    # often, which only a human may close. The two need different alarms, so count the off-frontier
    # work tickets and name the state honestly. Capped at one line a minute PER REASON.
    if [[ -z "$claimResult" || "$claimResult" == "[]" ]]; then
        stalledTickets="$(numberOfStalledTickets)"
        stalledTickets="${stalledTickets//[!0-9]/}"
        if [[ -z "$stalledTickets" || "$stalledTickets" == "0" ]]; then
            waiting frontier_empty
        else
            waiting tower_stalled "waiting=$stalledTickets"
        fi
        return
    fi

    ticketId="$(jq -r '.[0].id // empty' <<< "$claimResult" 2>/dev/null)"
    if [[ -z "$ticketId" ]]; then
        logTo errors "reason=bd-failure exit=0 msg=\"claim returned no id: $(tr -d '\n' <<< "$claimResult" | head -c 60)\""
        return
    fi
    mapfile -t ticketLabels < <(jq -r '.[0].labels // [] | .[]' <<< "$claimResult" 2>/dev/null)

    # zero or two specialist names among the labels is the tower's bug, not ours,
    # and the claim is LEFT in place: its lease parks the broken ticket off the frontier
    for ticketLabel in "${ticketLabels[@]}"; do
        if isLabel "$ticketLabel"; then
            matchedLabels+=("$ticketLabel")
        fi
    done
    if (( ${#matchedLabels[@]} != 1 )); then
        logTo errors "ticket=$ticketId reason=label-ambiguous matched=\"${matchedLabels[*]-}\" labels=\"${ticketLabels[*]-}\""
        return
    fi

    dispatchWorker "$ticketId" "${AGENT["${matchedLabels[0]}"]}"
}

while true; do
    if (( maximumTicks > 0 && tickCount >= maximumTicks )); then
        logTo results "ticks=$tickCount claimed=$claimedThisRun note=\"hit BO_MAX_TICKS: this run was configured to end, the tower did not run out of work\""
        break
    fi
    tickCount=$((tickCount + 1))
    tick
    sleep "$pollSeconds"
done
