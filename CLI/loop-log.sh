#!/usr/bin/env bash
# loop-log.sh — the one definition of a log line, sourced by the dispatcher (beads-loop.sh) and
# by both worker hooks (hooks/worker-stop.sh, hooks/worker-fail.sh). It is what makes the files in
# one run's log dir JOIN: every line in every file carries the SAME identity field set, in the same
# order, so a line in errors can be followed into claims, closes or failures by grep alone.
#
#   <TAG padded to 8> <ISO time>\trun=… repo=… ticket=… label=… agent=… branch=… target=… session=… worktree=… <detail>
#
# The tag IS the file it appends to, so a line can never land in a file nobody watches.
# Unknown identity fields print `-`; a field is never simply absent, because an absent field is
# indistinguishable from a field nobody bothered to set.
#
# The nine keys below are the whole contract. To carry a value on every line, set its key with
# boIdent; to carry something one line only (a step, a gate, an exit code), pass it as detail.
#
# BO_LOG_QUIET=1 before sourcing keeps the line out of stdout — the hooks must not print into a
# session. The dispatcher leaves it unset and watches every line on the terminal instead.
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

# boIdent <key> <value> — record one identity field for every line that follows.
# Empty, unset, and unknown all collapse to "-", so a reader never has to know which.
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

# boClearIdentity — wipe everything but run and repo. The dispatcher calls it at the top of each
# tick so a line never inherits a ticket from the tick before it.
boClearIdentity() {
    local key
    for key in "${boIdentityKeys[@]}"; do
        [[ "$key" == run || "$key" == repo ]] || BO_ID["$key"]="-"
    done
}

# logTo <file> <detail…> — the first argument is BOTH the display tag and the file it appends to.
logTo() {
    local file="$1"
    shift
    if [[ -n "${BO_LOG_QUIET-}" ]]; then
        printf '%-8s %s\t%s %s\n' "$file" "$(date +%FT%T)" "$(boIdentity)" "$*" >> "$logDir/$file"
    else
        printf '%-8s %s\t%s %s\n' "$file" "$(date +%FT%T)" "$(boIdentity)" "$*" | tee -a "$logDir/$file"
    fi
}

# sessionFromSpawn <file> — the session id claude --bg printed, or nothing.
# The line is `backgrounded · 287d3c4c`; it is the only place this id ever appears, so the loop
# reads it here and puts it on the claims line, or it is lost for the run.
sessionFromSpawn() {
    sed -n 's/.*backgrounded · \([0-9A-Za-z]\{1,\}\).*/\1/p' "$1" 2>/dev/null | tail -1
}
