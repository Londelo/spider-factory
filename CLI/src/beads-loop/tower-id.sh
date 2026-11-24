#!/usr/bin/env bash
# tower-id.sh — the id grammar, and what a ticket's place in the tower is, sourced by beads-loop/index.sh.
#   Everything about a ticket's git world is read off its id; nothing here walks a graph.

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

readFieldOf() {
    local id="$1" key="$2"
    [[ -n "$id" ]] || return 1
    bd -C "$towerDir" show --json "$id" 2>/dev/null \
        | jq -r --arg k "$key" 'if type == "array" then .[0] else . end | ((.metadata // {})[$k] // empty)' 2>/dev/null
}

# The branch a ticket's work lands on and the branch its pull request aims at, both read off the
# gates its id names. The owner is the gate whose `branch` the work lands on: a gate owns its own
# branch, a task owns its feature gate's, an epic-tier ticket owns the epic gate's. The pull
# request aims at main when the owner is the epic gate, and at the epic gate's branch otherwise.
# Fails when the id reaches no gate — a ticket belonging to no tower is not work.
branchResolveFailure=""
resolvedEpicGate=""

resolveTicketBranches() {
    local id="$1" epicGate owner
    branch=""
    prTarget=""
    branchResolveFailure=""
    resolvedEpicGate=""
    splitTowerId "$id" || { branchResolveFailure="malformed"; return 1; }
    if [[ "$idKind" == task && "$idHierarchy" != *.* ]]; then
        branchResolveFailure="task-not-below-a-gate"
        return 1
    fi
    epicGate="$(epicGateOf "$id")"
    [[ "$(issueTypeOf "$epicGate")" == gate ]] || { branchResolveFailure="not-a-gate"; return 1; }
    resolvedEpicGate="$epicGate"
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

claimBelongsToATower() {
    local why
    if resolveTicketBranches "$ticketId"; then
        setLogField branch "$branch"
        setLogField target "$prTarget"
        return 0
    fi
    why="$branchResolveFailure"
    case "$why" in
        malformed)
            writeLog errors "reason=no-epic-gate ticket=$ticketId msg=\"$msgNoEpicGateMalformed\"" ;;
        task-not-below-a-gate)
            writeLog errors "reason=no-epic-gate ticket=$ticketId step=not-below-a-gate msg=\"$msgTaskNotBelowAGate\"" ;;
        not-a-gate)
            writeLog errors "reason=no-epic-gate ticket=$ticketId gate=$(epicGateOf "$ticketId") msg=\"$msgEpicGateRowIsNotAGate\"" ;;
        owner-carries-no-branch)
            writeLog errors "reason=gate-unworkable ticket=$ticketId msg=\"$msgOwnerCarriesNoBranch\"" ;;
        *)
            writeLog errors "reason=gate-unworkable ticket=$ticketId gate=$resolvedEpicGate msg=\"$msgEpicCarriesNoBranch\"" ;;
    esac
    return 1
}
