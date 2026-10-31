var e=e=>{switch(e){case`index`:return`direction: down

Dispatcher: {
  label: "bo loop — the dispatcher"
}
Hook: {
  label: "hooks/worker-stop.sh — the Stop hook"
}
Human: {
  label: "Human (Brodie)"
  shape: c4-person
}
Decisions: {
  label: "Decision points"
  shape: document
}
PlanAgentsPlanEpic: {
  label: "plan-epic"
}
Workers: {
  label: "The workers (the spokes)"

  Engineer: {
    label: "engineer"
  }
  TesterUnit: {
    label: "tester-unit"
  }
  Frontend: {
    label: "frontend"
  }
  TesterFeature: {
    label: "tester-feature"
  }
  TesterE2e: {
    label: "tester-e2e"
  }
  ReviewAgent: {
    label: "review"
  }
  MergeAgent: {
    label: "merge"
  }
}
Errors: {
  label: "The alarm vocabulary"

  LabelAmbiguous: {
    label: "ERROR reason=label-ambiguous"
  }
  FrontierEmpty: {
    label: "reason=frontier_empty"
  }
}
Beads: {
  label: "beads DB (bd)"
  shape: stored_data
}
Origin: {
  label: "origin — GitHub"
  shape: cylinder
}
Tower: {
  label: "The tower (one beads DB)"

  EpicFeatA: {
    label: "Feature — Add a Recipe (RECIPE-5)"

    BackendA: {
      label: "backend-logic (RECIPE-6)"
      shape: document
    }
  }
}

Dispatcher -> Beads: "bd ready --claim / bd unclaim"
Dispatcher -> Origin: "ensureEpicGatePr — push epic branch, open PR, write pr on the gate"
Hook -> Origin: "commit, push, PR — only when BO_DONE_FILE exists"
Dispatcher -> Workers.Engineer: "backend-logic"
Workers.Engineer -> Beads: "bd heartbeat — keep the lease alive"
Workers.Engineer -> Origin: "commit on the branch (via the Stop hook, never directly)"
Dispatcher -> Workers.TesterUnit: "unit-tests"
Dispatcher -> Workers.Frontend: "frontend-ui"
Dispatcher -> Workers.TesterFeature: "feature-test"
Dispatcher -> Workers.TesterE2e: "epic-e2e-test"
Dispatcher -> Workers.ReviewAgent: "[...]"
Dispatcher -> Workers.MergeAgent: "epic-merge-pr"
Workers.Engineer -> Tower.EpicFeatA.BackendA
Dispatcher -> Errors.LabelAmbiguous
Dispatcher -> Errors.FrontierEmpty
Human -> Tower.EpicFeatA: "after feature-review"
`;case`towerMap`:return`direction: down

TowerEpic: {
  label: "Epic — Recipe Box (RECIPE-1)"

  FeatA: {
    label: "Feature — Add a Recipe (RECIPE-5)"

    BackendA: {
      label: "backend-logic (RECIPE-6)"
      shape: document
    }
    UnitA: {
      label: "unit-tests (RECIPE-7)"
      shape: document
    }
    FrontendA: {
      label: "frontend-ui (RECIPE-8)"
      shape: document
    }
    FeatureTestA: {
      label: "feature-test (RECIPE-9)"
      shape: document
    }
    FeatureReviewA: {
      label: "feature-review (RECIPE-10)"
      shape: document
    }
  }
  FeatB: {
    label: "Feature — Search the Box (RECIPE-11)"

    BackendB: {
      label: "backend-logic (RECIPE-12)"
      shape: document
    }
    UnitB: {
      label: "unit-tests (RECIPE-13)"
      shape: document
    }
    FrontendB: {
      label: "frontend-ui (RECIPE-14)"
      shape: document
    }
    FeatureTestB: {
      label: "feature-test (RECIPE-15)"
      shape: document
    }
    FeatureReviewB: {
      label: "feature-review (RECIPE-16)"
      shape: document
    }
  }
  EpicMergePr: {
    label: "epic-merge-pr (RECIPE-2)"
    shape: document
  }
  EpicE2e: {
    label: "epic-e2e-test (RECIPE-3)"
    shape: document
  }
  EpicReview: {
    label: "epic-review (RECIPE-4)"
    shape: document
  }
}

TowerEpic.EpicMergePr -> TowerEpic.EpicE2e
TowerEpic.EpicE2e -> TowerEpic.EpicReview
TowerEpic.FeatA.BackendA -> TowerEpic.FeatA.UnitA
TowerEpic.FeatA.UnitA -> TowerEpic.FeatA.FrontendA
TowerEpic.FeatA.FrontendA -> TowerEpic.FeatA.FeatureTestA
TowerEpic.FeatA.FeatureTestA -> TowerEpic.FeatA.FeatureReviewA
TowerEpic.FeatB.BackendB -> TowerEpic.FeatB.UnitB
TowerEpic.FeatB.UnitB -> TowerEpic.FeatB.FrontendB
TowerEpic.FeatB.FrontendB -> TowerEpic.FeatB.FeatureTestB
TowerEpic.FeatB.FeatureTestB -> TowerEpic.FeatB.FeatureReviewB
TowerEpic.FeatA -> TowerEpic.EpicMergePr
TowerEpic.FeatB -> TowerEpic.EpicMergePr
`;case`allBranches`:return`direction: down

WorktreesRoot: {
  label: ".claude/worktrees/ — one box per branch"

  WtEpic: {
    label: "epic+recipe-box → epic/recipe-box"

    MergeRun: {
      label: "merge"
    }
    E2eRun: {
      label: "tester-e2e"
    }
    EpicReviewRun: {
      label: "review"
    }
    T_merge: {
      label: "epic-merge-pr (RECIPE-2)"
      shape: document
    }
    T_e2e: {
      label: "epic-e2e-test (RECIPE-3)"
      shape: document
    }
    T_epicReview: {
      label: "epic-review (RECIPE-4)"
      shape: document
    }
  }
  WtA: {
    label: "feature+add-recipe → feature/add-recipe"

    EngA: {
      label: "engineer"
    }
    UnitA: {
      label: "tester-unit"
    }
    FeA: {
      label: "frontend"
    }
    FtA: {
      label: "tester-feature"
    }
    RevA: {
      label: "review"
    }
    T_backendA: {
      label: "backend-logic (RECIPE-6)"
      shape: document
    }
    T_unitA: {
      label: "unit-tests (RECIPE-7)"
      shape: document
    }
    T_frontA: {
      label: "frontend-ui (RECIPE-8)"
      shape: document
    }
    T_ftestA: {
      label: "feature-test (RECIPE-9)"
      shape: document
    }
    T_frevA: {
      label: "feature-review (RECIPE-10)"
      shape: document
    }
  }
  WtB: {
    label: "feature+search-recipes → feature/search-recipes"

    EngB: {
      label: "engineer"
    }
    UnitB: {
      label: "tester-unit"
    }
    FeB: {
      label: "frontend"
    }
    FtB: {
      label: "tester-feature"
    }
    RevB: {
      label: "review"
    }
    T_backendB: {
      label: "backend-logic (RECIPE-12)"
      shape: document
    }
    T_unitB: {
      label: "unit-tests (RECIPE-13)"
      shape: document
    }
    T_frontB: {
      label: "frontend-ui (RECIPE-14)"
      shape: document
    }
    T_ftestB: {
      label: "feature-test (RECIPE-15)"
      shape: document
    }
    T_frevB: {
      label: "feature-review (RECIPE-16)"
      shape: document
    }
  }
}

WorktreesRoot.WtEpic.MergeRun -> WorktreesRoot.WtEpic.T_merge: "works — assemble"
WorktreesRoot.WtEpic.E2eRun -> WorktreesRoot.WtEpic.T_e2e: "works — journeys"
WorktreesRoot.WtEpic.EpicReviewRun -> WorktreesRoot.WtEpic.T_epicReview: "works — PR comments"
WorktreesRoot.WtEpic.T_merge -> WorktreesRoot.WtEpic.T_e2e
WorktreesRoot.WtEpic.T_e2e -> WorktreesRoot.WtEpic.T_epicReview
WorktreesRoot.WtA.EngA -> WorktreesRoot.WtA.T_backendA: "works — one commit"
WorktreesRoot.WtA.UnitA -> WorktreesRoot.WtA.T_unitA: "works — test commit"
WorktreesRoot.WtA.FeA -> WorktreesRoot.WtA.T_frontA: "works — UI commit"
WorktreesRoot.WtA.FtA -> WorktreesRoot.WtA.T_ftestA: "works — suite"
WorktreesRoot.WtA.RevA -> WorktreesRoot.WtA.T_frevA: "works — PR comments"
WorktreesRoot.WtA.T_backendA -> WorktreesRoot.WtA.T_unitA
WorktreesRoot.WtA.T_unitA -> WorktreesRoot.WtA.T_frontA
WorktreesRoot.WtA.T_frontA -> WorktreesRoot.WtA.T_ftestA
WorktreesRoot.WtA.T_ftestA -> WorktreesRoot.WtA.T_frevA
WorktreesRoot.WtB.EngB -> WorktreesRoot.WtB.T_backendB: "works — one commit"
WorktreesRoot.WtB.UnitB -> WorktreesRoot.WtB.T_unitB: "works — test commit"
WorktreesRoot.WtB.FeB -> WorktreesRoot.WtB.T_frontB: "works — UI commit"
WorktreesRoot.WtB.FtB -> WorktreesRoot.WtB.T_ftestB: "works — suite"
WorktreesRoot.WtB.RevB -> WorktreesRoot.WtB.T_frevB: "works — PR comments"
WorktreesRoot.WtB.T_backendB -> WorktreesRoot.WtB.T_unitB
WorktreesRoot.WtB.T_unitB -> WorktreesRoot.WtB.T_frontB
WorktreesRoot.WtB.T_frontB -> WorktreesRoot.WtB.T_ftestB
WorktreesRoot.WtB.T_ftestB -> WorktreesRoot.WtB.T_frevB
`;case`planTower`:return`direction: right

Human: {
  label: "Human (Brodie)"
  shape: c4-person
}
PlanAgentsPlanEpic: {
  label: "plan-epic"
}
Beads: {
  label: "beads DB (bd)"
  shape: stored_data
}
PlanAgentsPlanFeature: {
  label: "plan-feature"
}
PlanAgentsPlanTask: {
  label: "plan-task"
}
Dispatcher: {
  label: "bo loop — the dispatcher"
}

Human -> PlanAgentsPlanEpic: "'a recipe box app' — one vague idea"
PlanAgentsPlanEpic -> Beads: "clarify, research, then create exactly one epic gate + merge / e2e / review tickets"
Human -> PlanAgentsPlanFeature: "plan the features for RECIPE-1"
PlanAgentsPlanFeature -> Beads: "RECIPE-5 feature/add-recipe and RECIPE-11 feature/search-recipes, each with feature-test and feature-review"
Human -> PlanAgentsPlanTask: "plan the tasks for RECIPE-5"
PlanAgentsPlanTask -> Beads: "RECIPE-6, RECIPE-7, RECIPE-8, chained one to the next"
Human -> Dispatcher: "bo loop — and the tower starts walking itself"
`;case`tickWalkthrough`:return`direction: right

Dispatcher: {
  label: "bo loop — the dispatcher"
}
Beads: {
  label: "beads DB (bd)"
  shape: stored_data
}
WorkersEngineer: {
  label: "engineer"
}
ErrorsLabelAmbiguous: {
  label: "ERROR reason=label-ambiguous"
}
ErrorsMetadataMissing: {
  label: "ERROR reason=metadata-missing"
}
TowerEpic: {
  label: "Epic — Recipe Box (RECIPE-1)"
}
ErrorsBranchBusy: {
  label: "ERROR reason=branch_busy held=N"
}
Origin: {
  label: "origin — GitHub"
  shape: cylinder
}
ErrorsEpicPrFailed: {
  label: "ERROR reason=epic-pr-failed step=…"
}
ErrorsWorktreeFailed: {
  label: "ERROR reason=worktree-failed"
}
ErrorsWorkerNotDispatched: {
  label: "ERROR reason=worker-not-dispatched"
}

Dispatcher -> Beads: "probe the frontier: bd list --status open,blocked --limit 0"
Dispatcher -> Beads: "bd ready --claim (atomic — a bare bd ready would let two loops steal the ticket)"
Dispatcher -> WorkersEngineer: "AGENT[backend-logic] = engineer"
Dispatcher -> ErrorsLabelAmbiguous: "never guesses a specialist"
Dispatcher -> Beads: "leave it CLAIMED — the lease parks it off the frontier"
Dispatcher -> Beads: "BO_BRANCH = feature/add-recipe — read off the claim, nothing re-derives it, nothing parses text"
Dispatcher -> ErrorsMetadataMissing: "ERROR reason=metadata-missing — left claimed"
Dispatcher -> Beads: "branchesCurrentlyAtWork()"
Dispatcher -> Beads: "bd unclaim RECIPE-6"
Dispatcher -> ErrorsBranchBusy: "one pair of hands per branch; try the next claim, max max_parallel + 2 per tick"
Dispatcher -> TowerEpic: "walk RECIPE-5 to RECIPE-1 (epicGateOf, two hops at most) — read the PR base off the gate"
Dispatcher -> Origin: "ensureEpicGatePr — the gate has no pr: push epic/recipe-box off main, open the PR"
Dispatcher -> Beads: "bd update RECIPE-1 --set-metadata pr=https://github.com/…/pull/1 (merges — never disturbs branch)"
Dispatcher -> ErrorsEpicPrFailed: "left claimed — a worker under a nonexistent epic branch burns a slot; steps: walk, gate-branch, forge, missing-tool, push, pr, annotate"
Dispatcher -> Beads: "ensureWorktree — git worktree add .claude/worktrees/feature+add-recipe origin/feature/add-recipe"
Dispatcher -> ErrorsWorktreeFailed: "ERROR reason=worktree-failed — left claimed"
Dispatcher -> WorkersEngineer: "claude --bg --agent engineer --permission-mode bypassPermissions (cwd INSIDE the worktree)"
Dispatcher -> Beads: "bd unclaim RECIPE-6"
Dispatcher -> ErrorsWorkerNotDispatched: "ERROR reason=worker-not-dispatched"
Dispatcher -> Beads: "log one line, move on — the loop polls nothing, reaps nothing, merges nothing, ends nothing"
`;case`workerToGate`:return`direction: right

WorkersEngineer: {
  label: "engineer"
}
Beads: {
  label: "beads DB (bd)"
  shape: stored_data
}
Hook: {
  label: "hooks/worker-stop.sh — the Stop hook"
}
ErrorsNotDeclaredDone: {
  label: "ERROR reason=not-declared-done"
}
WorkersReviewAgent: {
  label: "review"
}
Origin: {
  label: "origin — GitHub"
  shape: cylinder
}
ErrorsNoPrTarget: {
  label: "ERROR reason=no-pr-target"
}
Dispatcher: {
  label: "bo loop — the dispatcher"
}
WorkersTesterUnit: {
  label: "tester-unit"
}
Human: {
  label: "Human (Brodie)"
  shape: c4-person
}
TowerEpicFeatA: {
  label: "Feature — Add a Recipe (RECIPE-5)"
}
TowerEpicFeatB: {
  label: "Feature — Search the Box (RECIPE-11)"
}

WorkersEngineer -> Beads: "bd heartbeat RECIPE-6 — keep the lease alive"
WorkersEngineer -> Beads: "writes src/recipes/validate-recipe.ts in the worktree — never commits, never branches"
WorkersEngineer -> Beads: "final action: touch $BO_DONE_FILE — only if the brief is genuinely complete"
Hook -> WorkersEngineer: "Stop fires"
Hook -> ErrorsNotDeclaredDone: "ERROR reason=not-declared-done — fail-closed"
Hook -> Beads: "RECIPE-6 stays claimed; RECIPE-7 chained behind it waits"
Hook -> Origin: "commit RECIPE-6 onto feature/add-recipe, push, open PR base epic/recipe-box — once per branch, reused after"
Hook -> Beads: "write metadata pr=… onto RECIPE-6, close the task"
Hook -> ErrorsNoPrTarget: "ERROR reason=no-pr-target — named for the target, since pr now means the url"
Hook -> Dispatcher: "the line opens one ticket: RECIPE-7 becomes the frontier"
Dispatcher -> WorkersTesterUnit: "AGENT[unit-tests] = tester-unit — respawn means a fresh session of the SAME agent re-checks inside the one ticket"
WorkersTesterUnit -> Beads: "covers every branch of validateRecipe (framework-jest), commits onto feature/add-recipe via the hook"
WorkersReviewAgent -> Origin: "feature-review: maps entry to exit, trace logs, tests against the instrumented code, findings as PR comments"
Human -> TowerEpicFeatA: "reads the report, verifies the flow, closes RECIPE-5 — only a human closes a gate"
Human -> TowerEpicFeatB: "verify, close RECIPE-11"
`;case`epicTier`:return`direction: right

Dispatcher: {
  label: "bo loop — the dispatcher"
}
WorkersMergeAgent: {
  label: "merge"
}
Origin: {
  label: "origin — GitHub"
  shape: cylinder
}
WorkersTesterE2e: {
  label: "tester-e2e"
}
WorkersReviewAgent: {
  label: "review"
}
Human: {
  label: "Human (Brodie)"
  shape: c4-person
}
TowerEpic: {
  label: "Epic — Recipe Box (RECIPE-1)"
}

Dispatcher -> WorkersMergeAgent: "RECIPE-2 epic-merge-pr is on the frontier — dispatched like any other stamp"
WorkersMergeAgent -> Origin: "read the feature branches off the gates, assemble onto epic/recipe-box, resolve the conflicts, run the tests, report"
Dispatcher -> WorkersTesterE2e: "RECIPE-3 epic-e2e-test — journeys on the real stack"
Dispatcher -> WorkersReviewAgent: "RECIPE-4 epic-review — three questions from first principles"
Human -> TowerEpic: "verify, close the epic gate — thumbs-up on the merged PR into main"
`;case`stageBackends`:return`direction: down

WorktreesRootWtA: {
  label: "feature+add-recipe → feature/add-recipe"

  EngA: {
    label: "engineer"
  }
  T_backendA: {
    label: "backend-logic (RECIPE-6)"
    shape: document
  }
}
WorktreesRootWtB: {
  label: "feature+search-recipes → feature/search-recipes"

  EngB: {
    label: "engineer"
  }
  T_backendB: {
    label: "backend-logic (RECIPE-12)"
    shape: document
  }
}

WorktreesRootWtA.EngA -> WorktreesRootWtA.T_backendA: "works — one commit"
WorktreesRootWtB.EngB -> WorktreesRootWtB.T_backendB: "works — one commit"
`;case`stageUnits`:return`direction: down

WorktreesRootWtA: {
  label: "feature+add-recipe → feature/add-recipe"

  UnitA: {
    label: "tester-unit"
  }
  T_unitA: {
    label: "unit-tests (RECIPE-7)"
    shape: document
  }
}
WorktreesRootWtB: {
  label: "feature+search-recipes → feature/search-recipes"

  UnitB: {
    label: "tester-unit"
  }
  T_unitB: {
    label: "unit-tests (RECIPE-13)"
    shape: document
  }
}

WorktreesRootWtA.UnitA -> WorktreesRootWtA.T_unitA: "works — test commit"
WorktreesRootWtB.UnitB -> WorktreesRootWtB.T_unitB: "works — test commit"
`;case`stageFrontends`:return`direction: down

WorktreesRootWtA: {
  label: "feature+add-recipe → feature/add-recipe"

  FeA: {
    label: "frontend"
  }
  T_frontA: {
    label: "frontend-ui (RECIPE-8)"
    shape: document
  }
}
WorktreesRootWtB: {
  label: "feature+search-recipes → feature/search-recipes"

  FeB: {
    label: "frontend"
  }
  T_frontB: {
    label: "frontend-ui (RECIPE-14)"
    shape: document
  }
}

WorktreesRootWtA.FeA -> WorktreesRootWtA.T_frontA: "works — UI commit"
WorktreesRootWtB.FeB -> WorktreesRootWtB.T_frontB: "works — UI commit"
`;case`stageFeatureTier`:return`direction: down

WorktreesRootWtA: {
  label: "feature+add-recipe → feature/add-recipe"

  FtA: {
    label: "tester-feature"
  }
  RevA: {
    label: "review"
  }
  T_ftestA: {
    label: "feature-test (RECIPE-9)"
    shape: document
  }
  T_frevA: {
    label: "feature-review (RECIPE-10)"
    shape: document
  }
}
WorktreesRootWtB: {
  label: "feature+search-recipes → feature/search-recipes"

  FtB: {
    label: "tester-feature"
  }
  RevB: {
    label: "review"
  }
  T_ftestB: {
    label: "feature-test (RECIPE-15)"
    shape: document
  }
  T_frevB: {
    label: "feature-review (RECIPE-16)"
    shape: document
  }
}

WorktreesRootWtA.FtA -> WorktreesRootWtA.T_ftestA: "works — suite"
WorktreesRootWtA.T_ftestA -> WorktreesRootWtA.T_frevA
WorktreesRootWtA.RevA -> WorktreesRootWtA.T_frevA: "works — PR comments"
WorktreesRootWtB.FtB -> WorktreesRootWtB.T_ftestB: "works — suite"
WorktreesRootWtB.T_ftestB -> WorktreesRootWtB.T_frevB
WorktreesRootWtB.RevB -> WorktreesRootWtB.T_frevB: "works — PR comments"
`;case`stageEpicTier`:return`direction: down

WorktreesRootWtEpicMergeRun: {
  label: "merge"
}
WorktreesRootWtEpicE2eRun: {
  label: "tester-e2e"
}
WorktreesRootWtEpicEpicReviewRun: {
  label: "review"
}
WorktreesRootWtEpicT_merge: {
  label: "epic-merge-pr (RECIPE-2)"
  shape: document
}
WorktreesRootWtEpicT_e2e: {
  label: "epic-e2e-test (RECIPE-3)"
  shape: document
}
WorktreesRootWtEpicT_epicReview: {
  label: "epic-review (RECIPE-4)"
  shape: document
}

WorktreesRootWtEpicMergeRun -> WorktreesRootWtEpicT_merge: "works — assemble"
WorktreesRootWtEpicE2eRun -> WorktreesRootWtEpicT_e2e: "works — journeys"
WorktreesRootWtEpicT_merge -> WorktreesRootWtEpicT_e2e
WorktreesRootWtEpicEpicReviewRun -> WorktreesRootWtEpicT_epicReview: "works — PR comments"
WorktreesRootWtEpicT_e2e -> WorktreesRootWtEpicT_epicReview
`;case`errorMap`:return`direction: down

Dispatcher: {
  label: "bo loop — the dispatcher"
}
Hook: {
  label: "hooks/worker-stop.sh — the Stop hook"
}
Errors: {
  label: "The alarm vocabulary"

  LabelAmbiguous: {
    label: "ERROR reason=label-ambiguous"
  }
  MetadataMissing: {
    label: "ERROR reason=metadata-missing"
  }
  BranchBusy: {
    label: "ERROR reason=branch_busy held=N"
  }
  WorktreeFailed: {
    label: "ERROR reason=worktree-failed"
  }
  WorkerNotDispatched: {
    label: "ERROR reason=worker-not-dispatched"
  }
  EpicPrFailed: {
    label: "ERROR reason=epic-pr-failed step=…"
  }
  FrontierEmpty: {
    label: "reason=frontier_empty"
  }
  TowerStalled: {
    label: "reason=tower_stalled waiting=N"
  }
  MaxParallelStalled: {
    label: "max_parallel_stalled"
  }
  NotDeclaredDone: {
    label: "ERROR reason=not-declared-done"
  }
  NoPrTarget: {
    label: "ERROR reason=no-pr-target"
  }
}

Dispatcher -> Errors.LabelAmbiguous
Dispatcher -> Errors.MetadataMissing
Dispatcher -> Errors.BranchBusy
Dispatcher -> Errors.WorktreeFailed
Dispatcher -> Errors.WorkerNotDispatched
Dispatcher -> Errors.EpicPrFailed
Dispatcher -> Errors.FrontierEmpty
Dispatcher -> Errors.TowerStalled
Dispatcher -> Errors.MaxParallelStalled
Hook -> Errors.NotDeclaredDone
Hook -> Errors.NoPrTarget
`;default:throw Error(`Unknown viewId: `+e)}};export{e as d2Source};