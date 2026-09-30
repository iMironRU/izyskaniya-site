import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: { alias: { '@tokens': r('./build/ts/tokens.js'), '@': r('./src') } },
  test: { include: ['src/**/*.test.ts'] },
});
