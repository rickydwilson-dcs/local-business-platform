/**
 * Contact page route.
 *
 * The page body is `SiteContactPage` (`components/pages/ContactPage.tsx`),
 * ported from the approved r9 design — see that file's header comment for
 * what it owns, what was deleted, and what was deliberately left unwired.
 * It no longer takes a `siteConfig` prop: the ported design's contact
 * details (email, phone, address, hours) are the site's real, literal
 * values from `components/home/home-data.ts`'s `CONTACT`, not templated from
 * `site.config.ts` — matching how the rest of the r9 chrome already sources
 * those same values.
 *
 * Title/description below are the prototype's own copy
 * (`prototype/contact.html:5-6`), first-person singular, replacing the old
 * plural "We usually respond within a few hours" — the wrong voice for this
 * site (see `ContactPage.tsx`'s header) and, separately, the wrong claim: the
 * shipped API's own auto-reply says 24 hours
 * (`packages/core-components/src/lib/api/contact-route.ts:162`).
 */

import type { Metadata } from 'next';
import { SiteContactPage } from '@/components/pages/ContactPage';
import { absUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Tell me what you need and I'll come back with what I'd build, what it would cost and how long it would take. No obligation, and no sales call.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: absUrl('/contact'),
  },
};

export default function ContactPage() {
  return <SiteContactPage />;
}
