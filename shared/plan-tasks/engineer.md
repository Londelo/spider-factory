# Engineer Task Template

Template for `backend-logic` tasks. Used by the engineer agent to build business logic, domain functions, validators, formatters, normalizers, transformers, API endpoints, service layer functions, React hooks for state management/data fetching/side effects, type guards, error factories, and pipelines.

## Template

```markdown
## Task: [Title]

**File:** `path/to/file.ts`
**Unit:** `functionName` or `[hookName]`
**Category:** backend-logic
**Layer:** pure core (no I/O, synchronous) | imperative shell (handles I/O, catches errors)

### What to do
[One sentence: what this function does in domain terms. One unit only.]

### Input / Output
- Accepts: `[describe the input data — e.g., `{ amount: number, locale?: string }` — amount in integer cents, optional locale override]`
- Returns: `[describe the output data — e.g., `string` — formatted currency like "$12.34"]`

### Types
- **Parameters:** `[full parameter type — e.g., `{ amount: number, locale?: string }`]`
- **Return type:** `[full return type — e.g., `string`, `Result<User[]>`, discriminated union members if applicable]`
- **New types:** `[if a new type/interface/enum is needed, define it inline — e.g., new discriminated union with all members]`
- **Existing types used:** `[name + location for each — e.g., "Uses `CampaignStatus` from `src/domain/campaign/types.ts`"]`
- **Return type pattern:** `[Result object: `{ success: boolean; data?: T; error?: string }` or Discriminated union: `INELIGIBLE_BY_STATUS | INELIGIBLE_BY_SCORE` or plain value]`

### Logic
[Data flow, transformation rules, decision points, edge cases — all in one coherent description.

Describe:
- Data transformation: "Input X arrives, strip field A, rename field B to C, transform array of D into object keyed by E"
- Decision points: "If status is ACTIVE, proceed. If status is CLOSED, return early with INELIGIBLE_BY_STATUS."
- Step-by-step algorithm (natural language): "First normalize the dates, then classify by type, then apply the scoring formula, then format the result."
- What NOT to do: "Don't validate the email format here — that's handled upstream." "Don't fetch related records — the shell provides them."
- Async vs sync: "This function is async — it awaits the user lookup from the repo." OR "This is synchronous — no awaits needed."

Edge cases are integrated here — they ARE the logic, not a separate concern. Handle all edge cases in this one unit.]

### Dependencies
- **Imports:** `[what to import and from where — e.g., "import `pipe, map, filter from 'ramda'`", "import `createServiceError` from `src/errors.ts`"]`
- **Calls:** `[what other functions this calls — e.g., "Calls `validateEmail` from `src/utils/validate.ts`"]`
- **Called by:** `[who calls this function — e.g., "Called by `handleSignup` in `src/features/user/signup.ts`"]`

### Pattern
[Reference existing similar code: "follow the pattern in `src/utils/formatSlug` for function structure, JSDoc style, and export format."]

> **FP guidance:**
> - **Pure core function:** no I/O, no side effects, testable without mocks. Return result objects.
> - **Shell function:** handles I/O, catches errors, calls the core. May throw or return result objects.
> - **Pipeline composition:** if the logic involves multiple transformation stages, consider using a Ramda pipe.
> - **Factory function:** if the function returns another function or a stateful object, use PascalCase.
```

## Hook Task Addendum

For React hooks (state management, data fetching, side effects), add these sections after `Logic`:

```markdown
### Hook: [hookName]

**Depends on:** `[values in dependency array — e.g., "Depends on `userId`. If `userId` changes, re-run the effect."]`
**Side effects:** `[what external systems the hook interacts with — e.g., "Fetches data from `/api/users`", "Subscribes to WebSocket", "Persists to localStorage"]`
**State shape:** `[internal state — e.g., "Manages `loading: boolean`, `data: User[] | null`, `error: Error | null`"]`
**Lifecycle:**
- On mount: `[what happens — e.g., "Fetch initial data"]`
- On update: `[what happens when dependencies change — e.g., "Refetch when `userId` changes"]`
- On unmount: `[cleanup — e.g., "Cancel in-flight requests", "Unsubscribe from WebSocket"]`
**Return value:** `[what the hook returns — e.g., "Returns `{ data, loading, error, refetch }`"]`
**Consumer contract:** `[who should use this hook — e.g., "Intended to be called by components that need user data"]`
```

## Key Design Decisions

- **"What to do" is a one-liner,** folded into the title. It duplicates "Logic."
- **"Edge Cases" merged into "Logic".** Edge cases are part of the logic, not a separate concern. Listing them separately creates a mental split: "read Logic for happy path, Edge Cases for the rest." But the happy path and edge cases are the same function.
- **"Layer" designation is critical.** Pure core = no I/O, no side effects, synchronous, return result objects. Imperative shell = handles I/O, catches errors, calls the core. This determines error handling strategy, async behavior, and what's allowed.
- **"Dependencies" section.** What to import, what to call, what calls this. The execution agent shouldn't have to hunt for imports or guess calling conventions.
- **"Types" has full inline definitions.** TypeScript is non-negotiable. Full parameter type, full return type, new type definitions inline. Existing type references include location. Return type pattern specifies whether it's a Result object, discriminated union, or plain value.
- **"Logic" is a spec, not code.** Natural language data flow, decision points, step-by-step algorithm. Enough detail to write the function from scratch without looking at anything else. Not so much that it reads like code.
- **FP guidance is contextual, not repetitive.** "Use const" and "no mutation" are baseline (FP paradigm rulebook covers it). Instead, the plan agent flags: pure core vs shell, pipeline composition, factory functions.
- **Hook tasks have fundamentally different concerns.** Dependency array, side effects, state shape, lifecycle behavior, cleanup, return value. A hook template differs from a function template.