#!/usr/bin/env bash
# beads-loop — the claim-beads dispatcher: each tick claims one ready ticket and spawns its worker.
#   sf loop   (or ./beads-loop/index.sh) from inside the tower project; Ctrl-C stops dispatching.
#   This file is the whole run: the knobs, the order the pieces are sourced in, the tick, and the loop.
#   What each piece owns is one file beside it here; the contract of the engine is still this file's to keep.
#   SF_MAX_PARALLEL (4) workers at once | SF_POLL_S (3) seconds per tick, must divide 60 | SF_MAX_TICKETS (0 = never ends)
#   SF_MAX_TICKETS counts tickets the Stop hook closed this run, not ticks — the loop keeps ticking while it waits
#   SF_LOG_ROOT (~/.spider-factory/logs) one directory per run | SF_ALLOWED_LABELS unset or * = the whole AGENT set, a comma list narrows it
#   SF_AGENT_COMMAND (claude) the command that runs an agent — every worker spawn and the worker count go through it
#   SF_AGENT_FEATURE_GATES / SF_AGENT_EPIC_GATES (0) — 1 lets the lead agent verify and merge that tier's gate every tick
#   Every one of them may live in CLI/spider-factory.env, which CLI/install-cli.sh puts there and you edit by hand.
#   Contract: this directory is the contract. .claude/diagram/ is its human-terms account; .claude/CLAUDE.md points at both.
set -uo pipefail

loopDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
engineDir="$(dirname "$loopDir")"
utilsDir="$(dirname "$engineDir")/utils"
source "$utilsDir/user-env.sh"
loadSpiderFactoryEnv

declare -A AGENT=(
    [backend-logic]=engineer
    [frontend-ui]=frontend
    [unit-tests]=tester-unit
    [feature-test]=tester-feature
    [epic-e2e-test]=tester-e2e
    [feature-review]=review
    [epic-review]=review
)

leadAgentName="lead"

declare -A numericSettingEnvName=(
    [maximumParallelWorkers]=SF_MAX_PARALLEL
    [pollSeconds]=SF_POLL_S
    [maximumTicketsDone]=SF_MAX_TICKETS
)

declare -A allowedLabel=()
declare -A lastTickForWaitingReason=()

maximumParallelWorkers=0
pollSeconds=0
maximumTicketsDone=0
logRoot=""
agentCommand=""
agentLaunchCommand=""
agentHandlesFeatureGates=0
agentHandlesEpicGates=0
waitingLineCadence=0
tickCount=0
claimedThisRun=0

source "$utilsDir/console.sh"
source "$utilsDir/logging.sh"
source "$utilsDir/forge.sh"
source "$loopDir/logs.sh"
source "$loopDir/config.sh"
source "$loopDir/preflight.sh"
source "$loopDir/tower-id.sh"
source "$loopDir/git.sh"
source "$loopDir/beads.sh"
source "$loopDir/claim.sh"
source "$loopDir/worker.sh"
source "$loopDir/gates.sh"

nameTheSpeaker beads-loop

claimAndDispatchOneTicket() {
    readClaimFromFrontier || return
    if frontierHeldNoTicket; then
        reportEmptyFrontier
        return
    fi
    readTicketIdentityFromClaim || return
    readClaimLabels
    claimCarriesExactlyOneDispatchLabel || return
    claimBelongsToATower || return
    ensureEpicGatePr "$gateId" || {
        releaseClaim "$ticketId"
        return 1
    }
    dispatchWorker "$ticketId" "${AGENT["${matchedLabels[0]}"]}" "$branch" "$prTarget" "${matchedLabels[0]}"
}

tick() {
    local claimJson claimExitCode ticketId ticketLabels matchedLabels branch prTarget gateId

    dispatchReadyGates

    clearLogFields
    atDispatchCapacity && return
    claimAndDispatchOneTicket
}

logRunTallyForTicketLimit() {
    clearLogFields
    writeLog results "ticks=$tickCount claimed=$claimedThisRun done=$(numberOfTicketsDoneThisRun) note=\"$(formatMessage "$msgHitTicketLimitTemplate" "$maximumTicketsDone")\""
}

runLoop() {
    while true; do
        if (( maximumTicketsDone > 0 )) && (( $(numberOfTicketsDoneThisRun) >= maximumTicketsDone )); then
            logRunTallyForTicketLimit
            break
        fi
        tickCount=$((tickCount + 1))
        tick
        sleep "$pollSeconds"
    done
}

onInterrupt() {
    clearLogFields
    writeLog results "ticks=$tickCount claimed=$claimedThisRun done=$(numberOfTicketsDoneThisRun)"
    reportStopped
    exit 0
}

installInterruptTrap() { trap 'onInterrupt' INT TERM; }

configureFromEnvironment
configureAllowedLabels
requireToolsOnPath
requireNumericSettingsFromEnvironment
requireGateFlagsAreSwitches
requireUsablePollInterval
requireBeadsProject
createRunLogDirectory
resolveTowerPaths
seedStartingLogFields "$logDir" "$towerDir"
configureWaitingLineCadence
installInterruptTrap
announceRunLogDirectory
runLoop
