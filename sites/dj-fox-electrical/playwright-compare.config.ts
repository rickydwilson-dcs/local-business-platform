import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'screenshot-compare.spec.ts',
  fullyParallel: true,
  reporter: 'line',
  timeout: 30000,
  use: {
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
