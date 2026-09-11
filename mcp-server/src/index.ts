#!/usr/bin/env node
// Devspeak voice MCP server: listen() (speech-to-text) and speak()
// (text-to-speech) tools for spoken role-play practice.
//
// Backends are chosen via env vars populated from the plugin's userConfig
// (see ../../.mcp.json). Defaults: Groq Whisper for STT, the OS's built-in
// TTS for speech — see config.mjs for the full list of options.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unlink } from 'node:fs/promises';

import { getSttConfig, getTtsConfig } from './config.mjs';
import { recordAudio } from './audio.mjs';
import { transcribe } from './stt.mjs';
import { speak as speakText } from './tts.mjs';

const MIN_DURATION = 3;
const MAX_DURATION = 30;
const DEFAULT_DURATION = 8;

const server = new McpServer({ name: 'devspeak-voice', version: '0.1.0' });

server.registerTool(
  'listen',
  {
    description:
      'Records the user speaking through the microphone for a fixed duration and transcribes it to ' +
      'text. Use during a Devspeak voice role-play session to capture the user\'s spoken response ' +
      'instead of asking them to type. Requires sox to be installed for recording.',
    inputSchema: {
      durationSeconds: z
        .number()
        .int()
        .min(MIN_DURATION)
        .max(MAX_DURATION)
        .default(DEFAULT_DURATION)
        .describe(`How many seconds to record (${MIN_DURATION}-${MAX_DURATION}). Default ${DEFAULT_DURATION}.`),
    },
  },
  async ({ durationSeconds }) => {
    const wavPath = join(tmpdir(), `devspeak-listen-${randomUUID()}.wav`);
    try {
      const sttConfig = getSttConfig();
      await recordAudio({ soxBinary: sttConfig.soxBinary, outFile: wavPath, durationSeconds });
      const text = await transcribe(sttConfig, wavPath);
      if (!text) {
        return {
          isError: true,
          content: [{ type: 'text', text: 'Recorded audio but got no transcript (silence, or STT returned empty). Try again and speak clearly.' }],
        };
      }
      return { content: [{ type: 'text', text }] };
    } catch (err) {
      return { isError: true, content: [{ type: 'text', text: `listen() failed: ${(err as Error).message}` }] };
    } finally {
      await unlink(wavPath).catch(() => {});
    }
  }
);

server.registerTool(
  'speak',
  {
    description:
      'Speaks the given text out loud using text-to-speech. Use during a Devspeak voice role-play ' +
      'session to speak the persona\'s line instead of just printing it as text.',
    inputSchema: {
      text: z.string().min(1).describe('The text to speak aloud.'),
    },
  },
  async ({ text }) => {
    try {
      const ttsConfig = getTtsConfig();
      await speakText(ttsConfig, text);
      return { content: [{ type: 'text', text: 'Spoken.' }] };
    } catch (err) {
      return { isError: true, content: [{ type: 'text', text: `speak() failed: ${(err as Error).message}` }] };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error starting devspeak-voice MCP server:', err);
  process.exit(1);
});
