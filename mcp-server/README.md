# devspeak-voice (MCP server)

Optional voice layer for Devspeak. Provides two MCP tools — `listen` (speech-to-text) and `speak` (text-to-speech) — that the `devspeak-coach` skill uses to run role-play sessions out loud instead of by typing.

This is the one part of Devspeak that can call out to a cloud API (Groq, by default) — see [Setup](#setup) for the fully-local alternative.

## How it's wired up

The plugin's root `.mcp.json` starts this server with `node dist/index.mjs` and passes your Devspeak plugin config through as environment variables (see `src/config.mjs` for the full list). You don't run this server manually — Claude Code starts it automatically when the plugin is enabled.

## Setup

### Speech-to-text (`listen`)

Recording always requires **[sox](http://sox.sourceforge.net/)** to capture microphone input:

```bash
brew install sox        # macOS
sudo apt install sox    # Debian/Ubuntu
```

Then pick a backend via the `stt_backend` plugin option:

- **`groq`** (default): get a free API key at [console.groq.com/keys](https://console.groq.com/keys) and set it as the `groq_api_key` plugin option. Fast, no local model to manage, but sends audio to Groq's API.
- **`whispercpp`**: fully local/offline. Build [whisper.cpp](https://github.com/ggerganov/whisper.cpp), download a `ggml` model, and set `whispercpp_binary_path` and `whispercpp_model_path` to their paths.

### Text-to-speech (`speak`)

- **`system`** (default): uses the OS's built-in TTS — `say` on macOS, PowerShell's `System.Speech` on Windows, `spd-say`/`espeak` on Linux (install one: `sudo apt install espeak-ng`). No setup needed on macOS/Windows.
- **`piper`**: fully local. Build/install [Piper](https://github.com/rhasspy/piper), download a voice model, and set `piper_binary_path` and `piper_voice_path`.
- **`elevenlabs`**: higher-quality cloud voices. Set `elevenlabs_api_key` and `elevenlabs_voice_id`.

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # node --test — unit tests for pure logic only (no real audio/network)
npm run build        # bundles src/index.ts (+ the .mjs helpers) into dist/index.mjs via esbuild
```

`dist/index.mjs` is committed to the repo so installing the plugin doesn't require a build step. **Whenever you change anything under `src/`, run `npm run build` and commit the updated `dist/index.mjs`.**

### Testing the MCP server locally

Point `--plugin-dir` at the plugin from a directory *other than the plugin's own repo root*:

```bash
cd /tmp
claude --plugin-dir /path/to/devspeak
```

Running `--plugin-dir .` from inside the repo itself makes Claude Code treat the repo as both the plugin **and** the current project, which causes it to also auto-load the root `.mcp.json` as a *project-level* MCP config — outside the plugin context, so `${CLAUDE_PLUGIN_ROOT}`/`${user_config.*}` don't get substituted there, and that second, broken connection attempt gets logged (`MCP server "devspeak-voice"` alongside a working `MCP server "plugin:devspeak:devspeak-voice"`). Testing from a separate cwd avoids this entirely.

### Architecture notes

- `src/config.mjs`, `src/audio.mjs`, `src/stt.mjs`, `src/tts.mjs` are plain `.mjs` — pure command/request builders are separated from the actual I/O (spawning processes, network calls) so the logic is unit-testable without a real microphone, speaker, or network access.
- `src/index.ts` is the only real TypeScript file: it wires those helpers into MCP tools using the official SDK (`@modelcontextprotocol/sdk`) and `zod` schemas.
- All external commands are invoked via argv arrays (`spawn`, never a shell string), so arbitrary text passed to `speak` can never be interpreted as a shell command.
