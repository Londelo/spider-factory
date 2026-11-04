---
name: bead-read
description: >
  How to READ a beads (`bd`) system: that you are working inside a ticket database, what it is, and
  every command for reading a ticket's details, its parent, and its children. Reading a ticket means
  three reads, always: the ticket itself in full, its children where children bear on the work, and
  the gate closest above it in the hierarchy — the epic or feature gate the ticket sits under, which
  is the source of truth for why the ticket exists. An epic reads all its features, a feature reads
  all its tasks, a worker reads its own ticket plus its children plus its gate. Use it before running
  any `bd show` / `bd list` / `bd dep`, and whenever an instruction says "read the ticket" and you
  would otherwise guess a flag: a truncated read, a hidden gate child, or a skipped gate read
  silently becomes an agent building the thing nobody asked for. Reads
  only — the claim belongs to `CLI/beads-loop.sh`, no worker ever closes its own ticket (closing is
  a human act), and authoring tickets lives in `bead-create`.
  Trigger: "read the ticket", "read the bead", "what does my ticket say", "read the epic", "what are
  my children", "find the parent", "which tasks does this feature have", "bd show", "bd list",
  "bd dep list".
---

# Reading a bead

## You are working in a beads system

**Beads** is the issue tracker this whole toolkit runs on: a local database per repository, driven by
the `bd` command-line tool, where every unit of work is a real issue row — an id (`bd-42`), a title, a
description, design notes, acceptance criteria, a priority, a type (`issue_type`), labels, a status and
an owner. Work is arranged as a **tower**: epic → features → tasks, held together by `parent-child`
edges and ordered against each other by `blocks` edges; every ticket whose blockers are closed sits on
the **frontier**, and a dispatcher claims from there.

Every kind of ticket knows its place in that chain by **kind**, not by id: an epic is a `gate` at the
top, a feature is a `gate` in the middle, and a task names its feature gate in `.parent`. So the walk
upward — find the gate above me — is a question `bd` can always answer, and one you answer *before*
writing code, because code contradicts the gate as soon as either one went stale.

Nothing else is read at runtime. No stdout, no chat summary, no memory of a previous session survives
the handoff — **the ticket is the brief, and the report you write on it (or in your final message) is
the only proof of work anyone sees.** A worker never closes its own ticket, so the report — not a
`bd close` — is where the proof lands. So reading it is not a preamble to the work, it *is* how you
are told what to do: read it, re-read it after anything changed, and never act on a remembered
version of it.

Ground yourself before reading anything: `bd where` names the database you are actually talking to — it
resolves by walking **up** from `$PWD` and ignores `BEADS_DIR`, so one stray `cd` into a worktree has
you reading somebody else's tower — and `bd status` gives the open / in-progress / blocked / ready
totals. Everything below was verified against `bd` 1.3.0 by running it.

**Reads are read-only.** Nothing on this page takes a lease, claims a ticket or changes a byte of state,
so re-read as often as you like. Anything that *writes* is outside this skill: authoring a ticket is
`skills/bead-create`, and no worker closes a ticket from anywhere — closing is a human act, done after
reading the worker's report. An unfamiliar flag is settled by `bd <command> --help`, never by a
remembered one.

## The one reading rule

**Three reads, always: the ticket you were given — its children, where children bear on your work —
and the gate above it.**

**1. The ticket itself**, in full, `bd show --json <id> --long`. What you must do, and how much (a
task's `## Scope` block caps its ambition).

**2. Its children**, where it has any — `bd show --children --json <id>`. A worker task usually has
no children; a feature always has its tasks; an epic always has its features. Reading *down* is what
tells you what you must not duplicate, and reading *sideways* (`bd list --parent <parent-id> --json`)
is what tells you what a sibling already owns.

**3. The gate closest above you** — *the source of truth*. The ticket you hold never carries the
whole reason it exists; the flow it serves lives on the gate above it. A `backend-logic` task whose
parent is feature **F** takes **F** as its source of truth, and **F** in turn answers to its epic.
A task with no `.parent` has no gate above it: say so on the ticket rather than inventing a purpose.

Why the gate is *closest above*, not top-down: a feature's `## Scope` line is written to be read
*inside* its epic, and one task's acceptance criteria can always be satisfied while the feature
stays unbuildable.

| You hold | Read | Command |
|---|---|---|
| any ticket | itself, in full, before touching code | `bd show --json <id> --long` |
| any ticket | its direct children, if it has any | `bd show --children --json <id>` |
| any ticket | its siblings, before duplicating them | `bd list --parent <parent-id> --json` |
| any **task** | **the gate above it** — its parent, then that gate's own children and siblings | `.parent` from `bd show --json <id> --long`, then `bd show --json <parent-id> --long` |
| a **feature** (or a ticket describing one) | **every task under the feature** | `bd list --parent <feature> --json` |
| an **epic** (or a ticket describing one) | **every feature under the epic** | `bd show --children --json <epic>` — or `bd list --parent <epic> --json --include-gates` |
| anything below you that looks finished | whether it really is | `bd show --json <child-id>` → `status`, then `bd ready --explain` |

## One worked read — a `backend-logic` task

A tower shaped like the real one:

```
Epic · "Tally — personal spending tracker"                    (gate)
 └── Feature · "F1 — Recurring bills"                          (gate)
      ├── Task · "backend-logic — BillRecurrence engine"       ← YOU HOLD THIS
      ├── Task · "frontend-ux — BillForm / schedule screen"
      └── Task · "unit-tests — bill-recurrence.spec"
```

You were dispatched holding the `backend-logic` ticket, and the hook tells you to read your bead.
The three reads, in order:

1. **Self** — `bd show --json <self> --long` → `.description` + `## Scope`: you implement the
   recurrence engine, compute next dates and payments, and its `## Owned Elsewhere` forbids you to
   reach into `modules/bills` or `components`.
2. **Gate (up)** — `.parent` is **F1**, so **F1 is the source of truth**. `bd show --json F1 --long`
   → its `## Scope`: the bill computes its next date and *surfaces it to the user*. Without this
   read you would write a pure date calculator with no way to prove it right; with it, you know your
   engine must expose what the form and the test tickets downstream of you will need.
3. **Children (down)** — the task has none, so you **check the layer your work lands on** instead:
   the sibling `unit-tests` ticket and `bd list --parent F1 --json` — because that unit-tests ticket
   is exactly who might already have written your spec, and `## Owned Elsewhere` says don't
   duplicate it.

The shape, not the ids: **you = self → gate (the parent, and what the parent says) → children (or
layer check when you are a leaf)**.

## The read surface

```bash
bd where                                   # which database am I actually reading?
bd status                                  # totals: open / in-progress / blocked / ready
bd show --json <id> --long                 # THE BRIEF: description, design, acceptance, labels, type
bd show --children --json <id>             # direct children — gates INCLUDED
bd list --parent <id> --json               # direct children — gates HIDDEN unless --include-gates
bd list -t gate --json                     # every gate in the tower (epics and features)
bd dep list <id> --json                    # edges pointing AT it: parent, blockers, + dependency_type
bd show --refs --json <id>                 # who references this ticket (reverse lookup)
bd ready --explain                         # WHY a ticket is or is not on the frontier — the honest answer
```

Always `--json` for anything you parse, and never send `bd` output to `/dev/null`: a read you cannot
look at is a read that never happened.

## Reading down: the two reads that decide a tier's coverage

- **An epic must read all its features.** Its feature children are *gate*-typed, and gates are absent
  from every default query — that is how the loop is kept from dispatching a checkpoint. So a plain
  `bd list --parent <epic>` returns `[]` on a fully-populated epic: **an empty list is not an empty
  epic.** Use `bd show --children --json <epic>` (gates included) or add `--include-gates`. The epic's
  feature list is the journey list, verbatim — miss it and you invent journeys instead.
- **A feature must read all its tasks.** Tasks are ordinary issues, so `bd list --parent <feature>
  --json` shows them; read their descriptions and `labels` before writing anything, because two of
  those tickets are what your own coverage map is built from.
- **`--children` is ONE level deep** (verified: epic → features, and no further). Recursion is yours:
  read a child, then read that child's children.
- **Then read across:** `bd list --parent <parent> --json` names the siblings whose work you must not
  re-prove — the raw material of "already owned elsewhere".

## Seven traps, all silent

1. **Gate children vanish from default queries.** Features hidden from an epic read look like an epic
   with no features. `--include-gates`, `bd list -t gate`, or `bd show --children`.
2. **There is no `children` key on an issue.** `bd show --json <id>` carries `parent` and no children —
   children come from `--children` or `--parent`, never off the ticket itself.
3. **`--children` is one level.** No recursion from the tool; walk it yourself.
4. **Empty fields are omitted from the JSON.** A missing `.acceptance_criteria` means the field came back
   empty, not that the ticket has no acceptance criteria — re-read with `--long` before concluding the
   brief is silent, and say the gap out loud rather than filling it.
5. **The key names are `issue_type`, `owner`, `acceptance_criteria`.** `.type`, `.assignee` and
   `.acceptance` return `null` **without erroring**, and `labels` can be JSON `null` — always `.labels // []`.
6. **The JSON shapes differ.** `bd show --json <id>` is a one-element **array** (`.[0].title`);
   `--children` and `--refs` are **objects keyed by the id** (`.["<id>"]`, alongside a count key). Index
   one with the other and `jq` hands you `null` or an error instead of your children.
7. **`bd` walks up from `$PWD`.** In a worktree you may be reading the parent project's tower, or a
   neighbouring one. `bd where` costs nothing and settles it.

## Reading discipline

- **Read first, then act** — and re-read after anything changes. A ticket quoted from memory is a ticket
  that changed while you were working.
- **Read only as far as the work needs** — *up* to the gate, *down* through children, *sideways* at
  siblings — and stop there. Do not tour the whole tower to feel thorough.
- **The database beats the assumption.** If a read contradicts what you were told, trust the read and
  report the contradiction; do not quietly reconcile it.
- **A missing fact belongs on the ticket, never in a guess**: write exactly what remains into the ticket
  and say the gap out loud. Half-doing an unseen brief and hiding it is worse than stopping.
- **Never claim from here**: `bd ready --claim`, `bd update --claim`, `bd unclaim` and `bd reclaim` belong
  to `CLI/beads-loop.sh` and the operator alone. Your ticket arrived already claimed.
- Your ticket is your whole assignment: read it, read its gate above and its children below, work
  nothing else.
