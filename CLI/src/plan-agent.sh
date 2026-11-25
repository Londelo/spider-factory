#!/usr/bin/env bash
# plan-agent.sh — runs the epic planner, in the foreground, through SF_AGENT_COMMAND.
#   plan-agent.sh epic [prompt]
#   SF_AGENT_COMMAND (claude) the command that runs an agent — it may live in CLI/spider-factory.env
#   The feature and task planners are spawned by their parent agent, never from here.
#   sf plan:epic is this file; the contract is .claude/CLAUDE.md §Plan agents.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/../utils/console.sh"
source "$here/../utils/user-env.sh"
source "$here/../utils/spawn.sh"
loadSpiderFactoryEnv
nameTheSpeaker plan-agent

agentCommand="${SF_AGENT_COMMAND:-claude}"

declare -A planAgentOf=(
    [epic]=plan-epic
)

usage() {
    cat <<'USAGE'
plan-agent — run the epic planner

  plan-agent.sh epic [prompt]   the epic planner, from a vague idea

Foreground, and the planner talks back to you: it asks what it needs before it
writes anything. Anything after the kind is handed to it as the prompt. It then
spawns the feature planner itself, which spawns one task planner per feature.

SF_AGENT_COMMAND (claude) — the command that runs an agent; it is split on spaces,
so it may carry its own arguments. Set it in CLI/spider-factory.env, or export it for one run.

Run it from inside a tower project (one with a beads DB).
USAGE
}

requireAgentCommand() {
    local commandWord="${agentCommand%% *}"
    command -v "$commandWord" >/dev/null 2>&1 || reportAgentCommandNotOnPath "$commandWord"
}

runPlanAgent() {
    local agentName="$1"
    shift
    requireBeadsProject
    requireAgentCommand
    tell "running the $agentName planner through '$agentCommand' in $PWD"
    runForegroundAgent "$agentName" "$@"
}

unknownPlanKind() {
    die "unknown plan '$1' — there is one: 'epic'. The feature and task planners are spawned by their parent agent. Try 'plan-agent.sh --help'."
}

runRequestedPlan() {
    local requested="${1:-}"
    if [[ -n "$requested" && -n "${planAgentOf["$requested"]+set}" ]]; then
        runPlanAgent "${planAgentOf["$requested"]}" "${@:2}"
    fi
    case "$requested" in
        ""|-h|--help|help)
            usage
            exit 0
            ;;
        *)
            unknownPlanKind "$requested"
            ;;
    esac
}

runRequestedPlan "$@"
