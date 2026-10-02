# Comments Format - Extracting Comments from Proposal

This document defines how to extract individual comments from review-proposal.md and what they look like when isolated.

**For complete examples, see [comments-format-examples.md](comments-format-examples.md)**

---

## Overview

The review-proposal.md contains issues and nits structured per [proposal-format.md](proposal-format.md). This document shows how to extract each one as an individual comment body for posting.

---

## Extraction Pattern

Each finding in review-proposal.md is wrapped in `<details>` tags with the title in the summary. Extract the content from inside each `<details>` block.

### From Issues Section

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
function initializeClient() {
  ...
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('API_KEY required');
  ...
}
```

</details>
```

**Extract:**
- File path: `src/config/api.ts`
- Line number: `5`
- Comment body (for GitLab):
  ```markdown
  <details>
  <summary><h3>1. Hardcoded API Key</h3></summary>

  **Problem:** This hardcoded API key should be in an environment variable to avoid committing secrets to version control.

  **Solution:** Load the API key from environment variables.

  **Code**:
  ```typescript
  function initializeClient() {
    ...
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error('API_KEY required');
    ...
  }
  ```

  </details>
  ```

### From Nits Section

**In review-proposal.md:**
```markdown
## 📝 Nits

<details>
<summary><h3>1. Variable Naming</h3></summary>

**File**: `src/models/user.ts` line 12

**Suggestion**: Maybe consider renaming `active` to `isActive` for consistency with the other boolean fields in this model?

</details>
```

**Extract:**
- File path: `src/models/user.ts`
- Line number: `12`
- Comment body (for GitLab):
  ```markdown
  <details>
  <summary><h3>1. Variable Naming</h3></summary>

  **Suggestion:** Maybe consider renaming `active` to `isActive` for consistency with the other boolean fields in this model?

  </details>
  ```

---

## Comment Body Format

### Issue Comments

Format (keep the `<details>` structure):
```markdown
<details>
<summary><h3>N. [Title]</h3></summary>

**Problem:** [description]

**Solution:** [approach]

**Code**:
[CODE EXAMPLE or PSEUDOCODE]

</details>
```

**What to extract:**
- The entire `<details>` block including tags
- Problem text
- Solution text
- Code block (including language tag and backticks)

### Nit Comments

Format (keep the `<details>` structure):
```markdown
<details>
<summary><h3>N. [Title]</h3></summary>

**Suggestion:** Maybe consider [suggestion]? [optional reason]

</details>
```

**What to extract:**
- The entire `<details>` block including tags
- The complete suggestion sentence

---

## Parsing File Path and Line Number

Inside each `<details>` block, find the line formatted as:
```markdown
**File**: `path/to/file.ext` line X
```

**Parse this line:**
- **File path**: Everything between the backticks before " line " (e.g., `src/config/api.ts`)
- **Line number**: The integer after " line " (e.g., `5`)

**Example parsing:**
```
**File**: `src/config/api.ts` line 5
```
- File path: `src/config/api.ts`
- Line number: `5`

**Critical:**
- File paths must be relative to repository root (no leading `/`)
- Line numbers must be single integers (not ranges like "5-10")

---

## Extraction Data Structure

For each finding, extract:
```json
{
  "file_path": "src/config/api.ts",
  "line_number": 5,
  "type": "issue",
  "body": "<details>\n<summary><h3>1. Hardcoded API Key</h3></summary>\n\n**Problem:** ...\n\n**Solution:** ...\n\n**Code**:\n```typescript\n...\n```\n\n</details>"
}
```

Or for nits:
```json
{
  "file_path": "src/models/user.ts",
  "line_number": 12,
  "type": "nit",
  "body": "<details>\n<summary><h3>1. Variable Naming</h3></summary>\n\n**Suggestion:** Maybe consider renaming `active` to `isActive` for consistency with the other boolean fields in this model?\n\n</details>"
}
```

---

## What to Include vs Exclude

When extracting comment body from `<details>` block:

**Include:**
- `<details>` and `</details>` tags (makes it collapsible in GitLab)
- `<summary>` and `</summary>` tags
- `<h3>` heading with the title
- `**Problem:**` section (for issues)
- `**Solution:**` section (for issues)
- `**Code:**` section (for issues)
- `**Suggestion:**` section (for nits)

**Exclude:**
- `**File:**` line with path and line number (GitLab position shows this)
- `---` horizontal rules (not needed in individual comments)

---

## Markdown Formatting

The extracted comment bodies include HTML and markdown:
- `<details>` tags make the comment collapsible in GitLab
- `<summary>` tags contain the title shown when collapsed
- `<h3>` tags format the title heading
- `**Bold**` for section headers
- ` ```language ` for code blocks
- Backticks for inline code
- `...` to represent omitted code in examples

GitLab renders both HTML and markdown correctly in line-level comments.
