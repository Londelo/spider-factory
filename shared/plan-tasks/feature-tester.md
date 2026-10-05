# Feature-Test Task Template (composition tier)

Template for `feature-test` category tasks — the **middle tier**. Executed by the `feature-tester`
agent, which proves **one feature's pieces are actually wired together**: the unit-tested functions
and components compose correctly, and every error and success the feature encapsulates surfaces.

**This tier is not exhaustive and must not be planned as if it were.** It never re-runs the unit
tier's edge-case matrix and never walks cross-feature journeys (`e2e-tester` owns those). Anything
the `unit-tests` ticket already proved for a function is out of scope here — one representative case
per path the feature exposes, asserted at the seam.

Browser mechanics are the agent's skill's business (`framework-playwright`) — never spell them here.

## Template

```markdown
## Task: Feature-test `[flow name]`

**File:** `exact/path/to/file.playwright.spec.ts`
**Unit:** `test.describe('[flow name]', ...)`
**Category:** feature-test
**Tier:** feature (one feature's pieces wired together)
**Scope:** single-entry (co-locate with the page/component entry point) | cross-entry (project-level flows dir)
**Mode:** testing-changes | tdd
**Depth:** light (one happy-path journey) | standard (happy + the key error/empty states) | thorough (multiple journeys incl. error and empty)
**Existing test file:** no (create new) | yes (append to `path/to/existing.playwright.spec.ts`)
**Skip:** no | yes — [reason, e.g., "journey already covered by e2e/login-then-dashboard.playwright.spec.ts"]

### Description
[Short: what user-facing flow this verifies and its outcome. Not "write browser tests" — say
"Verifies a logged-in user can open the profile page, edit their name, save, and see the change
persist."]

### Composition Under Test — the seams this proves
- `[piece A] → [piece B]` with `[the data that must cross]`
- `[component] → [hook/service] → [endpoint]` — [what must arrive intact]
- [the 2–4 real connections that make this feature a feature; if this list is empty, the ticket is
  a unit test in disguise]

### Outcomes That Must Surface
- **Successes:** [each promise the feature makes — record saved, list updated, redirect landed]
- **Errors:** [each error the feature encapsulates — validation reject, failed request, empty
  result, permission denied → what the user sees]
> One test each, observed where the user can see it. Not one test per input value.

### Journey (concrete, not placeholders)
- **Entry:** [where it starts — "authenticated, land on `/dashboard`"]
- **Interaction:** [what the user does — "fill `#email` + `#password`, click `#sign-in`"]
- **Verify:** [the observable outcome — "URL `/dashboard`, `Dashboard` heading visible"]

> **Gold standard:** "Login: fill `#email`, `#password`, click `Sign In` → URL `/dashboard`, heading
> 'Dashboard' visible. Invalid credentials → `role=alert` visible."
> Real routes, real ids, real outcomes. Tell the agent exactly what to assert, not "test the flow."

### Locators
- **Primary:** `[#-first — page.locator('#email'); the frontend agent provides ids — list the real ones]`
- **Fallback:** `[accessible role when no id exists — page.getByRole('button', { name: 'Sign In' })]`
- [name any element still missing an `id` and cross-link its `frontend-ui` task]

### Boundary Mocks — outside the feature only
- **API routes:** [`page.route()` targets + realistic fixture shape — "**/api/subscriptions" returns [{id, name, price, renewalDate}]]`
- **Third-party:** [external services to mock/block]
- **Never mocked:** [modules inside the feature under test — stubbing those deletes the wiring being proved]

### Fixtures & Auth
- **Auth:** [none | authenticated via fixture + stored state]
- **Data factories:** [records the journey needs, created through the app or sanctioned seeding]
- **Per-test setup:** [navigation/state each test starts from]

### Page Object Model
- **POM:** [no | yes — extract only if locators repeat across 2+ tests]

### Test Setup
- **File location:** [exact path — co-located, or the project-level flows directory for cross-entry]
- **Browsers:** [whatever playwright.config.ts already declares — read it, don't invent]
- **Config:** [note only if this ticket must create/modify config]
- **Pattern reference:** [e.g., "follow e2e/login.spec.ts for auth + mock setup"]

### Owned Elsewhere — do not duplicate
- **unit tier:** [the branches/edge cases the `unit-tests` ticket already proves — name them]
- **epic tier:** [cross-feature journeys left to `e2e-test`]

### Run
- Run the file you touched and confirm PASS (FAIL-first if `Mode: tdd`)
- Debug to root cause (trace / UI mode / screenshot) — fix, never patch in a wait or a force
- Report pass/fail count and any uncovered outcome
```

## Key Design Decisions

- **Composition Under Test is the ticket's spine.** The seams are what only this tier can see. If a
  ticket has no seams, it is a unit test wearing a browser and belongs below.
- **Outcomes That Must Surface replaces exhaustive scenarios.** Errors and successes are enumerated
  **once each**, from the user's side. The unit tier owns the input matrix; duplicating it here is
  the single most common failure of this tier.
- **"Owned Elsewhere" makes no-duplication enforceable.** The plan agent reads the sibling unit
  tickets and names what they already proved, so the worker doesn't re-prove it.
- **Boundary Mocks states what must NOT be mocked.** A mocked module inside the feature under test
  makes the wiring untestable; the exclusion is written into the ticket on purpose.
- **One representative case per path.** Depth controls how many journeys, never how many inputs.
- **`id`-first locators.** The frontend agent provides ids; the plan agent lists the real ones and
  cross-links a `frontend-ui` ticket when one is missing.
- **Scope drives placement** — single-entry co-locates, cross-entry goes to the project-level flows
  directory. The agent's own placement rule, stated up front.
- **Framework-agnostic ticket.** Locators, fixtures, config, and Playwright commands are the
  `framework-playwright` skill's; the ticket records project reality (real ids, real routes, real
  config) and tier intent.
- **"Mode" and "Skip" flags** behave as in the other templates: expected color, and a deliberate
  no-op with a reason.
- **"Run" kept** — execute, debug to root cause, report.
