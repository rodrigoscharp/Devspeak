// Recording and playback helpers. Argument/command builders are pure and
// unit-tested; the actual spawn() calls are thin IO wrappers around them.

import { spawn } from 'node:child_process';

const SAMPLE_RATE = 16000;

/** Pure: builds the argv for recording `durationSeconds` of mono 16kHz audio from the default input device via sox. */
export function buildRecordArgs({ outFile, durationSeconds }) {
  return ['-d', '-r', String(SAMPLE_RATE), '-c', '1', outFile, 'trim', '0', String(durationSeconds)];
}

/**
 * Pure: ordered list of player candidates to try for a given file/platform.
 * We try each in order until one is found on PATH and succeeds.
 */
export function buildPlayCandidates({ platform, file }) {
  const isMp3 = file.toLowerCase().endsWith('.mp3');

  if (platform === 'darwin') return [{ command: 'afplay', args: [file] }];

  if (platform === 'win32') {
    return [
      {
        command: 'powershell',
        args: ['-NoProfile', '-Command', `(New-Object Media.SoundPlayer '${file}').PlaySync();`],
      },
    ];
  }

  // linux and other unix-likes
  if (isMp3) {
    return [
      { command: 'mpg123', args: ['-q', file] },
      { command: 'ffplay', args: ['-nodisp', '-autoexit', '-loglevel', 'quiet', file] },
    ];
  }
  return [
    { command: 'aplay', args: ['-q', file] },
    { command: 'paplay', args: [file] },
  ];
}

function runCommand(command, args, { input } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: input !== undefined ? ['pipe', 'ignore', 'pipe'] : ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(Object.assign(new Error(`"${command}" was not found on PATH.`), { code: 'ENOENT' }));
      } else {
        reject(err);
      }
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`"${command}" exited with code ${code}: ${stderr.trim()}`));
    });
    if (input !== undefined) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

/** Tries each {command, args, input} candidate in order until one runs successfully. */
export async function runWithFallback(candidates) {
  let lastError;
  for (const { command, args, input } of candidates) {
    try {
      await runCommand(command, args, { input });
      return;
    } catch (err) {
      lastError = err;
      if (err.code !== 'ENOENT') throw err; // real failure, not just "not installed" — stop trying
    }
  }
  const tried = candidates.map((c) => c.command).join(', ');
  throw new Error(`None of the following commands were available: ${tried}. Last error: ${lastError?.message}`);
}

/** Records audio to `outFile` for `durationSeconds` using sox. */
export async function recordAudio({ soxBinary, outFile, durationSeconds }) {
  try {
    await runCommand(soxBinary, buildRecordArgs({ outFile, durationSeconds }));
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(
        `"${soxBinary}" was not found. Install sox to use voice input (e.g. "brew install sox" ` +
          'on macOS, "apt install sox" on Debian/Ubuntu).'
      );
    }
    throw err;
  }
}

/** Plays an audio file, trying platform-appropriate players in order. */
export async function playAudio(file, platform = process.platform) {
  await runWithFallback(buildPlayCandidates({ platform, file }));
}

export { runCommand };
