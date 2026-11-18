#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

npx --yes likec4@1.60.0 validate .
npx --yes likec4@1.60.0 build --output-single-file --use-hash-history -o dist .

page="$(find dist -name index.html | head -1)"
echo "built: $(pwd)/$page"
