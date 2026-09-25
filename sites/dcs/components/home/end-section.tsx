/**
 * The final `.end` panel's content — `.end__main` (heading, lead, the two
 * `.big` contact links, and the CTA), then the shared `.footmap` link map,
 * then `.end__foot` (copyright, address). Ported from `r9-kota-level.html`'s
 * `#end` section; the outer `<section class="panel p--navy end" id="end"
 * data-ground="navy">` wrapper is composed in `home-body.tsx`.
 *
 * ## The nav decision, and its history
 *
 * This block used to carry `.end__nav` — four in-page anchors (`#work`,
 * `#services`, `#pricing`, `#faq`) — under an explicit instruction not to add
 * route links, because at the time the inner routes did not exist. That
 * instruction was **superseded by decision D1** the moment they did
 * (`design-kit.md` §12 item 7 flagged that it "will need updating at port
 * time"); it was not updated, and the result was that nothing on the homepage
 * linked to any of the 15 inner pages.
 *
 * **Ricky's ruling, 2026-09-25: the footer is consistent across all pages.**
 * So the anchors are gone and this renders the same `FootMap` the inner
 * pages' `.pagefoot` does.
 *
 * What stays different, deliberately and with approval: the homepage keeps the
 * full-height `.end` CHAPTER wrapper and the no-kicker `EndMain`, because
 * `design-kit.md` G2 is explicit that `.end` is "the homepage's closing
 * _chapter_, full-height and centred, **not** a footer", and
 * `home-markup-parity.test.ts` requires `#end` to remain a section. The link
 * map is what had to match, and now does.
 *
 * `.end__main` itself lives in `components/site/end-main.tsx` (moved during
 * the inner-pages port, 2026-09-18) because the inner pages' `.pagefoot` is
 * the same block with one extra kicker. Calling it with no props renders
 * exactly what was inlined here before; `test/home-markup-parity.test.ts`
 * guards that.
 */

import { EndMain } from '@/components/site/end-main';
import { FootMap } from '@/components/site/foot-map';
import { CONTACT } from './home-data';

export function EndSection() {
  return (
    <>
      <EndMain />
      <FootMap />
      <div className="end__foot">
        <span>© 2026 Digital Consulting Services Ltd</span>
        <span>{CONTACT.address}</span>
      </div>
    </>
  );
}
