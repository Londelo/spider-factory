#!/usr/bin/env bash
# tower-walk v2 — the rethought dependency model, tested by hand.
#
# THE MODEL UNDER TEST (replaces v1's flat blocks-chain):
#   R1 bottom-up: a parent (gate) is blocked-by EVERY child ticket — a gate can
#      never close until its children are done. "Parent can't be done until the
#      children are done."
#   R2 tier stall: the next tier's work is blocked-by the GATE ITSELF two levels
#      down (epic-tier tickets blocked-by the feature gate). Gates are invisible to
#      `bd ready` and only a human closes them → the tower STALLS until a human
#      verifies and closes the feature gate. The stall is the design.
#   R3 one chain per feature: BE → UT1 → FE → feature-test → feature-review — the logic, then its
#      tests, then the UI, the micro tier covering back-end functions only. A feature's
#      tasks are never a fan, so the frontier hands out ONE task per feature at a time and the
#      feature branch never has two writers. The epic tier keeps merge → e2e → review; merge
#      tickets are REGULAR tickets: they sit on the frontier and get claimed like any other.
#   R4 metadata transport: every ticket carries its own `branch` as metadata — the one key the dispatcher
#      reads off the claim payload; `pr` (the PR url) is the loop's and the Stop hook's, never written at
#      create. A PR's BASE is not a key: it is the epic gate's own `branch`, reached by the claim's
#      `parent`, so the claim must carry `parent` too. One branch per epic, one per feature,
#      a task is a commit — there is no per-task branch and no feature merge ticket.
#   No exclusions anywhere: bare `bd ready --claim --json`.
#
# EXPECTED if the model holds:
#   Phase A drains the feature tier (BE, UT1, FE, test, review = 5 claims, one at a time),
#   then STALLS — the 3 epic-tier tickets sit blocked-by the open feature gate.
#   Phase B simulates the human closing the feature gate; the walk resumes and the
#   epic tier drains. Without the R2 edge (v1 behaviour) the epic tickets would have
#   leaked onto the frontier mid-phase-A — that was the bug this run re-tests.
#
# Usage: rm -rf /tmp/bo-tower-walk2 && ./tower-walk.sh   (fresh run)
set -euo pipefail
ROOT="${1:-/tmp/bo-tower-walk2}"
LOG="$ROOT/walk-log.txt"
[[ -d "$ROOT/.beads" ]] && { echo "tower-walk: $ROOT already holds a beads DB — rm -rf for a fresh run" >&2; exit 1; }
mkdir -p "$ROOT"; cd "$ROOT"; : > "$LOG"
BD_NON_INTERACTIVE=1 bd init >/dev/null 2>&1
echo "tower-walk v2: DB at $(bd where | head -1)"

# ---- PROBE P2: can `bd close` close a ticket whose blocker is still open? --------
# (decides whether R1 is structurally enforced or merely advisory)
JA=$(bd create "junk probe A (blocked by B)" -t task --silent --deps blocked-by:$(bd create "junk probe B (blocker)" -t task --silent))
JB=$(bd list --json 2>/dev/null | jq -r '.[] | select(.title=="junk probe B (blocker)") | .id' | head -1)
echo "P2 probe — closing A while its blocker B is still open:"
bd close "$JA" --reason "probe: closing a blocked ticket" 2>&1 | head -2 | tee -a "$LOG" || true
bd close "$JA" "$JB" --reason "probe cleanup" >/dev/null 2>&1 || true
echo "P2 result above; junk tickets now closed, tower build begins." | tee -a "$LOG"

# ---- BUILD: Bookshelf tower, v2 wiring --------------------------------------------
EPIC_BRANCH="epic/reading-log"
FEAT_BRANCH="feature/import-library"
EPIC_META="{\"branch\":\"$EPIC_BRANCH\"}"
FEAT_META="{\"branch\":\"$FEAT_BRANCH\"}"

EPIC=$(bd create "Epic: Bookshelf — personal reading log" -t gate --silent \
  -d "The reading-log epic. A user keeps a personal bookshelf: import an existing library from a Goodreads-style CSV, add books by hand, and search the shelf. This gate stands until every feature under it has shipped and its PR is merged." \
  --acceptance "All feature gates under this epic are closed. The epic e2e suite (journeys across import + manual add + search) runs green on the epic branch." \
  --metadata "$EPIC_META")

FEAT=$(bd create "Feature: import a library from Goodreads-style CSV" -t gate --silent --parent "$EPIC" \
  -d "One complete user-facing flow: the user uploads a Goodreads-style CSV (title, author, rating, dates read), sees a parsed preview with duplicates flagged, confirms, and the books land on their shelf with tags from the CSV's 'bookshelves' column. Covers the parser service, the import page, and the wiring between them." \
  --acceptance "Upload → preview → confirm → shelf works end to end on the real stack. Duplicate rows (same isbn13) are flagged, not inserted twice. A row missing title AND author is rejected with a line number." \
  --metadata "$FEAT_META")

BE=$(bd create "POST /api/import — parse Goodreads-style CSV into shelf entries" -t task -l backend-logic --silent --parent "$FEAT" \
  -d "Pure service function parseLibraryCsv(text) plus the POST /api/import endpoint that wires it to the shelf store. Dedupe on isbn13; a row missing title AND author is rejected with its line number; the 'bookshelves' column becomes tags. No UI here — the page is a sibling ticket." \
  --acceptance "parseLibraryCsv is pure and unit-testable alone. Endpoint returns the preview payload {rows, rejected}. Duplicate isbn13 rows come back flagged, never inserted twice." \
  --metadata "$FEAT_META")

UT1=$(bd create "Unit tests: parseLibraryCsv — every branch, boundary, empty/null, error" -t task -l unit-tests --silent --parent "$FEAT" \
  -d "The parser function ALONE, no HTTP, no DOM: header row, missing columns, duplicate isbn13, row missing title AND author (and each alone), CRLF line endings, BOM prefix, empty file, whitespace-only file, a 10k-row fixture for the boundary. Every branch and boundary in parseLibraryCsv gets a test here. No component is tested on this tier." \
  --acceptance "Every branch/boundary of parseLibraryCsv covered; suite green; nothing that belongs to the feature tier re-asserted here." \
  --metadata "$FEAT_META")

FE=$(bd create "Import page — file picker, parsed preview, confirm" -t task -l frontend-ui --silent --parent "$FEAT" \
  -d "The /import page: FileDrop (drag or pick a .csv), PreviewTable (parsed rows, duplicates flagged, rejected lines listed), ConfirmBar (count summary + confirm). Empty, loading, error, and partial-rejection states all exist. Talks to POST /api/import only — no parsing logic in components. Built after the parser and its tests landed, so the page is built against a function that already holds." \
  --acceptance "Page renders all four states (empty/loading/preview-with-rejections/error). Confirm sends the preview payload and routes to /shelf on success. No parser logic lives in components." \
  --metadata "$FEAT_META")

FT=$(bd create "Feature tests: the import flow wired — upload → preview → confirm → shelf" -t task -l feature-test --silent --parent "$FEAT" \
  -d "One feature's pieces proved WIRED on the feature branch, where every task of this feature has landed as a commit: real CSV fixture through the real endpoint into the real store, then the page against it. Successes and failures of THIS feature surface here: happy path, duplicate-flagged file, all-rejected file, and the shelf's state after confirm (tags landed, duplicates not doubled)." \
  --acceptance "Flow proven end to end for one success and one failure per surface; nothing re-asserts a unit-tier case; runs against the real stack, no mocked parser." \
  --metadata "$FEAT_META")

FREV=$(bd create "Review: import feature — trace the change, run the suites, certify" -t task -l feature-review --silent --parent "$FEAT" \
  -d "Trace every change this feature's commits made on its branch, instrument if needed, run the unit and feature suites, and certify the feature or name exactly what is broken. Certifying means the feature does what its gate's acceptance criteria demand — not that files merely exist." \
  --acceptance "Suites run and counted (not just exit codes); any test that had to change to pass is named as a defect, not fixed silently; certification or defect list lands on the ticket." \
  --metadata "$FEAT_META")

E2E=$(bd create "E2E tests: reading-log journeys across import, manual add, and search" -t task -l epic-e2e-test --silent --parent "$EPIC" \
  -d "Journeys that CROSS features on the real stack: import a CSV then search within what landed; add by hand then import over the top (duplicates flag against hand-added rows); search a tag that only exists in the CSV's bookshelves column. One success and one failure path per feature, plus cross-feature state." \
  --acceptance "Journeys run on the real stack against the merged features; cross-feature state proven both directions; one success + one failure per feature at minimum." \
  --metadata "$EPIC_META")

EREV=$(bd create "Review: the whole epic — certify the epic branch" -t task -l epic-review --silent --parent "$EPIC" \
  -d "Trace the epic branch — every feature branch the merge ticket assembled onto it — top to bottom, run the e2e journeys, and certify the epic or name what is broken. A feature certified alone is NOT proof the features fit together — that is what this ticket exists to find." \
  --acceptance "E2E suite run with counts; any cross-feature break named with the two tickets at the seam; certification or defect list lands on the ticket." \
  --metadata "$EPIC_META")

EMERGE=$(bd create "Merge: assemble the epic's feature branches onto the epic branch" -t task -l epic-merge-pr --silent --parent "$EPIC" \
  -d "Take every feature branch this epic produced — each one already proved by its own suite and review — and assemble them onto the epic branch, resolving what collides between them, then run the e2e suite and report. No code, no tests, no merge into main, no PR." \
  --acceptance "Ledger complete for every feature branch; suites run with counts; unresolved conflicts named in a ticket note." \
  --metadata "$EPIC_META")

# ---- DEPS: R3 chains + R1 bottom-up + R2 tier stall --------------------------------
# R3 within the feature: ONE linked chain. Each task waits on its predecessor, so the frontier
# hands out one task per feature and only one pair of hands is ever on the feature branch. The
# last task unblocks feature-test; the review certifies after the suite.
bd dep add "$UT1" "$BE" >/dev/null
bd dep add "$FE" "$UT1" >/dev/null
bd dep add "$FT" "$FE" >/dev/null
bd dep add "$FREV" "$FT" >/dev/null
# R2 tier stall: the whole epic tier waits on the FEATURE GATE itself (open until a
# human closes it).
bd dep add "$E2E" "$FEAT" >/dev/null; bd dep add "$EREV" "$FEAT" >/dev/null; bd dep add "$EMERGE" "$FEAT" >/dev/null
# R3 within the epic: merge first, then e2e, then review.
bd dep add "$E2E" "$EMERGE" >/dev/null
bd dep add "$EREV" "$E2E" >/dev/null
# R1 (corrected): bd REFUSES a blocked-by edge from a parent to its own descendant
# (block cascades DOWN to descendants — bottom-up edges are unrepresentable). So the
# bottom-up rule can only be expressed as CROSS-BRANCH edges, and the gate-stall
# above (epic tier blocked-by the feature gate) is exactly such an edge.
# PROBE P3: can a human close a gate while its children are still open? (tests
# whether "children block the parent" holds natively, or needs a human-side rule.)
echo "P3 probe — closing the EPIC gate while its child tickets are still open:"
bd close "$EPIC" --reason "probe: closing a gate with open children" 2>&1 | head -2 | tee -a "$LOG" || true
bd reopen "$EPIC" >/dev/null 2>&1 || true   # put it back open for the walk
echo "P3 result above; walk begins." | tee -a "$LOG"

echo "tower-walk v2: tower built — $(bd list --json 2>/dev/null | jq 'length' 2>/dev/null || echo '?') tickets (2 gates + 8 tasks + 2 junk probes)"
echo "tower-walk v2: metadata round trip on the first task and both gates:"
bd show --json "$EPIC" "$FEAT" "$BE" 2>/dev/null | jq -c '.[] | {id, metadata}' | tee -a "$LOG"
echo "tower-walk v2: frontier before walking:"; bd ready --json | jq -c '.[] | {id, title}' | tee -a "$LOG"

# ---- WALK: bare claim (NO exclusions), auto-close, climb ----------------------------
# the dispatcher's own two reads: the top of the parent chain, and the `branch` written there
fieldOf() { bd show --json "$1" 2>/dev/null | jq -r --arg k "$2" 'if type == "array" then .[0] else . end | if $k == "parent" then (.parent // empty) else ((.metadata // {})[$k] // empty) end'; }
topOf() { local id="$1" hop=0 parentId; [[ -n "$id" ]] || { echo ""; return 0; }
    while (( hop++ < 4 )); do parentId="$(fieldOf "$id" parent)"; [[ -n "$parentId" ]] || { echo "$id"; return 0; }; id="$parentId"; done
    echo ""; }
branchOf() { local b; b="$(fieldOf "$1" branch)"; echo "${b:--}"; }

walk() { # walk <phase> <max-ticks> — claim+close until frontier empty
    local phase="$1" max="$2" n=0 row ID TYPE LABELS BRANCH PARENT BASE
    while (( n < max )); do
        row="$(bd ready --claim --json)"
        [[ -z "$row" || "$row" == "[]" ]] && { echo "[$phase] frontier empty after $n claims"; return 0; }
        ID="$(jq -r '.[0].id' <<< "$row")"; TYPE="$(jq -r '.[0].issue_type' <<< "$row")"; LABELS="$(jq -r '.[0].labels // [] | join(",")' <<< "$row")"
        BRANCH="$(jq -r '.[0].metadata.branch // "-"' <<< "$row")"
        PARENT="$(jq -r '.[0].parent // empty' <<< "$row")"; TOP="$(topOf "$PARENT")"
        if [[ -z "$TOP" ]]; then BASE="-"; elif [[ "$TOP" == "$PARENT" ]]; then BASE=main; else BASE="$(branchOf "$TOP")"; fi
        echo "[$phase tick $n] claimed $ID (type=$TYPE labels=$LABELS branch=$BRANCH parent=$PARENT base=$BASE)" | tee -a "$LOG"
        bd close "$ID" --reason "experiment: flow probe only, no work performed" >>"$LOG"
        n=$((n+1))
    done
    return 1
}

echo "=== PHASE A — feature tier drains, tower should STALL at the open feature gate ===" | tee -a "$LOG"
walk A 40 || true
echo "--- stalled? open/blocked tickets left behind the feature gate:"
bd list --json --status open,blocked --include-gates 2>/dev/null | jq -r '.[] | "\(.id) [\(.status)] \(.issue_type): \(.title)"' | tee -a "$LOG"
echo "--- why they're stuck (dep edges onto the feature gate):"
bd dep list "$E2E" --json 2>/dev/null | jq -c '.[] | {blocker: .id, type: .dependency_type, status: .status}' | tee -a "$LOG"

echo "=== PHASE B — the human verifies and closes the feature gate (simulated) ===" | tee -a "$LOG"
bd close "$FEAT" --reason "human simulation: feature verified, gate closed" 2>&1 | tee -a "$LOG"
walk B 40 || true

echo "=== FINAL STATE (all statuses, gates included) ==="
bd list --json --status open,in_progress,blocked,closed --include-gates 2>/dev/null | jq -r '.[] | "\(.id) [\(.status)] \(.issue_type): \(.title)"' | tee -a "$LOG"
echo "tower-walk v2: complete. Full log: $LOG"
