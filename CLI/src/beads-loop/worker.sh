#!/usr/bin/env bash
# worker.sh — the brief a worker is handed and the spawn that hands it, sourced by beads-loop/index.sh.
#   The worker is spawned with its cwd inside the worktree; the context file is what the Stop hook and
#   `sf commit` read back, so it is written before the agent starts. The spawn sets no environment: a
#   `claude --bg` session gets its environment frozen by the shared daemon at the run's first spawn, so
#   anything the worker or its hook could read from it would be another worker's. The prompt carries every
#   fact the worker needs as a literal, and the context file carries the same facts for the CLI to read.

buildWorkerPrompt() {
    local ticketId="$1" branch="$2" agentName="$3" prTarget="$4"
    local stayOnBranchRule
    if [[ "$agentName" == "$leadAgentName" ]]; then
        stayOnBranchRule="4. Stay on \`${branch}\`, in this folder. This ticket is a GATE: you verify the tier it
   stands for, and when it is proved you merge this branch's own pull request into \`${prTarget}\`.
   Never create a branch, never check one out, never rebase, and never a bare \`git commit\` or
   \`git push\` — commit with \`sf commit\` as your agent file tells you, as you go. The merge is the
   forge's own command on the pull request (\`gh pr merge\`, or \`glab mr merge\`), never a local
   \`git merge\` into \`${prTarget}\`."
    else
        stayOnBranchRule="4. Stay on \`${branch}\`, in this folder. Never create a branch, never check one out, never merge,
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
1. Ground every beads command before you run it. Your database is the tower at \`$towerDir\`, and \`bd\`
   finds it by walking **up** from wherever you happen to be standing, so one stray \`cd\` has you reading
   somebody else's tower. Run \`bd where\`; it must name that database. When it names another one, put
   \`-C '$towerDir'\` on every beads command you run from then on and say so in your report — never \`cd\`
   into a tower that is not yours.
2. Keep your claim lease alive — the 5-minute lease must NEVER lapse. Run
   bd heartbeat $ticketId
   between long steps. Nothing in this system reaps a lapsed lease, so nothing will tell you it lapsed —
   but \`bd reclaim\` is one command away for a person, and it hands your ticket to another worker mid-work.
3. Do NOT close your ticket — never run \`bd close\`, whatever the outcome. Keep the lease
   (bd heartbeat $ticketId) and state your proof of work in your final message: what you did and the
   test evidence that proves it. Finish the work before you stop — stopping is what finishes the ticket:
   the Stop hook closes $ticketId for you when your turn ends. Close it by hand and the hook walks past
   it — no commit, no push, no PR, your work never lands.
$stayOnBranchRule"
}

spawnFileFor() { printf '%s' "$logDir/spawn-${1//\//+}"; }

contextFileFor() { printf '%s' "$logRoot/worker-context/${1//\//+}"; }

spawnWorker() {
    local worktreePath="$1" ticketId="$2" agentName="$3" branch="$4" prTarget="$5" label="$6" spawnFile="$7" contextFile="$8" kind="${9:-task}"
    mkdir -p "$(dirname "$contextFile")" 2>/dev/null
    { printf 'ticket=%s\n' "$ticketId"
      printf 'branch=%s\n' "$branch"
      printf 'pr_target=%s\n' "$prTarget"
      printf 'agent=%s\n' "$agentName"
      printf 'label=%s\n' "$label"
      printf 'tower=%s\n' "$towerDir"
      printf 'kind=%s\n' "$kind"
    } >"$contextFile.tmp" && mv -f "$contextFile.tmp" "$contextFile"
    spawnFailure=""
    spawnBackgroundAgent "$agentName" "$worktreePath" \
        "$(buildWorkerPrompt "$ticketId" "$branch" "$agentName" "$prTarget")" "$spawnFile" \
        "$agentName:$ticketId" || {
        spawnFailure="launcher-failed"
        return 1
    }
    checkBackgroundAgentLoaded "$agentName" "$(getSpawnedAgent "$spawnFile")" || {
        spawnFailure="agent-not-loaded"
        return 1
    }
}

dispatchWorker() {
    local ticketId="$1" agentName="$2" branch="$3" prTarget="$4" label="$5"
    local worktreePath worktreeAside worktreeFailure spawnFailure spawnFile contextFile

    setLogField agent "$agentName"

    if ! ensureWorktree "$branch" "$prTarget" || [[ -z "$worktreePath" ]]; then
        setLogField worktree "$(worktreePathFor "$branch")"
        case "$worktreeFailure" in
            unpushed-commits)
                writeLog errors "reason=branch-has-unpushed-commits msg=\"$(formatMessage "$msgBranchHasUnpushedCommitsTemplate" "$branch")\""
                ;;
            no-start)
                writeLog errors "reason=worktree-failed step=no-start msg=\"$(formatMessage "$msgNoStartingCommitTemplate" "$branch" "$prTarget")\""
                ;;
            folder-immovable)
                writeLog errors "reason=worktree-failed step=stray-folder msg=\"$(formatMessage "$msgStrayFolderImmovableTemplate" "$worktreePath")\""
                ;;
            *)
                writeLog errors "reason=worktree-failed msg=\"$(formatMessage "$msgWorktreeCouldNotBeMadeTemplate" "$branch" "$prTarget")\""
                ;;
        esac
        return 1
    fi
    setLogField worktree "$worktreePath"
    [[ -n "$worktreeAside" ]] &&
        writeLog errors "reason=worktree-folder-moved-aside msg=\"$(formatMessage "$msgWorktreeFolderMovedAsideTemplate" "${worktreeAside##*/}")\""

    spawnFile="$(spawnFileFor "$ticketId")"
    contextFile="$(contextFileFor "$branch")"
    if ! spawnWorker "$worktreePath" "$ticketId" "$agentName" "$branch" "$prTarget" "$label" "$spawnFile" "$contextFile"; then
        if [[ "$spawnFailure" == "agent-not-loaded" ]]; then
            writeLog errors "reason=agent-not-loaded msg=\"$agentLoadFailure\""
            releaseClaim "$ticketId"
            die "the $agentName agent never loaded for $ticketId — $agentLoadFailure. The run stops here: every worker left in it would be the same worker without an agent."
        fi
        writeLog errors "reason=worker-not-dispatched msg=\"$(lastLineOf "$spawnFile")\""
        releaseClaim "$ticketId"
        return 1
    fi

    setLogField session "$(getSpawnedAgent "$spawnFile")"
    claimedThisRun=$((claimedThisRun + 1))
    writeLog claims "reason=dispatched"
}
