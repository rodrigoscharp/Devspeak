import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildGroqRequestInit, buildWhisperCppArgs, parseWhisperCppOutput } from '../src/stt.mjs';

test('buildGroqRequestInit throws when apiKey is missing', () => {
  assert.throws(
    () => buildGroqRequestInit({ apiKey: undefined, model: 'whisper-large-v3-turbo', wavBuffer: Buffer.from('x') }),
    /GROQ_API_KEY is not set/
  );
});

test('buildGroqRequestInit builds a multipart request with auth header', () => {
  const { url, init } = buildGroqRequestInit({
    apiKey: 'sk-test',
    model: 'whisper-large-v3-turbo',
    wavBuffer: Buffer.from('fake-audio'),
  });
  assert.equal(url, 'https://api.groq.com/openai/v1/audio/transcriptions');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers.Authorization, 'Bearer sk-test');
  assert.ok(init.body instanceof FormData);
});

test('buildWhisperCppArgs builds argv with no-timestamps flag', () => {
  const args = buildWhisperCppArgs({ model: '/models/ggml-base.bin', wavFile: '/tmp/a.wav' });
  assert.deepEqual(args, ['-m', '/models/ggml-base.bin', '-f', '/tmp/a.wav', '-nt']);
});

test('parseWhisperCppOutput strips timestamp-bracket prefixes', () => {
  const raw = '[00:00.000 --> 00:02.500]  Hello there\n[00:02.500 --> 00:04.000]  How are you?';
  assert.equal(parseWhisperCppOutput(raw), 'Hello there\nHow are you?');
});

test('parseWhisperCppOutput passes plain text through unchanged (already -nt)', () => {
  assert.equal(parseWhisperCppOutput('  Hello there  \n'), 'Hello there');
});
