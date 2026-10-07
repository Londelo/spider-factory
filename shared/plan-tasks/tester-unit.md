# Unit-Test Task Template (micro tier)

Template for `unit-tests` category tasks — the **micro tier**. Executed by the `tester-unit` agent,
which tests **one function at a time, in isolation, exhaustively within that function**. It writes
no wiring tests, no component renders, no browser tests: those belong to `tester-feature` and
`tester-e2e`.

The plan agent does the homework the agent must not redo: reads the function, lists the concrete
input → expected output pairs, names the exact file, names the mocks. Framework syntax is the
agent's skill's business (`framework-jest`) — never spell it here.

## Template

```markdown
## Task: Unit-test `[functionName]`

**File:** `exact/path/to/test/file.spec.ts`
**Unit under test:** `one function` (or one component's pure helper) — never a module, never a feature
**Category:** unit-tests
**Tier:** micro (one function, alone)
**Mode:** testing-changes | tdd
**Depth:** light (one-liner, one scenario sufficient) | standard (happy + error + edges) | thorough (every branch, boundaries, parameterized)
**Existing test file:** no (create new) | yes (append to `path/to/existing.spec.ts`)
**Skip:** no | yes — [reason, e.g., "R.prop extraction — no logic"; "already covered by test/format.spec.ts"]

### Description
[Short: what the function does and its contract. Not "write comprehensive tests" — say "Tests
`formatCurrency`, which converts integer cents to a formatted USD string via `Intl.NumberFormat`."]

### Scenarios — the input matrix (yours to enumerate, the agent's to assert)
- `input_1` → `expected_1`
- `input_2` → `expected_2`
- `0` / `''` / `[]` / `null` / `undefined` → [expected for each]
- [boundary values: min, max, off-by-one]
- [every branch the function can take — one named case each]
- [error inputs → the error factory type thrown]

> **This is the gold standard:** "Cases: 0 → `$0.00`, 100 → `$1.00`, 1234 → `$12.34`,
> 99999 → `$999.99`, -500 → `-$5.00`."
> Concrete input/output pairs. Tell the tester-unit exactly what to assert, not "test edge cases."

### Branches to cover
- [ ] [branch 1 — e.g., "empty input returns the default"]
- [ ] [branch 2 — e.g., "negative amounts keep the sign"]
- [ ] [error branch — e.g., "non-integer throws FormatCurrencyError"]
> Exhaustive is the point here: an uncovered branch is an unclosable ticket.

### Test Setup
- **Runner:** `[read it from package.json/config — jest | vitest; never assume]`
- **File location:** `[exact path — src/utils/test/format.spec.ts (new) or tests/unit/features/x.spec.ts (existing, append)]`
- **Mocks needed:** `[each external boundary — "mock @/config/db", "mock @/services/api"; or "none — pure function"]`
- **Pattern reference:** `[e.g., "follow src/utils/test/date.spec.ts"]`
- **Factories:** `[the project's test-data factory pattern, if it has one]`

### Hand Up
- [which behaviors this proves, so `tester-feature` must not re-assert them — e.g., "all formatCurrency
  formatting rules; the feature tier proves only that one formatted value reaches the screen"]

### Run
- Run the narrowest scope that proves the work; confirm PASS (or FAIL-first if `Mode: tdd`)
- Report pass/fail count and any uncovered branch
```

## Key Design Decisions

- **"Description" replaces "What to do."** "Write comprehensive tests for X" tells the agent nothing
  its role doesn't cover. What the function does + its contract is the useful part.
- **Scenarios are concrete, not placeholders.** `[Scenario 1]` signals the plan agent skipped its
  homework. The plan agent read the code, so it communicates real pairs.
- **The input matrix lives in the plan, not the agent.** This tier is the only one allowed to be
  exhaustive about one function's inputs — enumerate them here so the agent spends its effort
  asserting, not rediscovering.
- **"Branches to cover" is the tier's definition of done.** Depth (`light/standard/thorough`)
  calibrates; the checklist proves nothing was left dark.
- **"Test Setup" replaces "Test Structure."** describe/it/each/mocks are the agent's framework
  skill's job — no value repeating them. Runner, exact path, existence, mocks, pattern references:
  that is project reality the agent cannot infer cheaply.
- **Framework-agnostic ticket.** Name the runner as found; never write Jest/Playwright syntax into a
  ticket. Tier in the ticket, tool in the skill.
- **"Skip" flag** — simple selectors, enum files, index re-exports, trivial getters, already-tested
  functions get flagged, not ticketed.
- **"Mode" indicator** — testing-changes vs tdd removes ambiguity about expected color.
- **Mocks identified by the plan agent** — it read the code, it knows the external calls; listing
  them saves discovery.
- **"Hand Up" makes the no-duplication rule enforceable.** The unit tier states what it proved; the
  feature tier reads that and stays out. A tower without it produces two suites asserting the same
  branches.
- **Exact file path, not a placeholder.** Conventions vary by project; the plan agent records the
  real one and whether the file is new or appended to.
- **"Run" kept.** Explicitly tell the agent to execute and report.
