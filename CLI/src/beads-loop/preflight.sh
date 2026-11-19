#!/usr/bin/env bash
# preflight.sh — the checks that end the run before a single tick, sourced by beads-loop/index.sh.
#   Each one dies with what to do about it; the order they run in is the bootstrap in index.sh.

requireToolsOnPath() {
    local requiredTool
    for requiredTool in bd jq git "${agentCommand%% *}"; do
        command -v "$requiredTool" >/dev/null 2>&1 || reportToolNotOnPath "$requiredTool"
    done
}

requireNumericSettingsFromEnvironment() {
    local settingName
    for settingName in maximumParallelWorkers pollSeconds maximumTicketsDone; do
        [[ "${!settingName}" =~ ^[0-9]+$ ]] || {
            die "${numericSettingEnvName[$settingName]}=${!settingName} is not a number"
        }
    done
}

requireGateFlagsAreSwitches() {
    local flagName flagValue
    for flagName in SF_AGENT_FEATURE_GATES SF_AGENT_EPIC_GATES; do
        flagValue="${!flagName}"
        [[ "$flagValue" == "0" || "$flagValue" == "1" ]] || {
            die "$flagName=$flagValue is not a switch — it is either 0 (a human closes that gate) or 1 (the lead agent does)"
        }
    done
}

requireUsablePollInterval() {
    (( pollSeconds > 0 && 60 % pollSeconds == 0 )) || {
        die "SF_POLL_S=$pollSeconds is unusable — it must divide 60 (1 2 3 4 5 6 10 12 15 20 30 60)"
    }
}

runningInABeadsProject() {
    bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"' >/dev/null 2>&1
}

requireBeadsProject() {
    runningInABeadsProject || reportNoBeadsDatabase
}

gateTierIsSwitchedOn() {
    case "$1" in
        feature) [[ "$agentHandlesFeatureGates" == "1" ]] ;;
        epic)    [[ "$agentHandlesEpicGates" == "1" ]] ;;
        *) return 1 ;;
    esac
}
