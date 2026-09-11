---
description: Practice a daily standup update in English with Sarah, the tech lead persona.
---

# /devspeak:diaria

Start a Devspeak role-play session for the `daily-standup` scenario with the `sarah` persona.

1. Read `${CLAUDE_PLUGIN_ROOT}/scenarios/daily-standup.md` and `${CLAUDE_PLUGIN_ROOT}/skills/devspeak-coach/personas/sarah.md` in full.
2. If the current directory is a git repository, run `git log --since=yesterday --oneline` (and `git log --since=yesterday --stat` if the oneline list is short) to get real recent commits. Use these as context so Sarah's follow-up questions reference the user's actual recent work instead of a generic example. If the command isn't run inside a git repo, or there are no commits since yesterday, just proceed with the scenario's generic opening — don't block on this.
3. Follow the `devspeak-coach` skill's rules for the entire session: stay in character as Sarah, one question at a time, adjust to the user's configured or estimated level, end after 4–6 turns or on `done`/`end`, then produce the structured feedback per `references/feedback-rubric.md`.

Begin now with the scenario's opening line (or a natural variant of it that references the real commits if you found any), then wait for the user's response.
