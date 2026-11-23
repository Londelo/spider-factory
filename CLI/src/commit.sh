#!/usr/bin/env bash
# commit.sh — stage everything in this repo, commit it under the name of the agent whose work it is, push the branch.
#   commit.sh <short message>   (or: sf commit <short message>)
#   The subject is written as agent:branch:message. The agent is the one the loop dispatched onto this
#   branch, read off the dispatch context the loop wrote before it spawned; 'manual' is nobody was
#   dispatched, which is a person standing in a terminal. The branch is the one you are standing on.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/../utils/console.sh"
source "$here/../utils/user-env.sh"
loadSpiderFactoryEnv
nameTheSpeaker commit

usage() {
    cat <<'USAGE'
commit — git add -A, git commit, git push

  commit.sh <short message>

Stages everything in this repo and commits it with the subject:

  agent:branch:message

The agent is the one the loop dispatched onto this branch, read off the dispatch
context the loop wrote when it spawned it, or 'manual' when nobody was dispatched —
a person standing in a terminal. The branch is the one you are on. The
message is yours — keep it to a line or three.

Then the branch is pushed to origin. Nothing is claimed or closed.
USAGE
}

currentBranch() {
    git symbolic-ref --short HEAD
}

agentNameOfTheBranch() {
    local repoDir contextFile line
    repoDir="$(git rev-parse --show-toplevel 2>/dev/null)" || return 1
    contextFile="${SF_LOG_ROOT:-$HOME/.spider-factory/logs}/worker-context/$(basename "$repoDir")"
    [[ -r "$contextFile" ]] || return 1
    line="$(grep -m1 '^agent=' "$contextFile" 2>/dev/null)" || return 1
    printf '%s' "${line#agent=}"
}

commitEverything() {
    local branch agentName
    branch="$(currentBranch 2>/dev/null)" || branch=""
    [[ -n "$branch" ]] || die "this is a detached HEAD — there is no branch to name in the message."
    agentName="$(agentNameOfTheBranch)"
    [[ -n "$agentName" ]] || agentName="manual"
    git add -A
    git commit -m "$agentName:$branch:$*" || exit 1
    git push -u origin "$branch"
}

runRequestedCommit() {
    case "${1:-}" in
        ""|-h|--help|help)
            usage
            exit 0
            ;;
    esac
    commitEverything "$*"
}

runRequestedCommit "$@"
