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
 *   2. `.footmap` — the link map, which is the one thing a footer has that a
 *      closing chapter does not. Four columns, exactly the design's headings
 *      and order.
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
import { NavLink } from '@/components/site/nav-link';
import {
  LEGAL_LINKS,
  LOCATION_LINKS,
  PRIMARY_LINKS,
  SERVICE_LINKS,
  type ChromeLink,
} from '@/components/site/site-chrome-data';

function FootColumn({ heading, links }: { heading: string; links: readonly ChromeLink[] }) {
  return (
    <div>
      <p className="eyeless">{heading}</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <NavLink href={link.href}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PageFooter() {
  return (
    <footer className="pagefoot p--navy" data-ground="navy">
      <EndMain eyebrow="Start a project" />

      <div className="footmap">
        <FootColumn heading="Pages" links={PRIMARY_LINKS} />
        <FootColumn heading="Services" links={SERVICE_LINKS} />
        {/* Decision D2 (session.md:137-141): the eight location pages live
            here, not in the primary nav. */}
        <FootColumn heading="Areas I cover" links={LOCATION_LINKS} />
        <div>
          <p className="eyeless">Get in touch</p>
          <ul>
            <li>
              <a href={CONTACT.mailtoHref}>{CONTACT.email}</a>
            </li>
            <li>
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
            </li>
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="end__foot">
        <span>© 2026 Digital Consulting Services Ltd</span>
        <span>{CONTACT.address}</span>
      </div>
    </footer>
  );
}
