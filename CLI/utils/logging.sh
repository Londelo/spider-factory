#!/usr/bin/env bash
# logging.sh — the one definition of a log line, sourced by CLI/src/beads-loop/index.sh and by
#   CLI/src/agent-hooks/worker-stop.sh, and by nothing else. The engine seeds the fields once and carries
#   them in process memory; a one-shot caller with no process fills them from its own environment with
#   takeLogFieldsFromEnvironment.
#   <tag padded to 8> <ISO time>\trun=… repo=… ticket=… label=… agent=… branch=… target=… session=… worktree=… <detail>
#   The tag is also the file the line appends to under $logDir. Carry a value on every line with
#   setLogField <key> <value>; pass anything one line only (a step, a gate, an exit code) to writeLog as detail.
#   SF_LOG_QUIET=1 keeps the line out of stdout, which the hooks need and the engine does not.
#   The file keeps the line above exactly as it is; stdout gets a five-line block instead — repo, local time,
#   a colour-coded status word, the sentence, the context — separated from the block before it by one blank line.
logFieldNames=(run repo ticket label agent branch target session worktree)
declare -A logFields=()

sfColorReset=$'\033[0m'
sfColorInfo=$'\033[0;37m'
sfColorWarn=$'\033[0;33m'
sfColorError=$'\033[0;31m'
sfColorGood=$'\033[0;32m'

declare -A logStatusGlyph=([errors]='✗' [waiting]='◆' [claims]='✓' [results]='▪')
declare -A logStatusWord=([errors]=ERROR [waiting]=WAITING [claims]=DISPATCHED [results]=RUN)
declare -A logStatusColor=([errors]="$sfColorError" [waiting]="$sfColorWarn" [claims]="$sfColorGood" [results]="$sfColorInfo")
declare -A waitingReasonWords=(
    [max_parallel]='at capacity — the workers are full'
    [max_parallel_stalled]='at capacity with nothing in progress'
    [frontier_empty]='the frontier is empty — nothing is ready'
    [tower_stalled]='the tower is stalled — nothing is ready'
)

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
        value="${logFields[$key]-}"
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

readableReason() {
    local reason="$1"
    [[ -n "${waitingReasonWords["$reason"]+set}" ]] && { printf '%s' "${waitingReasonWords["$reason"]}"; return; }
    printf '%s' "${reason//[-_]/ }"
}

logDetailValue() {
    local key="$1" detail="$2" re
    re="(^|[[:space:]])$key=\"([^\"]*)\""
    [[ "$detail" =~ $re ]] && { printf '%s' "${BASH_REMATCH[2]}"; return 0; }
    re="(^|[[:space:]])$key=([^[:space:]]+)"
    [[ "$detail" =~ $re ]] && { printf '%s' "${BASH_REMATCH[2]}"; return 0; }
    return 1
}

logPair() {
    local key="$1" value="$2"
    [[ -n "$value" && "$value" != "-" ]] || return 1
    [[ "$key" == target ]] && printf '→ %s   ' "$value" || printf '%s %s   ' "$key" "$value"
}

logFieldPairs() {
    local key line=""
    for key in ticket label agent branch target; do
        line+="$(logPair "$key" "${logFields[$key]-}")"
    done
    printf '%s' "$line"
}

logDetailPairs() {
    local detail="$1" re='([A-Za-z_][A-Za-z0-9_-]*)=("[^"]*"|[^[:space:]]+)' match key value prefix line=""
    while [[ "$detail" =~ $re ]]; do
        match="${BASH_REMATCH[0]}"
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]#\"}"
        value="${value%\"}"
        prefix="${detail%%"$match"*}"
        detail="${detail#"$prefix"}"
        detail="${detail:${#match}}"
        [[ "$key" == reason || "$key" == msg || "$key" == kind ]] && continue
        line+="$(logPair "$key" "$value")"
    done
    printf '%s' "$line"
}

logSentence() {
    local tag="$1" detail="$2" reason sentence
    reason="$(logDetailValue reason "$detail" || true)"
    if [[ "$tag" == claims ]]; then
        [[ "$reason" == bypassed ]] && { printf 'closed a bypass peg — it holds dependencies and is never worked'; return; }
        [[ "$reason" == dispatched ]] && {
            printf '%s dispatched on %s' "${logFields[agent]-the agent}" "${logFields[ticket]-its ticket}"
            return
        }
    fi
    sentence="$(logDetailValue msg "$detail" || true)"
    [[ -n "$sentence" ]] && { printf '%s' "$sentence"; return; }
    [[ -n "$reason" ]] && { readableReason "$reason"; return; }
    return 1
}

renderLogBlockForTerminal() {
    local tag="$1" detail="$2" repo name colour glyph word sentence detailPairs context
    printf '\n'
    repo="${logFields[repo]-}"
    [[ -z "$repo" || "$repo" == "-" ]] && repo="$PWD"
    name="${repo##*/}"
    colour="${logStatusColor[$tag]-$sfColorInfo}"
    glyph="${logStatusGlyph[$tag]-▪}"
    word="${logStatusWord[$tag]-${tag^^}}"
    sentence="$(logSentence "$tag" "$detail" || true)"
    detailPairs="$(logDetailPairs "$detail")"
    context="$(logFieldPairs)"
    if [[ -n "$sentence" ]]; then
        context+="$detailPairs"
    else
        sentence="${detailPairs%   }"
    fi
    local info="$sfColorInfo" reset="$sfColorReset"
    [[ -t 1 ]] || { info=""; reset=""; colour=""; }
    printf '%s\n' "$info  $name  ·  $repo$reset"
    printf '%s\n' "$info  $(date '+%a %Y-%m-%d  %-I:%M:%S %p')$reset"
    printf '%s\n' "$colour  $glyph $word$reset"
    [[ -n "$sentence" ]] && printf '%s\n' "$info  $sentence$reset"
    [[ -n "$context" ]] && printf '%s\n' "$info  ${context%   }$reset"
    return 0
}

writeLog() {
    local file="$1"
    shift
    printf '%-8s %s\t%s %s\n' "$file" "$(date +%FT%T)" "$(buildLog)" "$*" >> "$logDir/$file"
    [[ -n "${SF_LOG_QUIET-}" ]] || renderLogBlockForTerminal "$file" "$*"
}

getSpawnedAgent() {
    sed -n 's/.*backgrounded · \([0-9A-Za-z]\{1,\}\).*/\1/p' "$1" 2>/dev/null | tail -1
}
