// Reads voice-related config from environment variables, which the plugin
// populates from userConfig via ${user_config.*} substitution in .mcp.json.
// Pure functions — no I/O — so they're directly unit-testable.

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

export function getSttConfig(env = process.env) {
  const backend = nonEmpty(env.DEVSPEAK_STT_BACKEND) ?? 'groq';
  return {
    backend,
    groqApiKey: nonEmpty(env.GROQ_API_KEY),
    groqModel: nonEmpty(env.DEVSPEAK_GROQ_STT_MODEL) ?? 'whisper-large-v3-turbo',
    whisperCppBinary: nonEmpty(env.DEVSPEAK_WHISPERCPP_BINARY),
    whisperCppModel: nonEmpty(env.DEVSPEAK_WHISPERCPP_MODEL),
    soxBinary: nonEmpty(env.DEVSPEAK_SOX_BINARY) ?? 'sox',
  };
}

export function getTtsConfig(env = process.env) {
  const backend = nonEmpty(env.DEVSPEAK_TTS_BACKEND) ?? 'system';
  return {
    backend,
    piperBinary: nonEmpty(env.DEVSPEAK_PIPER_BINARY),
    piperVoice: nonEmpty(env.DEVSPEAK_PIPER_VOICE),
    elevenLabsApiKey: nonEmpty(env.ELEVENLABS_API_KEY),
    elevenLabsVoiceId: nonEmpty(env.DEVSPEAK_ELEVENLABS_VOICE_ID),
  };
}
