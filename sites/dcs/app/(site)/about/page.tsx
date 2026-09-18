/**
 * `/about` — ported from the r9 inner-pages design (Phase 2, agent 2e).
 *
 * The old solaris-styled `SiteAboutPage` (`components/pages/AboutPage.tsx`,
 * generic trades-focused copy driven from `siteConfig`) is replaced by
 * `components/about/about-page.tsx`, which carries this page's own authored
 * content — see that file's header for the design source and provenance.
 * `components/pages/AboutPage.tsx` is left in place, unimported, matching how
 * Phase 1 left the equivalent solaris `HomePage.tsx` orphaned rather than
 * deleted (out of this phase's scope).
 *
 * The chrome (`.bar`, `.menu`, `.pagefoot`) is NOT rendered here — it comes
 * from `app/(site)/layout.tsx`'s `SiteChrome`.
 */

import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/about-page';
import { absUrl } from '@/lib/site';

// Title and description are the prototype's own <title>/<meta name="description">
// (`prototype/about.html:5-6`) — real, settled copy, not a template.
export const metadata: Metadata = {
  title: 'About — Digital Consulting Services',
  description:
    'Digital Consulting Services is one person. I ask the questions, write the content and build the site myself — no account manager, no ticket queue.',
  alternates: {
    canonical: absUrl('/about'),
  },
};

export default function Page() {
  return <AboutPage />;
}
