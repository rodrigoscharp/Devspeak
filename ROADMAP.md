# Roadmap

## Phase 0 — Repo setup (done)

Plugin + marketplace scaffolding, license, base docs.

## Phase 1 — Core coaching experience (done)

- `devspeak-coach` skill: session rules, rubric, personas (Sarah, Marco, Priya).
- `tech-english-vocab` skill: auto-triggered vocabulary lookups.
- 6 scenarios: `daily-standup`, `code-walkthrough`, `pr-review-discussion`, `friday-smalltalk`, `incident-call`, `one-on-one`.
- Commands (Portuguese names, since English content starts *inside* the command): `/devspeak:diaria`, `/devspeak:explicar-codigo`, `/devspeak:revisao-pr`, `/devspeak:bate-papo`, `/devspeak:praticar`, `/devspeak:progresso`.
- `scripts/progress.mjs`: local, dependency-free progress tracking (`add-session`, `summary`, `recurring`), with `node --test` coverage.
- 50+ entry Brazilian-Portuguese-speaker common-mistakes bank.

## Phase 2 — Passive mode & spaced repetition (done)

- `UserPromptSubmit` hook (`scripts/passive-log.mjs`) that quietly logs English prompts the user writes during normal Claude Code usage — **opt-in only**, via the `passive_mode` plugin option (off by default). A lightweight EN/PT stopword heuristic filters out slash commands, short text, and Portuguese prompts before anything is stored.
- `/devspeak:revisar-ingles` — reads the unreviewed log, analyzes it against the common-mistakes bank, and feeds findings into the same `progress.mjs` recurring-mistakes tracking used by role-play sessions.
- Spaced-repetition vocabulary (`scripts/vocab.mjs`): a simple 6-box Leitner scheme. `tech-english-vocab` automatically adds looked-up phrases; `/devspeak:vocabulario` quizzes whatever's due.

## Phase 3 — Voice practice (done)

- **Hearing the user:** recommends Claude Code's own built-in `/voice` dictation — zero setup, no API key, works for anyone signed in with a claude.ai account. Dictated text arrives as a normal user message, so `devspeak-coach` needs no special handling for it.
- **Hearing the persona:** `mcp-server/`, a TypeScript MCP server (`@modelcontextprotocol/sdk`, bundled via esbuild into a committed `dist/index.mjs`) providing a `speak()` tool. Uses the OS's built-in TTS by default (`say` / PowerShell `System.Speech` / `espeak-ng`/`spd-say`) — no API key — with `piper` (local) or `elevenlabs` (cloud, higher quality) as optional backends.
- **Fallback capture (`listen()`):** for the cases `/voice` can't cover — SSH, Claude Code on the web, or Claude Code authenticated with a direct API key/Bedrock/Vertex/Foundry instead of a claude.ai login. Groq Whisper by default (free API key via `groq_api_key`), with `whispercpp` as a fully-local/offline alternative. Not the primary path — `devspeak-coach` only reaches for it if the user explicitly asks and `/voice` isn't an option for them.
- This design was a deliberate pivot after realizing (a) Claude has no native audio input in this API/tool surface, so *some* transcription step is unavoidable if a plugin wants to own that path, but (b) Claude Code's own `/voice` already solves it for free for most users — reserving Groq/whisper.cpp for the minority of setups where `/voice` doesn't apply keeps the "no required API key" promise intact for almost everyone.
- Pure logic (backend selection, command/request builders, output parsing) lives in plain `.mjs` and is unit-tested with `node --test`; actual audio/network I/O is a thin wrapper, verified manually via a real MCP client handshake during development.

## Phase 4 — Pronunciation scoring (planned)

- Optional Python module integrating OpenPronounce (MIT) for phoneme-level pronunciation assessment.
- Surfaces specific phoneme-level feedback (e.g., which sounds in "developer" or "chaos" are off) rather than just word-level "try again."
- Stays optional/modular so the core plugin keeps its zero-dependency, Node-only footprint for users who don't need pronunciation scoring.
