import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'https://www.dpmautobody.co.uk/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' });
const page = await ctx.newPage();
await ctx.addInitScript("globalThis.__name = globalThis.__name || function(f){return f;};");
const net = new Set<string>();
page.on('request', r => { const u = r.url(); if (/wixstatic|\.(jpg|jpeg|png|webp|mp4|gif)/i.test(u)) net.add(u); });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.error('nav', e.message));
await page.waitForTimeout(6000);
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h + 4000; y += 600) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(400);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(4000);
// also click any "load more" / gallery expanders
const data = await page.evaluate(() => {
  const all: any[] = [];
  const walk = (doc: Document) => {
    doc.querySelectorAll('img').forEach(i => all.push({ src: (i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src, alt: (i as HTMLImageElement).alt, w: (i as HTMLImageElement).naturalWidth, h: (i as HTMLImageElement).naturalHeight }));
    doc.querySelectorAll('*').forEach(el => { const bg = getComputedStyle(el as Element).backgroundImage; if (bg && bg !== 'none' && bg.includes('url(') && !bg.includes('gradient')) all.push({ src: bg.slice(5, -2), alt: '(bg)', w: 0, h: 0 }); });
  };
  walk(document);
  const frames = Array.from(document.querySelectorAll('iframe')).map(f => (f as HTMLIFrameElement).src);
  const vids = Array.from(document.querySelectorAll('video')).map(v => ({ src: (v as HTMLVideoElement).src, poster: (v as HTMLVideoElement).poster }));
  return { imgs: all, frames, vids, height: document.body.scrollHeight, text: document.body.innerText.slice(0, 15000) };
});
// include iframe contents
const frameImgs: any[] = [];
for (const f of page.frames()) {
  if (f === page.mainFrame()) continue;
  try {
    const r = await f.evaluate(() => Array.from(document.querySelectorAll('img')).map(i => ({ src: (i as HTMLImageElement).currentSrc || (i as HTMLImageElement).src, alt: (i as HTMLImageElement).alt, w: (i as HTMLImageElement).naturalWidth, h: (i as HTMLImageElement).naturalHeight, frame: location.href })));
    frameImgs.push(...r);
  } catch {}
}
console.log(JSON.stringify({ url, net: Array.from(net), frameImgs, ...data }, null, 1));
await b.close();
