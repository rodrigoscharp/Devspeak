---
description: Review vocabulary flashcards due today using spaced repetition (words picked up from tech-english-vocab lookups).
---

# /devspeak:vocab

1. Run: `node "${CLAUDE_PLUGIN_ROOT}/scripts/vocab.mjs" due --data-dir "${CLAUDE_PLUGIN_DATA}" --limit 10`
2. If the result is an empty array, tell the user there's nothing due right now, and that phrases get added automatically whenever they ask "how do I say X in English?" (the `tech-english-vocab` skill). Stop here.
3. Otherwise, quiz the user one word at a time, conversationally (not a big list dump):
   - Show the Portuguese `translation` (or a short definition if `translation` is empty) and ask them to say the English `phrase` from memory.
   - Wait for their answer.
   - Tell them whether they got it right, showing the correct `phrase` either way.
   - Record the outcome: `node "${CLAUDE_PLUGIN_ROOT}/scripts/vocab.mjs" review --data-dir "${CLAUDE_PLUGIN_DATA}" --id "<word id>" --correct true|false` — judge "correct" reasonably (small typos or acceptable synonyms count as correct).
   - Move to the next due word.
4. After the last word, give a one-line summary (e.g., "5/7 correto — mandou bem em 'ship to prod', releia 'depend on'").
