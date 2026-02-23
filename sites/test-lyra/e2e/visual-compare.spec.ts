import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { compareImages, PAGE_MAP, THRESHOLDS, DEFAULT_THRESHOLD } from '../../../../tools/lib/pipeline-visual-compare';

const THEME = 'lyra';
const REFERENCE_DIR = path.resolve(__dirname, `../../../../output/ingestion/${THEME}/screenshots`);
const TEST_SCREENSHOTS_DIR = path.resolve(__dirname, '../test-results/screenshots');
const DIFF_DIR = path.resolve(__dirname, '../test-results/diffs');

test.beforeAll(() => {
  fs.mkdirSync(TEST_SCREENSHOTS_DIR, { recursive: true });
  fs.mkdirSync(DIFF_DIR, { recursive: true });
});

test.describe(`Visual comparison: ${THEME} vs reference`, () => {
  for (const [refFile, route] of Object.entries(PAGE_MAP)) {
    const refPath = path.join(REFERENCE_DIR, refFile);

    test(`${route} should resemble reference (${refFile})`, async ({ page }) => {
      if (!fs.existsSync(refPath)) {
        test.skip();
        return;
      }

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const testBuffer = await page.screenshot({ fullPage: true });
      fs.writeFileSync(path.join(TEST_SCREENSHOTS_DIR, refFile), testBuffer);

      const threshold = THRESHOLDS[refFile] ?? DEFAULT_THRESHOLD;
      const diffPath = path.join(DIFF_DIR, `diff-${refFile}`);

      const { diffPercent } = await compareImages(refPath, testBuffer, diffPath);

      expect(
        diffPercent,
        `${refFile}: ${(diffPercent * 100).toFixed(1)}% pixels differ (threshold: ${(threshold * 100)}%)`,
      ).toBeLessThanOrEqual(threshold);
    });
  }
});
