# Known Bugs

The open board for spider-factory. Everything here is a claim about the code that somebody checked —
`Proof` is the command that was actually run, or the file and line that was actually read.

Work down it in any order. Edit freely: change `Status`, write under `Notes`, add items at the bottom.
When an item is fixed, set `Status: fixed` and say what you did in `Notes` — don't delete the entry until
the three doc tiers have been brought in line with the fix.

**Status values:** `open` · `unverified` (real in the code, trigger not reproduced) · `blocked` · `wontfix` · `fixed`

Found by two audit passes on 2026-11-21, every finding re-checked by hand against the files before it was
written down here.

---

## A — Paths that only exist on the other side of the repo boundary

The factory and the tower are two git repositories, and the seams between them were never finished. This
group is why the loop has never run: the one recorded run on this machine claimed zero tickets in 49 ticks.

### 1. A worker cannot read its own ticket

- **Status:** open
- **Where:** `CLI/src/beads-loop/worker.sh:66` spawns with cwd inside the worktree; `worker.sh:24` then
  commands `bd show`, `worker.sh:30` `bd heartbeat`, `worker.sh:37` `bd comment` from there.
- **Proof:** `cd webs/kachalka/.claude/worktrees/feature+idle-save-timer && bd where` resolves to the
  worktree's own `.beads`, and `bd status` → `Error: no beads database found`. `git -C webs/kachalka
  ls-files .beads` → nine tracked files, so `git worktree add` checks a database-less skeleton into every
  worktree and beads stops its walk there instead of reaching the tower's real database.
- **Scope:** `kachalka` tracks `.beads` (9 files). `coins_that_stack`, `generative_art`, `FamilyTree` track
  none and resolve correctly. It bites any tower that committed `.beads`, which `bd init` plus a normal
  `git add .` does.
- **Fix:** run `cd "$SF_PROJECT_DIR"` (or ground with `bd where`) before any `bd` call in the brief and in
  each worker file, and have `bead-initialize` gitignore `.beads/config.yaml` and `metadata.json`.
- **Notes:**

### 2. Nested repos cannot see the factory's agents or skills

- **Status:** open
- **Where:** every spawn site — the loop's workers, the three planners, the overseer, and bare `sf`.
- **Proof:** `--debug` shows 12 skills loaded from the factory root, 0 from `webs/kachalka`, 0 from its
  worktree. Project `.claude/agents/` and `.claude/skills/` are found by walking up from cwd but stopping at
  the git repository root, and a nested clone is a hard boundary.
- **Fix:** `--add-dir "$factoryRoot"` at the spawn sites. One change covers all four paths, keeps bare
  agent names, and honours `hooks:` frontmatter. Ruled out: plugins (plugin agents are namespaced and
  **ignore `hooks` frontmatter**, which is the entire Stop hook), `--agents` (inline JSON, loads no skills),
  `permissions.additionalDirectories` (file access only, proven `additional: 0`). No settings key or
  `CLAUDE_CODE_*` variable points at an agents/skills directory.
- **Caveats:** agents from an added dir are not hot-reloaded; the added folder needs its own trust grant;
  `strictPluginOnlyCustomization` in managed settings would silently break it.
- **Notes:**

### 3. `plan-task` never loads at all

- **Status:** open
- **Where:** `.claude/agents/plan-task.md:4` — a literal newline inside the double-quoted `description`.
- **Proof:** `claude plugin validate .claude/agents` → `✘ frontmatter: YAML frontmatter failed to parse:
  Unexpected character. At runtime this agent does not load at all`. Bisected: the em-dashes and the escaped
  quotes are both innocent; converting the description to a block scalar passes. PyYAML parses all eleven
  files fine, so this is Claude Code's parser being stricter than YAML — which is why nobody noticed.
- **Fix:** fold the description onto one line, or use a `>-` block scalar.
- **Notes:**

### 4. Sixteen leftover `spider-factory:` namespaced names

- **Status:** fixed
- **Where:** `review.md` ×10 (`:84`, `:99`, `:100`, `:194-196`, `:238`, `:268-270`, `:279`),
  `plan-epic.md:191`, `plan-feature.md:44,219`, `plan-task.md:40,216`, `overseer.md:212`.
- **Proof:** no `.claude-plugin/plugin.json`, no marketplace entry, and `spider-factory` appears 0 times in
  `~/.claude/plugins/installed_plugins.json`. The prefix has no namespace to resolve against. Consequence:
  `review` loads no skill at all and names no fixer; all three planners cannot load `bead-create`.
- **Fix:** strip the prefix everywhere — the repo stopped being a plugin in `953b68f` and these were missed.
- **Notes:** fixed in `5421112` while this file was being written; `grep -rn "spider-factory:" .claude/agents/
  .claude/skills/` now returns nothing.

### 5. `bead-create` documents the id generators under a path that isn't there

- **Status:** open
- **Where:** `.claude/skills/bead-create/SKILL.md:76` says "Run them from inside the tower", then `:80-84`
  run `CLI/src/create-beads/create-gate.sh` — a factory-root-relative path.
- **Proof:** from inside a tower that path does not exist; a plan agent following the skill hits "no such
  file".
- **Fix:** name the absolute path, or say plainly that these run from the factory checkout.
- **Notes:**

### 6. `plan-task` points at its templates under a path that isn't there

- **Status:** open
- **Where:** `.claude/agents/plan-task.md:82-84` and `:218` name `shared/plan-tasks/<name>.md`.
- **Proof:** the real location is `.claude/shared/plan-tasks/`, and the planner runs foreground with cwd in
  the **tower** (`plan-agent.sh:57`), where neither path exists. `:86` says "the template wins" — the file
  that wins is unreadable, so the draft wins by default.
- **Fix:** `.claude/shared/plan-tasks/<name>.md`, and say it lives in the factory checkout, not the tower.
- **Notes:**

### 7. Five dead `agents/*.md` pointers

- **Status:** open
- **Where:** `tester-unit.md:155`, `tester-feature.md:169-170`, `tester-e2e.md:170-171`,
  `framework-jest/SKILL.md:18`, `framework-playwright/SKILL.md:17-18`.
- **Proof:** `ls agents` → No such file or directory. The files are at `.claude/agents/`. Every one of these
  is the tier-boundary tiebreaker a tester reaches exactly when it cannot tell whether a test is its own.
- **Fix:** `.claude/agents/…`.
- **Notes:**

### 8. `setup-cli` sends you to the installer from the wrong repo

- **Status:** open
- **Where:** `.claude/skills/setup-cli/SKILL.md:32-33` says cd into the project you mean, `:45` says "the
  CLI lives inside this repo", `:50` says `bash CLI/install-cli.sh`.
- **Proof:** `CLI/` exists only in the factory checkout.
- **Fix:** name the factory's absolute path to `CLI/install-cli.sh`.
- **Notes:**

---

## B — Work that vanishes with no trace

### 9. `sf hook` refuses to run from outside the factory

- **Status:** open
- **Where:** `CLI/bin/sf:142` — `requireInsideFactory` in front of the Stop hook.
- **Proof:** contradicts the hook's own contract that its cwd is a pooled daemon's cwd and means nothing. It
  passes today only because towers live under `spider-factory/webs/`. Put a tower anywhere else and every
  worker Stop dies before it commits, with no log line. The guard guards nothing either:
  `worker-stop.sh:191` already does its own `( cd "$worktreeDir" && sf commit … )`.
- **Fix:** delete that one line.
- **Notes:**

### 10. A worker can be lost forever on an unparsed session id

- **Status:** unverified
- **Where:** `CLI/utils/logging.sh:73` `getSpawnedAgent`, fed straight into the log field at
  `worker.sh:112` and `gates.sh:46`; `worker-stop.sh:52-63` matches on it; `worker-stop.sh:85` is
  `[[ -n "$claimLine" ]] || exit 0`.
- **Proof:** `setLogField` (`logging.sh:29`) turns an empty parse into `session=-`, the hook's session match
  then finds nothing, and the hook exits silently — no commit, no push, no PR, no close, no log line. The
  ticket stays claimed forever and `bd ready` never shows it. A parse failure is indistinguishable from a
  human session.
- **What's unverified:** it depends on what `$SF_AGENT_COMMAND --bg` actually prints. To prove it: dispatch
  one worker, then `cat $SF_LOG_ROOT/<run>/claims` and check `session=` is not `-`. Corroborating: the only
  run ever recorded here, `~/.spider-factory/logs/2026-11-19_13-35-20/`, has zero-byte `claims`, zero-byte
  `errors`, no `spawn-*` file, and `results` reads `ticks=49 claimed=0 done=0` — this path has never once
  executed on this machine.
- **Fix:** in spawnWorker's caller, `writeLog errors "reason=session-unparsed"` when `getSpawnedAgent`
  returns empty, instead of writing `session=-`.
- **Notes:**

### 11. A fixer can complete review's ticket

- **Status:** open
- **Where:** `review.md:286-288` ends every fixer prompt with three constraints — fix this finding and
  nothing beside it, `sf commit` it yourself, touch no ticket. None mentions the done marker.
- **Proof:** every fixer is an `engineer`/`frontend`/`tester-*`, and each of those files ends its own
  contract with `touch $SF_DONE_FILE` as the very last action (`engineer.md:44-46`, `frontend.md:42-44`,
  `tester-unit.md:61-64`, `tester-feature.md:60-63`, `tester-e2e.md:62-65`). A fixer runs inside review's
  process, so `$SF_DONE_FILE` is review's own (`worker.sh:69`). The first fixer finishing marks review done;
  if review then dies, the hook's fail-closed check passes and it commits, pushes and closes the review
  ticket on a half-finished round.
- **Fix:** add "touch no done marker" to the three constraints.
- **Notes:**

### 12. Nothing detects a dead worker

- **Status:** open
- **Where:** the whole system. `CLI/src/beads-loop/config.sh:47` still seeds a `failures` file nothing
  writes.
- **Proof:** Claude Code's hook events are SessionStart, UserPromptSubmit, PreToolUse, PostToolUse,
  PreCompact, SubagentStart, SubagentStop and `Stop` — that is the whole list. `StopFailure` is built but not
  exposed: the schema exists in the binary, and the hook loader refuses the key as
  `Unknown hook event type 'StopFailure'`. The `Stop` payload carries no error signal at all. So a worker
  killed by an API error leaves its ticket `in_progress`, invisible to `bd ready`, with no log line anywhere.
  A gate whose lead agent died reads exactly the same.
- **Related:** the heartbeat/reaper discussion is parked — moving `bd heartbeat` into `sf commit` was
  considered and not built. A commit is not a pulse: a thinking worker looks dead and a post-commit death
  looks alive. The missing piece is a reaper in the loop's tick, since a lapsed lease currently detects
  nothing.
- **Fix:** the overseer's check for a worker that died quietly is the only thing that finds one, and all it
  does is name the ticket and hand a person `bd update <ticket> --status failed-agent`. Worth re-testing
  `StopFailure` on every Claude upgrade.
- **Notes:**

---

## C — Review can't do its job

### 13. The brief forbids the one thing review exists to do

- **Status:** open
- **Where:** `CLI/src/beads-loop/worker.sh:39` rule 4 — *"Spawn nothing. Work nothing but $ticketId."* —
  goes to every worker including review.
- **Proof:** `review.md:73` says "Spawn fixers, once, and file no tickets" and `:263` "one spawn per finding,
  all of them in a single batch, one round only". Review is the only agent whose whole step 7 is spawning,
  and the only `tools:` list carrying `Agent` (`review.md:5`). Rule 4 is the last word the model hears, and
  `worker.sh:40` already proves the brief special-cases `lead` and nobody else.
- **Fix:** exempt `review` from rule 4 the way rule 5 exempts `lead`.
- **Notes:**

### 14. Review diffs against a branch its own file says its ticket does not carry

- **Status:** open
- **Where:** `review.md:113-114` — `git diff --stat <branch-named-in-your-ticket>...HEAD`.
- **Proof:** against `review.md:33-34` — "Your ticket carries no branch of your own; nothing a task carries
  can be trusted as much as the gate it hangs under. Read `SF_BRANCH` before anything else". The placeholder
  resolves to nothing, so the command degenerates to `git diff ...HEAD` — the whole tree, not the branch —
  which is the exact failure the file itself calls "a review that voted".
- **Fix:** use `$SF_BRANCH`.
- **Notes:**

### 15. `sf commit` sweeps review's findings file onto the feature branch

- **Status:** open
- **Where:** `CLI/src/commit.sh:39` — `git add -A`.
- **Proof:** `review.md:57` and `:306` tell review to leave the findings file in the working tree, and
  `review.md:287` has each fixer run `sf commit` in that same worktree. Review's own rule is "They commit;
  you commit nothing" (`:289`), so it can never take the file back out.
- **Fix:** have review write findings under a gitignored path.
- **Notes:**

---

## D — Agents told to use tools they do not have

### 16. `plan-epic` has no `TaskCreate` and no `WebSearch`

- **Status:** open
- **Where:** `.claude/agents/plan-epic.md:5` — `tools: Read, Bash, Grep, Glob, Skill`.
- **Proof:** `:152-153` commands "`TaskCreate` each question the moment you think of it" and `:166` commands
  "web search for how similar products work". Both are mandatory-sounding and fail on first use, and the same
  file says "Never lean on training knowledge" — so the agent is left with no sanctioned research path.
- **Fix:** add `TaskCreate`, `TaskUpdate`, `WebSearch` to `tools:`, or drop both instructions.
- **Notes:**

---

## E — Files that describe a system that no longer exists

### 17. `bead-initialize` still credits the deleted Fail hook

- **Status:** open
- **Where:** `.claude/skills/bead-initialize/SKILL.md:66` — "the Fail hook writes it".
- **Proof:** `worker-fail.sh` was deleted in `73e2377`. `:75` also has a person run
  `bd config set status.custom "failed-agent:frozen"` for a status no code path ever sets — both
  `.claude/CLAUDE.md:182` and `overseer.md:244` hand that to a human instead.
- **Fix:** rewrite `:61-76` to say the status is a human's to set.
- **Notes:**

### 18. `bead-initialize` promises a reaper that has never existed

- **Status:** open
- **Where:** `.claude/skills/bead-initialize/SKILL.md:69` — "the reaper hands it to another worker to redo".
- **Proof:** `bd reclaim` appears nowhere in the code, only in docs.
- **Fix:** say what actually happens — the lease lapses and nothing notices.
- **Notes:**

### 19. The worker brief promises the same phantom reaper

- **Status:** open
- **Where:** `CLI/src/beads-loop/worker.sh:30` — "a lapsed lease reads as death — the reaper takes your
  ticket back to ready mid-work".
- **Proof:** there is no reaper. This is worse than the skill version because it is every worker's own
  contract, and it tells each worker that letting its lease lapse is survivable.
- **Fix:** tell the truth about what a lapsed lease does, which is nothing.
- **Notes:**

### 20. `failures` is a log file nothing writes

- **Status:** open
- **Where:** `CLI/src/beads-loop/config.sh:47` seeds it with the other five.
- **Proof:** grepping `failures` across `CLI/` returns that one line and nothing else; no `writeLog failures`
  exists anywhere. An overseer reads an empty one as "no failures" when it means "no such feature".
- **Fix:** drop it from the seeded list.
- **Notes:**

### 21. `lead`'s conflict rule rests on a false git claim

- **Status:** open
- **Where:** `.claude/agents/lead.md:112-114` — "Leave `merge.conflictStyle` alone. It is unset on this
  machine, which means `diff3`".
- **Proof:** `git config --get merge.conflictStyle` exits 1 — it is unset — and unset means `merge`, not
  `diff3`. `git merge-file -p` on git 2.56.0 printed no `|||||||` section. So the lead never gets the base
  section it calls *the only legitimate way* to choose between two sides, while the same sentence forbids
  every other method.
- **Fix:** pass `--conflict-style diff3` (or set it), or drop the claim.
- **Notes:**

### 22. `.claude/CLAUDE.md` states the category/template binding backwards

- **Status:** open
- **Where:** `.claude/CLAUDE.md:93` — "category … the name of a `plan-task` template | `backend-logic`,
  `frontend-ux`, `unit-tests`".
- **Proof:** the files on disk are `engineer.md`, `frontend.md`, `tester-unit.md` — named after the agent
  that runs the ticket, not the category. An agent that trusts the line goes looking for a template that is
  not there.
- **Fix:** say the template is named after the agent.
- **Notes:**

### 23. The one beads-cwd warning is unactioned

- **Status:** open
- **Where:** `.claude/skills/bead-read/SKILL.md:61-63` warns "one stray cd into a worktree has you reading
  somebody else's tower".
- **Proof:** it is the only place in the whole system that warns of this, and only `overseer.md:89` actually
  commands the grounding read. No worker file or the brief tells a worker to ground with `bd where` or
  `cd "$SF_PROJECT_DIR"` — which is why item 1 has no mitigation at all.
- **Fix:** make grounding a rule in the brief, not a warning in a skill.
- **Notes:**

---

## F — Config and error reporting

### 24. The env file is write-once and the loader is silent about what it drops

- **Status:** open
- **Where:** `CLI/src/user-env.sh:14` — `[[ "$line" =~ ^[[:space:]]*(SF_[A-Z_]+)=(.*)$ ]] || continue`.
- **Proof:** any other key is dropped without a word. `CLI/spider-factory.env:9` carries
  `CLAUDE_CONFIG_DIR='/home/londelo/CastleLondelo/.claude_root'` and that line has been doing nothing the
  whole time it has sat there. The code reads 22 `SF_*` names; `spider-factory.example.env` ships 8 —
  missing `SF_ENV_FILE`, `SF_LOG_RUN`, `SF_SESSION`, `SF_WORKTREE`, `SF_WORK_KIND`.
  `CLI/install-cli.sh:43` never touches the file once it exists, so the live copy here lacks
  `SF_AGENT_FEATURE_GATES` / `SF_AGENT_EPIC_GATES` (which the example gained at `:33-34`) and still carries
  comments naming `CLI/beads-loop.sh` and `~/.spider-factory.env`. That missing pair is what puts
  `preflight.sh:24` `flagValue="${!flagName}"` in front of an unset variable — the loop-startup crash.
- **Fix:** `tell` a one-line warning for any rejected `KEY=` line, and have `install-cli.sh` diff the live
  file against the example and report keys the example has and the live file lacks.
- **Notes:**

### 25. A missing `bd` binary is reported as a missing database

- **Status:** open
- **Where:** six identical copies of the predicate — `bin/sf:101`, `plan-agent.sh:41`,
  `overseer-agent.sh:42`, `create-gate.sh:47`, `create-task.sh:49`, `preflight.sh:38`.
- **Proof:** `bd list --limit 1 --json 2>/dev/null | jq -e 'type == "array"'` — the `2>/dev/null` swallows
  the real cause, and `console.sh:33` renders every failure as "no beads database found from $PWD — cd into
  the tower project and re-run". Run from inside a real tower with `bd` off PATH and the database untouched:
  exit 4, `bd: not on PATH`, and the user is told their database is missing. The same predicate fires for a
  missing `jq` (read off the code; `/bin/jq` exists here so that arm could not be isolated). Only the loop
  checks its tools first.
- **Fix:** have the five test `command -v bd jq` first and `reportToolNotOnPath`, then ask the beads
  question.
- **Notes:**

---

## G — Hygiene

### 26. Two shared-bash files sit in `src/` against the documented rule

- **Status:** open
- **Where:** `CLI/src/forge.sh` and `CLI/src/user-env.sh`.
- **Proof:** the rule is that a file two or more commands source lives in `CLI/utils/`, never in `src/`.
- **Fix:** move both to `utils/` and fix the source paths.
- **Notes:**

### 27. `openFactorySession` recomputes a value `locateEngines` already has

- **Status:** open
- **Where:** `CLI/bin/sf:156` — `root="$(cd "$here/../.." && pwd)"`, duplicating `factoryRoot` from `:88`.
- **Fix:** use `factoryRoot`.
- **Notes:**

### 28. The diagram claims a finished worker is never removed from the listing

- **Status:** open
- **Where:** `.claude/diagram/`.
- **Proof:** `numberOfBusyWorkers` counts a background session only while it reports itself busy — a
  finished worker stays in the agent listing for the dashboard but holds no slot (commit `d624d49`).
- **Fix:** bring the diagram in line and rebuild `dist/`.
- **Notes:**

### 29. `package.json` still describes the node package this stopped being

- **Status:** open
- **Where:** `package.json` — `"main": "index.js"` for a repo with no `index.js`, plus
  `"test": "echo \"Error: no test specified\" && exit 1"`.
- **Fix:** drop `main` and the stub test script.
- **Notes:**

### 30. The old plugin is still installed

- **Status:** open
- **Where:** `high_magic/plugins/binary-obelisk`.
- **Proof:** spider-factory is a plain repo now (`953b68f`); this is a leftover install of the old shape.
- **Fix:** uninstall it, or re-home it.
- **Notes:**

---

## Clean — verified fine, so nobody re-audits these

- All 25 shell files under `CLI/` and `scripts/` pass `bash -n`, and every `source "$here/…"` lands,
  including the one-level-up fix from `14d8043`. Bootstrap order in `index.sh:121-134` is correct.
- No orphan callers of the two files deleted today. `getSpawnedAgent` and
  `takeLogFieldsFromEnvironment` each still have real callers.
- `bin/sf`'s four command lists agree on exactly seven — usage, `unknownCommand`, the case arms, and the
  five engine variables in `locateEngines`. No command in help lacks an arm; no arm lacks help.
- Nothing dead under `CLI/src/` or `CLI/utils/` except the `failures` seed (item 20).
- External commands are named correctly where they are checked; `gh`/`glab` are reached only inside the
  `$forge` branch that names them. `claude agents --json` returns exactly the fields
  `numberOfBusyWorkers` filters on.
- Task-vs-gate kind plumbing is sound end to end, and the done-marker and context paths agree across the
  two processes.
- All eleven agents parse; the seven workers carry exactly the one `Stop → sf hook stop` block with timeout
  300, and `overseer` and the three `plan-*` carry no `hooks:` key.
- The label→agent→category binding is sound both directions: the seven `AGENT` keys at `index.sh:21-29`
  are exactly the set the planners attach, every mapped value is a real file, no orphan label, no
  unreachable worker.
- Lease and close discipline holds: all seven workers forbid `bd close`, all seven touch the marker last,
  all seven commit through `sf commit`.
- `pr-comments`, the four `standards-*` skills, and the three `.claude/shared/plan-tasks/` templates name
  nothing that does not exist.
