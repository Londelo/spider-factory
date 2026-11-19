#!/usr/bin/env bash
# gates.sh — the gate side of the tick, sourced by beads-loop/index.sh.
#   A gate is claimed by status and never by bd ready --claim, and the lead agent is the one worker no
#   label reaches: it is spawned for a ready gate whose tier flag is on, and it merges through the forge.

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
        logTo errors "reason=gate-claim-lost gate=$gateId msg=\"$msgGateClaimLost\""
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
        logTo errors "reason=worktree-failed step=gate gate=$gateId msg=\"$(formatMessage "$msgGateWorktreeCouldNotBeMadeTemplate" "$gateBranch" "$gatePrTarget")\""
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
            logTo errors "reason=gate-unworkable gate=$gateId msg=\"$msgGateIdIsNoGateOfAnyTower\""
            continue
        fi
        gateTierIsSwitchedOn "$tier" || continue
        atDispatchCapacity && return
        dispatchOneGate "$gateId" "$tier"
    done < <(readyGates)
}
