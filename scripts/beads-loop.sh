#!/usr/bin/env bash
# beads-loop.sh — the claim-beads dispatcher. Contract: ../claim-beads-loop.md
#
# Claim a ticket, look up its agent by stamp, spawn a background Claude session
# in its own worktree, log it, move on. Endless until you stop it.
#
#   ./beads-loop.sh                     BO_MAX_TICKS=40 ./beads-loop.sh   (test seam)
#
# Env: BO_MAX_PARALLEL (4)              workers spawned at once
#      BO_POLL_S (3)                    seconds between polls; must divide 60
#      BO_MAX_TICKS (0)                 stop after N ticks — test seam only, 0 = endless
#      BO_LOG_ROOT (~/.binary-obelisk/logs)  one timestamped dir per run
#      BO_ALLOWED_STAMPS                comma list narrowing the stamp set, or *
#                     valid stamps (the AGENT keys below, verbatim): backend-logic, frontend-ui,
#                     unit-tests, feature-test, epic-e2e-test, feature-lead-review, epic-lead-review.
#                     A name the map doesn't hold is not a stamp — it matches nothing and only
#                     starves the frontier. The three test tiers are unit-tests / feature-test /
#                     epic-e2e-test: micro, composition, broad. See .claude/binary-obelisk-v1-design.yaml.
set -uo pipefail

MAX_PARALLEL="${BO_MAX_PARALLEL:-4}"
POLL_S="${BO_POLL_S:-3}"
MAX_TICKS="${BO_MAX_TICKS:-0}"
LOG_ROOT="${BO_LOG_ROOT:-$HOME/.binary-obelisk/logs}"

# stamp -> agent. The keys ARE the closed stamp set: a ticket may carry any number of
# labels, and whichever ones land in this map are what name its agent.
# The merge stamps are absent on purpose — they are excluded at the claim too.
# The three test tiers are three different agents: micro / feature / end-to-end. Each tier owns a
# depth of coverage and must not overstep into the next one's — see the agent files. The test
# stamps are the tier's single name — the same string the design YAML calls its category, and the
# agent key is that string plus "-er". Named for the test, never the tester, never the framework.
declare -A AGENT=(
    [backend-logic]=engineer
    [frontend-ui]=frontend
    [unit-tests]=unit-tester
    [feature-test]=feature-tester
    [epic-e2e-test]=e2e-tester
    [feature-lead-review]=lead-review
    [epic-lead-review]=lead-review
)

# BO_ALLOWED_STAMPS narrows the set; "*" is the whole set. Either way a label is a
# stamp only if this map names an agent for it — the map is the only source of
# specialists, so no stamp can ever invent one.
ALLOW_ANY=0
declare -a ALLOW=()
if [[ -n "${BO_ALLOWED_STAMPS:-}" ]]; then
    [[ "$BO_ALLOWED_STAMPS" == "*" ]] && ALLOW_ANY=1 || IFS=',' read -ra ALLOW <<< "$BO_ALLOWED_STAMPS"
fi

is_stamp() {
    [[ -n "${AGENT["$1"]+set}" ]] || return 1
    (( ALLOW_ANY )) || [[ " ${ALLOW[*]-} " == *" $1 "* ]]
}

EXCLUDE_TYPES="gate"                   # gates are checkpoints, not work
EXCLUDE_LABELS="feature-merge-pr,epic-merge-pr"   # the loop never merges

# ---- preflight: the only place this loop exits non-zero -------------------------
for tool in bd jq claude; do
    command -v "$tool" >/dev/null 2>&1 || { echo "beads-loop: $tool not found on PATH" >&2; exit 1; }
done

for v in MAX_PARALLEL POLL_S MAX_TICKS; do
    [[ "${!v}" =~ ^[0-9]+$ ]] || { echo "beads-loop: BO_$v=${!v} is not a number" >&2; exit 1; }
done
# the idle rate limit divides by POLL_S, so a non-divisor of 60 is a bug, not a preference
(( POLL_S > 0 && 60 % POLL_S == 0 )) || {
    echo "beads-loop: BO_POLL_S=$POLL_S is unusable — it must divide 60 (1 2 3 4 5 6 10 12 15 20 30 60)" >&2
    exit 1
}

# bd finds its database by walking UP from the current directory, so this is a
# real probe of "can we do anything here" — not a check for a .beads folder.
bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1 || {
    echo "beads-loop: no beads database found from $PWD — cd into the tower project and re-run" >&2
    exit 1
}

# ---- logs: one timestamped dir per run, TAB-separated, tee'd so a failure can
#      never be silent. Fields are stable: the future viewer is a parser, not a redesign.
LOG_DIR="$LOG_ROOT/$(date +%F_%H-%M-%S)"
mkdir -p "$LOG_DIR" 2>/dev/null || { echo "beads-loop: cannot create $LOG_DIR" >&2; exit 1; }
for f in claims errors waiting results; do : > "$LOG_DIR/$f"; done

log() { printf '%-8s %s\t%s\n' "$2" "$(date +%FT%T)" "${*:3}" | tee -a "$LOG_DIR/$1"; }           # log <file> <EVENT> <fields>
last_line() { tail -1 "$1" 2>/dev/null; }                                                          # the msg= of a captured failure
busy_count() {                                                                                    # workers working right now
    claude agents --json --cwd "$PWD" 2>"$LOG_DIR/claude-stderr" \
        | jq '[ .[] | select(.kind == "background") ] | length' 2>/dev/null
}
inprog_count() {                                                                                  # beads-side evidence of live work
    bd list --status in_progress --limit 50 --json 2>/dev/null | jq 'length' 2>/dev/null
}
peek_next() { # the one sanctioned bare `bd ready`: a non-binding peek to name next=, never a claim
    local out
    out="$(bd ready --json --exclude-type "$EXCLUDE_TYPES" 2>/dev/null | jq -r '.[0].id // empty' 2>/dev/null)"
    echo "${out:-(none)}"
}

# Waiting lines are capped at one a minute PER REASON — a quiet tower must not bury the
# errors file under 20 000 identical lines. Errors are never capped.
WINDOW=$(( 60 / POLL_S ))
declare -A LAST_WAIT=()
waiting() { # waiting <reason> [extra fields] — working=/next= are read live, at log time
    local reason="$1" extra="${2-}" window="$WINDOW"
    local last="${LAST_WAIT["$reason"]:-$((-window))}"
    (( TICKS - last < window )) && return 0
    LAST_WAIT["$reason"]=$TICKS
    log waiting WAITING "reason=$reason working=$(busy_count) next=$(peek_next)${extra:+ $extra}"
}

worker_prompt() { # the ticket IS the brief — the worker reads it from beads, nothing is transcribed
    printf '%s' "Your ticket: $1.
FIRST: bd show --json $1 — the description, design notes, and acceptance criteria in that output are your complete brief; read them IN FULL before touching code.

Rules:
1. Keep your claim lease alive — the 5-minute lease must NEVER lapse. Run
   bd heartbeat $1
   between long steps; a lapsed lease means another dispatcher can seize your ticket mid-work.
2. When your own tests pass, close the ticket yourself:
   bd close $1 --reason \"<what you did + the test evidence that proves it>\"
   Nobody will ask you for a report; the closed ticket IS your proof of work.
3. If the brief needs more work than you can finish: write a beads comment on $1
   describing exactly what remains (check bd comment --help). Never half-do and hide it.
4. Spawn nothing. Work nothing but $1. You and your ticket are one and the same."
}

CLAIMED=0
TICKS=0
trap 'log results RESULT "ticks=$TICKS claimed=$CLAIMED"; printf "\nbeads-loop: stopped. claimed=%d  log: %s\n" "$CLAIMED" "$LOG_DIR"; exit 0' INT TERM

echo "beads-loop: logging to $LOG_DIR  (Ctrl-C to stop)"

# ---- one tick: claim, stamp-check, spawn, log. Returns early on every idle path;
#      the sleep lives in the loop, and so does the only thing that ends it.
tick() {
    local busy inprog row rc ticket labels l agent matched=()

    # Full? At capacity with work running is healthy; at capacity with nothing in
    # progress means the slots are ghosts — a broken tower must never read as a calm one.
    busy="$(busy_count)"; busy="${busy//[!0-9]/}"; busy="${busy:-0}"
    if (( busy >= MAX_PARALLEL )); then
        inprog="$(inprog_count)"; inprog="${inprog//[!0-9]/}"
        if [[ -z "$inprog" || "$inprog" == "0" ]]; then
            waiting max_parallel_stalled "in_progress=0"   # the alarm
        else
            waiting max_parallel "in_progress=$inprog"
        fi
        return
    fi

    # one ticket per tick, claimed atomically (assignee + in_progress + 5-min lease)
    row="$(bd ready --claim --json --exclude-type "$EXCLUDE_TYPES" --exclude-label "$EXCLUDE_LABELS" 2>"$LOG_DIR/bd-stderr")"
    rc=$?
    if (( rc != 0 )); then
        log errors ERROR "reason=bd-failure exit=$rc msg=\"$(last_line "$LOG_DIR/bd-stderr")\""
        return
    fi

    # nothing ready is NORMAL (open gates hold tasks back); capped at one line a minute
    if [[ -z "$row" || "$row" == "[]" ]]; then
        waiting frontier_empty
        return
    fi

    ticket="$(jq -r '.[0].id // empty' <<< "$row" 2>/dev/null)"
    if [[ -z "$ticket" ]]; then
        log errors ERROR "reason=bd-failure exit=0 msg=\"claim returned no id: $(tr -d '\n' <<< "$row" | head -c 60)\""
        return
    fi
    mapfile -t labels < <(jq -r '.[0].labels // [] | .[]' <<< "$row" 2>/dev/null)

    # A ticket may carry any number of labels — stamp, tags, whatever a human added — and
    # all but the stamp-shaped ones are none of our business. Only labels this map names an
    # agent for count: zero of those = nothing to dispatch, two = two candidate agents, and
    # picking one is exactly the guess the contract forbids. Both are the tower's bug, not
    # ours, and the claim is LEFT in place: its lease holds the broken ticket off the
    # frontier, so the error keeps repeating until a human fixes the tower.
    for l in "${labels[@]}"; do
        is_stamp "$l" && [[ " ${matched[*]-} " != *" $l "* ]] && matched+=("$l")
    done
    if (( ${#matched[@]} != 1 )); then
        log errors ERROR "ticket=$ticket reason=stamp-ambiguous matched=\"${matched[*]-}\" labels=\"${labels[*]-}\""
        return
    fi
    agent="${AGENT["${matched[0]}"]}"

    # Claude makes the worktree itself (-w names it after the ticket, so it is never shared);
    # the path below is its conventional location, logged so the two halves name each other.
    if ! claude --bg -w "$ticket" --agent "$agent" --permission-mode bypassPermissions \
            "$(worker_prompt "$ticket")" >"$LOG_DIR/last-spawn" 2>&1; then
        log errors ERROR "ticket=$ticket agent=$agent reason=worker-not-dispatched msg=\"$(last_line "$LOG_DIR/last-spawn")\""
        bd unclaim "$ticket" >/dev/null 2>&1 || true   # release it, so it drifts back instead of burning in place
        return
    fi

    CLAIMED=$((CLAIMED + 1))
    log claims CLAIMED "ticket=$ticket stamp=${matched[0]} agent=$agent worktree=\"$PWD/.claude/worktrees/$ticket\""
}

while true; do
    if (( MAX_TICKS > 0 && TICKS >= MAX_TICKS )); then
        log results RESULT "ticks=$TICKS claimed=$CLAIMED note=\"hit BO_MAX_TICKS: this run was configured to end, the tower did not run out of work\""
        break
    fi
    TICKS=$((TICKS + 1))
    tick
    sleep "$POLL_S"
done
