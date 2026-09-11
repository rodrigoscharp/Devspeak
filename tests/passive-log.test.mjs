import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, test } from 'node:test';

import {
  captureEntry,
  isLikelyEnglish,
  listEntries,
  markReviewedThrough,
  passiveLogFilePath,
  readStore,
} from '../scripts/passive-log.mjs';

let dataDir;

beforeEach(() => {
  dataDir = mkdtempSync(join(tmpdir(), 'devspeak-passive-test-'));
});

test('isLikelyEnglish detects English text', () => {
  assert.equal(isLikelyEnglish('Can you help me fix this bug in the API?'), true);
});

test('isLikelyEnglish rejects Portuguese text', () => {
  assert.equal(isLikelyEnglish('Você pode me ajudar a corrigir esse bug na API?'), false);
});

test('isLikelyEnglish rejects short/ambiguous text', () => {
  assert.equal(isLikelyEnglish('ok'), false);
  assert.equal(isLikelyEnglish('npm run build'), false);
});

test('captureEntry does nothing when passive mode is disabled', () => {
  const entry = captureEntry(dataDir, {
    passiveMode: 'false',
    prompt: 'Can you please help me understand this error message?',
  });
  assert.equal(entry, null);
  assert.deepEqual(readStore(dataDir).entries, []);
});

test('captureEntry does nothing for slash commands', () => {
  const entry = captureEntry(dataDir, {
    passiveMode: 'true',
    prompt: '/devspeak:diaria',
  });
  assert.equal(entry, null);
});

test('captureEntry does nothing for short prompts', () => {
  const entry = captureEntry(dataDir, { passiveMode: 'true', prompt: 'fix it' });
  assert.equal(entry, null);
});

test('captureEntry does nothing for Portuguese prompts', () => {
  const entry = captureEntry(dataDir, {
    passiveMode: 'true',
    prompt: 'Você pode me ajudar a corrigir esse bug na API agora?',
  });
  assert.equal(entry, null);
});

test('captureEntry records a qualifying English prompt', () => {
  const entry = captureEntry(dataDir, {
    passiveMode: 'true',
    prompt: 'Can you help me understand why this test is failing?',
  });
  assert.ok(entry);
  assert.equal(entry.prompt, 'Can you help me understand why this test is failing?');
  assert.equal(readStore(dataDir).entries.length, 1);
});

test('listEntries returns everything when no cursor is set', () => {
  captureEntry(dataDir, { passiveMode: true, prompt: 'I need help debugging this issue please' });
  captureEntry(dataDir, { passiveMode: true, prompt: 'Could you explain how this function works' });
  assert.equal(listEntries(dataDir).length, 2);
});

test('markReviewedThrough advances the cursor and listEntries respects it', () => {
  const first = captureEntry(dataDir, {
    passiveMode: true,
    prompt: 'I need help debugging this issue please',
  });
  markReviewedThrough(dataDir, first.id);
  captureEntry(dataDir, { passiveMode: true, prompt: 'Could you explain how this function works' });

  const unreviewed = listEntries(dataDir);
  assert.equal(unreviewed.length, 1);
  assert.equal(unreviewed[0].prompt, 'Could you explain how this function works');
});

test('readStore throws a clear error on corrupted JSON', () => {
  writeFileSync(passiveLogFilePath(dataDir), '{ nope', 'utf8');
  assert.throws(() => readStore(dataDir), /corrupted \(invalid JSON\)/);
});
