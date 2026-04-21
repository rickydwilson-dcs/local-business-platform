import { test } from '@playwright/test';
import path from 'path';

const BASE_REF = 'http://localhost:3000';
const BASE_TEST = 'http://localhost:3001';
const OUT = path.resolve(
  __dirname,
  '../../output/sessions/2026-04/2026-04-19_dj-fox-composition-migration/screenshots'
);

const PAGES: [string, string][] = [
  ['/', 'home'],
  ['/about', 'about'],
  ['/contact', 'contact'],
  ['/services', 'services'],
  ['/services/emergency-callout', 'services-emergency-callout'],
  ['/locations', 'locations'],
  ['/locations/eastbourne', 'locations-eastbourne'],
  ['/reviews', 'reviews'],
  ['/projects', 'projects'],
  ['/blog', 'blog'],
  ['/pricing', 'pricing'],
  ['/privacy-policy', 'privacy-policy'],
];

test.use({ viewport: { width: 1440, height: 900 } });

for (const [pagePath, name] of PAGES) {
  test(`reference: ${name}`, async ({ page }) => {
    await page.goto(`${BASE_REF}${pagePath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/reference/${name}.png`, fullPage: true });
  });

  test(`test: ${name}`, async ({ page }) => {
    await page.goto(`${BASE_TEST}${pagePath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/test/${name}.png`, fullPage: true });
  });
}
