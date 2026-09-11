# Devspeak

A Claude Code plugin that coaches Brazilian developers on technical English for international remote jobs — through role-play with a fictional international team, practicing on your own real code.

[Leia em português (README.pt-BR.md)](README.pt-BR.md)

## Why

Most English practice for devs is generic. Devspeak is different in two ways:

1. **You practice with your own code.** `/devspeak:explain-code` and `/devspeak:pr-talk` use your actual `git diff` so you rehearse explaining or defending *your real work* — the way you'd actually have to in a standup, a PR review, or an incident call.
2. **It's built for Brazilian English speakers specifically.** Feedback is explained in pt-BR by default, and the coach draws on a bank of 50+ mistakes typical of Portuguese speakers (false cognates, verb tenses, prepositions, noun order, dev jargon) to explain *why* something sounds off, not just *that* it does.

Everything runs locally on your own Claude subscription — no server, no API key. Your practice history stays on your machine.

## Example session

```
> /devspeak:standup

Sarah: Morning! Let's do a quick standup — what did you work on yesterday?

You: Yesterday I fix the login bug and I working on the API since morning.

Sarah: Nice, glad that's sorted. What's the plan for the rest of today then?

You: today I finish the API and start review the PR from Priya

Sarah: Sounds good. Any blockers on the PR review, or should be quick?

You: done

Sarah: Alright, let's wrap up the role-play here.

---
**Estimated level: A2** — clear yesterday/today structure, but tense mixing
("I fix", "I working") is frequent enough to slow a listener down.

| You said                      | Natural form                          | Why (pt-BR) |
|--------------------------------|----------------------------------------|-------------|
| "I fix the login bug"          | "I fixed the login bug"                | Ação concluída no passado → simple past, não presente. |
| "I working on the API"         | "I've been working on the API"         | Ação contínua desde um ponto no passado → present perfect continuous. |
| "start review the PR"          | "start reviewing the PR"               | Depois de "start", use gerúndio (-ing). |
...
```

## Installation

```
/plugin marketplace add rodrigoscharp/devspeak
/plugin install devspeak@devspeak
```

## Commands

| Command | What it does |
|---|---|
| `/devspeak:standup` | Practice a daily standup with Sarah (tech lead). Uses `git log --since=yesterday` as context if you're in a git repo. |
| `/devspeak:explain-code [file\|--staged]` | Walk Sarah through a real code change — uncommitted changes by default, `--staged`, or a specific file. |
| `/devspeak:pr-talk` | Respond to Priya's (senior engineer) review comments on your current diff. |
| `/devspeak:smalltalk` | Casual Friday chat with a random teammate — no technical pressure. |
| `/devspeak:practice <scenario-id>` | Jump straight to any scenario. Run with no argument to list them all. |
| `/devspeak:progress` | See your session history, level trend, top recurring mistakes, and a suggested next scenario. |
| `/devspeak:english-review` | Review real English prompts you wrote during normal usage (requires `passive_mode`, see below). |
| `/devspeak:vocab` | Quiz yourself on vocabulary that's due today (spaced repetition). |

Devspeak also ships a `tech-english-vocab` skill that activates automatically whenever you ask "how do I say X in English?" for a work/technical phrase — no command needed. Phrases you look up this way are automatically added to the spaced-repetition queue for `/devspeak:vocab`.

## Voice mode (optional)

Any role-play command can run out loud instead of by typing — just ask for it ("let's do this by voice"). This uses an optional MCP server (`mcp-server/`) with two tools: `listen` (speech-to-text) and `speak` (text-to-speech).

Setup: `listen` needs [sox](http://sox.sourceforge.net/) installed for recording, plus either a free [Groq API key](https://console.groq.com/keys) (default, `stt_backend: groq`) or a local [whisper.cpp](https://github.com/ggerganov/whisper.cpp) install (`stt_backend: whispercpp`, fully offline). `speak` works out of the box on macOS/Windows via the OS's built-in TTS; on Linux, install `espeak-ng` or `spd-say`. See [mcp-server/README.md](mcp-server/README.md) for full setup, including optional Piper (local) or ElevenLabs (cloud) voices.

This is the only part of Devspeak that can call an external API by default (Groq, for `listen`) — everything else stays fully local. Skip the setup entirely and Devspeak just runs in text mode.

## Configuration

Set these when installing, or later via `/plugin`:

| Option | Values | Default |
|---|---|---|
| `level` | `auto`, `A2`, `B1`, `B2`, `C1` | `auto` (estimated from your performance) |
| `correction_mode` | `end`, `inline` | `end` (feedback only at the end of the session) |
| `explanation_language` | `pt-BR`, `en` | `pt-BR` |
| `passive_mode` | `true`, `false` | `false` — **opt-in.** When on, quietly logs English prompts you write during normal Claude Code usage (outside role-play), so `/devspeak:english-review` can analyze real, unprompted writing. |
| `stt_backend` | `groq`, `whispercpp` | `groq` — speech-to-text backend for voice mode's `listen()`. See [Voice mode](#voice-mode-optional). |
| `groq_api_key` | (sensitive) | — Groq API key, only used if `stt_backend` is `groq`. |
| `whispercpp_binary_path`, `whispercpp_model_path` | file paths | — only used if `stt_backend` is `whispercpp`. |
| `tts_backend` | `system`, `piper`, `elevenlabs` | `system` — text-to-speech backend for voice mode's `speak()`. |
| `piper_binary_path`, `piper_voice_path` | file paths | — only used if `tts_backend` is `piper`. |
| `elevenlabs_api_key`, `elevenlabs_voice_id` | (sensitive), string | — only used if `tts_backend` is `elevenlabs`. |

## Privacy

Devspeak runs entirely on your machine using your existing Claude subscription. There's no backend server and no API key required for the core coaching experience. Your practice history (`progress.json`), vocabulary queue (`vocab.json`), and — only if you enable `passive_mode` — your logged prompts (`passive-log.json`) are stored locally in the plugin's data directory and are never sent anywhere by Devspeak itself. `passive_mode` is off by default; nothing is logged unless you turn it on.

The one exception is **voice mode**, and only if you use it: by default, `listen()` sends your recorded audio to Groq's API for transcription (you provide your own API key). Switch `stt_backend` to `whispercpp` to keep transcription fully local instead. `speak()` stays fully local unless you explicitly configure `elevenlabs` as the `tts_backend`.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for what's planned beyond the current release: a passive mode that reviews your everyday English prompts, spaced-repetition vocabulary, an optional voice MCP server, and phoneme-level pronunciation scoring.

## Contributing

Contributions are welcome, especially new scenarios and additions to the common-mistakes bank. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
