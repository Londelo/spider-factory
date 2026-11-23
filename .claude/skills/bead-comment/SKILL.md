---
name: bead-comment
description: >
  How to WRITE on a beads (`bd`) ticket without touching its status, its fields, or its claim: the
  comment. A comment is the only thing a worker may put on its own ticket besides its fields — the result
  of the work, what remains when the brief outruns you, a gap you found in someone else's tier, a conflict
  you could not settle, a question the next reader has to answer. Two commands carry the whole surface: `bd comment
  <id> "text"` writes one, `bd comments <id>` reads them back — the singular `comment` has no list
  subcommand, and `bd comments list` is not a command at all. Use it whenever an instruction says "put a
  comment on the ticket", "note what remains", or "report it on the ticket", whenever an agent file tells
  you to report your result on your ticket, and whenever you are about to stop work with something
  unfinished, unstated, or unproved. Writing is the only thing this skill
  does: it never claims, never closes, never edits a field — reading the ticket is `bead-read`, authoring
  tickets is `bead-create`.
  Trigger: "comment on the ticket", "put a comment on", "note what remains", "write what remains",
  "report your result on the ticket", "report it on the ticket", "bd comment", "bd comments",
  "leave a note for the next worker".
---

# Commenting on a bead

## What a comment is for

Nothing survives the handoff but the ticket — your final message dies with your session. A worker that
stops with something unsaid leaves the next reader — a human, or a fresh session of the same agent — to
discover it by accident. So the rule the whole tower runs on: **report what you did and write what
remains; never half-do and hide it.**

A comment is how that gets written. It is not a status, not a close, and not a substitute for the final
message — it is the part of the report that has to outlive the session and be findable on the ticket.

Five things belong on a ticket as a comment, and nothing else belongs there:

- **Your own result** — what you did and what proved it: the files, the command you ran, what it answered.
  The diff shows the change; it does not show that you proved it.
- **What remains** — the brief outran you: name exactly what is not done, and where you stopped.
- **A gap in a tier that is not yours** — a hole you found while working, which is another ticket's job.
  Report it; never patch it, never file a ticket for it.
- **Something you could not settle** — an unresolved conflict, a red suite you did not cause, a decision
  you took on an assumption.
- **Anything the next reader cannot infer from the diff** — a file you deliberately left alone, a test
  you could not run and why.

## The command surface

```bash
bd comment <id> "text"                 # write one comment — shorthand for `bd comments add`
bd comment <id> --stdin <<<"text"      # write one from a pipe (multi-line, no quoting fights)
bd comment <id> --file notes.txt       # write one from a file (a long report)
bd comments <id>                       # read every comment on the ticket, oldest first
bd comments <id> --json                # the same, parseable
```

Three traps, each one silent:

- **`bd comment` writes and cannot read.** There is no `bd comment list`. Reading is the plural:
  `bd comments <id>`.
- **`bd comments list` is not a command.** It is registered only to tell you so. Listing is
  `bd comments <id>` with the id as the argument.
- **A missing id is an error, not an empty list.** `bd comments` with no id refuses to run.

Read the comments back before you add one: the ticket may already carry the note, and a second copy of it
is noise that buries the first.

## How to write one

- **One comment per thing.** What remains is one comment; a gap in another tier is another. A single
  wall of text separates nothing from a report nobody reads.
- **Say where it lives.** A file, a function, a branch, a journey, a seam — "the validation is missing"
  is a riddle, "the validator at `src/x.ts` has no empty-input branch" is a report.
- **Name what you would do next.** The comment is for whoever picks this up cold, and the next step is
  the part they cannot guess.
- **Never put secrets, tokens, or credentials in a comment.** A ticket is a row in a database that gets
  pushed, synced, and read by every worker in the tower.
- **Quote nothing you have not read.** A comment about another ticket names the id and says what you
  read; it does not paraphrase a ticket you never opened.

## What a comment never does

| It does | It never does |
|---|---|
| Says what you did, what remains, what you found, what you could not settle | Close, claim, unclaim, or change a status — that is `bd close`, `bd ready --claim`, and the loop's business |
| Carries your result and what remains past the end of your session | Replace your final message, which is the live report to whoever is watching right now |
| Reports a gap in another tier | File the ticket that gap needs — the tower's shape is the plan agents' business |
| Records a decision and its assumption | Edit the description or the acceptance criteria — those are the plan's words, not yours |

Reading the ticket — its description, what blocks it, the gate above it — is `bead-read`. Creating tickets
is `bead-create`. This skill writes comments and nothing else.
