---
name: sf-documentation
description: >
  How to run a documentation pass over spider-factory's three tiers — the README snapshot, the
  `.claude/CLAUDE.md` reference, and the `.claude/diagram/` account. One command of intent from Londelo
  ("update the docs", "the docs are stale", "run a doc pass") becomes three agents spawned at once, one
  per tier, each reading the code and never its own memory of it, each told which tier it owns and that
  the other two are moving beside it. The pass's whole brief is the commit span since the last pass, read
  from the `DOCS LAST RUN FROM:` anchor that lives in `.claude/CLAUDE.md`; the pass that lands rewrites
  that anchor to its own starting sha. Docs move only when Londelo asks — a `commit` never triggers a
  pass. Use it whenever the request is to write, update, condense, or fix spider-factory's documentation.
  Trigger: "update the documentation", "update the docs", "run a doc pass", "the docs are stale",
  "refresh the documentation", "update the diagram", "update the readme", "update CLAUDE.md",
  "document this", "sf-documentation".
---

# Updating spider-factory's documentation

## The three tiers

They are not interchangeable. Each has its reader and its depth, a fact belongs at the deepest tier that
owns it, and the shallower tiers point down instead of repeating it.

| Tier | File | Reader | Depth |
|---|---|---|---|
| 1 · the snapshot | `README.md` (repo root) | a human passing through | an elevator pitch per section — the constraints, the principles, the ticket shape, the quick start. As short as possible; it owns no fact nobody else owns |
| 2 · the reference | `.claude/CLAUDE.md` | an agent doing the work | the working knowledge: the flow, the ticket structure and how it drives the loop, the rules that break the system, the condensed gotchas. General understanding, not a record of every decision |
| 3 · the account | `.claude/diagram/` | a human who is not in the code | the walkthroughs are **lines and tiny nodes only — no `notes` block, ever**. A node is its **title and its `summary`**; only an **agent** node and a **ticket or gate** node carry a `description`, and every other node has none. `.claude/diagram/REFERENCE.md` owns the rest of the craft — the fields and where each renders, the depth rule, the grammar, the build. The **translated** account, and the thing people quote — so it must not drift |

**The code is the only source of truth, above all three.** A document is a set of claims about the code, and
a claim nobody checked is a bug. When any tier disagrees with the code, that tier is wrong — including the one
you wrote yesterday.

## The rule before you start

**The documents move when Londelo asks for them, and at no other time.** A `commit` never triggers a doc pass
— not by itself, not "just this once", not because the change looks big. Between passes the tiers are claims
nobody checked, and that is accepted, not overlooked: it is what makes a small fix cheap.

## Where a pass starts

`.claude/CLAUDE.md` carries one anchor line:

```
DOCS LAST RUN FROM: <sha>
```

Read it first. It names the commit the last pass ran from, and it is the pass's whole brief:

```
git log --oneline <that sha>..HEAD
```

is every change that can have made a claim stale, and nothing before it is re-read. Each agent works that
span, not the repo. If the span is empty there is nothing to do — say so and stop.

## The pass

**Spawn three agents at once, one per tier, in a single message so they run concurrently.** Never one after
another: a tier rewritten in isolation is a tier that contradicts its neighbours by the time it lands.

Give each agent four things, and nothing else it did not ask for:

1. **Its tier, and only its tier** — the exact file it owns, and the explicit statement that the other two
   tiers are being rewritten beside it by other agents, so it must not touch them.
2. **The span** — the `git log --oneline <sha>..HEAD` range, and the instruction to read the code itself,
   never its memory of it. Name the files that hold the truth for its tier: `CLI/bin/sf`, `CLI/src/`,
   `CLI/utils/`, `.claude/agents/*.md`, `.claude/skills/`, `scripts/`, `package.json`.
3. **Its tier's depth, from the table above**, verbatim — so the README agent knows to be brief and the
   diagram agent knows that notes are dead.
4. **The standing prohibitions** — do not commit, do not run `git add`/`git commit`/`git push`, do not invent
   a command, flag, env name, path or agent description that is not in the code.

The diagram agent gets two extras: read `.claude/diagram/REFERENCE.md` in full before it touches a box, and
rebuild `dist/` with `.claude/diagram/build.sh` when it is done, reporting the real build output.

## What the pass is for

The point of a pass is not to add — it is to make each tier true and short. When an agent reports a claim the
code contradicted, that is the pass having worked. Verify the two or three that matter yourself rather than
trusting the report: grep the tree for the flag, the command, the path it says it removed.

## When all three have landed

1. Check the tiers against each other — the same fact worded three different ways is a fact that will drift.
2. Update the anchor in `.claude/CLAUDE.md` to **the sha this pass ran from**, never the sha its docs land in,
   so the span always reads forward.
3. Commit the code and the documents together, through the `commit` spell. A pass that lands docs apart from
   the code they describe is a pass that proved nothing.
