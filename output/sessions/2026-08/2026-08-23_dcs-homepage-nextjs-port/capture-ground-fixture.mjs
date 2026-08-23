/**
 * One-off diagnostic capture for Phase 6's `groundFor()` gate.
 *
 * Serves the REAL r9 prototype over HTTP (Trap 6: never `python3 -m
 * http.server`, which honours If-Modified-Since and serves stale bytes — this
 * server sends `Cache-Control: no-store` and the page URL is cache-busted),
 * drives a real Chromium via Playwright/CDP, and records, at each settled
 * scroll position:
 *
 *   - scrollY, viewport height, the bar's height and the derived probe point
 *   - every `main [data-ground]` element's LIVE viewport rect (top/bottom)
 *   - every such element's LAYOUT top, read with the prototype's own
 *     `layoutTop()` static-neutralisation trick (Trap 4 evidence)
 *   - what the prototype's own `ground()` actually resolved `bar.dataset.ground`
 *     to at that position
 *
 * The LIVE rects are the fixture's `groundFor()` input, because the prototype's
 * `ground()` compares a VIEWPORT coordinate (`bar height * 0.62`) against
 * `getBoundingClientRect()`. Feeding layout rects instead would be a different
 * — and wrong — algorithm. The layout tops are recorded alongside purely as
 * evidence, and are what makes the sticky divergence visible.
 *
 * Trap 1: rAF is frozen in a backgrounded tab, so a "settled" read can be a
 * frozen value repeating. This script polls `bar.dataset.ground` until two
 * consecutive reads agree AND asserts at the end that more than one distinct
 * ground was observed across the sweep — a single repeated value means rAF
 * never ran and the capture is void.
 *
 * Run: node output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/capture-ground-fixture.mjs
 * Writes: sites/dcs/test/fixtures/ground-positions.json
 */

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const PROTOTYPE = path.join(
  REPO,
  'output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html'
);
const OUT = path.join(REPO, 'sites/dcs/test/fixtures/ground-positions.json');

// Trap 9: port 3000 is npracing-v1 and port 4321 was already taken by a
// listening process on this machine when this was written. 4331 was verified
// free with `lsof -i :4331` before use.
const PORT = 4331;
const VIEWPORT = { width: 1440, height: 900 };
const SWEEP_STEPS = 140; // cheap ground-only probes, to map each ground's range
const MAX_POSITIONS = 20;

function fail(message, record) {
  const detail = record === undefined ? '' : `\n  offending record: ${JSON.stringify(record)}`;
  throw new Error(`${message}${detail}`);
}

async function serve() {
  const html = await readFile(PROTOTYPE, 'utf8');
  const server = createServer((req, res) => {
    if ((req.url ?? '').split('?')[0] !== '/r9-kota-level.html') {
      res.writeHead(404, { 'Cache-Control': 'no-store' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, '127.0.0.1', resolve);
  });
  return server;
}

/** Reads bar.dataset.ground only — cheap enough for a dense sweep. */
const READ_GROUND = () => document.getElementById('bar').dataset.ground;

/**
 * Full record at the CURRENT scroll position. Live rects for every ground
 * element are read FIRST, in one pass, before any DOM mutation, so nothing is
 * perturbed. Only then is each element's layout top read by neutralising
 * `position` for one synchronous measurement and restoring it.
 */
const READ_RECORD = () => {
  const bar = document.getElementById('bar');
  const els = Array.from(document.querySelectorAll('main [data-ground]'));
  const barHeight = bar.getBoundingClientRect().height;
  const liveGround = bar.dataset.ground;

  const rects = els.map((el, i) => {
    const r = el.getBoundingClientRect();
    return {
      key: el.id || `${el.tagName.toLowerCase()}.${el.className}#${i}`,
      ground: el.dataset.ground,
      top: r.top,
      bottom: r.bottom,
    };
  });

  const layoutTops = els.map((el) => {
    const prev = el.style.position;
    el.style.position = 'static';
    const y = el.getBoundingClientRect().top + window.scrollY;
    el.style.position = prev;
    return y;
  });

  const styles = els.map((el) => getComputedStyle(el).position);

  return {
    scrollY: window.scrollY,
    viewportHeight: window.innerHeight,
    barHeight,
    probeY: barHeight * 0.62,
    liveGround,
    rects,
    // Recorded as evidence only. `groundFor()` never sees these — see the
    // header comment.
    evidence: rects.map((r, i) => ({
      key: r.key,
      position: styles[i],
      liveTop: r.top,
      layoutTop: layoutTops[i],
      pinnedLie: styles[i] === 'sticky' && Math.abs(r.top - (layoutTops[i] - window.scrollY)) > 1,
    })),
  };
};

/**
 * Scrolls, then waits for the rAF-driven ground() to settle.
 *
 * The prototype sets `html{scroll-behavior:smooth}`, so a plain
 * `window.scrollTo(0, y)` ANIMATES. The first version of this script polled
 * only `bar.dataset.ground` and got two equal reads while the scroll was still
 * in flight — every record came back mid-animation and the whole capture
 * resolved to one ground. Two independent fixes, both applied:
 *   - `behavior: 'instant'` overrides the CSS scroll-behavior outright;
 *   - the page is put in `prefers-reduced-motion: reduce`, which the
 *     prototype's own stylesheet answers with `html{scroll-behavior:auto}`.
 * And the settle condition now requires `window.scrollY` to have actually
 * reached the target BEFORE the ground value is allowed to count as stable.
 */
async function settleAt(page, y) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), y);
  let previous = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    await page.waitForTimeout(40);
    const { scrollY, ground } = await page.evaluate(() => ({
      scrollY: window.scrollY,
      ground: document.getElementById('bar').dataset.ground,
    }));
    if (Math.abs(scrollY - y) <= 1) {
      if (ground === previous) return ground;
      previous = ground;
    } else {
      previous = null;
    }
  }
  fail('scroll/ground never settled', { target: y, last: previous });
}

async function main() {
  const server = await serve();
  const browser = await chromium.launch();
  let errors = 0;

  try {
    // See settleAt(): this is what turns the prototype's own
    // `html{scroll-behavior:smooth}` into `auto`. It does not affect ground().
    const page = await browser.newPage({ viewport: VIEWPORT, reducedMotion: 'reduce' });
    page.on('pageerror', (e) => {
      errors++;
      // eslint-disable-next-line no-console
      console.error('page error:', e);
    });

    await page.goto(`http://127.0.0.1:${PORT}/r9-kota-level.html?cb=${Date.now()}`, {
      waitUntil: 'load',
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    const maxScroll = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight
    );
    if (!(maxScroll > 1000)) fail('page is too short to sweep', { maxScroll });

    // Pass 1 — dense, cheap sweep mapping scrollY -> ground.
    const sweep = [];
    for (let i = 0; i <= SWEEP_STEPS; i++) {
      const y = Math.round((maxScroll * i) / SWEEP_STEPS);
      sweep.push({ y, ground: await settleAt(page, y) });
    }

    const byGround = new Map();
    for (const s of sweep) {
      if (!byGround.has(s.ground)) byGround.set(s.ground, []);
      byGround.get(s.ground).push(s.y);
    }
    // eslint-disable-next-line no-console
    console.log(
      'grounds observed in sweep:',
      [...byGround.entries()].map(([g, ys]) => `${g}(${ys.length})`).join(' ')
    );
    if (byGround.size < 2) {
      fail('only one distinct ground across the whole sweep — rAF is frozen, capture is void', {
        grounds: [...byGround.keys()],
      });
    }

    // Pass 2 — pick a spread: for each observed ground take its first, middle
    // and last sweep position, plus the positions either side of every ground
    // transition (the interesting cases), capped at MAX_POSITIONS.
    const chosen = new Set();
    for (const ys of byGround.values()) {
      chosen.add(ys[0]);
      chosen.add(ys[Math.floor(ys.length / 2)]);
      chosen.add(ys[ys.length - 1]);
    }
    for (let i = 1; i < sweep.length && chosen.size < MAX_POSITIONS; i++) {
      if (sweep[i].ground !== sweep[i - 1].ground) {
        chosen.add(sweep[i - 1].y);
        chosen.add(sweep[i].y);
      }
    }
    const positions = [...chosen].sort((a, b) => a - b).slice(0, MAX_POSITIONS);

    const records = [];
    for (const y of positions) {
      const settledGround = await settleAt(page, y);
      const record = await page.evaluate(READ_RECORD);
      if (record.liveGround !== settledGround) {
        fail('ground changed between settle and record', { y, settledGround, record });
      }
      if (!(record.barHeight > 0)) fail('bar has no height', record);
      if (record.rects.length === 0) fail('no [data-ground] elements found', record);
      records.push(record);
    }

    if (errors > 0) fail(`${errors} uncaught page errors during capture`);
    if (records.length < 10) fail('too few usable positions captured', { n: records.length });

    const groundsCovered = [...new Set(records.map((r) => r.liveGround))].sort();
    const stickyLies = records.reduce(
      (n, r) => n + r.evidence.filter((e) => e.pinnedLie).length,
      0
    );

    await mkdir(path.dirname(OUT), { recursive: true });
    await writeFile(
      OUT,
      `${JSON.stringify(
        {
          capturedAt: new Date().toISOString(),
          source: 'output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html',
          note: 'Recorded from a real Chromium (Playwright/CDP) driving the real prototype over HTTP. `rects` are LIVE getBoundingClientRect values, which is exactly what the prototype ground() compares against its viewport-space probe point. `evidence[].layoutTop` is the static-neutralised layout position, recorded only to show the sticky divergence (Trap 4).',
          viewport: VIEWPORT,
          maxScroll,
          groundsCovered,
          stickyLies,
          positions: records,
        },
        null,
        2
      )}\n`
    );

    // eslint-disable-next-line no-console
    console.log(
      `PASS — ${records.length}/${records.length} positions, 0 errors ` +
        `(grounds: ${groundsCovered.join(', ')}; sticky rect divergences observed: ${stickyLies})`
    );
  } finally {
    await browser.close();
    server.close();
  }
}

await main();
