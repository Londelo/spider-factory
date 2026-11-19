#!/usr/bin/env bash
# git.sh — the branch, its worktree, and the epic branch's pull request, sourced by beads-loop/index.sh.
#   The worktree belongs to the branch and not the ticket: .claude/worktrees/<branch with / → +>.

branchSeedFailure=""

worktreePathFor() { echo "$worktreesRoot/${1//\//+}"; }

branchAlreadyCheckedOut() {
    git -C "$towerDir" worktree list --porcelain 2>/dev/null \
        | awk -v want="refs/heads/$1" '$1=="worktree"{path=$2} $1=="branch" && $2==want {print path; exit}'
}

startingCommitFor() {
    local candidate resolved
    for candidate in "$@"; do
        resolved="$(git -C "$towerDir" rev-parse --verify --quiet "${candidate}^{commit}" 2>/dev/null)" || continue
        [[ -n "$resolved" ]] || continue
        printf '%s' "$resolved"
        return 0
    done
    return 1
}

remoteShaOfBranch() {
    git -C "$towerDir" ls-remote --heads origin "$1" 2>/dev/null \
        | awk -v want="refs/heads/$1" '$2 == want {print $1; exit}'
}

ensureBranchAheadOfTarget() {
    local branch="$1" targetSha="$2" remoteSha seedSha
    branchSeedFailure=""
    remoteSha="$(remoteShaOfBranch "$branch")"
    [[ -z "$remoteSha" || "$remoteSha" == "$targetSha" ]] || return 0
    seedSha="$(git -C "$towerDir" commit-tree "${targetSha}^{tree}" -p "$targetSha" \
        -m "chore: open $branch" 2>/dev/null)" || {
        branchSeedFailure="commit-tree-failed"
        return 1
    }
    git -C "$towerDir" push --quiet origin "$seedSha:refs/heads/$branch" >/dev/null 2>&1 || {
        branchSeedFailure="push-failed"
        return 1
    }
}

unseenCommitsOn() {
    git -C "$towerDir" rev-list --count "$1" --not --remotes=origin 2>/dev/null
}

moveStrayFolderAside() {
    local dir="$1" aside
    [[ -d "$dir" ]] || return 0
    [[ -z "$(ls -A "$dir" 2>/dev/null)" ]] && return 0
    aside="$dir.stale-$(date +%s)"
    mv "$dir" "$aside" 2>/dev/null || return 1
    printf '%s' "$aside"
}

ensureWorktree() {
    local branch="$1" prTarget="$2" existing start unseen
    worktreePath=""
    worktreeAside=""
    worktreeFailure="add-failed"
    existing="$(branchAlreadyCheckedOut "$branch")"
    if [[ -n "$existing" && -d "$existing" ]]; then
        worktreePath="$existing"
        worktreeFailure=""
        return 0
    fi
    worktreePath="$(worktreePathFor "$branch")"
    [[ -e "$worktreePath" ]] || mkdir -p "$worktreesRoot"
    git -C "$towerDir" fetch --quiet origin 2>/dev/null || true
    git -C "$towerDir" worktree prune >/dev/null 2>&1 || true
    unseen="$(unseenCommitsOn "$branch")"
    if [[ -n "$unseen" && "$unseen" -gt 0 ]]; then
        worktreeFailure="unpushed-commits"
        return 1
    fi
    worktreeAside="$(moveStrayFolderAside "$worktreePath")" || {
        worktreeFailure="folder-immovable"
        return 1
    }
    start="$(startingCommitFor "origin/$branch" "origin/$prTarget" "$prTarget" "HEAD")" || {
        worktreeFailure="no-start"
        return 1
    }
    git -C "$towerDir" worktree add -B "$branch" "$worktreePath" "$start" >/dev/null 2>&1 || return 1
    [[ -d "$worktreePath" ]] || { worktreePath=""; return 1; }
    worktreeFailure=""
}

ensureEpicGatePr() {
    local gateId="$1"
    local gateBranch forge forgeTool prUrl bodyFile start prBody
    [[ -n "$(readFieldOf "$gateId" pr)" ]] && return 0

    gateBranch="$(readFieldOf "$gateId" branch)"
    if [[ -z "$gateBranch" ]]; then
        logTo errors "reason=epic-pr-failed step=gate-branch gate=$gateId msg=\"$msgEpicPrNoGateBranch\""
        return 1
    fi
    forge="$(detectForge "$towerDir")"
    if [[ -z "$forge" ]]; then
        logTo errors "reason=epic-pr-failed step=forge gate=$gateId gateBranch=$gateBranch remote=\"$remoteUrl\""
        return 1
    fi
    forgeTool="$(forgeToolFor "$forge")"
    if ! command -v "$forgeTool" >/dev/null 2>&1; then
        logTo errors "reason=epic-pr-failed step=missing-tool tool=$forgeTool forge=$forge gate=$gateId"
        return 1
    fi

    start="$(startingCommitFor "origin/main" "main" "HEAD")" || {
        logTo errors "reason=epic-pr-failed step=push gate=$gateId gateBranch=$gateBranch msg=\"$msgEpicBranchUnpublished\""
        return 1
    }
    if ! ensureBranchAheadOfTarget "$gateBranch" "$start"; then
        if [[ "$branchSeedFailure" == commit-tree-failed ]]; then
            logTo errors "reason=epic-pr-failed step=seed gate=$gateId gateBranch=$gateBranch msg=\"$msgEpicBranchSeedUnattributable\""
        else
            logTo errors "reason=epic-pr-failed step=push gate=$gateId gateBranch=$gateBranch msg=\"$msgEpicBranchUnpublished\""
        fi
        return 1
    fi

    if [[ "$forge" == gitlab ]]; then
        prUrl="$(cd "$towerDir" && glab mr list --source-branch "$gateBranch" --target-branch main -F json 2>/dev/null \
            | jq -r '.[0].web_url // empty')"
    else
        prUrl="$(cd "$towerDir" && gh pr list --head "$gateBranch" --base main --state open --json url -q '.[0].url // empty' 2>/dev/null)"
    fi
    if [[ -z "$prUrl" ]]; then
        bodyFile="$(mktemp)" || return 1
        formatMessage "$epicPrBodyTemplate" "$gateId" > "$bodyFile"
        if [[ "$forge" == gitlab ]]; then
            prBody="$(cd "$towerDir" && glab mr create --title "$gateBranch" --description-file "$bodyFile" \
                --source-branch "$gateBranch" --target-branch main --push=false --yes 2>&1)"
        else
            prBody="$(cd "$towerDir" && gh pr create --title "$gateBranch" --body-file "$bodyFile" \
                --head "$gateBranch" --base main 2>&1)"
        fi
        rm -f "$bodyFile"
        prUrl="$(grep -oE 'https?://[^[:space:]]+' <<<"$prBody" | grep -E '/(pull|merge_requests)/[0-9]+' | tail -1)"
    fi
    if ! [[ "$prUrl" =~ ^https?://[^[:space:]]+$ ]]; then
        logTo errors "reason=epic-pr-failed step=pr gate=$gateId gateBranch=$gateBranch forge=$forge msg=\"$(tr '\n' ' ' <<<"${prBody-$prUrl}" | cut -c1-160)\""
        return 1
    fi
    if ! bd -C "$towerDir" update "$gateId" --set-metadata "pr=$prUrl" >/dev/null 2>&1; then
        logTo errors "reason=epic-pr-failed step=annotate gate=$gateId pr=$prUrl"
        return 1
    fi
    logTo claims "gate=$gateId reason=epic-published gateBranch=$gateBranch pr=$prUrl"
    return 0
}
