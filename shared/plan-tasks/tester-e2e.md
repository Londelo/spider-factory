# E2E-Test Task Template (broad tier)

Template for `epic-e2e-test` category tasks — the **broad tier**. Executed by the `tester-e2e` agent,
which walks **end-to-end journeys across features** in a real browser against the real stack, proving
the features play nicely together.

**This is the thinnest tier and must be planned that way.** It re-runs no unit-tier edge case and no
feature-tier seam: journeys cross at least one feature boundary or they are not this tier's work.
One journey per user-visible outcome. Browser mechanics belong to the agent's
`framework-playwright` skill — never spell them here.

## Template

```markdown
## Task: E2E journey `[user-facing outcome]`

**File:** `e2e/[journey-name].playwright.spec.ts`
**Category:** epic-e2e-test
**Tier:** broad (journeys across features on the real stack)
**Scope:** cross-feature (never co-located — the project-level flows directory)
**Mode:** testing-changes | tdd
**Depth:** light (one headline journey) | standard (headline + the failure journey) | thorough (the full promised set across features)
**Existing test file:** no (create new) | yes (append to `path/to/existing.playwright.spec.ts`)
**Skip:** no | yes — [reason, e.g., "stays inside one feature — that feature's `feature-test` ticket owns it"]

### Description
[Short: the outcome the epic promised and who reaches it. Not "test the flow end to end" — say
"Verifies a subscriber created in Billing appears with the correct renewal date on the Dashboard and
survives a reload."]

### Journey
- **Entry:** [where a real user starts — logged in, landing on `/x`]
- **Path:** [feature A → feature B → feature C, with the interaction at each stop]
- **Outcome:** [the observable truth at the end — what is on screen, what the URL says]
> Real routes, real ids, real outcomes. The plan agent read the merged features — report what it saw.

### Feature Boundaries Crossed — the reason this ticket exists
- `[feature A] produces [record/state] → [feature B] displays it`
- `[feature C] reads what [feature A] changed`
- [at least one boundary; a journey with none is the feature tier's ticket]

### Continuity To Prove
- **State handoff:** [value created/edited here is correct there]
- **Persistence:** [survives navigation | reload | a second feature]
- **Session:** [auth/permission/setting holds across the walk]

### Outcomes That Must Surface
- **Success:** [the headline outcome of the features this journey touches — observed once]
- **Failure:** [the headline failure of a feature this journey touches → the user sees the error and
  can recover; the app remains usable]
> One each, seen from the outside. No per-input variants — that proof exists below you.

### Real Stack
- **Build:** production build behind the test runner's webServer — never a dev server
- **Persistence:** real (real database/store through the app) — persistence is the subject, not a double
- **Third-party mocks only:** [payments, email, external OAuth, analytics — with realistic fixtures]
- **Never mocked:** [anything inside the app — stubbing the system under test makes the journey theatre]

### Fixtures & Data
- **Seed:** [the records the journey starts from, and how they are created]
- **Uniqueness:** [how this journey's data cannot collide with another journey's]
- **Auth:** [shared auth state / setup project]

### Test Setup
- **File location:** [exact path in the project-level flows directory]
- **Browsers / config:** [whatever playwright.config.ts already declares — read it, don't invent]
- **Serial where required:** [if two journeys contend for the same real state, say so]
- **Pattern reference:** [e.g., "follow e2e/checkout-smoke.playwright.spec.ts"]

### Owned Elsewhere — do not duplicate
- **feature tier:** [intra-feature seams and contracts the feature tickets already prove]
- **unit tier:** [branch/edge-case proofs that exist below]

### Run
- Run against the production build; confirm PASS (FAIL-first if `Mode: tdd`)
- Debug to root cause with the trace viewer — a journey that only passes on retry is broken
- Report journeys walked, outcomes proved, journeys unwalked, and anything a lower tier should have
  caught (name the tier — that is a tower bug, not your work)
```

## Key Design Decisions

- **Feature Boundaries Crossed is the admission test.** A journey that never crosses a boundary is
  the feature tier's already-passing test in expensive clothing — the template forces it to be
  written down so the plan agent can see when there isn't one.
- **Continuity To Prove is the tier's unique value.** State set down by one feature arriving intact at
  another, surviving navigation and reload: nothing below this tier can observe it, and it is the
  bug class every tower leaks through.
- **One success and one failure per feature, from the outside.** Enumerating inputs here duplicates
  two lower suites for a fraction of the signal.
- **Real Stack is a hard constraint, written into the ticket.** Only genuinely third-party services
  get mocked; an e2e suite that stubs its own app proves nothing and reads as green.
- **"Owned Elsewhere" makes no-duplication enforceable** at the top of the pyramid, where duplication
  is most expensive — the plan agent names what the feature and unit tickets already proved.
- **Findings for lower tiers** is part of the contract: if an e2e test has to prove something a
  feature test should have, the ticket says so instead of quietly covering the hole.
- **Framework-agnostic ticket.** Locators, fixtures, config and commands come from
  `framework-playwright`; the ticket carries project reality and tier intent.
- **"Mode", "Skip", "Depth"** behave as in the other templates; here `Depth` mostly means how many
  journeys, never how many inputs.
- **"Run" kept** — production build, root-cause debugging, report.
