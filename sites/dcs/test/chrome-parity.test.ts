import { describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { render } from '@testing-library/react';
import React from 'react';

/**
 * Golden-fixture parity gate for Phase 1 of the inner-pages port
 * (`output/sessions/2026-09/2026-09-18_dcs-inner-pages-port/yolo-brief.md`).
 *
 * Renders the REAL `app/(site)/layout.tsx` — not a stand-in, not a copy of its
 * markup — and compares it against the REAL approved chrome design,
 * `prototype/_chrome.html`, parsed live from disk on every run with the same
 * DOM tooling the render is inspected with. Nothing here is a hand-written
 * fixture, so drift in either file fails immediately.
 *
 * Hard-fail conditions, each mirrored below as a failing assertion:
 *   - the bar rendering a `<nav>` at any width
 *   - `.burger` missing from the bar
 *   - `.menu` nested inside `.bar` (Trap 11)
 *   - the page footer rendered outside `<main>` (it would fall out of the
 *     bar's `main [data-ground]` ground probe)
 *   - any live class of the prototype's bar or `.pagefoot` specimen missing
 *     from the render
 *   - 0 elements compared
 */

const DESIGN_DIR = path.resolve(
  __dirname,
  '../../../output/sessions/2026-09/2026-09-15_dcs-inner-pages-design'
);
const CHROME_PATH = path.join(DESIGN_DIR, 'prototype/_chrome.html');
const KIT_PATH = path.join(DESIGN_DIR, 'kit.css');
const INNER_CSS_PATH = path.resolve(__dirname, '../styles/inner-pages.css');
const SITE_BAR_PATH = path.resolve(__dirname, '../components/home/site-bar.tsx');

// jsdom implements neither of these. `HomeBehaviour` reads `matchMedia` on
// mount (mirroring the prototype's own one-shot read); `IntersectionObserver`
// is stubbed globally in `test/setup.ts`.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// The chrome is rendered outside the App Router here, so the two router-bound
// pieces are replaced with exactly what they emit in the browser: `usePathname`
// with a real inner-page path (so `aria-current` is genuinely exercised rather
// than skipped), and `next/link` with the plain `<a href>` it renders to.
vi.mock('next/navigation', () => ({
  usePathname: () => '/services/web-design',
}));
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => React.createElement('a', { href, ...rest }, children),
}));

// `vi.mock` calls are hoisted above this by vitest, so the layout (and the
// chrome tree behind it) is loaded with the two mocks already in place.
import SiteLayout from '../app/(site)/layout';

function renderChrome(): HTMLElement {
  const { container } = render(
    React.createElement(SiteLayout, {
      children: React.createElement('div', { 'data-testid': 'page-content' }, 'page'),
    })
  );
  return container;
}

function classesOf(root: ParentNode): Set<string> {
  const set = new Set<string>();
  root.querySelectorAll('*').forEach((el) => el.classList.forEach((c) => set.add(c)));
  return set;
}

describe('sites/dcs (site) chrome matches the approved r9 design (_chrome.html)', () => {
  const chromeHtml = fs.readFileSync(CHROME_PATH, 'utf-8');
  const kitCss = fs.readFileSync(KIT_PATH, 'utf-8');
  const innerCss = fs.readFileSync(INNER_CSS_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(chromeHtml, 'text/html').body;

  it('the design files are readable and non-trivial (fixture assumptions)', () => {
    expect(chromeHtml.length).toBeGreaterThan(1000);
    expect(proto.querySelectorAll('*').length).toBeGreaterThan(0);
    expect(proto.querySelector('.bar'), '_chrome.html has no .bar specimen').toBeTruthy();
    expect(
      proto.querySelector('footer.pagefoot'),
      '_chrome.html has no .pagefoot specimen'
    ).toBeTruthy();
  });

  it('styles/inner-pages.css is a verbatim copy of the design session kit.css', () => {
    // Everything after the added provenance header must be the source file
    // byte-for-byte, with one documented exception below. Comparing the tail
    // rather than the whole file is what lets the header exist at all.
    //
    // ALLOWLIST (mirrors home-css-parity.test.ts's pattern): kit.css itself
    // carries an orphaned text line outside any `/* */` block (the wave 2
    // legal-template merge header, Agent H) — invalid CSS that Turbopack's
    // parser rejects outright, crashing `next dev` and with it
    // test:e2e:smoke. The production stylesheet cannot ship that bug, so the
    // single fix (folding the orphan line into the header comment above it)
    // is applied to a copy of kitCss's text before comparison here, not to
    // the frozen design-session file itself, which stays exactly as Ricky
    // approved it on 2026-09-18. Self-verifying: fails loudly if the source
    // text ever changes out from under it. Flagged in the final report —
    // the same bug is live in the archived kit.css and will bite the next
    // site that copies it verbatim.
    const KIT_CSS_ALLOWLIST: Array<{ old: string; new: string; reason: string }> = [
      {
        old: '   ========================================================================== */\n   RECONCILED: one duplicate declaration removed — see the note inline.\n/* ==========================================================================',
        new: '   ========================================================================== */\n/* RECONCILED: one duplicate declaration removed — see the note inline. */\n/* ==========================================================================',
        reason:
          'orphaned text line outside any CSS comment block (invalid CSS) crashes Turbopack; wrapped in its own comment',
      },
    ];

    let expectedTail = kitCss;
    for (const { old, new: replacement, reason } of KIT_CSS_ALLOWLIST) {
      expect(expectedTail, `ALLOWLIST entry stale — "${reason}" not found in kit.css`).toContain(
        old
      );
      expectedTail = expectedTail.replace(old, replacement);
    }

    expect(innerCss.length).toBeGreaterThan(expectedTail.length);
    expect(innerCss.slice(innerCss.length - expectedTail.length)).toBe(expectedTail);
  });

  /* ---------------------------------------------------------------- the bar */

  it('the bar renders NO <nav> at any width, and the design agrees that is correct', () => {
    // The prototype does still carry the markup — that is the point of the
    // test. Decision 5 was kept one declaration away from reversible while it
    // was under review, so every prototype file has a `<nav>` in the bar that
    // CSS hides. If that ever stops being true this assertion tells us the
    // premise changed rather than silently passing.
    const protoBar = proto.querySelector('.bar')!;
    expect(
      protoBar.querySelector('nav'),
      'the prototype bar no longer carries the superseded <nav> — re-read _chrome.html:69-76'
    ).toBeTruthy();

    // ...and the stylesheet hides it unconditionally: no media query, at any
    // width, with the burger shown instead.
    expect(innerCss).toContain('.bar nav{display:none}');
    expect(innerCss).toContain('.bar .burger{display:grid}');

    // The port therefore drops it rather than rendering dead markup.
    const container = renderChrome();
    const bar = container.querySelector('.bar');
    expect(bar, '.bar not found in the rendered chrome').toBeTruthy();
    expect(bar!.querySelectorAll('nav').length, 'the rendered bar contains a <nav>').toBe(0);

    // "At any width" is a source property, not a runtime one: jsdom has no
    // layout, so a width-conditional branch would never be exercised here.
    // The component must contain no `<nav>` at all.
    // Comments are stripped first: this file's own header discusses `<nav>` at
    // length, and a doc comment is not markup.
    const barSource = fs
      .readFileSync(SITE_BAR_PATH, 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(
      /<nav[\s/>]/.test(barSource),
      'site-bar.tsx contains <nav> markup — it must render none at any width'
    ).toBe(false);
  });

  it('.burger is present in the bar, with the prototype’s own attributes', () => {
    const container = renderChrome();
    const burger = container.querySelector('.bar .burger');
    expect(burger, '.burger missing from the rendered bar').toBeTruthy();
    expect(burger!.tagName).toBe('BUTTON');
    expect(burger!.getAttribute('aria-expanded')).toBe('false');
    expect(burger!.getAttribute('aria-controls')).toBe('menu');
    // Two bars, as the prototype has (`_chrome.html:83`).
    expect(burger!.querySelectorAll('span').length).toBe(2);
  });

  it('every live class of the prototype bar appears in the rendered bar', () => {
    const protoBar = proto.querySelector('.bar')!;
    const protoClasses = [...classesOf(protoBar)].filter((c) => c !== 'bar');
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = renderChrome();
    const rendered = classesOf(container.querySelector('.bar')!);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `bar classes present in _chrome.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  /* --------------------------------------------------------------- trap 11  */

  it('.menu is a sibling of .bar, never a descendant (Trap 11)', () => {
    const container = renderChrome();
    const bar = container.querySelector('.bar')!;
    const menu = container.querySelector('.menu');
    expect(menu, '.menu not found in the rendered chrome').toBeTruthy();
    expect(bar.contains(menu!), '.menu is nested inside .bar — Trap 11 violated').toBe(false);
    expect(menu!.parentElement).not.toBe(bar);
    expect(menu!.parentElement).toBe(bar.parentElement);
    // Server-rendered closed, exactly as the prototype ships it.
    expect(menu!.hasAttribute('hidden')).toBe(true);
  });

  /* -------------------------------------------------------- the page footer */

  it('every live class of the prototype .pagefoot appears in the rendered footer', () => {
    const protoFoot = proto.querySelector('footer.pagefoot')!;
    const protoClasses = [...classesOf(protoFoot)];
    // `.in` is added by the reveal latch at runtime, not authored in markup.
    const expected = protoClasses.filter((c) => c !== 'in');
    expect(expected.length).toBeGreaterThan(0);

    const container = renderChrome();
    const foot = container.querySelector('footer.pagefoot');
    expect(foot, '.pagefoot not found in the rendered chrome').toBeTruthy();
    const rendered = new Set([...classesOf(foot!), ...foot!.classList]);
    const missing = expected.filter((c) => !rendered.has(c));
    expect(
      missing,
      `.pagefoot classes present in _chrome.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('the footer link map has the prototype’s four columns, headings and link counts', () => {
    const protoFoot = proto.querySelector('footer.pagefoot')!;
    const protoCols = [...protoFoot.querySelectorAll('.footmap > div')];
    const protoShape = protoCols.map((col) => ({
      heading: col.querySelector('.eyeless')!.textContent!.trim(),
      links: col.querySelectorAll('li a').length,
    }));
    expect(protoShape.length).toBe(4);

    const container = renderChrome();
    const cols = [...container.querySelectorAll('.footmap > div')];
    const shape = cols.map((col) => ({
      heading: col.querySelector('.eyeless')!.textContent!.trim(),
      links: col.querySelectorAll('li a').length,
    }));
    expect(shape).toEqual(protoShape);
  });

  it('the footer renders the prototype’s closing block and microcopy row', () => {
    const container = renderChrome();
    const foot = container.querySelector('footer.pagefoot')!;

    expect(foot.getAttribute('data-ground')).toBe('navy');
    expect(foot.querySelector('.end__main .eyeless')!.textContent).toBe('Start a project');
    expect(foot.querySelectorAll('.end__main a.big').length).toBe(2);
    expect(foot.querySelectorAll('.end__main .hero__act a.btn').length).toBe(1);
    expect(foot.querySelectorAll('.end__foot > span').length).toBe(
      proto.querySelectorAll('footer.pagefoot .end__foot > span').length
    );
  });

  it('the page footer sits INSIDE <main>, so the bar ground probe can see it', () => {
    const container = renderChrome();
    const main = container.querySelector('main#top');
    expect(main, '<main id="top"> not found in the rendered chrome').toBeTruthy();
    expect(
      main!.querySelector('footer.pagefoot'),
      '.pagefoot is outside <main> — main [data-ground] would never match it'
    ).toBeTruthy();
    // The prototype closes </main> after </footer> for the same reason.
    expect(main!.querySelector('[data-testid="page-content"]')).toBeTruthy();
  });

  /* ------------------------------------------------------------- the router */

  it('the current route is marked aria-current in the overlay and the link map', () => {
    const container = renderChrome();
    const current = [...container.querySelectorAll('[aria-current="page"]')];
    expect(current.length, 'nothing marked aria-current for /services/web-design').toBeGreaterThan(
      0
    );
    // "Services" in the overlay (a section link matches its children) and
    // "Website design" in the footer's services column.
    const labels = current.map((el) => el.textContent!.trim()).sort();
    expect(labels).toEqual(['Services', 'Services', 'Website design']);
  });

  /* ---------------------------------------------------- the verdict, always */

  it('mandatory verdict: a non-trivial number of elements was compared', () => {
    const container = renderChrome();
    const compared = container.querySelectorAll('*').length;
    expect(compared, '0 elements rendered — the gate would be vacuous').toBeGreaterThan(50);
  });
});
