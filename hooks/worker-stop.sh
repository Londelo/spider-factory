#!/usr/bin/env bash
# worker-stop.sh — the Stop hook that finishes a dispatched worker's ticket.
#
#   worker says it is done → commit the task onto its feature's branch → push → the branch's PR →
#   write the PR url onto the ticket's `pr` metadata → close it
#
# This is the closer, and it is FAIL-CLOSED. A ticket closes only when its worker declared
# completion by touching $BO_DONE_FILE as its very last action. No marker means the session ended
# without saying so — nothing is committed, nothing is pushed, the ticket stays claimed so its
# lease parks it off the frontier, and the tasks chained behind it never start. That is the whole
# safety of a shared branch: a half-finished task cannot slide its neighbours sideways.
#
# It is registered in hooks/hooks.json, so it fires in EVERY session of EVERY project the
# plugin is enabled in. BO_TICKET is what tells a dispatcher's worker apart from everything
# else — a session the loop did not spawn leaves on the first line.
#
# Env the dispatcher sets on the spawn line:
#   BO_TICKET     the ticket this session owns
#   BO_BRANCH     the branch this ticket's work lands on — the plan's `branch` metadata
#   BO_PR_TARGET  the branch its pull request targets — the epic gate's own `branch`, `main` at the epic
#                 tier; the loop reads it and hands it down, it is never stored on the ticket. The url of
#                 the resulting PR is written back as the ticket's `pr` metadata.
#   BO_PROJECT_DIR  the tower root, where .beads lives. The worktree is NOT the tower.
#   BO_LOG_DIR      this run's log dir; alarms land in $BO_LOG_DIR/errors
#   BO_DONE_FILE    the marker the worker touches when — and only when — its brief is complete
set -uo pipefail

[[ -n "${BO_TICKET:-}" ]] || exit 0

ticket="$BO_TICKET"
branch="${BO_BRANCH:-}"
prTarget="${BO_PR_TARGET:-}"
towerDir="${BO_PROJECT_DIR:-$PWD}"
logDir="${BO_LOG_DIR:-$HOME/.binary-obelisk/logs}"
mkdir -p "$logDir" 2>/dev/null || true

logTo() { printf '%-8s %s\t%s\n' "$1" "$(date +%FT%T)" "${*:2}" | tee -a "$logDir/$1" >/dev/null; }
oneLine() { tr '\n' ' ' | tr -d '"\\' | sed 's/  */ /g' | cut -c1-160; }

for requiredTool in bd jq git; do
    command -v "$requiredTool" >/dev/null 2>&1 || {
        logTo errors "ticket=$ticket reason=missing-tool tool=$requiredTool"
        exit 0
    }
done

hookInput="$(cat)"
worktreeDir="$(jq -r '.cwd // empty' <<<"$hookInput" 2>/dev/null)"
[[ -n "$worktreeDir" && -d "$worktreeDir" ]] || worktreeDir="$PWD"
sessionId="$(jq -r '.session_id // empty' <<<"$hookInput" 2>/dev/null)"

# A second Stop in the same session re-enters this script. Once the ticket is closed the work
# is finished and the run is over, so the re-entry leaves silently instead of committing onto
# the shared branch a second time for a ticket that already shipped.
ticketState="$(bd -C "$towerDir" show --json "$ticket" 2>/dev/null \
    | jq -r 'if type == "array" then .[0] else . end | .status // empty' 2>/dev/null)"
if [[ "$ticketState" == "closed" ]]; then
    exit 0
fi
if [[ "$ticketState" != "in_progress" ]]; then
    logTo errors "ticket=$ticket reason=ticket-not-in-work state=\"${ticketState:-not-found}\""
    exit 0
fi

if [[ -z "$branch" ]]; then
    logTo errors "ticket=$ticket reason=no-branch msg=\"BO_BRANCH was not on the spawn; the ticket's metadata should carry a 'branch' key\""
    exit 0
fi
if [[ -z "$prTarget" ]]; then
    logTo errors "ticket=$ticket reason=no-pr-target branch=$branch msg=\"BO_PR_TARGET was not on the spawn; the loop reads the target off the ticket's epic gate, and says main when the ticket sits under the epic itself\""
    exit 0
fi

# THE GATE. Everything past this line lands on a branch other tickets are queued behind, so
# nothing lands there until the worker said, out loud, in the one place both programs read,
# that its brief is finished. The session ending is not that statement; the marker is.
if [[ ! -e "${BO_DONE_FILE:-/nonexistent-bo-done-file}" ]]; then
    logTo errors "ticket=$ticket reason=not-declared-done branch=$branch worktree=\"$worktreeDir\" msg=\"the worker stopped without touching its done file; nothing was committed and the ticket stays open — the tasks behind it wait\""
    exit 0
fi

# The worker was told never to change branches. If it did anyway, this is the last place that
# can refuse to file its work under the wrong ticket's name.
currentBranch="$(git -C "$worktreeDir" branch --show-current 2>/dev/null)"
if [[ "$currentBranch" != "$branch" ]]; then
    logTo errors "ticket=$ticket reason=wrong-branch want=$branch got=\"${currentBranch:-detached}\" worktree=\"$worktreeDir\""
    exit 0
fi

ticketJson="$(bd -C "$towerDir" show --json --long "$ticket" 2>/dev/null)"
ticketTitle="$(jq -r 'if type == "array" then .[0] else . end | .title // ""' <<<"$ticketJson" 2>/dev/null)"
if [[ -z "$ticketTitle" ]]; then
    logTo errors "ticket=$ticket reason=ticket-has-no-title"
    exit 0
fi

# the task is one commit on its feature's branch; a review or test ticket may land nothing, and
# the worker may have stopped with its last edit still uncommitted — that is what this catches
git -C "$worktreeDir" add -A >/dev/null 2>&1
if ! git -C "$worktreeDir" diff --cached --quiet 2>/dev/null; then
    if ! git -C "$worktreeDir" commit -F - >/dev/null 2>&1 <<COMMIT
$ticketTitle

Ticket: $ticket
COMMIT
    then
        logTo errors "ticket=$ticket reason=commit-failed branch=$branch worktree=\"$worktreeDir\""
        exit 0
    fi
fi

if ! pushed="$(git -C "$worktreeDir" push -u origin "$branch" 2>&1)"; then
    logTo errors "ticket=$ticket reason=push-failed branch=$branch msg=\"$(oneLine <<<"$pushed")\""
    exit 0
fi

# The remote names the forge, never the machine. An honest host settles itself; where it does not,
# the refs that host publishes do, because only GitHub serves refs/pull and only GitLab serves
# refs/merge-requests. A brand new repo has published neither yet, so the last resort is a machine
# holding exactly one of the two CLIs — and where that is ambiguous too, the hook refuses to guess.
remoteUrl="$(git -C "$worktreeDir" remote get-url origin 2>/dev/null)"
case "$remoteUrl" in
    *gitlab*) forge=gitlab ;;
    *github*) forge=github ;;
    *)
        remoteRefs="$(git -C "$worktreeDir" ls-remote origin 2>/dev/null)"
        if grep -qE '[[:space:]]refs/(merge-requests|pipelines|environments)/' <<<"$remoteRefs"; then
            forge=gitlab
        elif grep -qE '[[:space:]]refs/pull/' <<<"$remoteRefs"; then
            forge=github
        elif command -v glab >/dev/null 2>&1 && ! command -v gh >/dev/null 2>&1; then
            forge=gitlab
        elif command -v gh >/dev/null 2>&1 && ! command -v glab >/dev/null 2>&1; then
            forge=github
        else
            forge=""
        fi
        ;;
esac
if [[ -z "$forge" ]]; then
    logTo errors "ticket=$ticket reason=forge-unknown remote=\"$remoteUrl\""
    exit 0
fi
forgeTool=gh
[[ "$forge" == gitlab ]] && forgeTool=glab
if ! command -v "$forgeTool" >/dev/null 2>&1; then
    logTo errors "ticket=$ticket reason=missing-tool tool=$forgeTool forge=$forge"
    exit 0
fi

bodyFile="$(mktemp)" || exit 0
trap 'rm -f "$bodyFile"' EXIT

# ONE BRANCH, ONE PULL REQUEST, FOREVER. The feature's PR is created by its first task and every
# later task on that branch finds it by branch name and reuses it — which is the whole reason the
# PR is always findable from the branch and the branch is the identity of the work.
if [[ "$forge" == gitlab ]]; then
    prUrl="$(cd "$worktreeDir" && glab mr list --source-branch "$branch" --target-branch "$prTarget" -F json 2>/dev/null \
        | jq -r '.[0].web_url // empty')"
else
    prUrl="$(cd "$worktreeDir" && gh pr list --head "$branch" --base "$prTarget" --state open --json url -q '.[0].url // empty' 2>/dev/null)"
fi
if [[ -z "$prUrl" ]]; then
    printf 'Branch `%s` into `%s`, assembled one task at a time by the binary-obelisk loop.\n\nLast task closed onto it: **%s** (%s)\n' \
        "$branch" "$prTarget" "$ticketTitle" "$ticket" > "$bodyFile"
    if [[ "$forge" == gitlab ]]; then
        prUrl="$(cd "$worktreeDir" && glab mr create \
            --title "$branch" \
            --description-file "$bodyFile" \
            --source-branch "$branch" \
            --target-branch "$prTarget" \
            --push=false --yes 2>&1)"
    else
        prUrl="$(cd "$worktreeDir" && gh pr create \
            --title "$branch" \
            --body-file "$bodyFile" \
            --head "$branch" \
            --base "$prTarget" 2>&1)"
    fi
    # only a real PR/MR link counts — an error that quotes a docs URL is not a pull request
    prUrl="$(grep -oE 'https?://[^[:space:]]+' <<<"$prUrl" \
        | grep -E '/(pull|merge_requests)/[0-9]+' | tail -1)"
fi
if ! [[ "$prUrl" =~ ^https?://[^[:space:]]+$ ]]; then
    logTo errors "ticket=$ticket reason=pr-not-created forge=$forge branch=$branch target=$prTarget msg=\"$(oneLine <<<"$prUrl")\""
    exit 0
fi

# the ticket has to say where the work went. the plan's `branch` stays untouched:
# `--set-metadata` merges, so this adds the one key nobody can derive from the branch without the forge.
if ! bd -C "$towerDir" update "$ticket" --set-metadata "pr=$prUrl" >/dev/null 2>&1; then
    logTo errors "ticket=$ticket reason=ticket-not-annotated pr=$prUrl"
    exit 0
fi

# bd refuses to close a ticket whose assignee is not the actor. The dispatcher claimed this
# ticket as whoever runs bd, so overriding the actor here would be the only reason to fail.
if ! bd -C "$towerDir" close "$ticket" --session "$sessionId" \
        --reason "worker session $(oneLine <<<"$sessionId") finished; PR $prUrl" >/dev/null 2>&1; then
    logTo errors "ticket=$ticket reason=close-failed pr=$prUrl"
    exit 0
fi

logTo closes "ticket=$ticket branch=$branch target=$prTarget url=$prUrl"
exit 0
