// Shared, dependency-free helpers for Devspeak's local data scripts.

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export function resolveDataDir(argv = process.argv.slice(2), flagName = '--data-dir') {
  const flagIndex = argv.indexOf(flagName);
  if (flagIndex !== -1 && argv[flagIndex + 1]) return argv[flagIndex + 1];
  if (process.env.CLAUDE_PLUGIN_DATA) return process.env.CLAUDE_PLUGIN_DATA;
  return join(homedir(), '.devspeak');
}

export function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = value;
        i += 1;
      }
    }
  }
  return flags;
}

/**
 * Reads and JSON-parses a file. Returns { exists: false } if missing.
 * Throws a descriptive error if the file exists but isn't valid JSON.
 */
export function readJsonFile(filePath) {
  if (!existsSync(filePath)) return { exists: false };

  let raw;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    throw new Error(`Could not read file at ${filePath}: ${err.message}`);
  }

  try {
    return { exists: true, data: JSON.parse(raw) };
  } catch (err) {
    throw new Error(
      `File at ${filePath} is corrupted (invalid JSON): ${err.message}. ` +
        'Fix or remove the file to continue.'
    );
  }
}

export function writeJsonFileAtomic(filePath, data) {
  mkdirSync(dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  renameSync(tmpPath, filePath);
}

export function printError(message) {
  process.stderr.write(`Error: ${message}\n`);
}
