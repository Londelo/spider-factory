#!/usr/bin/env bash
# index.sh — print the whole database as one tree: every ticket of every status, each task inside its feature
#   and each feature inside its epic, top to bottom in the order the dispatcher works them.
#   The order comes off the blocks graph, every id fed through 'bd dep list'; creation order breaks a tie.
#   Indentation is that same order read as depth: a gate or an epic ticket hangs one step under the last
#   thing it waits on, so the deeper the row the later it gets done. A feature's own tickets hang at one
#   depth under their gate and are ordered by their number alone.
#   index.sh   (or: sf tower)
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/../../utils/console.sh"
nameTheSpeaker tower

usage() {
    cat <<'USAGE'
tower — the whole database as one tree, in the order the loop works it

  tower.sh

Every ticket of every status, each task inside its feature and each feature inside its
epic, top to bottom in the order the dispatcher takes them, read off the blocks graph:
every ticket after the one it waits on, and a gate last, after the review that is the only
thing blocking it.

  number   the order this ticket closed within its own epic. Tickets still waiting are
           numbered after the closed ones, in the order they are expected to run — so a
           number out of step with the page is the order having gone wrong.
  depth    how far in a feature gate, an epic ticket, or the epic's own review sits: one
           step deeper than the last thing it waits on. The deeper the row, the later it
           gets done — a feature that waits on another hangs under it, and the epic's
           tickets hang under the last feature of all. Two features that wait on neither
           other sit side by side at the same depth: neither is later. A feature's own
           tickets are never stepped by depth, only by their number.
  glyph    ✓ closed   ▶ in progress   ◆ ready   · open   ~ deferred   ! failed   ✗ cancelled
  date     the day the ticket closed

An id that does not read <repo>-<kind>-<uuid>-<hierarchy> belongs to no tower and is
listed last, under 'unfiled'.

Reads only: 'bd ready', 'bd export', and 'bd dep list' over every id. Nothing is
claimed or closed. If the edges will not read, the picture refuses to draw rather
than print creation order and call it the plan.
USAGE
}

readyTicketIds() {
    bd ready --json | jq -c '[ .[].id ]'
}

blocksEdges() {
    jq -s -r '[ .[].id ] | .[]' | xargs -r bd dep list --json \
        | jq -sc '[ .[][] | select(.type == "blocks") ]'
}

drawTheTower() {
    local ready exported deps
    ready="$(readyTicketIds)"
    exported="$(bd export --json)"
    deps="$(blocksEdges <<< "$exported")" \
        || die "the blocks edges would not read out of bd dep list — the picture would draw in creation order and look right"
    jq -s -r --argjson ready "$ready" --argjson deps "${deps:-[]}" -f "$here/tower.jq" <<< "$exported"
}

runRequestedView() {
    case "${1:-}" in
        -h|--help|help)
            usage
            exit 0
            ;;
    esac
    requireBeadsProject
    drawTheTower
}

runRequestedView "$@"
