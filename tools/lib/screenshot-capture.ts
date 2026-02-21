/**
 * Screenshot Capture
 *
 * Captures full-page screenshots of discovered pages using Playwright.
 * Launches a single headless Chromium instance and reuses it across
 * all pages, opening a new tab per URL.
 */

import { chromium, type Browser } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

import type { DiscoveredPage } from "./reference-analysis-types";

const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;
const NAVIGATION_TIMEOUT_MS = 15_000;

/**
 * Capture full-page screenshots for each discovered page.
 *
 * A single headless Chromium browser instance is launched and reused
 * for all pages. Each URL gets its own tab (`browser.newPage()`).
 * Pages that fail to load are skipped with a warning logged to stderr.
 *
 * Screenshots are saved as PNG files to `<outputDir>/screenshots/<pageType>.png`.
 *
 * @param pages - Array of discovered pages to screenshot
 * @param outputDir - Root output directory; screenshots go into a `screenshots/` subdirectory
 * @returns Map of pageType to the absolute path of the saved screenshot
 */
export async function captureScreenshots(
  pages: DiscoveredPage[],
  outputDir: string,
): Promise<Map<string, string>> {
  const screenshotsDir = path.join(outputDir, "screenshots");

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const results = new Map<string, string>();
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({ headless: true });

    for (const page of pages) {
      const screenshotPath = path.join(screenshotsDir, `${page.pageType}.png`);
      let browserPage = null;

      try {
        browserPage = await browser.newPage();

        await browserPage.setViewportSize({
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
        });

        await browserPage.goto(page.url, {
          waitUntil: "networkidle",
          timeout: NAVIGATION_TIMEOUT_MS,
        });

        await browserPage.screenshot({
          path: screenshotPath,
          fullPage: true,
          type: "png",
        });

        results.set(page.pageType, screenshotPath);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        console.warn(
          `[screenshot-capture] Skipping ${page.pageType} (${page.url}): ${message}`,
        );
      } finally {
        if (browserPage) {
          await browserPage.close();
        }
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return results;
}
