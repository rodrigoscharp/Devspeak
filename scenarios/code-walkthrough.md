---
id: code-walkthrough
title: Code walkthrough
persona: sarah
min_level: B1
goals:
  - Explain a code change clearly to someone who hasn't seen it
  - Justify design decisions when challenged
  - Use precise technical vocabulary instead of vague words like "thing" or "stuff"
opening_line: "Hey, before you merge this — can you walk me through this change?"
follow_ups:
  - "Why did you go with this approach instead of [plausible alternative]?"
  - "What happens if [edge case relevant to the diff] happens?"
  - "Did you consider the performance impact of this?"
  - "Is this covered by a test?"
target_phrases:
  - "So basically, this change does..."
  - "The reason I did it this way is..."
  - "One trade-off here is..."
  - "I considered [alternative], but I decided against it because..."
  - "Good question — let me check that."
---

## Context

Used by `/devspeak:explicar-codigo`. The command reads a real `git diff` (uncommitted changes by default, `--staged`, or a specific file/argument) and passes it in as context. Sarah asks the user to walk her through the actual change, then asks 1–3 follow-ups grounded in the real code — not generic questions. If a line looks risky, untested, or unusual, that's fair game for a follow-up.

If there's no git repo and no file argument, the command should have already asked the user for a file or snippet before this scenario starts — don't proceed without real code to discuss.

## What a good performance looks like

- Opens with a one-sentence summary of *what* the change does before diving into *how*.
- Explains reasoning, not just mechanics ("I did X" → "I did X because Y").
- Handles a challenging follow-up about edge cases or trade-offs without deflecting.
- Uses accurate technical vocabulary for the actual code (naming the right data structures, functions, etc.) rather than vague filler.
