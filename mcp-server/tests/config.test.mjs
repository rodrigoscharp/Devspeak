import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getSttConfig, getTtsConfig } from '../src/config.mjs';

test('getSttConfig defaults to groq with the turbo model', () => {
  const config = getSttConfig({});
  assert.equal(config.backend, 'groq');
  assert.equal(config.groqModel, 'whisper-large-v3-turbo');
  assert.equal(config.groqApiKey, undefined);
  assert.equal(config.soxBinary, 'sox');
});

test('getSttConfig reads whispercpp settings and treats blank env as unset', () => {
  const config = getSttConfig({
    DEVSPEAK_STT_BACKEND: 'whispercpp',
    DEVSPEAK_WHISPERCPP_BINARY: '/usr/local/bin/whisper',
    DEVSPEAK_WHISPERCPP_MODEL: '/models/ggml-base.bin',
    GROQ_API_KEY: '   ',
  });
  assert.equal(config.backend, 'whispercpp');
  assert.equal(config.whisperCppBinary, '/usr/local/bin/whisper');
  assert.equal(config.whisperCppModel, '/models/ggml-base.bin');
  assert.equal(config.groqApiKey, undefined);
});

test('getTtsConfig defaults to system backend', () => {
  const config = getTtsConfig({});
  assert.equal(config.backend, 'system');
  assert.equal(config.piperBinary, undefined);
  assert.equal(config.elevenLabsApiKey, undefined);
});

test('getTtsConfig reads elevenlabs settings', () => {
  const config = getTtsConfig({
    DEVSPEAK_TTS_BACKEND: 'elevenlabs',
    ELEVENLABS_API_KEY: 'key123',
    DEVSPEAK_ELEVENLABS_VOICE_ID: 'voice123',
  });
  assert.equal(config.backend, 'elevenlabs');
  assert.equal(config.elevenLabsApiKey, 'key123');
  assert.equal(config.elevenLabsVoiceId, 'voice123');
});
