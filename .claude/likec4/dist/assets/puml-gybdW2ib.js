var e=e=>{switch(e){case`index`:return`@startuml
title "How to read this — start here"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam component<<Dispatcher>>{
  BackgroundColor #2563EB
  FontColor #f1ffff
  BorderColor #0042c2
}
skinparam component<<Hook>>{
  BackgroundColor #0E7490
  FontColor #ceffff
  BorderColor #00516b
}
skinparam person<<Human>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<Decisions>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<PlanAgentsPlanEpic>>{
  BackgroundColor #0891B2
  FontColor #ffffff
  BorderColor #006c8c
}
skinparam rectangle<<WorkersEngineer>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorkersTesterUnit>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorkersFrontend>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorkersTesterFeature>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorkersTesterE2e>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorkersReviewAgent>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorkersMergeAgent>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<ErrorsLabelAmbiguous>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsFrontierEmpty>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam database<<Beads>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam database<<Origin>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<TowerEpicFeatABackendA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
component "==bo loop — the dispatcher\\n\\nWhat it is: CLI/beads-loop.sh — the one command (bo loop) that turns beads tickets into background workers.Steps it runs, one per tick:reads the branches already at work (branchesCurrentlyAtWork)claims a ticket atomically with bd ready --claimmatches its single dispatching label against the AGENT map — never guesses a specialistreads branch and parent off the claim; never invents a branchwalks the parent chain to the epic gate and publishes its branch + PR if missing (ensureEpicGatePr)makes sure the branch's worktree exists (ensureWorktree)spawns claude --bg --agent <agent> --permission-mode bypassPermissions with cwd inside that worktreelogs one line and moves on — it never polls a worker, never reaps, never merges" <<Dispatcher>> as Dispatcher
component "==hooks/worker-stop.sh — the Stop hook\\n\\nWhat it is: the fail-closed gatekeeper that fires when a worker session stops.Steps:checks $BO_DONE_FILE — no marker, no commit, no push, no PR, no close (ERROR reason=not-declared-done)commits the work onto the ticket's branch and pushes itopens the PR once per branch (base = the epic gate's branch, main at the epic tier) or reuses itwrites the PR url onto the ticket as metadata.prIt closes a task only on its done marker. A worker that touches the marker before the brief is complete has filed half a task onto a shared branch — the one failure this model cannot undo on its own." <<Hook>> as Hook
person "==Human (Brodie)\\n\\nWhat it is: the only one who closes gates. Workers leave their tickets open and report in their final message; the human reads the report, verifies the branch, and closes. A claimable ticket assigned to a human is a model bug — the person enters through gates and closes them; nothing is spawned for them." <<Human>> as Human
rectangle "==Decision points\\n\\nWhat it is: the judgments the machine cannot make — everything else is mechanical.Plan-epic: what the epic is — one epic, one epic/<slug> of 2–4 lowercase words saying what the thing is.Plan-feature: what counts as a complete user-facing flow; phasing foundations → core → dependent → polish; a colliding sibling gets different words, never -2.Order inside a feature's line: logic, then its tests, then the UI — never a fan.Tier of a test ticket: the label carries the tier, not --agent; a mis-labeled ticket gets the wrong depth of coverage and no worker can tell you it did.Gates: the human verifies feature-review / epic-review output, then closes. Nothing self-closes.Merge conflicts at the epic tier: the merge agent resolves between feature branches; it writes no code and never merges into main." <<Decisions>> as Decisions
rectangle "==plan-epic\\n\\nWhat it is: conversational epic architect — vague idea → clarifying questions → research → exactly one epic gate plus epic-merge-pr, epic-e2e-test, epic-review. Writes the gate's own branch (epic/recipe-box) onto the gate and its three tickets as their only metadata key." <<PlanAgentsPlanEpic>> as PlanAgentsPlanEpic
rectangle "The workers (the spokes)" <<Workers>> as Workers {
  skinparam RectangleBorderColor<<Workers>> #64748b
  skinparam RectangleFontColor<<Workers>> #64748b
  skinparam RectangleBorderStyle<<Workers>> dashed

  rectangle "==engineer\\n\\nWhat it is: the back-end worker — business logic, endpoints, hooks, types, error factories. Spawned s b w, certified by respawn. Never writes tests, JSX, or CSS. Dispatched by the label backend-logic." <<WorkersEngineer>> as WorkersEngineer
  rectangle "==tester-unit\\n<size:10>[Flask]</size>\\n\\nWhat it is: the micro tier — one back-end function alone; every branch, boundary, empty/null, error. Never a component (the UI is proved by the composition tier). Label unit-tests, framework skill framework-jest." <<WorkersTesterUnit>> as WorkersTesterUnit
  rectangle "==frontend\\n\\nWhat it is: the UI worker — components, layout, styling, the shared component system. Built last, against functions already proved. Label frontend-ui." <<WorkersFrontend>> as WorkersFrontend
  rectangle "==tester-feature\\n<size:10>[Flask]</size>\\n\\nWhat it is: the composition tier — one feature's pieces proved wired; its errors and successes surface. Never re-runs the unit tier's edge-case matrix. Label feature-test, skill framework-playwright." <<WorkersTesterFeature>> as WorkersTesterFeature
  rectangle "==tester-e2e\\n<size:10>[Flask]</size>\\n\\nWhat it is: the broad tier — journeys across features on the real stack; cross-feature state; one success + one failure per feature. Label epic-e2e-test, skill framework-playwright." <<WorkersTesterE2e>> as WorkersTesterE2e
  rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorkersReviewAgent>> as WorkersReviewAgent
  rectangle "==merge\\n\\nWhat it is: the epic-tier assembler — reads the feature branches off the feature gates, assembles them onto the epic branch in its own worktree, resolves the conflicts between them, runs the tests, reports. Writes no code, no tests; never merges into main, never opens a PR. Label epic-merge-pr." <<WorkersMergeAgent>> as WorkersMergeAgent
}
rectangle "The alarm vocabulary" <<Errors>> as Errors {
  skinparam RectangleBorderColor<<Errors>> #64748b
  skinparam RectangleFontColor<<Errors>> #64748b
  skinparam RectangleBorderStyle<<Errors>> dashed

  rectangle "==ERROR reason=label-ambiguous\\n\\nWhat it is: zero or two dispatching labels on a claim. The dispatcher never guesses a specialist — the ticket is LEFT CLAIMED so its lease parks it off the frontier, and the errors file is the alarm." <<ErrorsLabelAmbiguous>> as ErrorsLabelAmbiguous
  rectangle "==reason=frontier_empty\\n\\nWhat it is: the empty frontier's first state — nothing left to do." <<ErrorsFrontierEmpty>> as ErrorsFrontierEmpty
}
database "==beads DB (bd)\\n\\nWhat it is: the beads issue database — the loop's only runtime input. None of the contract docs are read at runtime; the graph lives here.Verbs the tower uses: bd ready --claim (atomic — a bare bd ready would let two loops steal the same ticket), bd unclaim, bd heartbeat, bd create -t gate -l <label> --parent <id>, bd dep add <a> <b> --type blocks, bd update --set-metadata (merges — it never disturbs the plan's branch), bd show --json." <<Beads>> as Beads
database "==origin — GitHub\\n\\nWhat it is: the remote the tower publishes to. main at the bottom, one PR per branch above it: feature/<slug> → PR → the epic branch, epic/<slug> → PR → main." <<Origin>> as Origin
rectangle "The tower (one beads DB)" <<Tower>> as Tower {
  skinparam RectangleBorderColor<<Tower>> #64748b
  skinparam RectangleFontColor<<Tower>> #64748b
  skinparam RectangleBorderStyle<<Tower>> dashed

  rectangle "Feature — Add a Recipe (RECIPE-5)" <<TowerEpicFeatA>> as TowerEpicFeatA {
    skinparam RectangleBorderColor<<TowerEpicFeatA>> #D97706
    skinparam RectangleFontColor<<TowerEpicFeatA>> #D97706
    skinparam RectangleBorderStyle<<TowerEpicFeatA>> dashed

    rectangle "==backend-logic (RECIPE-6)\\n\\nWhat's inside the ticket:title:    validateRecipe + saveRecipe — pure functions\\nlabel:    backend-logic        agent: engineer\\ncategory: backend-logic\\nmetadata: { "branch": "feature/add-recipe" }   ← copied verbatim from the feature gate\\ndepends:  none (first task — it is the frontier)RequirementsvalidateRecipe(input): Either<RecipeValidationError, Recipe> — pure, no mutationsaveRecipe(validated): RecipeRecord through the repository port onlyreject: empty title, title > 120 chars, duplicate slug, missing ingredientsFiles: src/recipes/validate-recipe.ts, src/recipes/types.ts, src/recipes/ports.ts\\nDone: report in the final message; the Stop hook, not you, files it." <<TowerEpicFeatABackendA>> as TowerEpicFeatABackendA
  }
}

Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>bd ready --claim / bd unclaim
Dispatcher .[#8D8D8D,thickness=2].> Origin : <color:#8D8D8D>ensureEpicGatePr — push epic branch, open PR, write pr on the gate
Hook .[#8D8D8D,thickness=2].> Origin : <color:#8D8D8D>commit, push, PR — only when BO_DONE_FILE exists
Dispatcher .[#1c4ab0,thickness=2].> WorkersEngineer : <color:#1c4ab0>backend-logic
WorkersEngineer .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>bd heartbeat — keep the lease alive
WorkersEngineer .[#8D8D8D,thickness=2].> Origin : <color:#8D8D8D>commit on the branch (via the Stop hook, never directly)
Dispatcher .[#1c4ab0,thickness=2].> WorkersTesterUnit : <color:#1c4ab0>unit-tests
Dispatcher .[#1c4ab0,thickness=2].> WorkersFrontend : <color:#1c4ab0>frontend-ui
Dispatcher .[#1c4ab0,thickness=2].> WorkersTesterFeature : <color:#1c4ab0>feature-test
Dispatcher .[#1c4ab0,thickness=2].> WorkersTesterE2e : <color:#1c4ab0>epic-e2e-test
Dispatcher .[#1c4ab0,thickness=2].> WorkersReviewAgent : <color:#1c4ab0>[...]
Dispatcher .[#1c4ab0,thickness=2].> WorkersMergeAgent : <color:#1c4ab0>epic-merge-pr
WorkersEngineer .[#5d2cb2,thickness=2].> TowerEpicFeatABackendA
Dispatcher .[#a51d1d,thickness=2].> ErrorsLabelAmbiguous
Dispatcher .[#a51d1d,thickness=2].> ErrorsFrontierEmpty
Human .[#a35905,thickness=2].> TowerEpicFeatA : <color:#a35905>after feature-review
@enduml
`;case`towerMap`:return`@startuml
title "1. The Tower — the epic, two features, every ticket"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<TowerEpicFeatABackendA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatBBackendB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicEpicMergePr>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatAUnitA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatBUnitB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicEpicE2e>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatAFrontendA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatBFrontendB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicEpicReview>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatAFeatureTestA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatBFeatureTestB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatAFeatureReviewA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<TowerEpicFeatBFeatureReviewB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
rectangle "Epic — Recipe Box (RECIPE-1)" <<TowerEpic>> as TowerEpic {
  skinparam RectangleBorderColor<<TowerEpic>> #D97706
  skinparam RectangleFontColor<<TowerEpic>> #D97706
  skinparam RectangleBorderStyle<<TowerEpic>> dashed

  rectangle "Feature — Add a Recipe (RECIPE-5)" <<TowerEpicFeatA>> as TowerEpicFeatA {
    skinparam RectangleBorderColor<<TowerEpicFeatA>> #D97706
    skinparam RectangleFontColor<<TowerEpicFeatA>> #D97706
    skinparam RectangleBorderStyle<<TowerEpicFeatA>> dashed

    rectangle "==backend-logic (RECIPE-6)\\n\\nWhat's inside the ticket:title:    validateRecipe + saveRecipe — pure functions\\nlabel:    backend-logic        agent: engineer\\ncategory: backend-logic\\nmetadata: { "branch": "feature/add-recipe" }   ← copied verbatim from the feature gate\\ndepends:  none (first task — it is the frontier)RequirementsvalidateRecipe(input): Either<RecipeValidationError, Recipe> — pure, no mutationsaveRecipe(validated): RecipeRecord through the repository port onlyreject: empty title, title > 120 chars, duplicate slug, missing ingredientsFiles: src/recipes/validate-recipe.ts, src/recipes/types.ts, src/recipes/ports.ts\\nDone: report in the final message; the Stop hook, not you, files it." <<TowerEpicFeatABackendA>> as TowerEpicFeatABackendA
    rectangle "==unit-tests (RECIPE-7)\\n\\nWhat's inside the ticket:title:    exhaustive coverage for validateRecipe\\nlabel:    unit-tests           agent: tester-unit (respawn)\\ncategory: unit-tests\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-6 (the back-end ticket it tests)\\nskill:    framework-jestCover: every branch, every boundary (120/121 chars), empty/null input, each error it throws, empty ingredients list.\\nOwned elsewhere: composition wiring (feature tier), components (never here), journeys (epic tier)." <<TowerEpicFeatAUnitA>> as TowerEpicFeatAUnitA
    rectangle "==frontend-ui (RECIPE-8)\\n\\nWhat's inside the ticket:title:    RecipeForm + RecipeCard against proved functions\\nlabel:    frontend-ui          agent: frontend\\ncategory: frontend-ux\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-7Brief: the form, validation feedback surfacing each RecipeValidationError, the card in the box. Layout and styling only — the logic is already proved by the micro tier." <<TowerEpicFeatAFrontendA>> as TowerEpicFeatAFrontendA
    rectangle "==feature-test (RECIPE-9)\\n\\nWhat's inside the ticket:title:    the add-recipe pieces are wired\\nlabel:    feature-test         agent: tester-feature (respawn)\\ncategory: feature-test\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-8 (the LAST task — nothing is proved against half a feature)\\nskill:    framework-playwrightCover: the composed flow saves a recipe; each encapsulated error surfaces to the user. The suite runs only after every task landed on the feature branch." <<TowerEpicFeatAFeatureTestA>> as TowerEpicFeatAFeatureTestA
    rectangle "==feature-review (RECIPE-10)\\n\\nWhat's inside the ticket:title:    the three questions over feature/add-recipe\\nlabel:    feature-review       agent: review (respawn)\\ncategory: review\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-9 (no review before the suite)\\nskill:    pr-commentsBrief: three questions from first principles, findings as PR comments. Then the human verifies and closes gate RECIPE-5." <<TowerEpicFeatAFeatureReviewA>> as TowerEpicFeatAFeatureReviewA
  }
  rectangle "Feature — Search the Box (RECIPE-11)" <<TowerEpicFeatB>> as TowerEpicFeatB {
    skinparam RectangleBorderColor<<TowerEpicFeatB>> #D97706
    skinparam RectangleFontColor<<TowerEpicFeatB>> #D97706
    skinparam RectangleBorderStyle<<TowerEpicFeatB>> dashed

    rectangle "==backend-logic (RECIPE-12)\\n\\nWhat's inside the ticket:title:    searchRecipes — pure filter over the repository port\\nlabel:    backend-logic        agent: engineer\\ncategory: backend-logic\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  none (first task — with Add a Recipe, it is the frontier; claimed together)RequirementssearchRecipes(query, records): Recipe[] — pure, deterministic orderempty query returns all, sorted newest first; whitespace trimmedno match returns [], never an errorFiles: src/recipes/search-recipes.ts, src/recipes/ports.ts (read side)" <<TowerEpicFeatBBackendB>> as TowerEpicFeatBBackendB
    rectangle "==unit-tests (RECIPE-13)\\n\\nWhat's inside the ticket:title:    exhaustive coverage for searchRecipes\\nlabel:    unit-tests           agent: tester-unit (respawn)\\ncategory: unit-tests\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-12\\nskill:    framework-jestCover: empty query, whitespace, unicode titles, empty store, tie-break ordering, case folding." <<TowerEpicFeatBUnitB>> as TowerEpicFeatBUnitB
    rectangle "==frontend-ui (RECIPE-14)\\n\\nWhat's inside the ticket:title:    SearchBar + live results list\\nlabel:    frontend-ui          agent: frontend\\ncategory: frontend-ux\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-13Brief: debounce, empty-state copy, highlight matches with the shared component system." <<TowerEpicFeatBFrontendB>> as TowerEpicFeatBFrontendB
    rectangle "==feature-test (RECIPE-15)\\n\\nWhat's inside the ticket:title:    the search pieces are wired\\nlabel:    feature-test         agent: tester-feature (respawn)\\ncategory: feature-test\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-14 (the LAST task)\\nskill:    framework-playwright" <<TowerEpicFeatBFeatureTestB>> as TowerEpicFeatBFeatureTestB
    rectangle "==feature-review (RECIPE-16)\\n\\nWhat's inside the ticket:title:    the three questions over feature/search-recipes\\nlabel:    feature-review       agent: review (respawn)\\ncategory: review\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-15\\nskill:    pr-comments" <<TowerEpicFeatBFeatureReviewB>> as TowerEpicFeatBFeatureReviewB
  }
  rectangle "==epic-merge-pr (RECIPE-2)\\n\\nWhat's inside the ticket:title:    assemble the feature branches onto epic/recipe-box\\nlabel:    epic-merge-pr        agent: merge\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-5, RECIPE-11 (the feature gates)Brief: read the feature branches off the feature gates, assemble them onto the epic branch in your own worktree, resolve the conflicts between them, run the tests, report. No code, no tests, no merge into main, no PR." <<TowerEpicEpicMergePr>> as TowerEpicEpicMergePr
  rectangle "==epic-e2e-test (RECIPE-3)\\n\\nWhat's inside the ticket:title:    journeys across the whole app in a real browser\\nlabel:    epic-e2e-test        agent: tester-e2e (respawn)\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-2Brief: cross-feature state handoffs, session continuity, one success + one failure journey per feature. Never re-test the unit tier's edges or the feature tier's wiring." <<TowerEpicEpicE2e>> as TowerEpicEpicE2e
  rectangle "==epic-review (RECIPE-4)\\n\\nWhat's inside the ticket:title:    the three questions over the whole epic\\nlabel:    epic-review          agent: review (respawn)\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-3Brief: map entry → exit, instrument with trace logs, run the tests against the instrumented code, post findings as PR comments. Then the human verifies and closes the epic gate." <<TowerEpicEpicReview>> as TowerEpicEpicReview
}

TowerEpicEpicMergePr .[#505660,thickness=2].> TowerEpicEpicE2e
TowerEpicEpicE2e .[#505660,thickness=2].> TowerEpicEpicReview
TowerEpicFeatABackendA .[#505660,thickness=2].> TowerEpicFeatAUnitA
TowerEpicFeatAUnitA .[#505660,thickness=2].> TowerEpicFeatAFrontendA
TowerEpicFeatAFrontendA .[#505660,thickness=2].> TowerEpicFeatAFeatureTestA
TowerEpicFeatAFeatureTestA .[#505660,thickness=2].> TowerEpicFeatAFeatureReviewA
TowerEpicFeatBBackendB .[#505660,thickness=2].> TowerEpicFeatBUnitB
TowerEpicFeatBUnitB .[#505660,thickness=2].> TowerEpicFeatBFrontendB
TowerEpicFeatBFrontendB .[#505660,thickness=2].> TowerEpicFeatBFeatureTestB
TowerEpicFeatBFeatureTestB .[#505660,thickness=2].> TowerEpicFeatBFeatureReviewB
TowerEpicFeatA .[#505660,thickness=2].> TowerEpicEpicMergePr
TowerEpicFeatB .[#505660,thickness=2].> TowerEpicEpicMergePr
@enduml
`;case`allBranches`:return`@startuml
title "2. Branches — one box per branch"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<WorktreesRootWtEpicMergeRun>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtEpicE2eRun>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtEpicEpicReviewRun>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAEngA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAUnitA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAFeA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAFtA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtARevA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBEngB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBUnitB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBFeB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBFtB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBRevB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtEpicT_merge>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtAT_backendA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_backendB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtEpicT_e2e>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtAT_unitA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_unitB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtEpicT_epicReview>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtAT_frontA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_frontB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtAT_ftestA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_ftestB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtAT_frevA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_frevB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
rectangle ".claude/worktrees/ — one box per branch" <<WorktreesRoot>> as WorktreesRoot {
  skinparam RectangleBorderColor<<WorktreesRoot>> #059669
  skinparam RectangleFontColor<<WorktreesRoot>> #059669
  skinparam RectangleBorderStyle<<WorktreesRoot>> dashed

  rectangle "epic+recipe-box → epic/recipe-box" <<WorktreesRootWtEpic>> as WorktreesRootWtEpic {
    skinparam RectangleBorderColor<<WorktreesRootWtEpic>> #059669
    skinparam RectangleFontColor<<WorktreesRootWtEpic>> #059669
    skinparam RectangleBorderStyle<<WorktreesRootWtEpic>> dashed

    rectangle "==merge\\n\\nWhat it is: the epic-tier assembler — reads the feature branches off the feature gates, assembles them onto the epic branch in its own worktree, resolves the conflicts between them, runs the tests, reports. Writes no code, no tests; never merges into main, never opens a PR. Label epic-merge-pr." <<WorktreesRootWtEpicMergeRun>> as WorktreesRootWtEpicMergeRun
    rectangle "==tester-e2e\\n<size:10>[Flask]</size>\\n\\nWhat it is: the broad tier — journeys across features on the real stack; cross-feature state; one success + one failure per feature. Label epic-e2e-test, skill framework-playwright." <<WorktreesRootWtEpicE2eRun>> as WorktreesRootWtEpicE2eRun
    rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorktreesRootWtEpicEpicReviewRun>> as WorktreesRootWtEpicEpicReviewRun
    rectangle "==epic-merge-pr (RECIPE-2)\\n\\nWhat's inside the ticket:title:    assemble the feature branches onto epic/recipe-box\\nlabel:    epic-merge-pr        agent: merge\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-5, RECIPE-11 (the feature gates)Brief: read the feature branches off the feature gates, assemble them onto the epic branch in your own worktree, resolve the conflicts between them, run the tests, report. No code, no tests, no merge into main, no PR." <<WorktreesRootWtEpicT_merge>> as WorktreesRootWtEpicT_merge
    rectangle "==epic-e2e-test (RECIPE-3)\\n\\nWhat's inside the ticket:title:    journeys across the whole app in a real browser\\nlabel:    epic-e2e-test        agent: tester-e2e (respawn)\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-2Brief: cross-feature state handoffs, session continuity, one success + one failure journey per feature. Never re-test the unit tier's edges or the feature tier's wiring." <<WorktreesRootWtEpicT_e2e>> as WorktreesRootWtEpicT_e2e
    rectangle "==epic-review (RECIPE-4)\\n\\nWhat's inside the ticket:title:    the three questions over the whole epic\\nlabel:    epic-review          agent: review (respawn)\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-3Brief: map entry → exit, instrument with trace logs, run the tests against the instrumented code, post findings as PR comments. Then the human verifies and closes the epic gate." <<WorktreesRootWtEpicT_epicReview>> as WorktreesRootWtEpicT_epicReview
  }
  rectangle "feature+add-recipe → feature/add-recipe" <<WorktreesRootWtA>> as WorktreesRootWtA {
    skinparam RectangleBorderColor<<WorktreesRootWtA>> #059669
    skinparam RectangleFontColor<<WorktreesRootWtA>> #059669
    skinparam RectangleBorderStyle<<WorktreesRootWtA>> dashed

    rectangle "==engineer\\n\\nWhat it is: the back-end worker — business logic, endpoints, hooks, types, error factories. Spawned s b w, certified by respawn. Never writes tests, JSX, or CSS. Dispatched by the label backend-logic." <<WorktreesRootWtAEngA>> as WorktreesRootWtAEngA
    rectangle "==tester-unit\\n<size:10>[Flask]</size>\\n\\nWhat it is: the micro tier — one back-end function alone; every branch, boundary, empty/null, error. Never a component (the UI is proved by the composition tier). Label unit-tests, framework skill framework-jest." <<WorktreesRootWtAUnitA>> as WorktreesRootWtAUnitA
    rectangle "==frontend\\n\\nWhat it is: the UI worker — components, layout, styling, the shared component system. Built last, against functions already proved. Label frontend-ui." <<WorktreesRootWtAFeA>> as WorktreesRootWtAFeA
    rectangle "==tester-feature\\n<size:10>[Flask]</size>\\n\\nWhat it is: the composition tier — one feature's pieces proved wired; its errors and successes surface. Never re-runs the unit tier's edge-case matrix. Label feature-test, skill framework-playwright." <<WorktreesRootWtAFtA>> as WorktreesRootWtAFtA
    rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorktreesRootWtARevA>> as WorktreesRootWtARevA
    rectangle "==backend-logic (RECIPE-6)\\n\\nWhat's inside the ticket:title:    validateRecipe + saveRecipe — pure functions\\nlabel:    backend-logic        agent: engineer\\ncategory: backend-logic\\nmetadata: { "branch": "feature/add-recipe" }   ← copied verbatim from the feature gate\\ndepends:  none (first task — it is the frontier)RequirementsvalidateRecipe(input): Either<RecipeValidationError, Recipe> — pure, no mutationsaveRecipe(validated): RecipeRecord through the repository port onlyreject: empty title, title > 120 chars, duplicate slug, missing ingredientsFiles: src/recipes/validate-recipe.ts, src/recipes/types.ts, src/recipes/ports.ts\\nDone: report in the final message; the Stop hook, not you, files it." <<WorktreesRootWtAT_backendA>> as WorktreesRootWtAT_backendA
    rectangle "==unit-tests (RECIPE-7)\\n\\nWhat's inside the ticket:title:    exhaustive coverage for validateRecipe\\nlabel:    unit-tests           agent: tester-unit (respawn)\\ncategory: unit-tests\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-6 (the back-end ticket it tests)\\nskill:    framework-jestCover: every branch, every boundary (120/121 chars), empty/null input, each error it throws, empty ingredients list.\\nOwned elsewhere: composition wiring (feature tier), components (never here), journeys (epic tier)." <<WorktreesRootWtAT_unitA>> as WorktreesRootWtAT_unitA
    rectangle "==frontend-ui (RECIPE-8)\\n\\nWhat's inside the ticket:title:    RecipeForm + RecipeCard against proved functions\\nlabel:    frontend-ui          agent: frontend\\ncategory: frontend-ux\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-7Brief: the form, validation feedback surfacing each RecipeValidationError, the card in the box. Layout and styling only — the logic is already proved by the micro tier." <<WorktreesRootWtAT_frontA>> as WorktreesRootWtAT_frontA
    rectangle "==feature-test (RECIPE-9)\\n\\nWhat's inside the ticket:title:    the add-recipe pieces are wired\\nlabel:    feature-test         agent: tester-feature (respawn)\\ncategory: feature-test\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-8 (the LAST task — nothing is proved against half a feature)\\nskill:    framework-playwrightCover: the composed flow saves a recipe; each encapsulated error surfaces to the user. The suite runs only after every task landed on the feature branch." <<WorktreesRootWtAT_ftestA>> as WorktreesRootWtAT_ftestA
    rectangle "==feature-review (RECIPE-10)\\n\\nWhat's inside the ticket:title:    the three questions over feature/add-recipe\\nlabel:    feature-review       agent: review (respawn)\\ncategory: review\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-9 (no review before the suite)\\nskill:    pr-commentsBrief: three questions from first principles, findings as PR comments. Then the human verifies and closes gate RECIPE-5." <<WorktreesRootWtAT_frevA>> as WorktreesRootWtAT_frevA
  }
  rectangle "feature+search-recipes → feature/search-recipes" <<WorktreesRootWtB>> as WorktreesRootWtB {
    skinparam RectangleBorderColor<<WorktreesRootWtB>> #059669
    skinparam RectangleFontColor<<WorktreesRootWtB>> #059669
    skinparam RectangleBorderStyle<<WorktreesRootWtB>> dashed

    rectangle "==engineer\\n\\nWhat it is: the back-end worker — business logic, endpoints, hooks, types, error factories. Spawned s b w, certified by respawn. Never writes tests, JSX, or CSS. Dispatched by the label backend-logic." <<WorktreesRootWtBEngB>> as WorktreesRootWtBEngB
    rectangle "==tester-unit\\n<size:10>[Flask]</size>\\n\\nWhat it is: the micro tier — one back-end function alone; every branch, boundary, empty/null, error. Never a component (the UI is proved by the composition tier). Label unit-tests, framework skill framework-jest." <<WorktreesRootWtBUnitB>> as WorktreesRootWtBUnitB
    rectangle "==frontend\\n\\nWhat it is: the UI worker — components, layout, styling, the shared component system. Built last, against functions already proved. Label frontend-ui." <<WorktreesRootWtBFeB>> as WorktreesRootWtBFeB
    rectangle "==tester-feature\\n<size:10>[Flask]</size>\\n\\nWhat it is: the composition tier — one feature's pieces proved wired; its errors and successes surface. Never re-runs the unit tier's edge-case matrix. Label feature-test, skill framework-playwright." <<WorktreesRootWtBFtB>> as WorktreesRootWtBFtB
    rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorktreesRootWtBRevB>> as WorktreesRootWtBRevB
    rectangle "==backend-logic (RECIPE-12)\\n\\nWhat's inside the ticket:title:    searchRecipes — pure filter over the repository port\\nlabel:    backend-logic        agent: engineer\\ncategory: backend-logic\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  none (first task — with Add a Recipe, it is the frontier; claimed together)RequirementssearchRecipes(query, records): Recipe[] — pure, deterministic orderempty query returns all, sorted newest first; whitespace trimmedno match returns [], never an errorFiles: src/recipes/search-recipes.ts, src/recipes/ports.ts (read side)" <<WorktreesRootWtBT_backendB>> as WorktreesRootWtBT_backendB
    rectangle "==unit-tests (RECIPE-13)\\n\\nWhat's inside the ticket:title:    exhaustive coverage for searchRecipes\\nlabel:    unit-tests           agent: tester-unit (respawn)\\ncategory: unit-tests\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-12\\nskill:    framework-jestCover: empty query, whitespace, unicode titles, empty store, tie-break ordering, case folding." <<WorktreesRootWtBT_unitB>> as WorktreesRootWtBT_unitB
    rectangle "==frontend-ui (RECIPE-14)\\n\\nWhat's inside the ticket:title:    SearchBar + live results list\\nlabel:    frontend-ui          agent: frontend\\ncategory: frontend-ux\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-13Brief: debounce, empty-state copy, highlight matches with the shared component system." <<WorktreesRootWtBT_frontB>> as WorktreesRootWtBT_frontB
    rectangle "==feature-test (RECIPE-15)\\n\\nWhat's inside the ticket:title:    the search pieces are wired\\nlabel:    feature-test         agent: tester-feature (respawn)\\ncategory: feature-test\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-14 (the LAST task)\\nskill:    framework-playwright" <<WorktreesRootWtBT_ftestB>> as WorktreesRootWtBT_ftestB
    rectangle "==feature-review (RECIPE-16)\\n\\nWhat's inside the ticket:title:    the three questions over feature/search-recipes\\nlabel:    feature-review       agent: review (respawn)\\ncategory: review\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-15\\nskill:    pr-comments" <<WorktreesRootWtBT_frevB>> as WorktreesRootWtBT_frevB
  }
}

WorktreesRootWtEpicMergeRun .[#5d2cb2,thickness=2].> WorktreesRootWtEpicT_merge : <color:#5d2cb2>works — assemble
WorktreesRootWtEpicE2eRun .[#5d2cb2,thickness=2].> WorktreesRootWtEpicT_e2e : <color:#5d2cb2>works — journeys
WorktreesRootWtEpicEpicReviewRun .[#5d2cb2,thickness=2].> WorktreesRootWtEpicT_epicReview : <color:#5d2cb2>works — PR comments
WorktreesRootWtEpicT_merge .[#505660,thickness=2].> WorktreesRootWtEpicT_e2e
WorktreesRootWtEpicT_e2e .[#505660,thickness=2].> WorktreesRootWtEpicT_epicReview
WorktreesRootWtAEngA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_backendA : <color:#5d2cb2>works — one commit
WorktreesRootWtAUnitA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_unitA : <color:#5d2cb2>works — test commit
WorktreesRootWtAFeA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_frontA : <color:#5d2cb2>works — UI commit
WorktreesRootWtAFtA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_ftestA : <color:#5d2cb2>works — suite
WorktreesRootWtARevA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_frevA : <color:#5d2cb2>works — PR comments
WorktreesRootWtAT_backendA .[#505660,thickness=2].> WorktreesRootWtAT_unitA
WorktreesRootWtAT_unitA .[#505660,thickness=2].> WorktreesRootWtAT_frontA
WorktreesRootWtAT_frontA .[#505660,thickness=2].> WorktreesRootWtAT_ftestA
WorktreesRootWtAT_ftestA .[#505660,thickness=2].> WorktreesRootWtAT_frevA
WorktreesRootWtBEngB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_backendB : <color:#5d2cb2>works — one commit
WorktreesRootWtBUnitB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_unitB : <color:#5d2cb2>works — test commit
WorktreesRootWtBFeB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_frontB : <color:#5d2cb2>works — UI commit
WorktreesRootWtBFtB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_ftestB : <color:#5d2cb2>works — suite
WorktreesRootWtBRevB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_frevB : <color:#5d2cb2>works — PR comments
WorktreesRootWtBT_backendB .[#505660,thickness=2].> WorktreesRootWtBT_unitB
WorktreesRootWtBT_unitB .[#505660,thickness=2].> WorktreesRootWtBT_frontB
WorktreesRootWtBT_frontB .[#505660,thickness=2].> WorktreesRootWtBT_ftestB
WorktreesRootWtBT_ftestB .[#505660,thickness=2].> WorktreesRootWtBT_frevB
@enduml
`;case`planTower`:return`@startuml
title "1. Plan the tower, top-down"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<Human>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<PlanAgentsPlanEpic>>{
  BackgroundColor #0891B2
  FontColor #ffffff
  BorderColor #006c8c
}
skinparam database<<Beads>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<PlanAgentsPlanFeature>>{
  BackgroundColor #0891B2
  FontColor #ffffff
  BorderColor #006c8c
}
skinparam rectangle<<PlanAgentsPlanTask>>{
  BackgroundColor #0891B2
  FontColor #ffffff
  BorderColor #006c8c
}
skinparam component<<Dispatcher>>{
  BackgroundColor #2563EB
  FontColor #f1ffff
  BorderColor #0042c2
}
person "==Human (Brodie)\\n\\nWhat it is: the only one who closes gates. Workers leave their tickets open and report in their final message; the human reads the report, verifies the branch, and closes. A claimable ticket assigned to a human is a model bug — the person enters through gates and closes them; nothing is spawned for them." <<Human>> as Human
rectangle "==plan-epic\\n\\nWhat it is: conversational epic architect — vague idea → clarifying questions → research → exactly one epic gate plus epic-merge-pr, epic-e2e-test, epic-review. Writes the gate's own branch (epic/recipe-box) onto the gate and its three tickets as their only metadata key." <<PlanAgentsPlanEpic>> as PlanAgentsPlanEpic
database "==beads DB (bd)\\n\\nWhat it is: the beads issue database — the loop's only runtime input. None of the contract docs are read at runtime; the graph lives here.Verbs the tower uses: bd ready --claim (atomic — a bare bd ready would let two loops steal the same ticket), bd unclaim, bd heartbeat, bd create -t gate -l <label> --parent <id>, bd dep add <a> <b> --type blocks, bd update --set-metadata (merges — it never disturbs the plan's branch), bd show --json." <<Beads>> as Beads
rectangle "==plan-feature\\n\\nWhat it is: breaks an epic into feature-sized features — complete user-facing flows — each with its own feature/<slug> branch, its feature-test and feature-review tickets, phased by dependency. parent-child to the epic. Never writes a pr, never writes a PR base." <<PlanAgentsPlanFeature>> as PlanAgentsPlanFeature
rectangle "==plan-task\\n\\nWhat it is: breaks ONE feature into tasks, each parent-child to the feature, labeled at creation with bd create -l <label>, the feature's branch copied verbatim (a plan agent never invents a branch below its own tier), chained onto their predecessor, every ticket verified with a bd show --json round trip." <<PlanAgentsPlanTask>> as PlanAgentsPlanTask
component "==bo loop — the dispatcher\\n\\nWhat it is: CLI/beads-loop.sh — the one command (bo loop) that turns beads tickets into background workers.Steps it runs, one per tick:reads the branches already at work (branchesCurrentlyAtWork)claims a ticket atomically with bd ready --claimmatches its single dispatching label against the AGENT map — never guesses a specialistreads branch and parent off the claim; never invents a branchwalks the parent chain to the epic gate and publishes its branch + PR if missing (ensureEpicGatePr)makes sure the branch's worktree exists (ensureWorktree)spawns claude --bg --agent <agent> --permission-mode bypassPermissions with cwd inside that worktreelogs one line and moves on — it never polls a worker, never reaps, never merges" <<Dispatcher>> as Dispatcher

Human .[#8D8D8D,thickness=2].> PlanAgentsPlanEpic : <color:#8D8D8D>'a recipe box app' — one vague idea
PlanAgentsPlanEpic .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>clarify, research, then create exactly one epic gate + merge / e2e / review tickets
Human .[#8D8D8D,thickness=2].> PlanAgentsPlanFeature : <color:#8D8D8D>plan the features for RECIPE-1
PlanAgentsPlanFeature .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>RECIPE-5 feature/add-recipe and RECIPE-11 feature/search-recipes, each with feature-test and feature-review
Human .[#8D8D8D,thickness=2].> PlanAgentsPlanTask : <color:#8D8D8D>plan the tasks for RECIPE-5
PlanAgentsPlanTask .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>RECIPE-6, RECIPE-7, RECIPE-8, chained one to the next
Human .[#8D8D8D,thickness=2].> Dispatcher : <color:#8D8D8D>bo loop — and the tower starts walking itself
@enduml
`;case`tickWalkthrough`:return`@startuml
title "2. One tick of bo loop"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam component<<Dispatcher>>{
  BackgroundColor #2563EB
  FontColor #f1ffff
  BorderColor #0042c2
}
skinparam database<<Beads>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<WorkersEngineer>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<ErrorsLabelAmbiguous>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsMetadataMissing>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<TowerEpic>>{
  BackgroundColor #D97706
  FontColor #ffffff
  BorderColor #ac5300
}
skinparam rectangle<<ErrorsBranchBusy>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam database<<Origin>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<ErrorsEpicPrFailed>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsWorktreeFailed>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsWorkerNotDispatched>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
component "==bo loop — the dispatcher\\n\\nWhat it is: CLI/beads-loop.sh — the one command (bo loop) that turns beads tickets into background workers.Steps it runs, one per tick:reads the branches already at work (branchesCurrentlyAtWork)claims a ticket atomically with bd ready --claimmatches its single dispatching label against the AGENT map — never guesses a specialistreads branch and parent off the claim; never invents a branchwalks the parent chain to the epic gate and publishes its branch + PR if missing (ensureEpicGatePr)makes sure the branch's worktree exists (ensureWorktree)spawns claude --bg --agent <agent> --permission-mode bypassPermissions with cwd inside that worktreelogs one line and moves on — it never polls a worker, never reaps, never merges" <<Dispatcher>> as Dispatcher
database "==beads DB (bd)\\n\\nWhat it is: the beads issue database — the loop's only runtime input. None of the contract docs are read at runtime; the graph lives here.Verbs the tower uses: bd ready --claim (atomic — a bare bd ready would let two loops steal the same ticket), bd unclaim, bd heartbeat, bd create -t gate -l <label> --parent <id>, bd dep add <a> <b> --type blocks, bd update --set-metadata (merges — it never disturbs the plan's branch), bd show --json." <<Beads>> as Beads
rectangle "==engineer\\n\\nWhat it is: the back-end worker — business logic, endpoints, hooks, types, error factories. Spawned s b w, certified by respawn. Never writes tests, JSX, or CSS. Dispatched by the label backend-logic." <<WorkersEngineer>> as WorkersEngineer
rectangle "==ERROR reason=label-ambiguous\\n\\nWhat it is: zero or two dispatching labels on a claim. The dispatcher never guesses a specialist — the ticket is LEFT CLAIMED so its lease parks it off the frontier, and the errors file is the alarm." <<ErrorsLabelAmbiguous>> as ErrorsLabelAmbiguous
rectangle "==ERROR reason=metadata-missing\\n\\nWhat it is: no branch in the claim's metadata — a plan agent skipped its one key. Left claimed, same treatment as a mislabelled ticket. The loop never invents a branch." <<ErrorsMetadataMissing>> as ErrorsMetadataMissing
rectangle "==Epic — Recipe Box (RECIPE-1)\\n\\nWhat it is: the epic gate — the "what"; the human closes it once, after epic-review is done.Branch: epic/recipe-box → PR → main (the loop publishes it and writes pr as its metadata)Waits on: RECIPE-4 epic-review — the gate-waits-on-its-child edge lives in bd, invisible to this mapNothing but the loop ever publishes this branch. Every feature PR below it targets it." <<TowerEpic>> as TowerEpic
rectangle "==ERROR reason=branch_busy held=N\\n\\nWhat it is: tickets exist and are claimable, but every branch they want is already working. The freshly claimed ticket goes straight back (bd unclaim) and the tick tries the next one — up to max_parallel + 2 claims per tick. One pair of hands per branch." <<ErrorsBranchBusy>> as ErrorsBranchBusy
database "==origin — GitHub\\n\\nWhat it is: the remote the tower publishes to. main at the bottom, one PR per branch above it: feature/<slug> → PR → the epic branch, epic/<slug> → PR → main." <<Origin>> as Origin
rectangle "==ERROR reason=epic-pr-failed step=…\\n\\nWhat it is: the epic branch or its PR could not be published. Steps: walk, gate-branch, forge, missing-tool, push, pr, annotate. Left claimed — a worker spawned under an epic branch that does not exist burns a slot and files a commit nobody can pull." <<ErrorsEpicPrFailed>> as ErrorsEpicPrFailed
rectangle "==ERROR reason=worktree-failed\\n\\nWhat it is: git worktree add failed under .claude/worktrees/. Left claimed — a worker spawned in a missing folder burns a slot on nothing." <<ErrorsWorktreeFailed>> as ErrorsWorktreeFailed
rectangle "==ERROR reason=worker-not-dispatched\\n\\nWhat it is: claude --bg spawned no session. The ticket is put back with bd unclaim so the next tick can retry it." <<ErrorsWorkerNotDispatched>> as ErrorsWorkerNotDispatched

Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>probe the frontier: bd list --status open,blocked --limit 0
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>bd ready --claim (atomic — a bare bd ready would let two loops steal the ticket)
Dispatcher .[#1c4ab0,thickness=2].> WorkersEngineer : <color:#1c4ab0>AGENT[backend-logic] = engineer
Dispatcher .[#a51d1d,thickness=2].> ErrorsLabelAmbiguous : <color:#a51d1d>never guesses a specialist
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>leave it CLAIMED — the lease parks it off the frontier
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>BO_BRANCH = feature/add-recipe — read off the claim, nothing re-derives it, nothing parses text
Dispatcher .[#a51d1d,thickness=2].> ErrorsMetadataMissing : <color:#a51d1d>ERROR reason=metadata-missing — left claimed
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>branchesCurrentlyAtWork()
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>bd unclaim RECIPE-6
Dispatcher .[#a51d1d,thickness=2].> ErrorsBranchBusy : <color:#a51d1d>one pair of hands per branch; try the next claim, max max_parallel + 2 per tick
Dispatcher .[#8D8D8D,thickness=2].> TowerEpic : <color:#8D8D8D>walk RECIPE-5 to RECIPE-1 (epicGateOf, two hops at most) — read the PR base off the gate
Dispatcher .[#8D8D8D,thickness=2].> Origin : <color:#8D8D8D>ensureEpicGatePr — the gate has no pr: push epic/recipe-box off main, open the PR
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>bd update RECIPE-1 --set-metadata pr=https://github.com/…/pull/1 (merges — never disturbs branch)
Dispatcher .[#a51d1d,thickness=2].> ErrorsEpicPrFailed : <color:#a51d1d>left claimed — a worker under a nonexistent epic branch burns a slot; steps: walk, gate-branch, forge, missing-tool, push, pr, annotate
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>ensureWorktree — git worktree add .claude/worktrees/feature+add-recipe origin/feature/add-recipe
Dispatcher .[#a51d1d,thickness=2].> ErrorsWorktreeFailed : <color:#a51d1d>ERROR reason=worktree-failed — left claimed
Dispatcher .[#1c4ab0,thickness=2].> WorkersEngineer : <color:#1c4ab0>claude --bg --agent engineer --permission-mode bypassPermissions (cwd INSIDE the worktree)
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>bd unclaim RECIPE-6
Dispatcher .[#a51d1d,thickness=2].> ErrorsWorkerNotDispatched : <color:#a51d1d>ERROR reason=worker-not-dispatched
Dispatcher .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>log one line, move on — the loop polls nothing, reaps nothing, merges nothing, ends nothing
@enduml
`;case`workerToGate`:return`@startuml
title "3. Worker, Stop hook, gate"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<WorkersEngineer>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam database<<Beads>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam component<<Hook>>{
  BackgroundColor #0E7490
  FontColor #ceffff
  BorderColor #00516b
}
skinparam rectangle<<ErrorsNotDeclaredDone>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<WorkersReviewAgent>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam database<<Origin>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<ErrorsNoPrTarget>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam component<<Dispatcher>>{
  BackgroundColor #2563EB
  FontColor #f1ffff
  BorderColor #0042c2
}
skinparam rectangle<<WorkersTesterUnit>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam person<<Human>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<TowerEpicFeatA>>{
  BackgroundColor #D97706
  FontColor #ffffff
  BorderColor #ac5300
}
skinparam rectangle<<TowerEpicFeatB>>{
  BackgroundColor #D97706
  FontColor #ffffff
  BorderColor #ac5300
}
rectangle "==engineer\\n\\nWhat it is: the back-end worker — business logic, endpoints, hooks, types, error factories. Spawned s b w, certified by respawn. Never writes tests, JSX, or CSS. Dispatched by the label backend-logic." <<WorkersEngineer>> as WorkersEngineer
database "==beads DB (bd)\\n\\nWhat it is: the beads issue database — the loop's only runtime input. None of the contract docs are read at runtime; the graph lives here.Verbs the tower uses: bd ready --claim (atomic — a bare bd ready would let two loops steal the same ticket), bd unclaim, bd heartbeat, bd create -t gate -l <label> --parent <id>, bd dep add <a> <b> --type blocks, bd update --set-metadata (merges — it never disturbs the plan's branch), bd show --json." <<Beads>> as Beads
component "==hooks/worker-stop.sh — the Stop hook\\n\\nWhat it is: the fail-closed gatekeeper that fires when a worker session stops.Steps:checks $BO_DONE_FILE — no marker, no commit, no push, no PR, no close (ERROR reason=not-declared-done)commits the work onto the ticket's branch and pushes itopens the PR once per branch (base = the epic gate's branch, main at the epic tier) or reuses itwrites the PR url onto the ticket as metadata.prIt closes a task only on its done marker. A worker that touches the marker before the brief is complete has filed half a task onto a shared branch — the one failure this model cannot undo on its own." <<Hook>> as Hook
rectangle "==ERROR reason=not-declared-done\\n\\nWhat it is: the Stop hook fired but $BO_DONE_FILE was never touched. Fail-closed: no commit, no push, no PR, no close. The ticket stays claimed so its lease parks it off the frontier and every task chained behind it waits." <<ErrorsNotDeclaredDone>> as ErrorsNotDeclaredDone
rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorkersReviewAgent>> as WorkersReviewAgent
database "==origin — GitHub\\n\\nWhat it is: the remote the tower publishes to. main at the bottom, one PR per branch above it: feature/<slug> → PR → the epic branch, epic/<slug> → PR → main." <<Origin>> as Origin
rectangle "==ERROR reason=no-pr-target\\n\\nWhat it is: the Stop hook found no PR target the loop never handed down — named for the target, since pr now means the url." <<ErrorsNoPrTarget>> as ErrorsNoPrTarget
component "==bo loop — the dispatcher\\n\\nWhat it is: CLI/beads-loop.sh — the one command (bo loop) that turns beads tickets into background workers.Steps it runs, one per tick:reads the branches already at work (branchesCurrentlyAtWork)claims a ticket atomically with bd ready --claimmatches its single dispatching label against the AGENT map — never guesses a specialistreads branch and parent off the claim; never invents a branchwalks the parent chain to the epic gate and publishes its branch + PR if missing (ensureEpicGatePr)makes sure the branch's worktree exists (ensureWorktree)spawns claude --bg --agent <agent> --permission-mode bypassPermissions with cwd inside that worktreelogs one line and moves on — it never polls a worker, never reaps, never merges" <<Dispatcher>> as Dispatcher
rectangle "==tester-unit\\n<size:10>[Flask]</size>\\n\\nWhat it is: the micro tier — one back-end function alone; every branch, boundary, empty/null, error. Never a component (the UI is proved by the composition tier). Label unit-tests, framework skill framework-jest." <<WorkersTesterUnit>> as WorkersTesterUnit
person "==Human (Brodie)\\n\\nWhat it is: the only one who closes gates. Workers leave their tickets open and report in their final message; the human reads the report, verifies the branch, and closes. A claimable ticket assigned to a human is a model bug — the person enters through gates and closes them; nothing is spawned for them." <<Human>> as Human
rectangle "==Feature — Add a Recipe (RECIPE-5)\\n\\nWhat it is: the feature gate for one complete user-facing flow: a user writes a recipe and sees it in the box. Human closes it once feature-review is done.Branch: feature/add-recipe → PR → epic/recipe-box (base read off the epic gate, never copied down)Waits on: RECIPE-10 feature-review (edge lives in bd; a gate never blocks its own children — they are claimable while it is open)The loop wrote pr onto the ticket that first landed work here." <<TowerEpicFeatA>> as TowerEpicFeatA
rectangle "==Feature — Search the Box (RECIPE-11)\\n\\nWhat it is: the feature gate for one complete user-facing flow: a user searches saved recipes by title and ingredient. Human closes it once its review is done.Branch: feature/search-recipes → PR → epic/recipe-boxWaits on: RECIPE-16 feature-review (edge lives in bd)Runs side by side with Add a Recipe — two features in parallel, each feature alone on its branch." <<TowerEpicFeatB>> as TowerEpicFeatB

WorkersEngineer .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>bd heartbeat RECIPE-6 — keep the lease alive
WorkersEngineer .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>writes src/recipes/validate-recipe.ts in the worktree — never commits, never branches
WorkersEngineer .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>final action: touch $BO_DONE_FILE — only if the brief is genuinely complete
Hook .[#8D8D8D,thickness=2].> WorkersEngineer : <color:#8D8D8D>Stop fires
Hook .[#a51d1d,thickness=2].> ErrorsNotDeclaredDone : <color:#a51d1d>ERROR reason=not-declared-done — fail-closed
Hook .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>RECIPE-6 stays claimed; RECIPE-7 chained behind it waits
Hook .[#8D8D8D,thickness=2].> Origin : <color:#8D8D8D>commit RECIPE-6 onto feature/add-recipe, push, open PR base epic/recipe-box — once per branch, reused after
Hook .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>write metadata pr=… onto RECIPE-6, close the task
Hook .[#a51d1d,thickness=2].> ErrorsNoPrTarget : <color:#a51d1d>ERROR reason=no-pr-target — named for the target, since pr now means the url
Hook .[#8D8D8D,thickness=2].> Dispatcher : <color:#8D8D8D>the line opens one ticket: RECIPE-7 becomes the frontier
Dispatcher .[#1c4ab0,thickness=2].> WorkersTesterUnit : <color:#1c4ab0>AGENT[unit-tests] = tester-unit — respawn means a fresh session of the SAME agent re-checks inside the one ticket
WorkersTesterUnit .[#8D8D8D,thickness=2].> Beads : <color:#8D8D8D>covers every branch of validateRecipe (framework-jest), commits onto feature/add-recipe via the hook
WorkersReviewAgent .[#8D8D8D,thickness=2].> Origin : <color:#8D8D8D>feature-review: maps entry to exit, trace logs, tests against the instrumented code, findings as PR comments
Human .[#a35905,thickness=2].> TowerEpicFeatA : <color:#a35905>reads the report, verifies the flow, closes RECIPE-5 — only a human closes a gate
Human .[#a35905,thickness=2].> TowerEpicFeatB : <color:#a35905>verify, close RECIPE-11
@enduml
`;case`epicTier`:return`@startuml
title "4. The epic tier assembles"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam component<<Dispatcher>>{
  BackgroundColor #2563EB
  FontColor #f1ffff
  BorderColor #0042c2
}
skinparam rectangle<<WorkersMergeAgent>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam database<<Origin>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<WorkersTesterE2e>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorkersReviewAgent>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam person<<Human>>{
  BackgroundColor #6B7280
  FontColor #ffffff
  BorderColor #484f5c
}
skinparam rectangle<<TowerEpic>>{
  BackgroundColor #D97706
  FontColor #ffffff
  BorderColor #ac5300
}
component "==bo loop — the dispatcher\\n\\nWhat it is: CLI/beads-loop.sh — the one command (bo loop) that turns beads tickets into background workers.Steps it runs, one per tick:reads the branches already at work (branchesCurrentlyAtWork)claims a ticket atomically with bd ready --claimmatches its single dispatching label against the AGENT map — never guesses a specialistreads branch and parent off the claim; never invents a branchwalks the parent chain to the epic gate and publishes its branch + PR if missing (ensureEpicGatePr)makes sure the branch's worktree exists (ensureWorktree)spawns claude --bg --agent <agent> --permission-mode bypassPermissions with cwd inside that worktreelogs one line and moves on — it never polls a worker, never reaps, never merges" <<Dispatcher>> as Dispatcher
rectangle "==merge\\n\\nWhat it is: the epic-tier assembler — reads the feature branches off the feature gates, assembles them onto the epic branch in its own worktree, resolves the conflicts between them, runs the tests, reports. Writes no code, no tests; never merges into main, never opens a PR. Label epic-merge-pr." <<WorkersMergeAgent>> as WorkersMergeAgent
database "==origin — GitHub\\n\\nWhat it is: the remote the tower publishes to. main at the bottom, one PR per branch above it: feature/<slug> → PR → the epic branch, epic/<slug> → PR → main." <<Origin>> as Origin
rectangle "==tester-e2e\\n<size:10>[Flask]</size>\\n\\nWhat it is: the broad tier — journeys across features on the real stack; cross-feature state; one success + one failure per feature. Label epic-e2e-test, skill framework-playwright." <<WorkersTesterE2e>> as WorkersTesterE2e
rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorkersReviewAgent>> as WorkersReviewAgent
person "==Human (Brodie)\\n\\nWhat it is: the only one who closes gates. Workers leave their tickets open and report in their final message; the human reads the report, verifies the branch, and closes. A claimable ticket assigned to a human is a model bug — the person enters through gates and closes them; nothing is spawned for them." <<Human>> as Human
rectangle "==Epic — Recipe Box (RECIPE-1)\\n\\nWhat it is: the epic gate — the "what"; the human closes it once, after epic-review is done.Branch: epic/recipe-box → PR → main (the loop publishes it and writes pr as its metadata)Waits on: RECIPE-4 epic-review — the gate-waits-on-its-child edge lives in bd, invisible to this mapNothing but the loop ever publishes this branch. Every feature PR below it targets it." <<TowerEpic>> as TowerEpic

Dispatcher .[#1c4ab0,thickness=2].> WorkersMergeAgent : <color:#1c4ab0>RECIPE-2 epic-merge-pr is on the frontier — dispatched like any other stamp
WorkersMergeAgent .[#8D8D8D,thickness=2].> Origin : <color:#8D8D8D>read the feature branches off the gates, assemble onto epic/recipe-box, resolve the conflicts, run the tests, report
Dispatcher .[#1c4ab0,thickness=2].> WorkersTesterE2e : <color:#1c4ab0>RECIPE-3 epic-e2e-test — journeys on the real stack
Dispatcher .[#1c4ab0,thickness=2].> WorkersReviewAgent : <color:#1c4ab0>RECIPE-4 epic-review — three questions from first principles
Human .[#a35905,thickness=2].> TowerEpic : <color:#a35905>verify, close the epic gate — thumbs-up on the merged PR into main
@enduml
`;case`stageBackends`:return`@startuml
title "5. Stage — back end, two branches at once"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<WorktreesRootWtAEngA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBEngB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAT_backendA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_backendB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
rectangle "feature+add-recipe → feature/add-recipe" <<WorktreesRootWtA>> as WorktreesRootWtA {
  skinparam RectangleBorderColor<<WorktreesRootWtA>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtA>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtA>> dashed

  rectangle "==engineer\\n\\nWhat it is: the back-end worker — business logic, endpoints, hooks, types, error factories. Spawned s b w, certified by respawn. Never writes tests, JSX, or CSS. Dispatched by the label backend-logic." <<WorktreesRootWtAEngA>> as WorktreesRootWtAEngA
  rectangle "==backend-logic (RECIPE-6)\\n\\nWhat's inside the ticket:title:    validateRecipe + saveRecipe — pure functions\\nlabel:    backend-logic        agent: engineer\\ncategory: backend-logic\\nmetadata: { "branch": "feature/add-recipe" }   ← copied verbatim from the feature gate\\ndepends:  none (first task — it is the frontier)RequirementsvalidateRecipe(input): Either<RecipeValidationError, Recipe> — pure, no mutationsaveRecipe(validated): RecipeRecord through the repository port onlyreject: empty title, title > 120 chars, duplicate slug, missing ingredientsFiles: src/recipes/validate-recipe.ts, src/recipes/types.ts, src/recipes/ports.ts\\nDone: report in the final message; the Stop hook, not you, files it." <<WorktreesRootWtAT_backendA>> as WorktreesRootWtAT_backendA
}
rectangle "feature+search-recipes → feature/search-recipes" <<WorktreesRootWtB>> as WorktreesRootWtB {
  skinparam RectangleBorderColor<<WorktreesRootWtB>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtB>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtB>> dashed

  rectangle "==engineer\\n\\nWhat it is: the back-end worker — business logic, endpoints, hooks, types, error factories. Spawned s b w, certified by respawn. Never writes tests, JSX, or CSS. Dispatched by the label backend-logic." <<WorktreesRootWtBEngB>> as WorktreesRootWtBEngB
  rectangle "==backend-logic (RECIPE-12)\\n\\nWhat's inside the ticket:title:    searchRecipes — pure filter over the repository port\\nlabel:    backend-logic        agent: engineer\\ncategory: backend-logic\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  none (first task — with Add a Recipe, it is the frontier; claimed together)RequirementssearchRecipes(query, records): Recipe[] — pure, deterministic orderempty query returns all, sorted newest first; whitespace trimmedno match returns [], never an errorFiles: src/recipes/search-recipes.ts, src/recipes/ports.ts (read side)" <<WorktreesRootWtBT_backendB>> as WorktreesRootWtBT_backendB
}

WorktreesRootWtAEngA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_backendA : <color:#5d2cb2>works — one commit
WorktreesRootWtBEngB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_backendB : <color:#5d2cb2>works — one commit
@enduml
`;case`stageUnits`:return`@startuml
title "6. Stage — the micro tier follows its back end"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<WorktreesRootWtAUnitA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBUnitB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAT_unitA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_unitB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
rectangle "feature+add-recipe → feature/add-recipe" <<WorktreesRootWtA>> as WorktreesRootWtA {
  skinparam RectangleBorderColor<<WorktreesRootWtA>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtA>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtA>> dashed

  rectangle "==tester-unit\\n<size:10>[Flask]</size>\\n\\nWhat it is: the micro tier — one back-end function alone; every branch, boundary, empty/null, error. Never a component (the UI is proved by the composition tier). Label unit-tests, framework skill framework-jest." <<WorktreesRootWtAUnitA>> as WorktreesRootWtAUnitA
  rectangle "==unit-tests (RECIPE-7)\\n\\nWhat's inside the ticket:title:    exhaustive coverage for validateRecipe\\nlabel:    unit-tests           agent: tester-unit (respawn)\\ncategory: unit-tests\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-6 (the back-end ticket it tests)\\nskill:    framework-jestCover: every branch, every boundary (120/121 chars), empty/null input, each error it throws, empty ingredients list.\\nOwned elsewhere: composition wiring (feature tier), components (never here), journeys (epic tier)." <<WorktreesRootWtAT_unitA>> as WorktreesRootWtAT_unitA
}
rectangle "feature+search-recipes → feature/search-recipes" <<WorktreesRootWtB>> as WorktreesRootWtB {
  skinparam RectangleBorderColor<<WorktreesRootWtB>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtB>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtB>> dashed

  rectangle "==tester-unit\\n<size:10>[Flask]</size>\\n\\nWhat it is: the micro tier — one back-end function alone; every branch, boundary, empty/null, error. Never a component (the UI is proved by the composition tier). Label unit-tests, framework skill framework-jest." <<WorktreesRootWtBUnitB>> as WorktreesRootWtBUnitB
  rectangle "==unit-tests (RECIPE-13)\\n\\nWhat's inside the ticket:title:    exhaustive coverage for searchRecipes\\nlabel:    unit-tests           agent: tester-unit (respawn)\\ncategory: unit-tests\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-12\\nskill:    framework-jestCover: empty query, whitespace, unicode titles, empty store, tie-break ordering, case folding." <<WorktreesRootWtBT_unitB>> as WorktreesRootWtBT_unitB
}

WorktreesRootWtAUnitA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_unitA : <color:#5d2cb2>works — test commit
WorktreesRootWtBUnitB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_unitB : <color:#5d2cb2>works — test commit
@enduml
`;case`stageFrontends`:return`@startuml
title "7. Stage — the UI, last in the line"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<WorktreesRootWtAFeA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBFeB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAT_frontA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_frontB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
rectangle "feature+add-recipe → feature/add-recipe" <<WorktreesRootWtA>> as WorktreesRootWtA {
  skinparam RectangleBorderColor<<WorktreesRootWtA>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtA>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtA>> dashed

  rectangle "==frontend\\n\\nWhat it is: the UI worker — components, layout, styling, the shared component system. Built last, against functions already proved. Label frontend-ui." <<WorktreesRootWtAFeA>> as WorktreesRootWtAFeA
  rectangle "==frontend-ui (RECIPE-8)\\n\\nWhat's inside the ticket:title:    RecipeForm + RecipeCard against proved functions\\nlabel:    frontend-ui          agent: frontend\\ncategory: frontend-ux\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-7Brief: the form, validation feedback surfacing each RecipeValidationError, the card in the box. Layout and styling only — the logic is already proved by the micro tier." <<WorktreesRootWtAT_frontA>> as WorktreesRootWtAT_frontA
}
rectangle "feature+search-recipes → feature/search-recipes" <<WorktreesRootWtB>> as WorktreesRootWtB {
  skinparam RectangleBorderColor<<WorktreesRootWtB>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtB>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtB>> dashed

  rectangle "==frontend\\n\\nWhat it is: the UI worker — components, layout, styling, the shared component system. Built last, against functions already proved. Label frontend-ui." <<WorktreesRootWtBFeB>> as WorktreesRootWtBFeB
  rectangle "==frontend-ui (RECIPE-14)\\n\\nWhat's inside the ticket:title:    SearchBar + live results list\\nlabel:    frontend-ui          agent: frontend\\ncategory: frontend-ux\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-13Brief: debounce, empty-state copy, highlight matches with the shared component system." <<WorktreesRootWtBT_frontB>> as WorktreesRootWtBT_frontB
}

WorktreesRootWtAFeA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_frontA : <color:#5d2cb2>works — UI commit
WorktreesRootWtBFeB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_frontB : <color:#5d2cb2>works — UI commit
@enduml
`;case`stageFeatureTier`:return`@startuml
title "8. Stage — suite, then review, on the whole feature"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<WorktreesRootWtAFtA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtARevA>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBFtB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtBRevB>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtAT_ftestA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_ftestB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtAT_frevA>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtBT_frevB>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
rectangle "feature+add-recipe → feature/add-recipe" <<WorktreesRootWtA>> as WorktreesRootWtA {
  skinparam RectangleBorderColor<<WorktreesRootWtA>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtA>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtA>> dashed

  rectangle "==tester-feature\\n<size:10>[Flask]</size>\\n\\nWhat it is: the composition tier — one feature's pieces proved wired; its errors and successes surface. Never re-runs the unit tier's edge-case matrix. Label feature-test, skill framework-playwright." <<WorktreesRootWtAFtA>> as WorktreesRootWtAFtA
  rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorktreesRootWtARevA>> as WorktreesRootWtARevA
  rectangle "==feature-test (RECIPE-9)\\n\\nWhat's inside the ticket:title:    the add-recipe pieces are wired\\nlabel:    feature-test         agent: tester-feature (respawn)\\ncategory: feature-test\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-8 (the LAST task — nothing is proved against half a feature)\\nskill:    framework-playwrightCover: the composed flow saves a recipe; each encapsulated error surfaces to the user. The suite runs only after every task landed on the feature branch." <<WorktreesRootWtAT_ftestA>> as WorktreesRootWtAT_ftestA
  rectangle "==feature-review (RECIPE-10)\\n\\nWhat's inside the ticket:title:    the three questions over feature/add-recipe\\nlabel:    feature-review       agent: review (respawn)\\ncategory: review\\nmetadata: { "branch": "feature/add-recipe" }\\ndepends:  blocked-by RECIPE-9 (no review before the suite)\\nskill:    pr-commentsBrief: three questions from first principles, findings as PR comments. Then the human verifies and closes gate RECIPE-5." <<WorktreesRootWtAT_frevA>> as WorktreesRootWtAT_frevA
}
rectangle "feature+search-recipes → feature/search-recipes" <<WorktreesRootWtB>> as WorktreesRootWtB {
  skinparam RectangleBorderColor<<WorktreesRootWtB>> #059669
  skinparam RectangleFontColor<<WorktreesRootWtB>> #059669
  skinparam RectangleBorderStyle<<WorktreesRootWtB>> dashed

  rectangle "==tester-feature\\n<size:10>[Flask]</size>\\n\\nWhat it is: the composition tier — one feature's pieces proved wired; its errors and successes surface. Never re-runs the unit tier's edge-case matrix. Label feature-test, skill framework-playwright." <<WorktreesRootWtBFtB>> as WorktreesRootWtBFtB
  rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorktreesRootWtBRevB>> as WorktreesRootWtBRevB
  rectangle "==feature-test (RECIPE-15)\\n\\nWhat's inside the ticket:title:    the search pieces are wired\\nlabel:    feature-test         agent: tester-feature (respawn)\\ncategory: feature-test\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-14 (the LAST task)\\nskill:    framework-playwright" <<WorktreesRootWtBT_ftestB>> as WorktreesRootWtBT_ftestB
  rectangle "==feature-review (RECIPE-16)\\n\\nWhat's inside the ticket:title:    the three questions over feature/search-recipes\\nlabel:    feature-review       agent: review (respawn)\\ncategory: review\\nmetadata: { "branch": "feature/search-recipes" }\\ndepends:  blocked-by RECIPE-15\\nskill:    pr-comments" <<WorktreesRootWtBT_frevB>> as WorktreesRootWtBT_frevB
}

WorktreesRootWtAFtA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_ftestA : <color:#5d2cb2>works — suite
WorktreesRootWtAT_ftestA .[#505660,thickness=2].> WorktreesRootWtAT_frevA
WorktreesRootWtARevA .[#5d2cb2,thickness=2].> WorktreesRootWtAT_frevA : <color:#5d2cb2>works — PR comments
WorktreesRootWtBFtB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_ftestB : <color:#5d2cb2>works — suite
WorktreesRootWtBT_ftestB .[#505660,thickness=2].> WorktreesRootWtBT_frevB
WorktreesRootWtBRevB .[#5d2cb2,thickness=2].> WorktreesRootWtBT_frevB : <color:#5d2cb2>works — PR comments
@enduml
`;case`stageEpicTier`:return`@startuml
title "9. Stage — the epic tier, in its own box"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<WorktreesRootWtEpicMergeRun>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtEpicE2eRun>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtEpicEpicReviewRun>>{
  BackgroundColor #7C3AED
  FontColor #ffffff
  BorderColor #4e0cc3
}
skinparam rectangle<<WorktreesRootWtEpicT_merge>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtEpicT_e2e>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
skinparam rectangle<<WorktreesRootWtEpicT_epicReview>>{
  BackgroundColor #64748B
  FontColor #ffffff
  BorderColor #415167
}
rectangle "==merge\\n\\nWhat it is: the epic-tier assembler — reads the feature branches off the feature gates, assembles them onto the epic branch in its own worktree, resolves the conflicts between them, runs the tests, reports. Writes no code, no tests; never merges into main, never opens a PR. Label epic-merge-pr." <<WorktreesRootWtEpicMergeRun>> as WorktreesRootWtEpicMergeRun
rectangle "==tester-e2e\\n<size:10>[Flask]</size>\\n\\nWhat it is: the broad tier — journeys across features on the real stack; cross-feature state; one success + one failure per feature. Label epic-e2e-test, skill framework-playwright." <<WorktreesRootWtEpicE2eRun>> as WorktreesRootWtEpicE2eRun
rectangle "==review\\n\\nWhat it is: the reviewer — three questions from first principles: does the code do what its source of truth demands, do the tests prove it, is it simple and readable. Maps the system (entry → exit, following imports), instruments it with trace logs, runs the tests against the instrumented code, posts findings as PR comments. Files no tickets; commits and pushes nothing. Labels feature-review and epic-review." <<WorktreesRootWtEpicEpicReviewRun>> as WorktreesRootWtEpicEpicReviewRun
rectangle "==epic-merge-pr (RECIPE-2)\\n\\nWhat's inside the ticket:title:    assemble the feature branches onto epic/recipe-box\\nlabel:    epic-merge-pr        agent: merge\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-5, RECIPE-11 (the feature gates)Brief: read the feature branches off the feature gates, assemble them onto the epic branch in your own worktree, resolve the conflicts between them, run the tests, report. No code, no tests, no merge into main, no PR." <<WorktreesRootWtEpicT_merge>> as WorktreesRootWtEpicT_merge
rectangle "==epic-e2e-test (RECIPE-3)\\n\\nWhat's inside the ticket:title:    journeys across the whole app in a real browser\\nlabel:    epic-e2e-test        agent: tester-e2e (respawn)\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-2Brief: cross-feature state handoffs, session continuity, one success + one failure journey per feature. Never re-test the unit tier's edges or the feature tier's wiring." <<WorktreesRootWtEpicT_e2e>> as WorktreesRootWtEpicT_e2e
rectangle "==epic-review (RECIPE-4)\\n\\nWhat's inside the ticket:title:    the three questions over the whole epic\\nlabel:    epic-review          agent: review (respawn)\\nmetadata: { "branch": "epic/recipe-box" }\\ndepends:  blocked-by RECIPE-3Brief: map entry → exit, instrument with trace logs, run the tests against the instrumented code, post findings as PR comments. Then the human verifies and closes the epic gate." <<WorktreesRootWtEpicT_epicReview>> as WorktreesRootWtEpicT_epicReview

WorktreesRootWtEpicMergeRun .[#5d2cb2,thickness=2].> WorktreesRootWtEpicT_merge : <color:#5d2cb2>works — assemble
WorktreesRootWtEpicE2eRun .[#5d2cb2,thickness=2].> WorktreesRootWtEpicT_e2e : <color:#5d2cb2>works — journeys
WorktreesRootWtEpicT_merge .[#505660,thickness=2].> WorktreesRootWtEpicT_e2e
WorktreesRootWtEpicEpicReviewRun .[#5d2cb2,thickness=2].> WorktreesRootWtEpicT_epicReview : <color:#5d2cb2>works — PR comments
WorktreesRootWtEpicT_e2e .[#505660,thickness=2].> WorktreesRootWtEpicT_epicReview
@enduml
`;case`errorMap`:return`@startuml
title "10. Errors that pop up"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam component<<Dispatcher>>{
  BackgroundColor #2563EB
  FontColor #f1ffff
  BorderColor #0042c2
}
skinparam component<<Hook>>{
  BackgroundColor #0E7490
  FontColor #ceffff
  BorderColor #00516b
}
skinparam rectangle<<ErrorsLabelAmbiguous>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsMetadataMissing>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsBranchBusy>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsWorktreeFailed>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsWorkerNotDispatched>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsEpicPrFailed>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsFrontierEmpty>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsTowerStalled>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsMaxParallelStalled>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsNotDeclaredDone>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
skinparam rectangle<<ErrorsNoPrTarget>>{
  BackgroundColor #DC2626
  FontColor #fffff3
  BorderColor #ad0005
}
component "==bo loop — the dispatcher\\n\\nWhat it is: CLI/beads-loop.sh — the one command (bo loop) that turns beads tickets into background workers.Steps it runs, one per tick:reads the branches already at work (branchesCurrentlyAtWork)claims a ticket atomically with bd ready --claimmatches its single dispatching label against the AGENT map — never guesses a specialistreads branch and parent off the claim; never invents a branchwalks the parent chain to the epic gate and publishes its branch + PR if missing (ensureEpicGatePr)makes sure the branch's worktree exists (ensureWorktree)spawns claude --bg --agent <agent> --permission-mode bypassPermissions with cwd inside that worktreelogs one line and moves on — it never polls a worker, never reaps, never merges" <<Dispatcher>> as Dispatcher
component "==hooks/worker-stop.sh — the Stop hook\\n\\nWhat it is: the fail-closed gatekeeper that fires when a worker session stops.Steps:checks $BO_DONE_FILE — no marker, no commit, no push, no PR, no close (ERROR reason=not-declared-done)commits the work onto the ticket's branch and pushes itopens the PR once per branch (base = the epic gate's branch, main at the epic tier) or reuses itwrites the PR url onto the ticket as metadata.prIt closes a task only on its done marker. A worker that touches the marker before the brief is complete has filed half a task onto a shared branch — the one failure this model cannot undo on its own." <<Hook>> as Hook
rectangle "The alarm vocabulary" <<Errors>> as Errors {
  skinparam RectangleBorderColor<<Errors>> #64748b
  skinparam RectangleFontColor<<Errors>> #64748b
  skinparam RectangleBorderStyle<<Errors>> dashed

  rectangle "==ERROR reason=label-ambiguous\\n\\nWhat it is: zero or two dispatching labels on a claim. The dispatcher never guesses a specialist — the ticket is LEFT CLAIMED so its lease parks it off the frontier, and the errors file is the alarm." <<ErrorsLabelAmbiguous>> as ErrorsLabelAmbiguous
  rectangle "==ERROR reason=metadata-missing\\n\\nWhat it is: no branch in the claim's metadata — a plan agent skipped its one key. Left claimed, same treatment as a mislabelled ticket. The loop never invents a branch." <<ErrorsMetadataMissing>> as ErrorsMetadataMissing
  rectangle "==ERROR reason=branch_busy held=N\\n\\nWhat it is: tickets exist and are claimable, but every branch they want is already working. The freshly claimed ticket goes straight back (bd unclaim) and the tick tries the next one — up to max_parallel + 2 claims per tick. One pair of hands per branch." <<ErrorsBranchBusy>> as ErrorsBranchBusy
  rectangle "==ERROR reason=worktree-failed\\n\\nWhat it is: git worktree add failed under .claude/worktrees/. Left claimed — a worker spawned in a missing folder burns a slot on nothing." <<ErrorsWorktreeFailed>> as ErrorsWorktreeFailed
  rectangle "==ERROR reason=worker-not-dispatched\\n\\nWhat it is: claude --bg spawned no session. The ticket is put back with bd unclaim so the next tick can retry it." <<ErrorsWorkerNotDispatched>> as ErrorsWorkerNotDispatched
  rectangle "==ERROR reason=epic-pr-failed step=…\\n\\nWhat it is: the epic branch or its PR could not be published. Steps: walk, gate-branch, forge, missing-tool, push, pr, annotate. Left claimed — a worker spawned under an epic branch that does not exist burns a slot and files a commit nobody can pull." <<ErrorsEpicPrFailed>> as ErrorsEpicPrFailed
  rectangle "==reason=frontier_empty\\n\\nWhat it is: the empty frontier's first state — nothing left to do." <<ErrorsFrontierEmpty>> as ErrorsFrontierEmpty
  rectangle "==reason=tower_stalled waiting=N\\n\\nWhat it is: the empty frontier's second state — work exists but sits off the frontier behind an open blocker, an open gate most often, which only a human can clear. tick() probes the difference with bd list --status open,blocked --limit 0." <<ErrorsTowerStalled>> as ErrorsTowerStalled
  rectangle "==max_parallel_stalled\\n\\nWhat it is: at capacity (counted fresh each tick from claude agents --json) with nothing in_progress." <<ErrorsMaxParallelStalled>> as ErrorsMaxParallelStalled
  rectangle "==ERROR reason=not-declared-done\\n\\nWhat it is: the Stop hook fired but $BO_DONE_FILE was never touched. Fail-closed: no commit, no push, no PR, no close. The ticket stays claimed so its lease parks it off the frontier and every task chained behind it waits." <<ErrorsNotDeclaredDone>> as ErrorsNotDeclaredDone
  rectangle "==ERROR reason=no-pr-target\\n\\nWhat it is: the Stop hook found no PR target the loop never handed down — named for the target, since pr now means the url." <<ErrorsNoPrTarget>> as ErrorsNoPrTarget
}

Dispatcher .[#a51d1d,thickness=2].> ErrorsLabelAmbiguous
Dispatcher .[#a51d1d,thickness=2].> ErrorsMetadataMissing
Dispatcher .[#a51d1d,thickness=2].> ErrorsBranchBusy
Dispatcher .[#a51d1d,thickness=2].> ErrorsWorktreeFailed
Dispatcher .[#a51d1d,thickness=2].> ErrorsWorkerNotDispatched
Dispatcher .[#a51d1d,thickness=2].> ErrorsEpicPrFailed
Dispatcher .[#a51d1d,thickness=2].> ErrorsFrontierEmpty
Dispatcher .[#a51d1d,thickness=2].> ErrorsTowerStalled
Dispatcher .[#a51d1d,thickness=2].> ErrorsMaxParallelStalled
Hook .[#a51d1d,thickness=2].> ErrorsNotDeclaredDone
Hook .[#a51d1d,thickness=2].> ErrorsNoPrTarget
@enduml
`;default:throw Error(`Unknown viewId: `+e)}};export{e as pumlSource};