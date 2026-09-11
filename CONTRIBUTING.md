# Contributing to Devspeak

Devspeak is content-heavy: most of the value lives in scenarios, personas, and the common-mistakes bank, not in code. Contributions to those are especially welcome.

## Adding a new scenario

Scenarios live in `scenarios/*.md`, one file per scenario, matched to an `id`.

### Template

```markdown
---
id: your-scenario-id
title: Human-readable title
persona: sarah|marco|priya
min_level: A2|B1|B2|C1
goals:
  - What this scenario should train, as 2-4 bullet points
opening_line: "The persona's first line, in character."
follow_ups:
  - "A few plausible follow-up lines the persona might use."
target_phrases:
  - "3-6 phrases a strong response would naturally include."
---

## Context

1-2 paragraphs: what's the situation, who's involved, and (if relevant)
how a command should gather real context for it (e.g. git diff, git log).

## What a good performance looks like

3-5 bullet points describing concretely what a strong response looks like —
structure, vocabulary, tone — so the coach skill can evaluate against it.
```

### Checklist before submitting a scenario

- [ ] `id` is kebab-case, unique, and matches the filename (without `.md`).
- [ ] `persona` matches an existing file under `skills/devspeak-coach/personas/`.
- [ ] `opening_line` sounds like something a real person would actually say/type — no textbook phrasing.
- [ ] `goals` and "what a good performance looks like" are specific enough that feedback could actually be scored against them (avoid vague goals like "communicate well").
- [ ] If the scenario should use real repo context (like `code-walkthrough` and `daily-standup` do), document that in the Context section and update the matching command file(s) under `commands/`.
- [ ] Scenario content is in English; only comments/docs about it can be in Portuguese.

## Adding a new persona

Personas live in `skills/devspeak-coach/personas/*.md`. Each one needs: name, fictional company/role, timezone, personality, speech style, typical expressions, and how they react to vague answers (see `sarah.md`, `marco.md`, `priya.md` for the expected depth). Keep the fictional company name consistent (`Northwind Cloud`) unless there's a good reason to introduce a new one.

## Adding to the common-mistakes bank

`skills/devspeak-coach/references/br-common-mistakes.md` is grouped by category (`false-cognates`, `verb-tenses`, `prepositions`, `noun-order-and-articles`, `plurals-and-uncountables`, `dev-verbs-and-jargon`, `meeting-expressions`, `written-pronunciation-traps`).

To add an entry:

1. Pick the existing category it fits best, or propose a new one if it genuinely doesn't fit (and update this file's category list plus the reference in `skills/devspeak-coach/SKILL.md`).
2. Format: `"<mistake>" → correct: "<correct form>" — <short pt-BR explanation of why>.`
3. Base it on a real, common error — not a one-off typo. If you're not sure it's common, mention that in your PR description so it can be discussed.

## Testing your changes

```bash
node --test                    # run scripts/*.mjs tests
claude plugin validate .       # validate plugin structure
```

To try commands/skills locally, run `claude --plugin-dir /absolute/path/to/devspeak` **from a different directory** (e.g. `cd /tmp && claude --plugin-dir ~/devspeak`). Running it from inside the repo itself makes Claude Code treat the repo as both the plugin and the current project, which causes a harmless-but-confusing duplicate (and broken) load of the root `.mcp.json` outside the plugin context.

If you changed anything under `mcp-server/src/`:

```bash
cd mcp-server
npm install
npm run typecheck
npm test              # unit tests for pure logic (no real audio/network)
npm run build         # rebuilds dist/index.mjs — commit this file too
```

## Commit style

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `test:`, etc.), in small, focused commits.
