import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, test } from 'node:test';

import { addWord, dueWords, readStore, reviewWord, vocabFilePath } from '../scripts/vocab.mjs';

let dataDir;

beforeEach(() => {
  dataDir = mkdtempSync(join(tmpdir(), 'devspeak-vocab-test-'));
});

test('addWord creates a new word due immediately, in box 1', () => {
  const word = addWord(dataDir, { phrase: 'ship to prod', translation: 'subir pra produção' });
  assert.equal(word.box, 1);
  assert.equal(word.reviewCount, 0);
  assert.ok(word.dueDate <= new Date().toISOString());
});

test('addWord is idempotent (case-insensitive) on phrase', () => {
  const first = addWord(dataDir, { phrase: 'roll back' });
  const second = addWord(dataDir, { phrase: 'Roll Back' });
  assert.equal(first.id, second.id);
  assert.equal(readStore(dataDir).words.length, 1);
});

test('addWord requires a phrase', () => {
  assert.throws(() => addWord(dataDir, { phrase: '' }), /--phrase is required/);
});

test('dueWords returns only words due now or in the past', () => {
  addWord(dataDir, { phrase: 'merge the branch' });
  const future = addWord(dataDir, { phrase: 'not due yet' });
  const store = readStore(dataDir);
  const target = store.words.find((w) => w.id === future.id);
  target.dueDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
  writeStoreForTest(dataDir, store);

  const due = dueWords(dataDir);
  assert.equal(due.length, 1);
  assert.equal(due[0].phrase, 'merge the branch');
});

test('reviewWord promotes the box and pushes the due date forward on a correct answer', () => {
  const word = addWord(dataDir, { phrase: 'depend on' });
  const reviewed = reviewWord(dataDir, { id: word.id, correct: true });
  assert.equal(reviewed.box, 2);
  assert.equal(reviewed.reviewCount, 1);
  assert.ok(reviewed.dueDate > word.dueDate);
});

test('reviewWord resets to box 1 on an incorrect answer', () => {
  const word = addWord(dataDir, { phrase: 'arrive at' });
  reviewWord(dataDir, { id: word.id, correct: true });
  const reviewed = reviewWord(dataDir, { id: word.id, correct: false });
  assert.equal(reviewed.box, 1);
});

test('reviewWord can look up a word by phrase instead of id', () => {
  addWord(dataDir, { phrase: 'push to production' });
  const reviewed = reviewWord(dataDir, { phrase: 'Push To Production', correct: true });
  assert.equal(reviewed.box, 2);
});

test('reviewWord throws for an unknown word', () => {
  assert.throws(() => reviewWord(dataDir, { phrase: 'nope', correct: true }), /not found/);
});

test('readStore throws a clear error on corrupted JSON', () => {
  writeFileSync(vocabFilePath(dataDir), '{ nope', 'utf8');
  assert.throws(() => readStore(dataDir), /corrupted \(invalid JSON\)/);
});

function writeStoreForTest(dir, store) {
  writeFileSync(vocabFilePath(dir), JSON.stringify(store, null, 2), 'utf8');
}
