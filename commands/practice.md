---
description: Practice a specific Devspeak scenario by id. Usage: /devspeak:practice [scenario-id]
---

# /devspeak:practice

Arguments: `$ARGUMENTS` (optional) — a scenario id.

1. List the scenario files in `${CLAUDE_PLUGIN_ROOT}/scenarios/` and read each one's frontmatter (`id`, `title`, `min_level`, `persona`).
2. If `$ARGUMENTS` is empty, show the user a numbered list of all available scenarios with their `title` and `min_level`, and ask which one they'd like to practice. Do not start a role-play yet.
3. If `$ARGUMENTS` matches a scenario `id` exactly, read that scenario file in full plus its `persona` file under `${CLAUDE_PLUGIN_ROOT}/skills/devspeak-coach/personas/`. If it's `code-walkthrough`, follow the same git-diff-gathering steps as `/devspeak:explain-code` step 1. If it's `daily-standup`, follow the same git-log-gathering step as `/devspeak:standup` step 2.
4. If `$ARGUMENTS` doesn't match any scenario id, tell the user it wasn't found and show the same list as step 2.
5. Once a scenario and persona are loaded, follow the `devspeak-coach` skill's rules for the entire session.

Begin the role-play with the scenario's opening line (once a valid scenario is selected), then wait for the user's response.
