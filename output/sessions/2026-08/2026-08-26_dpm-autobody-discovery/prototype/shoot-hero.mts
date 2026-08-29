/**
 * shoot-hero.mts — frames of the hero at a few scroll positions.
 *
 * The travelling light is scroll-driven, so a single screenshot says nothing
 * about whether the band is reading. This grabs the same four positions every
 * time so two builds can be compared frame for frame.
 *
 * Run from the MONOREPO ROOT, with the prototype served on :8899:
 *   npx tsx output/sessions/.../prototype/shoot-hero.mts <label> [path]
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const label = process.argv[2] ?? 'hero';
const path = process.argv[3] ?? '/client/index.html';
const out = `/private/tmp/claude-501/-Users-rickywilson-Sites-local-business-platform/503ff750-193a-4525-b10d-af2ff2bcb5bd/scratchpad/shots/${label}`;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1373, height: 722 }, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:8899${path}`, { waitUntil: 'load' });
await page.evaluate('document.fonts.ready');

for (const y of [0, 180, 380, 620]) {
  await page.evaluate(`window.scrollTo(0, ${y})`);
  /* rAF-driven, so give the band a couple of frames to settle. */
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${out}/y${String(y).padStart(4, '0')}.png` });
}

await browser.close();
console.log(out);
