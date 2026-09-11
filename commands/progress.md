---
description: Show your Devspeak practice progress - sessions, level over time, recurring mistakes, and a suggested next scenario.
---

# /devspeak:progress

1. Run: `node "${CLAUDE_PLUGIN_ROOT}/scripts/progress.mjs" summary --data-dir "${CLAUDE_PLUGIN_DATA}"`
2. If the command reports zero sessions, tell the user they haven't practiced yet and suggest starting with `/devspeak:standup` (a good, low-pressure first scenario). Stop here.
3. Otherwise, present a clear summary to the user (in `explanation_language`, defaulting to pt-BR) covering:
   - Total sessions practiced, and which scenarios.
   - Level over time (from `levelHistory`) — is it trending up?
   - Top recurring mistakes (from `recurringMistakes`), with one concrete example each.
   - A suggested next scenario: prefer one the user hasn't tried yet from `${CLAUDE_PLUGIN_ROOT}/scenarios/`; if all have been tried, suggest the one whose `min_level` best matches their current estimated level, or a harder one if they've been consistently strong.

Keep the summary concise and encouraging — this is a progress check-in, not a report card.
