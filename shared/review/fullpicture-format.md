# Full Picture Format

Two-part document per system: a flow chart of every function, then a function description for each one.

## Document Structure

```markdown
# Full Picture: [Feature/Change Name]

[Write a 2-4 sentence narrative that explains what this PR does in plain English. Focus on the "what" and "why" - what problem does it solve? What functionality does it add? Keep it conversational and easy to understand.]

---

## System 1: [System Name]

### Purpose
[1-2 paragraphs, each max 5 sentences. Explain what this system does and why it exists in plain language, as if describing it to someone with zero technical background and no knowledge of this project. Focus on the real-world job it performs, not how it does it.]

### Flow Chart

Hierarchical map of every function from entry point to exit. Each function may have sub-functions indented beneath it. Chains trail off until they hit a backend endpoint or storage location.

- Entry point: button click / user interaction (frontend), HTTP route / event (backend)
- Function names only — no descriptions, no parameters, no prose
- **No links, no file paths, no line numbers in the flow chart.** Just the bare function name. Links and paths belong in the Function Descriptions section below.
- Mark change points with 🎯
- Use `──► [description]` only when a chain terminates at an external system or storage
- Keep each line under 70 characters

```
entryPointFunction
├── subFunctionA
│   └── subFunctionA1
│       └── subFunctionA1a ──► [Backend endpoint or storage]
├── subFunctionB ──► [Backend endpoint or storage]
└── subFunctionC 🎯
    ├── subFunctionC1
    │   └── subFunctionC1a ──► [Storage]
    └── subFunctionC2 ──► [Storage]
```

### Function Descriptions

Every function named in the flow chart above. Explained as if the reader knows nothing about the system. Format: `[**functionName**](../../path#Lline) — What it does. Why it exists.`

**Path note**: This file lives at `[repo-root]/reviews/[date-time]/fullpicture.md`. Source links must use `../../` to climb back to the repo root before the in-repo path: `[text](../../path/to/file.ext#L123)`.

**[entryPointFunction](../../path/to/file.ext#L123)** — What it does. Why it exists.

**[subFunctionA](../../path/to/file.ext#L45)** — What it does. Why it exists.

**[subFunctionA1](../../path/to/file.ext#L67)** — What it does. Why it exists.

**🎯 [subFunctionA1a](../../path/to/file.ext#L89)** — What it does. Why it exists. What changed. Why it changed.

- **Before:** [description of old behavior]
- **After:** [description of new behavior]
- **Why:** [reason for the change]

**[subFunctionB](../../path/to/file.ext#L101)** — What it does. Why it exists.

---

## System 2: [System Name]
[Repeat structure]

---

## The Change: [Change Summary]

### Files Changed
1. [**filename1.ext**](../../path/to/file1.ext#L123) — What changed
2. [**filename2.ext**](../../path/to/file2.ext#L456) — What changed

### Why [Multiple Systems/Approaches]
Explain why the change spans multiple files or why this approach was chosen.

### Key Concepts/Thresholds
If the change introduces new concepts, thresholds, or configuration values, explain them here.

### Tests Updated
- [**test1.spec.ext**](../../path/to/test1.spec.ext#L45) — What's being tested
- [**test2.spec.ext**](../../path/to/test2.spec.ext#L67) — What's being tested
```

## Guidelines

### Flow Chart
**DO:** Function names only. Hierarchical indentation. Trail to backend endpoints or storage. Mark changes with 🎯.
**DON'T:** Descriptions, parameters, prose, links, file paths, or line numbers inside the flow chart. Mix multiple systems.

### Function Descriptions
**DO:** Cover every function in the flow chart. Each function header must be a link to the exact line: `[**functionName**](../../path/to/file.ext#L123)`. 1-2 sentences. Explain what and why for someone who knows nothing about the system.
**DON'T:** Long paragraphs. Skip functions. Generic descriptions like "processes data" without specifics. Omit the link on the function name — the link is required here, even though it's banned from the flow chart. Drop the `../../` prefix: this file lives in `reviews/[date-time]/`, so every link must climb two levels to reach the repo root.

### Unchanged functions
```markdown
**[functionName](../../path/to/file.ext#L123)** — Fetches user data from the database and returns a plain object.
```

### Changed functions
```markdown
**🎯 [functionName](../../path/to/file.ext#L123)** — Prepares the data before retrieving it. Now adds an extra filter to narrow results.

- **Before:** [description of old behavior]
- **After:** [description of new behavior]
- **Why:** [reason for the change]
```
