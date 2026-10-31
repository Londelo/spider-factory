var e=e=>{switch(e){case`index`:return`---
title: "How to read this — start here"
---
graph TB
  Dispatcher@{ shape: rectangle, label: "bo loop — the dispatcher" }
  Hook@{ shape: rectangle, label: "hooks/worker-stop.sh — the Stop hook" }
  Human@{ icon: "fa:user", shape: rounded, label: "Human (Brodie)" }
  Decisions@{ shape: doc, label: "Decision points" }
  PlanAgentsPlanEpic@{ shape: rectangle, label: "plan-epic" }
  subgraph Workers["\`The workers (the spokes)\`"]
    Workers.Engineer@{ shape: rectangle, label: "engineer" }
    Workers.TesterUnit@{ shape: rectangle, label: "tester-unit" }
    Workers.Frontend@{ shape: rectangle, label: "frontend" }
    Workers.TesterFeature@{ shape: rectangle, label: "tester-feature" }
    Workers.TesterE2e@{ shape: rectangle, label: "tester-e2e" }
    Workers.ReviewAgent@{ shape: rectangle, label: "review" }
    Workers.MergeAgent@{ shape: rectangle, label: "merge" }
  end
  subgraph Errors["\`The alarm vocabulary\`"]
    Errors.LabelAmbiguous@{ shape: rectangle, label: "ERROR reason=label-ambiguous" }
    Errors.FrontierEmpty@{ shape: rectangle, label: "reason=frontier_empty" }
  end
  Beads@{ shape: disk, label: "beads DB (bd)" }
  Origin@{ shape: cylinder, label: "origin — GitHub" }
  subgraph Tower["\`The tower (one beads DB)\`"]
    subgraph Tower.EpicFeatA["\`Feature — Add a Recipe (RECIPE-5)\`"]
      Tower.EpicFeatA.BackendA@{ shape: doc, label: "backend-logic (RECIPE-6)" }
    end
  end
  Dispatcher -. "\`bd ready --claim / bd unclaim\`" .-> Beads
  Dispatcher -. "\`ensureEpicGatePr — push epic branch, open PR, write pr on the gate\`" .-> Origin
  Hook -. "\`commit, push, PR — only when BO_DONE_FILE exists\`" .-> Origin
  Dispatcher -. "\`backend-logic\`" .-> Workers.Engineer
  Workers.Engineer -. "\`bd heartbeat — keep the lease alive\`" .-> Beads
  Workers.Engineer -. "\`commit on the branch (via the Stop hook, never directly)\`" .-> Origin
  Dispatcher -. "\`unit-tests\`" .-> Workers.TesterUnit
  Dispatcher -. "\`frontend-ui\`" .-> Workers.Frontend
  Dispatcher -. "\`feature-test\`" .-> Workers.TesterFeature
  Dispatcher -. "\`epic-e2e-test\`" .-> Workers.TesterE2e
  Dispatcher -. "\`[...]\`" .-> Workers.ReviewAgent
  Dispatcher -. "\`epic-merge-pr\`" .-> Workers.MergeAgent
  Workers.Engineer -.-> Tower.EpicFeatA.BackendA
  Dispatcher -.-> Errors.LabelAmbiguous
  Dispatcher -.-> Errors.FrontierEmpty
  Human -. "\`after feature-review\`" .-> Tower.EpicFeatA
`;case`towerMap`:return`---
title: "1. The Tower — the epic, two features, every ticket"
---
graph TB
  subgraph TowerEpic["\`Epic — Recipe Box (RECIPE-1)\`"]
    subgraph TowerEpic.FeatA["\`Feature — Add a Recipe (RECIPE-5)\`"]
      TowerEpic.FeatA.BackendA@{ shape: doc, label: "backend-logic (RECIPE-6)" }
      TowerEpic.FeatA.UnitA@{ shape: doc, label: "unit-tests (RECIPE-7)" }
      TowerEpic.FeatA.FrontendA@{ shape: doc, label: "frontend-ui (RECIPE-8)" }
      TowerEpic.FeatA.FeatureTestA@{ shape: doc, label: "feature-test (RECIPE-9)" }
      TowerEpic.FeatA.FeatureReviewA@{ shape: doc, label: "feature-review (RECIPE-10)" }
    end
    subgraph TowerEpic.FeatB["\`Feature — Search the Box (RECIPE-11)\`"]
      TowerEpic.FeatB.BackendB@{ shape: doc, label: "backend-logic (RECIPE-12)" }
      TowerEpic.FeatB.UnitB@{ shape: doc, label: "unit-tests (RECIPE-13)" }
      TowerEpic.FeatB.FrontendB@{ shape: doc, label: "frontend-ui (RECIPE-14)" }
      TowerEpic.FeatB.FeatureTestB@{ shape: doc, label: "feature-test (RECIPE-15)" }
      TowerEpic.FeatB.FeatureReviewB@{ shape: doc, label: "feature-review (RECIPE-16)" }
    end
    TowerEpic.EpicMergePr@{ shape: doc, label: "epic-merge-pr (RECIPE-2)" }
    TowerEpic.EpicE2e@{ shape: doc, label: "epic-e2e-test (RECIPE-3)" }
    TowerEpic.EpicReview@{ shape: doc, label: "epic-review (RECIPE-4)" }
  end
  TowerEpic.EpicMergePr -.-> TowerEpic.EpicE2e
  TowerEpic.EpicE2e -.-> TowerEpic.EpicReview
  TowerEpic.FeatA.BackendA -.-> TowerEpic.FeatA.UnitA
  TowerEpic.FeatA.UnitA -.-> TowerEpic.FeatA.FrontendA
  TowerEpic.FeatA.FrontendA -.-> TowerEpic.FeatA.FeatureTestA
  TowerEpic.FeatA.FeatureTestA -.-> TowerEpic.FeatA.FeatureReviewA
  TowerEpic.FeatB.BackendB -.-> TowerEpic.FeatB.UnitB
  TowerEpic.FeatB.UnitB -.-> TowerEpic.FeatB.FrontendB
  TowerEpic.FeatB.FrontendB -.-> TowerEpic.FeatB.FeatureTestB
  TowerEpic.FeatB.FeatureTestB -.-> TowerEpic.FeatB.FeatureReviewB
  TowerEpic.FeatA -.-> TowerEpic.EpicMergePr
  TowerEpic.FeatB -.-> TowerEpic.EpicMergePr
`;case`allBranches`:return`---
title: "2. Branches — one box per branch"
---
graph TB
  subgraph WorktreesRoot["\`.claude/worktrees/ — one box per branch\`"]
    subgraph WorktreesRoot.WtEpic["\`epic+recipe-box → epic/recipe-box\`"]
      WorktreesRoot.WtEpic.MergeRun@{ shape: rectangle, label: "merge" }
      WorktreesRoot.WtEpic.E2eRun@{ shape: rectangle, label: "tester-e2e" }
      WorktreesRoot.WtEpic.EpicReviewRun@{ shape: rectangle, label: "review" }
      WorktreesRoot.WtEpic.T_merge@{ shape: doc, label: "epic-merge-pr (RECIPE-2)" }
      WorktreesRoot.WtEpic.T_e2e@{ shape: doc, label: "epic-e2e-test (RECIPE-3)" }
      WorktreesRoot.WtEpic.T_epicReview@{ shape: doc, label: "epic-review (RECIPE-4)" }
    end
    subgraph WorktreesRoot.WtA["\`feature+add-recipe → feature/add-recipe\`"]
      WorktreesRoot.WtA.EngA@{ shape: rectangle, label: "engineer" }
      WorktreesRoot.WtA.UnitA@{ shape: rectangle, label: "tester-unit" }
      WorktreesRoot.WtA.FeA@{ shape: rectangle, label: "frontend" }
      WorktreesRoot.WtA.FtA@{ shape: rectangle, label: "tester-feature" }
      WorktreesRoot.WtA.RevA@{ shape: rectangle, label: "review" }
      WorktreesRoot.WtA.T_backendA@{ shape: doc, label: "backend-logic (RECIPE-6)" }
      WorktreesRoot.WtA.T_unitA@{ shape: doc, label: "unit-tests (RECIPE-7)" }
      WorktreesRoot.WtA.T_frontA@{ shape: doc, label: "frontend-ui (RECIPE-8)" }
      WorktreesRoot.WtA.T_ftestA@{ shape: doc, label: "feature-test (RECIPE-9)" }
      WorktreesRoot.WtA.T_frevA@{ shape: doc, label: "feature-review (RECIPE-10)" }
    end
    subgraph WorktreesRoot.WtB["\`feature+search-recipes → feature/search-recipes\`"]
      WorktreesRoot.WtB.EngB@{ shape: rectangle, label: "engineer" }
      WorktreesRoot.WtB.UnitB@{ shape: rectangle, label: "tester-unit" }
      WorktreesRoot.WtB.FeB@{ shape: rectangle, label: "frontend" }
      WorktreesRoot.WtB.FtB@{ shape: rectangle, label: "tester-feature" }
      WorktreesRoot.WtB.RevB@{ shape: rectangle, label: "review" }
      WorktreesRoot.WtB.T_backendB@{ shape: doc, label: "backend-logic (RECIPE-12)" }
      WorktreesRoot.WtB.T_unitB@{ shape: doc, label: "unit-tests (RECIPE-13)" }
      WorktreesRoot.WtB.T_frontB@{ shape: doc, label: "frontend-ui (RECIPE-14)" }
      WorktreesRoot.WtB.T_ftestB@{ shape: doc, label: "feature-test (RECIPE-15)" }
      WorktreesRoot.WtB.T_frevB@{ shape: doc, label: "feature-review (RECIPE-16)" }
    end
  end
  WorktreesRoot.WtEpic.MergeRun -. "\`works — assemble\`" .-> WorktreesRoot.WtEpic.T_merge
  WorktreesRoot.WtEpic.E2eRun -. "\`works — journeys\`" .-> WorktreesRoot.WtEpic.T_e2e
  WorktreesRoot.WtEpic.EpicReviewRun -. "\`works — PR comments\`" .-> WorktreesRoot.WtEpic.T_epicReview
  WorktreesRoot.WtEpic.T_merge -.-> WorktreesRoot.WtEpic.T_e2e
  WorktreesRoot.WtEpic.T_e2e -.-> WorktreesRoot.WtEpic.T_epicReview
  WorktreesRoot.WtA.EngA -. "\`works — one commit\`" .-> WorktreesRoot.WtA.T_backendA
  WorktreesRoot.WtA.UnitA -. "\`works — test commit\`" .-> WorktreesRoot.WtA.T_unitA
  WorktreesRoot.WtA.FeA -. "\`works — UI commit\`" .-> WorktreesRoot.WtA.T_frontA
  WorktreesRoot.WtA.FtA -. "\`works — suite\`" .-> WorktreesRoot.WtA.T_ftestA
  WorktreesRoot.WtA.RevA -. "\`works — PR comments\`" .-> WorktreesRoot.WtA.T_frevA
  WorktreesRoot.WtA.T_backendA -.-> WorktreesRoot.WtA.T_unitA
  WorktreesRoot.WtA.T_unitA -.-> WorktreesRoot.WtA.T_frontA
  WorktreesRoot.WtA.T_frontA -.-> WorktreesRoot.WtA.T_ftestA
  WorktreesRoot.WtA.T_ftestA -.-> WorktreesRoot.WtA.T_frevA
  WorktreesRoot.WtB.EngB -. "\`works — one commit\`" .-> WorktreesRoot.WtB.T_backendB
  WorktreesRoot.WtB.UnitB -. "\`works — test commit\`" .-> WorktreesRoot.WtB.T_unitB
  WorktreesRoot.WtB.FeB -. "\`works — UI commit\`" .-> WorktreesRoot.WtB.T_frontB
  WorktreesRoot.WtB.FtB -. "\`works — suite\`" .-> WorktreesRoot.WtB.T_ftestB
  WorktreesRoot.WtB.RevB -. "\`works — PR comments\`" .-> WorktreesRoot.WtB.T_frevB
  WorktreesRoot.WtB.T_backendB -.-> WorktreesRoot.WtB.T_unitB
  WorktreesRoot.WtB.T_unitB -.-> WorktreesRoot.WtB.T_frontB
  WorktreesRoot.WtB.T_frontB -.-> WorktreesRoot.WtB.T_ftestB
  WorktreesRoot.WtB.T_ftestB -.-> WorktreesRoot.WtB.T_frevB
`;case`planTower`:return`---
title: "1. Plan the tower, top-down"
---
graph LR
  Human@{ icon: "fa:user", shape: rounded, label: "Human (Brodie)" }
  PlanAgentsPlanEpic@{ shape: rectangle, label: "plan-epic" }
  Beads@{ shape: disk, label: "beads DB (bd)" }
  PlanAgentsPlanFeature@{ shape: rectangle, label: "plan-feature" }
  PlanAgentsPlanTask@{ shape: rectangle, label: "plan-task" }
  Dispatcher@{ shape: rectangle, label: "bo loop — the dispatcher" }
  Human -. "\`'a recipe box app' — one vague idea\`" .-> PlanAgentsPlanEpic
  PlanAgentsPlanEpic -. "\`clarify, research, then create exactly one epic gate + merge / e2e / review tickets\`" .-> Beads
  Human -. "\`plan the features for RECIPE-1\`" .-> PlanAgentsPlanFeature
  PlanAgentsPlanFeature -. "\`RECIPE-5 feature/add-recipe and RECIPE-11 feature/search-recipes, each with feature-test and feature-review\`" .-> Beads
  Human -. "\`plan the tasks for RECIPE-5\`" .-> PlanAgentsPlanTask
  PlanAgentsPlanTask -. "\`RECIPE-6, RECIPE-7, RECIPE-8, chained one to the next\`" .-> Beads
  Human -. "\`bo loop — and the tower starts walking itself\`" .-> Dispatcher
`;case`tickWalkthrough`:return'---\ntitle: "2. One tick of bo loop"\n---\ngraph LR\n  Dispatcher@{ shape: rectangle, label: "bo loop — the dispatcher" }\n  Beads@{ shape: disk, label: "beads DB (bd)" }\n  WorkersEngineer@{ shape: rectangle, label: "engineer" }\n  ErrorsLabelAmbiguous@{ shape: rectangle, label: "ERROR reason=label-ambiguous" }\n  ErrorsMetadataMissing@{ shape: rectangle, label: "ERROR reason=metadata-missing" }\n  TowerEpic@{ shape: rectangle, label: "Epic — Recipe Box (RECIPE-1)" }\n  ErrorsBranchBusy@{ shape: rectangle, label: "ERROR reason=branch_busy held=N" }\n  Origin@{ shape: cylinder, label: "origin — GitHub" }\n  ErrorsEpicPrFailed@{ shape: rectangle, label: "ERROR reason=epic-pr-failed step=…" }\n  ErrorsWorktreeFailed@{ shape: rectangle, label: "ERROR reason=worktree-failed" }\n  ErrorsWorkerNotDispatched@{ shape: rectangle, label: "ERROR reason=worker-not-dispatched" }\n  Dispatcher -. "`probe the frontier: bd list --status open,blocked --limit 0`" .-> Beads\n  Dispatcher -. "`bd ready --claim (atomic — a bare bd ready would let two loops steal the ticket)`" .-> Beads\n  Dispatcher -. "`AGENT[backend-logic] = engineer`" .-> WorkersEngineer\n  Dispatcher -. "`never guesses a specialist`" .-> ErrorsLabelAmbiguous\n  Dispatcher -. "`leave it CLAIMED — the lease parks it off the frontier`" .-> Beads\n  Dispatcher -. "`BO_BRANCH = feature/add-recipe — read off the claim, nothing re-derives it, nothing parses text`" .-> Beads\n  Dispatcher -. "`ERROR reason=metadata-missing — left claimed`" .-> ErrorsMetadataMissing\n  Dispatcher -. "`branchesCurrentlyAtWork()`" .-> Beads\n  Dispatcher -. "`bd unclaim RECIPE-6`" .-> Beads\n  Dispatcher -. "`one pair of hands per branch; try the next claim, max max_parallel + 2 per tick`" .-> ErrorsBranchBusy\n  Dispatcher -. "`walk RECIPE-5 to RECIPE-1 (epicGateOf, two hops at most) — read the PR base off the gate`" .-> TowerEpic\n  Dispatcher -. "`ensureEpicGatePr — the gate has no pr: push epic/recipe-box off main, open the PR`" .-> Origin\n  Dispatcher -. "`bd update RECIPE-1 --set-metadata pr=https://github.com/…/pull/1 (merges — never disturbs branch)`" .-> Beads\n  Dispatcher -. "`left claimed — a worker under a nonexistent epic branch burns a slot; steps: walk, gate-branch, forge, missing-tool, push, pr, annotate`" .-> ErrorsEpicPrFailed\n  Dispatcher -. "`ensureWorktree — git worktree add .claude/worktrees/feature+add-recipe origin/feature/add-recipe`" .-> Beads\n  Dispatcher -. "`ERROR reason=worktree-failed — left claimed`" .-> ErrorsWorktreeFailed\n  Dispatcher -. "`claude --bg --agent engineer --permission-mode bypassPermissions (cwd INSIDE the worktree)`" .-> WorkersEngineer\n  Dispatcher -. "`bd unclaim RECIPE-6`" .-> Beads\n  Dispatcher -. "`ERROR reason=worker-not-dispatched`" .-> ErrorsWorkerNotDispatched\n  Dispatcher -. "`log one line, move on — the loop polls nothing, reaps nothing, merges nothing, ends nothing`" .-> Beads\n';case`workerToGate`:return`---
title: "3. Worker, Stop hook, gate"
---
graph LR
  WorkersEngineer@{ shape: rectangle, label: "engineer" }
  Beads@{ shape: disk, label: "beads DB (bd)" }
  Hook@{ shape: rectangle, label: "hooks/worker-stop.sh — the Stop hook" }
  ErrorsNotDeclaredDone@{ shape: rectangle, label: "ERROR reason=not-declared-done" }
  WorkersReviewAgent@{ shape: rectangle, label: "review" }
  Origin@{ shape: cylinder, label: "origin — GitHub" }
  ErrorsNoPrTarget@{ shape: rectangle, label: "ERROR reason=no-pr-target" }
  Dispatcher@{ shape: rectangle, label: "bo loop — the dispatcher" }
  WorkersTesterUnit@{ shape: rectangle, label: "tester-unit" }
  Human@{ icon: "fa:user", shape: rounded, label: "Human (Brodie)" }
  TowerEpicFeatA@{ shape: rectangle, label: "Feature — Add a Recipe (RECIPE-5)" }
  TowerEpicFeatB@{ shape: rectangle, label: "Feature — Search the Box (RECIPE-11)" }
  WorkersEngineer -. "\`bd heartbeat RECIPE-6 — keep the lease alive\`" .-> Beads
  WorkersEngineer -. "\`writes src/recipes/validate-recipe.ts in the worktree — never commits, never branches\`" .-> Beads
  WorkersEngineer -. "\`final action: touch $BO_DONE_FILE — only if the brief is genuinely complete\`" .-> Beads
  Hook -. "\`Stop fires\`" .-> WorkersEngineer
  Hook -. "\`ERROR reason=not-declared-done — fail-closed\`" .-> ErrorsNotDeclaredDone
  Hook -. "\`RECIPE-6 stays claimed; RECIPE-7 chained behind it waits\`" .-> Beads
  Hook -. "\`commit RECIPE-6 onto feature/add-recipe, push, open PR base epic/recipe-box — once per branch, reused after\`" .-> Origin
  Hook -. "\`write metadata pr=… onto RECIPE-6, close the task\`" .-> Beads
  Hook -. "\`ERROR reason=no-pr-target — named for the target, since pr now means the url\`" .-> ErrorsNoPrTarget
  Hook -. "\`the line opens one ticket: RECIPE-7 becomes the frontier\`" .-> Dispatcher
  Dispatcher -. "\`AGENT[unit-tests] = tester-unit — respawn means a fresh session of the SAME agent re-checks inside the one ticket\`" .-> WorkersTesterUnit
  WorkersTesterUnit -. "\`covers every branch of validateRecipe (framework-jest), commits onto feature/add-recipe via the hook\`" .-> Beads
  WorkersReviewAgent -. "\`feature-review: maps entry to exit, trace logs, tests against the instrumented code, findings as PR comments\`" .-> Origin
  Human -. "\`reads the report, verifies the flow, closes RECIPE-5 — only a human closes a gate\`" .-> TowerEpicFeatA
  Human -. "\`verify, close RECIPE-11\`" .-> TowerEpicFeatB
`;case`epicTier`:return`---
title: "4. The epic tier assembles"
---
graph LR
  Dispatcher@{ shape: rectangle, label: "bo loop — the dispatcher" }
  WorkersMergeAgent@{ shape: rectangle, label: "merge" }
  Origin@{ shape: cylinder, label: "origin — GitHub" }
  WorkersTesterE2e@{ shape: rectangle, label: "tester-e2e" }
  WorkersReviewAgent@{ shape: rectangle, label: "review" }
  Human@{ icon: "fa:user", shape: rounded, label: "Human (Brodie)" }
  TowerEpic@{ shape: rectangle, label: "Epic — Recipe Box (RECIPE-1)" }
  Dispatcher -. "\`RECIPE-2 epic-merge-pr is on the frontier — dispatched like any other stamp\`" .-> WorkersMergeAgent
  WorkersMergeAgent -. "\`read the feature branches off the gates, assemble onto epic/recipe-box, resolve the conflicts, run the tests, report\`" .-> Origin
  Dispatcher -. "\`RECIPE-3 epic-e2e-test — journeys on the real stack\`" .-> WorkersTesterE2e
  Dispatcher -. "\`RECIPE-4 epic-review — three questions from first principles\`" .-> WorkersReviewAgent
  Human -. "\`verify, close the epic gate — thumbs-up on the merged PR into main\`" .-> TowerEpic
`;case`stageBackends`:return`---
title: "5. Stage — back end, two branches at once"
---
graph TB
  subgraph WorktreesRootWtA["\`feature+add-recipe → feature/add-recipe\`"]
    WorktreesRootWtA.EngA@{ shape: rectangle, label: "engineer" }
    WorktreesRootWtA.T_backendA@{ shape: doc, label: "backend-logic (RECIPE-6)" }
  end
  subgraph WorktreesRootWtB["\`feature+search-recipes → feature/search-recipes\`"]
    WorktreesRootWtB.EngB@{ shape: rectangle, label: "engineer" }
    WorktreesRootWtB.T_backendB@{ shape: doc, label: "backend-logic (RECIPE-12)" }
  end
  WorktreesRootWtA.EngA -. "\`works — one commit\`" .-> WorktreesRootWtA.T_backendA
  WorktreesRootWtB.EngB -. "\`works — one commit\`" .-> WorktreesRootWtB.T_backendB
`;case`stageUnits`:return`---
title: "6. Stage — the micro tier follows its back end"
---
graph TB
  subgraph WorktreesRootWtA["\`feature+add-recipe → feature/add-recipe\`"]
    WorktreesRootWtA.UnitA@{ shape: rectangle, label: "tester-unit" }
    WorktreesRootWtA.T_unitA@{ shape: doc, label: "unit-tests (RECIPE-7)" }
  end
  subgraph WorktreesRootWtB["\`feature+search-recipes → feature/search-recipes\`"]
    WorktreesRootWtB.UnitB@{ shape: rectangle, label: "tester-unit" }
    WorktreesRootWtB.T_unitB@{ shape: doc, label: "unit-tests (RECIPE-13)" }
  end
  WorktreesRootWtA.UnitA -. "\`works — test commit\`" .-> WorktreesRootWtA.T_unitA
  WorktreesRootWtB.UnitB -. "\`works — test commit\`" .-> WorktreesRootWtB.T_unitB
`;case`stageFrontends`:return`---
title: "7. Stage — the UI, last in the line"
---
graph TB
  subgraph WorktreesRootWtA["\`feature+add-recipe → feature/add-recipe\`"]
    WorktreesRootWtA.FeA@{ shape: rectangle, label: "frontend" }
    WorktreesRootWtA.T_frontA@{ shape: doc, label: "frontend-ui (RECIPE-8)" }
  end
  subgraph WorktreesRootWtB["\`feature+search-recipes → feature/search-recipes\`"]
    WorktreesRootWtB.FeB@{ shape: rectangle, label: "frontend" }
    WorktreesRootWtB.T_frontB@{ shape: doc, label: "frontend-ui (RECIPE-14)" }
  end
  WorktreesRootWtA.FeA -. "\`works — UI commit\`" .-> WorktreesRootWtA.T_frontA
  WorktreesRootWtB.FeB -. "\`works — UI commit\`" .-> WorktreesRootWtB.T_frontB
`;case`stageFeatureTier`:return`---
title: "8. Stage — suite, then review, on the whole feature"
---
graph TB
  subgraph WorktreesRootWtA["\`feature+add-recipe → feature/add-recipe\`"]
    WorktreesRootWtA.FtA@{ shape: rectangle, label: "tester-feature" }
    WorktreesRootWtA.RevA@{ shape: rectangle, label: "review" }
    WorktreesRootWtA.T_ftestA@{ shape: doc, label: "feature-test (RECIPE-9)" }
    WorktreesRootWtA.T_frevA@{ shape: doc, label: "feature-review (RECIPE-10)" }
  end
  subgraph WorktreesRootWtB["\`feature+search-recipes → feature/search-recipes\`"]
    WorktreesRootWtB.FtB@{ shape: rectangle, label: "tester-feature" }
    WorktreesRootWtB.RevB@{ shape: rectangle, label: "review" }
    WorktreesRootWtB.T_ftestB@{ shape: doc, label: "feature-test (RECIPE-15)" }
    WorktreesRootWtB.T_frevB@{ shape: doc, label: "feature-review (RECIPE-16)" }
  end
  WorktreesRootWtA.FtA -. "\`works — suite\`" .-> WorktreesRootWtA.T_ftestA
  WorktreesRootWtA.T_ftestA -.-> WorktreesRootWtA.T_frevA
  WorktreesRootWtA.RevA -. "\`works — PR comments\`" .-> WorktreesRootWtA.T_frevA
  WorktreesRootWtB.FtB -. "\`works — suite\`" .-> WorktreesRootWtB.T_ftestB
  WorktreesRootWtB.T_ftestB -.-> WorktreesRootWtB.T_frevB
  WorktreesRootWtB.RevB -. "\`works — PR comments\`" .-> WorktreesRootWtB.T_frevB
`;case`stageEpicTier`:return`---
title: "9. Stage — the epic tier, in its own box"
---
graph TB
  WorktreesRootWtEpicMergeRun@{ shape: rectangle, label: "merge" }
  WorktreesRootWtEpicE2eRun@{ shape: rectangle, label: "tester-e2e" }
  WorktreesRootWtEpicEpicReviewRun@{ shape: rectangle, label: "review" }
  WorktreesRootWtEpicT_merge@{ shape: doc, label: "epic-merge-pr (RECIPE-2)" }
  WorktreesRootWtEpicT_e2e@{ shape: doc, label: "epic-e2e-test (RECIPE-3)" }
  WorktreesRootWtEpicT_epicReview@{ shape: doc, label: "epic-review (RECIPE-4)" }
  WorktreesRootWtEpicMergeRun -. "\`works — assemble\`" .-> WorktreesRootWtEpicT_merge
  WorktreesRootWtEpicE2eRun -. "\`works — journeys\`" .-> WorktreesRootWtEpicT_e2e
  WorktreesRootWtEpicT_merge -.-> WorktreesRootWtEpicT_e2e
  WorktreesRootWtEpicEpicReviewRun -. "\`works — PR comments\`" .-> WorktreesRootWtEpicT_epicReview
  WorktreesRootWtEpicT_e2e -.-> WorktreesRootWtEpicT_epicReview
`;case`errorMap`:return`---
title: "10. Errors that pop up"
---
graph TB
  Dispatcher@{ shape: rectangle, label: "bo loop — the dispatcher" }
  Hook@{ shape: rectangle, label: "hooks/worker-stop.sh — the Stop hook" }
  subgraph Errors["\`The alarm vocabulary\`"]
    Errors.LabelAmbiguous@{ shape: rectangle, label: "ERROR reason=label-ambiguous" }
    Errors.MetadataMissing@{ shape: rectangle, label: "ERROR reason=metadata-missing" }
    Errors.BranchBusy@{ shape: rectangle, label: "ERROR reason=branch_busy held=N" }
    Errors.WorktreeFailed@{ shape: rectangle, label: "ERROR reason=worktree-failed" }
    Errors.WorkerNotDispatched@{ shape: rectangle, label: "ERROR reason=worker-not-dispatched" }
    Errors.EpicPrFailed@{ shape: rectangle, label: "ERROR reason=epic-pr-failed step=…" }
    Errors.FrontierEmpty@{ shape: rectangle, label: "reason=frontier_empty" }
    Errors.TowerStalled@{ shape: rectangle, label: "reason=tower_stalled waiting=N" }
    Errors.MaxParallelStalled@{ shape: rectangle, label: "max_parallel_stalled" }
    Errors.NotDeclaredDone@{ shape: rectangle, label: "ERROR reason=not-declared-done" }
    Errors.NoPrTarget@{ shape: rectangle, label: "ERROR reason=no-pr-target" }
  end
  Dispatcher -.-> Errors.LabelAmbiguous
  Dispatcher -.-> Errors.MetadataMissing
  Dispatcher -.-> Errors.BranchBusy
  Dispatcher -.-> Errors.WorktreeFailed
  Dispatcher -.-> Errors.WorkerNotDispatched
  Dispatcher -.-> Errors.EpicPrFailed
  Dispatcher -.-> Errors.FrontierEmpty
  Dispatcher -.-> Errors.TowerStalled
  Dispatcher -.-> Errors.MaxParallelStalled
  Hook -.-> Errors.NotDeclaredDone
  Hook -.-> Errors.NoPrTarget
`;default:throw Error(`Unknown viewId: `+e)}};export{e as mmdSource};