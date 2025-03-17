// Nextjs Vitest Guide: nextjs.org/docs/app/building-your-application/testing/vitest

import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    /**
     * Option added because vitest runner was not existing correctly, even when tests were successful
     * https://vitest.dev/guide/common-errors.html#failed-to-terminate-worker
     */
    pool: 'forks',
  },
  base: './src/*',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
