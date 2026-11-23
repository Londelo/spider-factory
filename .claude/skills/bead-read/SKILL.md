---
name: bead-read
description: >
  How to READ a beads (`bd`) system: that you are working inside a ticket database, what it is, and
  every command for reading a ticket's details, the tier it belongs to, and the gate above it. Reading
  a ticket means three reads, always: the ticket itself in full, the gate above it — read off the
  ticket's own id, since there is no parent link to walk — and the whole tier that gate stands for,
  which is the set of tickets blocking it, read off the gate's `blocks` edges. An epic reads every feature and the tier under
  each, a feature reads every task of its tier, a worker reads its own ticket plus the gate that gives
  it its reason. Use it before running any `bd show` / `bd list` / `bd dep` / `bd graph`, and whenever
  an instruction says "read the ticket" and you would otherwise guess a flag: a truncated read, a
  hidden gate, or a skipped gate read silently becomes an agent building the thing nobody asked for.
  Reads only — the claim belongs to `CLI/src/beads-loop/claim.sh`, no worker ever closes its own ticket (the Stop
  hook closes a task once its worker declares done; a gate waits for a human or the lead agent), and
  authoring tickets lives in `bead-create`.
  Trigger: "read the ticket", "read the bead", "what does my ticket say", "read the epic", "what is my
  tier", "find the gate above me", "which tasks does this feature have", "show me the dependency graph",
  "bd show", "bd list", "bd dep list", "bd graph".
---

# Reading a bead

## You are working in a beads system

**Beads** is the issue tracker this whole toolkit runs on: a local database per repository, driven by
the `bd` command-line tool, where every unit of work is a real issue row — an id (`bd-42`), a title, a
description, design notes, acceptance criteria, a priority, a type (`issue_type`), labels, a status and
an owner. Work is arranged as a **tower**, and the tower is **`blocks` edges and nothing else**: a gate
is blocked by every ticket of its tier, a ticket is blocked by the one before it, and every ticket whose
blockers are closed sits on the **frontier**, where the dispatcher claims from.

**There is no parenthood in a tower.** No `parent` field is written, no `parent-child` edge exists, no
`bd list --parent` and no `bd show --children` will ever tell you anything about this system — on a
correctly built tower both come back empty. So the two structural questions have exactly two answers,
and you answer them *before* writing code, because code contradicts the plan as soon as either one went
stale:

| Question | Answer | Read |
|---|---|---|
| Which gate is above me, and which tier am I in? | the **feature gate** your own id names; the epic above that is the same uuid re-kinded | the id, and nothing else |
| What is this gate's whole tier? | the set of tickets that **block this gate** | `bd dep list <gate> -t blocks --json` |

**The id is the position; `issue_type` is what a row is.** An id reads
`<repo>-<kind>-<uuid>-<hierarchy>`, as in `foobar-task-a7f3c9-5.3`: one lowercase-hex `uuid` binds a whole
tower, the kind word is `epic` or `feature` **on a gate only** and `task` on everything else, and the
hierarchy says where it hangs — `0` the epic gate, `1 2 3` its features, `<gate number>.1` that gate's suite,
`.2` its review, the worker chain from `.3`. Swap the kind word to `feature` and cut the hierarchy at the last
dot and you hold the feature gate above you; swap it to `epic` and set the hierarchy to `0` and you hold the
epic gate. Which tier a gate is comes off its own kind word — the loop reads nothing else, and no graph is
walked to work it out. `issue_type` still decides whether a row really *is* a gate: an id can name a gate that
the row disagrees with, and that disagreement is the `reason=gate-unworkable` alarm. Nothing about position
comes from a parenthood link, because there is none.

Nothing else is read at runtime. No stdout, no chat summary, no memory of a previous session survives
the handoff — **the ticket is the brief, and the report you write on it is the only proof of work anyone
sees,** because your final message dies with your session. A worker never closes its own ticket, so the
report — not a `bd close` — is where the proof lands. So reading it is not a preamble to the work, it *is* how you
are told what to do: read it, re-read it after anything changed, and never act on a remembered
version of it.

Ground yourself before reading anything: `bd where` names the database you are actually talking to — it
resolves by walking **up** from `$PWD` and ignores `BEADS_DIR`, so one stray `cd` into a worktree has
you reading somebody else's tower — and `bd status` gives the open / in-progress / blocked / ready
totals. Everything below was verified against `bd` by running it.

**Reads are read-only.** Nothing on this page takes a lease, claims a ticket or changes a byte of state,
so re-read as often as you like. Anything that *writes* is outside this skill: authoring a ticket is
`skills/bead-create`, and no worker closes a ticket from anywhere — closing a task belongs to the Stop
hook and closing a gate to a human or its lead agent. An unfamiliar flag is settled by
`bd <command> --help`, never by a remembered one.

## The one reading rule

**Three reads, always: the ticket you were given — the gate above it — and the tier that gate stands
for.**

**1. The ticket itself**, in full, `bd show --json <id> --long`. What you must do, and how much (a
task's `## Scope` block caps its ambition). This same read carries its edges: `.dependencies` is an
array of the tickets that **block it**, each a full record with `.id`, `.dependency_type` and `.status`.

**2. The gate above you** — *the source of truth*. You have no parent to name it, and you do not need to
walk anything: your id's kind word swapped to `feature` with its hierarchy cut at the last dot **is** your
feature gate, and the same uuid with kind `epic` at hierarchy `0` is the epic above it. Then
`bd show --json <gate> --long` on that id, and `bd dep list <id> --direction up -t blocks --json` is the
cross-check that the edge is actually there — the id says where you hang, the edge is what puts you in a
tier, and a task whose upward read comes back `[]` is a broken plan the loop will not work. Read the gate in
full — the ticket you hold never carries the whole reason it exists; the flow it serves lives on the gate.

**3. The tier** — the set of tickets that block that gate, `bd dep list <gate> -t blocks --json`. This is
what "everything under this gate" means, and it is the only thing that means it. Read their titles,
labels, statuses and descriptions: it tells you what a sibling already owns so you do not duplicate it,
and it is the honest answer to "is my tier actually finished" when you are the lead agent standing at the
gate.

Why the gate is *closest above*, not top-down: a feature's `## Scope` line is written to be read *inside*
its epic, and one task's acceptance criteria can always be satisfied while the feature stays unbuildable.

| You hold | Read | Command |
|---|---|---|
| any ticket | itself, in full, before touching code | `bd show --json <id> --long` |
| any ticket | what blocks it (its predecessors), with each one's status | `bd dep list <id> -t blocks --json` |
| any ticket | **the gate above it** — its id re-kinded, no query needed | swap the kind word, cut the hierarchy |
| any ticket | proof that gate is really wired above it | `bd dep list <id> --direction up -t blocks --json` |
| any **gate** | **its whole tier** — every ticket that blocks it | `bd dep list <gate> -t blocks --json` |
| any ticket | its siblings — the gate's tier, minus itself | the gate's tier read above, filtered |
| anything | every gate in the tower (epics and features) | `bd list -t gate --json` |
| anything | the whole connected component, layered by blocking order | `bd graph <id> --compact` (or `--open`, `--all --open`) |
| anything below a gate that looks finished | whether it really is | `bd show --json <id>` → `status`, then `bd ready --explain` |

## One worked read — a `backend-logic` task

A tower shaped like the real one, drawn as edges rather than as a tree:

```
Epic · "Tally — personal spending tracker"                    (gate)  branch epic/notes-sync
  ↑ blocked by  epic e2e suite  →  blocked by  epic review
  ↑ blocked by  Feature gate "F1 — Recurring bills"           (gate)  branch feature/recurring-bills
                    ↑ blocked by  backend-logic — BillRecurrence engine   ← YOU HOLD THIS
                    ↑ blocked by  frontend-ui — BillForm / schedule screen
                    ↑ blocked by  unit-tests — bill-recurrence.spec
                    ↑ blocked by  feature suite  →  blocked by  feature review
```

You were dispatched holding the `backend-logic` ticket, and the hook tells you to read your bead. The
three reads, in order:

1. **Self** — `bd show --json <self> --long` → `.description` + `## Scope`: you implement the
   recurrence engine, compute next dates and payments, and its `## Owned Elsewhere` forbids you to
   reach into `modules/bills` or `components`. Its `.metadata` carries **nothing** — a task holds no
   branch of its own. The branch your commit lands on is the one **F1** carries, and your pull request
   aims at the branch the epic gate carries; the loop read both off your id before it put you in this
   worktree. They are facts, not hints, they are just not in your row.
2. **Gate (up)** — your id is `tally-task-3c9a1f-1.3`, so the kind word swapped to `feature` with the
   hierarchy cut at the last dot is `tally-feature-3c9a1f-1` = **F1**, and the same uuid re-kinded `epic` at
   `0` is the epic gate. `bd show --json F1 --long` → its `## Scope`: the bill computes its next date and
   *surfaces it to the user*. Without this read you would write a pure date calculator with no way to prove
   it right; with it, you know your engine must expose what the form and the test tickets beside you will
   need. Then `bd dep list <self> --direction up -t blocks --json` and confirm **F1** is among the tickets
   this one blocks, `issue_type: gate` — the id says where you hang, that edge is what puts you in the tier.
3. **Tier (the gate's blockers)** — `bd dep list F1 -t blocks --json` → the feature's whole tier with
   each one's status and label. The `unit-tests` ticket is right there and already open: that is who
   owns your spec, and `## Owned Elsewhere` says don't duplicate it.

The shape, not the ids: **you = self → the gate you block (and what it says) → the gate's tier (your
siblings, and what they own)**.

## The read surface

```bash
bd where                                   # which database am I actually reading?
bd status                                  # totals: open / in-progress / blocked / ready
bd show --json <id> --long                 # THE BRIEF: description, design, acceptance, labels, type,
                                           #   metadata, and .dependencies (the tickets blocking it)
bd dep list <id> -t blocks --json          # what blocks it — array of full records, `.status` included
bd dep list <id> --direction up -t blocks --json   # what it blocks — the cross-check on the gate its id names
bd list -t gate --json                     # every gate in the tower (epics and features)
bd list --include-gates --json             # ordinary issues AND gates, in one listing
bd graph <id> --compact                    # the connected component, layered: layer 0 = nothing blocking it
bd graph --all --open                      # the whole open tower, one line per ticket
bd show --refs --json <id>                 # who references this ticket (reverse lookup)
bd ready --explain                         # WHY a ticket is or is not on the frontier — the honest answer
```

Always `--json` for anything you parse, and never send `bd` output to `/dev/null`: a read you cannot
look at is a read that never happened. Filter edges by `-t blocks` rather than reading every type and
throwing most of one away — a ticket can carry an edge of another type, and a `parent-child` edge that
survives in an old tower is a lie you should see clearly, not one you silently obey.

## Reading down: the two reads that decide a tier's coverage

- **An epic must read every feature, and every tier under each.** Feature gates are `gate`-typed, and
  gates are absent from every default query — that is how the loop is kept from dispatching a
  checkpoint. So a plain `bd list` returns `[]` while a whole tower stands there: **an empty list is not
  an empty epic.** Read `bd list -t gate --json`, or add `--include-gates`. The epic's feature list is
  the journey list, verbatim — miss it and you invent journeys instead.
- **A gate must read its whole tier.** `bd dep list <gate> -t blocks --json` is the tier, in one query,
  with statuses. Nothing else answers it: no `--parent`, no `--children`, no id prefix.
- **There is no recursion in the tool, and none needed.** One query gets you the tickets of one tier;
  walk to the next tier by reading *that* gate's blockers. `bd graph` is the one command that shows
  several tiers at once — it walks the connected component over the edges, so it works on a tower with
  no parenthood, and it is the cheapest way to see the whole shape before you start.
- **Then read across:** the gate's tier list names the siblings whose work you must not re-prove — the
  raw material of "already owned elsewhere".

## Seven traps, all silent

1. **Gates vanish from default queries.** Features hidden from an epic read look like an epic with no
   features. `bd list -t gate`, `--include-gates`, or `bd graph`.
2. **There is no `parent` and no `children` worth reading.** `bd show --json <id>` has no populated
   `parent` on a real tower, and `bd list --parent` / `bd show --children` come back empty — a *correct*
   tower looks empty to them. The tier is the gate's blockers; the gate above is your own id re-kinded.
3. **A `blocks` edge you did not write is invisible forever.** A ticket blocking nothing is on the
   frontier from the first tick, and a ticket that blocks no gate belongs to no tier — no lead agent will
   ever count it. `bd dep list <id> --direction up -t blocks --json` returning `[]` on a task is a
   broken plan, not a free ticket.
4. **Empty fields are omitted from the JSON.** A missing `.acceptance_criteria` means the field came back
   empty, not that the ticket has no acceptance criteria — re-read with `--long` before concluding the
   brief is silent, and say the gap out loud rather than filling it.
5. **The key names are `issue_type`, `owner`, `acceptance_criteria`, `dependency_type`.** `.type`,
   `.assignee`, `.acceptance` and `.depends_on_id` return `null` **without erroring**, and `labels` can be
   JSON `null` — always `.labels // []`.
6. **The JSON shapes differ.** `bd show --json <id>` is a one-element **array** (`.[0].title`), and its
   `.dependencies` is an array of **full issue records** — the other ticket's `.id`, not a
   `depends_on_id` field. `bd dep list --json` is likewise a flat array of full records. `bd show --refs`
   is an **object keyed by the id**. Index one with the other and `jq` hands you `null` or an error
   instead of your tier.
7. **`bd` walks up from `$PWD`.** In a worktree you may be reading the parent project's tower, or a
   neighbouring one. `bd where` costs nothing and settles it.

## Reading discipline

- **Read first, then act** — and re-read after anything changes. A ticket quoted from memory is a ticket
  that changed while you were working.
- **Read only as far as the work needs** — *up* to the gate, *across* at the gate's tier — and stop
  there. Do not tour the whole tower to feel thorough.
- **The database beats the assumption.** If a read contradicts what you were told, trust the read and
  report the contradiction; do not quietly reconcile it.
- **A missing fact belongs on the ticket, never in a guess**: write exactly what remains into the ticket
  and say the gap out loud. Half-doing an unseen brief and hiding it is worse than stopping.
- **Never claim from here**: `bd ready --claim` and `bd unclaim` belong
  to `CLI/src/beads-loop/claim.sh` and the operator alone. Your ticket arrived already claimed.
- Your ticket is your whole assignment: read it, read the gate above it and the tier beside it, work
  nothing else.
