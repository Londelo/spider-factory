#!/usr/bin/env bash
# overseer-agent.sh — runs the overseer agent, in the foreground, through SF_AGENT_COMMAND.
#   overseer-agent.sh [prompt]
#   SF_AGENT_COMMAND (claude) the command that runs an agent — it may live in CLI/spider-factory.env
#   sf overseer is this file; the contract is agents/overseer.md.
#   The watcher is denied 'sf' outright — --disallowedTools Bash(sf:*), which stops sf commit, sf loop and
#   sf plan:* while leaving bd, git and every other read alone. Verified: bd and git still run under it.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/../utils/console.sh"
source "$here/user-env.sh"
loadSpiderFactoryEnv
nameTheSpeaker overseer

agentCommand="${SF_AGENT_COMMAND:-claude}"
agentPluginName="${SF_AGENT_PLUGIN:-spider-factory}"

usage() {
    cat <<'USAGE'
overseer — read a tower and report on it

  overseer-agent.sh [prompt]   the reader, foreground, talking back to you

Run it from inside the tower you want read. Anything after the command is handed to
it as the prompt:

  overseer-agent.sh is this tower making progress

It reads the beads database of this directory and the run logs under SF_LOG_ROOT,
and reports: is the loop alive, how far along the tower is, and whether anything is
wrong. It has no Write, Edit or Agent tools, and 'sf' is denied to it outright —
where the fix is a mutation it hands you the command to run.

SF_AGENT_COMMAND (claude) — the command that runs an agent; it is split on spaces,
so it may carry its own arguments. Set it in CLI/spider-factory.env, or export it for one run.

Run it from inside a tower project (one with a beads DB).
USAGE
}

requireBeadsProject() {
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1 || reportNoBeadsDatabase
}

requireAgentCommand() {
    local commandWord="${agentCommand%% *}"
    command -v "$commandWord" >/dev/null 2>&1 || reportAgentCommandNotOnPath "$commandWord"
}

runOverseer() {
    requireBeadsProject
    requireAgentCommand
    tell "reading $PWD through '$agentCommand'"
    exec $agentCommand --agent "$agentPluginName:overseer" --disallowedTools 'Bash(sf:*)' "$@"
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
