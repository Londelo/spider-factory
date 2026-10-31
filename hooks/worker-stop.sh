#!/usr/bin/env bash
# worker-stop.sh — the Stop hook that finishes a dispatched worker's ticket.
#
#   push what is left → open the PR → write the PR url and the branch onto the ticket → close it
#
# This is the closer. The worker never closes its own ticket and cannot reach this script to
# make it; the ticket closes because its session ended, not because anything said it was done.
#
# It is registered in hooks/hooks.json, so it fires in EVERY session of EVERY project the
# plugin is enabled in. BO_TICKET is what tells a dispatcher's worker apart from everything
# else — a session the loop did not spawn leaves on the first line.
#
# Env the dispatcher sets on the spawn line:
#   BO_TICKET       the ticket this session owns
#   BO_PROJECT_DIR  the tower root, where .beads lives. The worktree is NOT the tower.
#   BO_LOG_DIR      this run's log dir; alarms land in $BO_LOG_DIR/errors
set -uo pipefail

[[ -n "${BO_TICKET:-}" ]] || exit 0

ticket="$BO_TICKET"
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
# is finished and the run is over, so the re-entry leaves silently instead of force-pushing
# the branch and opening a second PR for a ticket that already shipped.
ticketState="$(bd -C "$towerDir" show --json "$ticket" 2>/dev/null \
    | jq -r 'if type == "array" then .[0] else . end | .status // empty' 2>/dev/null)"
if [[ "$ticketState" == "closed" ]]; then
    exit 0
fi
if [[ "$ticketState" != "in_progress" ]]; then
    logTo errors "ticket=$ticket reason=ticket-not-in-work state=\"${ticketState:-not-found}\""
    exit 0
fi

branch="$(git -C "$worktreeDir" branch --show-current 2>/dev/null)"
if [[ -z "$branch" ]]; then
    logTo errors "ticket=$ticket reason=no-branch worktree=\"$worktreeDir\""
    exit 0
fi

ticketJson="$(bd -C "$towerDir" show --json --long "$ticket" 2>/dev/null)"
ticketTitle="$(jq -r 'if type == "array" then .[0] else . end | .title // ""' <<<"$ticketJson" 2>/dev/null)"
ticketDescription="$(jq -r 'if type == "array" then .[0] else . end | .description // ""' <<<"$ticketJson" 2>/dev/null)"
if [[ -z "$ticketTitle" ]]; then
    logTo errors "ticket=$ticket reason=ticket-has-no-title"
    exit 0
fi

# the worker may have stopped with the last edit still uncommitted — that is what this catches
git -C "$worktreeDir" add -A >/dev/null 2>&1
if ! git -C "$worktreeDir" diff --cached --quiet 2>/dev/null; then
    if ! git -C "$worktreeDir" commit -F - >/dev/null 2>&1 <<COMMIT
$ticketTitle

Closed by worker-stop.sh for ticket $ticket.
COMMIT
    then
        logTo errors "ticket=$ticket reason=commit-failed worktree=\"$worktreeDir\""
        exit 0
    fi
fi

if ! pushed="$(git -C "$worktreeDir" push -u origin "$branch" 2>&1)"; then
    logTo errors "ticket=$ticket reason=push-failed msg=\"$(oneLine <<<"$pushed")\""
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

if [[ "$forge" == gitlab ]]; then
    baseBranch="$(cd "$worktreeDir" && glab repo view -F json 2>/dev/null | jq -r '.default_branch // empty')"
    [[ -n "$baseBranch" ]] || baseBranch="$(git -C "$worktreeDir" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|^origin/||')"
else
    baseBranch="$(cd "$worktreeDir" && gh repo view --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null)"
fi
# "git remote show origin" prints the literal "(unknown)" when the remote has no HEAD, and
# glab happily opens a merge request against a branch called that
if [[ -z "$baseBranch" || "$baseBranch" == "(unknown)" ]]; then
    logTo errors "ticket=$ticket reason=no-base-branch forge=$forge"
    exit 0
fi

bodyFile="$(mktemp)" || exit 0
trap 'rm -f "$bodyFile"' EXIT

# an existing PR is the branch's answer, not a failure — reuse its url and keep going
if [[ "$forge" == gitlab ]]; then
    prUrl="$(cd "$worktreeDir" && glab mr list --source-branch "$branch" -F json 2>/dev/null \
        | jq -r '.[0].web_url // empty')"
else
    prUrl="$(cd "$worktreeDir" && gh pr view --json url -q .url 2>/dev/null)"
fi
if [[ -z "$prUrl" ]]; then
    printf '%s' "$ticketDescription" > "$bodyFile"
    if [[ "$forge" == gitlab ]]; then
        prUrl="$(cd "$worktreeDir" && glab mr create \
            --title "$ticketTitle" \
            --description-file "$bodyFile" \
            --source-branch "$branch" \
            --target-branch "$baseBranch" \
            --push=false --yes 2>&1)"
    else
        prUrl="$(cd "$worktreeDir" && gh pr create \
            --title "$ticketTitle" \
            --body-file "$bodyFile" \
            --head "$branch" \
            --base "$baseBranch" 2>&1)"
    fi
    # only a real PR/MR link counts — an error that quotes a docs URL is not a pull request
    prUrl="$(grep -oE 'https?://[^[:space:]]+' <<<"$prUrl" \
        | grep -E '/(pull|merge_requests)/[0-9]+' | tail -1)"
fi
if ! [[ "$prUrl" =~ ^https?://[^[:space:]]+$ ]]; then
    logTo errors "ticket=$ticket reason=pr-not-created forge=$forge msg=\"$(oneLine <<<"$prUrl")\""
    exit 0
fi

# the ticket has to say where the work went, or the next reader is looking for a branch
if ! bd -C "$towerDir" update "$ticket" --append-notes "PR: $prUrl
Branch: $branch" >/dev/null 2>&1; then
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

logTo closes "ticket=$ticket branch=$branch pr=$prUrl"
exit 0
