#!/usr/bin/env bash
# index.sh — print the whole database as one tree: every ticket of every status, each task inside its feature
#   and each feature inside its epic, top to bottom in the order the dispatcher works them.
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
epic, top to bottom in the order the dispatcher takes them: a feature's worker chain,
then its suite, then its review, then its gate; the epic's own suite and review last.

  number   the order this ticket closed within its own epic. Tickets still waiting are
           numbered after the closed ones, in the order they are expected to run — so a
           number out of step with the page is the order having gone wrong.
  glyph    ✓ closed   ▶ in progress   ◆ ready   · open   ~ deferred   ! failed   ✗ cancelled
  date     the day the ticket closed

An id that does not read <repo>-<kind>-<uuid>-<hierarchy> belongs to no tower and is
listed last, under 'unfiled'.

Reads only: one 'bd export' and one 'bd ready'. Nothing is claimed or closed.
USAGE
}

readyTicketIds() {
    bd ready --json | jq -c '[ .[].id ]'
}

drawTheTower() {
    local ready
    ready="$(readyTicketIds)"
    bd export --json | jq -s -r --argjson ready "$ready" -f "$here/tower.jq"
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
