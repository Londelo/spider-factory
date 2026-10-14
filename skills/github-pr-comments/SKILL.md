---
name: github-pr-comments
description: >
  GitHub pull-request commenting through the `gh` CLI: how to find the PR a branch belongs to, how to
  shape one finding into one comment body, how to post it at the line it belongs to, and what to do when
  there is no PR, no `gh`, or no token. Load this BEFORE posting a single comment — the flag you invent
  from memory is usually wrong, and a comment posted on the wrong PR is worse than no comment.
  Trigger: "comment on the PR", "leave a review comment", "post this to the pull request", "inline
  comment", "gh pr comment", "gh pr review".
---

# GitHub PR Comments

You are posting a finding to a pull request. This skill owns the **tool** — finding the PR, shaping the
comment, and putting it in the right place. It does not own **what** to think about; that is your agent.

## Step 0 — Prove the PR exists before you look for it

A comment needs somewhere to land. Confirm each of these and say which one failed if any does:

```bash
git remote -v                                  # which host this repo actually talks to
gh auth status                                 # logged in, and to which host
gh pr view --json number,title,url,baseRefName  # a PR exists for the branch you stand on
```

Run them from where you are standing. A `gh` or `git` command run by absolute path, or from outside the
worktree, resolves against the wrong repository and will happily post your finding to a stranger's PR.

**If any check fails, do not improvise.** There is no fallback that puts a finding on a PR that does not
exist. Write the findings to a file in your worktree, name the file and its full path in your final
message, and say plainly that you found no PR to post to. A finding nobody reads is a failure; a finding
posted to the wrong place is a lie.

## Which host

| Host | Tool | Note |
|---|---|---|
| github.com, GitHub Enterprise | `gh` | this skill |
| GitLab | `glab` | not installed here — do not call it without checking |

`gh` only speaks to GitHub, and only GitHub renders the comment bodies below the way they are described.
If `git remote -v` says GitLab, `gh` will either fail or reach the wrong host. Read the remote before you
trust the tool.

## Shape one finding into one comment

One finding, one comment. Never fold several findings into one body, and never post the same finding twice
because two steps happened to notice it.

**Wrap each one in a collapsible block** so a reader scrolling the diff is not buried:

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

**Whole-PR comment** — for anything not tied to one line:

```bash
gh pr comment --body-file <file>
```

**Review comment** — what a review agent posts. `--comment` files it as neutral, so it never accidentally
certifies the branch:

```bash
gh pr review --comment --body-file <file>
```

Both take `--body` for a short string and `-F`/`--body-file` for text from a file. **Prefer
`--body-file`.** Multi-line text passed through `-b` loses its newlines to the shell, and its backticks
start doing things you did not ask for.

Both accept `--edit-last` (with `--create-if-none`) to revise your own previous comment instead of
stacking a second one, and `--delete-last --yes` to take one back.

## Pinning a comment to a line

Inline comments go through `gh api`, not `gh pr comment`:

```bash
gh api repos/{owner}/{repo}/pulls/{pull_number}/comments \
  --method POST \
  -f path="<file>" -f line=<line> -f side=RIGHT -f body="<the finding>"
```

`{owner}`, `{repo}` and `{pull_number}` are placeholders `gh api` fills from the repository of the current
directory, or from `$GH_REPO`.

**Verify the endpoint and its field names against `gh api --help` and the GitHub documentation before you
post.** This is the one command here not to trust from memory: a rejected `POST` can fail quietly and
leave you believing the finding was delivered.

Two rules that come from GitHub and not from taste:

- `side=RIGHT` means the new side of the diff. A comment on a line the diff never touched is **rejected** —
  so an inline comment belongs only to a line this change actually moved.
- The path must be relative to the repository root with no leading `/`, and the line a single integer, not
  a range.

## Checks before you post anything

1. `gh pr view --json url` — you are about to write on the right PR, and there is only one.
2. Every comment names its file and line, and that line is inside the diff.
3. Nothing in any body quotes a secret, a token, or a real customer value.
4. You are posting **findings**. You are not closing, approving, or merging — `--approve` and
   `--request-changes` are decisions for the human who reads your report, not for you.
