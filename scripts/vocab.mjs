#!/usr/bin/env node
// Devspeak spaced-repetition vocabulary tracker. Node >= 18, zero dependencies.
// Data lives at <dataDir>/vocab.json.
//
// Uses a simple Leitner-box scheme: each word has a box (1-6). A correct
// review promotes it to the next box (longer interval); an incorrect review
// drops it back to box 1 (due again tomorrow).

import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import {
  parseFlags,
  printError,
  readJsonFile,
  resolveDataDir,
  writeJsonFileAtomic,
} from './lib/store.mjs';

export { resolveDataDir };

const MAX_BOX = 6;
const BOX_INTERVAL_DAYS = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16, 6: 32 };
const DAY_MS = 24 * 60 * 60 * 1000;

export function vocabFilePath(dataDir) {
  return join(dataDir, 'vocab.json');
}

function emptyStore() {
  return { words: [] };
}

export function readStore(dataDir) {
  const filePath = vocabFilePath(dataDir);
  const result = readJsonFile(filePath);
  if (!result.exists) return emptyStore();

  const parsed = result.data;
  if (!parsed || !Array.isArray(parsed.words)) {
    throw new Error(`Vocab file at ${filePath} is corrupted (missing "words" array).`);
  }
  return parsed;
}

function writeStore(dataDir, store) {
  writeJsonFileAtomic(vocabFilePath(dataDir), store);
}

function dueDateForBox(box, from = new Date()) {
  return new Date(from.getTime() + BOX_INTERVAL_DAYS[box] * DAY_MS).toISOString();
}

/**
 * Adds a word if it doesn't already exist (case-insensitive match on
 * phrase). New words start in box 1, due immediately. Returns the word
 * (existing or newly created).
 */
export function addWord(dataDir, { phrase, translation = '' }) {
  if (!phrase || !phrase.trim()) throw new Error('--phrase is required');

  const store = readStore(dataDir);
  const normalized = phrase.trim().toLowerCase();
  const existing = store.words.find((w) => w.phrase.toLowerCase() === normalized);
  if (existing) return existing;

  const word = {
    id: randomUUID(),
    phrase: phrase.trim(),
    translation: translation.trim(),
    box: 1,
    addedDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    reviewCount: 0,
  };
  store.words.push(word);
  writeStore(dataDir, store);
  return word;
}

export function dueWords(dataDir, limit = 10) {
  const store = readStore(dataDir);
  const now = new Date().toISOString();
  return store.words
    .filter((w) => w.dueDate <= now)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit);
}

function findWord(store, { id, phrase }) {
  if (id) return store.words.find((w) => w.id === id);
  if (phrase) return store.words.find((w) => w.phrase.toLowerCase() === phrase.trim().toLowerCase());
  return undefined;
}

/**
 * Records a review outcome and reschedules the word: promotes on success,
 * resets to box 1 on failure.
 */
export function reviewWord(dataDir, { id, phrase, correct }) {
  const store = readStore(dataDir);
  const word = findWord(store, { id, phrase });
  if (!word) throw new Error(`Word not found (id: ${id ?? 'n/a'}, phrase: ${phrase ?? 'n/a'})`);

  word.box = correct ? Math.min(word.box + 1, MAX_BOX) : 1;
  word.dueDate = dueDateForBox(word.box);
  word.reviewCount += 1;
  writeStore(dataDir, store);
  return word;
}

function main() {
  const argv = process.argv.slice(2);
  const [command, ...rest] = argv;
  const flags = parseFlags(rest);
  const dataDir = resolveDataDir(argv);

  try {
    switch (command) {
      case 'add': {
        const word = addWord(dataDir, { phrase: flags.phrase, translation: flags.translation });
        process.stdout.write(`${JSON.stringify(word, null, 2)}\n`);
        break;
      }
      case 'due': {
        const limit = flags.limit ? Number(flags.limit) : 10;
        process.stdout.write(`${JSON.stringify(dueWords(dataDir, limit), null, 2)}\n`);
        break;
      }
      case 'review': {
        const correct = flags.correct === 'true' || flags.correct === true;
        const word = reviewWord(dataDir, { id: flags.id, phrase: flags.phrase, correct });
        process.stdout.write(`${JSON.stringify(word, null, 2)}\n`);
        break;
      }
      default: {
        printError(`Unknown command "${command ?? ''}". Use: add | due | review`);
        process.exit(1);
      }
    }
  } catch (err) {
    printError(err.message);
    process.exit(1);
  }
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main();
}
