#!/usr/bin/env bash
# logging.sh — the one definition of a log line, sourced by CLI/src/beads-loop/index.sh and by
#   CLI/src/agent-hooks/worker-stop.sh, and by nothing else. The engine seeds the fields once and carries
#   them in process memory; a one-shot caller with no process fills them from its own environment with
#   takeLogFieldsFromEnvironment.
#   <tag padded to 8> <ISO time>\trun=… repo=… ticket=… label=… agent=… branch=… target=… session=… worktree=… <detail>
#   The tag is also the file the line appends to under $logDir. Carry a value on every line with
#   setLogField <key> <value>; pass anything one line only (a step, a gate, an exit code) to writeLog as detail.
#   SF_LOG_QUIET=1 keeps the line out of stdout, which the hooks need and the engine does not.
logFieldNames=(run repo ticket label agent branch target session worktree)
declare -A logFields=()

blankLogFields() {
    local key
    for key in "${logFieldNames[@]}"; do
        logFields["$key"]="-"
    done
}

seedStartingLogFields() {
    blankLogFields
    logFields["run"]="$(basename "$1")"
    logFields["repo"]="$2"
}

setLogField() {
    local key="$1" value="${2-}"
    [[ -n "${logFields["$key"]+set}" ]] || return 0
    [[ -n "$value" ]] || value="-"
    logFields["$key"]="$value"
}

buildLog() {
    local key value line=""
    for key in "${logFieldNames[@]}"; do
        value="${logFields[$key]}"
        [[ "$value" != *[[:space:]]* ]] || value="\"$value\""
        line+="$key=$value "
    done
    printf '%s' "${line% }"
}

clearLogFields() {
    local key
    for key in "${logFieldNames[@]}"; do
        [[ "$key" == run || "$key" == repo ]] || logFields["$key"]="-"
    done
}

takeLogFieldsFromEnvironment() {
    blankLogFields
    setLogField run "${SF_LOG_RUN:-$(basename "$logDir")}"
    setLogField repo "${SF_PROJECT_DIR:-}"
    setLogField ticket "${SF_TICKET:-}"
    setLogField label "${SF_LABEL:-}"
    setLogField agent "${SF_AGENT:-}"
    setLogField branch "${SF_BRANCH:-}"
    setLogField target "${SF_PR_TARGET:-}"
    setLogField session "${SF_SESSION:-}"
    setLogField worktree "${SF_WORKTREE:-}"
}

writeLog() {
    local file="$1"
    shift
    if [[ -n "${SF_LOG_QUIET-}" ]]; then
        printf '%-8s %s\t%s %s\n' "$file" "$(date +%FT%T)" "$(buildLog)" "$*" >> "$logDir/$file"
    else
        printf '%-8s %s\t%s %s\n' "$file" "$(date +%FT%T)" "$(buildLog)" "$*" | tee -a "$logDir/$file"
    fi
}

getSpawnedAgent() {
    sed -n 's/.*backgrounded · \([0-9A-Za-z]\{1,\}\).*/\1/p' "$1" 2>/dev/null | tail -1
}
