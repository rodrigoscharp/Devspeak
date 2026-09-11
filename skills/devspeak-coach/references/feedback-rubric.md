# Feedback rubric

Applied at the end of every role-play session (or in brief inline form when `correction_mode` is `inline`). Explanations follow the user's `explanation_language` setting; persona dialogue itself always stays in English.

## Rubric criteria

Evaluate the session on five axes:

1. **Clarity** — could a native-speaking teammate follow the point without re-reading?
2. **Grammar** — verb tenses, articles, prepositions, subject-verb agreement, plurals.
3. **Technical vocabulary** — correct, natural terms for the dev/PM context (not literal translations from Portuguese).
4. **Naturalness / fluency** — contractions, natural phrasing, no overly formal or textbook-sounding sentences, reasonable turn length.
5. **Structure** — appropriate for the situation. Example: a standup answer should follow yesterday → today → blockers; a PR defense should state the decision, then the reasoning, then acknowledge the trade-off.

## CEFR levels, with dev-context examples

- **A2** — Simple, short sentences. Present/past simple only. Frequent word-for-word translation from Portuguese ("I have five years of experience" instead of "I've been working for five years"). Limited connectors (and, but, because). Understandable but effortful for the listener.
  - Example: "Yesterday I fix the bug. Today I do the deploy."

- **B1** — Can describe technical work with reasonable clarity but grammar slips are frequent (tense mixing, prepositions). Vocabulary is functional but sometimes generic ("do a thing" instead of a precise verb). Can handle a standup or a simple code walkthrough unaided.
  - Example: "I fixed the bug yesterday and today I'm working in the deploy to production."

- **B2** — Comfortable holding a full technical conversation, including some back-and-forth and clarifying questions. Fewer grammar errors, mostly with prepositions or fixed expressions. Can defend a decision and push back politely. Occasional false cognates slip through.
  - Example: "I actually decided to cache the response because the endpoint was getting hit pretty often, so it made sense to avoid the extra round trip."

- **C1** — Near-native fluency in technical contexts. Naturally uses idiomatic workplace expressions, hedges appropriately ("I'd lean towards...", "my only concern is..."), and adjusts register for the audience (more casual with engineers, more precise with PMs). Errors are rare and don't affect comprehension.
  - Example: "Honestly, I went back and forth on this — caching felt like the pragmatic call given our traffic pattern, but I'm open to revisiting it if the invalidation logic gets messy."

## Feedback output format

1. **Estimated CEFR level for this session** + one sentence justifying it.
2. **Corrections table** (max 6 rows, prioritized by what most hurts comprehension):

   | You said | Natural form | Why (pt-BR) |
   |---|---|---|
   | ... | ... | ... |

3. **Strengths** — 2–3 concrete, specific things the user did well (not generic praise).
4. **Useful phrases for this situation** — 3–5 phrases tied to the scenario type (standup, PR review, incident, etc.).
5. **Recurring mistakes** — call `node "${CLAUDE_PLUGIN_ROOT}/scripts/progress.mjs" recurring --limit 5 --data-dir "${CLAUDE_PLUGIN_DATA}"` and mention if any mistake from this session matches a category that already appeared before.
6. **One-minute micro-exercise** targeting the single most impactful error from this session.
7. **Save the session**:

   ```
   node "${CLAUDE_PLUGIN_ROOT}/scripts/progress.mjs" add-session \
     --data-dir "${CLAUDE_PLUGIN_DATA}" \
     --scenario "<scenario-id>" \
     --level "<CEFR>" \
     --mistakes '<JSON array of {"category","said","correct"}>'
   ```
