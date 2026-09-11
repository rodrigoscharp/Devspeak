// Speech-to-text backends. Request/argv builders and output parsers are
// pure and unit-tested; network/process calls are thin IO wrappers.

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const GROQ_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const TIMESTAMP_LINE = /^\s*\[\d{2}:\d{2}(?::\d{2})?\.\d{3}\s*-->\s*\d{2}:\d{2}(?::\d{2})?\.\d{3}\]\s*/;

/** Pure: builds the fetch request for Groq's Whisper transcription endpoint. Throws if apiKey is missing. */
export function buildGroqRequestInit({ apiKey, model, wavBuffer, filename = 'audio.wav' }) {
  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY is not set. Get a free key at https://console.groq.com/keys and set it as ' +
        'the "groq_api_key" Devspeak plugin option, or switch stt_backend to "whispercpp".'
    );
  }
  const form = new FormData();
  form.append('file', new Blob([wavBuffer], { type: 'audio/wav' }), filename);
  form.append('model', model);
  form.append('response_format', 'json');

  return {
    url: GROQ_URL,
    init: {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    },
  };
}

/** Pure: builds the argv for a whisper.cpp `main`/`whisper-cli` invocation. */
export function buildWhisperCppArgs({ model, wavFile }) {
  return ['-m', model, '-f', wavFile, '-nt'];
}

/** Pure: strips whisper.cpp timestamp prefixes some builds emit even with -nt. */
export function parseWhisperCppOutput(stdout) {
  return stdout
    .split('\n')
    .map((line) => line.replace(TIMESTAMP_LINE, ''))
    .join('\n')
    .trim();
}

export async function transcribeWithGroq({ apiKey, model, wavPath }) {
  const wavBuffer = await readFile(wavPath);
  const { url, init } = buildGroqRequestInit({ apiKey, model, wavBuffer });
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Groq transcription failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const json = await res.json();
  return (json.text ?? '').trim();
}

export function transcribeWithWhisperCpp({ binary, model, wavPath }) {
  return new Promise((resolve, reject) => {
    const args = buildWhisperCppArgs({ model, wavFile: wavPath });
    const child = spawn(binary, args);
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => (stdout += chunk.toString()));
    child.stderr.on('data', (chunk) => (stderr += chunk.toString()));
    child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(new Error(`whisper.cpp binary not found at "${binary}". Check whispercpp_binary_path.`));
      } else {
        reject(err);
      }
    });
    child.on('close', (code) => {
      if (code === 0) resolve(parseWhisperCppOutput(stdout));
      else reject(new Error(`whisper.cpp exited with code ${code}: ${stderr.trim()}`));
    });
  });
}

/** Dispatches to the configured STT backend. */
export async function transcribe(sttConfig, wavPath) {
  if (sttConfig.backend === 'whispercpp') {
    if (!sttConfig.whisperCppBinary || !sttConfig.whisperCppModel) {
      throw new Error(
        'stt_backend is "whispercpp" but whispercpp_binary_path and/or whispercpp_model_path ' +
          'are not set in the Devspeak plugin config.'
      );
    }
    return transcribeWithWhisperCpp({
      binary: sttConfig.whisperCppBinary,
      model: sttConfig.whisperCppModel,
      wavPath,
    });
  }
  return transcribeWithGroq({ apiKey: sttConfig.groqApiKey, model: sttConfig.groqModel, wavPath });
}
