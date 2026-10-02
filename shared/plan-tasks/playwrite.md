# Playwright Task Template

Template for `playwright` category tasks. Used by the playwrite agent to write browser tests that verify frontend functionality — user interactions, navigation, rendering, and error states.

Playwright tests are **not exhaustive**. They verify that the frontend works correctly in the browser, not that every branch is covered. Unit-level coverage of pure logic, formatters, validators, and helpers belongs to the `jest-test` category (jester agent) — a Playwright task never duplicates it.

## Template

```markdown
## Task: Test `[flow or page name]`

**File:** `exact/path/to/file.playwright.spec.ts`
**Unit:** `test.describe('[flow or page name]', ...)`
**Category:** playwright
**Scope:** single-page (co-located with the page/component entry point) | cross-page (lives in repo-root `e2e/`)
**Mode:** testing-changes | tdd
**Existing test file:** no (create new) | yes (append to `path/to/existing.playwright.spec.ts`)
**Skip:** no | yes — [reason, e.g., "Journey already covered by `e2e/login-then-dashboard.playwright.spec.ts`"]
**Depth:** light (one happy-path journey) | standard (happy + key error/empty/loading states) | thorough (multiple journeys incl. error, empty, and edge flows)

### Description
[Short: what user-facing flow this verifies and its outcome. Not "write comprehensive browser tests" — say "Verifies a logged-in user can open the profile page, edit their name, save, and see the change persist."]

### User Journey
- **Entry:** [where the test starts — e.g., "navigate to `/login`", "authenticated, land on `/dashboard`"]
- **Interaction:** [what the user does — e.g., "fill email + password, click Sign In"]
- **Verify:** [the observable outcome — e.g., "URL is `/dashboard`, `Dashboard` heading is visible"]
- [concrete navigate → interact → assert steps. Not vague placeholders — the plan agent read the code, it should communicate what it learned about the real routes and elements.]
- [happy-path journey]
- [error-state journey — e.g., invalid submit shows an alert]
- [empty/loading state, if meaningful]

> **This is the gold standard:** "Login: fill `#email`, `#password`, click `Sign In` → URL `/dashboard`, heading 'Dashboard' visible. Invalid credentials → `role=alert` visible."
> Concrete navigate/interact/assert steps with real locators. Tell the playwrite agent exactly what to assert, not "test the login flow."

### Locators
- **Primary:** `[id-first — e.g., "page.locator('#email')", "page.locator('#submit-btn')". The frontend engineer provides `id` attributes on every component; list the ids the test will target.]`
- **Fallback:** `[getByRole when no id exists — e.g., "page.getByRole('button', { name: 'Sign In' })"]`
- [Note any element the frontend task must add an `id` to, if missing — cross-link the frontend-ux task.]

### Fixtures & Auth
- **Auth:** `[none | authenticated — e.g., "Use auth fixture with `test.extend()` + `storageState` (pre-logged-in context)"]`
- **Data factories:** `[if test data is needed — e.g., "Create a fixture user with 3 subscriptions via a data factory"]`
- **Per-test setup:** `[beforeEach navigation/state — e.g., "beforeEach: navigate to `/dashboard` with authenticated context"]`

### Mocks
- **API routes:** `[what to intercept with `page.route()` — e.g., "Mock `**/api/subscriptions` returning realistic fixture array"]`
- **Third-party:** `[external services to mock — e.g., "Mock Stripe checkout script", "Block analytics beacon"]`
- **Realistic data:** `[describe the realistic fixture shape the mock returns — e.g., "returns `[{ id, name, price, renewalDate }]`"]`
- [none — no external calls, test against the built app directly]

### Page Object Model
- **POM:** `[no | yes — e.g., "Extract `LoginPage` only if locators repeat across 2+ tests; otherwise keep inline"]`
> Rule: page objects only where locators are reused across 2+ tests. Never for a single test.

### Test Setup
- **File location:** `[exact path — e.g., "src/app/dashboard/dashboard.playwright.spec.ts (co-located, new)" or "e2e/login-then-dashboard.playwright.spec.ts (cross-page, repo root)"]`
- **Browsers:** `[chromium | chromium, firefox, webkit — based on project `playwright.config.ts` projects]`
- **Config:** `[new playwright.config.ts needed? webServer (production build), reporters, retries, trace/video — note only if this task must create/modify config]`
- **Pattern reference:** `[if a specific file to follow — e.g., "Follow the pattern in `e2e/login.spec.ts` for auth fixture and mock setup"]`

### Run
- Run the test after writing (`npx playwright test <file>`) and confirm PASS
- Debug failures to root cause (Trace Viewer / UI Mode / screenshots) — fix, do not patch
- Report pass/fail count and any uncovered journeys
```

## Key Design Decisions

- **"Description" over "What to do."** "Write comprehensive browser tests for X" tells the playwrite agent nothing its role doesn't already cover. A short description of the user-facing flow and its outcome is more useful.
- **User Journey is concrete, not placeholders.** `[Step 1: navigate, Step 2: interact, Step 3: assert]` as placeholders signals the plan agent hasn't done its homework. The plan agent reads the code — it should communicate the real routes, real `id`s, and real expected outcomes.
- **`id`-first locators.** The frontend engineer provides `id` attributes on every component; Playwright tests target them with `page.locator('#id')` first and fall back to `getByRole`. The plan agent lists the ids it saw — and cross-links a frontend-ux task if a needed `id` doesn't exist yet.
- **Scope: single-page vs cross-page determines file location.** Single-page flows co-locate next to the page/component entry point; cross-page flows with no single entry point live in repo-root `e2e/`. This is the playwrite agent's placement rule, made explicit up front.
- **"Locators", "Fixtures & Auth", "Mocks", "POM" broken out.** These are the practical decisions Playwright needs that a Jest template doesn't: interception targets, auth/storageState, and when to extract a page object. Surfacing them here saves the playwrite agent rediscovery time.
- **"Mocks" identified by the plan agent.** The plan agent read the code — it knows which API routes and third-party services the flow touches and can specify realistic fixture shapes so the tests are deterministic and fast.
- **"Skip" flag.** The plan agent explicitly flags journeys already covered elsewhere (unit tests, existing Playwright specs) so no duplicate task is created.
- **"Mode" indicator.** testing-changes (implementation exists, verify current behavior) vs tdd (no implementation yet, write failing browser tests first). Removes ambiguity.
- **"Depth" indicator.** light (one happy-path journey), standard (happy + key error/empty/loading), thorough (multiple journeys with error/empty/edge). Aligns with the playwrite heuristic: "if removing the test would leave a user-facing behavior unverified — write it; if it would re-assert a library works — skip it."
- **Browsers and config pulled from project reality.** The plan agent reads `playwright.config.ts` if it exists and records the actual projects/reporters, so the playwrite agent matches the project rather than inventing config.
- **"Run" section kept as-is.** Explicitly tell the playwrite agent to execute tests, debug to root cause, and report results.
