# Jest-Test Task Template

Template for `jest-test` category tasks. Used by the jester agent to write comprehensive tests.

## Template

```markdown
## Task: Test `[functionName]` or `[ComponentName]`

**File:** `exact/path/to/test/file.spec.ts`
**Unit:** `describe('[functionName]', ...)` or `describe('<ComponentName>', ...)`
**Category:** jest-test
**Mode:** testing-changes | tdd
**Existing test file:** no (create new) | yes (append to `path/to/existing.spec.ts`)
**Skip:** no | yes — [reason, e.g., "Skip testing `UserStatus` enum — no logic"]
**Depth:** light (simple one-liner, one scenario sufficient) | standard (happy + error + edge cases) | thorough (all branches, boundary values, parameterized)

### Description
[Short: what the function/component does and its contract. Not "write comprehensive tests" — say "Tests `formatCurrency` which converts cents to a formatted USD string using `Intl.NumberFormat`."]

### Scenarios
- `input_1` → `expected_1`
- `input_2` → `expected_2`
- `null` → `expected_null`
- `empty_array` → `expected_empty`
- [concrete input → expected output pairs. Not vague placeholders — the plan agent read the code, it should communicate what it learned.]
- [happy path scenarios]
- [error path scenarios]
- [boundary value scenarios]

> **This is the gold standard:** "Test cases: 0 → `$0.00`, 100 → `$1.00`, 1234 → `$12.34`, 99999 → `$999.99`, -500 → `-$5.00`, 10 → `$0.10`."
> Concrete input/output pairs. Tell the jester exactly what to assert, not "test edge cases."

### Test Setup
- **Test runner:** `[jest | vitest — specify based on the project's actual test framework]`
- **File location:** `[exact path — e.g., `src/utils/test/format.spec.ts` (new) or `tests/unit/features/routine/routine-server-actions.spec.ts` (existing, append)]`
- **Mocks needed:**
  - `[mock_1 — e.g., "vi.mock('@/config/db') — mock database layer"]`
  - `[mock_2 — e.g., "vi.mock('@/services/api') — mock API calls"]`
  - `[none required — pure function]`
- **Pattern reference:** `[if any specific file to follow — e.g., "Follow the pattern in `src/utils/test/date.spec.ts` for simple utility test structure"]`
- **Fixture/factory guidance:** `[if the codebase uses specific factory patterns for test data, note them here]`

### Run
- Run the test after writing and confirm all pass
- Report pass/fail count
```

## Key Design Decisions

- **"What to do" replaced with "Description".** "Write comprehensive tests for X" tells the jester nothing it doesn't already know from its role. A short description of what the function does + its contract is more useful.
- **Scenarios are concrete, not placeholders.** `[Scenario 1: what input, what expected output]` is weak. It signals the plan agent hasn't done its homework. The plan agent reads the code — it should communicate concrete input → expected output pairs.
- **"Test Structure" replaced with "Test Setup".** The jester's spec already covers describe blocks, it.each, fixtures, etc. Generic instructions add no value. Test Setup provides practical info: test runner, exact file path, whether file exists, mock dependencies, pattern references.
- **"Skip" flag.** The plan agent should explicitly flag functions that don't need tests (simple selectors, enum files, index re-exports, trivial getters/setters, already-tested functions). This avoids wasted tasks.
- **"Mode" indicator.** testing-changes (implementation exists, write tests for current behavior) vs tdd (no implementation yet, write failing tests first). Removes ambiguity.
- **"Depth" indicator.** light (simple one-liner), standard (happy + error + edge cases), thorough (all branches, boundary values, parameterized). Aligns with the jester's core heuristic: "If removing the test would leave a business rule, transformation, or branching decision unverified — write it. If it would just re-assert that a library works — skip it."
- **Mock dependencies identified by the plan agent.** The plan agent reads the code — it knows if a function calls external services, uses a database, or depends on other modules. It should list these so the jester doesn't waste time discovering them.
- **Exact test file path.** Not a placeholder. The jester co-locates tests in `test/` directories next to source files, but conventions vary by project. The plan agent should say the exact path and whether it's new or existing.
- **"Run" section kept as-is.** Explicitly tell the jester to execute tests and report results.