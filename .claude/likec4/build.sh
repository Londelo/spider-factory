#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

npx likec4 build --output-single-file --use-hash-history -o dist .

page="$(find dist -name index.html | head -1)"
python3 -I - "$page" help.html <<'PY'
import sys
page, panel = sys.argv[1], sys.argv[2]
html = open(page).read()
snippet = open(panel).read()
marker = '<!-- bo-help-panel -->'
html = html.replace(marker, '')
if 'id="bo-help-fab"' in html:
    pass
else:
    html = html.replace('</body>', marker + snippet + '\n</body>', 1)
open(page, 'w').write(html)
PY

echo "built: $(pwd)/$page"
