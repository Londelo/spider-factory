#!/usr/bin/env bash
# spawn.sh — the one place a claude session gets started, and the one place an agent's existence is proved.
#   Sourced by beads-loop (the worker, and the lead it spawns for a gate) and by both foreground engines.
#   Every spawn names --agent, so every spawn needs the same two things: the agent file there before it, and
#   a session that came up as that agent after it. Both live here so no spawn site carries a check of its own.
#   The pre-flight is the only check that works everywhere — a foreground engine execs away its own process,
#   so there is no after it. The post-check belongs to --bg alone, which is the only form that leaves a
#   session record to read.
#   What it does NOT do: log. A run's log lines are writeLog's, in CLI/utils/logging.sh, and that file is
#   sourced by the engine and the Stop hook alone. This file reports through console.sh and returns; the
#   caller writes the line and decides whether a failure ends the run or just its own ticket.
#   The launcher's "no agent named" warning is a false alarm and is read by nothing here: it prints whenever
#   the launcher's cwd is not the factory root, because the launcher resolves --agent against $PWD alone while
#   the session resolves it against the added factory root too. A name that does not exist at all prints the
#   same words and then dies — so the words decide nothing, and the session's state is what separates them.

agentDefinitionPath() {
    printf '%s' "$spiderFactoryRoot/.claude/agents/$1.md"
}

reportAgentDefinitionMissing() {
    die "no agent named '$1' — expected it at $(agentDefinitionPath "$1"). Every spawn in this CLI names an agent file that must exist under $spiderFactoryRoot/.claude/agents/"
}

reportAgentDefinitionUnreadable() {
    die "the agent file for '$1' at $2 has no usable frontmatter — it must open with ---, close with ---, and carry a description: line"
}

requireAgentDefinition() {
    local agentName="$1" definitionFile
    definitionFile="$(agentDefinitionPath "$agentName")"
    [[ -f "$definitionFile" ]] || reportAgentDefinitionMissing "$agentName"
    awk 'NR == 1 && $0 != "---" { exit 2 }
         NR == 1 { next }
         /^---$/ { found = 1; exit }
         /^description:/ { described = 1 }
         END { if (!found || !described) exit 3 }' "$definitionFile" 2>/dev/null ||
        reportAgentDefinitionUnreadable "$agentName" "$definitionFile"
}

agentSessionState() {
    local sessionId listing
    listing="$(${SF_AGENT_COMMAND:-claude} agents --json --all 2>/dev/null)"
    [[ -n "$listing" ]] || return 0
    printf '%s' "$listing" |
        jq -r --arg id "$1" '[ .[]? | select((.id | tostring) == $id or (.sessionId | tostring) == $id) ] | .[0].state // empty' 2>/dev/null
}

agentSessionNamesAgent() {
    ${SF_AGENT_COMMAND:-claude} logs "$1" 2>&1 |
        sed 's/\x1b\[[0-9;?]*[a-zA-Z]//g' | tr -d '\033\007' |
        grep -o '@[0-9A-Za-z_-][0-9A-Za-z_-]*' |
        grep -Fx "@$2" >/dev/null 2>&1
}

agentLoadFailure=""

# Never dies: a session that never came up belongs to a ticket somebody already claimed, and the caller has
#   to hand it back before the run ends. It says why in $agentLoadFailure and leaves the ending to the caller.
#   Two proofs, both needed. The state alone lies: a session spawned with a name that resolves to nothing
#   comes up working and only dies seconds later, so working is provisional until it has held. The header
#   alone is the only thing that says which agent the session actually became — the launcher resolves
#   --agent against its own cwd and falls back to the default template without failing the launch, and
#   nothing in 'agents --json' carries the agent at all.
checkBackgroundAgentLoaded() {
    local agentName="$1" sessionId="$2" budget="${3:-30}" settle="${4:-5}"
    local waited=0 state aliveFor=0
    agentLoadFailure=""
    if [[ -z "$sessionId" ]]; then
        agentLoadFailure="no session id — the launcher claimed to background a session and named none"
        return 1
    fi
    while (( waited < budget )); do
        state="$(agentSessionState "$sessionId")"
        case "$state" in
            failed | stopped)
                agentLoadFailure="session $sessionId died with state=$state before it settled — the agent file exists, so the session refused to load it"
                return 1
                ;;
            working | blocked | done)
                aliveFor=$((aliveFor + 1))
                if (( aliveFor > settle )) && agentSessionNamesAgent "$sessionId" "$agentName"; then
                    return 0
                fi
                ;;
        esac
        sleep 1
        waited=$((waited + 1))
    done
    if [[ -n "$state" ]]; then
        agentLoadFailure="session $sessionId ran as state=$state for ${budget}s but never named @$agentName in its header — the launcher fell back to the default template"
    else
        agentLoadFailure="session $sessionId never appeared in 'agents --all' — the $agentName agent never started"
    fi
    return 1
}

spawnBackgroundAgent() {
    local agentName="$1" workingDir="$2" prompt="$3" spawnFile="$4" sessionName="$5"
    requireAgentDefinition "$agentName"
    ( cd "$workingDir" && $SF_AGENT_LAUNCH_COMMAND --bg --agent "$agentName" \
        -n "$sessionName" "$prompt" ) >"$spawnFile" 2>&1
}

runForegroundAgent() {
    local agentName="$1"
    shift
    requireAgentDefinition "$agentName"
    exec $SF_AGENT_LAUNCH_COMMAND --agent "$agentName" "$@"
}
