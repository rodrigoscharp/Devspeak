# Devspeak

A Claude Code plugin that coaches Brazilian developers on technical English for international remote jobs — through role-play with a fictional international team, practicing on your own real code.

[Leia em português (README.pt-BR.md)](README.pt-BR.md)

## Why

Most English practice for devs is generic. Devspeak is different in two ways:

1. **You practice with your own code.** `/devspeak:explicar-codigo` and `/devspeak:revisao-pr` use your actual `git diff` so you rehearse explaining or defending *your real work* — the way you'd actually have to in a standup, a PR review, or an incident call.
2. **It's built for Brazilian English speakers specifically.** Feedback is explained in pt-BR by default, and the coach draws on a bank of 50+ mistakes typical of Portuguese speakers (false cognates, verb tenses, prepositions, noun order, dev jargon) to explain *why* something sounds off, not just *that* it does.

Everything runs locally on your own Claude subscription — no server, no API key. Your practice history stays on your machine.

## Prerequisites

- [Claude Code](https://code.claude.com) installed and logged in (macOS, Linux, or Windows — cmd.exe, PowerShell, or WSL all work).
- No extra account or key needed for day-to-day use — Devspeak runs on your normal Claude Code subscription.

## Example session

```
> /devspeak:diaria

Sarah: Morning! Let's do a quick standup — what did you work on yesterday?

You: Yesterday I fix the login bug and I working on the API since morning.

[Dica rápida: "I fixed the login bug" (não "I fix") — ação já concluída no passado.]

Sarah: Nice, glad that's sorted. What's the plan for the rest of today then?

You: today I finish the API and start review the PR from Priya

[Dica rápida: "start reviewing" (não "start review") — depois de "start", use gerúndio.]

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

Note the `[Dica rápida: ...]` correction shows up **during** the conversation, not just at the end — that's the default behavior (`correction_mode: inline`).

## Installation

```
/plugin marketplace add rodrigoscharp/devspeak
/plugin install devspeak@devspeak
```

### Already installed and something looks stale?

Devspeak has moved fast (Portuguese command names, automatic inline correction, voice mode). If you installed a while ago, force an update:

```
/plugin marketplace update devspeak
/reload-plugins
```

## Commands

| Command | What it does |
|---|---|
| `/devspeak:diaria` ("daily") | Practice a daily standup with Sarah (tech lead). Uses `git log --since=yesterday` as context if you're in a git repo. |
| `/devspeak:explicar-codigo [file\|--staged]` ("explain code") | Walk Sarah through a real code change — uncommitted changes by default, `--staged`, or a specific file. |
| `/devspeak:revisao-pr` ("PR review") | Respond to Priya's (senior engineer) review comments on your current diff. |
| `/devspeak:bate-papo` ("small talk") | Casual Friday chat with a random teammate — no technical pressure. |
| `/devspeak:praticar <scenario-id>` ("practice") | Jump straight to any scenario. Run with no argument to list them all. |
| `/devspeak:progresso` ("progress") | See your session history, level trend, top recurring mistakes, and a suggested next scenario. |
| `/devspeak:revisar-ingles` ("review English") | Review real English prompts you wrote during normal usage (requires `passive_mode`, see below). |
| `/devspeak:vocabulario` ("vocabulary") | Quiz yourself on vocabulary that's due today (spaced repetition). |

Command names are in Portuguese — the practice content and persona dialogue are always in English, but you shouldn't need to know English yet to find the right command.

Devspeak also ships a `tech-english-vocab` skill that activates automatically whenever you ask "how do I say X in English?" for a work/technical phrase — no command needed. Phrases you look up this way are automatically added to the spaced-repetition queue for `/devspeak:vocabulario`.

## Voice mode (optional)

Any role-play command can run out loud instead of by typing — just ask for it ("let's do this by voice"). There are two independent halves, and neither needs an API key for most people:

- **Hearing you:** use Claude Code's own built-in `/voice` dictation to speak your answers — zero setup, no API key, works with any claude.ai login. Devspeak just treats the dictated text like a normal typed message.
- **Hearing the persona:** Devspeak's `speak` MCP tool reads the persona's lines out loud, using your OS's built-in TTS by default (`say` on macOS, `System.Speech` on Windows, `espeak-ng`/`spd-say` on Linux — install one of those two on Linux). No API key either.

`/voice` doesn't work over SSH, on Claude Code on the web, or when Claude Code is authenticated with a direct Anthropic API key / Bedrock / Vertex / Foundry (no claude.ai session). Only in that case, Devspeak also ships a `listen` MCP tool as a fallback capture method — it needs [sox](http://sox.sourceforge.net/) plus either a free [Groq API key](https://console.groq.com/keys) or a local [whisper.cpp](https://github.com/ggerganov/whisper.cpp) install. See [mcp-server/README.md](mcp-server/README.md) for that setup, plus optional Piper (local) or ElevenLabs (cloud) voices for `speak`.

Skip all of this setup entirely and Devspeak just runs in text mode.

## Configuration

Set these when installing, or later via `/plugin`:

| Option | Values | Default |
|---|---|---|
| `level` | `auto`, `A2`, `B1`, `B2`, `C1` | `auto` (estimated from your performance) |
| `correction_mode` | `inline`, `end` | `inline` (brief correction, in `explanation_language`, after each of your turns; `end` gives feedback only at the end of the session) |
| `explanation_language` | `pt-BR`, `en` | `pt-BR` |
| `passive_mode` | `true`, `false` | `false` — **opt-in.** When on, quietly logs English prompts you write during normal Claude Code usage (outside role-play), so `/devspeak:revisar-ingles` can analyze real, unprompted writing. |
| `tts_backend` | `system`, `piper`, `elevenlabs` | `system` — text-to-speech backend for voice mode's `speak()`. No setup needed for `system`. |
| `piper_binary_path`, `piper_voice_path` | file paths | — only used if `tts_backend` is `piper`. |
| `elevenlabs_api_key`, `elevenlabs_voice_id` | (sensitive), string | — only used if `tts_backend` is `elevenlabs`. |
| `stt_backend` | `groq`, `whispercpp` | `groq` — **fallback only.** Use Claude Code's built-in `/voice` dictation instead; this is just for the `listen` MCP tool, needed only when `/voice` isn't available to you (SSH, web, or a non-claude.ai auth setup). |
| `groq_api_key` | (sensitive) | — only used by the `listen` fallback when `stt_backend` is `groq`. |
| `whispercpp_binary_path`, `whispercpp_model_path` | file paths | — only used by the `listen` fallback when `stt_backend` is `whispercpp`. |

## Privacy

Devspeak runs entirely on your machine using your existing Claude subscription. There's no backend server and no API key required for the core coaching experience, including the recommended voice setup (`/voice` dictation + the default `system` TTS backend are both free and local/first-party). Your practice history (`progress.json`), vocabulary queue (`vocab.json`), and — only if you enable `passive_mode` — your logged prompts (`passive-log.json`) are stored locally in the plugin's data directory and are never sent anywhere by Devspeak itself. `passive_mode` is off by default; nothing is logged unless you turn it on.

The one exception is the `listen` **fallback** tool, and only if you're in a setup where `/voice` isn't available and choose to configure it: by default it would send recorded audio to Groq's API for transcription (using your own API key). Switch `stt_backend` to `whispercpp` to keep that fully local instead. `speak()` stays fully local unless you explicitly configure `elevenlabs` as the `tts_backend`.

## FAQ

**Commands are in Portuguese but Sarah speaks English — is that a bug?**
No, that's intentional. The Portuguese command name helps you find the right feature without already knowing English; the practice content itself (persona dialogue, grammar corrections) is in English because that's what you're training. The *why* behind each correction is explained in Portuguese.

**Does this cost anything?**
No. It runs on your normal Claude Code subscription — no server, no API key. The one exception is configuring voice mode in a setup where native `/voice` doesn't work (SSH, web) — that would use your own free Groq key. For most people, that never comes up.

**I updated but nothing changed.**
Run both, in order, and wait for each to finish:
```
/plugin marketplace update devspeak
/reload-plugins
```
If it's still stale, restart Claude Code entirely.

**Does it work on Windows?**
Yes — cmd.exe, PowerShell, and WSL all work, including voice mode.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for what's planned beyond the current release: a passive mode that reviews your everyday English prompts, spaced-repetition vocabulary, an optional voice MCP server, and phoneme-level pronunciation scoring.

## Contributing

Contributions are welcome, especially new scenarios and additions to the common-mistakes bank. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
