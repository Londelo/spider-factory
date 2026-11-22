# Known Bugs

The open board for spider-factory. Everything here is a claim about the code that somebody checked —
`Proof` is the command that was actually run, or the file and line that was actually read.

Work down it in any order. Edit freely: change `Status`, write under `Notes`, add items at the bottom.
When an item is fixed, set `Status: fixed` and say what you did in `Notes` — don't delete the entry until
the three doc tiers have been brought in line with the fix.

**Status values:** `open` · `unverified` (real in the code, trigger not reproduced) · `blocked` · `wontfix` · `fixed` ·
`false positive` (the claim does not hold against the code; the entry stays as a record of why)

Found by two audit passes on 2026-11-21, every finding re-checked by hand against the files before it was
written down here.

---

## A — Paths that only exist on the other side of the repo boundary

The factory and the tower are two git repositories, and the seams between them were never finished. This
group is why the loop has never run: the one recorded run on this machine claimed zero tickets in 49 ticks.

### 1. A worker cannot read its own ticket

- **Status:** false positive
- **Where:** `CLI/src/beads-loop/worker.sh:66` spawns with cwd inside the worktree; `worker.sh:24` then
  commands `bd show`, `worker.sh:30` `bd heartbeat`, `worker.sh:37` `bd comment` from there.
- **Proof:** ~~`cd webs/kachalka/.claude/worktrees/feature+idle-save-timer && bd where` resolves to the
  worktree's own `.beads`, and `bd status` → `Error: no beads database found`.~~ The commands ran and the
  output was as quoted, but the worktree they ran in was a dead artifact — see Notes.
- **Scope:** ~~`kachalka` tracks `.beads` (9 files).~~ The hollow checked-out `.beads` is not the cause; it is
  present in a healthy worktree too and beads walks straight past it.
- **Fix:** none needed. Beads resolves a worktree's database on its own — `bd worktree --help`: *"Worktrees
  automatically share the same beads database as the main repository via git common directory discovery — no
  manual redirect configuration needed."*
- **Notes:** re-checked 2026-11-21 against `bd 1.3.0`. A fresh `git worktree add` of `kachalka` at the
  factory's own path convention resolves correctly from inside the worktree: `bd where` →
  `webs/kachalka/.beads`, database `.../embeddeddolt`; `bd status` → 63 issues; `bd show kachalka-phk` → the
  full ticket; `bd worktree info` → `Main repo: .../webs/kachalka · Beads: local (no redirect)`. The original
  proof ran in one of three worktrees left behind when `kachalka` moved from `projects/` to `webs/`: their
  `.git` gitfiles still pointed at `~/CastleLondelo/projects/kachalka/.git/worktrees/…`, a deleted directory,
  so `git -C` returned `fatal: gitfile does not point to a valid repository` and beads, finding no live
  gitfile, fell back to the local `.beads` and reported no database. All three were `prunable`; they have
  been deleted and `git worktree prune` run. The branches survived and are pushed.
  **Residual, and not this item:** `ensureWorktree` reuses a worktree folder without checking that its
  gitfile still resolves, so a tower relocated on disk hands its workers a folder no git command can read.
  Nobody has filed that one yet.

### 2. Nested repos cannot see the factory's agents or skills

- **Status:** fixed
- **Where:** every spawn site — the loop's workers, the three planners, the overseer, and bare `sf`.
- **Proof:** `--debug` shows 12 skills loaded from the factory root, 0 from `webs/kachalka`, 0 from its
  worktree. Project `.claude/agents/` and `.claude/skills/` are found by walking up from cwd but stopping at
  the git repository root, and a nested clone is a hard boundary.
- **Fix:** ~~`--add-dir "$factoryRoot"` at the spawn sites.~~ Done as `--add-dir`, but the flag is written
  once instead of at every site: `CLI/src/user-env.sh` ends `loadSpiderFactoryEnv` by exporting a second
  command variable, `SF_AGENT_LAUNCH_COMMAND` = the user's `SF_AGENT_COMMAND` plus `--add-dir <factory root>`,
  the root derived from that file's own `BASH_SOURCE` so nothing is hardcoded to one machine. The worker
  spawn (`worker.sh:62`), the planners (`plan-agent.sh:56`) and the overseer (`overseer-agent.sh:55`) exec
  that one. `beads.sh:14` (`agents --json`) and `preflight.sh:7` (a `PATH` check of the first word) stay on
  the plain `SF_AGENT_COMMAND` on purpose — `--add-dir` is variadic and would eat the `agents` positional.
  Bare `sf` needs neither: it already opens at the factory root. Ruled out: plugins (plugin agents are
  namespaced and **ignore `hooks` frontmatter**, which is the entire Stop hook), `--agents` (inline JSON,
  loads no skills), `permissions.additionalDirectories` (file access only, proven `additional: 0`). No
  settings key or `CLAUDE_CODE_*` variable points at an agents/skills directory.
- **Caveats:** agents from an added dir are not hot-reloaded; `strictPluginOnlyCustomization` in managed
  settings would silently break it.
- **Notes:** fixed 2026-11-21 in `8a46181`. Re-proved from `/tmp`, outside the factory entirely, in the
  loop's own spawn shape: the `--debug-file` log reports `additional: 11` skills loaded from the factory, and
  `--agent nosuchagent-xyz` is refused naming all fourteen agents including the seven workers, the three
  planners and the overseer — so `--add-dir` stops cleanly at `--agent` and the added root really is scanned.
  Two claims from the original entry did not survive: the added folder needs **no** trust grant of its own
  under `bypassPermissions`, and `--add-dir` is a discovery flag and not a sandbox — a `bypassPermissions`
  worker could already read and write the factory without it, which is why the earlier "a worker could
  rewrite the loop" framing is withdrawn.
  **Still unverified, and it is the whole point of the fix:** whether a `hooks:` block in an agent's
  frontmatter fires when that agent was reached through an added directory. Nothing has tested it. If it does
  not fire, the Stop hook never runs and no worker ever lands its work — see the rule about a worker that
  does not register its own hook.

### 3. `plan-task` never loads at all

- **Status:** fixed
- **Where:** `.claude/agents/plan-task.md:4` — a literal newline inside the double-quoted `description`.
- **Proof:** `claude plugin validate .claude/agents` → `✘ frontmatter: YAML frontmatter failed to parse:
  Unexpected character. At runtime this agent does not load at all`. Bisected: the em-dashes and the escaped
  quotes are both innocent; converting the description to a block scalar passes. PyYAML parses all eleven
  files fine, so this is Claude Code's parser being stricter than YAML — which is why nobody noticed.
- **Fix:** fold the description onto one line, or use a `>-` block scalar.
- **Notes:** fixed 2026-11-21 by folding it onto one line, which is what the other ten agent files already do
  — a block scalar would have turned every `\"` in the triggers into a literal backslash. Proof it now loads,
  not just validates: `claude plugin validate .claude/agents` → `✔ Validation passed`, and the agent listing
  from outside the repo now reads `… plan-epic, plan-feature, plan-task, review …` where `plan-task` was
  absent from that same list before the fix.

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

- **Status:** fixed
- **Where:** `.claude/skills/bead-create/SKILL.md:76` says "Run them from inside the tower", then `:80-84`
  run `CLI/src/create-beads/create-gate.sh` — a factory-root-relative path.
- **Proof:** from inside a tower that path does not exist; a plan agent following the skill hits "no such
  file".
- **Fix:** ~~name the absolute path, or say plainly that these run from the factory checkout.~~ the second,
  plus the one fact that makes it work: the skill now says the two scripts live under `CLI/src/create-beads/`
  **in the factory checkout**, that the checkout is one of the agent's working directories, and that cwd
  stays in the tower because cwd is what decides which beads database `bd` reads. The example block invokes
  them as `<factory>/CLI/src/create-beads/…`.
- **Notes:** fixed 2026-11-21. No absolute path is written into the skill, so nothing is pinned to one
  machine — a tower-side session really is told about both roots: asked from `webs/kachalka` with the
  factory added, it names `…/webs/kachalka` and `…/spider-factory` as its working directories and reads both.
  Proved by running the generator the way the skill now says, from inside the tower:
  `…/spider-factory/CLI/src/create-beads/create-gate.sh kachalka` → `kachalka-epic-66af423478cc-0`, exit 0,
  and the same call with the wrong prefix exits 1 naming the database's own prefix. A `# Repo: <path>` line in
  the `sf` launcher would have been a machine-independent way to name the checkout, but `install-cli.sh:27`
  only started writing it — the launcher on this machine still says `# Plugin:` — so the skill does not lean
  on it. See item 30.

### 6. `plan-task` points at its templates under a path that isn't there

- **Status:** fixed
- **Where:** `.claude/agents/plan-task.md:82-84` and `:218` name `shared/plan-tasks/<name>.md`.
- **Proof:** the real location is `.claude/shared/plan-tasks/`, and the planner runs foreground with cwd in
  the **tower** (`plan-agent.sh:57`), where neither path exists. `:86` says "the template wins" — the file
  that wins is unreadable, so the draft wins by default.
- **Fix:** ~~`.claude/shared/plan-tasks/<name>.md`, and say it lives in the factory checkout, not the tower.~~
  all four pointers now read `.claude/shared/plan-tasks/<name>.md`, and the sentence under the table says the
  three files live in the **factory checkout**, which is one of the planner's working directories, that its
  cwd is the tower, and that no template is in it — so it names each one by the checkout.
- **Notes:** fixed 2026-11-21. Same shape as item 5, same reason: the checkout reaches the session through
  `--add-dir`, so the path is real to the planner even though it is nowhere near its cwd. Proved from inside
  `webs/kachalka`: `shared/plan-tasks` → missing, `.claude/shared/plan-tasks` → missing, and only
  `…/spider-factory/.claude/shared/plan-tasks` resolves, to `engineer.md frontend.md tester-unit.md`. The
  `plan-agent.sh:57` above is the `exec` line, now `:56` after the `SF_AGENT_LAUNCH_COMMAND` edit.

### 7. Five dead `agents/*.md` pointers

- **Status:** fixed
- **Where:** `tester-unit.md:155`, `tester-feature.md:169-170`, `tester-e2e.md:170-171`,
  `framework-jest/SKILL.md:18`, `framework-playwright/SKILL.md:17-18`.
- **Proof:** `ls agents` → No such file or directory. The files are at `.claude/agents/`. Every one of these
  is the tier-boundary tiebreaker a tester reaches exactly when it cannot tell whether a test is its own.
- **Fix:** ~~`.claude/agents/…`.~~ done — all six occurrences across those five files, and nothing else in the
  repo carries the bare form.
- **Notes:** fixed 2026-11-21. Proved two ways: `grep -rn '`agents/'` over every `.md`, `.sh` and `.c4` in the
  repo returns nothing, and each of the three names now written — `tester-unit`, `tester-feature`,
  `tester-e2e` — is a file that exists at `.claude/agents/`. **Residual, not fixed here:** the path is still
  relative, and a worker's cwd is a worktree, where `.claude/agents/` is also missing (proved from
  `webs/kachalka`: both `agents` and `.claude/agents` → missing). It resolves only through the factory
  checkout, which the worker has as an added directory — the same shape as item 6, which does say so out
  loud. These five do not; the Fix above asked only for the prefix.

### 8. `setup-cli` sends you to the installer from the wrong repo

- **Status:** fixed
- **Where:** `.claude/skills/setup-cli/SKILL.md:32-33` says cd into the project you mean, `:45` says "the
  CLI lives inside this repo", `:50` says `bash CLI/install-cli.sh`.
- **Proof:** `CLI/` exists only in the factory checkout.
- **Fix:** ~~name the factory's absolute path to `CLI/install-cli.sh`.~~ none needed — the skill is gone.
- **Notes:** the skill was deleted rather than corrected, 2026-11-21 in `c5d557f`. `README.md` and
  `.claude/CLAUDE.md` no longer name it, and the diagram's `setupSkill` node became an `installer` node on
  `CLI/install-cli.sh`, which is what actually puts `sf` on the path. The paths quoted under **Where** above
  are the deleted file's and are kept as the record.

---

## B — Work that vanishes with no trace

### 9. `sf hook` refuses to run from outside the factory

- **Status:** wontfix
- **Where:** `CLI/bin/sf:142` — `requireInsideFactory` in front of the Stop hook.
- **Proof:** contradicts the hook's own contract that its cwd is a pooled daemon's cwd and means nothing. It
  passes today only because towers live under `spider-factory/webs/`. Put a tower anywhere else and every
  worker Stop dies before it commits, with no log line. The guard guards nothing either:
  `worker-stop.sh:191` already does its own `( cd "$worktreeDir" && sf commit … )`.
- **Fix:** ~~delete that one line.~~ Kept on purpose — see Notes.
- **Notes:** keep this functionality I only want webs to live in the spider-factory
  **Decided 2026-11-21:** the guard stays. The webs the factory builds are required to live under
  `spider-factory/webs/` — that is the design, `webs/webs.yml` and `scripts/clone-webs.sh` are what put them
  there, and a tower is a clone of one of those webs. So "a tower anywhere else" is not a state the system
  supports, and the refusal at `CLI/bin/sf:108` is the system saying so rather than a bug. The line is not
  deleted, and nothing in `dispatchHook` changes.
  **What this decision accepts, so it is not lost:** the refusal is a `die` to stderr, which reaches the
  hook's debug output and never the run's log files, so a worker whose tower sits outside the factory leaves
  no line in `$SF_LOG_ROOT/<run>/`. If a tower is ever moved outside the factory for real, that silent death
  is what to look for — and the fix is a `writeLog errors` beside the `die`, not the deletion of the guard.

### 10. A worker can be lost forever on an unparsed session id

- **Status:** false positive
- **Where:** `CLI/utils/logging.sh:73` `getSpawnedAgent`, fed straight into the log field at
  `worker.sh:104` and `gates.sh:46`; `worker-stop.sh:52-63` matches on it; `worker-stop.sh:85` is
  `[[ -n "$claimLine" ]] || exit 0`.
- **Proof:** ~~`setLogField` (`logging.sh:29`) turns an empty parse into `session=-`, the hook's session match
  then finds nothing, and the hook exits silently — no commit, no push, no PR, no close, no log line. The
  ticket stays claimed forever and `bd ready` never shows it. A parse failure is indistinguishable from a
  human session.~~ The parse is not empty. The mechanism is real, its premise — that the sed never matches
  what the CLI prints — is not.
- **What's unverified:** ~~it depends on what `$SF_AGENT_COMMAND --bg` actually prints. To prove it: dispatch
  one worker, then `cat $SF_LOG_ROOT/<run>/claims` and check `session=` is not `-`.~~ Done, by probe instead
  of by a dispatch: the loop's own spawn form, run by hand.
- **Fix:** none needed for the claimed bug. The `writeLog errors "reason=session-unparsed"` line is still
  worth having, but as the tripwire for the residual in Notes, not as a fix for this item.
- **Notes:** verified 2026-11-21 against the `claude` at
  `~/.local/share/mise/installs/claude/latest/claude`. `$SF_AGENT_LAUNCH_COMMAND --bg --agent overseer
  --permission-mode default "<trivial prompt>"` run from the factory root prints:

  ```
  Starting background service…
  backgrounded · 940d2a30
  ```

  and that file through the real function — `getSpawnedAgent /tmp/sf-bug10/spawn.txt` — returns `940d2a30`.
  The separator agrees byte for byte: the sed at `logging.sh:74` and the CLI output both carry
  `backgrounded `, `c2 b7`, ` `, then the id. So `session=` carries a real id, the hook's match finds its
  `reason=dispatched` line, and nothing is lost. The probe session was stopped with `claude stop 940d2a30`.
  **The failed-spawn case this item also rested on is already handled:** `worker.sh:98-102` checks the spawn's
  exit status, logs `reason=worker-not-dispatched` and releases the claim. Proven by the same probe run
  against an untrusted directory, which exited 1.
  **Residual, and not this item:** a spawn that exits **0** and prints no `backgrounded` line still yields
  `session=-` and the silent exit at `worker-stop.sh:85`. Not reproducible against this CLI; a change to the
  `--bg` output format is what would cause it, and the `reason=session-unparsed` line above is the only thing
  that would ever say so.
  **Also not this item, and found while probing:** `CLI/src/beads-loop/worker.sh` does not parse — the
  `printf '%s' "` at `:23` is never closed, so `bash -n` fails at EOF, `index.sh` cannot source it, and
  `sf loop` cannot start. Nobody has filed that one yet.

### 11. A fixer can complete review's ticket

- **Status:** fixed
- **Where:** `review.md:286-290` ended every fixer prompt with three constraints — fix this finding and
  nothing beside it, `sf commit` it yourself, touch no ticket. None mentioned the done marker.
- **Proof:** every fixer is an `engineer`/`frontend`/`tester-*`, and each of those files ends its own
  contract with `touch $SF_DONE_FILE` as the very last action (`engineer.md:45`, `frontend.md:43`,
  `tester-unit.md:62`, `tester-feature.md:61`, `tester-e2e.md:63`). A fixer is an `Agent` spawn from inside
  review's own session — `review.md:5` carries the `Agent` tool — so it inherits review's environment, and
  `$SF_DONE_FILE` in it is review's own (`worker.sh:61`, the only place that variable is ever set). The first
  fixer finishing marked review done; if review then died, the hook's fail-closed check passed and it
  committed, pushed and closed the review ticket on a half-finished round.
- **Fix:** done — the constraints are now four. `review.md:286-290` adds **touch no done marker**, and
  requires review to name the variable in the prompt and say why: it is review's own, inherited, and a fixer
  that touches it declares the review complete while review is still waiting on its siblings.
- **Notes:** the hazard is a contract collision, not a code path: nothing in `CLI/` can see which session
  created the marker, so the only defence is the brief that reaches the fixer. The five fixer files keep
  their own `touch $SF_DONE_FILE` rule untouched — outside review they are correct, and a worker of the loop
  is the only session that owns its marker. Proved by grep, not by a run: `grep -n SF_DONE_FILE` across the
  five fixer files, `review.md:5` for the `Agent` tool, and `grep -n SF_DONE_FILE CLI/src/beads-loop/worker.sh`
  → the single export at `:61`. The board's own `worker.sh:69` citation was stale; it is `:61`.

### 12. Nothing detects a dead worker

- **Status:** not needed
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
- **Notes:** No at the moment Im accepting this risk

---

## C — Review can't do its job

### 13. The brief forbids the one thing review exists to do

- **Status:** fixed
- **Where:** `CLI/src/beads-loop/worker.sh:39` rule 4 — *"Spawn nothing. Work nothing but $ticketId."* —
  goes to every worker including review.
- **Proof:** `review.md:73` says "Spawn fixers, once, and file no tickets" and `:263` "one spawn per finding,
  all of them in a single batch, one round only". Review is the only agent whose whole step 7 is spawning,
  and the only `tools:` list carrying `Agent` (`review.md:5`). Rule 4 is the last word the model hears, and
  `worker.sh:40` already proves the brief special-cases `lead` and nobody else.
- **Fix:** exempt `review` from rule 4 the way rule 5 exempts `lead`.
- **Notes:** I fixed this. Verified 2026-11-21: rule 4 is gone from the brief entirely, so nothing forbids
  review to spawn. Closing it also exposed that the brief's `printf` string had been left unterminated when
  rules 3 and 4 were cut — `bash -n` failed at EOF and `index.sh` could not source the file, so `sf loop`
  could not start. The string is closed and rule 5 is interpolated again; rules 3 and 4 stay cut.

### 14. Review diffs against a branch its own file says its ticket does not carry

- **Status:** fixed
- **Where:** `review.md:113-114` — `git diff --stat <branch-named-in-your-ticket>...HEAD`.
- **Proof:** against `review.md:33-34` — "Your ticket carries no branch of your own; nothing a task carries
  can be trusted as much as the gate it hangs under. Read `SF_BRANCH` before anything else". The placeholder
  resolves to nothing, and `git diff ...HEAD` exits 0 printing nothing — an empty diff, so review reads no
  changed files at all.
- **Fix:** use `$SF_BRANCH`.
- **Notes:** the suggested `$SF_BRANCH` was a bad fix — the daemon freezes a background session's
  environment, so the variable is not trustworthy. Measured 2026-11-21, and it is worse than filed: in a
  scratch repo `git diff --stat ...HEAD` exits **0** and prints **nothing**, so the degenerate placeholder
  yields an empty diff, not the whole tree — review reads no changed files and can post a clean bill of
  health it never earned. Diffing a branch against itself is empty either way, since review's own work lands
  on that branch. Fixed with no environment variable in it at all: the branch is `git branch --show-current`
  in the worktree the loop put it in, and the diff base is the epic gate's `branch` read off `bd`, `main`
  when the ticket sits under the epic itself. An empty `--stat` is now a finding, not a pass.

### 15. `sf commit` sweeps review's findings file onto the feature branch

- **Status:** fixed
- **Where:** `CLI/src/commit.sh:39` — `git add -A`.
- **Proof:** `review.md:57` and `:306` tell review to leave the findings file in the working tree, and
  `review.md:287` has each fixer run `sf commit` in that same worktree. Review's own rule is "They commit;
  you commit nothing" (`:289`), so it can never take the file back out.
- **Fix:** have review write findings under a gitignored path.
- **Notes:** the fix is not a gitignored path — review writes no findings file at all. Findings go to the PR
  and nowhere else, then the fixers run, then review resolves the threads whose fixes landed and stops.
  `git add -A` stays as it is. Done 2026-11-21: `review.md` loses both findings-file paths (the standing rule
  and the no-PR fallback) and gains a close-out step that resolves only its own threads, leaving open the
  ones whose fixer came back wrong or disputed; `pr-comments` loses its write-a-file fallback, drops resolve
  from the never-do list, and gains the real resolve calls for both forges. Approve and merge stay the
  human's. Same day, second round: `pr-comments` is cut to the tool and nothing else — forge from the remote,
  prove the PR, one finding one comment, the post table — 199 lines down to ~100, and the resolve calls move
  into `review.md`, which is the only thing that resolves anything. There review now creates **no files at
  all**, each finding's comment must be complete enough to fix from and is pasted verbatim as the fixer's
  whole brief, and the fixers spawn **one at a time** instead of in one batch — they share one worktree and
  one branch, so a batch steps on each other's commits.

---

## D — Agents told to use tools they do not have

### 16. `plan-epic` has no `TaskCreate` and no `WebSearch`

- **Status:** open
- **Where:** `.claude/agents/plan-epic.md:5` — `tools: Read, Bash, Grep, Glob, Skill`.
- **Proof:** `:152-153` commands "`TaskCreate` each question the moment you think of it" and `:166` commands
  "web search for how similar products work". Both are mandatory-sounding and fail on first use, and the same
  file says "Never lean on training knowledge" — so the agent is left with no sanctioned research path.
- **Fix:** add `TaskCreate`, `TaskUpdate`, `WebSearch` to `tools:`, or drop both instructions.
- **Notes:** add all the tools, plus WebFetch plus MCP

---

## E — Files that describe a system that no longer exists

### 17. `bead-initialize` still credits the deleted Fail hook

- **Status:** fixed
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
- **Notes:** verify this again

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
- **Notes:** we want all ENVs plus the sf ones

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
