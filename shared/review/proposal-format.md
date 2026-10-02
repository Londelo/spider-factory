# Proposal Format - Review Proposal Structure

This document defines the structure and formatting rules for the review proposal document (`review-proposal.md`).

**For complete examples, see [proposal-format-examples.md](proposal-format-examples.md)**

---

## Overview

The review proposal expands brief findings from review.md into full, structured comments. Each issue and nit will become a line-level comment posted to the GitLab MR.

---

## Document Structure

```markdown
# Review Proposal - [BRANCH-NAME]

## ⚠️ Issues

<details>
<summary><h3>1. [Issue Title]</h3></summary>

**File**: `path/to/file.ext` line X

**Problem**: [Detailed description of what's wrong and why it matters]

**Solution**: [Summary of the approach]

**Code**:
```language
[Code example - simple or pseudocode]
```

</details>

---

<details>
<summary><h3>2. [Issue Title]</h3></summary>
...
</details>

## 📝 Nits

<details>
<summary><h3>1. [Nit Title]</h3></summary>

**File**: `path/to/file.ext` line X

**Suggestion**: Maybe consider [brief suggestion]? [optional reason]

</details>

---

<details>
<summary><h3>2. [Nit Title]</h3></summary>
...
</details>
```

---

## Finding Types

### Issues

Issues are significant problems that should be addressed. Use a direct but not demanding tone.

**When to flag as issue**:
- Security vulnerabilities
- Bugs or incorrect logic
- Standards violations with clear citations
- Performance problems with measurable impact

**Structure in proposal**:
```markdown
<details>
<summary><h3>N. [Issue Title]</h3></summary>

**File**: `path/to/file.ext` line X

**Problem**: [Detailed description]

**Solution**: [Summary of approach]

**Code**:
```language
[Code example]
```

</details>
```

### Nits

Nits are minor suggestions worth considering but not critical. Use a soft, suggestive tone.

**When to flag as nit**:
- Style preferences
- Minor optimizations
- Suggestions without clear benefit
- Unclear if current behavior is intentional

**Structure in proposal**:
```markdown
<details>
<summary><h3>N. [Nit Title]</h3></summary>

**File**: `path/to/file.ext` line X

**Suggestion**: Maybe consider [brief suggestion]? [optional reason]

</details>
```

---

## Issue Format Details

For issues, provide detailed problem and solution:

**Problem** section: Clearly describe what's wrong and why it matters
**Solution** section: Summarize the approach to fix it
**Code** section: Show code example (format depends on complexity)

### Code Format for Issues

Choose the format based on complexity:

#### Simple Changes (1-3 lines)

For straightforward changes, show exact code with minimal context:

```markdown
**Problem:** This hardcoded API key should be in an environment variable to avoid committing secrets to version control.

**Solution:** Load the API key from environment variables.

```typescript
function initializeClient() {
  ...
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('API_KEY required');
  ...
}
```

**Key rules**:
- Show the function/class signature for context
- Use `...` to skip irrelevant code
- Show only the lines being added/changed
- Include just enough context to locate the change

#### Complex Changes (4+ lines or architectural)

For larger refactors or architectural changes, use pseudocode:

```markdown
**Problem:** Error handling is inconsistent across multiple routes, making debugging difficult and creating unreliable error responses.

**Solution:** Consider creating a centralized error handling approach.

Pseudocode:
1. Create `ErrorHandler` class
   - `handle(error): Response` - main handler
   - `formatError(error): ErrorResponse` - format consistently
   - `logError(error)` - centralized logging

2. Update each route:
   - Wrap in try/catch
   - Call `ErrorHandler.handle()` instead of inline handling
   - Remove duplicate error formatting logic

3. Add error types:
   - `ValidationError` for input errors
   - `AuthenticationError` for auth failures
   - `NotFoundError` for missing resources
```

**Key rules**:
- Use numbered steps for the high-level approach
- Use bullet points for implementation details
- Reference function/class names but don't write actual code
- Focus on the "what" and "why", not the exact syntax
- Keep it vague enough for them to implement their way

---

## Nit Format Details

For nits, provide a brief suggestion only:

**Suggestion** section: Start with "Maybe consider..." and keep it to 1-2 sentences

**Examples**:

```markdown
<details>
<summary><h3>1. Variable Naming</h3></summary>

**File**: `src/models/user.ts` line 12

**Suggestion**: Maybe consider renaming this to `isActive` for consistency with the other boolean fields?

</details>
```

```markdown
<details>
<summary><h3>2. Extract Constant</h3></summary>

**File**: `src/config/constants.ts` line 8

**Suggestion**: Maybe consider extracting this to a constant? Could make it easier to adjust the timeout value later.

</details>
```

**Key rules**:
- Start with "Maybe consider..."
- Keep it to 1-2 sentences
- No code examples
- Always end with `?` to keep it suggestive

---

## Language Guidelines

### Problem Language

**For Issues** - Use direct, clear language:
- "This code has X vulnerability"
- "This function lacks error handling"
- "This violates [standard]"
- "This will cause Y when Z occurs"

**For Nits** - Use soft, suggestive language:
- "Maybe consider..."
- "This could potentially..."
- "It might be worth..."

### Solution Language

Solutions are **always suggestions**, even for issues. Your proposed fix may not be the best approach.

**Always use**:
- "Consider doing X..."
- "One approach could be..."
- "A possible solution would be..."

**Never use**:
- "Change this to..."
- "Fix this by..."
- "You must..."
- "The correct approach is..."

---

## Deletions

For code that should be removed entirely:

```markdown
<details>
<summary><h3>N. Remove Unused Function</h3></summary>

**File**: `src/utils/helpers.ts` line 23

**Problem**: This function is unused and adds unnecessary complexity.

**Solution**: Consider removing this entirely.

</details>
```

Keep it simple - no code block needed for deletions.

---

## Document Organization

- Group all issues under `## ⚠️ Issues` section
- Group all nits under `## 📝 Nits` section
- Number each finding within its section (1, 2, 3, ...)
- Wrap each finding in `<details>` tags with `<h3>` in the summary (makes them collapsible in GitLab)
- Separate each finding with `---` horizontal rule
- Include file path and line number for every finding
- Questions from review.md are NOT included (they're for discussion only)

---

## Writing Guidelines

- Never show current/existing code - only the solution
- For simple changes (1-3 lines): show exact code with `...` for context
- For complex changes (4+ lines): use pseudocode with numbered steps
- For nits: keep it to 1-2 sentences, no code
- Use clear, direct language for issues
- Use soft, suggestive language for nits ("Maybe consider...")
- Don't use relative references ("above", "below")
- Every finding must have a specific file path and line number
