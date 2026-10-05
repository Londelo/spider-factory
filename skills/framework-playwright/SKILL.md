---
name: framework-playwright
description: >
  Playwright browser-testing framework knowledge: the runner reality check, spec naming and
  placement, id-first locators and the getByRole fallback, web-first assertions, auto-waiting and
  the anti-flake rules, page.route API mocking, test.extend fixtures and storageState auth,
  page-object rule, playwright.config.ts (webServer, projects, retries, trace/video), the run and
  debug commands, and Trace Viewer triage. Load this BEFORE writing a single browser test — an
  invented locator or a hand-rolled sleep is the difference between a suite and a flake factory.
  Trigger: "playwright", "locator", "page.route", "getByRole", "storageState", "playwright.config",
  "trace viewer", "flaky test", "browser test", "how do I wait for".
version: 0.1.0
---

# Playwright — the framework

This skill is the **tool**. It says how to write a Playwright test. It never says *what* to test or
*how much* — that belongs to the test tier (`agents/feature-tester.md` owns one feature's flow,
`agents/e2e-tester.md` owns cross-feature journeys). The tier decides whether a test exists; this
skill decides only how it is spelled.

Both browser tiers load this same skill. What differs between them is scope, not syntax.

## Step 0 — Confirm the runner before writing anything

1. `playwright.config.ts` — does it exist? What are `baseURL`, `webServer`, `projects`, `retries`,
   `reporter`? Match the project; never invent a competing config.
2. `package.json` — `@playwright/test` version and the `test` script.
3. Two existing `*.playwright.spec.ts` files — copy their import line, fixture usage, and locator
   style. The repo's own style beats any convention below.

```typescript
import { test, expect } from '@playwright/test'
```

## File naming and placement

- Extension: `.playwright.spec.ts` — never plain `.spec.ts` (that is the unit tier's namespace).
- **Single entry point** (one page or component owns the flow) → co-locate at that entry point:

```
src/app/dashboard/page.tsx → src/app/dashboard/dashboard.playwright.spec.ts
src/components/header.tsx  → src/components/header.playwright.spec.ts
```

- **No single entry point** (the flow crosses pages) → repo-root `e2e/`:

```
e2e/login-then-dashboard.playwright.spec.ts
```

Which of the two applies is the tier's decision, and the ticket says so in `**Scope:**`. Shared
fixtures live in `e2e/fixtures/`; page objects, when earned, in `e2e/pages/`.

## Locators — id first, always

The frontend engineer puts an `id` on every component the flow touches. Target it:

```typescript
await page.locator('#email').fill('user@example.com')          // 1. id
await page.getByRole('button', { name: 'Sign In' }).click()    // 2. accessible role + name
```

- Never CSS classes, never XPath, never `nth-child`, never Tailwind utility names — those are
  styling, and styling changes without the behavior changing.
- Ambiguous locator → scope it: `page.getByRole('list').getByRole('listitem')`.
- A missing `id` you need is a **frontend gap**, not your work: write it into the ticket comment and
  cross-link the `frontend-ui` ticket. Do not add the `id` yourself, and do not silently downgrade
  to a brittle selector to get around it.

## Assertions and waiting — the anti-flake rules

Web-first assertions retry themselves. Hand-rolled waiting does not.

```typescript
await expect(page).toHaveURL('/dashboard')
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
await expect(page.getByRole('alert')).toContainText('Invalid credentials')
await expect(page.locator('#row-count')).toHaveText('3')
```

| Never | Instead |
|---|---|
| `page.waitForTimeout(1000)` | the assertion above — it auto-waits |
| `page.waitForNavigation()` | `await expect(page).toHaveURL(...)` |
| `if (await el.isVisible())` branching | assert the state you expect to be in |
| `page.setContent` faking the app | run against the real built app |
| retry until green | fix the root cause; retries hide the bug |

Every action (`click`, `fill`) already auto-waits for actionability. If a test needs a wait, the
usual cause is a missing assertion, not a missing sleep.

## Mocking — only what is outside the system under test

Intercept the network, keep the app real:

```typescript
await page.route('**/api/subscriptions', route =>
  route.fulfill({ json: [{ id: '1', name: 'Pro', price: 1900, renewalDate: '2026-11-01' }] })
)
await page.route('**/googletagmanager.com/**', route => route.abort())   // third-party noise
```

- Fixture payloads must be **realistic** — real shapes, real dates, real edge values — from the
  ticket's `**Realistic data:**` field.
- `page.route` is for the *external* boundary. Never stub a module, store, or function that lives
  inside the feature you are testing: that deletes the exact wiring the test exists to prove.
- `await page.unroute(...)` in cleanup when a route is registered inside a test, not a hook.

## Fixtures, auth, and state

Shared state goes through `test.extend`, never module-level variables (tests of one file must not
see each other):

```typescript
type Ctx = { authedPage: Page; makeSubscription: (n: number) => Promise<Subscription> }

export const test = base.extend<Ctx>({
  authedPage: async ({ browser }, use) => {
    const ctx = await browser.newContext({ storageState: 'e2e/.auth/user.json' })
    const page = await ctx.newPage()
    await use(page)
    await ctx.close()
  },
})
```

- Auth: a setup project writes `storageState` once (`test('authenticate', ...) →
  storageState: 'e2e/.auth/user.json'`); every dependent test reuses it. Log in through the UI
  once, never per test, never through a private back door.
- Data: factories in `e2e/fixtures/` that create real records through the app or a sanctioned
  seeding endpoint, with unique keys per test so runs cannot collide.

## Page objects — earned, not default

Extract a page object **only** when the same locators repeat across 2+ tests. One test using a
locator is an inline locator. A page object for one test is indirection with no second consumer.

## Config

`playwright.config.ts` — touch it only when the ticket says the config is the work:

```typescript
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm run build && npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
})
```

- `webServer` points at the **production build** — testing a dev server tests a different app.
- Browsers: match what the project already ships (chromium alone is fine if that is the project).
- CI owns retries and reporters; a test that only passes on retry is broken, not retried.

## Run and debug

```bash
npx playwright test src/app/dashboard/dashboard.playwright.spec.ts   # the file you touched
npx playwright test --last-failed                                    # re-run the failures
npx playwright test --ui                                             # interactive authoring
npx playwright show-trace trace.zip                                  # post-mortem
```

Debug in this order: **Trace Viewer** (what the page looked like at each step) → UI Mode →
failure screenshot. Diagnose to root cause, then fix the cause. A test that goes green after you
added a wait, a retry, or a `force: true` has not been fixed — it has been silenced.

## Documentation

Consult only when stuck — the patterns above are the working set.

- Intro: <https://playwright.dev/docs/intro>
- Best practices: <https://playwright.dev/docs/best-practices>
- Locators: <https://playwright.dev/docs/locators>
- Auto-waiting: <https://playwright.dev/docs/actionability>
- Fixtures: <https://playwright.dev/docs/test-fixtures>
- Network mocking: <https://playwright.dev/docs/network>
- Page objects: <https://playwright.dev/docs/pom>
- Tracing / debugging: <https://playwright.dev/docs/trace-viewer>
