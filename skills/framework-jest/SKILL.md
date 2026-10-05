---
name: framework-jest
description: >
  Jest (and its Vitest twin) framework knowledge: the runner reality check, spec file naming and
  placement, describe/it/expect anatomy, it.each parameterization, jest.fn/vi.mock mocking,
  rejects.toThrow error assertions, call-order assertions, timers and randomness, fixtures and
  factories, and the exact run commands. Load this BEFORE writing a single test line — the syntax
  you invent from memory is usually the other runner's syntax, and a suite that imports the wrong
  runner fails for a reason that has nothing to do with the code under test.
  Trigger: "jest", "vitest", "unit test syntax", "how do I mock", "it.each", "rejects.toThrow",
  "test runner", "jest.fn", "vi.mock", "fake timers", "test file naming".
version: 0.1.0
---

# Jest — the framework

This skill is the **tool**. It says how to write a Jest test. It never says *what* to test or *how
much* to test — that is the test tier's job (`agents/unit-tester.md`, `agents/feature-tester.md`,
`agents/e2e-tester.md`). When the tier and the tool disagree, the tier decides whether the test
exists at all; this skill decides only how it is spelled.

## Step 0 — Confirm the runner before writing anything

Jest and Vitest are near-identical in intent and different in import. Read, do not assume:

1. `package.json` — `jest` vs `vitest` in devDependencies, and the `test` script.
2. The config file — `jest.config.*`, or `vitest.config.*` / a `test:` block in `vite.config.*`.
3. Two existing spec files — copy their import line and structure; the repo's own style beats
   any convention below.

| Concern | Jest | Vitest |
|---|---|---|
| Import | `import { describe, it, expect, jest } from '@jest/globals'` (or globals on) | `import { describe, it, expect, vi } from 'vitest'` |
| Mock factory | `jest.fn()` | `vi.fn()` |
| Module mock | `jest.mock('../db')` (hoisted, top-level) | `vi.mock('../db')` |
| Timers | `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| Run one file | `npx jest path/to/file.spec.ts` | `npx vitest run path/to/file.spec.ts` |

A project that has Vitest gets Vitest. Never add a Jest dependency to make a test easier to write.

## File naming and placement

- Extension: `.spec.ts` / `.spec.tsx`.
- Location: a `test/` directory **at the same level as the source file**, mirroring its path.

```
src/module.ts       → src/test/module.spec.ts
src/utils/helper.ts → src/utils/test/helper.spec.ts
```

- Never `__tests__/`, never a top-level `tests/` tree for unit specs, never beside-and-named-after
  the source without the `test/` folder. Exact paths in the ticket's `**File:**` field win over
  this default.
- One spec file per source file. Two spec files for one module means duplicated setup — merge them.

## Anatomy of one test

Arrange → act → assert, in that order, one behavior per `it`. Name the `it` as the behavior, not
the function: `it('returns null for an empty code')`, never `it('works')`.

```typescript
describe('parseCoupon', () => {
  it('parses a valid code', () => {
    expect(parseCoupon('SAVE10')).toEqual({ code: 'SAVE10' });
  });
});
```

One `describe` per function under test (or per behavior facet when one function has many). Group
related cases; assert behavior, never private structure.

## Parameterized cases — `it.each`

The default for any input→output table. It is how "every edge case" stays cheap.

```typescript
describe('validateEmail', () => {
  it.each([
    ['valid email', 'test@example.com', true],
    ['missing @', 'testexample.com', false],
    ['missing domain', 'test@', false],
    ['empty string', '', false],
    ['null', null, false],
  ])('handles %s', (_label, email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});
```

Object form when cases carry mocks or several fields — the `$name` in the title is what makes the
failure readable:

```typescript
it.each([
  { name: 'happy path', input: baseInput, response: { token: 'abc' }, expected: { ok: true } },
  { name: 'rejects bad password', input: { ...baseInput, password: 'x' }, response: { error: 'Invalid credentials' }, expected: { ok: false } },
])('$name', async ({ input, response, expected }) => {
  const mocks = createMocks({ api: response });
  expect(await runTest(input, mocks)).toEqual(expected);
});
```

## Mocking

Mock **only** what crosses the boundary of the thing under test — network, database, clock,
filesystem, other services. Never mock the module you are testing; a mocked subject asserts
nothing.

```typescript
const createMocks = (responses = {}) => {
  const api = jest.fn().mockResolvedValue(responses.api ?? DEFAULT_API_RESPONSE);
  const db = jest.fn().mockResolvedValue(responses.db ?? DEFAULT_DB_RESPONSE);
  return { api, db };
};
```

- Module mocks (`jest.mock` / `vi.mock`) are hoisted above imports — keep them top-level and
  side-effect free.
- Restore per test: `afterEach(() => { jest.restoreAllMocks(); })` — leaks between tests are the
  number one cause of "passes alone, fails in the suite".
- Assert interactions only where interaction *is* the behavior (an orchestrator's call order);
  everywhere else assert the return value.

**Call order:** `toHaveBeenCalledBefore` comes from `jest-extended` — check it is installed first.
Without it, assert order through `mock.invocationCallOrder` rather than inventing a matcher.

## Error and async assertions

Always the `rejects/throws` matcher — never a `try/catch`, which passes silently when nothing
throws:

```typescript
// Good — fails if no error is thrown
await expect(fetchMarketCounts(badInput)).rejects.toThrow(FetchMarketCountsError);

// Bad — silently passes if the call succeeds
try { await fetchMarketCounts(badInput); } catch (e) { expect(e).toBeInstanceOf(FetchMarketCountsError); }
```

Assert the project's **error factory type** (`standards-errors`), not a message string — messages
get reworded, classes do not.

## Time, randomness, environment

A test that reads the real clock or the real random is a future flake:

```typescript
jest.useFakeTimers().setSystemTime(new Date('2026-10-05T00:00:00Z'));
jest.spyOn(Math, 'random').mockReturnValue(0.42);
```

Reset in `afterEach`. Never `setTimeout`/`sleep` to "wait for" something in a unit test — if
something needs waiting for at this tier, it is not a unit test.

## Fixtures and factories

Extract shared data once per file, never inline per test:

```typescript
const makeMarket = (count: number, presaleTime: Date, campaignId = 'campaign1') => ({
  id: `${count}_market`, presaleTime, campaignId,
}) as MarketWithCounts;
```

Never duplicate mock definitions, test data, or setup logic. If two `it` blocks share more than an
input, they share a factory.

## Running

```bash
npx jest src/utils/test/format.spec.ts        # the file you touched
npx jest --coverage src/utils                 # coverage when the ticket asks for it
npx jest --watch                              # interactive, only when iterating locally
```

Run the narrowest scope that proves your work; the whole suite is CI's job. Exit code 0 is the
only evidence a run exists — read the output, do not trust that the command "looked fine".

- Verifying existing code → expect **PASS**.
- TDD (ticket says `Mode: tdd`) → expect **FAIL first**, and confirm the failure is the one the
  ticket predicted, then stop; the implementation is another agent's ticket.

## Anti-patterns — reject these in your own output

- Asserting a third-party library does what its docs say.
- Snapshot tests invented without a ticket asking for one.
- Exporting something privately for testability ("test-only exports") instead of restructuring.
- `expect(result).toBeDefined()` / truthiness shrines — assert the actual value.
- Copy-pasted setup across `it` blocks.
- Renaming or rewriting existing tests to make the suite green. Append; never edit.

## Documentation

Consult only when stuck — the patterns above are the working set.

- Jest: <https://jestjs.io/docs>
- Vitest: <https://vitest.dev/guide/>
- `it.each`: <https://jestjs.io/docs/api#iteachtablename-args-fn>
- Mocking modules: <https://jestjs.io/docs/mock-functions>
