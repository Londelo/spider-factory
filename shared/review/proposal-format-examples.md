# Proposal Format Examples

This document contains complete examples of review-proposal.md structure.

---

## Complete Review Proposal Example

```markdown
# Review Proposal - feature/presale-notifications

## ⚠️ Issues

<details>
<summary><h3>1. Hardcoded API Key</h3></summary>

**File**: `src/config/api.ts` line 5

**Problem**: This hardcoded API key should be in an environment variable to avoid committing secrets to version control. Currently visible in git history.

**Solution**: Load the API key from environment variables.

**Code**:
```typescript
export const apiConfig = {
  ...
  apiKey: process.env.API_KEY,
  ...
};

if (!apiConfig.apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```

</details>

---

<details>
<summary><h3>2. SQL Injection Vulnerability</h3></summary>

**File**: `src/routes/api.ts` line 78

**Problem**: This SQL query is vulnerable to SQL injection because user input is concatenated directly into the query string. An attacker could inject malicious SQL to access or modify unauthorized data.

**Solution**: Use parameterized queries to safely handle user input.

**Code**:
```typescript
app.get('/users', async (req, res) => {
  ...
  const query = 'SELECT * FROM users WHERE username = ?';
  const results = await db.execute(query, [req.query.username]);
  ...
});
```

</details>

---

<details>
<summary><h3>3. Inconsistent Error Handling</h3></summary>

**File**: `src/services/paymentService.ts` line 45

**Problem**: Error handling is duplicated across multiple payment methods with inconsistent formats, making debugging difficult and creating unreliable error responses for clients.

**Solution**: Consider creating a centralized error handling approach for payment operations.

**Code**:

Pseudocode:
1. Add a `paymentErrors.ts` module of error factories on `createServiceError` (`standards-errors`)
   - `PaymentDeclinedError({ method })`, `InsufficientFundsError({ method })`, `GatewayTimeoutError({ method })`, `InvalidPaymentDataError({ field })`
   - a `formatPaymentResult(error): PaymentResult` that maps each error type to the client response

2. Update each payment method:
   - Wrap operation in try/catch
   - Log with `...formatError(error)` plus the payment context and rethrow the named factory's error
   - Remove the duplicate error-formatting logic each method grew

3. Keep the throw in the shell — the pure core returns result objects (`standards-errors`)

</details>

---

<details>
<summary><h3>4. Remove Unused Function</h3></summary>

**File**: `src/utils/helpers.ts` line 23

**Problem**: This function is unused (no references found in codebase) and adds unnecessary complexity.

**Solution**: Consider removing this entirely.

</details>

## 📝 Nits

<details>
<summary><h3>1. Variable Naming</h3></summary>

**File**: `src/models/user.ts` line 12

**Suggestion**: Maybe consider renaming `active` to `isActive` for consistency with the other boolean fields in this model?

</details>

---

<details>
<summary><h3>2. Extract Timeout Constant</h3></summary>

**File**: `src/config/constants.ts` line 8

**Suggestion**: Maybe consider extracting this timeout value to an environment variable? Could make it easier to adjust per environment without code changes.

</details>

---

<details>
<summary><h3>3. Use Nullish Coalescing</h3></summary>

**File**: `src/utils/formatting.ts` line 34

**Suggestion**: Maybe consider using `??` instead of `||` here? The current approach treats `0` and `false` as missing values, which might not be intended.

</details>
```

---

## Issue Example - Simple Code Change

```markdown
<details>
<summary><h3>1. Missing Error Handling</h3></summary>

**File**: `src/controllers/orderController.ts` line 45

**Problem**: This function has no error handling, violating `standards-errors` — every `await` in the shell gets its own try/catch, and the catch logs with `formatError` spread in and rethrows.

**Solution**: Add a try/catch that logs and rethrows a named error factory.

**Code**:
```typescript
async function processOrder(orderId: string) {
  try {
    ...
    const order = await orderService.process(orderId);
    return order;
  } catch (error) {
    logger.error('Order processing failed', { ...formatError(error), orderId });
    throw OrderProcessingError({ orderId });
  }
}
```

</details>
```

---

## Issue Example - Complex Architectural Change

```markdown
<details>
<summary><h3>2. Inconsistent Cache Key Construction</h3></summary>

**File**: `src/services/cacheService.ts` line 23

**Problem**: Cache keys are constructed inconsistently across the codebase using string concatenation, leading to potential key collisions and making cache invalidation difficult.

**Solution**: Consider implementing a structured cache key builder.

**Code**:

Pseudocode:
1. Add a `cacheKeys.ts` module of factory functions, one per key shape (`standards-coding`: a factory
   returns an object, never a `class`)
   - `CacheKeyPrefix(prefix)` - holds the namespace
   - `forEntity(type, id)` - build entity key
   - `forQuery(params)` - build query key with sorted params
   - `pattern(type)` - get pattern for bulk invalidation

2. Update each service using cache:
   - Replace string concatenation with the `cacheKeys` functions
   - Use consistent entity type names
   - Store key patterns for invalidation

3. Add cache invalidation helper:
   - `invalidateEntity(type, id)` - clear single entity
   - `invalidateEntityType(type)` - clear all entities of type
   - `invalidatePattern(pattern)` - bulk clear by pattern

4. Update tests:
   - Test key uniqueness
   - Test invalidation patterns
   - Verify no key collisions

</details>
```

---

## Issue Example - Performance Problem

```markdown
<details>
<summary><h3>3. N+1 Query Problem</h3></summary>

**File**: `src/services/dataProcessor.ts` line 112

**Problem**: This N+1 query pattern causes one database query per user (potentially hundreds), significantly slowing down the endpoint response time.

**Solution**: Use eager loading to fetch all related data in a single query.

**Code**:
```typescript
async function getUsersWithPosts() {
  ...
  const users = await User.query()
    .withGraphFetched('posts')
    .where('active', true);
  ...
}
```

</details>
```

---

## Issue Example - Security Vulnerability

```markdown
<details>
<summary><h3>4. Command Injection Risk</h3></summary>

**File**: `src/utils/fileProcessor.ts` line 56

**Problem**: This code executes shell commands with unsanitized user input, creating a command injection vulnerability where attackers could execute arbitrary system commands.

**Solution**: Use safe APIs that don't invoke shell commands, and validate all inputs.

**Code**:
```typescript
async function processFile(filename: string) {
  ...
  const safePath = path.resolve(UPLOAD_DIR, filename);
  if (!safePath.startsWith(UPLOAD_DIR)) {
    throw new Error('Invalid file path');
  }
  const stats = await fs.promises.stat(safePath);
  ...
}
```

</details>
```

---

## Nit Examples

```markdown
<details>
<summary><h3>1. Destructure Props</h3></summary>

**File**: `src/components/Button.tsx` line 19

**Suggestion**: Maybe consider destructuring the props at the function signature? Could make the component easier to read.

</details>

---

<details>
<summary><h3>2. Add Type Annotation</h3></summary>

**File**: `src/utils/calculations.ts` line 34

**Suggestion**: Maybe consider adding a return type annotation here? Would make the function's contract clearer.

</details>

---

<details>
<summary><h3>3. Simplify Conditional</h3></summary>

**File**: `src/services/validator.ts` line 67

**Suggestion**: Maybe consider using optional chaining here? Could simplify this nested conditional.

</details>
```

---

## When to Use Simple vs Complex Code Format

### Simple (1-3 lines) - Show Exact Code

Use when the fix is straightforward:
- Adding a missing parameter
- Changing a single line
- Adding simple validation
- Fixing a typo or incorrect value

```markdown
<details>
<summary><h3>N. Fix Email Validation</h3></summary>

**File**: `src/utils/validator.ts` line 45

**Problem**: The email regex doesn't handle all valid formats.

**Solution**: Use a more comprehensive email validation pattern.

**Code**:
```typescript
function validateEmail(email: string): boolean {
  ...
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

</details>
```

### Complex (4+ lines) - Use Pseudocode

Use when the fix requires architectural changes:
- Refactoring multiple functions
- Creating new modules of factory functions
- Reorganizing code structure
- Multi-step changes across files

```markdown
<details>
<summary><h3>N. Refactor Authentication Module</h3></summary>

**File**: `src/auth/index.ts` line 12

**Problem**: Authentication logic is scattered across multiple files.

**Solution**: Consider consolidating into a single authentication module.

**Code**:

Pseudocode:
1. Create new module
   - Function A
   - Function B
2. Update existing code
   - Remove old approach
   - Call new functions
3. Add tests

</details>
```
