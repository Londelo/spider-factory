#!/usr/bin/env bash
# logs.sh — every sentence the dispatcher writes for a human to read, sourced by beads-loop/index.sh.
#   A log line is the keys the overseer greps plus one msg. The keys stay at the call site; the prose lives here.
#   A message that names a branch, a path or a count is a template and reaches the line through formatMessage.

formatMessage() {
    local template="$1"
    shift
    printf -- "$template" "$@"
}

# the epic branch and the pull request that publishes it
msgEpicPrNoGateBranch='the epic gate carries no branch, so nothing beneath it has a pull-request target'
msgEpicBranchUnpublished='the epic branch could not be published off main'
msgEpicBranchSeedUnattributable='the epic branch could not be given its own first commit — git has no user.name and user.email to sign one with'
epicPrBodyTemplate='The epic branch. Every feature branch under **%s** aims its pull request at this one; it is assembled ticket by ticket by the spider-factory loop and merged into `main` when the epic gate closes.\n'

# a claim that came back wrong
msgClaimReturnedNoIdTemplate='claim returned no id: %s'

# a peg holding dependencies, closed by the loop itself
msgBypassCloseFailedTemplate='the ticket %s carries the bypass label but would not close — nothing was dispatched and it stays claimed'

# a ticket that reaches no gate, so it is work the loop will not do
msgNoEpicGateMalformed='the id does not read <repo>-<kind>-<uuid>-<hierarchy>, so it names no ticket in any tower — nothing was dispatched and the ticket stays claimed until a human puts it in one'
msgTaskNotBelowAGate='a task'\''s hierarchy is <gate number>.<m> and this one carries no gate number, so it hangs below no gate — nothing was dispatched and the ticket stays claimed until a human fixes the id'
msgEpicGateRowIsNotAGate='the epic gate this id names is not a gate, so this ticket belongs to no tower — nothing was dispatched and the ticket stays claimed until a human puts it in one'
msgOwnerCarriesNoBranch='the gate this id names carries no branch, so the loop has nowhere to put this work — nothing was dispatched and the ticket stays claimed'
msgEpicCarriesNoBranch='the epic gate carries no branch, so this ticket'\''s pull request has nothing to aim at — nothing was dispatched and the ticket stays claimed'
msgGateIdIsNoGateOfAnyTower='the id does not read <repo>-<epic|-feature>-<uuid>-<number>, so this row is no gate of any tower — no lead agent was spawned for it'

# the branch folder the worker is to be built in
msgBranchHasUnpushedCommitsTemplate='the local branch %s holds commits origin has never seen, and the loop will not reset a branch that does — recover them with git reflog, or push them, then run the loop again'
msgNoStartingCommitTemplate='no starting commit: neither origin/%s nor its target %s resolves'
msgStrayFolderImmovableTemplate='the branch folder %s exists, is not a registered worktree, and could not be moved aside'
msgWorktreeCouldNotBeMadeTemplate='the branch folder could not be made from origin/%s or from its target %s'
msgGateWorktreeCouldNotBeMadeTemplate='the gate'\''s branch folder could not be made from origin/%s or from its target %s'
msgWorktreeFolderMovedAsideTemplate='the branch folder held files from an interrupted build; kept as %s rather than overwritten'

# a gate the loop reached for and lost
msgGateClaimLost='the gate was no longer open the moment the loop reached for it — another loop or a human has it, so no lead agent was spawned'

# how a run ends
msgHitTicketLimitTemplate='hit SF_MAX_TICKETS=%s: this run was configured to end here'
