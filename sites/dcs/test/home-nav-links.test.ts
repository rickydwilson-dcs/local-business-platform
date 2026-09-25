/**
 * The guard that was missing.
 *
 * For six days the 15 inner pages were live, styled and indexable while
 * **nothing on the homepage linked to any of them** — and 258 tests, CI and the
 * Production Quality Gate stayed green throughout, because no test asserted the
 * homepage's link set. This is that test.
 *
 * Every expectation is derived from `site-chrome-data.ts` and `home-data.ts`,
 * never from a hardcoded copy, so the guard stays true as the link sets change
 * rather than becoming a second list to maintain (the failure mode called out in
 * `PRODUCT.md:58-82` and Trap #7 of the port handoff).
 */

import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// `NavLink` is a Client Component calling `usePathname()`; there is no Next
// router here, so it returns null and throws. Same mocks as
// `page-parity.test.ts`. `next/link` must still emit a real `<a href>` —
// this whole test reads hrefs off the rendered DOM.
// jsdom implements neither of these. `HomeBehaviour` reads `matchMedia` on
// mount; `IntersectionObserver` is stubbed globally in `test/setup.ts`.
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

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
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
import { HomeBody } from '@/components/home/home-body';
import { SERVICES, WORK } from '@/components/home/home-data';
import {
  LEGAL_LINKS,
  LOCATION_LINKS,
  PRIMARY_LINKS,
  SERVICE_LINKS,
} from '@/components/site/site-chrome-data';

/**
 * Rendered fresh inside each test rather than once at describe-body time:
 * `test/setup.ts` runs `cleanup()` after every test, so a single shared render
 * would be torn down under the later cases.
 */
function homepageHrefs(): string[] {
  const { container } = render(React.createElement(HomeBody));
  return Array.from(container.querySelectorAll('a[href]')).map(
    (a) => a.getAttribute('href') as string
  );
}

describe('the homepage links into the inner pages', () => {
  it('links to all six primary routes', () => {
    const hrefs = homepageHrefs();
    const missing = PRIMARY_LINKS.filter((link) => !hrefs.includes(link.href));
    expect(
      missing.map((l) => l.href),
      'primary routes with no link anywhere on the homepage'
    ).toEqual([]);
  });

  it('links to every service page, from the service cards themselves', () => {
    const hrefs = homepageHrefs();
    // The six cards map 1:1 onto the six routes in SERVICE_LINKS.
    const cardHrefs = SERVICES.map((s) => s.href);
    expect(new Set(cardHrefs).size, 'two service cards share an href').toBe(SERVICES.length);

    const missing = SERVICE_LINKS.filter((link) => !cardHrefs.includes(link.href));
    expect(
      missing.map((l) => l.href),
      'service pages not reachable from a homepage card'
    ).toEqual([]);

    for (const href of cardHrefs) expect(hrefs, `card href ${href} not rendered`).toContain(href);
  });

  it('links to all eight location pages and all three legal pages via the footer map', () => {
    const hrefs = homepageHrefs();
    for (const link of [...LOCATION_LINKS, ...LEGAL_LINKS]) {
      expect(hrefs, `${link.href} missing from the homepage footer`).toContain(link.href);
    }
  });

  it('links to /projects, and to the case study of every work item that has one', () => {
    const hrefs = homepageHrefs();
    expect(hrefs, 'no section-level link to /projects').toContain('/projects');

    for (const item of WORK) {
      if (!item.caseStudy) continue;
      expect(hrefs, `${item.name}'s case study is not linked`).toContain(item.caseStudy);
    }
  });

  it('no longer carries the retired in-page-anchor nav', () => {
    // `.end__nav`'s four anchors and the old menu's five were the whole of the
    // homepage's navigation before 2026-09-25. The SECTIONS they pointed at
    // still exist (home-markup-parity.test.ts asserts the id set) — what must
    // not come back is navigation that goes only to them.
    const { container } = render(React.createElement(HomeBody));
    expect(container.querySelector('.end__nav'), '.end__nav is back').toBeNull();

    const menuHrefs = Array.from(container.querySelectorAll('.menu__nav a[href]')).map((a) =>
      a.getAttribute('href')
    );
    expect(menuHrefs.length, 'the overlay nav rendered no links').toBeGreaterThan(0);
    expect(
      menuHrefs.filter((h) => h?.startsWith('#')),
      'the overlay nav is back to in-page anchors'
    ).toEqual([]);
  });

  it('keeps the CTA pointing at the on-page #end chapter (Ricky, 2026-09-25)', () => {
    const hrefs = homepageHrefs();
    // Deliberate: #end is a real section carrying the email and phone, and it
    // is the designed conversion path. Asserted so a future "wire everything to
    // /contact" pass has to change the decision, not just the markup.
    expect(hrefs, 'the #end conversion anchor is gone').toContain('#end');
  });
});
