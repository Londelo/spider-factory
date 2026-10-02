#!/usr/bin/env bash
# beads-loop.sh — the claim-beads dispatcher. Contract: ../claim-beads-loop.md
#
# Claim a ticket, look up its agent by stamp, spawn a background Claude session
# in its own worktree, log it, move on. Endless until you stop it.
#
#   ./beads-loop.sh                     BO_MAX_TICKS=40 ./beads-loop.sh   (test seam)
#
# Env: BO_MAX_PARALLEL (4)  workers spawned at once
#      BO_POLL_S (3)        seconds between polls; must divide 60
#      BO_MAX_TICKS (0)     stop after N ticks — test seam only, 0 = endless
#      BO_LOG_ROOT (~/.binary-obelisk/logs)   one timestamped dir per run
#      BO_ALLOWED_STAMPS    comma list replacing the stamp set
set -uo pipefail

MAX_PARALLEL="${BO_MAX_PARALLEL:-4}"
POLL_S="${BO_POLL_S:-3}"
MAX_TICKS="${BO_MAX_TICKS:-0}"
LOG_ROOT="${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}"

# stamp -> agent. The keys ARE the closed stamp set; one label must match, exactly.
# The merge stamps are absent on purpose — they are excluded at the claim too.
typeset -A AGENT=(
    [backend-logic]=engineer
    [frontend-ui]=frontend
    [unit-tests]=jester
    [feature-playwright-tests]=playwrite
    [epic-e2e-tests]=playwrite
    [feature-lead-review]=lead-review
    [epic-lead-review]=lead-review
)
STAMPS=("${!AGENT[@]}")
EXCLUDE_TYPES="gate,molecule,event"
EXCLUDE_LABELS="feature-merge-pr,epic-merge-pr"

# ---- init: the only place this loop exits non-zero -----------------------------
for tool in bd jq claude; do
    command -v "$tool" >/dev/null 2>&1 || { echo "beads-loop: $tool not found on PATH" >&2; exit 1; }
done

# the idle rate limit divides by POLL_S, so a non-divisor of 60 is a bug, not a preference
if ! [[ "$POLL_S" =~ ^[0-9]+$ ]] || (( POLL_S == 0 || 60 % POLL_S != 0 )); then
    echo "beads-loop: BO_POLL_S=$POLL_S is unusable — it must divide 60 (1 2 3 4 5 6 10 12 15 20 30 60)" >&2
    exit 1
fi

[[ -n "${BO_ALLOWED_STAMPS:-}" ]] && IFS=',' read -ra STAMPS <<< "$BO_ALLOWED_STAMPS"

# bd finds its database by walking UP from the current directory, so this is a
# real probe of "can we do anything here" — not a check for a .beads folder.
db_probe="$(bd list --limit 1 --json 2>&1)" || true
case "$db_probe" in
    \[*) ;;
    *) echo "beads-loop: no beads database found from $PWD — cd into the tower project and re-run" >&2; exit 1 ;;
esac

LOG_DIR="$LOG_ROOT/$(date +%F_%H-%M-%S)"
mkdir -p "$LOG_DIR" 2>/dev/null || { echo "beads-loop: cannot create $LOG_DIR" >&2; exit 1; }
: > "$LOG_DIR/claims"; : > "$LOG_DIR/errors"; : > "$LOG_DIR/waiting"; : > "$LOG_DIR/results"

# log <file> <EVENT> <fields> — tee'd, so a failure can never be silent
log() { printf '%-8s %s\t%s\n' "$2" "$(date +%FT%T)" "${*:3}" | tee -a "$LOG_DIR/$1"; }

# Workers working right now: background sessions whose worktree is under this project,
# minus the ones that already finished. Counted fresh every tick, never cached.
busy_count() {
    claude agents --json 2>"$LOG_DIR/claude-stderr" | jq -r --arg p "$PWD/" '
        if type == "array" then
            [ .[] | select(.kind == "background")
                  | select((.state // "active") != "done")
                  | select((.cwd // "") | startswith($p)) ] | length
        else 0 end' 2>/dev/null
}

CLAIMED=0
TICKS=0
trap 'log results RESULT "ticks=$TICKS claimed=$CLAIMED"; printf "\nbeads-loop: stopped. claimed=%d  log: %s\n" "$CLAIMED" "$LOG_DIR"; exit 0' INT TERM

echo "beads-loop: logging to $LOG_DIR  (Ctrl-C to stop)"

# ---- the loop ------------------------------------------------------------------
while true; do
    if (( MAX_TICKS > 0 && TICKS >= MAX_TICKS )); then
        log results RESULT "ticks=$TICKS claimed=$CLAIMED note=\"hit BO_MAX_TICKS: this run was configured to end, the tower did not run out of work\""
        break
    fi
    TICKS=$((TICKS + 1))

    # full? at capacity with work running is healthy; at capacity with nothing in
    # progress means the slots are ghosts — it must never read as a calm tower.
    busy="$(busy_count)"; [[ "$busy" =~ ^[0-9]+$ ]] || busy=0
    if (( busy >= MAX_PARALLEL )); then
        if (( TICKS % (60 / POLL_S) == 0 )); then
            inprog="$(bd list --status in_progress --limit 50 --json 2>/dev/null | jq -r 'if type=="array" then length else 0 end' 2>/dev/null)"
            if [[ "${inprog:-0}" == "0" ]]; then
                log waiting WAITING "reason=max_parallel_stalled working=$busy in_progress=0"
            else
                log waiting WAITING "reason=max_parallel working=$busy in_progress=$inprog"
            fi
        fi
        sleep "$POLL_S"
        continue
    fi

    # one ticket per tick, claimed atomically (assignee + in_progress + 5-min lease)
    row="$(bd ready --claim --json --exclude-type "$EXCLUDE_TYPES" --exclude-label "$EXCLUDE_LABELS" 2>"$LOG_DIR/bd-stderr")"
    rc=$?
    if (( rc != 0 )); then
        log errors ERROR "reason=bd-failure exit=$rc msg=\"$(tail -1 "$LOG_DIR/bd-stderr")\""
        sleep "$POLL_S"
        continue
    fi

    # nothing ready is NORMAL (open gates hold tasks back); the line is capped at one a minute
    if [[ -z "$row" || "$row" == "[]" ]]; then
        if (( TICKS % (60 / POLL_S) == 0 )); then
            nxt="$(bd ready --json --exclude-type "$EXCLUDE_TYPES" 2>/dev/null | jq -r 'if type=="array" then (.[0].id // "(none)") else "(unknown)" end' 2>/dev/null)"
            log waiting WAITING "reason=frontier_empty next=$nxt"
        fi
        sleep "$POLL_S"
        continue
    fi

    ticket="$(jq -r 'if type=="array" then (.[0].id // "") else "" end' <<< "$row" 2>/dev/null)"
    mapfile -t labels < <(jq -r '.[0].labels // [] | .[]' <<< "$row" 2>/dev/null)
    if [[ -z "$ticket" ]]; then
        log errors ERROR "reason=bd-failure exit=0 msg=\"claim returned no id: $(tr -d '\n' <<< "$row" | head -c 60)\""
        sleep "$POLL_S"
        continue
    fi

    # exactly one stamp must match. Zero or two = the tower was built wrong, and the
    # loop never guesses a specialist. The claim is LEFT in place: its lease holds the
    # broken ticket off the frontier, it drifts back when the lease lapses, error repeats.
    matched=()
    for l in "${labels[@]}"; do
        for s in "${STAMPS[@]}"; do
            [[ "$l" == "$s" ]] && matched+=("$l")
        done
    done
    if (( ${#matched[@]} != 1 )); then
        log errors ERROR "ticket=$ticket reason=stamp-ambiguous labels=\"${labels[*]}\""
        sleep "$POLL_S"
        continue
    fi
    agent="${AGENT[${matched[0]}]}"

    # the ticket IS the brief — the worker reads it from beads, nothing is transcribed
    prompt="Your ticket: $ticket.
FIRST: bd show --json $ticket — the description, design notes, and acceptance criteria in that output are your complete brief; read them IN FULL before touching code.

Rules:
1. Keep your claim lease alive — the 5-minute lease must NEVER lapse. Run
   bd heartbeat $ticket
   between long steps; a lapsed lease means another dispatcher can seize your ticket mid-work.
2. When your own tests pass, close the ticket yourself:
   bd close $ticket --reason \"<what you did + the test evidence that proves it>\"
   Nobody will ask you for a report; the closed ticket IS your proof of work.
3. If the brief needs more work than you can finish: write a beads comment on $ticket
   describing exactly what remains (check bd comment --help). Never half-do and hide it.
4. Spawn nothing. Work nothing but $ticket. You and your ticket are one and the same."

    # Claude makes the worktree itself (-w names it after the ticket, so it is never shared)
    if ! claude --bg -w "$ticket" --agent "$agent" \
            --permission-mode bypassPermissions "$prompt" >"$LOG_DIR/last-spawn" 2>&1; then
        log errors ERROR "ticket=$ticket agent=$agent reason=worker-not-dispatched msg=\"$(tail -1 "$LOG_DIR/last-spawn")\""
        bd unclaim "$ticket" >/dev/null 2>&1 || true
        sleep "$POLL_S"
        continue
    fi

    CLAIMED=$((CLAIMED + 1))
    log claims CLAIMED "ticket=$ticket stamp=${matched[0]} agent=$agent worktree=\"$PWD/.claude/worktrees/$ticket\""
    sleep "$POLL_S"
done
