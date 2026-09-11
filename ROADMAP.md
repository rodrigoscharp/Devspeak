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

## Phase 2 — Passive mode & spaced repetition (done)

- `UserPromptSubmit` hook (`scripts/passive-log.mjs`) that quietly logs English prompts the user writes during normal Claude Code usage — **opt-in only**, via the `passive_mode` plugin option (off by default). A lightweight EN/PT stopword heuristic filters out slash commands, short text, and Portuguese prompts before anything is stored.
- `/devspeak:english-review` — reads the unreviewed log, analyzes it against the common-mistakes bank, and feeds findings into the same `progress.mjs` recurring-mistakes tracking used by role-play sessions.
- Spaced-repetition vocabulary (`scripts/vocab.mjs`): a simple 6-box Leitner scheme. `tech-english-vocab` automatically adds looked-up phrases; `/devspeak:vocab` quizzes whatever's due.

## Phase 3 — Voice practice (planned, next up)

- A TypeScript MCP server providing `listen()` and `speak()` tools, so role-play can happen out loud instead of by typing.
- `listen()`: **Groq Whisper as the default** backend (free-tier API key via a `sensitive` userConfig field — no local compilation needed), with whisper.cpp documented as a fully-local/offline alternative for users who prefer zero network calls.
- `speak()`: text-to-speech via the OS's built-in TTS by default, with Piper (local, offline) or ElevenLabs (higher quality, requires an API key) as optional backends.
- This is the one place Devspeak asks for an API key — clearly opt-in, clearly scoped to voice only, and documented as a deliberate trade-off against the setup friction of compiling whisper.cpp locally.

## Phase 4 — Pronunciation scoring (planned)

- Optional Python module integrating OpenPronounce (MIT) for phoneme-level pronunciation assessment.
- Surfaces specific phoneme-level feedback (e.g., which sounds in "developer" or "chaos" are off) rather than just word-level "try again."
- Stays optional/modular so the core plugin keeps its zero-dependency, Node-only footprint for users who don't need pronunciation scoring.
