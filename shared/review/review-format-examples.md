# Review Format Examples

This document contains complete examples demonstrating the comprehensive code review format with system understanding, data flow mapping, and prioritized findings.

---

## Complete Review Example: Backend Worker

```markdown
# Code Review Summary - feature/presale-notifications

## Review Findings

**Prioritization**: Issues in changed code must be fixed. Issues in context files are pre-existing and informational.

### ⚠️ Issues

**In Changed Code** (primary - must be addressed):
- **N+1 query**: Fetching entry counts in a loop creates N HTTP calls where one batched call would do — the trace shows the loop running once per market (question 3: this is more machinery than the job needs) - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L34)
- **Magic number**: Stagger delay of `120000` is hardcoded, so nobody can change the pace without a code change - [scheduleMarkets](../../apps/notification/planSends/helpers/scheduleMarkets.ts#L45)
- **No input validation**: Handler doesn't check the message shape before processing (violates `standards-errors` — the shell validates what it reads from outside) - [planSends](../../apps/notification/planSends/index.ts#L23)

**In Context Files** (secondary - nice to fix but not blocking):
- **Missing type export**: The `Campaigns` service type is not exported from `campaigns.ts`, so every caller has to rebuild it with `typeof` (violates `standards-file-organization` — the index is a forwarder for the public API) - [campaigns](../../shared/services/mongo/campaigns.ts#L1)

### ❓ Questions
- **Rate limit calculation**: Why 2-minute stagger? Is this based on SendGrid's rate limits or internal throttling? - [STAGGER_DELAY](../../apps/notification/planSends/helpers/scheduleMarkets.ts#L10)
- **Notification window**: Should we skip markets if notification date is more than 1 hour past? - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L28)
- **Retry logic**: What happens if entry-service HTTP call fails? Do we retry or skip that market? - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L34)

### 📝 Nits

**In Changed Code**:
- **Function naming**: `SetMarketNotifications` is a plain helper written in factory style, and its name names the field rather than the job (violates `standards-naming`) - [SetMarketNotifications](../../apps/notification/planSends/helpers/setMarketNotifications.ts#L5)
- **Duplicate logic**: Market filtering by `date.notification` appears in both Mongo query and JS filter - could be DRYer - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L28)

**In Context Files** (optional):
- **Inconsistent naming**: `findNotifiableCampaignIds` uses `find` prefix but similar function uses `get` prefix elsewhere in codebase - [findNotifiableCampaignIds](../../shared/services/mongo/campaigns.ts#L89)

**Recommendation**: Needs changes - Fix N+1 query pattern and add input validation before merge. Consider moving stagger delay to config.
```

---

## Complete Review Example: Frontend Component

```markdown
# Code Review Summary - feature/seat-availability

## Review Findings

### ⚠️ Issues

**In Changed Code** (primary - must be addressed):
- **Race condition** (a plain-English way to say it: two sources of the truth arrive in any order, so the screen can show a stale count): the cache update and the live message can land out of order - the trace shows the message arriving first on 3 of 5 runs (question 1: the ticket requires the count the server last confirmed) - [handleSeatUpdate](../../hooks/useSeatAvailability.ts#L48)
- **Business logic in component**: `SeatCounter` decides which of four states to render inline, so the rule exists in two dialects — here and in the hook (violates `standards-file-organization`: the rule belongs with the state it reads) - [SeatCounter](../../components/SeatCounter/index.tsx#L34)
- **No error handling on the socket**: nothing catches a connection failure, so the failure the ticket names reaches the user as a blank screen (violates `standards-errors` — the shell catches what crosses the boundary) - [useSeatAvailability](../../hooks/useSeatAvailability.ts#L25)

**In Context Files** (secondary - nice to fix but not blocking):
- **Type inconsistency**: Socket store types use `any` instead of proper Socket.io types - [socket.ts](../../lib/store/socket.ts#L8)

### ❓ Questions
- **Debounce timing**: Why 500ms debounce? Have we tested this feels responsive enough during high-traffic presales? - [DEBOUNCE_MS](../../hooks/useSeatAvailability.ts#L12)
- **Optimistic updates**: Should we optimistically decrease count when this user submits, before WebSocket confirms? - [handleSeatUpdate](../../hooks/useSeatAvailability.ts#L45)
- **Reconnection strategy**: Exponential backoff maxes at 30s - is this too aggressive for mobile users with spotty connections? - [useSocketConnection](../../hooks/useSocketConnection.ts#L35)

### 📝 Nits

**In Changed Code**:
- **Named export inconsistency**: Every sibling hook has a default export and this one exports named, so its folder's `index.ts` forwarder cannot follow their shape (violates `standards-file-organization`) - [useSeatAvailability](../../hooks/useSeatAvailability.ts#L8)
- **Duplicate threshold**: Warning threshold `10` appears twice, should extract to constant - [SeatCounter](../../components/SeatCounter/index.tsx#L34) and [SeatWarning](../../components/SeatCounter/SeatWarning.tsx#L12)
- **Could use optional chaining**: Nested property access could be safer with `?.` operator - [handleSeatUpdate](../../hooks/useSeatAvailability.ts#L52)

**Recommendation**: Needs changes - Fix race condition and move business logic to hook. Add error boundary before merge.
```

---

## Cross-Examination Example

Past findings integrate directly into Issues/Nits when they still need action — using a divergence sub-bullet — and only no-action findings live in the small `🔁 Cross-Examination` section. Below is a single review showing both.

```markdown
### ⚠️ Issues

**In Changed Code** (primary - must be addressed):
- **N+1 query**: Loop fires one HTTP call per market when one batched call would do — [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L34)
  - *Past review flagged the slowness but missed that timeouts also drop markets entirely.*
- **Stale session in token**: Token is built with old session data when the session expires between validation and signing — [signToken](../../shared/services/identity/token/jwt.ts#L30)
  - *Past review only flagged a naming nit here; trace shows a real behavioral bug.*

### 🔁 Cross-Examination

**Prior review**: [review.md from 5-10-26-14:30](../5-10-26-14:30/review.md)

- **[Magic number](../../apps/notification/planSends/helpers/scheduleMarkets.ts#L45)** — Agree, nothing to add — Stagger delay should be a config constant.
- **[No input validation](../../apps/notification/planSends/index.ts#L23)** — No longer applies — Lambda event schema now validates message shape at runtime.
- **[Missing null check on user](../../src/handlers/user.ts#L88)** — Resolved in this revision — Current diff adds the null guard.
```

---

## Issue Citation Examples

### Correct Citations
- ⚠️ Using `let` instead of `const` (violates `standards-coding`) - [counter](../../src/utils.ts#L12)
- ⚠️ Function name doesn't start with a verb (violates `standards-naming`) - [userById](../../src/api.ts#L34)
- ⚠️ Error caught and swallowed instead of logged and rethrown (violates `standards-errors`) - [validate](../../src/validators.ts#L45)
- ⚠️ A secret is hardcoded in the source instead of read from the environment (the ticket named where it comes from) - [API_KEY](../../src/config.ts#L5)

### Incorrect Citations (Don't Do This)
- ❌ This code is messy - [file.ts](../../src/file.ts#L12) *(not grounded in session evidence, too vague)*
- ❌ Should use better naming - [func](../../src/api.ts#L23) *(no specific violation)*
- ❌ This could be improved (violates best practices) - [code](../../src/utils.ts#L45) *("best practices" is not specific)*

---

## Nit Examples with Context

### Code Reuse Opportunities
- 📝 This date formatting logic exists in `shared/util/formatDate.ts` - could reuse instead of duplicating - [formatDate](../../src/helpers.ts#L23)
- 📝 Similar normalization in `shared/util/normalizeObjectIds.ts` - consider using shared utility - [normalize](../../src/parsers.ts#L45)

### Simplification Opportunities
- 📝 Could simplify with `R.pipe(R.pluck('id'), R.uniq)` instead of manual loop - [getIds](../../src/utils.ts#L67)
- 📝 This nested ternary is hard to read - consider extracting to named variables - [conditional](../../src/components/Display.tsx#L34)

### Pattern Consistency
- 📝 Other similar handlers use object argument pattern for 3+ params - consider matching that style - [function](../../src/api.ts#L12)
- 📝 Folder layout differs from the worker pattern in `apps/` (violates `standards-file-organization`: one folder per feature, forwarder index) - [index.ts](../../src/worker/index.ts#L1)
