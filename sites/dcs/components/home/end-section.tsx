/**
 * The final `.end` panel's content — `.end__main` (heading, lead, the two
 * `.big` contact links, and the CTA) plus `.end__foot` (in-page nav,
 * copyright, address). Ported verbatim from `r9-kota-level.html`'s
 * `#end` section; the outer `<section class="panel p--navy end" id="end"
 * data-ground="navy">` wrapper is composed elsewhere.
 *
 * Per Ricky's explicit nav decision (yolo-brief.md scope notes): the footer
 * nav stays as in-page anchors only. Do not add links to /services,
 * /pricing, /blog or any other route — the 14 existing inner routes are not
 * linked from the homepage yet.
 *
 * `.end__main` itself moved to `components/site/end-main.tsx` during the
 * inner-pages port (2026-09-18) because the inner pages' `.pagefoot` is the
 * same block with one extra kicker. Calling it with no props renders exactly
 * what was inlined here before; `test/home-markup-parity.test.ts` guards that.
 */

import { EndMain } from '@/components/site/end-main';
import { CONTACT } from './home-data';

export function EndSection() {
  return (
    <>
      <EndMain />
      <div className="end__foot">
        {/* In-page anchors only — see CONTACT/nav decision note above. */}
        <nav className="end__nav">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">Questions</a>
        </nav>
        <span>© 2026 Digital Consulting Services Ltd</span>
        <span>{CONTACT.address}</span>
      </div>
    </>
  );
}
