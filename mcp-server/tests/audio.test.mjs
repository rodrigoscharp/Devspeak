import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildPlayCandidates, buildRecordArgs, runWithFallback } from '../src/audio.mjs';

test('buildRecordArgs builds a mono 16kHz sox trim command', () => {
  const args = buildRecordArgs({ outFile: '/tmp/out.wav', durationSeconds: 8 });
  assert.deepEqual(args, ['-d', '-r', '16000', '-c', '1', '/tmp/out.wav', 'trim', '0', '8']);
});

test('buildPlayCandidates picks afplay on darwin', () => {
  const candidates = buildPlayCandidates({ platform: 'darwin', file: '/tmp/out.wav' });
  assert.deepEqual(candidates, [{ command: 'afplay', args: ['/tmp/out.wav'] }]);
});

test('buildPlayCandidates picks wav players on linux', () => {
  const candidates = buildPlayCandidates({ platform: 'linux', file: '/tmp/out.wav' });
  assert.equal(candidates[0].command, 'aplay');
  assert.equal(candidates[1].command, 'paplay');
});

test('buildPlayCandidates picks mp3 players on linux for .mp3 files', () => {
  const candidates = buildPlayCandidates({ platform: 'linux', file: '/tmp/out.mp3' });
  assert.equal(candidates[0].command, 'mpg123');
  assert.equal(candidates[1].command, 'ffplay');
});

test('buildPlayCandidates picks PowerShell SoundPlayer on win32', () => {
  const candidates = buildPlayCandidates({ platform: 'win32', file: 'C:\\out.wav' });
  assert.equal(candidates[0].command, 'powershell');
});

test('runWithFallback tries the next candidate when one is missing (ENOENT)', async () => {
  const candidates = [
    { command: 'definitely-not-a-real-binary-xyz', args: [] },
    { command: process.execPath, args: ['-e', 'process.exit(0)'] },
  ];
  await assert.doesNotReject(runWithFallback(candidates));
});

test('runWithFallback throws if every candidate is missing', async () => {
  const candidates = [{ command: 'definitely-not-a-real-binary-xyz', args: [] }];
  await assert.rejects(runWithFallback(candidates), /None of the following commands were available/);
});

test('runWithFallback propagates a real (non-ENOENT) failure immediately', async () => {
  const candidates = [
    { command: process.execPath, args: ['-e', 'process.exit(1)'] },
    { command: process.execPath, args: ['-e', 'process.exit(0)'] },
  ];
  await assert.rejects(runWithFallback(candidates), /exited with code 1/);
});
