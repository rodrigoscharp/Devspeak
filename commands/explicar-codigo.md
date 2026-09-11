---
description: Practice explaining a code change in English to Sarah, the tech lead persona. Usage:/devspeak:explicar-codigo [file|--staged]
---

# /devspeak:explicar-codigo

Start a Devspeak role-play session for the `code-walkthrough` scenario with the `sarah` persona, using real code as the topic.

Arguments: `$ARGUMENTS` (optional) — either `--staged`, or a path to a specific file.

1. Determine the code to discuss, in this priority order:
   - If `$ARGUMENTS` is `--staged`, run `git diff --staged`.
   - If `$ARGUMENTS` is a file path, read that file's contents (and `git diff -- <path>` if it's a tracked file with uncommitted changes).
   - If `$ARGUMENTS` is empty and the current directory is a git repository, run `git diff` (uncommitted changes). If that's empty, try `git diff --staged`, then `git show HEAD` (last commit) as a fallback so there's always something concrete to discuss.
   - If there's no git repository and no argument, stop and ask the user to paste a snippet or point you to a file — do not start the role-play without real code.
2. Read `${CLAUDE_PLUGIN_ROOT}/scenarios/code-walkthrough.md` and `${CLAUDE_PLUGIN_ROOT}/skills/devspeak-coach/personas/sarah.md` in full.
3. Follow the `devspeak-coach` skill's rules for the entire session. Sarah's opening line and follow-ups must reference the actual diff/file content you gathered in step 1 — name real functions, files, or lines instead of speaking generically.
4. Remember: during the role-play, do not write or edit any code yourself — you're only discussing it in English.

Begin now with Sarah's opening line, adapted to reference the real change, then wait for the user's response.
