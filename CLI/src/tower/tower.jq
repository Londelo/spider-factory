def parseId:
    .id as $id
    | ([$id | capture("^(?<repo>.+)-(?<kind>epic|feature|task)-(?<uuid>[0-9a-f]+)-(?<hier>[0-9]+(\\.[0-9]+)*)$")][0]) as $m
    | if $m == null then . + { filed: false } else
        ($m.hier | split(".")) as $p
    | . + {
        filed: true, repo: $m.repo, kind: $m.kind, uuid: $m.uuid,
        head: ($p[0] | tonumber)
      } end;

def headRank: if .head == 0 then 1000000000 else .head end;

def topoRank($edges):
    . as $ids
    | (reduce $edges[] as $e ({};
         .[$e.issue_id] = ((.[$e.issue_id] // []) + [$e.depends_on_id]))) as $blockers
    | (reduce $ids[] as $i ({}; .[$i] = 0)) as $zero
    | reduce range(0; ($ids | length)) as $_ ($zero;
        . as $rank
        | reduce $ids[] as $i ($rank;
            ([ ($blockers[$i] // [])[] | $rank[.] // 0 ] | max // 0) as $depth
            | if $depth + 1 > .[$i] then .[$i] = $depth + 1 else . end
          )
      );

def transitiveBlockers($edges):
    . as $ids
    | (reduce $edges[] as $e ({};
         .[$e.issue_id] = ((.[$e.issue_id] // []) + [$e.depends_on_id]))) as $direct
    | (reduce $ids[] as $i ({}; .[$i] = ($direct[$i] // []))) as $seed
    | reduce range(0; ($ids | length)) as $_ ($seed;
        . as $seen
        | reduce $ids[] as $i ($seen;
            .[$i] = ( ( ($direct[$i] // [])
                        + [ (($direct[$i] // [])[]) as $b | ($seen[$b] // [])[] ] )
                    | unique )
          )
      );

def glyph:
    if .status == "closed" then "✓"
    elif .status == "in_progress" then "▶"
    elif .status == "failed-agent" then "!"
    elif .status == "deferred" then "~"
    elif .status == "cancelled" then "✗"
    elif .status == "open" and (.ready // false) then "◆"
    elif .status == "open" then "·"
    else "?" end;

def shortDate: (.closed_at // "") | if . == "" then "-" else .[0:10] end;

def tag:
    if .kind == "epic" then "gate:epic"
    elif .kind == "feature" then "gate:feature"
    elif (.labels | length) > 0 then (.labels | join(","))
    else "-" end;

def pad($w): . + (" " * ($w - ([ (.|length), $w ] | min)));

def gutter: (.ord | if . == null then "-" else (. | tostring) end) | ("   " + .) | .[-4:] + " ";

def conn($isLast): if $isLast then "└─ " else "├─ " end;
def guide($isLast): if $isLast then "   " else "│  " end;

def columns($idw):
    [ gutter, .line, (.id | pad($idw)), " " + glyph + " ", (tag | pad(14)), " " + shortDate + "  ", (.title // "") ] | join("");

def tally:
    . as $rows
    | ($rows | map(select(.status == "closed")) | length) as $done
    | ($rows | map(select(.status == "in_progress")) | length) as $running
    | ($rows | map(select(.status == "open" and (.ready // false))) | length) as $ready
    | ($rows | map(select(.status == "open" and ((.ready // false) | not))) | length) as $waiting
    | ($rows | map(select(.status == "deferred" or .status == "failed-agent" or .status == "cancelled")) | length) as $other
    | "\($rows | length) tickets  \($done) closed  \($running) running  \($ready) ready  \($waiting) waiting"
      + (if $other > 0 then "  \($other) other" else "" end);

def numberWithin:
    . as $rows
    | ($rows | map(select(.status == "closed")) | sort_by([.closed_at, .expected])
     | to_entries | map({key: .value.id, value: (.key + 1)}) | from_entries) as $done
    | ($rows | map(select(.status != "closed")) | sort_by(.expected)
     | to_entries | map({key: .value.id, value: (.key + ($done | length) + 1)}) | from_entries) as $next
    | ($done + $next) as $ord
    | $rows | map(. + { ord: ($ord[.id] // null) });

def shapeOf:
    . as $tower
    | ($tower | map(select(.kind == "epic")) | .[0]
       // { id: "(no epic gate)", status: "missing", kind: "epic", labels: [], closed_at: null,
            ready: false, title: "no row carries this uuid at hierarchy 0" }) as $epic
    | ($tower | map(select(.kind == "feature")) | sort_by(.expected)) as $features
    | ($tower | map(select(.kind == "task"))) as $tasks
    | ($tasks | map(select(.head == 0)) | sort_by(.expected)) as $epicTier
    | ($tasks | map(select(.head != 0 and (.head as $h | ($features | map(.head) | index($h)) == null)))) as $orphans
    | ( [ $features[] | . as $f
          | { row: $f,
              tasks: ($tasks | map(select(.head == $f.head)) | sort_by(.expected)),
              parent: null } ]
        + [ $epicTier[] | { row: ., tasks: [], parent: null } ]
        + [ $orphans[]  | { row: ., tasks: [], parent: null } ]
      ) as $nodes
    | ($nodes | map(.row.id)) as $nodeIds
    | ($tower | map(.id) | unique | transitiveBlockers($deps)) as $reach
    | (reduce $nodes[] as $n ({}; .[$n.row.id] = 1)) as $one
    | reduce range(0; ($nodes | length)) as $_ ($one;
        . as $depth
        | reduce $nodes[] as $n ($depth;
            ( [ ($reach[$n.row.id] // [])[] | select(. as $b | $nodeIds | index($b)) ] ) as $prec
            | (([ $prec[] | $depth[.] // 1 ] | max // 1) + 1) as $d
            | if $d > .[$n.row.id] then .[$n.row.id] = $d else . end
          )
      ) as $depth
    | $nodes
    | map(
        . as $n
        | ( [ ($reach[$n.row.id] // [])[] | select(. as $b | $nodeIds | index($b)) ] ) as $prec
        | ( $prec | sort_by([ ($depth[.] // 1), ($nodeIds | index(.)) ]) | (last // null) ) as $parent
        | $n + { parent: $parent }
      )
    | { root: $epic, nodes: . };

def render($node; $byParent; $prefix; $isLast):
    ( ( ($node.tasks // []) | map({ row: ., tasks: [], parent: null }) )
      + ( $byParent[($node.row.id | tostring)] // [] ) ) as $kids
    | [ ($node.row + { line: ($prefix + conn($isLast)) }) ]
      + ( [ $kids | to_entries[]
            | render(.value; $byParent; $prefix + guide($isLast); (.key + 1) == ($kids | length))
          ] | flatten );

def linesOf($shape):
    (reduce $shape.nodes[] as $n ({};
        .[($n.parent | tostring)] = ((.[$n.parent | tostring] // []) + [$n]))) as $byParent
    | ( [ $shape.nodes[] | select(.parent == null) ] ) as $tops
    | [ ($shape.root + { line: "" }) ]
      + ( [ $tops | to_entries[]
            | render(.value; $byParent; ""; (.key + 1) == ($tops | length))
          ] | flatten );

[ .[]
| select(.id != null)
| { id, status, title, issue_type,
    labels: (.labels // []),
    closed_at,
    created_at,
    ready: ((.id as $i | $ready | index($i)) != null) }
| parseId
| . + { line: "" }
] as $rawRows
| ($rawRows | map(.id) | unique) as $allIds
| ($allIds | topoRank($deps)) as $rank
| ($rawRows | map(. as $r | $r + { rank: ($rank[$r.id] // 0), expected: [($r | headRank), ($rank[$r.id] // 0)] })) as $rows
| ($rows | map(.id | length) | max // 0) as $idw
| ($rows | map(select(.filed)) | group_by(.uuid)) as $towers
| ($rows | map(select(.filed | not))) as $unfiled
| [ "\($towers | length) towers  \($rows | length) tickets"
     + (if ($unfiled | length) > 0 then "  \($unfiled | length) unfiled" else "" end) ]
  + (
      $towers
      | map(
          numberWithin
          | . as $numbered
          | ( [ "── \($numbered[0].uuid)  \($numbered | tally)" ]
              + (linesOf ($numbered | shapeOf) | map(columns($idw)))
              + [ "" ]
            )
        )
      | flatten
    )
  + (if ($unfiled | length) > 0
     then ([ "── unfiled  ids that do not read <repo>-<kind>-<uuid>-<hierarchy>" ]
           + ($unfiled | map(.line = "    " | columns($idw))))
     else [] end)
  | .[]
