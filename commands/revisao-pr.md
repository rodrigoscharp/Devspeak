---
description: Practice responding to PR review comments in English with Priya, the senior engineer persona.
---

# /devspeak:revisao-pr

Start a Devspeak role-play session for the `pr-review-discussion` scenario with the `priya` persona.

1. Determine what code Priya is reviewing:
   - If the current directory is a git repository, run `git diff` (uncommitted changes), falling back to `git diff --staged`, then `git show HEAD` if both are empty.
   - If there's no git repo or no diff at all, use this fictional snippet as the review subject instead (don't block the user — just proceed):

     ```js
     async function getUser(id) {
       const res = await fetch(`/api/users/${id}`);
       const data = await res.json();
       return data;
     }
     ```

     A plausible review comment for this snippet: no error handling for a failed fetch or non-200 response.
2. Read `${CLAUDE_PLUGIN_ROOT}/scenarios/pr-review-discussion.md` and `${CLAUDE_PLUGIN_ROOT}/skills/devspeak-coach/personas/priya.md` in full.
3. Follow the `devspeak-coach` skill's rules for the entire session. Priya's opening comment must reference one specific, real concern in the actual diff or the fallback snippet — not a generic "looks good."

Begin now with Priya's opening review comment, then wait for the user's response defending or accepting it.
