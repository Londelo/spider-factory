# Review Format - Initial Review Output

This document defines the structure and formatting rules for the initial code review summary (`review.md`).

**For complete examples, see [review-format-examples.md](review-format-examples.md)**

---

## Document Structure

Use this EXACT template for all review summaries:

```markdown
# Code Review Summary - [BRANCH-NAME]

## Review Findings

**Prioritization**: List issues in changed code first (your primary focus), then issues in context files (secondary). Issues in changed code are what block the PR.

### ⚠️ Issues
**In Changed Code** (primary - must be addressed):
- **issue**: [Must be addressed before merge] - [reference](../../path/to/file.ext#L123)
- **issue**: [Past-review-derived finding that still needs action] - [reference](../../path/to/file.ext#L123)
  - *Past review said X; we say Y because [evidence].*  ← only when revisiting a past finding

**In Context Files** (secondary - nice to fix but not blocking):
- **issue**: [Existing issue in unchanged code] - [reference](../../path/to/file.ext#L123)

### ❓ Questions
- **question**: [Need clarification on implementation choices] - [reference](../../path/to/file.ext#L123)

### 📝 Nits
**In Changed Code**:
- **nit**: [Minor style/preference items] - [reference](../../path/to/file.ext#L123)

**In Context Files** (optional):
- **nit**: [Existing minor issue in unchanged code] - [reference](../../path/to/file.ext#L123)

### 🔁 Cross-Examination (only if past reviews exist)
Log of past findings that need NO further action — `Agree, nothing to add` / `No longer applies` / `Resolved in this revision`. One line each.
- **[Past finding reference](../../path/to/file.ext#L123)** — Agree, nothing to add — [why]

**Recommendation**: [Brief recommendation - e.g., "Approve after X" or "Ready to merge" or "Needs changes" or "BLOCKED - Critical issues must be resolved"]
```

---

## Formatting Rules

### Link Format

**CRITICAL**: Every bullet point MUST include a markdown link to EXACTLY ONE line of code.

**Path note**: This file lives at `[repo-root]/reviews/[date-time]/review.md`. Source links must use `../../` to climb back to the repo root before the in-repo path.

**Correct Format**:
- `[text](../../path/to/file.ext#L123)` where `L123` is a SINGLE line number
- Example: `[handleRequest](../../src/api/handler.ts#L45)`

**NEVER Use**:
- Line ranges: `#L10-L15` (link will break)
- File only: `../../path/to/file.ext` (must include `#L[number]`)
- Multiple lines in one link
- Paths without the `../../` prefix — links will resolve inside the `reviews/[date-time]/` directory and 404

**If a finding spans multiple lines**: Choose the most representative single line to link to.

---

## Review Findings Categories

These findings will be posted as line-level comments on specific lines of code in the GitLab MR.

**Scope**: Flag issues wherever you find them - in changed code (primary focus) or context files (secondary focus). Separate them in your review to show priority.

### ⚠️ Issues
Problems that should be addressed. Must be grounded in something found in session — a loaded standard, the Jira ticket, the full flow, the trace/test output, or a past review.

**In Changed Code**: These are blocking - must be fixed before merge.
**In Context Files**: These are pre-existing issues. Nice to fix but not blocking this PR.

**Examples**:
- ⚠️ SQL injection vulnerability (violates security.md) - [reference](../../path/to/file.ext#L123)
- ⚠️ Missing error handling (violates errors.md) - [reference](../../path/to/file.ext#L123)
- ⚠️ Trace shows `userId` is read but never written before the DB update - [reference](../../path/to/file.ext#L123)
- ⚠️ Implementation does not satisfy ticket acceptance criteria #3 - [reference](../../path/to/file.ext#L123)

**Past-review findings that still need action** belong here too — write the issue normally, then add a sub-bullet noting the divergence:
- ⚠️ N+1 query: loop fires one HTTP call per market when one batched call would do - [reference](../../path/to/file.ext#L34)
  - *Past review flagged the slowness but missed that timeouts also drop markets silently.*

**IMPORTANT**: Do NOT flag an issue unless you can ground it in something found in session. If you can't tie it back to a loaded standard, the ticket, the flow, the trace, the test output, or a past review, you're guessing — don't flag it.

**These will be posted as Issue comments** with detailed problem description, solution approach, and code examples.

### ❓ Questions
Clarifications needed about implementation choices or behavior.

**Examples**:
- ❓ Why use Promise.all here instead of sequential execution? - [reference](../../path/to/file.ext#L123)
- ❓ Should this handle the case where user is null? - [reference](../../path/to/file.ext#L123)
- ❓ Is the 5-second timeout configurable? - [reference](../../path/to/file.ext#L123)

**These will NOT be posted** to GitLab. Questions are for the review summary only and should be addressed in conversation, not as line-level comments.

### 📝 Nits
Minor style or preference items. Optional improvements.

**Examples**:
- 📝 Consider extracting this to a constant - [reference](../../path/to/file.ext#L123)
- 📝 Variable name could be more descriptive - [reference](../../path/to/file.ext#L123)
- 📝 Could simplify this with optional chaining - [reference](../../path/to/file.ext#L123)

Past-review nits that still apply use the same divergence sub-bullet pattern as Issues.

**These will be posted as Nit comments** with brief, soft-toned suggestions starting with "Maybe consider..."

---

## Writing Guidelines

### Be Exhaustive
There is no cap on the number of findings. Surface every issue, nit, and question you can ground in session evidence. More findings beat missed findings — filter by "found in session", not by length. Questions are the one category to be selective with: ask about real ambiguity, not curiosity.

### Be Concise Per Bullet
Each bullet point should be one line, clear and direct. No paragraphs. Concise applies to individual bullets, not the overall list.

### Write for a Non-Technical Reader
Each bullet should be readable by someone who doesn't know this repo and isn't technical. Describe the problem in plain English — what's wrong and why it matters, not jargon, internal acronyms, or implementation lingo. The link and file path carry the technical pinpoint; the words carry the meaning. If a term is unavoidable (e.g. "race condition", "N+1 query"), pair it with a short plain-English gloss. The goal is brevity *and* clarity, not technical density.

### Include Specifics
- File names and line numbers (always with links)
- Function names
- Variable names
- Dependency versions when relevant

### Be Honest
- Don't sugarcoat reviews
- Be direct and truthful about problems
- Don't compliment something just because it's not bad
- An empty issues section is valid if there are no issues

### Prioritize Changed Code
- Your primary job is reviewing the changed code (the diff)
- List issues in changed code first - these are blocking
- Issues in context files are secondary - helpful but not blocking this PR
- Separate "In Changed Code" and "In Context Files" sections to show priority

### Ground Findings in Session Evidence
Before flagging any issue:
1. Identify what in session supports it — a loaded standard, the Jira ticket, the full flow output, the trace/test output, or a past review
2. Reference that source in the finding (e.g. "violates errors.md", "trace shows...", "ticket AC #2 unmet")
3. If you can't tie it back to anything in session, don't flag it

---

## Recommendation

End the review with a clear recommendation:

- **"Ready to merge"**: No issues, good to go
- **"Approve after [X]"**: Minor issues that should be fixed first
- **"Needs changes"**: Multiple issues requiring fixes
- **"BLOCKED - Critical issues must be resolved"**: Serious problems that prevent merge

---

## 🔁 Cross-Examination (only if past reviews exist)

A short log of past findings that need **no further action** in this review. Past findings that *do* need action live in `⚠️ Issues` or `📝 Nits` above with a divergence sub-bullet — not here.

Three statuses, one line each:

- **[Past finding reference](../../path/to/file.ext#L123)** — Agree, nothing to add — [why the past reviewer was right]
- **[Past finding reference](../../path/to/file.ext#L123)** — No longer applies — [what changed]
- **[Past finding reference](../../path/to/file.ext#L123)** — Resolved in this revision — [how the current diff handles it]

**Rules:** verify every past finding independently — never accept a past review as correct. Concise per bullet, exhaustive in count. Never copy-paste.
