import { chromium } from '/Users/rickywilson/Sites/local-business-platform/node_modules/.pnpm/playwright@1.56.0/node_modules/playwright/index.js';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = '/Users/rickywilson/Sites/local-business-platform/output/sessions/2026-04-05_cygnus-visual-comparison';

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pages = [
  { url: 'http://localhost:3002', name: 'cygnus-test-home' },
  { url: 'http://localhost:3002/services', name: 'cygnus-test-services' },
  { url: 'http://localhost:3002/contact', name: 'cygnus-test-contact' },
  { url: 'https://mad-graphics.vercel.app', name: 'mad-graphics-home' },
  { url: 'https://mad-graphics.vercel.app/services', name: 'mad-graphics-services' },
  { url: 'https://mad-graphics.vercel.app/contact', name: 'mad-graphics-contact' },
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });

  for (const { url, name } of pages) {
    console.log(`Capturing: ${name} (${url})`);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      // Extra wait for any animations/lazy loads
      await page.waitForTimeout(1500);

      const outputPath = join(OUTPUT_DIR, `${name}.png`);
      await page.screenshot({
        path: outputPath,
        fullPage: true,
      });
      console.log(`  Saved: ${outputPath}`);
    } catch (err) {
      console.error(`  ERROR capturing ${name}: ${err.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\nDone.');
}

takeScreenshots().catch(console.error);
