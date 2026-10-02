# Comments Format Examples

This document shows how to extract individual comments from review-proposal.md for posting.

---

## Extracting from Issues Section

**In review-proposal.md:**

```markdown
## ⚠️ Issues

<details>
<summary><h3>1. Hardcoded API Key</h3></summary>

**File**: `src/config/api.ts` line 5

**Problem**: This hardcoded API key should be in an environment variable to avoid committing secrets to version control.

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

**Problem**: This SQL query is vulnerable to SQL injection because user input is concatenated directly.

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
```

**Extracted comments:**

**Comment 1:**
- File: `src/config/api.ts`
- Line: `5`
- Body:
  ```markdown
  <details>
  <summary><h3>1. Hardcoded API Key</h3></summary>

  **Problem:** This hardcoded API key should be in an environment variable to avoid committing secrets to version control.

  **Solution:** Load the API key from environment variables.

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
  ```

**Comment 2:**
- File: `src/routes/api.ts`
- Line: `78`
- Body:
  ```markdown
  <details>
  <summary><h3>2. SQL Injection Vulnerability</h3></summary>

  **Problem:** This SQL query is vulnerable to SQL injection because user input is concatenated directly.

  **Solution:** Use parameterized queries to safely handle user input.

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
  ```

---

## Extracting from Nits Section

**In review-proposal.md:**

```markdown
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

**Suggestion**: Maybe consider extracting this timeout value to an environment variable? Could make it easier to adjust per environment.

</details>
```

**Extracted comments:**

**Comment 1:**
- File: `src/models/user.ts`
- Line: `12`
- Body:
  ```markdown
  <details>
  <summary><h3>1. Variable Naming</h3></summary>

  **Suggestion:** Maybe consider renaming `active` to `isActive` for consistency with the other boolean fields in this model?

  </details>
  ```

**Comment 2:**
- File: `src/config/constants.ts`
- Line: `8`
- Body:
  ```markdown
  <details>
  <summary><h3>2. Extract Timeout Constant</h3></summary>

  **Suggestion:** Maybe consider extracting this timeout value to an environment variable? Could make it easier to adjust per environment.

  </details>
  ```

---

## Extraction Summary

For each `<details>` block in review-proposal.md:

1. **Identify the section**: Is it under `## ⚠️ Issues` or `## 📝 Nits`?

2. **Find each `<details>` block**: Each finding is wrapped like:
   ```markdown
   <details>
   <summary><h3>N. Title</h3></summary>
   ... content ...
   </details>
   ```

3. **Extract file path and line number**:
   - Find the line formatted as: `**File**: \`path/to/file.ext\` line X`
   - File path: Everything between backticks before " line " (e.g., `src/config/api.ts`)
   - Line number: Integer after " line " (e.g., `5`)
   - File paths are relative to repo root (no leading `/`)
   - Line numbers are single integers (not ranges)

4. **Extract the entire `<details>` block as the comment body**:
   - Keep `<details>` tags (makes it collapsible in GitLab)
   - Keep `<summary>` and `<h3>` tags
   - Remove the `**File:**` line (position object shows this)
   - Keep all **Problem**, **Solution**, **Code**, or **Suggestion** sections

5. **Result format**:
   ```json
   {
     "file_path": "path/to/file.ext",
     "line_number": 123,
     "type": "issue" | "nit",
     "body": "<details>\n<summary><h3>...</h3></summary>\n\n**Problem:** ...\n\n</details>"
   }
   ```

---

## Complex Pseudocode Example

**In review-proposal.md:**

```markdown
<details>
<summary><h3>3. Inconsistent Error Handling</h3></summary>

**File**: `src/services/paymentService.ts` line 45

**Problem**: Error handling is duplicated across multiple payment methods with inconsistent formats.

**Solution**: Consider creating a centralized error handling approach for payment operations.

**Code**:

Pseudocode:
1. Create `PaymentErrorHandler` class
   - `handle(error): PaymentResult` - main handler
   - `categorizeError(error): ErrorType` - identify error type

2. Update each payment method:
   - Wrap operation in try/catch
   - Call `PaymentErrorHandler.handle(error)` instead of inline handling

</details>
```

**Extracted comment:**
- File: `src/services/paymentService.ts`
- Line: `45`
- Body:
  ```markdown
  <details>
  <summary><h3>3. Inconsistent Error Handling</h3></summary>

  **Problem:** Error handling is duplicated across multiple payment methods with inconsistent formats.

  **Solution:** Consider creating a centralized error handling approach for payment operations.

  **Code**:

  Pseudocode:
  1. Create `PaymentErrorHandler` class
     - `handle(error): PaymentResult` - main handler
     - `categorizeError(error): ErrorType` - identify error type

  2. Update each payment method:
     - Wrap operation in try/catch
     - Call `PaymentErrorHandler.handle(error)` instead of inline handling

  </details>
  ```

---

## What Gets Posted vs What Doesn't

**Posted to GitLab:**
- ✅ Issues (entire `<details>` block from `## ⚠️ Issues` section, minus `**File:**` line)
- ✅ Nits (entire `<details>` block from `## 📝 Nits` section, minus `**File:**` line)

**NOT posted to GitLab:**
- ❌ Questions (from review.md - discussion only)
- ❌ Nice Work items (from review.md - acknowledgment only)
- ❌ Document headers, section titles (`## ⚠️ Issues`, `## 📝 Nits`)
- ❌ `**File:**` lines (position object provides this info)
- ❌ `---` horizontal rules between items

---

## Formatting Notes

When extracting comment bodies from `<details>` blocks:

- **Keep HTML tags**: `<details>`, `<summary>`, `<h3>` make it collapsible in GitLab
- **Keep markdown formatting**: Bold text, code blocks, backticks
- **Include language tags**: ` ```typescript ` should be preserved
- **Preserve indentation**: Especially in pseudocode
- **Remove `**File:**` line**: Position object already specifies file and line
- **Remove `---` rules**: Not needed in individual comments
- **Keep `...` markers**: These indicate omitted code and should stay in the body
