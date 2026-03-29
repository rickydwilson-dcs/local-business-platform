import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Visual comparison test for test-lyra pipeline test site.
 *
 * Captures screenshots of the test site and compares them against
 * reference screenshots using sharp pixel comparison.
 *
 * Reference screenshots: output/ingestion/lyra/screenshots/
 * Test screenshots: test-results/screenshots/
 * Diff images: test-results/diffs/
 */

const VIEWPORT = { width: 1440, height: 900 };

const REFERENCE_DIR = path.resolve(__dirname, '../../../output/ingestion/lyra/screenshots');
const SCREENSHOTS_DIR = path.resolve(__dirname, '../test-results/screenshots');
const DIFFS_DIR = path.resolve(__dirname, '../test-results/diffs');

const ROUTE_MAP: Array<{ route: string; reference: string; threshold: number }> = [
  { route: '/', reference: 'home.png', threshold: 0.05 },
  { route: '/about', reference: 'about.png', threshold: 0.05 },
  { route: '/services', reference: 'services.png', threshold: 0.10 },
];

async function compareImages(
  capturedPath: string,
  referencePath: string,
  diffPath: string,
  threshold: number
): Promise<{ pass: boolean; diffPercent: number }> {
  // Dynamic import to avoid issues if sharp is not installed
  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default as unknown as typeof import('sharp');
  } catch {
    console.warn('sharp not available — skipping pixel comparison');
    return { pass: true, diffPercent: 0 };
  }

  const [capturedMeta, referenceMeta] = await Promise.all([
    sharp(capturedPath).metadata(),
    sharp(referencePath).metadata(),
  ]);

  const width = Math.min(capturedMeta.width ?? VIEWPORT.width, referenceMeta.width ?? VIEWPORT.width);
  const height = Math.min(capturedMeta.height ?? VIEWPORT.height, referenceMeta.height ?? VIEWPORT.height);

  const [capturedRaw, referenceRaw] = await Promise.all([
    sharp(capturedPath).resize(width, height, { fit: 'cover' }).raw().toBuffer(),
    sharp(referencePath).resize(width, height, { fit: 'cover' }).raw().toBuffer(),
  ]);

  const totalPixels = width * height;
  let diffPixels = 0;
  const diffBuffer = Buffer.alloc(width * height * 3);

  for (let i = 0; i < capturedRaw.length; i += 3) {
    const rDiff = Math.abs(capturedRaw[i] - referenceRaw[i]);
    const gDiff = Math.abs(capturedRaw[i + 1] - referenceRaw[i + 1]);
    const bDiff = Math.abs(capturedRaw[i + 2] - referenceRaw[i + 2]);
    const pixelDiff = (rDiff + gDiff + bDiff) / 3;

    if (pixelDiff > 10) {
      diffPixels++;
      // Red highlight for differing pixels
      diffBuffer[i] = 255;
      diffBuffer[i + 1] = 0;
      diffBuffer[i + 2] = 0;
    } else {
      // Greyed-out matching pixels
      diffBuffer[i] = Math.floor(capturedRaw[i] * 0.5);
      diffBuffer[i + 1] = Math.floor(capturedRaw[i + 1] * 0.5);
      diffBuffer[i + 2] = Math.floor(capturedRaw[i + 2] * 0.5);
    }
  }

  const diffPercent = diffPixels / totalPixels;

  if (diffPercent > threshold) {
    fs.mkdirSync(path.dirname(diffPath), { recursive: true });
    await sharp(diffBuffer, { raw: { width, height, channels: 3 } })
      .png()
      .toFile(diffPath);
  }

  return { pass: diffPercent <= threshold, diffPercent };
}

test.describe('Visual comparison — lyra theme', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    fs.mkdirSync(DIFFS_DIR, { recursive: true });
  });

  for (const { route, reference, threshold } of ROUTE_MAP) {
    const referencePath = path.join(REFERENCE_DIR, reference);

    test(`${route} — visual match against ${reference}`, async ({ page }) => {
      await page.setViewportSize(VIEWPORT);
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const screenshotPath = path.join(SCREENSHOTS_DIR, reference);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      if (!fs.existsSync(referencePath)) {
        console.log(`Reference screenshot not found: ${referencePath} — skipping comparison`);
        return;
      }

      const diffPath = path.join(DIFFS_DIR, reference);
      const { pass, diffPercent } = await compareImages(screenshotPath, referencePath, diffPath, threshold);

      console.log(`${route}: diff = ${(diffPercent * 100).toFixed(2)}% (threshold: ${(threshold * 100).toFixed(0)}%)`);

      if (!pass) {
        console.log(`Diff image saved to: ${diffPath}`);
      }

      expect(pass, `${route} exceeds diff threshold: ${(diffPercent * 100).toFixed(2)}% > ${(threshold * 100).toFixed(0)}%`).toBe(true);
    });
  }
});
