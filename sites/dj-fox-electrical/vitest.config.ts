import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@platform/core-components': path.resolve(__dirname, '../../packages/core-components/src'),
      '@platform/theme-system': path.resolve(__dirname, '../../packages/theme-system/src'),
    },
  },
});
