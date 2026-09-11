#!/usr/bin/env node
// Devspeak progress tracker. Node >= 18, zero dependencies.
// Data lives at <dataDir>/progress.json (see resolveDataDir).

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

const MISTAKE_FIELDS = ['category', 'said', 'correct'];

export function progressFilePath(dataDir) {
  return join(dataDir, 'progress.json');
}

function emptyStore() {
  return { sessions: [] };
}

export function readProgress(dataDir) {
  const filePath = progressFilePath(dataDir);
  const result = readJsonFile(filePath);
  if (!result.exists) return emptyStore();

  const parsed = result.data;
  if (!parsed || !Array.isArray(parsed.sessions)) {
    throw new Error(`Progress file at ${filePath} is corrupted (missing "sessions" array).`);
  }

  return parsed;
}

export function writeProgress(dataDir, store) {
  writeJsonFileAtomic(progressFilePath(dataDir), store);
}

function validateMistakes(mistakes) {
  if (!Array.isArray(mistakes)) {
    throw new Error('mistakes must be a JSON array');
  }
  for (const [i, m] of mistakes.entries()) {
    if (!m || typeof m !== 'object') {
      throw new Error(`mistakes[${i}] must be an object`);
    }
    for (const field of MISTAKE_FIELDS) {
      if (typeof m[field] !== 'string' || m[field].length === 0) {
        throw new Error(`mistakes[${i}].${field} must be a non-empty string`);
      }
    }
  }
}

export function addSession(dataDir, { scenario, level, mistakes }) {
  if (!scenario) throw new Error('--scenario is required');
  if (!level) throw new Error('--level is required');
  validateMistakes(mistakes);

  const store = readProgress(dataDir);
  const session = {
    id: randomUUID(),
    date: new Date().toISOString(),
    scenario,
    level,
    mistakes,
  };
  store.sessions.push(session);
  writeProgress(dataDir, store);
  return session;
}

export function recurring(dataDir, limit = 5) {
  const store = readProgress(dataDir);
  const byCategory = new Map();

  for (const session of store.sessions) {
    for (const mistake of session.mistakes) {
      const key = mistake.category;
      if (!byCategory.has(key)) {
        byCategory.set(key, { category: key, count: 0, examples: [] });
      }
      const entry = byCategory.get(key);
      entry.count += 1;
      const alreadyListed = entry.examples.some(
        (ex) => ex.said === mistake.said && ex.correct === mistake.correct
      );
      if (!alreadyListed && entry.examples.length < 3) {
        entry.examples.push({ said: mistake.said, correct: mistake.correct });
      }
    }
  }

  return [...byCategory.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

export function summary(dataDir) {
  const store = readProgress(dataDir);
  const levelHistory = store.sessions.map((s) => ({
    date: s.date,
    scenario: s.scenario,
    level: s.level,
  }));
  const scenariosPracticed = new Set(store.sessions.map((s) => s.scenario));
  const lastSession = store.sessions[store.sessions.length - 1];

  return {
    totalSessions: store.sessions.length,
    scenariosPracticed: [...scenariosPracticed],
    levelHistory,
    currentLevel: lastSession ? lastSession.level : null,
    recurringMistakes: recurring(dataDir, 5),
  };
}

function main() {
  const argv = process.argv.slice(2);
  const [command, ...rest] = argv;
  const flags = parseFlags(rest);
  const dataDir = resolveDataDir(argv);

  try {
    switch (command) {
      case 'add-session': {
        let mistakes = [];
        if (flags.mistakes) {
          try {
            mistakes = JSON.parse(flags.mistakes);
          } catch (err) {
            throw new Error(`--mistakes must be valid JSON: ${err.message}`);
          }
        }
        const session = addSession(dataDir, {
          scenario: flags.scenario,
          level: flags.level,
          mistakes,
        });
        process.stdout.write(`${JSON.stringify(session, null, 2)}\n`);
        break;
      }
      case 'summary': {
        process.stdout.write(`${JSON.stringify(summary(dataDir), null, 2)}\n`);
        break;
      }
      case 'recurring': {
        const limit = flags.limit ? Number(flags.limit) : 5;
        process.stdout.write(`${JSON.stringify(recurring(dataDir, limit), null, 2)}\n`);
        break;
      }
      default: {
        printError(
          `Unknown command "${command ?? ''}". Use: add-session | summary | recurring`
        );
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
