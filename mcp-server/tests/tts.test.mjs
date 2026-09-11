import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildElevenLabsRequestInit, buildPiperArgs, buildSystemSpeakCandidates } from '../src/tts.mjs';

test('buildSystemSpeakCandidates uses say on darwin', () => {
  const candidates = buildSystemSpeakCandidates({ platform: 'darwin', text: 'hello' });
  assert.deepEqual(candidates, [{ command: 'say', args: ['hello'] }]);
});

test('buildSystemSpeakCandidates uses PowerShell speech synthesis via stdin on win32', () => {
  const candidates = buildSystemSpeakCandidates({ platform: 'win32', text: 'hello' });
  assert.equal(candidates[0].command, 'powershell');
  assert.equal(candidates[0].input, 'hello');
  // Text must never be interpolated into the -Command string (injection risk).
  assert.ok(!candidates[0].args.join(' ').includes('hello'));
});

test('buildSystemSpeakCandidates tries spd-say then espeak variants on linux', () => {
  const candidates = buildSystemSpeakCandidates({ platform: 'linux', text: 'hello' });
  assert.deepEqual(
    candidates.map((c) => c.command),
    ['spd-say', 'espeak-ng', 'espeak']
  );
});

test('buildPiperArgs builds argv with model and output file', () => {
  const { args } = buildPiperArgs({ model: '/voices/en_US.onnx', outFile: '/tmp/out.wav' });
  assert.deepEqual(args, ['--model', '/voices/en_US.onnx', '--output_file', '/tmp/out.wav']);
});

test('buildElevenLabsRequestInit throws when apiKey or voiceId is missing', () => {
  assert.throws(() => buildElevenLabsRequestInit({ apiKey: undefined, voiceId: 'v1', text: 'hi' }), /not set/);
  assert.throws(() => buildElevenLabsRequestInit({ apiKey: 'k1', voiceId: undefined, text: 'hi' }), /not set/);
});

test('buildElevenLabsRequestInit builds the correct URL and JSON body', () => {
  const { url, init } = buildElevenLabsRequestInit({ apiKey: 'k1', voiceId: 'v1', text: 'hello there' });
  assert.equal(url, 'https://api.elevenlabs.io/v1/text-to-speech/v1');
  assert.equal(init.headers['xi-api-key'], 'k1');
  assert.deepEqual(JSON.parse(init.body), { text: 'hello there', model_id: 'eleven_multilingual_v2' });
});
