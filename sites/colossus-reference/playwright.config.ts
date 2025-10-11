import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Testing Configuration
 *
 * Test Patterns:
 * - smoke.spec.ts: Fast smoke tests (~30s) - RUN IN CI
 * - *.spec.ts: Standard functional tests (~2-3min) - RUN IN CI
 * - *.full.spec.ts: Comprehensive tests (~10min+) - OPTIONAL/SCHEDULED
 *
 * Usage:
 * - npm run test:e2e:smoke - Only smoke tests (fast)
 * - npm run test:e2e - Standard tests (default)
 * - npm run test:e2e:full - All tests including heavy ones
 */
export default defineConfig({
  testDir: "./e2e",
  // Only run smoke and standard tests by default (exclude .full.spec.ts)
  testMatch: process.env.E2E_FULL ? "**/*.spec.ts" : "**/*.spec.ts",
  testIgnore: process.env.E2E_FULL ? [] : "**/*.full.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  timeout: 30000,

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
