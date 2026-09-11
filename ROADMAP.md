# Roadmap

## Phase 0 — Repo setup (done)

Plugin + marketplace scaffolding, license, base docs.

## Phase 1 — Core coaching experience (done)

- `devspeak-coach` skill: session rules, rubric, personas (Sarah, Marco, Priya).
- `tech-english-vocab` skill: auto-triggered vocabulary lookups.
- 6 scenarios: `daily-standup`, `code-walkthrough`, `pr-review-discussion`, `friday-smalltalk`, `incident-call`, `one-on-one`.
- Commands: `/devspeak:standup`, `/devspeak:explain-code`, `/devspeak:pr-talk`, `/devspeak:smalltalk`, `/devspeak:practice`, `/devspeak:progress`.
- `scripts/progress.mjs`: local, dependency-free progress tracking (`add-session`, `summary`, `recurring`), with `node --test` coverage.
- 50+ entry Brazilian-Portuguese-speaker common-mistakes bank.

## Phase 2 — Passive mode & spaced repetition (planned)

- A hook (likely `UserPromptSubmit` or similar) that quietly logs English prompts the user writes during normal Claude Code usage, without interrupting their flow.
- `/devspeak:english-review` — reviews that logged history and surfaces patterns/mistakes from *real*, unprompted usage, not just role-play sessions.
- Spaced-repetition vocabulary: track which target phrases and vocab items the user has been shown, and resurface ones they haven't reused recently, timed to actually stick.

## Phase 3 — Voice practice (planned)

- A TypeScript MCP server providing `listen()` and `speak()` tools, so role-play can happen out loud instead of by typing.
- `listen()`: local speech-to-text via whisper.cpp, with Groq Whisper as a faster optional backend.
- `speak()`: text-to-speech via the OS's built-in TTS by default, with Piper (local, offline) or ElevenLabs (higher quality, requires an API key) as optional backends.
- Keeps the "no server, no required API key" principle for the default path; cloud options stay strictly opt-in.

## Phase 4 — Pronunciation scoring (planned)

- Optional Python module integrating OpenPronounce (MIT) for phoneme-level pronunciation assessment.
- Surfaces specific phoneme-level feedback (e.g., which sounds in "developer" or "chaos" are off) rather than just word-level "try again."
- Stays optional/modular so the core plugin keeps its zero-dependency, Node-only footprint for users who don't need pronunciation scoring.
