#!/usr/bin/env bash
# claim.sh — the frontier, the guards a claim must pass, and the waiting line, sourced by beads-loop/index.sh.
#   A claim that cannot be worked is released or parked, never dispatched on a guess; the state that
#   carries a claim through the guards — claimJson, ticketId, ticketLabels, matchedLabels — is tick's own.

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
    logTo errors "reason=bd-failure exit=0 msg=\"$(formatMessage "$msgClaimReturnedNoIdTemplate" "$(tr -d '\n' <<< "$claimJson" | head -c 60)")\""
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

releaseClaim() { bd unclaim "$1" >/dev/null 2>&1 || true; }

reportEmptyFrontier() {
    local stalledTickets
    stalledTickets="$(countOf "$(numberOfStalledTickets)")"
    if [[ "$stalledTickets" == "0" ]]; then
        waiting frontier_empty
    else
        waiting tower_stalled "waiting=$stalledTickets"
    fi
}
