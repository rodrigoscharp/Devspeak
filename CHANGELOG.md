# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

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
