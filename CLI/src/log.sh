#!/usr/bin/env bash
# log.sh — the logging door of the CLI: `sf log`. Anything outside CLI/src/ that wants a log line comes
#   through here rather than sourcing logging.sh, and knows nothing of the line's shape.
#   sf log write <tag> [detail...]   emit one line, appended to <log-dir>/<tag>
#   The line carries the nine fields the CLI owns, each read from its own environment variable: SF_LOG_RUN
#   (falling back to the name of the log directory), SF_PROJECT_DIR, SF_TICKET, SF_LABEL, SF_AGENT,
#   SF_BRANCH, SF_PR_TARGET, SF_SESSION, SF_WORKTREE. A caller exports them once in its own process and
#   every line after that carries them; one that is unset comes out '-'. The lines land in SF_LOG_DIR,
#   falling back to SF_LOG_ROOT and then the default. SF_LOG_QUIET=1 keeps a line out of stdout.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$here/../utils/console.sh"
source "$here/user-env.sh"
loadSpiderFactoryEnv
source "$here/../utils/logging.sh"

nameTheSpeaker log

logDir="${SF_LOG_DIR:-${SF_LOG_ROOT:-$HOME/.spider-factory/logs}}"

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

commandWrite() {
    [[ $# -ge 1 ]] || die "usage: sf log write <tag> [detail...]"
    mkdir -p "$logDir" 2>/dev/null || die "cannot create $logDir"
    takeLogFieldsFromEnvironment
    writeLog "$@"
}

unknownLogCommand() {
    die "unknown log command '$1' — there is one: 'sf log write <tag> [detail...]'. Try 'sf --help'."
}

runLogCommand() {
    local requested="${1:-}"
    case "$requested" in
        write)
            commandWrite "${@:2}"
            ;;
        *)
            unknownLogCommand "$requested"
            ;;
    esac
}

runLogCommand "$@"
