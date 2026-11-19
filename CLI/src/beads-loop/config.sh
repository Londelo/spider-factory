#!/usr/bin/env bash
# config.sh — the knobs, and everything derived off them, sourced by beads-loop/index.sh.
#   The knobs are declared in index.sh and arrive through CLI/spider-factory.env (CLI/src/user-env.sh).

configureFromEnvironment() {
    maximumParallelWorkers="${SF_MAX_PARALLEL:-4}"
    pollSeconds="${SF_POLL_S:-3}"
    maximumTicketsDone="${SF_MAX_TICKETS:-0}"
    logRoot="${SF_LOG_ROOT:-$HOME/.spider-factory/logs}"
    agentCommand="${SF_AGENT_COMMAND:-claude}"
    agentHandlesFeatureGates="${SF_AGENT_FEATURE_GATES:-0}"
    agentHandlesEpicGates="${SF_AGENT_EPIC_GATES:-0}"
}

configureAllowedLabels() {
    local labelKey
    local -a configuredLabels=()
    if [[ -z "${SF_ALLOWED_LABELS:-}" || "${SF_ALLOWED_LABELS:-}" == "*" ]]; then
        for labelKey in "${!AGENT[@]}"; do
            allowedLabel["$labelKey"]=1
        done
        return
    fi
    IFS=',' read -ra configuredLabels <<< "$SF_ALLOWED_LABELS"
    for labelKey in "${configuredLabels[@]}"; do
        allowedLabel["$labelKey"]=1
    done
}

isLabel() {
    [[ -n "${AGENT["$1"]+set}" ]] && [[ -n "${allowedLabel["$1"]+set}" ]]
}

configureWaitingLineCadence() {
    waitingLineCadence=$(( 60 / pollSeconds ))
}

resolveTowerPaths() {
    towerDir="$PWD"
    worktreesRoot="$towerDir/.claude/worktrees"
}

createRunLogDirectory() {
    local logFileName
    logDir="$logRoot/$(date +%F_%H-%M-%S)"
    mkdir -p "$logDir" 2>/dev/null || die "cannot create $logDir"
    for logFileName in claims errors waiting results closes failures; do : > "$logDir/$logFileName"; done
}
