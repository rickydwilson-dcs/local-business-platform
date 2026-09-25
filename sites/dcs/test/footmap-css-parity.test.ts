/**
 * `styles/footmap.css` is a deliberate DUPLICATE of the `.footmap` rules in
 * `styles/inner-pages.css` — see that file's header for why none of the
 * alternatives (import, move, merge) is available.
 *
 * A duplicate that nothing checks is a divergence waiting to happen: the
 * homepage and the inner pages would drift apart silently, which is exactly the
 * failure this whole change set exists to fix. So every declaration in the copy
 * is asserted against the original here.
 *
 * Compared declaration-by-declaration rather than as raw text, because the copy
 * is Prettier-formatted (multi-line) while `inner-pages.css` is the design
 * session's compact hand-written style — the bytes differ, the CSS must not.
 */

import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const COPY_PATH = path.resolve(__dirname, '../styles/footmap.css');
const SOURCE_PATH = path.resolve(__dirname, '../styles/inner-pages.css');

/** Strip comments, collapse all whitespace — leaves comparable CSS. */
function normalise(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * One declaration, reduced to its meaning.
 *
 * The copy is Prettier-formatted and the original is the design session's
 * compact style, so the same CSS is written differently in each:
 * `rgba(255, 255, 255, 0.22)` against `rgba(255,255,255,.22)`,
 * `clamp(22px, 3.4vw, 58px)` against `clamp(22px,3.4vw,58px)`. Those are not
 * drift. Spacing around commas and colons is removed and leading zeros on
 * decimals are dropped so that only a REAL difference in value can fail.
 */
function canonicalise(decl: string): string {
  return decl
    .replace(/\s*:\s*/, ':')
    .replace(/\s*,\s*/g, ',')
    .replace(/(^|[^\w.])0\.(\d)/g, '$1.$2')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Every `selector{...}` block mentioning `.footmap`, as
 * `selector|prop:value;prop:value` with declarations sorted, so formatting and
 * declaration order cannot cause a false failure.
 */
function footmapBlocks(css: string): Map<string, string> {
  const out = new Map<string, string>();
  const flat = normalise(css);
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(flat)) !== null) {
    const selector = m[1].trim().replace(/^.*\{/, '').trim(); // drop any @media prefix left on the head
    if (!selector.includes('.footmap')) continue;
    const decls = m[2]
      .split(';')
      .map((d) => canonicalise(d))
      .filter(Boolean)
      .sort()
      .join(';');
    // a selector can appear twice (base + inside a media block); keep both
    const key = out.has(selector) ? `${selector} [${out.size}]` : selector;
    out.set(key, decls);
  }
  return out;
}

describe('styles/footmap.css does not drift from inner-pages.css', () => {
  const copy = fs.readFileSync(COPY_PATH, 'utf-8');
  const source = fs.readFileSync(SOURCE_PATH, 'utf-8');

  it('both files are readable and actually contain .footmap rules', () => {
    expect(copy.length).toBeGreaterThan(500);
    expect(source.length).toBeGreaterThan(1000);
    expect(copy).toContain('.footmap');
    expect(source).toContain('.footmap');
  });

  it('every declaration set in the copy appears identically in inner-pages.css', () => {
    const copyBlocks = footmapBlocks(copy);
    const sourceDecls = new Set(footmapBlocks(source).values());

    expect(copyBlocks.size, 'no .footmap blocks parsed out of the copy').toBeGreaterThan(4);

    const drifted: string[] = [];
    for (const [selector, decls] of copyBlocks) {
      if (!sourceDecls.has(decls)) drifted.push(`${selector} { ${decls} }`);
    }
    expect(
      drifted,
      `these .footmap rules exist in styles/footmap.css but not, identically, in inner-pages.css:\n${drifted.join('\n')}`
    ).toEqual([]);
  });

  it('the homepage actually imports the copy', () => {
    const page = fs.readFileSync(path.resolve(__dirname, '../app/page.tsx'), 'utf-8');
    expect(
      page,
      'app/page.tsx does not import footmap.css — the homepage footer will render unstyled'
    ).toContain('styles/footmap.css');
  });
});
