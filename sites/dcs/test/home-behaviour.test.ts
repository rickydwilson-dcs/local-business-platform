/**
 * Phase 6 gate — `groundFor()` and `layoutTop()`, the two pure functions
 * extracted from `components/home/home-behaviour.tsx`.
 *
 * `groundFor` is checked against `test/fixtures/ground-positions.json`, which
 * was RECORDED from the running r9 prototype in a real Chromium driven over
 * CDP (see `output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/capture-ground-fixture.mjs`).
 * Every rect in it is a real `getBoundingClientRect()` reading at a real,
 * settled scroll position, and every expected ground is what the prototype's
 * own `ground()` actually wrote to `bar.dataset.ground` there. Nothing in the
 * fixture is hand-written — which is the point: Trap 1 means the live
 * rAF-written attribute cannot be trusted under instrumentation, so the gate
 * tests the computation against a recording rather than polling the DOM.
 *
 * `layoutTop` cannot be exercised for real in jsdom, which has no layout engine
 * — every `getBoundingClientRect()` returns zeroes. So the rect is stubbed with
 * a fake that behaves the way a real sticky element does: it reports the PINNED
 * position while `position` is `sticky`, and the LAYOUT position only while
 * `position` is `static`. That is exactly the divergence Traps 4 and 5 describe,
 * and it is what the function has to defeat. The recorded fixture carries the
 * real-browser evidence that the divergence exists (`evidence[].pinnedLie`),
 * and that is asserted here too.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { groundFor, layoutTop, type GroundRect } from '../components/home/home-behaviour';

interface RecordedEvidence {
  key: string;
  position: string;
  liveTop: number;
  layoutTop: number;
  pinnedLie: boolean;
}

interface RecordedPosition {
  scrollY: number;
  viewportHeight: number;
  barHeight: number;
  probeY: number;
  liveGround: string;
  rects: (GroundRect & { key: string })[];
  evidence: RecordedEvidence[];
}

interface Fixture {
  capturedAt: string;
  source: string;
  viewport: { width: number; height: number };
  maxScroll: number;
  groundsCovered: string[];
  stickyLies: number;
  positions: RecordedPosition[];
}

const FIXTURE_PATH = path.resolve(__dirname, 'fixtures/ground-positions.json');
const fixture: Fixture = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));

/* -------------------------------------------------------------------------- */

describe('the recorded fixture itself', () => {
  it('is a real capture with enough usable positions to be a gate', () => {
    // The failure contract: a capture that produced only a handful of positions
    // is a FAILED phase, not a smaller passing test.
    expect(fixture.positions.length).toBeGreaterThanOrEqual(10);
    expect(fixture.source).toContain('r9-kota-level.html');
    expect(fixture.maxScroll).toBeGreaterThan(1000);
  });

  it('covers every ground the prototype actually reaches', () => {
    const observed = new Set(fixture.positions.map((p) => p.liveGround));
    // `paper` is the fallback in `groundFor` and is deliberately absent: the
    // prototype's sections tile the probe point contiguously from the hero to
    // the footer, so no real scroll position leaves it uncovered. It is covered
    // by the explicit no-match case further down instead of by inventing rects.
    for (const ground of ['ink', 'white', 'magenta', 'aqua', 'navy']) {
      expect(observed, `ground "${ground}" missing from the capture`).toContain(ground);
    }
  });

  it('recorded real live-vs-layout divergence on the sticky sections', () => {
    // Traps 4 and 5, measured rather than asserted from memory. If this is 0
    // the capture ran against something that was not the sticky prototype and
    // the whole fixture is suspect.
    expect(fixture.stickyLies).toBeGreaterThan(0);

    const worst = fixture.positions
      .flatMap((p) => p.evidence.map((e) => ({ ...e, scrollY: p.scrollY })))
      .filter((e) => e.pinnedLie)
      .sort((a, b) => Math.abs(b.liveTop) - Math.abs(a.liveTop))[0];

    expect(worst).toBeDefined();
    expect(worst.position).toBe('sticky');
    expect(worst.layoutTop).not.toBeCloseTo(worst.liveTop, 0);
  });
});

describe('groundFor', () => {
  it('reproduces the prototype ground at every recorded scroll position', () => {
    const failures: string[] = [];

    for (const position of fixture.positions) {
      const actual = groundFor(position.probeY, position.rects);
      if (actual !== position.liveGround) {
        failures.push(
          `scrollY=${position.scrollY} probeY=${position.probeY} ` +
            `expected="${position.liveGround}" got="${actual}"`
        );
      }
    }

    expect(fixture.positions.length).toBeGreaterThan(0);
    expect(failures, `first offending record: ${failures[0]}`).toEqual([]);
  });

  it('takes the LAST matching section, not the first', () => {
    // Not a stylistic detail. Sticky panels overlap constantly: the capture
    // contains real positions where three sections simultaneously report the
    // same pinned box, and only the last one in document order is the one
    // actually painting. A first-match implementation passes a naive smoke test
    // and is wrong here.
    const overlapping = fixture.positions.find(
      (p) => p.rects.filter((r) => r.top <= p.probeY && r.bottom > p.probeY).length > 1
    );

    expect(
      overlapping,
      'the capture contains no overlapping-section position, so this invariant is untested'
    ).toBeDefined();

    const matches = overlapping!.rects.filter(
      (r) => r.top <= overlapping!.probeY && r.bottom > overlapping!.probeY
    );
    expect(groundFor(overlapping!.probeY, matches)).toBe(matches[matches.length - 1].ground);
    expect(groundFor(overlapping!.probeY, matches)).toBe(overlapping!.liveGround);
  });

  it('falls back to paper when the probe point is in no section', () => {
    expect(groundFor(50, [])).toBe('paper');

    // Same real rects, probed from far below every one of them.
    const position = fixture.positions[0];
    const belowEverything = Math.max(...position.rects.map((r) => r.bottom)) + 1;
    expect(groundFor(belowEverything, position.rects)).toBe('paper');
  });

  it('treats the section boundary as top-inclusive and bottom-exclusive', () => {
    // Matches the prototype's `r.top <= y && r.bottom > y`, so two stacked
    // sections sharing an edge never both claim the probe point.
    const rects: GroundRect[] = [
      { ground: 'a', top: 0, bottom: 100 },
      { ground: 'b', top: 100, bottom: 200 },
    ];
    expect(groundFor(0, rects)).toBe('a');
    expect(groundFor(99.999, rects)).toBe('a');
    expect(groundFor(100, rects)).toBe('b');
    expect(groundFor(199.999, rects)).toBe('b');
    expect(groundFor(200, rects)).toBe('paper');
  });
});

describe('layoutTop', () => {
  /**
   * Builds an element whose `getBoundingClientRect` lies the way a real pinned
   * sticky element lies: `pinnedTop` while `position` is anything other than
   * `static`, the honest `layoutTop - scrollY` once it IS `static`.
   */
  function stickyElement(options: {
    pinnedTop: number;
    documentTop: number;
    scrollY: number;
    inlinePosition?: string;
  }) {
    const el = document.createElement('section');
    if (options.inlinePosition !== undefined) el.style.position = options.inlinePosition;

    const seen: string[] = [];
    el.getBoundingClientRect = (() => {
      seen.push(el.style.position);
      const top =
        el.style.position === 'static' ? options.documentTop - options.scrollY : options.pinnedTop;
      return { top, bottom: top + 900, left: 0, right: 0, width: 0, height: 900 } as DOMRect;
    }) as HTMLElement['getBoundingClientRect'];

    Object.defineProperty(window, 'scrollY', {
      value: options.scrollY,
      configurable: true,
      writable: true,
    });

    return { el, seen };
  }

  it('returns the layout position, not the pinned one', () => {
    // Numbers taken from the recorded capture: at scrollY 13613 the `#services`
    // panel reported liveTop 0 while its true layout top was 8136.
    const { el } = stickyElement({ pinnedTop: 0, documentTop: 8136, scrollY: 13613 });

    expect(layoutTop(el)).toBe(8136);
    // The naive read — the thing that makes every in-page link a no-op.
    expect(el.getBoundingClientRect().top + window.scrollY).toBe(13613);
  });

  it('reads the rect while position is static', () => {
    const { el, seen } = stickyElement({ pinnedTop: 0, documentTop: 8136, scrollY: 13613 });
    layoutTop(el);
    expect(seen).toEqual(['static']);
  });

  it('restores the original inline position, leaving no side effect', () => {
    // No inline position: must come back to '' so the stylesheet's
    // `position: sticky` takes over again rather than being pinned to static.
    const bare = stickyElement({ pinnedTop: 0, documentTop: 4200, scrollY: 9000 });
    layoutTop(bare.el);
    expect(bare.el.style.position).toBe('');
    expect(bare.el.getAttribute('style') ?? '').not.toContain('static');

    // An inline position that was already there must survive verbatim.
    const inline = stickyElement({
      pinnedTop: 0,
      documentTop: 4200,
      scrollY: 9000,
      inlinePosition: 'relative',
    });
    layoutTop(inline.el);
    expect(inline.el.style.position).toBe('relative');
  });

  it('agrees with the layout tops recorded from the real browser', () => {
    // Replays the capture's own recorded pairs through the same arithmetic the
    // function performs, so the stub above is anchored to real numbers rather
    // than to numbers chosen to make it pass.
    const sample = fixture.positions.find((p) => p.evidence.some((e) => e.pinnedLie))!;
    const lie = sample.evidence.find((e) => e.pinnedLie)!;

    const { el } = stickyElement({
      pinnedTop: lie.liveTop,
      documentTop: lie.layoutTop,
      scrollY: sample.scrollY,
    });

    expect(layoutTop(el)).toBeCloseTo(lie.layoutTop, 3);
    expect(layoutTop(el)).not.toBeCloseTo(lie.liveTop + sample.scrollY, 0);
  });
});

describe('verdict', () => {
  it('prints the mandatory verdict line with real counts', () => {
    let errors = 0;
    let firstOffender = '';
    const total = fixture.positions.length;

    for (const position of fixture.positions) {
      const actual = groundFor(position.probeY, position.rects);
      if (actual !== position.liveGround) {
        errors++;
        if (!firstOffender) {
          firstOffender = `scrollY=${position.scrollY} expected="${position.liveGround}" got="${actual}"`;
        }
      }
    }

    expect(total).toBeGreaterThan(0);

    if (errors === 0) {
      // eslint-disable-next-line no-console
      console.log(
        `PASS — ${total}/${total} positions verified, 0 errors ` +
          `(grounds: ${fixture.groundsCovered.join(', ')}; ` +
          `${fixture.stickyLies} sticky rect divergences recorded)`
      );
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `FAIL — ${total - errors}/${total} positions verified, ${errors} errors: ${firstOffender}`
      );
    }

    expect(errors, `first offending record: ${firstOffender}`).toBe(0);
  });
});
