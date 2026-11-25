#!/usr/bin/env bash
# create-task.sh — print the id of the next ticket under a gate and create nothing.
#   create-task.sh <repo> <gateId>
# An id is <repo>-<kind>-<uuid>-<hierarchy>. Every ticket a gate owns reads task, whatever its
# job — the peg, the suite, the review and the worker tasks alike — because the kind word names
# who you are and only a gate is named. The uuid and the repo are copied off the gate, never
# minted here. The hierarchy is <gate number>.<m> and <m> is only the next number under that
# gate: it carries no meaning, the blocks graph is what says what runs when.
# The id on stdout is the whole contract — pass it to bd create as --id. Errors go to stderr and
# stdout stays empty, so a failed run can never feed a half id into a plan agent's command line.
set -uo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../../utils/console.sh"
nameTheSpeaker create-task

usage() {
    cat <<'USAGE'
create-task — print the id of the next ticket under a gate, create nothing

  create-task.sh <repo> <gateId>

Every ticket below a gate reads task in its id — a feature's peg, its suite, its review, and
its worker tasks all of them:

  foobar-task-a7f3c9-1.1     feature 1's first ticket
  foobar-task-a7f3c9-1.2     feature 1's second ticket
  foobar-task-a7f3c9-1.3     feature 1's third ticket

The number is the next one free under that gate, counted off the ids already in the database —
not off the graph, because a ticket whose edge was never written still holds its number. It
means nothing on its own: which ticket waits on which is the blocks graph's to say, and a plan
agent may hand the numbers out in any order it likes.

The repo must be this database's own issue prefix, and the gate must be a real row of type gate
carrying epic or feature. One id on stdout, nothing else; every failure writes to stderr, prints
nothing on stdout, and exits non-zero.
USAGE
}

dbPrefix() {
    bd config list 2>/dev/null \
        | sed -n 's/^[[:space:]]*issue_prefix[[:space:]]*=[[:space:]]*//p' \
        | tr -d '[:space:]'
}

requireRepo() {
    local repo="$1" prefix
    prefix="$(dbPrefix)"
    [[ -n "$prefix" ]] || die "could not read this database's issue_prefix from bd config list"
    [[ "$repo" == "$prefix" ]] \
        || die "'$repo' is not this database's prefix — beads writes ids as '$prefix-…', so it would refuse every id this prints"
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
    [[ "$kind" == epic || "$kind" == feature ]] || die "'$id' carries the kind '$kind' — the gate above a ticket is the one row carrying epic or feature"
    [[ "$uuid" =~ ^[0-9a-f]+$ ]] || die "'$id' carries the uuid '$uuid' — a uuid is lowercase hex"
    [[ "$head" =~ ^[0-9]+$ ]] || die "'$id' carries the hierarchy '$head' — a gate's hierarchy is one whole number"
}

requireGateRow() {
    local id="$1" type
    type="$(issueTypeOf "$id")"
    [[ -n "$type" ]] || die "'$id' is not a ticket in this database — create the gate first, or check the id"
    [[ "$type" == gate ]] || die "'$id' is a '$type', not a gate — a ticket belongs to a gate, never to a task"
}

existingTaskNumbers() {
    bd list --include-gates --limit 0 --json 2>/dev/null \
        | jq -r '.[].id' 2>/dev/null \
        | sed -n "s|^$repo-task-$uuid-$head\.\([0-9][0-9]*\)$|\1|p"
}

nextTaskNumber() {
    local numbers highest
    numbers="$(existingTaskNumbers)"
    [[ -n "$numbers" ]] || { printf '1'; return; }
    highest="$(printf '%s\n' "$numbers" | sort -n | tail -1)"
    printf '%s' "$((highest + 1))"
}

newTaskId() {
    local gateId="$1"
    requireGateRow "$gateId"
    splitGateId "$gateId"
    printf '%s-task-%s-%s.%s' "$repo" "$uuid" "$head" "$(nextTaskNumber)"
}

runRequestedTask() {
    case "${1:-}" in
        ""|-h|--help|help)
            usage
            exit 0
            ;;
    esac
    repo="${1:-}"
    local gateId="${2:-}"
    [[ -n "$gateId" ]] || die "no gate named — every ticket belongs to a gate; pass its id as the second argument"
    [[ $# -eq 2 ]] || die "$3 is a third argument and there are two: a repo and a gate. The number this prints names no role — the blocks graph says what runs when"
    requireBeadsProject
    requireRepo "$repo"
    newTaskId "$gateId"
    printf '\n'
}

runRequestedTask "$@"
