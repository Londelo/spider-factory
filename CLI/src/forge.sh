#!/usr/bin/env bash
# forge.sh — the one forge detector, sourced by the loop engine AND the Stop hook
# (.claude/CLAUDE.md §Branches). The remote names the forge, never the machine: an honest
# host, then the refs it publishes, then a machine holding exactly one of the two CLIs.

detectForge() {
    local repoDir="$1" remoteRefs
    remoteUrl="$(git -C "$repoDir" remote get-url origin 2>/dev/null)"
    case "$remoteUrl" in
        *gitlab*) echo gitlab; return 0 ;;
        *github*) echo github; return 0 ;;
    esac
    remoteRefs="$(git -C "$repoDir" ls-remote origin 2>/dev/null)"
    if grep -qE '[[:space:]]refs/(merge-requests|pipelines|environments)/' <<<"$remoteRefs"; then
        echo gitlab
    elif grep -qE '[[:space:]]refs/pull/' <<<"$remoteRefs"; then
        echo github
    elif command -v glab >/dev/null 2>&1 && ! command -v gh >/dev/null 2>&1; then
        echo gitlab
    elif command -v gh >/dev/null 2>&1 && ! command -v glab >/dev/null 2>&1; then
        echo github
    fi
}

forgeToolFor() {
    if [[ "$1" == gitlab ]]; then
        echo glab
    else
        echo gh
    fi
}
