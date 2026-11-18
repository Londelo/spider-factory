#!/usr/bin/env bash
# tower-walk — the dependency model of .claude/CLAUDE.md §Tower and §Branches, proved by hand
# against a throwaway beads DB: the tower is `blocks` edges and nothing else — no `--parent`, no
# `parent-child` edge anywhere. A gate's tier is the set of tickets that block it, so every ticket
# of a tier blocks its gate; the next tier is blocked by the gate itself so the tower stalls until a
# human closes it; one feature's tasks are one chained line; and the claim carries `branch` and
# `base` as its own metadata.
#
# Usage: rm -rf /tmp/bo-tower-walk2 && ./tower-walk.sh   (fresh run)
set -euo pipefail

export BD_NO_DEP_TYPE_WARNING=1

root="${1:-/tmp/bo-tower-walk2}"
walkLog="$root/walk-log.txt"

newDatabaseAtRoot() {
    if [[ -d "$root/.beads" ]]; then
        echo "tower-walk: $root already holds a beads DB — rm -rf for a fresh run" >&2
        exit 1
    fi
    mkdir -p "$root"
    cd "$root"
    : > "$walkLog"
    BD_NON_INTERACTIVE=1 bd init >/dev/null 2>&1
    echo "tower-walk v3: DB at $(bd where | head -1)"
}

probeCloseTicketBehindABlocker() {
    local junkA junkB
    junkA=$(bd create "junk probe A (blocked by B)" -t task --silent --deps blocked-by:$(bd create "junk probe B (blocker)" -t task --silent))
    junkB=$(bd list --json 2>/dev/null | jq -r '.[] | select(.title=="junk probe B (blocker)") | .id' | head -1)
    echo "P2 probe — closing A while its blocker B is still open:"
    bd close "$junkA" --reason "probe: closing a blocked ticket" 2>&1 | head -2 | tee -a "$walkLog" || true
    bd close "$junkA" "$junkB" --reason "probe cleanup" >/dev/null 2>&1 || true
    echo "P2 result above; junk tickets now closed, tower build begins." | tee -a "$walkLog"
}

createTower() {
    epicBranch="epic/reading-log"
    featureBranch="feature/import-library"
    epicMeta="{\"branch\":\"$epicBranch\",\"base\":\"main\",\"tier\":\"epic\"}"
    featMeta="{\"branch\":\"$featureBranch\",\"base\":\"$epicBranch\",\"tier\":\"feature\"}"
    epicTaskMeta="{\"branch\":\"$epicBranch\",\"base\":\"main\"}"
    featTaskMeta="{\"branch\":\"$featureBranch\",\"base\":\"$epicBranch\"}"

    EPIC=$(bd create "Epic: Bookshelf — personal reading log" -t gate --silent \
      -d "The reading-log epic. A user keeps a personal bookshelf: import an existing library from a Goodreads-style CSV, add books by hand, and search the shelf. This gate stands until every feature under it has shipped and its PR is merged." \
      --acceptance "All feature gates under this epic are closed. The epic e2e suite (journeys across import + manual add + search) runs green on the epic branch." \
      --metadata "$epicMeta")

    FEAT=$(bd create "Feature: import a library from Goodreads-style CSV" -t gate --silent \
      -d "One complete user-facing flow: the user uploads a Goodreads-style CSV (title, author, rating, dates read), sees a parsed preview with duplicates flagged, confirms, and the books land on their shelf with tags from the CSV's 'bookshelves' column. Covers the parser service, the import page, and the wiring between them." \
      --acceptance "Upload → preview → confirm → shelf works end to end on the real stack. Duplicate rows (same isbn13) are flagged, not inserted twice. A row missing title AND author is rejected with a line number." \
      --metadata "$featMeta")

    BE=$(bd create "POST /api/import — parse Goodreads-style CSV into shelf entries" -t task -l backend-logic --silent \
      -d "Pure service function parseLibraryCsv(text) plus the POST /api/import endpoint that wires it to the shelf store. Dedupe on isbn13; a row missing title AND author is rejected with its line number; the 'bookshelves' column becomes tags. No UI here — the page is a sibling ticket." \
      --acceptance "parseLibraryCsv is pure and unit-testable alone. Endpoint returns the preview payload {rows, rejected}. Duplicate isbn13 rows come back flagged, never inserted twice." \
      --metadata "$featTaskMeta")

    UT1=$(bd create "Unit tests: parseLibraryCsv — every branch, boundary, empty/null, error" -t task -l unit-tests --silent \
      -d "The parser function ALONE, no HTTP, no DOM: header row, missing columns, duplicate isbn13, row missing title AND author (and each alone), CRLF line endings, BOM prefix, empty file, whitespace-only file, a 10k-row fixture for the boundary. Every branch and boundary in parseLibraryCsv gets a test here. No component is tested on this tier." \
      --acceptance "Every branch/boundary of parseLibraryCsv covered; suite green; nothing that belongs to the feature tier re-asserted here." \
      --metadata "$featTaskMeta")

    FE=$(bd create "Import page — file picker, parsed preview, confirm" -t task -l frontend-ui --silent \
      -d "The /import page: FileDrop (drag or pick a .csv), PreviewTable (parsed rows, duplicates flagged, rejected lines listed), ConfirmBar (count summary + confirm). Empty, loading, error, and partial-rejection states all exist. Talks to POST /api/import only — no parsing logic in components. Built after the parser and its tests landed, so the page is built against a function that already holds." \
      --acceptance "Page renders all four states (empty/loading/preview-with-rejections/error). Confirm sends the preview payload and routes to /shelf on success. No parser logic lives in components." \
      --metadata "$featTaskMeta")

    FT=$(bd create "Feature tests: the import flow wired — upload → preview → confirm → shelf" -t task -l feature-test --silent \
      -d "One feature's pieces proved WIRED on the feature branch, where every task of this feature has landed as a commit: real CSV fixture through the real endpoint into the real store, then the page against it. Successes and failures of THIS feature surface here: happy path, duplicate-flagged file, all-rejected file, and the shelf's state after confirm (tags landed, duplicates not doubled)." \
      --acceptance "Flow proven end to end for one success and one failure per surface; nothing re-asserts a unit-tier case; runs against the real stack, no mocked parser." \
      --metadata "$featTaskMeta")

    FREV=$(bd create "Review: import feature — trace the change, run the suites, certify" -t task -l feature-review --silent \
      -d "Trace every change this feature's commits made on its branch, instrument if needed, run the unit and feature suites, and certify the feature or name exactly what is broken. Certifying means the feature does what its gate's acceptance criteria demand — not that files merely exist." \
      --acceptance "Suites run and counted (not just exit codes); any test that had to change to pass is named as a defect, not fixed silently; certification or defect list lands on the ticket." \
      --metadata "$featTaskMeta")

    E2E=$(bd create "E2E tests: reading-log journeys across import, manual add, and search" -t task -l epic-e2e-test --silent \
      -d "Journeys that CROSS features on the real stack: import a CSV then search within what landed; add by hand then import over the top (duplicates flag against hand-added rows); search a tag that only exists in the CSV's bookshelves column. One success and one failure path per feature, plus cross-feature state." \
      --acceptance "Journeys run on the real stack against the merged features; cross-feature state proven both directions; one success + one failure per feature at minimum." \
      --metadata "$epicTaskMeta")

    EREV=$(bd create "Review: the whole epic — certify the epic branch" -t task -l epic-review --silent \
      -d "Trace the epic branch — every feature branch already merged into it by that feature's own lead agent — top to bottom, run the e2e journeys, and certify the epic or name what is broken. A feature certified alone is NOT proof the features fit together — that is what this ticket exists to find." \
      --acceptance "E2E suite run with counts; any cross-feature break named with the two tickets at the seam; certification or defect list lands on the ticket." \
      --metadata "$epicTaskMeta")
}

wireDependencies() {
    # every ticket of a tier blocks its gate — that set of blockers IS the tier
    for t in "$BE" "$UT1" "$FE" "$FT" "$FREV"; do bd dep add "$t" "$FEAT" >/dev/null; done
    for t in "$E2E" "$EREV"; do bd dep add "$t" "$EPIC" >/dev/null; done

    # the chain inside the feature: one predecessor each
    bd dep add "$UT1" "$BE" >/dev/null
    bd dep add "$FE" "$UT1" >/dev/null
    bd dep add "$FT" "$FE" >/dev/null
    bd dep add "$FREV" "$FT" >/dev/null

    # the next tier waits on the gate itself, and the epic chain runs e2e → review
    bd dep add "$E2E" "$FEAT" >/dev/null
    bd dep add "$EREV" "$E2E" >/dev/null
}

probeCloseGateWithOpenTier() {
    echo "P3 probe — closing the EPIC gate while the tickets that block it are still open:"
    bd close "$EPIC" --reason "probe: closing a gate with its tier still open" 2>&1 | head -2 | tee -a "$walkLog" || true
    bd reopen "$EPIC" >/dev/null 2>&1 || true
    echo "P3 result above; walk begins." | tee -a "$walkLog"
}

reportTowerAndFrontier() {
    echo "tower-walk v3: tower built — $(bd list --json 2>/dev/null | jq 'length' 2>/dev/null || echo '?') tickets (2 gates + 7 tasks + 2 junk probes)"
    echo "tower-walk v3: the tower is edges, not parenthood — every edge in the DB by type:"
    bd list --json --include-gates 2>/dev/null | jq -r '.[].id' | while read -r i; do
        bd dep list "$i" --json 2>/dev/null | jq -r --arg from "$i" '.[] | "\($from) blocked-by \(.id) [\(.dependency_type)]"'
    done | sort -u | tee -a "$walkLog"
    echo "tower-walk v3: metadata round trip on both gates and the first task:"
    bd show --json "$EPIC" "$FEAT" "$BE" 2>/dev/null | jq -c '.[] | {id, issue_type, metadata}' | tee -a "$walkLog"
    echo "tower-walk v3: frontier before walking:"
    bd ready --json | jq -c '.[] | {id, title}' | tee -a "$walkLog"
}

walk() { # walk <phase> <max-ticks> — claim+close until frontier empty
    local phase="$1" max="$2" n=0 row ID TYPE LABELS BRANCH BASE
    while (( n < max )); do
        row="$(bd ready --claim --json)"
        [[ -z "$row" || "$row" == "[]" ]] && { echo "[$phase] frontier empty after $n claims"; return 0; }
        ID="$(jq -r '.[0].id' <<< "$row")"; TYPE="$(jq -r '.[0].issue_type' <<< "$row")"; LABELS="$(jq -r '.[0].labels // [] | join(",")' <<< "$row")"
        BRANCH="$(jq -r '.[0].metadata.branch // "-"' <<< "$row")"
        BASE="$(jq -r '.[0].metadata.base // "-"' <<< "$row")"
        echo "[$phase tick $n] claimed $ID (type=$TYPE labels=$LABELS branch=$BRANCH base=$BASE)" | tee -a "$walkLog"
        bd close "$ID" --reason "experiment: flow probe only, no work performed" >>"$walkLog"
        n=$((n+1))
    done
    return 1
}

phaseA() {
    echo "=== PHASE A — feature tier drains, tower should STALL at the open feature gate ===" | tee -a "$walkLog"
    walk A 40 || true
}

reportTicketsStuckBehindTheGate() {
    echo "--- stalled? open/blocked tickets left behind the feature gate:"
    bd list --json --status open,blocked --include-gates 2>/dev/null | jq -r '.[] | "\(.id) [\(.status)] \(.issue_type): \(.title)"' | tee -a "$walkLog"
    echo "--- the feature gate's tier (the tickets that block it), and the epic gate's:"
    bd dep list "$FEAT" -t blocks --json 2>/dev/null | jq -c '.[] | {gate: "'"$FEAT"'", blocker: .id, type: .dependency_type, status: .status}' | tee -a "$walkLog"
    bd dep list "$EPIC" -t blocks --json 2>/dev/null | jq -c '.[] | {gate: "'"$EPIC"'", blocker: .id, type: .dependency_type, status: .status}' | tee -a "$walkLog"
}

phaseB() {
    echo "=== PHASE B — the human verifies and closes the feature gate (simulated) ===" | tee -a "$walkLog"
    bd close "$FEAT" --reason "human simulation: feature verified, gate closed" 2>&1 | tee -a "$walkLog"
    walk B 40 || true
}

reportFinalState() {
    echo "=== FINAL STATE (all statuses, gates included) ==="
    bd list --json --status open,in_progress,blocked,closed --include-gates 2>/dev/null | jq -r '.[] | "\(.id) [\(.status)] \(.issue_type): \(.title)"' | tee -a "$walkLog"
    echo "tower-walk v3: complete. Full log: $walkLog"
}

newDatabaseAtRoot
probeCloseTicketBehindABlocker
createTower
wireDependencies
probeCloseGateWithOpenTier
reportTowerAndFrontier
phaseA
reportTicketsStuckBehindTheGate
phaseB
reportFinalState
