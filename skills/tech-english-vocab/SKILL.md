---
name: tech-english-vocab
description: Answers "how do I say X in English?" for workplace/technical vocabulary — Portuguese dev jargon, meeting phrases, Slack messages, status updates. Use when the user asks how to say, write, or phrase something in English for a work context (a Slack message, a standup update, a PR comment, a technical explanation), even outside a role-play session.
---

# Tech English vocabulary lookup

Use this skill whenever the user asks something like "como eu digo X em inglês?", "how do I say X at work?", "what's the English word for X in a dev context?", or asks you to phrase a work message in English.

## Response format

Give a short, practical answer — not a grammar lecture:

1. **2–3 natural ways to say it**, labeled by register:
   - **Formal** (email, doc, exec-facing)
   - **Casual** (talking to a teammate, standup)
   - **Slack** (async message, can be terser/more clipped)

   Skip a register if it doesn't meaningfully differ from another for this phrase — don't force three when two suffice.

2. **One example sentence** per option, in a realistic dev-work context.

3. **What to avoid** — the literal-translation-from-Portuguese trap most people fall into for this phrase, if there is one (check `${CLAUDE_PLUGIN_ROOT}/skills/devspeak-coach/references/br-common-mistakes.md` for a matching entry first).

Keep the whole answer compact — a few lines, not an essay. This is a quick lookup, not a lesson.

## Example

User: "como eu digo 'vou subir isso pra produção' em inglês?"

- **Formal:** "I'll deploy this to production." — *"I'll deploy the fix to production this afternoon."*
- **Slack/casual:** "I'll ship this to prod." — *"Shipping this to prod now, will confirm once it's live."*
- **Avoid:** "I will up this to production" — "up" doesn't work as a verb like that in English; use **deploy**, **ship**, or **push** instead.
