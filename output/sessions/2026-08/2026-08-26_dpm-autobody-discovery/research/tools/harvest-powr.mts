import { chromium } from '@playwright/test';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 1000 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
await ctx.addInitScript("globalThis.__name = globalThis.__name || function(f){return f;};");
const page = await ctx.newPage();
await page.goto('https://www.dpmautobody.co.uk/', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(()=>{});
await page.waitForTimeout(8000);
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(300); }
await page.waitForTimeout(3000);
// find the powr frame and click load-more repeatedly
const f = page.frames().find(fr => fr.url().includes('powr.io'));
if (!f) { console.log(JSON.stringify({ error: 'no powr frame', frames: page.frames().map(x=>x.url()) })); await b.close(); process.exit(0); }
for (let i = 0; i < 12; i++) {
  const clicked = await f.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button, a, div'));
    const t = els.find(e => /load more|show more|more posts/i.test((e.textContent||'').trim()) && (e as HTMLElement).offsetParent !== null);
    if (t) { (t as HTMLElement).click(); return true; }
    return false;
  }).catch(()=>false);
  if (!clicked) break;
  await page.waitForTimeout(2500);
}
// scroll inside frame
await f.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); }).catch(()=>{});
await page.waitForTimeout(2500);
const out = await f.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(i => ({ src: (i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src, w: (i as HTMLImageElement).naturalWidth, h: (i as HTMLImageElement).naturalHeight, alt: (i as HTMLImageElement).alt }));
  const bgs: string[] = [];
  document.querySelectorAll('*').forEach(el => { const bg = getComputedStyle(el as Element).backgroundImage; if (bg && bg.includes('url(') && !bg.includes('gradient')) bgs.push(bg.slice(5,-2)); });
  return { imgs, bgs: Array.from(new Set(bgs)), text: document.body.innerText, html_len: document.documentElement.outerHTML.length, url: location.href };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
