#!/usr/bin/env node
// Devspeak passive-mode log. Node >= 18, zero dependencies.
// Data lives at <dataDir>/passive-log.json.
//
// Captures English prompts the user writes during normal Claude Code usage
// (outside a devspeak role-play session), ONLY when passive_mode is enabled
// in the plugin's userConfig. Never throws from `capture` in a way that
// would disrupt the user's prompt — failures there are swallowed silently.

import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  parseFlags,
  printError,
  readJsonFile,
  resolveDataDir,
  writeJsonFileAtomic,
} from './lib/store.mjs';

export { resolveDataDir };

const MIN_PROMPT_LENGTH = 15;

// Small, deliberately non-exhaustive stopword lists used only to guess
// whether a prompt is English or Portuguese. False positives/negatives are
// acceptable here — this filters noise, it doesn't need to be precise.
const EN_STOPWORDS = new Set([
  'the', 'is', 'are', 'and', 'but', 'with', 'this', 'that', 'for', 'you',
  'your', 'have', 'has', 'i', 'we', 'it', 'to', 'of', 'in', 'on', 'can',
  'could', 'should', 'would', 'what', 'why', 'how', 'when', 'please', 'need',
  'want', 'my', 'me', 'not', 'do', 'does', 'will', 'was', 'were',
]);

const PT_STOPWORDS = new Set([
  'o', 'a', 'os', 'as', 'e', 'mas', 'com', 'isso', 'isto', 'para', 'você',
  'seu', 'sua', 'tem', 'tenho', 'eu', 'nós', 'ele', 'ela', 'de', 'em', 'no',
  'na', 'pode', 'poderia', 'deveria', 'que', 'por', 'quando', 'por favor',
  'preciso', 'quero', 'meu', 'minha', 'não', 'faz', 'vai', 'era', 'eram',
]);

export function isLikelyEnglish(text) {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let enScore = 0;
  let ptScore = 0;
  for (const word of words) {
    if (EN_STOPWORDS.has(word)) enScore += 1;
    if (PT_STOPWORDS.has(word)) ptScore += 1;
  }

  return enScore >= 2 && enScore > ptScore;
}

export function passiveLogFilePath(dataDir) {
  return join(dataDir, 'passive-log.json');
}

function emptyStore() {
  return { entries: [], cursor: { reviewedThroughId: null } };
}

export function readStore(dataDir) {
  const filePath = passiveLogFilePath(dataDir);
  const result = readJsonFile(filePath);
  if (!result.exists) return emptyStore();

  const parsed = result.data;
  if (!parsed || !Array.isArray(parsed.entries)) {
    throw new Error(`Passive log at ${filePath} is corrupted (missing "entries" array).`);
  }
  if (!parsed.cursor) parsed.cursor = { reviewedThroughId: null };
  return parsed;
}

function writeStore(dataDir, store) {
  writeJsonFileAtomic(passiveLogFilePath(dataDir), store);
}

/**
 * Records a prompt if, and only if, passive mode is enabled and the prompt
 * looks like a genuine English message worth reviewing later. Returns the
 * stored entry, or null if nothing was recorded.
 */
export function captureEntry(dataDir, { passiveMode, prompt }) {
  if (passiveMode !== true && passiveMode !== 'true') return null;
  if (typeof prompt !== 'string') return null;

  const trimmed = prompt.trim();
  if (trimmed.length < MIN_PROMPT_LENGTH) return null;
  if (trimmed.startsWith('/')) return null; // skip slash commands
  if (!isLikelyEnglish(trimmed)) return null;

  const store = readStore(dataDir);
  const entry = { id: randomUUID(), date: new Date().toISOString(), prompt: trimmed };
  store.entries.push(entry);
  writeStore(dataDir, store);
  return entry;
}

/**
 * Returns entries not yet reviewed: everything after the entry id recorded
 * as the cursor. If the cursor is unset (or no longer found), returns all
 * entries.
 */
export function listEntries(dataDir) {
  const store = readStore(dataDir);
  const cursorId = store.cursor.reviewedThroughId;
  if (!cursorId) return store.entries;

  const cursorIndex = store.entries.findIndex((e) => e.id === cursorId);
  if (cursorIndex === -1) return store.entries;
  return store.entries.slice(cursorIndex + 1);
}

export function markReviewedThrough(dataDir, entryId) {
  const store = readStore(dataDir);
  store.cursor.reviewedThroughId = entryId;
  writeStore(dataDir, store);
  return store.cursor;
}

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  const argv = process.argv.slice(2);
  const [command, ...rest] = argv;
  const flags = parseFlags(rest);
  const dataDir = resolveDataDir(argv);

  if (command === 'capture') {
    // Never let this command fail loudly: it runs as a UserPromptSubmit
    // hook and must not disrupt the user's normal flow.
    try {
      const raw = readStdin();
      const payload = raw ? JSON.parse(raw) : {};
      captureEntry(dataDir, {
        passiveMode: flags['passive-mode'],
        prompt: payload.prompt,
      });
    } catch {
      // swallow — passive logging is best-effort only
    }
    process.exit(0);
  }

  try {
    switch (command) {
      case 'list': {
        const entries = listEntries(dataDir);
        process.stdout.write(`${JSON.stringify(entries, null, 2)}\n`);
        break;
      }
      case 'mark-reviewed': {
        if (!flags['through-id']) throw new Error('--through-id <entry id> is required');
        const cursor = markReviewedThrough(dataDir, flags['through-id']);
        process.stdout.write(`${JSON.stringify(cursor, null, 2)}\n`);
        break;
      }
      default: {
        printError(`Unknown command "${command ?? ''}". Use: capture | list | mark-reviewed`);
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
