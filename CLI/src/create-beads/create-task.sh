#!/usr/bin/env bash
# create-task.sh — print the id of the next ticket under a gate and create nothing.
#   create-task.sh <repo> <gateId> [suite|review|task]      (task is the default)
# An id is <repo>-<kind>-<uuid>-<hierarchy>. Every ticket a gate owns reads task, whatever its
# job — the suite, the review and the worker tasks alike — because the kind word names who you
# are and only a gate is named. The uuid and the repo are copied off the gate, never minted here.
# The hierarchy is <gate number>.<m>: .1 is always that gate's suite, .2 always its review, and
# the worker chain starts at .3. Under the epic gate the same rule reads 0.1, 0.2, 0.3.
# The id on stdout is the whole contract — pass it to bd create as --id. Errors go to stderr and
# stdout stays empty, so a failed run can never feed a half id into a plan agent's command line.
set -uo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../../utils/console.sh"
nameTheSpeaker create-task

usage() {
    cat <<'USAGE'
create-task — print the id of the next ticket under a gate, create nothing

  create-task.sh <repo> <gateId> [suite|review|task]      (task is the default)

Every ticket below a gate reads task in its id — the epic's e2e suite, the epic's review, a
feature's suite, its review, and its worker tasks all of them:

  foobar-task-a7f3c9-0.1     the epic's e2e suite
  foobar-task-a7f3c9-0.2     the epic's review
  foobar-task-a7f3c9-1.1     feature 1's suite
  foobar-task-a7f3c9-1.2     feature 1's review
  foobar-task-a7f3c9-1.3     feature 1's first worker task

The two structural tickets are fixed numbers, so name the role and this hands the same number
back every time; ask for a second suite and it refuses rather than writing a dupe. A plain task
takes the next free number above .2, counted off the ids already in the database — not off the
graph, because a ticket whose edge was never written still holds its number.

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

rowExists() {
    [[ -n "$(issueTypeOf "$1")" ]]
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

structuralNumber() {
    case "$role" in
        suite) printf '1' ;;
        review) printf '2' ;;
        *) printf '3' ;;
    esac
}

nextTaskNumber() {
    local numbers highest
    numbers="$(existingTaskNumbers)"
    if [[ -z "$numbers" ]]; then
        printf '%s' "$(structuralNumber)"
        return
    fi
    highest="$(printf '%s\n' "$numbers" | sort -n | tail -1)"
    [[ "$highest" -ge 2 ]] && printf '%s' "$((highest + 1))" || printf '3'
}

newTaskId() {
    local gateId="$1" number
    requireGateRow "$gateId"
    splitGateId "$gateId"
    if [[ "$role" == suite || "$role" == review ]]; then
        number="$(structuralNumber)"
        rowExists "$repo-task-$uuid-$head.$number" \
            && die "this gate already has its $role at $repo-task-$uuid-$head.$number — a gate has one of each"
    else
        number="$(nextTaskNumber)"
    fi
    printf '%s-task-%s-%s.%s' "$repo" "$uuid" "$head" "$number"
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
    role="${3:-task}"
    [[ -n "$gateId" ]] || die "no gate named — every ticket belongs to a gate; pass its id as the second argument"
    [[ "$role" == suite || "$role" == review || "$role" == task ]] \
        || die "unknown role '$role' — there are three: suite, review, task"
    requireBeadsProject
    requireRepo "$repo"
    newTaskId "$gateId"
    printf '\n'
}

runRequestedTask "$@"
