import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, beforeEach, test } from 'node:test';

import {
  addSession,
  progressFilePath,
  readProgress,
  recurring,
  summary,
} from '../scripts/progress.mjs';

let dataDir;

beforeEach(() => {
  dataDir = mkdtempSync(join(tmpdir(), 'devspeak-test-'));
});

after(() => {
  // Best-effort cleanup of the last dir; each test also gets a fresh one.
  try {
    rmSync(dataDir, { recursive: true, force: true });
  } catch {
    // ignore
  }
});

test('readProgress returns an empty store when no file exists', () => {
  const store = readProgress(dataDir);
  assert.deepEqual(store, { sessions: [] });
});

test('readProgress throws a clear error on corrupted JSON', () => {
  writeFileSync(progressFilePath(dataDir), '{ not valid json', 'utf8');
  assert.throws(() => readProgress(dataDir), /corrupted \(invalid JSON\)/);
});

test('readProgress throws a clear error when "sessions" is missing', () => {
  writeFileSync(progressFilePath(dataDir), JSON.stringify({ foo: 'bar' }), 'utf8');
  assert.throws(() => readProgress(dataDir), /missing "sessions" array/);
});

test('addSession appends a session and persists it', () => {
  const session = addSession(dataDir, {
    scenario: 'daily-standup',
    level: 'B1',
    mistakes: [{ category: 'false-cognates', said: 'actually', correct: 'currently' }],
  });

  assert.equal(session.scenario, 'daily-standup');
  assert.equal(session.level, 'B1');
  assert.ok(session.id);
  assert.ok(session.date);

  const store = readProgress(dataDir);
  assert.equal(store.sessions.length, 1);
  assert.equal(store.sessions[0].id, session.id);
});

test('addSession requires scenario and level', () => {
  assert.throws(() => addSession(dataDir, { level: 'B1', mistakes: [] }), /--scenario is required/);
  assert.throws(
    () => addSession(dataDir, { scenario: 'daily-standup', mistakes: [] }),
    /--level is required/
  );
});

test('addSession validates mistake shape', () => {
  assert.throws(
    () => addSession(dataDir, { scenario: 'x', level: 'B1', mistakes: [{ category: 'x' }] }),
    /mistakes\[0\]\.said must be a non-empty string/
  );
  assert.throws(
    () => addSession(dataDir, { scenario: 'x', level: 'B1', mistakes: 'not-an-array' }),
    /mistakes must be a JSON array/
  );
});

test('summary reports totals, level history and current level', () => {
  addSession(dataDir, {
    scenario: 'daily-standup',
    level: 'A2',
    mistakes: [{ category: 'verb-tense', said: 'I have 5 years', correct: "I've been working for 5 years" }],
  });
  addSession(dataDir, {
    scenario: 'pr-review-discussion',
    level: 'B1',
    mistakes: [{ category: 'verb-tense', said: 'I have 5 years', correct: "I've been working for 5 years" }],
  });

  const result = summary(dataDir);
  assert.equal(result.totalSessions, 2);
  assert.equal(result.currentLevel, 'B1');
  assert.deepEqual(result.scenariosPracticed.sort(), ['daily-standup', 'pr-review-discussion']);
  assert.equal(result.levelHistory.length, 2);
  assert.equal(result.recurringMistakes[0].category, 'verb-tense');
  assert.equal(result.recurringMistakes[0].count, 2);
});

test('recurring groups mistakes by category and ranks by frequency', () => {
  addSession(dataDir, {
    scenario: 'daily-standup',
    level: 'A2',
    mistakes: [
      { category: 'prepositions', said: 'depend of', correct: 'depend on' },
      { category: 'false-cognates', said: 'actually', correct: 'currently' },
    ],
  });
  addSession(dataDir, {
    scenario: 'pr-review-discussion',
    level: 'B1',
    mistakes: [{ category: 'prepositions', said: 'arrived at the company', correct: 'joined the company' }],
  });

  const top = recurring(dataDir, 1);
  assert.equal(top.length, 1);
  assert.equal(top[0].category, 'prepositions');
  assert.equal(top[0].count, 2);
  assert.equal(top[0].examples.length, 2);
});

test('recurring returns an empty list for an empty store', () => {
  assert.deepEqual(recurring(dataDir, 5), []);
});
