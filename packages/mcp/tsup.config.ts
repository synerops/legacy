import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2020',

  external: [
    '@modelcontextprotocol/sdk',
    '@syner/github',
    '@syner/sdk',
    'ai',
    'zod',
    'bun',
    /^node:/,
  ],

  splitting: false,
  treeshake: true,
})
