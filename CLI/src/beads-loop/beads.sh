#!/usr/bin/env bash
# beads.sh — every beads read that is not a claim, sourced by beads-loop/index.sh.
#   The claim itself, and the guards around it, are claim.sh. A gate's own reads are gates.sh.

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
                 | select(.status == "busy")
                 | select((.cwd // "") | startswith($root) or . == $tower) ] | length' 2>/dev/null
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
