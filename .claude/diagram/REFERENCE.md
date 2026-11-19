# How to edit these diagrams

The reference for anyone touching `.claude/diagram/`. Read it before you change a box, an arrow or a
step — most of what is wrong with a diagram here was written from memory.

| File | Holds |
|---|---|
| `model.c4` | every node: its title, its `summary` (the one line drawn in the box), its `description` (the panel that opens when you click it) |
| `views.c4` | the four walkthroughs; each step is `A -> B "the words on the arrow" { title, notes }` |
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
`CLI/src/overseer-agent.sh`, `CLI/src/commit.sh`, `CLI/src/console.sh` (every word any of them says to a
terminal, and the four reused refusals), `CLI/src/loop-log.sh`, `CLI/src/forge.sh`,
`CLI/src/user-env.sh`, `CLI/src/clone-webs.sh`, `CLI/src/create-beads/*`, `CLI/install-cli.sh`,
`CLI/uninstall-cli.sh`,
`CLI/spider-factory.example.env`, `webs/webs.example.yml`, `.claude/hooks/worker-stop.sh`,
`.claude/hooks/worker-fail.sh`, `.claude/hooks/hooks.json`, `.claude/agents/*`, `.claude/skills/*`.

**These diagrams are tier 3 of three.** The code is the only real source of truth; above it sit two documents
that point down here:

| Tier | File | Reader | Depth |
|---|---|---|---|
| 1 · the snapshot | `README.md` (repo root) | a human passing through | the idea, the setup, the webs, the CLI, the workflow — brief, and it owns no fact nobody else owns |
| 2 · the reference | `.claude/CLAUDE.md` | an agent doing the work | the vocabulary, the moving parts, the rules that break the system — detailed, not exhaustive, and it points here |
| 3 · the account | `diagram/` (here) | a human who is not in the code | the most detailed thing outside the code — the thing people quote, and the thing that must not drift |

A fact lives at the deepest tier that owns it and nowhere else; a shallower tier points down rather than
repeating it. So a fact you change here, you change here first, and then you check the two tiers above it
did not keep an old copy.

**These files are updated by a spawned agent, before every commit.** Nothing commits until all three tiers
match the code — see `.claude/CLAUDE.md` §Documentation. If you are that agent: read the code, never your
memory of it; do the whole set — `README.md`, `.claude/CLAUDE.md`, and these diagrams — in one pass; rebuild
`dist/`; and report which file, which node or step, and which line of code you read to get it right.

## The four things, checked every time

Check each thing you touched — and everything its change touches — against the code, not against your
memory of the code.

1. **The node's title.** Does the code contain a thing by that name? A title that names a command is
   checked by reading its argument handling (`case`), not by assuming a CLI has the subcommands its name
   implies. A title that names a file is checked by the file existing at that path.
2. **The node's `summary`.** One line, under 150 characters, true read on its own. This is the *only*
   text the box draws — a node with no summary draws its whole description inside the box and the borders
   break.
3. **The node's `description`.** Every table row, every flag, every "it never does X" traces to a line you
   actually read. One node owns each fact: where two nodes state the same fact, one of them will
   eventually drift, and nothing compares them.
4. **The arrow and its step notes.** The words on the arrow say what happens at that moment; `title` is
   the decision, `notes` is if/then. A step never restates what the node it points at already owns — point
   at the node instead ("the eight are listed on the node itself").

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
- **What a thing *is* belongs on the node**, in the panel you click open, never in the step.
- **A step nobody can parse is deleted, not defended.**

## Grammar that costs an hour when you get it wrong

- `#tag` lines come **before** `summary` and `description`, or the parser dies with
  `Expecting token of type '}' but found #`.
- A node with a `description` must carry a `summary`; a `summary` over 150 characters is rejected.
- `notes """` and its closing `"""` each sit alone on their own line, and nothing from the old note may
  survive after the closing quotes.
- A step block ends at the `}` indented four spaces. A stray `{ }` after a `title` breaks validate.
- Bare, unqualified names of nested nodes do not resolve — write `machine.dispatcher`, not `dispatcher`.
- Nested actors inside a sequence view warn (`Sequence view does not support nested actors`); about eleven
  of those warnings is the normal state of this project, not a regression.
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
