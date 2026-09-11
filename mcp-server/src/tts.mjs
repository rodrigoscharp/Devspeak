// Text-to-speech backends. Command/request builders are pure and
// unit-tested; network/process calls and playback are thin IO wrappers.

import { writeFile, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { playAudio, runWithFallback } from './audio.mjs';

const ELEVENLABS_URL_TEMPLATE = 'https://api.elevenlabs.io/v1/text-to-speech/';

/** Pure: ordered list of system-TTS candidates to try for a given platform. Text goes via stdin on Windows to avoid quoting issues. */
export function buildSystemSpeakCandidates({ platform, text }) {
  if (platform === 'darwin') return [{ command: 'say', args: [text] }];

  if (platform === 'win32') {
    return [
      {
        command: 'powershell',
        args: [
          '-NoProfile',
          '-Command',
          "Add-Type -AssemblyName System.Speech; " +
            "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer; " +
            "$s.Speak([Console]::In.ReadToEnd());",
        ],
        input: text,
      },
    ];
  }

  // linux and other unix-likes
  return [
    { command: 'spd-say', args: ['--wait', text] },
    { command: 'espeak-ng', args: [text] },
    { command: 'espeak', args: [text] },
  ];
}

/** Pure: builds argv for a Piper CLI invocation. Piper reads the text to synthesize from stdin. */
export function buildPiperArgs({ model, outFile }) {
  return { args: ['--model', model, '--output_file', outFile] };
}

/** Pure: builds the ElevenLabs TTS request. Throws if apiKey/voiceId are missing. */
export function buildElevenLabsRequestInit({ apiKey, voiceId, text }) {
  if (!apiKey || !voiceId) {
    throw new Error(
      'tts_backend is "elevenlabs" but elevenlabs_api_key and/or elevenlabs_voice_id are not set ' +
        'in the Devspeak plugin config.'
    );
  }
  return {
    url: `${ELEVENLABS_URL_TEMPLATE}${voiceId}`,
    init: {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2' }),
    },
  };
}

async function speakSystem(text, platform = process.platform) {
  await runWithFallback(buildSystemSpeakCandidates({ platform, text }));
}

async function speakPiper({ binary, model, text }) {
  const outFile = join(tmpdir(), `devspeak-tts-${randomUUID()}.wav`);
  const { args } = buildPiperArgs({ model, outFile });
  try {
    await runWithFallback([{ command: binary, args, input: text }]);
    await playAudio(outFile);
  } catch (err) {
    if (err.code === 'ENOENT' || /was not found on PATH/.test(err.message)) {
      throw new Error(`Piper binary not found at "${binary}". Check piper_binary_path.`);
    }
    throw err;
  } finally {
    await unlink(outFile).catch(() => {});
  }
}

async function speakElevenLabs({ apiKey, voiceId, text }) {
  const { url, init } = buildElevenLabsRequestInit({ apiKey, voiceId, text });
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const outFile = join(tmpdir(), `devspeak-tts-${randomUUID()}.mp3`);
  try {
    await writeFile(outFile, buffer);
    await playAudio(outFile);
  } finally {
    await unlink(outFile).catch(() => {});
  }
}

/** Dispatches to the configured TTS backend and plays the result out loud. */
export async function speak(ttsConfig, text) {
  if (ttsConfig.backend === 'piper') {
    if (!ttsConfig.piperBinary || !ttsConfig.piperVoice) {
      throw new Error(
        'tts_backend is "piper" but piper_binary_path and/or piper_voice_path are not set in the ' +
          'Devspeak plugin config.'
      );
    }
    return speakPiper({ binary: ttsConfig.piperBinary, model: ttsConfig.piperVoice, text });
  }
  if (ttsConfig.backend === 'elevenlabs') {
    return speakElevenLabs({ apiKey: ttsConfig.elevenLabsApiKey, voiceId: ttsConfig.elevenLabsVoiceId, text });
  }
  return speakSystem(text);
}
