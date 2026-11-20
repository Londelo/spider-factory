#!/usr/bin/env bash
# log.sh — the logging door of the CLI: `sf log`. Anything outside CLI/src/ that wants a log line comes
#   through here rather than sourcing logging.sh, and knows nothing of the line's shape.
#   sf log seed <log-dir> <repo>     start a fresh set of fields for a run
#   sf log field <key> <value>       carry a value on every line after this one
#   sf log clear                     drop every field but run and repo
#   sf log write <tag> [detail...]   emit one line, appended to <log-dir>/<tag>
#   The fields a caller sets have to survive between one `sf` process and the next, so they live in the
#   file $SF_LOG_FIELDS names — a caller that sets fields more than once names that file itself, once.
#   Unset, it is scratch under the run's log directory, keyed by SF_TICKET. SF_LOG_QUIET=1 keeps a line
#   out of stdout and leaves it in the file.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/../utils/console.sh"
source "$here/user-env.sh"
loadSpiderFactoryEnv
source "$here/../utils/logging.sh"

nameTheSpeaker log

logDir="${SF_LOG_DIR:-${SF_LOG_ROOT:-$HOME/.spider-factory/logs}}"

fieldsFile() {
    printf '%s' "${SF_LOG_FIELDS:-$logDir/fields-${SF_TICKET:-$$}}"
}

openFieldsFile() {
    local file
    file="$(fieldsFile)"
    mkdir -p "$(dirname "$file")" 2>/dev/null || true
    printf '%s' "$file"
}

readFieldsIntoMemory() {
    local file key value
    blankLogFields
    file="$(fieldsFile)"
    [[ -r "$file" ]] || return 0
    while IFS='=' read -r key value; do
        [[ -n "$key" ]] || continue
        [[ -n "${logFields["$key"]+set}" ]] || continue
        [[ -n "$value" ]] || value="-"
        logFields["$key"]="$value"
    done < "$file"
}

writeFieldsOutOfMemory() {
    local key file
    file="$(openFieldsFile)"
    : > "$file" || die "cannot write $file"
    for key in "${logFieldNames[@]}"; do
        printf '%s=%s\n' "$key" "${logFields[$key]}" >> "$file"
    done
}

commandSeed() {
    [[ $# -ge 2 ]] || die "usage: sf log seed <log-dir> <repo>"
    logDir="$1"
    mkdir -p "$logDir" 2>/dev/null || die "cannot create $logDir"
    seedStartingLogFields "$logDir" "$2"
    writeFieldsOutOfMemory
}

commandField() {
    [[ $# -ge 1 ]] || die "usage: sf log field <key> [value]"
    readFieldsIntoMemory
    setLogField "$1" "${2-}"
    writeFieldsOutOfMemory
}

commandClear() {
    readFieldsIntoMemory
    clearLogFields
    writeFieldsOutOfMemory
}

commandWrite() {
    [[ $# -ge 1 ]] || die "usage: sf log write <tag> [detail...]"
    mkdir -p "$logDir" 2>/dev/null || die "cannot create $logDir"
    readFieldsIntoMemory
    writeLog "$@"
}

unknownLogCommand() {
    die "unknown log command '$1' — there are four: 'sf log seed <log-dir> <repo>', 'sf log field <key> <value>', 'sf log clear', 'sf log write <tag> [detail...]'. Try 'sf --help'."
}

runLogCommand() {
    local requested="${1:-}"
    case "$requested" in
        seed)
            commandSeed "${@:2}"
            ;;
        field)
            commandField "${@:2}"
            ;;
        clear)
            commandClear
            ;;
        write)
            commandWrite "${@:2}"
            ;;
        *)
            unknownLogCommand "$requested"
            ;;
    esac
}

runLogCommand "$@"
