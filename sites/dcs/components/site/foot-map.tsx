/**
 * `.footmap` — the footer's four-column link map, shared by every page.
 *
 * Extracted from `page-footer.tsx` on 2026-09-25 so the homepage and the inner
 * routes cannot drift apart again. Before that, the homepage's `.end` chapter
 * carried four in-page anchors (`#work #services #pricing #faq`) where the
 * inner pages carried this map, which is why nothing on the homepage linked to
 * any of the 15 inner routes for six days after they shipped.
 *
 * Ricky's ruling, 2026-09-25: **the footer is consistent across all pages**
 * unless there is a good reason to diverge. The known legitimate divergence is
 * the `colossus-scaffolding` pattern (more specific location links on service
 * pages) and it is explicitly **not needed on DCS yet**.
 *
 * What still differs between the two footers, deliberately:
 *   - the homepage wraps this in its full-height `.end` closing CHAPTER
 *     (`<section class="panel p--navy end" id="end">`), the inner pages in the
 *     compact `<footer class="pagefoot">`. `design-kit.md` G2 is explicit that
 *     `.end` "is the homepage's closing _chapter_, full-height and centred,
 *     **not** a footer", and `home-markup-parity.test.ts` asserts `#end` is
 *     still a section.
 *   - the inner footer's `EndMain` takes the "Start a project" kicker; the
 *     homepage's does not.
 * The LINK MAP is identical. Approved by Ricky on those grounds.
 *
 * Every link comes from `site-chrome-data.ts` — never a local copy, so the
 * guard in `test/home-nav-links.test.ts` stays true as the link sets change.
 */

import { CONTACT } from '@/components/home/home-data';
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

export function FootMap() {
  return (
    <div className="footmap">
      <FootColumn heading="Pages" links={PRIMARY_LINKS} />
      <FootColumn heading="Services" links={SERVICE_LINKS} />
      {/* Decision D2 (session.md:137-141): the eight location pages live here,
          not in the primary nav. */}
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
  );
}
