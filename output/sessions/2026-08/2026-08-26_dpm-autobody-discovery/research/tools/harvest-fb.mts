import { chromium, devices } from '@playwright/test';
const target = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'], locale: 'en-GB' });
await ctx.addInitScript("globalThis.__name = globalThis.__name || function(f){return f;};");
const page = await ctx.newPage();
await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.error('#nav', e.message));
await page.waitForTimeout(5000);
// dismiss cookie / login overlays that are dismissible without logging in
for (const t of ['Only allow essential cookies','Decline optional cookies','Only allow necessary cookies','Close','Not now']) {
  const el = page.getByText(t, { exact: false }).first();
  if (await el.count() > 0) { await el.click({ timeout: 5000 }).catch(()=>{}); await page.waitForTimeout(4000); break; }
}
if (!page.url().includes('dpmautobody')) { await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{}); await page.waitForTimeout(5000); }
for (const t of ['Close','Not now']) {
  const el = page.getByLabel(t).first();
  if (await el.count() > 0) { await el.click({ timeout: 3000 }).catch(()=>{}); await page.waitForTimeout(1500); }
}
for (let i = 0; i < 45; i++) {
  await page.evaluate(() => window.scrollBy(0, 1000)); await page.waitForTimeout(600);
  const more = page.getByText('see more', { exact: false });
  const n = await more.count().catch(()=>0);
  for (let j = 0; j < Math.min(n, 6); j++) { await more.nth(j).click({ timeout: 1500 }).catch(()=>{}); }
}
const out = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: (i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src, w: (i as HTMLImageElement).naturalWidth, h: (i as HTMLImageElement).naturalHeight, alt: (i as HTMLImageElement).alt }));
  return { url: location.href, title: document.title, imgs, text: document.body.innerText };
});
console.log(JSON.stringify(out, null, 1));
await page.screenshot({ path: process.argv[3] ?? 'fb.png', fullPage: false });
await b.close();
