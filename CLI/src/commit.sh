#!/usr/bin/env bash
# commit.sh — stage everything in this repo, commit it under the name of the agent whose work it is, push the branch.
#   commit.sh <short message>   (or: sf commit <short message>)
#   The subject is written as agent:branch:message — SF_AGENT (manual) and the branch you are standing on.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/../utils/console.sh"
nameTheSpeaker commit

agentName="${SF_AGENT:-manual}"

usage() {
    cat <<'USAGE'
commit — git add -A, git commit, git push

  commit.sh <short message>

Stages everything in this repo and commits it with the subject:

  agent:branch:message

The agent is SF_AGENT, the name the loop spawned the worker under, or 'manual'
when you are standing in a terminal. The branch is the one you are on. The
message is yours — keep it to a line or three.

Then the branch is pushed to origin. Nothing is claimed or closed.
USAGE
}

currentBranch() {
    git symbolic-ref --short HEAD
}

commitEverything() {
    local branch
    branch="$(currentBranch 2>/dev/null)" || branch=""
    [[ -n "$branch" ]] || die "this is a detached HEAD — there is no branch to name in the message."
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
