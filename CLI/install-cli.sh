#!/usr/bin/env bash
# install-cli.sh — the hand-rolled "npm link": symlink bo onto PATH. No node.
# Run this once after installing the plugin:
#   bash "$(claude plugin details binary-obelisk --json | jq -r '.root')/CLI/install-cli.sh"
set -euo pipefail
here="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"   # .../CLI
binDir="$HOME/.local/bin"
mkdir -p "$binDir"
ln -sf "$here/bin/bo" "$binDir/bo"
case ":$PATH:" in
    *":$binDir:"*) ;;
    *) echo "bo: add  export PATH=\"$binDir:\$PATH\"  to your shell profile." >&2 ;;
esac
echo "installed: $binDir/bo -> $here/bin/bo"
