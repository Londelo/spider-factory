---
name: standards-errors
description: >
  Error handling standards for the project. Use when writing, reviewing, or debugging error handling,
  error factories, try-catch blocks, discriminated error types, or shell error handling.
  Trigger: "error handling", "error factory", "error standards", "how should I handle errors", "catch block", "discriminated errors", "error types".
---

# Error Handling Standards

## Error Factories

Define domain-specific error factories using `createServiceError`:

```typescript
// errors.ts
export const UpcomingMarketFetchError = () => createServiceError({
  type: 'upcomingMarketFetchError',
  message: 'Failed to fetch upcoming markets'
});

export const FetchMarketCountsError = ({ campaignId, marketIds }) => createServiceError({
  type: 'fetchMarketCountsError',
  message: `failed to fetch counts for campaignId ${campaignId} and marketIds ${marketIds}`
});
```

Use the `@verifiedfan/vf-error` package. Do not use the legacy `message/payload` convention.

## Catch/Log/Rethrow

```typescript
catch (error) {
  log.error('error fetching marketCounts', {
    ...formatError(error),
    campaignId,
    markets
  });
  throw FetchMarketCountsError({ campaignId, marketIds });
}
```

Always spread `formatError(error)`, never pass `error` directly into log objects.

## Gate Validators

Gate validators return result objects (ELIGIBLE/INELIGIBLE), they don't throw:

```typescript
catch (error) {
  log.error('IDV token verification failed', {
    ...formatError(error),
    campaignId
  });
  return INELIGIBLE_BY_IDV;  // return, don't throw
}
```

## Don't Fail Silently

If a code is required but absent, don't silently substitute a placeholder. Fail loudly:

```typescript
// Bad — silently sends a text with missing info
const code = lookup(campaignId) || 'N/A';

// Good — skip the operation entirely
const code = lookup(campaignId);
if (!code) { return; }
```

## Shell Error Handling

The imperative shell catches all I/O errors. The pure core never throws.

- **The shell is the only layer that interfaces with the outside world.** All failures from network, database, file system, or user input bubble up here.
- **Every `await` gets its own try-catch.** Single responsibility — each async operation handles its own errors.
- **Centralized shell error handling.** Routes, middleware, and API handlers format and return responses. Don't scatter error formatting across multiple layers.
- **Pass through errors.** Most shell catch blocks just log and rethrow. The error either has a type (expected error from a sub-function) or it doesn't (unexpected error you caught). Don't wrap, transform, or suppress — let it bubble up.

```typescript
// Shell — log and rethrow, nothing else
try {
  const data = await fetchFromDatabase();
  return coreTransform(data);  // core never throws
} catch (error) {
  log.error('database fetch failed', { ...formatError(error) });
  throw error;  // pass through, nothing else
}
```

Only add custom error handling when a specific situation demands it.

## Catch Variable is `unknown`

Since TypeScript 4.4, the catch variable is `unknown`, not `any`. Always narrow before accessing properties:

```typescript
catch (error) {
  if (error instanceof TypeError) {
    // handle network/parse errors
  } else if (error instanceof Error) {
    // handle general errors
  } else {
    // handle unknown errors
  }
}
```

## Discriminated Error Types

Use discriminated unions for exhaustive error handling. TypeScript forces you to handle all cases:

```typescript
type AppError =
  | { kind: 'NOT_FOUND'; resource: string }
  | { kind: 'VALIDATION'; fields: string[] }
  | { kind: 'NETWORK'; reason: string };

function handleErrors(error: AppError): Response {
  switch (error.kind) {
    case 'NOT_FOUND': return notFoundResponse(error.resource);
    case 'VALIDATION': return validationResponse(error.fields);
    case 'NETWORK': return networkResponse(error.reason);
  }
}
```

If you add a new error kind, TypeScript will error on unhandled cases.