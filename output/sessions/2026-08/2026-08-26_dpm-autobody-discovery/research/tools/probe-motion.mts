import { chromium } from '@playwright/test';
const url = process.argv[2] ?? 'https://www.halcyon.works';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => { (globalThis as any).__name = (globalThis as any).__name || ((f: any) => f); });
const reqs: any[] = [];
p.on('response', async (r) => {
  try {
    const h = r.headers();
    reqs.push({ url: r.url(), type: r.request().resourceType(), status: r.status(), ct: h['content-type'] ?? '', len: Number(h['content-length'] ?? 0) });
  } catch {}
});
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
await p.waitForTimeout(3000);
// scroll whole page to trigger lazy loads
await p.evaluate(async () => {
  await new Promise<void>((res) => {
    let y = 0; const t = setInterval(() => { y += 600; window.scrollTo(0, y); if (y > document.body.scrollHeight) { clearInterval(t); res(); } }, 120);
  });
});
await p.waitForTimeout(4000);

const motion = await p.evaluate(() => {
  const out: any = { animatedClasses: {}, transitions: [], animations: [], stickies: [], keyframes: [], scrollHandlers: 0 };
  document.querySelectorAll('*').forEach((el) => {
    const c = (el as HTMLElement).className;
    if (typeof c === 'string') {
      c.split(/\s+/).filter(Boolean).forEach((cl) => {
        if (/fade|slide|reveal|parallax|zoom|float|glide|expand|spin|arc|flip|puff|roll|turn|bounce|animat/i.test(cl)) {
          out.animatedClasses[cl] = (out.animatedClasses[cl] || 0) + 1;
        }
      });
    }
    const cs = getComputedStyle(el);
    if (cs.transitionDuration && cs.transitionDuration !== '0s') {
      out.transitions.push(`${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction} ${cs.transitionDelay}`);
    }
    if (cs.animationName && cs.animationName !== 'none') {
      out.animations.push(`${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction}`);
    }
    if (cs.position === 'sticky' || cs.position === 'fixed') {
      out.stickies.push(`${el.tagName}.${String(c).slice(0,60)} pos=${cs.position} top=${cs.top} z=${cs.zIndex}`);
    }
  });
  // collect keyframe names from stylesheets
  for (const ss of Array.from(document.styleSheets)) {
    try { for (const r of Array.from((ss as CSSStyleSheet).cssRules)) { if ((r as any).type === 7) out.keyframes.push((r as CSSKeyframesRule).name); } } catch {}
  }
  const tally = (a: string[]) => { const m: Record<string, number> = {}; a.forEach(x => m[x] = (m[x]||0)+1); return Object.entries(m).sort((x,y)=>y[1]-x[1]).slice(0,25); };
  out.transitions = tally(out.transitions);
  out.animations = tally(out.animations);
  out.keyframes = Array.from(new Set(out.keyframes));
  return out;
});

const dom = await p.evaluate(() => ({
  docHeight: document.body.scrollHeight,
  nodeCount: document.querySelectorAll('*').length,
  h1: Array.from(document.querySelectorAll('h1')).map(e => e.textContent),
  imgs: Array.from(document.querySelectorAll('img')).map(i => ({ src: (i as HTMLImageElement).currentSrc, w: (i as HTMLImageElement).naturalWidth, h: (i as HTMLImageElement).naturalHeight, loading: i.getAttribute('loading'), rw: i.getBoundingClientRect().width })),
  videos: Array.from(document.querySelectorAll('video')).map(v => ({ src: (v as HTMLVideoElement).currentSrc, vw: (v as HTMLVideoElement).videoWidth, vh: (v as HTMLVideoElement).videoHeight, autoplay: (v as HTMLVideoElement).autoplay, loop:(v as HTMLVideoElement).loop, muted:(v as HTMLVideoElement).muted, preload:(v as HTMLVideoElement).preload, poster:(v as HTMLVideoElement).poster, rect: v.getBoundingClientRect().toJSON() })),
}));

console.log(JSON.stringify({ motion, dom, reqs }, null, 1));
await b.close();
