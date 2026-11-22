#!/usr/bin/env bash
# user-env.sh — the one environment file the CLI reads: CLI/spider-factory.env, copied there by install-cli.sh
#   from CLI/spider-factory.example.env, edited by hand after that. Sourced by both engines before they read anything.
#   SF_ENV_FILE (CLI/spider-factory.env) points it somewhere else — for a test, or a second tower.
#   A value you exported yourself always survives; this file fills what is unset, it never overwrites.
#   Any KEY=value is loaded, not only SF_* ones — a line that is neither blank, nor a comment, nor
#   KEY=value is named on stderr and skipped, never dropped in silence.
#   SF_AGENT_COMMAND is yours and is what you edit. SF_AGENT_LAUNCH_COMMAND is ours: it is that command with
#   the flags every agent spawn in this repo needs, composed here once so no spawn site carries a flag of its
#   own. It is overwritten on every load and is not a setting — nothing reads it out of the env file.

spiderFactoryEnvDir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
spiderFactoryRoot="$(cd "$spiderFactoryEnvDir/.." && pwd)"
spiderFactoryEnvFile="${SF_ENV_FILE:-$spiderFactoryEnvDir/spider-factory.env}"

source "$spiderFactoryEnvDir/utils/console.sh"

loadSpiderFactoryEnv() {
    local line key value lineNumber=0
    if [[ -f "$spiderFactoryEnvFile" ]]; then
        while IFS= read -r line || [[ -n "$line" ]]; do
            lineNumber=$(( lineNumber + 1 ))
            [[ "$line" =~ ^[[:space:]]*($|#) ]] && continue
            if [[ ! "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
                tell "ignoring $spiderFactoryEnvFile:$lineNumber — not a KEY=value line: $line"
                continue
            fi
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            value="${value//\$HOME/$HOME}"
            if [[ "$value" == \"*\" || "$value" == \'*\' ]]; then
                value="${value:1:${#value}-2}"
            fi
            [[ -n "${!key-}" ]] || export "$key=$value"
        done < "$spiderFactoryEnvFile"
    fi
    export SF_AGENT_LAUNCH_COMMAND="${SF_AGENT_COMMAND:-claude} --add-dir $spiderFactoryRoot"
}
