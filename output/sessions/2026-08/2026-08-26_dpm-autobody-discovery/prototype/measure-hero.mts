/**
 * measure-hero.mts — the hero's vertical fit, measured rather than eyeballed.
 *
 * The hero stacks four things in a fixed height: the masthead, the copy block,
 * a foot pinned near the bottom, and a caption pinned below that. Three gaps
 * have to stay positive at every viewport, and tuning any one of the clamps
 * that control them moves the other two. This prints all three across the
 * sizes that matter so a change can be checked instead of guessed at.
 *
 * Run from the MONOREPO ROOT — @playwright/test only resolves there under pnpm:
 *   npx tsx output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/measure-hero.mts
 *
 * Expects the prototype served on :8899 (python3 -m http.server 8899).
 */
import { chromium } from '@playwright/test';

const SIZES: [number, number][] = [
  [1728, 1080], [1600, 1000], [1512, 900], [1440, 900], [1440, 704],
  [1373, 722], [1373, 705], [1341, 896], [1280, 800], [1280, 703],
  [1280, 640], [1200, 600], [1113, 744], [960, 700], [900, 1200],
  [820, 1180], [768, 1024], [430, 932], [390, 844], [360, 780],
];

const PAGES = ['/client/index.html', '/client/volvo-p1800.html'];

const browser = await chromium.launch();
let failed = false;

for (const path of PAGES) {
  console.log(`\n${path}`);
  console.log('  viewport      logo→label   lede→foot   foot→caption');
  const worst = { logo: Infinity, foot: Infinity, cap: Infinity };

  for (const [width, height] of SIZES) {
    const page = await browser.newPage({ viewport: { width, height } });
    /* 'load', not 'networkidle': the lazy plates below the fold keep the
       network busy long enough to trip the 30s timeout, and none of them
       affect the hero's geometry. */
    await page.goto(`http://127.0.0.1:8899${path}`, { waitUntil: 'load' });
    await page.evaluate('document.fonts.ready');

    /* No helper functions inside evaluate: tsx compiles them with esbuild's
       `__name` wrapper, which does not exist in the page and throws. */
    const m = await page.evaluate(`(() => {
      const q = (s) => document.querySelector(s).getBoundingClientRect();
      const logo = q('.wordmark svg'), label = q('.hero .label'),
            lede = q('.hero .lede'), foot = q('.hero__foot'),
            cap = q('.hero .stage__cap');
      return {
        logo: Math.round(label.top - logo.bottom),
        foot: Math.round(foot.top - lede.bottom),
        cap: Math.round(cap.top - foot.bottom),
      };
    })()`) as { logo: number; foot: number; cap: number };
    await page.close();

    worst.logo = Math.min(worst.logo, m.logo);
    worst.foot = Math.min(worst.foot, m.foot);
    worst.cap = Math.min(worst.cap, m.cap);

    const flag = m.logo < 0 || m.foot < 0 || m.cap < 0 ? '  ✗ OVERLAP' : '';
    if (flag) failed = true;
    console.log(
      `  ${`${width}x${height}`.padEnd(12)}` +
        `${String(m.logo).padStart(8)}${String(m.foot).padStart(12)}${String(m.cap).padStart(14)}${flag}`
    );
  }
  console.log(`  worst: logo ${worst.logo}, foot ${worst.foot}, caption ${worst.cap}`);
}

await browser.close();
console.log(failed ? '\nFAIL — at least one gap went negative' : '\nOK — every gap positive at every size');
process.exit(failed ? 1 : 0);
