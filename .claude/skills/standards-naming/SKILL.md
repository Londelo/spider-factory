---
name: standards-naming
description: >
  Naming conventions for functions, variables, files, and GraphQL in the project. Use when naming
  anything in code — functions, variables, constants, files, enums, log tags.
  Trigger: "naming", "naming conventions", "how should I name this", "function naming", "variable naming", "file naming", "log tags".
---

# Naming Conventions

## Functions

**All function names must start with a verb.** A function named `userById` should be `getUserById`. A function named `recordFormatter` should be `formatRecord`.

| Verb | When to use | Example |
|------|-------------|---------|
| `find` | MongoDB queries (returns array) | `findOpenCampaignIds`, `findByPresaleDateTime` |
| `get` | HTTP/service lookups, non-Mongo reads | `getArmScore`, `getUpcomingPresaleMarkets` |
| `select` | Pure data accessors (no side effects) | `selectCampaignStatus`, `selectEntries` |
| `format` | Transform data shape for output | `formatRecord`, `formatOptIn` |
| `normalize` | Standardize/clean raw input data | `normalizeObjectIds`, `normalizeDate` |
| `validate` | Check data correctness (may normalize too) | `validateAndNormalizeCampaign` |
| `create` | Construct a new entity/record | `createServiceError`, `createSelectors` |
| `calc` / `compute` | Derive a value from inputs | `calcAccountScore`, `calcVerificationScore` |
| `apply` | Apply a transformation to a value | `applyArmAdjustment`, `applyRandomization` |
| `maybe` | Conditionally do something | `maybePrependNewShow`, `maybeEnqueueRefresh` |
| `check` | Boolean/validation check | `checkLiveness`, `checkRegistrationEligibility` |
| `publish` / `send` | Emit to external system | `publishSuppression`, `sendMessage` |
| `schedule` | Time-based operations | `scheduleMarkets` |
| `set` / `unset` | Mutation operations (DB) | `setNotificationDate`, `unsetMarketDates` |

## Function Type Glossary

| Term | What it does | Direction | Example |
|------|-------------|-----------|---------|
| **normalizer** | Cleans or standardizes **input** data to fit the system | Inbound | `normalizeObjectIds`, `normalizeDate` |
| **formatter** | Transforms **result** data into a shape for output/display | Outbound | `formatRecord`, `formatOptIn` |
| **selector** | Picks/extracts data from an object (pure, no side effects) | Read-only | `selectCampaignStatus`, `selectEntries` |

And for file-level organization:

| Term | Scope | Example |
|------|-------|---------|
| **util** | Small, general-purpose function usable across domains | `formatError`, `normalizeObjectIds` |
| **helper** | Larger function with domain-specific logic (API calls, complex transforms) | `getMarketsAndCounts`, `scheduleMarkets` |

A normalizer and a formatter should never live in the same file — they serve opposite directions.

**Factory functions use PascalCase.** If a function returns a new function or stateful object, capitalize it:

```typescript
// Factories — PascalCase
const IDVGateValidator = (services: Services): GateValidator => ({ ... });
const AddCountToMarket = (entries, jwt) => async(market) => { ... };

// Plain functions — camelCase
const planSends: PlanSendsWorker = async({ Services, jwt }) => { ... };
```

## Variables and Constants

- **camelCase** for all variables: `campaignId`, `marketIds`, `isHighRisk`
- **SCREAMING_SNAKE_CASE** for primitive constants: `LOG_TAG`, `HIGH_RISK_ARM_THRESHOLD`, `DEFAULT_ELIGIBLE`
- **PascalCase enums** with SCREAMING_SNAKE values:

```typescript
export enum INELIGIBLE_REASON {
  NOT_FOUND = 'CAMPAIGN_NOT_FOUND',
  CLOSED = 'CAMPAIGN_CLOSED',
  IDV_REQUIRED = 'IDV_REQUIRED'
}
```

- **Prefer short, single-syllable words** when possible: `calcTotal` over `calculateTotal`

## Files

**A file's name must match its default export.** If the file exports `formatRecord` as default, the file is `formatRecord.ts`. If there is no default export, the file should be named for the concept it contains (e.g., `types.ts`, `selectors.ts`, `errors.ts`).

**Strip redundant context from file/function names** that is already implied by the file's location. If you're in `mongo/scoring.ts`, don't prefix everything with `scoring`.

## GraphQL

- **`ID!` for identifiers, not `String!`**: `marketIds: [ID!]!`, `campaignId: ID!`
- **Enums for status fields**: `enum StatStatus { ... }`, not `String`
- **Mutation params as direct params**, not nested inside an `input` type (matches monoql pattern)

## Log Tags

Use colon-separated namespacing: `<product>:<domain>:<path>`

```typescript
const LOG_TAG = 'registration:apps:planSends:getMarketsAndCounts';
const LOG_TAG = 'verifiedfan:apps:getArmScore';
```