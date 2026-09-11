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

## Phase 3 — Voice practice (done)

- `mcp-server/`: a TypeScript MCP server (using `@modelcontextprotocol/sdk`) providing `listen()` and `speak()` tools, bundled via esbuild into a committed `dist/index.mjs` so no build step is needed to install the plugin.
- `listen()`: **Groq Whisper as the default** backend (free API key via the `groq_api_key` sensitive userConfig field), with `whispercpp` as a fully-local/offline alternative (`whispercpp_binary_path` + `whispercpp_model_path`). Recording needs `sox` installed either way.
- `speak()`: the OS's built-in TTS by default (`say` / PowerShell `System.Speech` / `espeak-ng`/`spd-say`), with `piper` (local) or `elevenlabs` (cloud, higher quality) as optional backends.
- `devspeak-coach` uses `listen`/`speak` automatically when the user asks to practice "by voice" and the tools are available, falling back to text if a tool call fails.
- Pure logic (backend selection, command/request builders, output parsing) lives in plain `.mjs` and is unit-tested with `node --test`; actual audio/network I/O is a thin wrapper, verified manually via a real MCP client handshake during development.
- This is the one place Devspeak talks to an external API by default (Groq, for transcription) — clearly opt-in (voice mode isn't used unless asked for) and documented as a trade-off against the setup friction of compiling whisper.cpp locally.

## Phase 4 — Pronunciation scoring (planned)

- Optional Python module integrating OpenPronounce (MIT) for phoneme-level pronunciation assessment.
- Surfaces specific phoneme-level feedback (e.g., which sounds in "developer" or "chaos" are off) rather than just word-level "try again."
- Stays optional/modular so the core plugin keeps its zero-dependency, Node-only footprint for users who don't need pronunciation scoring.
