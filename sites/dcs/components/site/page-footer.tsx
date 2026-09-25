/**
 * `.pagefoot` — the r9 page-level footer every inner route carries.
 *
 * Ported class-for-class from `prototype/_chrome.html:440-473` (section "G2 —
 * The page-level footer") and its live use at
 * `prototype/service-detail.html:294-362`. Three blocks in this order:
 *
 *   1. `.end__main` — the closing move, shared with the homepage's `.end`
 *      chapter (`components/site/end-main.tsx`), with the footer's own
 *      "Start a project" kicker.
 *   2. `.footmap` — the link map, now `components/site/foot-map.tsx` because
 *      the homepage renders the same one (Ricky's 2026-09-25 ruling: one
 *      footer everywhere). It used to be inlined here, which is how the
 *      homepage came to carry four in-page anchors instead.
 *   3. `.end__foot` — copyright and address, the same rule and microcopy row
 *      the homepage uses.
 *
 * `data-ground="navy"` is load-bearing, not decoration: the bar's ground
 * probe reads `main [data-ground]` rects (`home-behaviour.tsx`'s `groundFor`),
 * so without it the bar keeps the previous section's colour over the footer.
 * It is also why `site-chrome.tsx` renders this INSIDE `<main>`, exactly as
 * `service-detail.html:294` does — a footer outside `<main>` is invisible to
 * that query.
 *
 * `.in` is added by the reveal latch at runtime (`_chrome.html`'s own script
 * observes `.sec,.mast,.pagefoot`), not authored here.
 */

import { CONTACT } from '@/components/home/home-data';
import { EndMain } from '@/components/site/end-main';
import { FootMap } from '@/components/site/foot-map';

export function PageFooter() {
  return (
    <footer className="pagefoot p--navy" data-ground="navy">
      <EndMain eyebrow="Start a project" />

      <FootMap />

      <div className="end__foot">
        <span>© 2026 Digital Consulting Services Ltd</span>
        <span>{CONTACT.address}</span>
      </div>
    </footer>
  );
}
