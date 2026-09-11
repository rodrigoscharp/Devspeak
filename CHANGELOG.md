# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
