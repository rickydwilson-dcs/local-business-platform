/**
 * Guard: `@tailwindcss/typography` must not be loaded by this site.
 *
 * WHY THIS TEST EXISTS. The plugin emits a `.prose` class, which is the same
 * class name `styles/inner-pages.css` §31 hand-authors for the r9 long-form
 * body. DCS is the only site in the monorepo that hand-authors `.prose` at
 * all — every other site is Tailwind-themed and uses the plugin as intended,
 * so this is a DCS-specific removal, not a platform rule.
 *
 * With both loaded, the plugin wins every property the kit leaves to kit.css
 * §02's `*{margin:0;padding:0}` reset. Measured on the running site across
 * the six `.prose` surfaces (67 pages) before the plugin was removed:
 *
 *   - body copy resolved to `rgb(55,65,81)` (Tailwind gray-700) inside a
 *     ground that resolved to `rgb(14,14,18)` — and every `h2` inherited it,
 *     INCLUDING through `.in .res{color:currentColor}`, so the reveal latch
 *     faithfully un-muted each heading to the wrong colour
 *   - `margin-bottom` on every block (p 20.63px, h2 38.4px)
 *   - `margin-top`/`margin-bottom` 8.25px on `li`, against a list that spaces
 *     with the grid `gap`
 *   - `padding-inline-start` 26px on `ul`, stacking with the kit's own
 *     `.prose li{padding-left:28px}` for a 54px indent on the legal pages
 *   - a 65ch cap (595.61px) that shrank `/blog/[slug]` and the legal body
 *     inside their own 74ch columns, because those two put `.measure` on the
 *     PARENT rather than on the `.prose` element itself
 *
 * None of it errors, and the type-check, lint, build and every other test
 * passed throughout — which is exactly why it survived the September port and
 * needs a test rather than a comment.
 *
 * The plugin is also genuinely unused here: no `prose-lg`, `prose-invert` or
 * `prose-*:` modifier appears in any `.tsx` or `.mdx` file in this site, and
 * DCS renders none of the shared `core-components` that use them. It was only
 * ever emitted because `tailwind.config.ts`'s `content` glob scans
 * `packages/core-components/src`, where those components live.
 */

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Read as SOURCE rather than importing the module: `tailwind.config.ts`
// imports `@platform/theme-system/plugin`, a workspace subpath export Vitest's
// resolver does not follow, and the config file itself is the artifact under
// test here anyway.

const CONFIG_PATH = path.resolve(__dirname, '../tailwind.config.ts');

describe('tailwind.config.ts does not load @tailwindcss/typography', () => {
  it('never imports the plugin', () => {
    const source = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const importLine = source
      .split('\n')
      .find((line) => /^\s*import\b/.test(line) && line.includes('@tailwindcss/typography'));
    expect(
      importLine,
      'tailwind.config.ts imports @tailwindcss/typography — it emits a `.prose` ' +
        'class that collides with inner-pages.css §31. See this file’s header.'
    ).toBeUndefined();
  });

  it('registers only createThemePlugin(themeConfig)', () => {
    const source = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const match = source.match(/^\s*plugins:\s*\[(.*?)\],\s*$/m);
    expect(match, 'no single-line `plugins: [...]` array found in tailwind.config.ts').toBeTruthy();
    const entries = match![1]
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    expect(entries).toEqual(['createThemePlugin(themeConfig)']);
  });

  it('no component or content file uses a typography modifier utility', () => {
    const roots = ['app', 'components', 'content'].map((d) => path.resolve(__dirname, '..', d));
    const offenders: string[] = [];
    // `prose-grid-box` and `font-prose` are unrelated authored class names, so
    // the pattern requires either a `prose-<variant>:` modifier or one of the
    // plugin's own size/theme classes.
    const pattern = /\bprose-(?:sm|base|lg|xl|2xl|invert|headings:|p:|a:|li:|strong:|img:|h[1-6]:)/;

    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(tsx?|mdx?)$/.test(entry.name)) continue;
        const text = fs.readFileSync(full, 'utf-8');
        for (const [i, line] of text.split('\n').entries()) {
          // skip this guard's own documentation of the class names
          if (full === __filename) continue;
          if (pattern.test(line)) offenders.push(`${path.relative(process.cwd(), full)}:${i + 1}`);
        }
      }
    };

    for (const root of roots) {
      if (fs.existsSync(root)) walk(root);
    }

    expect(
      offenders,
      `typography modifier utilities found, but the plugin is not loaded so they emit nothing:\n${offenders.join('\n')}`
    ).toEqual([]);
  });
});
