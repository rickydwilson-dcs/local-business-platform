import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => { (globalThis as any).__name = (globalThis as any).__name || ((f: any) => f); });
await p.goto('https://www.halcyon.works', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(6000);
for (const y of [0, 900, 5200]) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(1500);
  const info = await p.evaluate(() => {
    const out: any[] = [];
    document.querySelectorAll('#SITE_HEADER, #SITE_HEADER *, [id*="HEADER"]').forEach((e) => {
      const cs = getComputedStyle(e as HTMLElement); const r = e.getBoundingClientRect();
      if (r.width > 1000 && r.height > 30 && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') out.push({ id: e.id || (e.className||'').toString().slice(0,30), bg: cs.backgroundColor, op: cs.opacity, h: Math.round(r.height), y: Math.round(r.y), pos: cs.position });
    });
    return out;
  });
  console.log('scrollY', y, JSON.stringify(info));
  await p.screenshot({ path: `/private/tmp/claude-501/-Users-rickywilson-Sites-local-business-platform/025f39bd-5ca3-4683-8100-1c4ce3f994f6/scratchpad/hdr-${y}.png` });
}
await b.close();
