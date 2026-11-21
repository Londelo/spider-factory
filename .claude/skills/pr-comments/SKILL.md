---
name: pr-comments
description: >
  How to post one finding as one comment on a pull request or merge request — GitHub through `gh`, GitLab
  through `glab`. Picking the forge from the remote, proving the PR exists, shaping the comment, pinning it
  to the line it belongs to. Load this BEFORE posting a single comment — the flag you invent from memory is
  usually the other forge's, and a comment posted on the wrong PR is worse than no comment.
  Trigger: "comment on the PR", "comment on the MR", "leave a review comment", "post this to the pull
  request", "inline comment", "gh pr comment", "glab mr note".
---

# PR Comments

This skill owns the **tool** — the forge, the PR, the comment. It does not own what to think about; that is
your agent.

## Pick the forge from the remote

The remote wins over whatever is installed. Neither tool speaks for the other, and if the tool the remote
wants is missing, say which one is missing — never post through the wrong one instead.

| Remote says | Forge | Tool |
|---|---|---|
| `github.com`, GitHub Enterprise | GitHub | `gh` |
| `gitlab.com`, a GitLab instance | GitLab | `glab` |

## Prove the PR exists

Run these from where you are standing — a forge command run from outside the worktree resolves against the
wrong repository and posts your finding to a stranger's PR.

```bash
git remote get-url origin
gh auth status && gh pr view --json number,title,url,baseRefName                    # GitHub
glab auth status && glab mr list --source-branch "$(git branch --show-current)" -F json   # GitLab
```

**If any of them fails, stop and say which.** There is no fallback for a PR that does not exist.

## One finding, one comment

One finding per comment, never folded together, never posted twice. The comment is the whole hand-off: a
fixer may read nothing but this text, so it carries the file and the line, what the code does against what
it should do, the proof, what breaks, and the change you would make.

```markdown
<details>
<summary><h3>N. <short title></h3></summary>

**File:** `path/to/file.ts:42`

**Problem:** what the code does, and what it should do instead.

**Solution:** the change you would make, and why it is the direct one.

**Evidence:** which step exposed this — the trace, a named test failure, the standards check, the
first-principles pass.

**Code:**
`​`​`ts
// the offending lines, short
`​`​`

</details>
```

Both forges render `<details>`. A nit takes the same shape with one `**Suggestion:**` line in place of
Problem/Solution/Code. The file and line go in the **body** as well as in the pin — a reader on the review
tab, or reading the thread by email, never sees the diff.

**Never quote a secret, a token, or a real customer value.** This text is permanent and public to everyone
with repo access.

## Post it

The body goes in a `mktemp` **outside the repository**, always — never a path inside the worktree.

```bash
bodyFile="$(mktemp)"; trap 'rm -f "$bodyFile"' EXIT
```

| | GitHub | GitLab |
|---|---|---|
| Comment on the PR | `gh pr comment --body-file "$bodyFile"` | `glab mr note create -m "$(cat "$bodyFile")"` |
| Neutral review comment | `gh pr review --comment --body-file "$bodyFile"` | `glab mr note create -m "$(cat "$bodyFile")"` |
| Pinned to a line | `jq -Rs --arg p "<file>" --argjson l <line> '{path:$p,line:$l,side:"RIGHT",body:.}' "$bodyFile" \| gh api "repos/{owner}/{repo}/pulls/{pull_number}/comments" --method POST --input -` | `glab mr note create --file "<path>" --line <line> -m "$(cat "$bodyFile")"` |

`gh pr review --comment` files it as neutral so it never accidentally certifies the branch; GitLab has no
neutral verb — a note *is* the review. `glab mr note create` is marked experimental by GitLab; it is still
the documented way to comment, so say you used it if a note goes missing.

Two pinning rules that come from GitHub and not from taste: `side=RIGHT` is the new side of the diff, and a
comment on a line the diff never touched is **rejected**; the path is relative to the repository root with
no leading `/`, and the line is one integer, not a range. GitLab takes `--old-line` for a removed line,
never both, and a range as `10:15`.

Verify any flag you are unsure of against `gh api --help` or `glab api --help` before you fire it — a
rejected `POST` can fail quietly and leave you believing the finding was delivered.

**Never approve and never merge.** `--approve`, `--request-changes`, `glab mr approve`, `glab mr merge` are
the human's decisions, not yours.
