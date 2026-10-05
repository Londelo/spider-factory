# Ticket schema

Framework-agnostic: this is what a ticket must *contain*, not how to type it. `bd` syntax lives in
`skills/beads-db-help`; the dispatchable stamp set lives in `scripts/beads-loop.sh`'s `AGENT` map.
Each plan agent reads only its own tier's section, plus §Every ticket, plus §Definition of ready.

## Every ticket

| Field | Rule |
|---|---|
| **Title** | one line, names the unit. `Create formatCurrency function`, never "currency stuff" |
| **Description** (`-d`) | the complete brief — self-contained, executable with nothing else open |
| **Acceptance** (`--acceptance`) | observable evidence that it is done, written for a human to verify |
| **Type** (`-t`) | `gate` for epic/feature, `task` for work. Never a built-in for a gate |
| **Priority** (`-p`) | inherit the parent's; P4 when nothing set |
| **Stamp** (`-l`) | exactly one, from the closed set — or none, for a gate |
| **Parent** | `--parent <id>` (or `--deps "parent-child:<id>"`) — the tower's shape |
| **Blockers** (`bd dep add`) | real ordering; `parent-child` never blocks anything |

Stamp vs category vs tag, never interchangeable: the **stamp** is the one label that dispatches; the
**category** is a display hint in `bd list` that names a template in `shared/plan-tasks/`
(`backend-logic`, `frontend-ux`, `unit-tests`, `feature-test`, `epic-e2e-test`, `review`, `merge`);
a **tag** dispatches nothing. The three test tiers deliberately collapse the names into one string — the
stamp *is* the category, and the agent is that string plus `-er`: `unit-tests` → `unit-tester` (micro),
`feature-test` → `feature-tester` (composition), `epic-e2e-test` → `e2e-tester` (broad). A tier is named
for the **test**, never the tester and never the framework. Mis-stamp one tier off and the worker covers
the wrong depth of coverage, and nothing it reports will tell you so.

---

## Epic tier

Created by `plan-epic`. The epic is the "what", one per product intent, written so a non-programmer
recognises their idea in it. Altitude: user-visible only — no framework, no library, no package, no
file, no function.

**Epic gate** — `-t gate`, **no label**, no parent.

```
# <Epic Title>

## User Flow
<the story: user lands here, clicks there, sees this. sequential, main path + key branches>

## States & Data
- **User states:** <logged in/out, draft/published, active/completed>
- **Input data:** <what the user provides or interacts with>
- **Stored data:** <what persists — records, relationships>

## High-Level Requirements
- <what the user gets, never how it is built>

## Scope
- **In scope:** <…>
- **Out of scope:** <name what comes later, and where>

## Dependencies
<external services, other epics, infrastructure, assumptions>

## Notes
<research findings, risks, alternatives worth knowing>
```

Then the epic's three structural tickets, `--parent <epic>`, chained `blocks` in this order:

| Ticket | Stamp | Description must carry |
|---|---|---|
| e2e suite | `epic-e2e-test` | the journeys that cross features, one success + one failure path per feature; what each journey must not re-prove (the feature tier owns that) |
| epic review | `epic-lead-review` | what to trace across the whole epic, which suites to run, what "certified" means here |
| epic merge | `epic-merge-pr` | what gets merged, from where, into what, and the preconditions |

---

## Feature tier

Created by `plan-feature`, one per complete user-facing flow. This is the tier where the stack stops
being invisible: **name the packages, libraries, services and data stores** the feature will use, and
point at real code to follow as a pattern. Still no components, functions, hooks or file paths — that
is one tier down.

**Feature gate** — `-t gate`, **no label**, `--parent <epic>` (or orphaned when the human said there
is no epic).

```
# <Feature Title>

## Goal
<one sentence: what the user gets>

## Scope
- **In scope:** <…>
- **Out of scope:** <… — and which feature handles it>

## Technology
<packages/libraries/services to use, and why each; existing code to follow as a pattern>

## Acceptance Criteria
- <user-observable done-ness>

## Dependencies
<feature ids or "None"; external services>
```

Then that feature's three structural tickets, `--parent <feature>`, chained `blocks` in this order —
for **every** feature, no exceptions:

| Ticket | Stamp | Description must carry |
|---|---|---|
| feature suite | `feature-test` | the feature's flow proved wired in a browser: its successes and its error surfaces; what it must not re-prove (the micro tier owns single-function branches) |
| feature review | `feature-lead-review` | what to trace, which suites to run, what to certify |
| feature merge | `feature-merge-pr` | what merges, into what, with which preconditions |

---

## Worker task tier

Created by `plan-task`, under exactly one feature. The nitty-gritty: every requirement, every input
and output, every edge case, where it lives, which existing code to follow — and never how to write it.
Names and pseudo-code, not code. One cohesive unit per ticket: one whole component, one whole function
with all its edge cases, one whole test.

| Ticket | Stamp | Category | Template |
|---|---|---|---|
| implementation | `backend-logic` | `backend-logic` | `shared/plan-tasks/engineer.md` |
| implementation | `frontend-ui` | `frontend-ux` | `shared/plan-tasks/frontend.md` |
| micro test | `unit-tests` | `unit-tests` | `shared/plan-tasks/unit-tester.md` |

An implementation unit always gets two tickets: one implementation, one test. The implementation
description never mentions tests; the test description never mentions implementation. Tests are never
combined with what they test — a worker that does both closes the ticket before it has proved anything.

The three test tiers are three depths of coverage, and each must be planned so it cannot re-prove the
tier below: **micro** = one function alone, every branch (plan-task's only tier); **feature** = the
composition inside one feature (owned upstream by `plan-feature`); **e2e** = journeys across features
(owned upstream by `plan-epic`). Say in the description which tier this is and what belongs elsewhere.

If a ticket genuinely needs two specialists, it is two tickets — split it and stamp each one.

---

## Definition of ready

Check every ticket you just created, before you report. Any "no" means fix the ticket, not the report.

- [ ] Would a worker spawned with nothing but this id and description know exactly what to build?
- [ ] Exactly one label, from the closed set — or zero, and it's a `-t gate`?
- [ ] Did `bd show --json` confirm it, this ticket, right after creating it?
- [ ] Parented to the right node, so the tower is intact?
- [ ] Every ordering requirement expressed as a `blocks` edge — not assumed from `parent-child`?
- [ ] Nothing in the description above its altitude (no stack at epic, no components at feature,
      no implementation at task)?
- [ ] No ticket duplicates one that already exists (`bd children <parent> --json` was consulted)?
- [ ] The structural tickets exist for every gate you created, so review and merge can actually happen?
- [ ] Scope named out loud: what this ticket does *not* do, and who does it instead?
