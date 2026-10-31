#!/usr/bin/env bash
# loop-log.sh — the one definition of a log line, sourced by CLI/beads-loop.sh and both worker hooks.
#   <tag padded to 8> <ISO time>\trun=… repo=… ticket=… label=… agent=… branch=… target=… session=… worktree=… <detail>
#   The tag is also the file the line appends to under $logDir. Carry a value on every line with
#   boIdent <key> <value>; pass anything one line only (a step, a gate, an exit code) to logTo as detail.
#   BO_LOG_QUIET=1 keeps the line out of stdout, which the hooks need and the engine does not.
boIdentityKeys=(run repo ticket label agent branch target session worktree)
declare -A BO_ID=()

boSeedIdentity() {
    local key
    for key in "${boIdentityKeys[@]}"; do
        BO_ID["$key"]="-"
    done
    BO_ID["run"]="$(basename "$1")"
    BO_ID["repo"]="$2"
}

boIdent() {
    local key="$1" value="${2-}"
    [[ -n "${BO_ID["$key"]+set}" ]] || return 0
    [[ -n "$value" ]] || value="-"
    BO_ID["$key"]="$value"
}

boIdentity() {
    local key value line=""
    for key in "${boIdentityKeys[@]}"; do
        value="${BO_ID[$key]}"
        [[ "$value" != *[[:space:]]* ]] || value="\"$value\""
        line+="$key=$value "
    done
    printf '%s' "${line% }"
}

boClearIdentity() {
    local key
    for key in "${boIdentityKeys[@]}"; do
        [[ "$key" == run || "$key" == repo ]] || BO_ID["$key"]="-"
    done
}

logTo() {
    local file="$1"
    shift
    if [[ -n "${BO_LOG_QUIET-}" ]]; then
        printf '%-8s %s\t%s %s\n' "$file" "$(date +%FT%T)" "$(boIdentity)" "$*" >> "$logDir/$file"
    else
        printf '%-8s %s\t%s %s\n' "$file" "$(date +%FT%T)" "$(boIdentity)" "$*" | tee -a "$logDir/$file"
    fi
}

sessionFromSpawn() {
    sed -n 's/.*backgrounded · \([0-9A-Za-z]\{1,\}\).*/\1/p' "$1" 2>/dev/null | tail -1
}
