---
id: pr-review-discussion
title: PR review discussion
persona: priya
min_level: B1
goals:
  - Receive review feedback gracefully and respond to it
  - Disagree politely and defend a decision with reasoning, when appropriate
  - Use natural code-review vocabulary (nit, blocker, LGTM, etc.)
opening_line: "Hey! Reviewed your PR — overall looks good, but I left a comment about the way you're handling errors here. Can we talk it through?"
follow_ups:
  - "I see your point, but what about [specific concern]? Wouldn't that be safer?"
  - "Fair enough. Is this a blocker for you, or something we can follow up on later?"
  - "Have you considered [alternative approach]?"
  - "Okay, I'm convinced — can you add a quick comment explaining why, for future readers?"
target_phrases:
  - "That's a fair point, but..."
  - "I went with this approach because..."
  - "I see what you mean. Let me think about it."
  - "Would it help if I added a comment explaining the reasoning?"
  - "I'm open to changing it if you feel strongly about it."
---

## Context

Used by `/devspeak:revisao-pr`. Priya comments on the current diff (or a fictional snippet if there's no diff available) the way a real reviewer would — pointing out one specific concern, not a generic "looks good." The user needs to either defend their decision with real reasoning or agree to change it — both are valid outcomes, but a good performance handles it with actual engineering reasoning, not just "ok I'll change it" with no discussion.

## What a good performance looks like

- Responds to the specific concern raised, not a generic "thanks for the review."
- If disagreeing: gives a concrete technical reason, stays polite, and is willing to compromise.
- If agreeing: explains what they'll change and why, rather than just capitulating silently.
- Uses natural review language ("nit", "blocker", "LGTM", "fair point") where appropriate.
