# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.3.1] - 2026-09-11

### Changed

- Voice mode now recommends Claude Code's own built-in `/voice` dictation for capturing the user's spoken answers, instead of the MCP `listen()` tool — zero setup, no API key, works with any claude.ai login. `devspeak-coach` no longer calls `listen()` by default.
- `listen()` (Groq/whisper.cpp) is now documented and described as a **fallback only**, for environments where `/voice` isn't available (SSH, Claude Code on the web, or a non-claude.ai auth setup like a direct API key/Bedrock/Vertex/Foundry).
- Reworded the related `plugin.json` userConfig fields (`stt_backend`, `groq_api_key`, `whispercpp_binary_path`, `whispercpp_model_path`) and both READMEs to reflect the fallback framing.
- `speak()` (text-to-speech) is unaffected and remains the primary way to hear the persona, still free/local by default via the `system` backend.

## [0.3.0] - 2026-09-11

### Added

- Phase 3: voice practice.
- `mcp-server/`: a TypeScript MCP server (`@modelcontextprotocol/sdk`), bundled via esbuild into a committed `dist/index.mjs`, exposing `listen()` (speech-to-text) and `speak()` (text-to-speech) tools.
- STT backends: `groq` (default, needs a free `groq_api_key`) and `whispercpp` (fully local, needs `whispercpp_binary_path` + `whispercpp_model_path`). Recording via `sox`.
- TTS backends: `system` (default — `say`/PowerShell/`espeak-ng`/`spd-say`), `piper` (local), `elevenlabs` (cloud).
- `devspeak-coach` now runs role-play sessions by voice when asked, using `listen`/`speak` if available, with a clean fallback to text.
- New `plugin.json` userConfig fields: `stt_backend`, `groq_api_key`, `whispercpp_binary_path`, `whispercpp_model_path`, `tts_backend`, `piper_binary_path`, `piper_voice_path`, `elevenlabs_api_key`, `elevenlabs_voice_id`.
- `mcp-server` unit tests (`node --test`) covering config resolution, command/request builders, and fallback logic.

## [0.2.0] - 2026-09-11

### Added

- Phase 2: passive mode and spaced-repetition vocabulary.
- `passive_mode` userConfig option (boolean, off by default) and a `UserPromptSubmit` hook (`scripts/passive-log.mjs`) that opt-in logs English prompts written during normal usage, filtered by a lightweight EN/PT stopword heuristic.
- `/devspeak:english-review` command to analyze logged prompts and feed findings into the existing recurring-mistakes tracking.
- `scripts/vocab.mjs`: zero-dependency 6-box Leitner spaced-repetition tracker (`add`, `due`, `review`), with `node --test` coverage.
- `/devspeak:vocab` command to quiz due vocabulary.
- `tech-english-vocab` skill now auto-adds looked-up phrases to the spaced-repetition queue.
- Shared `scripts/lib/store.mjs` helper module (data dir resolution, atomic JSON read/write, flag parsing), refactored out of `progress.mjs` and reused by `passive-log.mjs` and `vocab.mjs`.

## [0.1.0] - 2026-09-11

### Added

- Initial release: Phase 0 and Phase 1 of the roadmap.
- `devspeak-coach` skill with session rules, feedback rubric, and three personas (Sarah, Marco, Priya).
- `tech-english-vocab` skill for auto-triggered "how do I say X in English?" lookups.
- Six role-play scenarios: `daily-standup`, `code-walkthrough`, `pr-review-discussion`, `friday-smalltalk`, `incident-call`, `one-on-one`.
- Commands: `/devspeak:standup`, `/devspeak:explain-code`, `/devspeak:pr-talk`, `/devspeak:smalltalk`, `/devspeak:practice`, `/devspeak:progress`.
- `scripts/progress.mjs`: local, dependency-free CLI for tracking session history (`add-session`, `summary`, `recurring`), with `node --test` coverage.
- Brazilian-Portuguese-speaker common-mistakes reference bank (50+ entries across 8 categories).
- English and Portuguese READMEs, CONTRIBUTING guide, and ROADMAP.
