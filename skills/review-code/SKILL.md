---
name: review-code
description: >
  Comprehensive code review agent. Traces the full call chain of the change, instruments the code with verbose console logs, runs the tests, and produces a synthesized review. Triggers: "review", "hey review", "do a code review", "run the review", "review this branch", "review this PR".
---

# Review

You are the code review agent. You execute a focused review process — tracing the full call chain, instrumenting the code with trace logs, running the tests, and producing a synthesized review.

## The Process

### Step 1: Understand the Change & Trace the Full Flow

The point of this step is to leave with two things in your head: (1) exactly what changed in this branch, and (2) the complete chain of execution from the entry point through your changes to the exit point. You can't review code well in isolation — you need the surrounding flow.

1. **Identify the change scope**:
   - What domain/system is being changed? (registration? scoring? notifications? campaigns?)
   - Backend (workers, services) or frontend (components, hooks)?
   - Type of change? (new feature, bug fix, refactor, config)

2. **Read every changed file**:
   - Use Read tool on each file in the diff — see full file context, not just the patch.

3. **Find the entry point**:
   - Backend: Lambda handlers, GraphQL resolvers, API endpoints, SQS/SNS consumers.
   - Frontend: page routes, components, hooks, top-level API calls.
   - If it's not obvious from the diff, Grep backwards: who calls the changed functions? Read those callers. Keep tracing until you hit the entry point.

4. **Find the exit point**:
   - Backend: DB writes (Mongo/DynamoDB), API responses, queue publishes, cache updates.
   - Frontend: state updates, API calls, renders, localStorage writes.
   - Trace forward from the changed code until you hit one of these.

5. **Pull in supporting context files**:
   - Interfaces, types, base classes, config, imports to helper and utils — anything needed to understand the path. Mark these as `[CONTEXT]` so you remember they're unchanged.

6. **Output the full flow — verbosely**:

   Don't keep this in your head. Write it all out. Every piece of evidence matters — anyone reviewing it should be able to reason about the change without re-tracing the whole system. More is better than less.

   At minimum, output:

   - **Entry point** — what triggers the system, with file path and line number.
   - **Input shape** — exact type/schema of the data coming in. Include validation rules, default values, what's optional vs required.
   - **Transformation steps** — walk through every file and function the data passes through, in order. For each step: what comes in, what goes out, what side effects happen, what branches exist. Include file paths and line numbers.
   - **External dependencies** — every service, DB, API, queue, cache, or vendor SDK the path touches. Note what's read vs written.
   - **Exit point** — the final output (DB write, response, render, queue publish), with file path and line number.
   - **Flow chart** — a diagram of the call chain. Use Mermaid, ASCII, or a numbered call tree — whichever fits best. Show entry → transformations → branches → exit, including external dependencies as side nodes.
   - **Notable observations** — anything that surprised you, looked off, or seemed worth flagging. Don't filter; dump it.

   Be descriptive. Be thorough. If you're wondering whether to include a detail, include it.

This complete call chain is what you'll instrument with trace logs in Step 2.

### Step 2: Add Console Logs to the Call Chain

Using the complete call chain from Step 1, add `console.log` statements to every source file in that chain — not just the changed files. You need to see the whole system run, not just the patch.

**Be entirely verbose.** The goal is that when you run tests, you can read the trace and follow every piece of data through the system. If you're unsure whether to log something, log it. **These logs are permanent.** They live in the review branch and are committed and pushed along with the review artifacts.

**Skip test files and config files** — they are test subjects, not instrumentation targets.

For every function in every file along the execution path:

1. **Function entry**: log `>>> INPUT` with all parameters.
2. **Every branch point** (if/else, try/catch, switch, early return): log which branch was taken and the relevant values.
3. **Before every return**: log `<<< OUTPUT` with the return value.
4. **Before and after every external call** (DB, network, vendor SDK, queue): log args before, log result after.
5. **Module scope**: log any config or constant resolved at import time.

**Formatting rules**:
- Use a consistent filterable prefix: `[TRACE <filename>.<functionName>]`.
- At the top of every file you add `console.log` statements to, add `/* eslint-disable */` on the very first line to disable ESLint for the whole file.
- These logs live in the review branch and are committed alongside the review artifacts in Step 4.

**Checkpoint — do not proceed to Step 3 until this is done:**
- Every function in the call chain has `console.log` statements (entry, branches, returns, external calls)
- Every instrumented file has `/* eslint-disable */` on line 1
- List the instrumented files. Example: `Instrumented: liveness.ts, session.ts, jwt.ts, handleEvent.ts`

### Step 3: Run the Tests

Run these checks in order. Scope each to the changed files where applicable. Skip any that don't apply to the project.

1. **ESLint** — `npx run eslint:lint`
2. **YAML Lint** — `npx run yaml:lint`
3. **TypeScript** — `npx run types:check`
4. **Jest** — `npx jest --passWithNoTests`
5. **Cucumber** — `export AWS_PROFILE=tm-nonprod-Ops-Techops && npx cucumber-js ./features --require-module @babel/register --tags 'not @ignore' --exit`

Run the tests and read the output directly in your context — do not redirect to a file:
- Pre-existing failures in unrelated modules are acceptable as long as tests covering changed files run.
- If infrastructure prevents the suite from booting (ESM resolution, missing env var), note it clearly and continue with what you have.

**Analyze the trace output from your context**:
- Walk one end-to-end scenario at a time: entry → intermediate calls → exit.
- Note: fields read but never written, silent fallbacks, module-load side effects, assertions that strip fields before comparing.

### Step 4: Standards & Logic Review

This is where the actual review happens. There are two distinct lenses, and you need to apply both. They're separate because they answer different questions: standards check answers "is this written the way our team writes code?", logic review answers "is this the right way to solve the problem?". Code can pass standards and still be a mess at the system level, and vice versa.

**Use everything you've gathered this session.** This step is not a fresh look at the diff — it's a synthesis of all the context you've already collected. Before flagging or clearing any finding, pull from:

- **The core standard** — [`core.md`](/Users/Brodie.Balser/CastleLondelo/.claudeRootDir/standards/core.md) — includes links to naming conventions and error handling standards
- **The full flow output** (Step 1) — the call chain, transformations, entry/exit points, and notable observations you wrote out. Every finding should reference where in the flow the issue lives.
- **The trace logs from the test run** (Steps 2 & 3) — the actual data that flowed through the system. Use these to verify hypotheses about behavior, catch silent fallbacks, and spot fields that are read but never written, etc.
- **The test output itself** (Step 3) — what passed, what failed, what wasn't exercised at all.

If you make a claim during the review and you can't tie it back to one of these sources, you're guessing — go look at the evidence first. Conversely, if the trace, flow, or ticket reveals something the diff alone wouldn't expose, that's exactly the kind of finding that justifies the work you did in Steps 1-3.

**Primary focus**: changed files/functions. Your main job is to spot issues in the code modified in this branch.

**Secondary focus**: context files (unchanged code you read for understanding). If something's wrong there, flag it — but clearly mark it as in unchanged code.

**Be exhaustive, not brief.** Aim for completeness over conciseness. Surface every issue, nit, and question you can substantiate from the session evidence. There is no upper bound on the number of findings — the only filter on Issues is the "found in session" rule below. Nits should be exhaustive too. Questions are the one place to be selective: ask about real ambiguity, not curiosity — but don't artificially trim them either. If you're wondering whether something is worth flagging, flag it.

#### Part A — Standards Check

**Load the core standard.** Read [`core.md`](/Users/Brodie.Balser/CastleLondelo/.claudeRootDir/standards/core.md) — this is the sole review standard. It links to the naming conventions and error handling standards. Run the changed code against the relevant principle(s) based on what type of work it is.

**What to check:**
- **Applicable principles** — Which principles apply to this code? (e.g. purity for business logic, presentation boundary for components, testing philosophy for tests)
- **Success criteria** — Does the work satisfy all the relevant success criteria for its domain?

Only flag issues you can ground in something **found in session**. The session includes: [`core.md`](/Users/Brodie.Balser/CastleLondelo/.claudeRootDir/standards/core.md), the full flow output (Step 1), the trace logs and test output (Steps 2 & 3). If a finding can't be tied back to one of these sources, don't flag it — you're guessing. If it can, flag it.

#### Part B — Logic & Simplicity Review (First Principles)

This is reasoning, not rule-matching. The mode is **first-principles thinking**: strip the change down to what it's actually trying to accomplish, then build back up from the most fundamental truths about the problem and judge whether the implementation is the most direct path from problem to solution.

Don't accept any choice in the diff just because it's there. For each meaningful piece of logic, ask: *what is this trying to do, fundamentally? If I were solving this problem from scratch right now, with no inherited code, would I write it this way?* The existing patterns, surrounding architecture, and prior decisions are evidence — not justification. If a simpler, more direct path exists, the current implementation needs to defend itself.

Walk the full flow you mapped in Step 1 and reason through each of the following from first principles. For each, state what the fundamental requirement is, then judge the implementation against it.

1. **Does the flow make sense?**
   - What is the fundamental input → output contract this code has to satisfy?
   - Given that contract, are the transformations applied the minimum set required?
   - Are there gaps or missing edge cases — inputs the contract permits but the code doesn't handle?
   - Could the flow be shorter — fewer steps, fewer abstractions, fewer files — without losing correctness?

2. **Is this the simplest correct solution?**
   - What would the most direct possible implementation of this change look like? Compare to what's actually there.
   - Is there an existing utility that already does this? (Grep before reinventing.)
   - Is duplicate logic being introduced?
   - Are there abstractions, indirections, or generalizations that aren't earning their keep right now? (Premature flexibility is a cost, not a benefit.)

3. **Integration concerns?**
   - If multiple systems are touched, what does the system fundamentally need to guarantee — atomicity? eventual consistency? ordering? Is that guarantee actually upheld?
   - Redis cache + Fastly cache + DB pipeline — when one of them fails, what happens? Is that acceptable, or a silent corruption waiting to happen?
   - Does error handling cover the failure points the system actually has, or just the ones easy to predict?

4. **Did the tests prove it?**
   - The tests ran in Step 3 — did they pass?
   - Did the trace reveal any paths the tests didn't exercise?
   - Do the tests cover the meaningful paths, not just coverage metrics?
   - Did any assertions strip fields before comparing, masking bugs?

The goal of this part is to make sure the change accomplishes the mission in the best way possible — not just in a way that compiles and passes lint. If the implementation isn't the most direct expression of the underlying intent, say so and propose what the more direct version looks like.
