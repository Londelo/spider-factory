---
name: pr-comments
description: >
  Pull-request and merge-request commenting, on GitHub through `gh` or on GitLab through `glab`: how to
  pick the forge from the remote before you touch a tool, how to find the PR or MR a branch belongs to,
  how to shape one finding into one comment body, how to post it at the line it belongs to, and what to do
  when there is no PR, no CLI, or no token. Load this BEFORE posting a single comment — the flag you invent
  from memory is usually the other forge's, and a comment posted on the wrong PR is worse than no comment.
  Trigger: "comment on the PR", "comment on the MR", "leave a review comment", "post this to the pull
  request", "inline comment", "gh pr comment", "glab mr note".
---

# PR Comments

You are posting a finding to a pull request. This skill owns the **tool** — picking the forge, finding the
PR, shaping the comment, and putting it in the right place. It does not own **what** to think about; that
is your agent.

## Step 0 — Prove the PR exists before you look for it

A comment needs somewhere to land. Confirm each of these and say which one failed if any does:

```bash
git remote get-url origin                        # which forge this repo actually talks to
gh auth status                                   # GitHub only: logged in, and to which host
glab auth status                                 # GitLab only: logged in, and to which instance
gh pr view --json number,title,url,baseRefName   # GitHub: a PR exists for the branch you stand on
glab mr list --source-branch "$(git branch --show-current)" -F json   # GitLab: same question
```

Run them from where you are standing. A `gh`, `glab` or `git` command run by absolute path, or from outside
the worktree, resolves against the wrong repository and will happily post your finding to a stranger's PR.

**If any check fails, do not improvise.** There is no fallback that puts a finding on a PR that does not
exist, and **there is no findings file** — never write one into the worktree. `sf commit` runs `git add -A`,
so anything you leave in the tree rides onto the branch you are supposed to be judging. Report the failure
in your final message instead, naming each finding you could not post and why, and say plainly that you
found no PR to post to. A finding nobody reads is a failure; a finding posted to the wrong place is a lie,
and a finding committed onto the branch under review is both.

## Which forge

**Read the remote, then run the tool that matches it.** The remote wins over whatever is installed,
because a repo that talks to GitLab will not be served by `gh` however many `gh` commands you invent.

| Remote says | Forge | Tool | Find the PR |
|---|---|---|---|
| `github.com`, GitHub Enterprise | GitHub | `gh` | `gh pr view --json url` |
| `gitlab.com`, a GitLab instance | GitLab | `glab` | `glab mr list --source-branch <branch> -F json` |

Two rules that come from the forges and not from taste:

- **Neither tool speaks for the other.** `gh` cannot post to GitLab and `glab` cannot post to GitHub, so
  a machine with both installed still has to be told which one this repo belongs to.
- **If the tool the remote wants is not installed, that is the failure.** Say which one is missing. Do not
  post through the wrong one instead.

`glab mr note create` is marked experimental by GitLab. It works, and it is the documented way to comment;
mention that you used it if a note goes missing.

## Shape one finding into one comment

One finding, one comment. Never fold several findings into one body, and never post the same finding twice
because two steps happened to notice it.

**Wrap each one in a collapsible block** so a reader scrolling the diff is not buried. Both forges render
`<details>` — GitLab renders it, GitHub renders it:

```markdown
<details>
<summary><h3>N. <short title></h3></summary>

**Problem:** what the code does, and what it should do instead.

**Solution:** the change you would make, and why it is the direct one.

**Evidence:** which step of your work exposed this — the call-chain trace, the trace logs, a named test
failure, the standards check, or the first-principles pass.

**Code:**
`​`​`ts
// the offending lines, short
`​`​`

</details>
```

A nit takes the same shape with a single `**Suggestion:**` line in place of Problem/Solution/Code.

**Put the file and line in the body too**, even when you also attach the comment inline at that line. A
reader who reaches the review tab first, or who reads the thread by email, never sees the diff — a comment
that only says "here" has said nothing.

**Never quote a secret, a token, or a real customer value.** You are about to make this text permanent and
public to everyone with repo access.

## Where the text goes

| Where | Use it for |
|---|---|
| Inline, pinned to the line | a defect at one specific line the diff touched |
| The review body | the whole picture — the three questions you answered, and anything cross-cutting |
| Nowhere | a nit too small to be worth a reader's time. Say so in the body rather than dropping it silently |

## Posting

**Write the body to a file and post the file.** Both forges read a body from stdin, and only from stdin or
a flag — passing multi-line text with backticks through `-m` or `-b` hands them a shell problem instead of
a comment.

| | GitHub | GitLab |
|---|---|---|
| Whole-PR comment | `gh pr comment --body-file <file>` | `glab mr note create <file` |
| Review comment (neutral) | `gh pr review --comment --body-file <file>` | `glab mr note create <file` |
| Revise your own last one | `gh pr comment --edit-last --create-if-none --body-file <file>` | `glab mr note update` |
| Take it back | `gh pr comment --delete-last --yes` | `glab mr note delete` |

GitLab has no neutral-review verb — a note *is* the review. Post the whole picture as one note.

**Never approve and never merge** — those are decisions for the human who reads your report. **Resolving is
yours**, and only for the comments you posted yourself, once the fix you asked for has actually landed:

```bash
# GitHub — a thread is resolved by its node id, never by the comment id
gh api graphql -f query='
  mutation ($id: ID!) { resolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }' \
  -f id="$threadId"
# the ids come from the same query, read first:
gh api graphql -f query='
  query ($owner: String!, $repo: String!, $n: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $n) { reviewThreads { nodes { id isResolved } } } } }' \
  -f owner="$owner" -f repo="$repo" -F n="$number"

# GitLab — a discussion is resolved through the REST API; glab has no resolve verb
glab api --method PUT "projects/:id/merge_requests/$iid/discussions/$discussionId" -f resolved=true
```

Confirm the shape with `gh api --help` or `glab api --help` before you fire it — a resolve call that
silently no-ops leaves a finding hanging open that the board says is closed. Resolve only what you posted,
only after the fix is on the branch, and never a comment somebody else wrote.

`gh pr review --comment` files it as neutral so it never accidentally certifies the branch.

## Pinning a comment to a line

**GitHub** — inline comments go through `gh api`, not `gh pr comment`:

```bash
gh api repos/{owner}/{repo}/pulls/{pull_number}/comments \
  --method POST \
  -f path="<file>" -f line=<line> -f side=RIGHT -f body="<the finding>"
```

`{owner}`, `{repo}` and `{pull_number}` are placeholders `gh api` fills from the repository of the current
directory, or from `$GH_REPO`. Verify the endpoint and its field names against `gh api --help` and the
GitHub documentation before you post — a rejected `POST` can fail quietly and leave you believing the
finding was delivered.

Two rules that come from GitHub and not from taste:

- `side=RIGHT` means the new side of the diff. A comment on a line the diff never touched is **rejected** —
  so an inline comment belongs only to a line this change actually moved.
- The path must be relative to the repository root with no leading `/`, and the line a single integer, not
  a range.

**GitLab** — inline comments go through the command, not the API:

```bash
glab mr note create --file "<path>" --line <line> -m "<the finding>"
```

`--line` is the new side; `--old-line` is a removed line; they cannot both be used. A range is `10:15`,
which GitHub cannot express. Omit both to leave a file-level comment. The path is relative to the
repository root.

## Checks before you post anything

1. The remote named the forge, and you are holding the tool that matches it.
2. `gh pr view --json url` / `glab mr list --source-branch <branch> -F json` — you are about to write on
   the right PR, and there is only one.
3. Every comment names its file and line, and that line is inside the diff.
4. Nothing in any body quotes a secret, a token, or a real customer value.
5. You are posting **findings**. You are not closing, approving, or merging — `--approve`,
   `--request-changes`, `glab mr approve` and `glab mr merge` are decisions for the human who reads your
   report, not for you.
