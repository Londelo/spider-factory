# How to edit these diagrams

The reference for anyone touching `.claude/diagram/`. Read it before you change a box, an arrow or a
step — most of what is wrong with a diagram here was written from memory.

| File | Holds |
|---|---|
| `model.c4` | every node: its title and its `summary` — those two are the box. Only an agent node or a ticket/gate node also carries a `description`, which is the body of the modal the top-right button opens; `link` lines are that modal's buttons |
| `views.c4` | the four walkthroughs; each step is `A -> B "the words on the arrow" { title }` — **no `notes`, ever** |
| `specification.c4` | the palette: one colour and shape per KIND of thing, never per element |
| `dist/` | built output — never hand-edited, only rebuilt |

## The rule this reference exists for

**The code is the only source of truth.** A diagram is a set of claims about the code, and a claim
nobody checked is a bug.

Before writing a line about a thing, open the file that thing lives in and read it. Never write from
memory, from an earlier version of the diagram, from a commit message, or from what a name suggests. If
the code says one thing and the diagram says another, **the diagram is wrong** — including when you wrote
it yesterday.

The files the diagrams describe: `CLI/bin/sf`, `CLI/src/beads-loop/` (`index.sh` plus the nine files beside it —
the engine is a directory now, and a link into it must name the file that actually holds the code),
`CLI/src/plan-agent.sh`,
`CLI/src/overseer-agent.sh`, `CLI/src/tower/` (`index.sh` and the jq program `tower.jq` beside it — the picture
engine, the one command engine that runs no agent and writes nothing), `CLI/src/commit.sh`,
`CLI/utils/console.sh` (every word any of them says to a
terminal, the four reused refusals, and the one `requireBeadsProject` probe every command that needs a tower calls), `CLI/utils/logging.sh` (the one definition of a log line, sourced by the
engine and by the Stop hook and by nothing else), `CLI/utils/forge.sh`,
`CLI/utils/spawn.sh` (the one place a claude session gets started and an agent's existence is proved, sourced by
the engine and by both foreground engines),
`CLI/utils/user-env.sh`, `scripts/clone-webs.sh`, `CLI/src/create-beads/*`, `CLI/install-cli.sh`,
`CLI/uninstall-cli.sh`,
`CLI/spider-factory.example.env`, `webs/webs.example.yml`, `CLI/src/agent-hooks/worker-stop.sh`
(one engine like every other one, located by `locateEngines` in `CLI/bin/sf`,
and registered — by the `hooks:` frontmatter of the seven worker agents, which
reaches it as `sf hook stop`; there is no hooks.json and no `.claude/settings.json`),
`.claude/agents/*`, `.claude/skills/*`.

The layout behind that list: `CLI/src/` holds what `bin/sf` runs plus the concern files under each command,
`CLI/utils/` the bash more than one command sources (`console.sh`, `logging.sh`, `forge.sh`, `spawn.sh`,
`user-env.sh`),
and `scripts/` what npm runs.
A file that moves breaks every link and every path that named it — grep the whole `.claude/diagram/` directory
for the old path, not just the node you came to fix.

**These diagrams are tier 3 of three.** The code is the only source of truth, and above it sit `README.md` and
`.claude/CLAUDE.md`, both pointing down here. A fact lives at the deepest tier that owns it and nowhere else —
so a fact you change here, you change here first, then check the two tiers above did not keep an old copy.

**The tiers, their depths, the three agents, the `DOCS LAST RUN FROM:` span and the rule that docs move only
when Londelo asks are owned by the `sf-documentation` skill. Load it; do not restate it here.** If you are that
agent: read the code, never your memory of it; rebuild `dist/` when you are done; and report which file, which
node or step, and which line of code you read to get it right.

## The four things, checked every time

Check each thing you touched — and everything its change touches — against the code, not against your
memory of the code.

1. **The node's title.** Does the code contain a thing by that name? A title that names a command is
   checked by reading its argument handling (`case`), not by assuming a CLI has the subcommands its name
   implies. A title that names a file is checked by the file existing at that path.
2. **The node's `summary`.** One line, under 150 characters, true read on its own. This is the *only*
   text the box draws — a node with no summary draws its whole description inside the box and the borders
   break.
3. **The node's `description` — and only two kinds of node have one.**
   - **An agent node** (a worker, a plan agent, the overseer) carries its verbatim frontmatter `description:`
     line, its `tools:` list, and the **names** of the skills it loads. Nothing about the skills themselves.
   - **A ticket or gate node** carries the schema block: `title / label → AGENT → agent / category / id /
     metadata / depends / blocks / skill`.
   - **Everything else — every other node in `model.c4` — has no `description` at all.** Title and `summary`,
     plus any `link`, and nothing more. That is the rule, not a stage of condensing: files, engines, layers,
     log artifacts, alarms, waiting lines, external systems are a title and one line, forever. Write one and
     you have to delete it; the code and `.claude/CLAUDE.md` own any detail beyond the line.
   Where a description does exist, every claim in it traces to a line you actually read, and one node owns
   each fact: where two nodes state the same fact, one of them will eventually drift, and nothing compares them.
4. **The arrow and its `title`.** The words on the arrow say what happens at that moment; `title` is the
   decision. **A step carries no `notes` block — there are none, and none are ever added back.** Because a
   non-agent node says nothing beyond its one `summary` line, the step carries what that node is being **used
   for here**: where a step's label was thin because a note used to carry the weight, the missing words go in
   the arrow text or the `title`. A step still never restates what the node it points at already owns.

Then check the four **against each other**: a step describing an action its target node contradicts, an
arrow promising something the code never does, a summary claiming more than its description proves, a node
in `model.c4` that no walkthrough includes (it never renders), or a step pointing at a node that no longer
exists (validate fails).

## What makes a walkthrough readable

- **If/then, never prose.** `If the gate carries no pull request url, then: push the branch, open the
  pull request, write the url on the gate. If any of that fails, the ticket stays claimed.`
- **One moment per step.** A step says only what happens *at* that step.
- **Repeated rounds repeat the structure, never the prose.** Every round draws the same four arrows — the loop
  claims, the claim hands over a ticket, that ticket's label calls its worker, the worker does the work — so the
  reader can see it is a loop and see which ticket belongs to which worker. What is capped is the words: one or
  two lines naming the ticket, its tier, and what its close releases. Collapsing a round to a single
  `dispatcher -> worker` arrow hides both, and is the failure this bullet exists to prevent.
- **What a thing *is* belongs on the node's `summary`; what it is doing *here* belongs on the step.** For most
  nodes the `summary` is the whole of what the node says — there is no modal to open. Only an agent or a ticket
  goes further, per the depth rule above. The arrow and the `title` carry the moment. Neither repeats the other.
- **A step nobody can parse is deleted, not defended.**

## Grammar that costs an hour when you get it wrong

- `#tag` lines come **before** `summary` and `description`, or the parser dies with
  `Expecting token of type '}' but found #`.
- A node with a `description` must carry a `summary`; a `summary` over 150 characters is rejected.
- A node may hold `title`, `summary`, `description`, `technology`, `metadata { KEY VALUE }`, `link URL
  "Label"`, `navigateTo <view>`, `icon`, `style { }`, `#tags` and its `kind`. The box draws the title and the
  `summary`; the modal the top-right button opens is the `description`, the `technology`, the `metadata` rows
  and the `link` buttons. The bottom button lists the node's arrows and is built from the relationship lines —
  nothing is authored for it. We use `title`, `summary`, `description` (two kinds of node only) and `link`.
- **There is no `notes` block.** All 122 were deleted on 2026-11-25 and the word survives in `views.c4` only
  as the comment forbidding it. Write a step as `{ title: "..." }` and nothing more.
- A step block ends at the `}` indented four spaces. A stray `{ }` after a `title` breaks validate.
- Bare, unqualified names of nested nodes do not resolve — write `machine.dispatcher`, not `dispatcher`.
- Nested actors inside a sequence view warn (`Sequence view does not support nested actors`); twelve
  of those warnings is the normal state of this project, not a regression. `build` validates and then lays out, so
  it prints the same twelve twice — twenty-four out of `build.sh`, twelve out of a bare `validate`, and neither is
  a new warning.
- A dynamic step may create its own relationship — there is no relationship block to update.
- Renaming or deleting a node means grepping `views.c4` for it first.

## Prove it, in this order

```bash
cd .claude/diagram
npx --offline likec4@1.60.0 validate .        # must end: ✓ Valid (3 files)
npx --offline likec4@1.60.0 build --output-single-file --use-hash-history -o dist .
chromium --headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=1600,1200 \
  --virtual-time-budget=14000 --screenshot=/tmp/l4check/<name>.png \
  "file://$PWD/dist/index.html#/view/<viewId>/" 2>/dev/null
```

Then **look at the screenshot.** Text crossing a border means a node is missing its `summary`. A box that
vanished means it fell out of the view's `include` list. One chromium command per run — no loops.

Count, don't eyeball, so a lost line cannot hide in a diff:

```bash
grep -c "^    [a-zA-Z.]* -> " views.c4    # steps
grep -c "navigateTo" views.c4              # links between walkthroughs
git diff --numstat                         # +N/-0 when you only added
```

The four `<viewId>`s: `index` (the plan), `theLoop` (the run), `theLogs` (the log), `everyFailure` (the
alarms).

## When you are finished

Say which file, which node or step, and **which line of code you read** to get it right. If you deleted a
step, say what the walkthrough no longer says: a fact dropped quietly is worse than the wrong fact, because
nothing is left pointing at it.
