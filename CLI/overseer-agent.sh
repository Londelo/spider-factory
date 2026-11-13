#!/usr/bin/env bash
# overseer-agent.sh — runs the overseer agent, in the foreground, through BO_AGENT_COMMAND.
#   overseer-agent.sh [prompt]
#   BO_AGENT_COMMAND (claude) the command that runs an agent — it may live in ~/.obelisk.env
#   bo overseer is this file; the contract is agents/overseer.md.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/user-env.sh"
loadObeliskEnv

agentCommand="${BO_AGENT_COMMAND:-claude}"

usage() {
    cat <<'USAGE'
overseer — watch a running bo loop from outside

  overseer-agent.sh [prompt]   the watcher, foreground, talking back to you

Anything after the command is handed to it as the prompt:

  overseer-agent.sh is the loop in this repo making progress

It reads the run's logs, the beads database and git, and reports: is the loop alive,
how far along the tower is, and whether anything is wrong. It has no Write, Edit or
Agent tools — where the fix is a mutation it hands you the command to run.

BO_AGENT_COMMAND (claude) — the command that runs an agent; it is split on spaces,
so it may carry its own arguments. Set it in ~/.obelisk.env, or export it for one run.

Run it from inside a tower project (one with a beads DB).
USAGE
}

requireBeadsProject() {
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1 || {
        echo "overseer: no beads DB found from $PWD — cd into a tower project and re-run." >&2
        exit 1
    }
}

requireAgentCommand() {
    local commandWord="${agentCommand%% *}"
    command -v "$commandWord" >/dev/null 2>&1 || {
        echo "overseer: the agent command '$commandWord' is not on PATH — fix BO_AGENT_COMMAND, or leave it unset to get 'claude'." >&2
        exit 1
    }
}

runOverseer() {
    requireBeadsProject
    requireAgentCommand
    echo "overseer: watching $PWD through '$agentCommand'" >&2
    exec $agentCommand --agent overseer "$@"
}

case "${1:-}" in
    -h|--help|help)
        usage
        exit 0
        ;;
    *)
        runOverseer "$@"
        ;;
esac
