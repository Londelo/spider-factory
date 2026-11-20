#!/usr/bin/env bash
# create-gate.sh — print the id of the next gate and create nothing.
#   create-gate.sh <repo>                the epic gate of a new tower
#   create-gate.sh <repo> <epicGateId>   the next feature gate under that epic
# An id is <repo>-<kind>-<uuid>-<hierarchy>. The kind is epic or feature and appears only on a
# gate; every other ticket in the tower reads task. One uuid per tower, minted here and copied
# down from the gate ever after. The hierarchy is 0 for the epic gate, 1 2 3 for its features.
# The id on stdout is the whole contract — pass it to bd create as --id. Errors go to stderr and
# stdout stays empty, so a failed run can never feed a half id into a plan agent's command line.
set -uo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../../utils/console.sh"
nameTheSpeaker create-gate

usage() {
    cat <<'USAGE'
create-gate — print the id of the next gate, create nothing

  create-gate.sh <repo>                the epic gate of a new tower
  create-gate.sh <repo> <epicGateId>   the next feature gate under that epic

Without a gate above it this writes a brand new tower: a fresh uuid and the hierarchy 0, as in

  foobar-epic-a7f3c9-0

With an epic gate named it copies that gate's uuid, counts the feature gates already standing
under it, and hands back the next number, as in

  foobar-feature-a7f3c9-3

The repo must be this database's own issue prefix. The gate above must be a real row, of type
gate, and must be the epic one — a feature gate named here is refused, because a feature gate
never has children of its own.

One id on stdout, nothing else. Every failure writes to stderr, prints nothing on stdout, and
exits non-zero.
USAGE
}

dbPrefix() {
    bd config list 2>/dev/null \
        | sed -n 's/^[[:space:]]*issue_prefix[[:space:]]*=[[:space:]]*//p' \
        | tr -d '[:space:]'
}

requireBeadsProject() {
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1 \
        || reportNoBeadsDatabase
}

requireRepo() {
    local repo="$1" prefix
    prefix="$(dbPrefix)"
    [[ -n "$prefix" ]] || die "could not read this database's issue_prefix from bd config list"
    [[ "$repo" == "$prefix" ]] \
        || die "'$repo' is not this database's prefix — beads writes ids as '$prefix-…', so it would refuse every id this prints"
}

mintUuid() {
    head -c 6 /dev/urandom | od -An -tx1 | tr -d ' \n'
}

issueTypeOf() {
    bd show --json "$1" 2>/dev/null \
        | jq -r 'if type == "array" then .[0] else . end | .issue_type // empty' 2>/dev/null
}

splitGateId() {
    local id="$1" rest
    [[ "$id" == "$repo-"* ]] || die "'$id' does not belong to this repo — an id here reads $repo-<kind>-<uuid>-<hierarchy>"
    rest="${id#"$repo"-}"
    kind="${rest%%-*}"
    rest="${rest#*-}"
    uuid="${rest%%-*}"
    head="${rest#*-}"
    [[ "$rest" == *-* ]] || die "'$id' is missing its uuid or its hierarchy number — an id here reads $repo-<kind>-<uuid>-<hierarchy>"
    [[ "$kind" == epic || "$kind" == feature ]] || die "'$id' carries the kind '$kind' — only a gate carries epic or feature, and only those two words"
    [[ "$uuid" =~ ^[0-9a-f]+$ ]] || die "'$id' carries the uuid '$uuid' — a uuid is lowercase hex"
    [[ "$head" =~ ^[0-9]+$ ]] || die "'$id' carries the hierarchy '$head' — a gate's hierarchy is one whole number"
}

requireGateRow() {
    local id="$1" type
    type="$(issueTypeOf "$id")"
    [[ -n "$type" ]] || die "'$id' is not a ticket in this database — check the id, or create the gate above it first"
    [[ "$type" == gate ]] || die "'$id' is a '$type', not a gate — the gate above a tower is created with -t gate"
}

existingFeatureNumbers() {
    bd list --include-gates --limit 0 --json 2>/dev/null \
        | jq -r '.[].id' 2>/dev/null \
        | sed -n "s|^$repo-feature-$uuid-\([0-9][0-9]*\)$|\1|p"
}

nextFeatureNumber() {
    local numbers highest
    numbers="$(existingFeatureNumbers)"
    if [[ -z "$numbers" ]]; then
        printf '1'
        return
    fi
    highest="$(printf '%s\n' "$numbers" | sort -n | tail -1)"
    printf '%s' "$((highest + 1))"
}

newEpicGateId() {
    printf '%s-epic-%s-0' "$repo" "$(mintUuid)"
}

newFeatureGateId() {
    local epicId="$1"
    requireGateRow "$epicId"
    splitGateId "$epicId"
    [[ "$kind" == epic ]] \
        || die "'$epicId' is a feature gate — a feature has no gates under it, only tasks; name the epic gate above it"
    printf '%s-feature-%s-%s' "$repo" "$uuid" "$(nextFeatureNumber)"
}

runRequestedGate() {
    case "${1:-}" in
        ""|-h|--help|help)
            usage
            exit 0
            ;;
    esac
    repo="${1:-}"
    requireBeadsProject
    requireRepo "$repo"
    if [[ -n "${2:-}" ]]; then
        newFeatureGateId "$2"
    else
        newEpicGateId
    fi
    printf '\n'
}

runRequestedGate "$@"
