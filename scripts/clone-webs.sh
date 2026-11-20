#!/usr/bin/env bash
# clone-webs.sh — clone every repo listed in webs/webs.yml into webs/ beside it.
#   npm run webs:clone      (or: bash scripts/clone-webs.sh)
# The list is yours, and this engine is the only thing that writes it — copied from the tracked
# webs/webs.example.yml, and only when it is missing. webs/ is in the repo by its .gitkeep alone: a clone
# that lands there belongs to the machine, not the plugin, and the CLI has nothing to do with any of it.
set -uo pipefail

here="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
source "$here/../CLI/utils/console.sh"
nameTheSpeaker webs
pluginRoot="$(cd "$here/.." && pwd)"
websDir="$pluginRoot/webs"
listFile="$websDir/webs.yml"
exampleListFile="$websDir/webs.example.yml"

usage() {
    cat <<'USAGE'
webs — clone the repos the factory builds webs out of

  npm run webs:clone
  clone-webs.sh

Every repo url listed under 'repos:' in webs/webs.yml is cloned into webs/ beside
it, each one into a directory named after the last segment of its url. A repo already
sitting there is left alone — this engine never pulls, never resets, and never
deletes.

  repos:
    - https://github.com/Londelo/my-web.git
    - git@github.com:Londelo/my-other-web.git

This engine writes that list from the tracked webs/webs.example.yml whenever it is
missing, so the first run of a fresh checkout tells you where to put your urls
instead of cloning nothing quietly. Nothing else ever writes it — not the installer,
not sf. Only webs/.gitkeep and that example are in the repo; everything else under
webs/ is gitignored.
USAGE
}

ensureListFile() {
    [[ -f "$listFile" ]] && return 0
    [[ -f "$exampleListFile" ]] || reportMissingFromInstall "example list" "$exampleListFile"
    cp "$exampleListFile" "$listFile"
    say "wrote your list to $listFile from $exampleListFile — add a repo url under 'repos:' and run this again."
}

readRepoUrls() {
    local line url
    while IFS= read -r line || [[ -n "$line" ]]; do
        line="${line%%[[:space:]]#*}"
        line="${line#"${line%%[![:space:]]*}"}"
        [[ "$line" == -* ]] || continue
        url="${line#-}"
        url="${url#"${url%%[![:space:]]*}"}"
        url="${url%"${url##*[![:space:]]}"}"
        url="${url#\"}"; url="${url%\"}"
        url="${url#\'}"; url="${url%\'}"
        [[ -n "$url" ]] && printf '%s\n' "$url"
    done < "$listFile"
}

checkRepoUrl() {
    case "$1" in
        https://* | http://* | ssh://* | git://* | *@*:*) return 0 ;;
    esac
    return 1
}

nameRepoFromUrl() {
    local name
    name="${1%/}"
    name="${name##*/}"
    name="${name%.git}"
    printf '%s\n' "$name"
}

cloneRepo() {
    local url="$1" name="$2"
    if [[ -e "$websDir/$name" ]]; then
        if [[ -d "$websDir/$name/.git" ]]; then
            plain "skipped name=$name reason=already-cloned"
        else
            plain "skipped name=$name reason=not-a-clone"
        fi
        return 2
    fi
    if git clone -- "$url" "$websDir/$name"; then
        plain "cloned name=$name url=$url"
        return 0
    fi
    plain "failed name=$name url=$url reason=git-clone"
    return 1
}

cloneAllRepos() {
    local url name outcome cloned=0 skipped=0 failed=0
    while IFS= read -r url; do
        [[ -n "$url" ]] || continue
        if ! checkRepoUrl "$url"; then
            plain "failed url=$url reason=not-a-git-url"
            ((++failed))
            continue
        fi
        name="$(nameRepoFromUrl "$url")"
        if [[ -z "$name" || "$name" == . || "$name" == .. ]]; then
            plain "failed url=$url reason=no-directory-name"
            ((++failed))
            continue
        fi
        cloneRepo "$url" "$name"
        outcome=$?
        case "$outcome" in
            0) ((++cloned)) ;;
            2) ((++skipped)) ;;
            *) ((++failed)) ;;
        esac
    done < <(readRepoUrls)
    if ((cloned + skipped + failed == 0)); then
        say "nothing listed — add a '- <repo url>' line under 'repos:' in $listFile"
        return 0
    fi
    say "$cloned cloned, $skipped skipped, $failed failed into $websDir"
    ((failed == 0))
}

runRequestedClone() {
    case "${1:-}" in
        -h | --help | help)
            usage
            exit 0
            ;;
    esac
    mkdir -p "$websDir"
    ensureListFile
    cloneAllRepos
    exit $?
}

runRequestedClone "$@"
