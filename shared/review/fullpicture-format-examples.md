# Full Picture Format - Examples

**For format instructions, see [fullpicture-format.md](fullpicture-format.md)**

---

## Example 1: Backend Worker — Adding Locale to JWT Token

```markdown
# Full Picture: Locale in checkLiveness Token

[Write a 2-4 sentence narrative that explains what this PR does in plain English. Focus on the "what" and "why" - what problem does it solve? What functionality does it add? Keep it conversational and easy to understand.]

---

## System: checkLiveness

### Purpose
Confirms that a person completing an identity check is a real, live human and not a photograph or recording. It takes a session identifier, makes sure the session is still active, and produces a signed access pass that carries the user's identity information. This pass is then used by other parts of the system to confirm the person is who they say they are.

This system sits at the heart of the identity verification flow and is called every time someone needs to prove their real-world presence before moving forward.

### Flow Chart

```
handleEvent
├── resolveSession ──► [session storage]
├── validateSession
│   └── checkSessionStatus ──► [session storage]
├── generateToken 🎯
│   ├── buildPayload
│   │   └── extractLocale 🎯 ──► [BCP 47 locale]
│   ├── signToken ──► [JWT library]
│   └── encodeToken
└── returnToken ──► [API response]
```

### Function Descriptions

**[handleEvent](../../shared/services/identity/handleEvent.ts#L10)** — Entry point. Receives the identity verification request, resolves the session, and orchestrates token generation.

**[resolveSession](../../shared/services/identity/session.ts#L15)** — Looks up the user's session by session ID from storage. Returns the session object or throws if not found.

**[validateSession](../../shared/services/identity/session.ts#L40)** — Checks the session is active and not expired. Delegates to checkSessionStatus for current state.

**[checkSessionStatus](../../shared/services/identity/session.ts#L55)** — Queries session storage for the latest status and returns the session with updated state.

**[generateToken](../../shared/services/identity/token/jwt.ts#L25)** — Creates a signed JWT containing session and user context for the liveness check.

**[buildPayload](../../shared/services/identity/token/jwt.ts#L30)** — Assembles the JWT claims: userId, sessionId, marketId, and now locale.

**🎯 [extractLocale](../../shared/util/locale.ts#L10)** — Pulls the language setting from the incoming request and confirms it is valid. Returns just the base language code.

- **Before:** The token contained no language information at all
- **After:** The function reads the language from the request and includes it in the token
- **Why:** Systems that receive the token need to know which language to use

**[signToken](../../shared/services/identity/token/jwt.ts#L45)** — Signs the payload with the private key using RS256.

**[encodeToken](../../shared/services/identity/token/jwt.ts#L60)** — Serializes the signed token to a compact JWT string.

---

## The Change: Locale in JWT Token

### Files Changed
1. [**token/jwt.ts**](../../shared/services/identity/token/jwt.ts#L30) — Added locale to JWT payload via extractLocale
2. [**util/locale.ts**](../../shared/util/locale.ts#L1) — NEW FILE — Locale extraction and validation utility
3. [**handleEvent.ts**](../../shared/services/identity/handleEvent.ts#L10) — Passes resolverContext.locale to generateToken

### Why a Separate Utility
Locale extraction is used by both checkLiveness and other identity flows. A shared utility prevents duplication and ensures consistent parsing across the system.

### Tests Updated
- [**jwt.spec.ts**](../../shared/services/identity/token/jwt.spec.ts#L25) — Asserts locale in token payload
- [**locale.spec.ts**](../../shared/util/locale.spec.ts#L1) — NEW FILE — Tests locale extraction and defaults
```

---

## Example 2: Frontend — Real-Time Form Validation

```markdown
# Full Picture: Registration Form Validation

[Write a 2-4 sentence narrative that explains what this PR does in plain English. Focus on the "what" and "why" - what problem does it solve? What functionality does it add? Keep it conversational and easy to understand.]

---

## System: RegistrationForm

### Purpose
Guides a new visitor through a series of questions to collect their email, phone number, and mailing address so they can sign up for early access. Each piece of information is checked as it is entered to catch mistakes before the form is submitted. Once everything is complete, the information is sent off and the visitor is shown a confirmation screen.

This system is the front door for anyone trying to join the presale, and it is the first thing a potential customer interacts with during the signup process.

### Flow Chart

```
handleFieldChange 🎯
├── setFieldValue ──► [Zustand store]
├── debouncedValidate
│   ├── validateFieldLocal
│   │   ├── validateEmail
│   │   ├── validatePhone
│   │   └── validateRequired
│   └── validateFieldRemote ──► [Validation API]
└── setFieldError ──► [Zustand store]
```

### Function Descriptions

**🎯 [handleFieldChange](../../components/RegistrationForm/index.tsx#L67)** — Updates form state on input change and triggers debounced validation. Now validates on every change instead of waiting for submit.

- **Before:** Validation only ran on form submit
- **After:** Validation runs with 500ms debounce on every field change
- **Why:** Immediate feedback reduces form abandonment and catches errors before submission

**[setFieldValue](../../lib/store/form.ts#L18)** — Updates a single field's value in the Zustand store. Used for optimistic UI updates.

**[debouncedValidate](../../hooks/useFieldValidation.ts#L12)** — Wraps validation logic with 500ms debounce. Cancels pending validations on new input.

**[validateFieldLocal](../../utils/validators.ts#L45)** — Synchronous format checks: email regex, phone format, required fields.

**[validateFieldRemote](../../services/validation.ts#L23)** — Asynchronous uniqueness and carrier checks via API. Returns `{ valid: boolean, error?: string }`.

**[setFieldError](../../lib/store/form.ts#L41)** — Stores an error message in Zustand and triggers a component re-render with inline error UI.

---

## The Change: Real-Time Validation

### Files Changed
1. [**RegistrationForm/index.tsx**](../../components/RegistrationForm/index.tsx#L67) — Updated `handleFieldChange` to trigger validation
2. [**hooks/useFieldValidation.ts**](../../hooks/useFieldValidation.ts#L12) — NEW FILE — Hook managing validation logic
3. [**utils/validators.ts**](../../utils/validators.ts#L45) — NEW FILE — Local validation functions
4. [**services/validation.ts**](../../services/validation.ts#L23) — NEW FILE — API validation service
5. [**lib/store/form.ts**](../../lib/store/form.ts#L34) — Added error state and actions to Zustand store

### Why Debounce
500ms debounce prevents API spam while user is typing. Fast enough to feel responsive (< 1 second), slow enough to avoid overwhelming the API.

### Tests Updated
- [**RegistrationForm.spec.tsx**](../../components/RegistrationForm/RegistrationForm.spec.tsx#L78) — Tests validation triggers on field change
- [**useFieldValidation.spec.ts**](../../hooks/useFieldValidation.spec.ts#L12) — Tests debouncing and API call logic
```

---

## Example 3: Multi-System Backend — Score Filtering

```markdown
# Full Picture: Score Filtering Integration

[Write a 2-4 sentence narrative that explains what this PR does in plain English. Focus on the "what" and "why" - what problem does it solve? What functionality does it add? Keep it conversational and easy to understand.]

---

## System 1: notificationGenerator

### Purpose
Sends text message reminders to fans who signed up for a presale event, letting them know when and where they can participate. It runs on a schedule, figures out which fans should receive a message, and saves those messages in a queue so they can be delivered.

This system is the engine that keeps fans informed and excited about upcoming presale dates.

### Flow Chart

```
handler
├── genAndPutNotifications
│   ├── MergeCampaignInfo ──► [Campaign Service]
│   ├── WriteNotificationRecords
│   │   └── GenerateNotification
│   └── markets.setNotifiedDate ──► [MongoDB markets collection]
└── getScoringRecordGenerator 🎯
    └── findRecordsToText ──► [MongoDB scoring collection]
```

### Function Descriptions

**[handler](../../apps/notification/notificationGenerator/index.ts#L35)** — Lambda entry point. Parses the EventBridge payload and delegates to the notification generation pipeline.

**[genAndPutNotifications](../../apps/notification/notificationGenerator/index.ts#L23)** — Ramda pipe orchestrating the flow: merge campaign info, generate scoring records, write to DynamoDB.

**[MergeCampaignInfo](../../apps/notification/notificationGenerator/MergeCampaignInfo.ts#L11)** — Fetches campaign details (artist name, options) from the Campaign Service.

**[WriteNotificationRecords](../../apps/notification/notificationGenerator/WriteNotificationRecords.ts#L50)** — Transforms scoring records into DynamoDB notification records and writes them in batches of 25.

**[GenerateNotification](../../apps/notification/notificationGenerator/WriteNotificationRecords.ts#L40)** — Maps a ScoringRecord to a DynamoDB NotificationRecord shape.

**[getScoringRecordGenerator](../../apps/notification/notificationGenerator/getScoringRecordGenerator.ts#L9)** — Returns an async generator that yields scoring records matching the campaign and market criteria.

**🎯 [findRecordsToText](../../shared/services/mongo/scoring.ts#L20)** — Looks up records from storage that match the campaign and market criteria. Now accepts an extra filter to narrow results by quality score.

- **Before:** Retrieved all matching records without any quality filter
- **After:** Adds a quality threshold filter to exclude low-scoring records
- **Why:** Prevents low-quality records (bots, disposable phones) from reaching the notification pipeline

---

## System 2: planSends

### Purpose
Figures out how many text message reminders need to go out for each upcoming presale event and works out when each one should be delivered. It does not send the messages itself, but it plans exactly when and how many will be sent so nothing gets crowded together.

This system is the planner that makes sure notifications are spread out evenly instead of all arriving at once.

### Flow Chart

```
handler
├── getMarketsAndCounts 🎯
│   ├── getUpcomingMarkets ──► [MongoDB markets collection]
│   └── AddMarketCounts
│       └── AddCountToMarket
│           └── getEligibleCounts 🎯 ──► [Entry Service: POST /entries/counts]
├── scheduleMarkets
└── SetMarketNotifications ──► [MongoDB markets collection]
```

### Function Descriptions

**[handler](../../apps/notification/planSends/index.ts#L8)** — Lambda entry point. Orchestrates count fetching, scheduling calculation, and MongoDB updates.

**[getMarketsAndCounts](../../apps/notification/planSends/getMarketsAndCounts.ts#L94)** — Fetches upcoming markets and attaches eligible send counts for each.

**[getUpcomingMarkets](../../apps/notification/planSends/getMarketsAndCounts.ts#L56)** — Queries MongoDB for markets with presales in the next 2-27 hours, filtered by notifiable campaigns.

**[AddMarketCounts](../../apps/notification/planSends/getMarketsAndCounts.ts#L88)** — Maps over the markets, calling AddCountToMarket for each to attach eligible counts.

**[AddCountToMarket](../../apps/notification/planSends/getMarketsAndCounts.ts#L46)** — Fetches eligible counts for a single market via the Entry Service API.

**🎯 [getEligibleCounts](../../apps/notification/planSends/getMarketsAndCounts.ts#L25)** — Requests the count of eligible items for each market from a separate service. Now includes a quality threshold from configuration.

- **Before:** Requested counts without any quality filter
- **After:** Adds a quality threshold so only eligible counts are returned
- **Why:** Keeps the projected send counts aligned with what the notification system actually sends

**[scheduleMarkets](../../apps/notification/planSends/scheduleMarkets.ts#L52)** — Calculates notification send times based on counts divided by target rate (750k/hr), avoiding time conflicts.

**[SetMarketNotifications](../../apps/notification/planSends/setMarketNotifications.ts#L10)** — Writes calculated notification dates to the MongoDB markets collection.

---

## The Change: Score Filtering Integration

### Files Changed
1. [**configs/default.config.yml**](../../configs/default.config.yml#L138) — Added `scrubScoreThreshold: 0.18`
2. [**getScoringRecordGenerator.ts**](../../apps/notification/notificationGenerator/getScoringRecordGenerator.ts#L9) — Reads config, passes `minScore` to MongoDB
3. [**scoring.ts**](../../shared/services/mongo/scoring.ts#L20) — Accepts optional `minScore`, adds `score: { $gte: minScore }` to query
4. [**getMarketsAndCounts.ts**](../../apps/notification/planSends/getMarketsAndCounts.ts#L18) — Reads config, passes `minScore` to Entry Service

### Why Both Systems Need the Same Filter
Both systems must filter identically to keep sends and counts aligned. Misalignment causes inaccurate capacity planning and wrong send-time calculations.

### Tests Updated
- [**notificationGenerator.spec.ts**](../../apps/notification/notificationGenerator/notificationGenerator.spec.ts#L57) — Asserts `minScore: 0.18` passed
- [**getMarketsAndCounts.spec.ts**](../../apps/notification/planSends/getMarketsAndCounts.spec.ts#L60) — Asserts `minScore: 0.18` passed
```
