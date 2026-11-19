#!/usr/bin/env bash
# user-env.sh — the one environment file the CLI reads: CLI/spider-factory.env, copied there by install-cli.sh
#   from CLI/spider-factory.example.env, edited by hand after that. Sourced by both engines before they read anything.
#   SF_ENV_FILE (CLI/spider-factory.env) points it somewhere else — for a test, or a second tower.
#   A value you exported yourself always survives; this file fills what is unset, it never overwrites.

spiderFactoryEnvDir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
spiderFactoryEnvFile="${SF_ENV_FILE:-$spiderFactoryEnvDir/spider-factory.env}"

loadSpiderFactoryEnv() {
    local line key value
    [[ -f "$spiderFactoryEnvFile" ]] || return 0
    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ "$line" =~ ^[[:space:]]*(SF_[A-Z_]+)=(.*)$ ]] || continue
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        value="${value//\$HOME/$HOME}"
        [[ -n "${!key-}" ]] || export "$key=$value"
    done < "$spiderFactoryEnvFile"
}
