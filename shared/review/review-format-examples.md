# Review Format Examples

This document contains complete examples demonstrating the comprehensive code review format with system understanding, data flow mapping, and prioritized findings.

---

## Complete Review Example: Backend Worker

```markdown
# Code Review Summary - vf2-5146_review

## Review Findings

**Prioritization**: Issues in changed code must be fixed. Issues in context files are pre-existing and informational.

### ✅ Nice Work
- **Elegant grouping logic**: Uses `R.pipe(groupByPresaleStart, Object.entries, sortMarkets)` for clean functional composition - [scheduleMarkets](../../apps/notification/planSends/helpers/scheduleMarkets.ts#L23)
- **Proper error handling**: Each helper has catch/log/rethrow with context - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L45)

### ⚠️ Issues

**In Changed Code** (primary - must be addressed):
- **N+1 query**: Fetching entry counts in a loop creates N HTTP calls. Should batch into single request (violates performance.md) - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L34)
- **Magic number**: Stagger delay of `120000` is hardcoded, should be config constant (violates code-style.md) - [scheduleMarkets](../../apps/notification/planSends/helpers/scheduleMarkets.ts#L45)
- **No input validation**: Handler doesn't validate SQS message shape before processing (violates errors.md) - [planSends](../../apps/notification/planSends/index.ts#L23)

**In Context Files** (secondary - nice to fix but not blocking):
- **Missing type export**: `Campaigns` service type not exported from campaigns.ts, forcing consumers to use `typeof` (violates code-style.md) - [campaigns](../../shared/services/mongo/campaigns.ts#L1)

### ❓ Questions
- **Rate limit calculation**: Why 2-minute stagger? Is this based on SendGrid's rate limits or internal throttling? - [STAGGER_DELAY](../../apps/notification/planSends/helpers/scheduleMarkets.ts#L10)
- **Notification window**: Should we skip markets if notification date is more than 1 hour past? - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L28)
- **Retry logic**: What happens if entry-service HTTP call fails? Do we retry or skip that market? - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L34)

### 📝 Nits

**In Changed Code**:
- **Function naming**: `SetMarketNotifications` uses PascalCase but it's a factory, should be more explicit like `CreateMarketNotificationUpdater` (violates naming.md) - [SetMarketNotifications](../../apps/notification/planSends/helpers/setMarketNotifications.ts#L5)
- **Duplicate logic**: Market filtering by `date.notification` appears in both Mongo query and JS filter - could be DRYer - [getMarketsAndCounts](../../apps/notification/planSends/helpers/getMarketsAndCounts.ts#L28)

**In Context Files** (optional):
- **Inconsistent naming**: `findNotifiableCampaignIds` uses `find` prefix but similar function uses `get` prefix elsewhere in codebase - [findNotifiableCampaignIds](../../shared/services/mongo/campaigns.ts#L89)

**Recommendation**: Needs changes - Fix N+1 query pattern and add input validation before merge. Consider moving stagger delay to config.
```

---

## Complete Review Example: Frontend Component

```markdown
# Code Review Summary - vf2-8234_review

## Review Findings

### ✅ Nice Work
- **Smart debouncing**: Using `useDebouncedCallback` prevents excessive re-renders from rapid WebSocket messages - [handleSeatUpdate](../../hooks/useSeatAvailability.ts#L45)
- **Proper cleanup**: WebSocket unsubscribe in useEffect cleanup prevents memory leaks - [useSeatAvailability](../../hooks/useSeatAvailability.ts#L68)
- **Graceful degradation**: Falls back to polling if WebSocket fails to connect - [useSocketConnection](../../hooks/useSocketConnection.ts#L52)

### ⚠️ Issues

**In Changed Code** (primary - must be addressed):
- **Race condition**: SWR cache update and WebSocket message could arrive out of order, showing stale count (violates frontend.md) - [handleSeatUpdate](../../hooks/useSeatAvailability.ts#L48)
- **Business logic in component**: SeatCounter component has conditional rendering logic that should be in a hook (violates frontend.md) - [SeatCounter](../../components/SeatCounter/index.tsx#L34)
- **No error boundary**: Component doesn't handle WebSocket connection errors, will crash if socket.io throws (violates errors.md) - [useSeatAvailability](../../hooks/useSeatAvailability.ts#L25)

**In Context Files** (secondary - nice to fix but not blocking):
- **Type inconsistency**: Socket store types use `any` instead of proper Socket.io types - [socket.ts](../../lib/store/socket.ts#L8)

### ❓ Questions
- **Debounce timing**: Why 500ms debounce? Have we tested this feels responsive enough during high-traffic presales? - [DEBOUNCE_MS](../../hooks/useSeatAvailability.ts#L12)
- **Optimistic updates**: Should we optimistically decrease count when this user submits, before WebSocket confirms? - [handleSeatUpdate](../../hooks/useSeatAvailability.ts#L45)
- **Reconnection strategy**: Exponential backoff maxes at 30s - is this too aggressive for mobile users with spotty connections? - [useSocketConnection](../../hooks/useSocketConnection.ts#L35)

### 📝 Nits

**In Changed Code**:
- **Named export inconsistency**: Most hooks use default export but this uses named (violates code-style.md) - [useSeatAvailability](../../hooks/useSeatAvailability.ts#L8)
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
- ⚠️ Using `let` instead of `const` (violates core-philosophy.md) - [counter](../../src/utils.ts#L12)
- ⚠️ Function name doesn't start with verb (violates naming.md) - [userById](../../src/api.ts#L34)
- ⚠️ Regex instantiated inside loop (violates performance.md) - [validate](../../src/validators.ts#L45)
- ⚠️ Hardcoded API key (violates security.md) - [API_KEY](../../src/config.ts#L5)

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
- 📝 File organization differs from worker pattern in apps/ - see file-organization.md for structure - [index.ts](../../src/worker/index.ts#L1)
