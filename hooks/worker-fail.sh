#!/usr/bin/env bash
# worker-fail.sh — the StopFailure hook: a dispatched worker's session died on an API error.
#
#   park the ticket in failed-agent → write what killed the session onto the ticket → raise the alarm
#
# A dead worker stops heartbeating, its lease lapses, and `bd reclaim` would silently sweep the
# ticket back to `open` for another attempt. This hook takes it out of that path on purpose: the
# ticket lands somewhere a human will see it, with the reason attached, and stays until they say
# otherwise. Nothing here decides whether the work was any good.
#
# Every step below is attempted, never forced. Any one of them failing leaves the ticket exactly
# where it was and logs why — a half-failed park is somebody else's problem, not this hook's.
#
# The failure text is not polled, parsed out of a log, or asked of the model. The harness fires
# this hook itself when a request dies and hands the reason on stdin: `.error` is its own coarse
# label for the kind of death (often just "unknown"), `.last_assistant_message` is the last thing
# the session produced, which is where the real text is — for local inference, typically an
# "API Error:" line from the proxy or the backend dropping the connection mid-turn.
#
# Registered in hooks/hooks.json, so it fires in EVERY session of EVERY project the plugin is
# enabled in. BO_TICKET is what tells a dispatcher's worker apart from everything else — a session
# the loop did not spawn leaves on the first line.
#
# Env the dispatcher sets on the spawn line:
#   BO_TICKET       the ticket this session owns
#   BO_PROJECT_DIR  the tower root, where .beads lives. The worktree is NOT the tower.
#   BO_LOG_DIR      this run's log dir; alarms land in $BO_LOG_DIR/errors
#   BO_AGENT        the specialist the loop dispatched, so an alarm names who died
#   BO_LABEL        the dispatching label that chose that specialist
#
# Every line goes through CLI/loop-log.sh and carries the run's identity field set — run, repo,
# ticket, label, agent, branch, target, session, worktree — which is what ties a death in failures
# to the claims line that spawned it and any errors the Stop hook wrote for the same session.
set -uo pipefail

[[ -n "${BO_TICKET:-}" ]] || exit 0

ticket="$BO_TICKET"
towerDir="${BO_PROJECT_DIR:-$PWD}"
logDir="${BO_LOG_DIR:-$HOME/.binary-obelisk/logs}"
mkdir -p "$logDir" 2>/dev/null || true

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BO_LOG_QUIET=1
source "$here/../CLI/loop-log.sh"
boSeedIdentity "$logDir" "$towerDir"
boIdent ticket "$ticket"
boIdent agent "${BO_AGENT:-}"
boIdent label "${BO_LABEL:-}"
boIdent branch "${BO_BRANCH:-}"
boIdent target "${BO_PR_TARGET:-}"

oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-200; }

hookInput="$(cat)"
sessionId="$(jq -r '.session_id // empty' <<<"$hookInput" 2>/dev/null)"
boIdent session "$sessionId"
boIdent worktree "$(jq -r '.cwd // empty' <<<"$hookInput" 2>/dev/null)"
failureKind="$(jq -r '.error // "unknown"' <<<"$hookInput" 2>/dev/null)"
lastMessage="$(jq -r '.last_assistant_message // empty' <<<"$hookInput" 2>/dev/null)"

# Only a ticket this session was actually working can be failed by it. Anything already parked or
# already shipped is somebody else's business; a ticket that isn't there at all is the alarm.
ticketState="$(bd -C "$towerDir" show --json "$ticket" 2>/dev/null \
    | jq -r 'if type == "array" then .[0] else . end | .status // empty' 2>/dev/null)"
if [[ -z "$ticketState" ]]; then
    logTo errors "reason=ticket-not-found"
    exit 0
fi
if [[ "$ticketState" != "in_progress" ]]; then
    exit 0
fi

# the reason goes on first — a ticket parked in failure with nothing said about why is worse than one left in_progress
if ! bd -C "$towerDir" update "$ticket" --append-notes "Worker session $(oneLine <<<"$sessionId") failed: $failureKind
Last message: $(oneLine <<<"$lastMessage")" >/dev/null 2>&1; then
    logTo errors "reason=ticket-not-annotated kind=$failureKind"
    exit 0
fi

if ! bd -C "$towerDir" update "$ticket" --status failed-agent >/dev/null 2>&1; then
    logTo errors "reason=status-not-set kind=$failureKind from=$ticketState"
    exit 0
fi

logTo failures "from=$ticketState kind=$failureKind msg=\"$(oneLine <<<"$lastMessage")\""
exit 0
