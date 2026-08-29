import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => { (globalThis as any).__name = (globalThis as any).__name || ((f: any) => f); });
await p.goto('https://www.halcyon.works', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(6000);
const r = await p.evaluate(() => {
  const pick = (sel: string) => Array.from(document.querySelectorAll(sel)).map((e) => {
    const cs = getComputedStyle(e as HTMLElement); const b = e.getBoundingClientRect();
    return { t: (e.textContent||'').trim().slice(0,40), fs: cs.fontSize, fw: cs.fontWeight, ls: cs.letterSpacing, lh: cs.lineHeight, col: cs.color, ff: cs.fontFamily.split(',')[0], x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), vis: cs.display + '/' + cs.visibility };
  });
  const hdr = document.querySelector('header') || document.querySelector('#SITE_HEADER');
  const hb = hdr ? hdr.getBoundingClientRect() : null;
  const hcs = hdr ? getComputedStyle(hdr as HTMLElement) : null;
  return {
    header: hb ? { h: Math.round(hb.height), bg: hcs!.backgroundColor, pos: hcs!.position, z: hcs!.zIndex } : null,
    nav: pick('#SITE_HEADER a, header a').slice(0, 10),
    h: pick('h1,h2,h3,h4'),
    p: pick('p').slice(0, 8),
    accentEls: Array.from(document.querySelectorAll('*')).filter(e => getComputedStyle(e as HTMLElement).color === 'rgb(200, 164, 134)').map(e => (e.textContent||'').trim().slice(0,40)),
    wixBlue: Array.from(document.querySelectorAll('*')).filter(e => { const c = getComputedStyle(e as HTMLElement); return c.color === 'rgb(17, 109, 255)' || c.backgroundColor === 'rgb(17, 109, 255)'; }).map(e => e.tagName + ':' + (e.className||'').toString().slice(0,40) + ':' + (e.textContent||'').trim().slice(0,30)),
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
