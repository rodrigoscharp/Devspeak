import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  outfile: 'dist/index.mjs',
  // src/index.ts already starts with its own shebang line; esbuild preserves it.
  external: [],
  logLevel: 'info',
});
