#!/usr/bin/env bash
# user-env.sh — the one environment file the CLI reads: ~/.obelisk.env, copied there by install-cli.sh
#   from CLI/default.env, edited by hand after that. Sourced by both engines before they read anything.
#   BO_ENV_FILE (~/.obelisk.env) points it somewhere else — for a test, or a second tower.
#   A value you exported yourself always survives; this file fills what is unset, it never overwrites.

obeliskEnvFile="${BO_ENV_FILE:-$HOME/.obelisk.env}"

loadObeliskEnv() {
    local line key value
    [[ -f "$obeliskEnvFile" ]] || return 0
    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ "$line" =~ ^[[:space:]]*(BO_[A-Z_]+)=(.*)$ ]] || continue
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        value="${value//\$HOME/$HOME}"
        [[ -n "${!key-}" ]] || export "$key=$value"
    done < "$obeliskEnvFile"
}
