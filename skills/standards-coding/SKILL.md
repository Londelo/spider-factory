---
name: standards-coding
description: >
  The functional + imperative paradigm used in this project. Use whenever code is changed,
  new features are built, refactoring or bug fixes are applied. Covers pure functions,
  immutability, Ramda, pipeP, FCIS pattern, and enforced ESLint rules.
  Trigger: "coding standards", "FP paradigm", "functional paradigm", "how should I code this",
  "pure function", "immutability", "Ramda", "pipeP", "FCIS", "composition".
---

# Functional + Imperative Paradigm — Rulebook

This paradigm governs ALL code changes in this project. Follow it exactly.

## Core Principles

### Pure Functions — Mandatory

Every function that transforms data must be pure: business logic, rendering, formatting, validation, normalization, serialization.

- Identical inputs → identical outputs. No randomness, no global state, no time-dependent behavior.
- Zero side effects. No I/O, no network, no file writes, no `console.log` inside the function.
- Referential transparency: substitute any expression with its evaluated result without changing behavior.

### Immutability — Mandatory

Data structures never change after creation.

- `const` exclusively. Never `let` or `var`.
- Spread objects/arrays: `{ ...old, field: newValue }`, `[...old, newItem]`.
- Ramda's `R.assoc`, `R.set`, `R.over`, `R.lensPath` for nested updates.
- Never mutate parameters, closure variables, or imported modules.

### Declarative Style — Mandatory

Describe **what** the code computes, not **how** to step through it.

- Replace loops with `.map()`, `.filter()`, `.reduce()`, or Ramda equivalents.
- Compose small functions instead of monolithic procedures.
- Use Ramda's curried, pipe-friendly combinators as the primary interface.

### Composition Over Inheritance — Mandatory

- Pass functions as arguments. Return functions from functions.
- Build pipelines with `R.pipe`. Prefer left-to-right over `R.compose`.
- Factory functions that return objects — never use `class`.
- "Has-a" over "is-a". Isolate behaviors into discrete, composable units.

## PipeP — Promise Pipelines

### Building the Utility

Ramda removed `pipeP` because it was redundant — it was just `pipeWith(R.andThen)`. We still use it as a local utility.

**Create `utils/ramda.{js,ts}` in the project root (if missing):**

```typescript
import { pipeWith, andThen } from 'ramda';
const pipeP = (...fns) => pipeWith(andThen)([...fns]);
export { pipeP };
```

`pipeWith` takes a combinator; `andThen` is Promise `.then` semantics. Together they make `pipe` async-aware.

**Usage:** `pipeP(makeQuery, fetchMember, pickName)` — linear, promise-aware chaining.
**Rule:** If a repo has `pipeP`, use it. Do not write ad-hoc `.then()` chains.
**pipeP vs pipe:** Use `pipeP` when any step returns a `Promise`. Use `pipe` for sync-only.
**Avoid:** `R.compose` → `R.pipe`; `R.when` → `pipe` + conditional; `R.ifElse` → ternary or `cond`.

## Function Composition Patterns

### Function Arity

Prefer single-argument functions when composing. Multi-argument functions break pipelining. Use Ramda's built-ins or accept a single object:

```typescript
// Bad — arity 2 breaks pipe
const add = (a, b) => a + b;
// Good — curried: const add = (b) => (a) => a + b;  Or: import { add } from 'ramda';

// Bad — arity 3: const calc = (w, d, m) => { ... }
// Good — single object: const calc = ({ weight, distance, method }) => { ... }
```

### Guard Functions

Use guard functions (early-return wrappers) to keep pipelines clean. Guards return a boolean or a result object — they never throw.

```typescript
const hasValidId = ({ id }) => Boolean(id && typeof id === 'string');
const requireActiveCampaign = (campaign) =>
  campaign.status !== 'ACTIVE' ? INELIGIBLE_BY_STATUS : campaign;
```

### Partial Application with Ramda

Ramda's curried utilities create reusable partials:

```typescript
import { map, pick, filter } from 'ramda';

const selectFields = pick(['id', 'name']);
const isActive = filter(({ status }) => status === 'ACTIVE');
const processActive = pipeP(fetch, map(selectFields), isActive);
```

### No Temporary Variables in Pipelines

Extract intermediate values as named functions rather than storing them in variables:

```typescript
// Bad — intermediate variable
const raw = await fetch();
const normalized = normalize(raw);
return isValid(normalized) ? format(normalized) : null;

// Good — named function encapsulates the step
const processAndValidate = pipeP(fetch, normalize, guard(isValid), format);
```

## FCIS — Functional Core Imperative Shell

Structure applications as a pure core wrapped by an imperative shell.

- **Core:** All pure transformations. No I/O, no network, no DB, no side effects. Testable without mocks.
- **Shell:** Handles I/O — HTTP, DB, filesystem, user input. Collects inputs, calls core, formats outputs.
- **The core is a pipeline.** Data flows: shell → core → shell.

```typescript
// Core — pure
const transform = pipe(normalizeInput, computeScore, formatResult);
// Shell — handles I/O
try { return transform(await fetchFromDatabase()); }
catch (error) { log.error('fetch failed', error); throw error; }
```

## Anti-Patterns

**Method Chain** — chaining `.then()` on raw data is brittle and hard to test:

```typescript
// Bad — chained .then() on raw data
const result = fetchData().then(d => d.filter(x => x.active)).then(r => r.map(v => v.value));
// Good — named, composable
const pipeline = pipeP(fetchData, filter(r => r.active), map(r => r.value));
```

**God Function** — a function with 3+ branches should extract each branch:

```typescript
// Bad — monolithic if/else
const processOrder = async (order) => { if (order.type === 'PHYSICAL') { ... } else { ... } };
// Good — composed
const processOrder = pipeP(classifyOrder, pipelineByType);
```

**Implicit Globals** — functions reading/writing global state cannot be composed:

```typescript
// Bad — hidden state: let cache = {}; const get = (key) => cache[key] || fetch(key);
// Good — explicit cache: const get = (key, cache) => cache[key] || fetch(key);
```

## Enforced Rules

Violations block the build. ESLint rules: `fp/no-mutation`, `fp/no-let`, `fp/no-loops`, `no-class` equivalents.

| Rule | Requirement |
|------|-------------|
| No classes | Use factory functions |
| No `let` | Use `const` only |
| No loops | Use `.map()`, `.filter()`, `.reduce()`, or Ramda |
| No mutation | Use spread or Ramda lenses |
| Ramda is standard library | Import from `ramda` or `ramda-fantasy` |

## Escape Hatches — Controlled

When performance or necessity demands an exception, wrap the minimum lines in a scoped block with exact rule names. Never disable an entire file.

```typescript
/* eslint-disable fp/no-loops, fp/no-let, fp/no-mutation */
// only the imperative code goes here
/* eslint-enable fp/no-loops, fp/no-let, fp/no-mutation */
```

## Checklist

Before writing code:

1. Is the logic pure? (deterministic, no side effects)
2. Is data immutable? (no mutation, spread/new structures)
3. Is it declarative? (no loops, no imperative stepping)
4. Does it compose? (small functions, pipelines, Ramda)
5. Is it in the right layer? (core = pure, shell = I/O)
6. Are factory functions used instead of classes?
7. Is `const` used everywhere?
8. Is Ramda the default tool for data transformation?
9. Does the repo have `utils/ramda.{js,ts}` with `pipeP`?

If any answer is "no", restructure before proceeding.
