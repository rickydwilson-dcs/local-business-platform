import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { render } from '@testing-library/react';
import React from 'react';

import { HomeBody } from '../components/home/home-body';

/**
 * Golden-fixture parity gate for Phase 5 (yolo-brief.md, "Phase 5 — Build
 * the homepage components"). Renders the composed `<HomeBody />` tree with
 * `@testing-library/react` and compares its class-name inventory and
 * element structure against the REAL prototype HTML, parsed with the same
 * DOM tooling (jsdom's `DOMParser`, the environment this whole suite runs
 * under) — not a hand-written fixture. Reads the prototype file live on
 * every run so drift in either file is caught immediately.
 *
 * Hard-fail conditions (mirrored below as failing assertions, per the
 * brief's gate contract):
 *   - `.menu` nested inside `.bar`
 *   - any of the 11 required section ids missing (or an unexpected extra)
 *   - any live-prototype class (that `home-r9.css` actually styles) absent
 *     from the render
 *   - 0 elements compared
 */

const PROTOTYPE_PATH = path.resolve(
  __dirname,
  '../../../output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html'
);
const CSS_PATH = path.resolve(__dirname, '../styles/home-r9.css');

// jsdom does not implement matchMedia — Pricing reads
// `window.matchMedia('(prefers-reduced-motion: reduce)')` on mount (mirrors
// the prototype's own `matchMedia(...).matches` read). Stub it once, at
// module scope, before any render() call in this file.
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

function classesOf(root: ParentNode): Set<string> {
  const set = new Set<string>();
  root.querySelectorAll('*').forEach((el) => {
    el.classList.forEach((c) => set.add(c));
  });
  return set;
}

function idsOf(root: ParentNode): string[] {
  const ids: string[] = [];
  root.querySelectorAll('[id]').forEach((el) => {
    const id = el.getAttribute('id');
    if (id) ids.push(id);
  });
  return ids;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** True if `home-r9.css` contains a selector that styles exactly this class
 * (word-boundary safe, so `.btn` does not falsely match only via `.btn--ghost`
 * being present — both happen to exist in this stylesheet, but the check
 * must not rely on that). */
function cssStylesClass(css: string, className: string): boolean {
  const re = new RegExp(`\\.${escapeRegExp(className)}(?![\\w-])`);
  return re.test(css);
}

describe('sites/dcs homepage markup matches the r9 prototype (r9-kota-level.html, lines 748-1050)', () => {
  const html = fs.readFileSync(PROTOTYPE_PATH, 'utf-8');
  const css = fs.readFileSync(CSS_PATH, 'utf-8');
  const prototypeDoc = new DOMParser().parseFromString(html, 'text/html');
  const prototypeBody = prototypeDoc.body;

  it('the prototype file and the CSS port are both readable and non-trivial', () => {
    expect(html.length).toBeGreaterThan(1000);
    expect(css.length).toBeGreaterThan(1000);
    expect(prototypeBody.querySelectorAll('*').length).toBeGreaterThan(0);
  });

  it('.menu is a sibling of .bar in both the prototype and the render, never a descendant (Trap 11)', () => {
    const protoBar = prototypeBody.querySelector('.bar');
    const protoMenu = prototypeBody.querySelector('.menu');
    expect(protoBar, 'prototype has no .bar element — fixture assumption broken').toBeTruthy();
    expect(protoMenu, 'prototype has no .menu element — fixture assumption broken').toBeTruthy();
    expect(
      protoBar!.contains(protoMenu!),
      'the prototype itself nests .menu inside .bar — this test would be meaningless'
    ).toBe(false);

    const { container } = render(React.createElement(HomeBody));
    const bar = container.querySelector('.bar');
    const menu = container.querySelector('.menu');
    expect(bar, '.bar not found in the rendered tree').toBeTruthy();
    expect(menu, '.menu not found in the rendered tree').toBeTruthy();
    expect(
      bar!.contains(menu!),
      '.menu is nested inside .bar in the render — Trap 11 violated'
    ).toBe(false);
    expect(menu!.parentElement).not.toBe(bar);
  });

  it('the required section id set is exactly {top, work, work-1..5, services, pricing, faq, end}', () => {
    const { container } = render(React.createElement(HomeBody));
    const allIds = idsOf(container);

    const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
    expect(dupes, `duplicate ids in the render: ${dupes.join(', ')}`).toEqual([]);

    const required = [
      'top',
      'work',
      'work-1',
      'work-2',
      'work-3',
      'work-4',
      'work-5',
      'services',
      'pricing',
      'faq',
      'end',
    ];
    // Furniture/functional ids the prototype itself carries outside the
    // required section-id set — confirmed against every `id="..."` in the
    // real prototype file: bar, burger, menu (chrome), detail, tiercards
    // (pricing's own interactive panels).
    const furniture = new Set(['bar', 'burger', 'menu', 'detail', 'tiercards']);
    const sectionIds = new Set(allIds.filter((id) => !furniture.has(id)));

    const missing = required.filter((id) => !sectionIds.has(id));
    const extra = [...sectionIds].filter((id) => !required.includes(id));

    expect(missing, `missing required ids: ${missing.join(', ')}`).toEqual([]);
    expect(extra, `unexpected extra section ids: ${extra.join(', ')}`).toEqual([]);
  });

  it('the process (steps) and quote panels carry no id, matching the prototype', () => {
    const { container } = render(React.createElement(HomeBody));
    const panels = container.querySelectorAll('.panel');
    const stepsPanel = Array.from(panels).find((p) => p.querySelector('.steps'));
    const quotePanel = Array.from(panels).find((p) => p.querySelector('.quote'));
    expect(stepsPanel, '.panel containing .steps not found').toBeTruthy();
    expect(quotePanel, '.panel containing .quote not found').toBeTruthy();
    expect(stepsPanel!.hasAttribute('id')).toBe(false);
    expect(quotePanel!.hasAttribute('id')).toBe(false);
  });

  it('five of the six data-ground values appear in the render; "paper" is the JS-driven default asserted against the CSS it powers', () => {
    const { container } = render(React.createElement(HomeBody));
    const renderedGrounds = new Set(
      Array.from(container.querySelectorAll('[data-ground]')).map((el) =>
        el.getAttribute('data-ground')
      )
    );
    for (const g of ['ink', 'white', 'magenta', 'navy', 'aqua']) {
      expect(renderedGrounds.has(g), `data-ground="${g}" not found in the rendered tree`).toBe(
        true
      );
    }
    // "paper" is never a static attribute in the prototype either — it is
    // the ground-tracking script's fallback default before any section
    // overlaps the bar's probe point (Phase 6's job). Confirmed absent from
    // the prototype's static markup and present only in its CSS driver.
    expect(
      Array.from(prototypeBody.querySelectorAll('[data-ground]')).some(
        (el) => el.getAttribute('data-ground') === 'paper'
      ),
      'the prototype unexpectedly has a static data-ground="paper" — the "JS default" assumption is wrong, update this test'
    ).toBe(false);
    expect(css, '"paper" data-ground CSS driver missing from home-r9.css').toContain(
      '[data-ground="paper"]'
    );
  });

  it('every class the prototype applies to a live element, and that home-r9.css actually styles, is applied by some component', () => {
    const { container } = render(React.createElement(HomeBody));
    const prototypeClasses = classesOf(prototypeBody);
    const renderedClasses = classesOf(container);

    const missing: string[] = [];
    let compared = 0;
    for (const cls of prototypeClasses) {
      if (!cssStylesClass(css, cls)) continue; // dead/out-of-scope CSS, not this gate's concern
      compared++;
      if (!renderedClasses.has(cls)) missing.push(cls);
    }

    expect(compared, 'no comparable classes found — 0 elements compared').toBeGreaterThan(0);
    expect(
      missing,
      `classes present in the live prototype and styled by home-r9.css, but absent from the render:\n${missing.join(', ')}`
    ).toEqual([]);

    // eslint-disable-next-line no-console
    console.log(`PASS — ${compared}/${compared} classes compared, 0 errors`);
  });

  it('prints the mandatory verdict line with real element counts', () => {
    const { container } = render(React.createElement(HomeBody));
    const prototypeClasses = classesOf(prototypeBody);
    const renderedClasses = classesOf(container);
    const renderedElementCount = container.querySelectorAll('*').length;
    const prototypeElementCount = prototypeBody.querySelectorAll('*').length;

    let compared = 0;
    let errors = 0;
    let firstOffender = '';
    for (const cls of prototypeClasses) {
      if (!cssStylesClass(css, cls)) continue;
      compared++;
      if (!renderedClasses.has(cls)) {
        errors++;
        if (!firstOffender) firstOffender = cls;
      }
    }

    expect(renderedElementCount).toBeGreaterThan(0);
    expect(prototypeElementCount).toBeGreaterThan(0);
    expect(compared).toBeGreaterThan(0);

    if (errors === 0) {
      // eslint-disable-next-line no-console
      console.log(
        `PASS — ${compared}/${compared} classes compared, ${renderedElementCount} rendered elements, 0 errors`
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `FAIL — ${compared - errors}/${compared} classes compared, ${errors} errors: ${firstOffender}`
      );
    }
    expect(errors, `first offending class: ${firstOffender}`).toBe(0);
  });
});
