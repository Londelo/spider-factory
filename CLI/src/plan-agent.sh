#!/usr/bin/env bash
# plan-agent.sh — runs one of the three plan agents, in the foreground, through SF_AGENT_COMMAND.
#   plan-agent.sh epic [prompt] | plan-agent.sh feature [prompt] | plan-agent.sh task [prompt]
#   SF_AGENT_COMMAND (claude) the command that runs an agent — it may live in CLI/spider-factory.env
#   sf plan:epic / plan:feature / plan:task are this file; the contract is .claude/CLAUDE.md §Plan agents.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/user-env.sh"
loadSpiderFactoryEnv

agentCommand="${SF_AGENT_COMMAND:-claude}"
agentPluginName="${SF_AGENT_PLUGIN:-spider-factory}"

declare -A planAgentOf=(
    [epic]=plan-epic
    [feature]=plan-feature
    [task]=plan-task
)

usage() {
    cat <<'USAGE'
plan-agent — run one plan agent

  plan-agent.sh epic     [prompt]   the epic planner, from a vague idea
  plan-agent.sh feature  [prompt]   the feature planner, for one epic
  plan-agent.sh task     [prompt]   the task planner, for one feature

Foreground, and the planner talks back to you: it asks what it needs before it
writes anything. Anything after the kind is handed to it as the prompt.

SF_AGENT_COMMAND (claude) — the command that runs an agent; it is split on spaces,
so it may carry its own arguments. Set it in CLI/spider-factory.env, or export it for one run.

Run it from inside a tower project (one with a beads DB).
USAGE
}

requireBeadsProject() {
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1 || {
        echo "plan-agent: no beads DB found from $PWD — cd into a tower project and re-run." >&2
        exit 1
    }
}

requireAgentCommand() {
    local commandWord="${agentCommand%% *}"
    command -v "$commandWord" >/dev/null 2>&1 || {
        echo "plan-agent: the agent command '$commandWord' is not on PATH — fix SF_AGENT_COMMAND, or leave it unset to get 'claude'." >&2
        exit 1
    }
}

runPlanAgent() {
    local agentName="$1"
    shift
    requireBeadsProject
    requireAgentCommand
    echo "plan-agent: running the $agentName planner through '$agentCommand' in $PWD" >&2
    exec $agentCommand --agent "$agentPluginName:$agentName" "$@"
}

unknownPlanKind() {
    echo "plan-agent: unknown plan '$1' — there are three: 'epic', 'feature', 'task'. Try 'plan-agent.sh --help'." >&2
    exit 1
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
