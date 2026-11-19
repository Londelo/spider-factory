#!/usr/bin/env bash
# worker.sh — the brief a worker is handed and the spawn that hands it, sourced by beads-loop/index.sh.
#   The worker is spawned with its cwd inside the worktree; the context file and the done marker are the
#   two things the Stop hook reads back, so both are written before the agent starts.

buildWorkerPrompt() {
    local ticketId="$1" branch="$2" doneFile="$3" agentName="$4" prTarget="$5"
    local stayOnBranchRule
    if [[ "$agentName" == "$leadAgentName" ]]; then
        stayOnBranchRule="5. Stay on \`${branch}\`, in this folder. This ticket is a GATE: you verify the tier it
   stands for, and when it is proved you merge this branch's own pull request into \`${prTarget}\`.
   Never create a branch, never check one out, never rebase, and never a bare \`git commit\` or
   \`git push\` — commit with \`sf commit\` as your agent file tells you, as you go. The merge is the
   forge's own command on the pull request (\`gh pr merge\`, or \`glab mr merge\`), never a local
   \`git merge\` into \`${prTarget}\`."
    else
        stayOnBranchRule="5. Stay on \`${branch}\`, in this folder. Never create a branch, never check one out, never merge,
   never rebase, and never a bare \`git commit\` or \`git push\` — the branch is shared work and
   those are not a worker's calls. Commit as your agent file tells you, as you go. Whatever is
   still uncommitted when you stop becomes one last commit on this branch carrying your ticket's
   title."
    fi
    printf '%s' "Your ticket: $ticketId.
FIRST: bd show --json $ticketId — the description, design notes, and acceptance criteria in that output are your complete brief; read them IN FULL before touching code.

You are standing in the worktree of the branch \`${branch}\`, which is shared by every task in your
feature. Earlier tasks are already committed there — read the log before you assume the tree is clean.

Rules:
1. Keep your claim lease alive — the 5-minute lease must NEVER lapse. Run
   bd heartbeat $ticketId
   between long steps; a lapsed lease reads as death — the reaper takes your ticket back to ready mid-work.
2. Do NOT close your ticket — never run \`bd close\`, whatever the outcome. Keep the lease
   (bd heartbeat $ticketId) and state your proof of work in your final message: what you did and the
   test evidence that proves it. The Stop hook closes $ticketId for you once you declare done; close it
   by hand and the hook walks past it — no commit, no push, no PR, your work never lands.
3. If the brief needs more work than you can finish: write a beads comment on $ticketId
   describing exactly what remains (check bd comment --help). Never half-do and hide it.
4. Spawn nothing. Work nothing but $ticketId. You and your ticket are one and the same.
${stayOnBranchRule}
6. Declare that you finished, and declare nothing else. As your VERY LAST action, and only when
   the brief is genuinely complete and you would hand it to a human as it stands, run:
   touch '$doneFile'
   If you ran out of room, hit a blocker, or left something for the next worker, do not create
   that file — the ticket then stays open and the tasks behind yours wait for you."
}

doneFileFor() { printf '%s' "$logDir/done-${1//\//+}"; }

spawnFileFor() { printf '%s' "$logDir/spawn-${1//\//+}"; }

contextFileFor() { printf '%s' "$logRoot/worker-context/${1//\//+}"; }

spawnWorker() {
    local worktreePath="$1" ticketId="$2" agentName="$3" branch="$4" prTarget="$5" label="$6" doneFile="$7" spawnFile="$8" contextFile="$9" kind="${10:-task}"
    mkdir -p "$(dirname "$contextFile")" 2>/dev/null
    { printf 'ticket=%s\n' "$ticketId"
      printf 'branch=%s\n' "$branch"
      printf 'pr_target=%s\n' "$prTarget"
      printf 'agent=%s\n' "$agentName"
      printf 'label=%s\n' "$label"
      printf 'tower=%s\n' "$towerDir"
      printf 'done_file=%s\n' "$doneFile"
      printf 'kind=%s\n' "$kind"
    } >"$contextFile.tmp" && mv -f "$contextFile.tmp" "$contextFile"
    ( cd "$worktreePath" \
        && SF_TICKET="$ticketId" SF_BRANCH="$branch" SF_PR_TARGET="$prTarget" \
           SF_AGENT="$agentName" SF_LABEL="$label" \
           SF_PROJECT_DIR="$towerDir" SF_LOG_DIR="$logDir" SF_DONE_FILE="$doneFile" \
           $agentCommand --bg --agent "$agentPluginName:$agentName" --permission-mode bypassPermissions \
           "$(buildWorkerPrompt "$ticketId" "$branch" "$doneFile" "$agentName" "$prTarget")" ) >"$spawnFile" 2>&1
}

dispatchWorker() {
    local ticketId="$1" agentName="$2" branch="$3" prTarget="$4" label="$5"
    local worktreePath worktreeAside worktreeFailure doneFile spawnFile contextFile

    boIdent agent "$agentName"

    if ! ensureWorktree "$branch" "$prTarget" || [[ -z "$worktreePath" ]]; then
        boIdent worktree "$(worktreePathFor "$branch")"
        case "$worktreeFailure" in
            unpushed-commits)
                logTo errors "reason=branch-has-unpushed-commits msg=\"$(formatMessage "$msgBranchHasUnpushedCommitsTemplate" "$branch")\""
                ;;
            no-start)
                logTo errors "reason=worktree-failed step=no-start msg=\"$(formatMessage "$msgNoStartingCommitTemplate" "$branch" "$prTarget")\""
                ;;
            folder-immovable)
                logTo errors "reason=worktree-failed step=stray-folder msg=\"$(formatMessage "$msgStrayFolderImmovableTemplate" "$worktreePath")\""
                ;;
            *)
                logTo errors "reason=worktree-failed msg=\"$(formatMessage "$msgWorktreeCouldNotBeMadeTemplate" "$branch" "$prTarget")\""
                ;;
        esac
        return 1
    fi
    boIdent worktree "$worktreePath"
    [[ -n "$worktreeAside" ]] &&
        logTo errors "reason=worktree-folder-moved-aside msg=\"$(formatMessage "$msgWorktreeFolderMovedAsideTemplate" "${worktreeAside##*/}")\""

    doneFile="$(doneFileFor "$ticketId")"
    spawnFile="$(spawnFileFor "$ticketId")"
    contextFile="$(contextFileFor "$branch")"
    rm -f "$doneFile"
    if ! spawnWorker "$worktreePath" "$ticketId" "$agentName" "$branch" "$prTarget" "$label" "$doneFile" "$spawnFile" "$contextFile"; then
        logTo errors "reason=worker-not-dispatched msg=\"$(lastLineOf "$spawnFile")\""
        releaseClaim "$ticketId"
        return 1
    fi

    boIdent session "$(sessionFromSpawn "$spawnFile")"
    claimedThisRun=$((claimedThisRun + 1))
    logTo claims "reason=dispatched"
}
