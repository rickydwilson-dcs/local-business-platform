import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * 404 — ported from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/404.html`
 * (inner-pages port, Phase 2d).
 *
 * ## Why this file carries its own chrome imports
 *
 * There is no `app/(site)/not-found.tsx`, so this root-level file is the
 * ONLY not-found boundary in the app — it catches every unmatched URL,
 * including ones under `(site)/*`. Next.js wraps a not-found boundary in the
 * layouts of the segment it lives in, and this file lives directly under
 * `app/`, so it is wrapped by `app/layout.tsx` only. `app/(site)/layout.tsx`
 * — the one that renders `SiteChrome` and imports `styles/inner-pages.css` —
 * does NOT wrap it, route group or not. So the r9 chrome and its stylesheet
 * are applied directly here, exactly the way `app/(site)/layout.tsx` applies
 * them, rather than assumed to already be in scope.
 *
 * ## What replaced what
 *
 * The old page was generic Tailwind: four lucide icons, a 20%-opacity "404"
 * at `text-9xl`, a "Go Back" button calling `window.history.back()`, a
 * bordered "Need Help?" card and a 2x4 grid of bordered link tiles — eight
 * boxes on a page that needs one sentence and a list, and entirely off-brand
 * (see the prototype's own header comment). All of it is gone. This page
 * needs no client interactivity of its own — `window.history.back()` isn't
 * part of the approved design — so it is a plain Server Component; SiteChrome
 * still supplies the (client) bar/menu behaviour around it.
 *
 * ## No breadcrumb
 *
 * A breadcrumb is a position in a hierarchy and this page has none. `.mast`
 * with no preceding `.crumb` takes its full top padding (`inner-pages.css`'s
 * `.crumb+.mast{padding-top:20px}` rule only fires when a crumb is present).
 *
 * ## The bar's CTA target — a design inconsistency, not fixed here
 *
 * `SiteChrome` points the bar's "Start a project" pill at `CONTACT.mailtoHref`
 * for every inner page (matching `service-detail.html`, the majority
 * convention across 11 of the 14 real prototypes). `404.html` and
 * `legal.html` are the two outliers that instead point it at `contact.html`.
 * Making the bar page-aware would mean touching Phase 1's already-gated
 * `site-chrome.tsx`/`site-bar.tsx`, which is out of this phase's scope (routes
 * only) — flagged in the final report rather than changed here.
 */

import '@/styles/home-r9-reset.css';
import '@/styles/inner-pages.css';
import { CONTACT } from '@/components/home/home-data';
import { SiteChrome } from '@/components/site/site-chrome';
import { PRIMARY_LINKS } from '@/components/site/site-chrome-data';

export const metadata: Metadata = {
  title: 'Nothing at this address',
  description:
    "The page you're looking for isn't at this address. Try the work, services or pricing pages, or tell me where the broken link was and I'll fix it.",
  // The prototype's own <meta name="robots" content="noindex"> (404.html:8),
  // expressed the same way `app/(site)/layout.tsx`'s group-level default-deny
  // already is, for consistency across the codebase.
  robots: { index: false, follow: false },
};

/** `.work`/`.row`'s six real destinations and their copy, in the design's own
 *  order (404.html:112-135). Hrefs are `PRIMARY_LINKS` — the same six routes
 *  the chrome's overlay nav and footer use — rather than re-typed strings, so
 *  a route change in one place can't silently diverge from the other. The
 *  meta/detail copy (verified counts: 13 projects, 6 services, 21 blog posts)
 *  is the prototype's own, keyed by label. */
const ROUTE_META: Record<string, { meta: string; detail: string }> = {
  Work: { meta: 'Thirteen builds', detail: 'With the story behind each one' },
  Services: { meta: 'Six of them', detail: 'Websites, shops, SEO, management' },
  Pricing: { meta: 'Published, in full', detail: 'Monthly or upfront' },
  Blog: { meta: 'Twenty-one posts', detail: 'Mostly about getting found' },
  About: { meta: 'One person', detail: 'Which is the whole point' },
  Contact: { meta: 'A form, or just ring me', detail: 'Free, and without obligation' },
};

export default function NotFound() {
  return (
    <SiteChrome>
      {/* ===== 1. MASTHEAD — ink =========================================== */}
      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Error 404</p>
        <h1>
          There&rsquo;s <span className="plate">nothing</span> at this address.
        </h1>
        <p className="lead">
          Either it moved, or the link that sent you here was wrong. Nothing is broken and you
          haven&rsquo;t done anything &mdash; this URL just doesn&rsquo;t point at a page. Here is
          everything that does.
        </p>
      </header>

      {/* ===== 2. THE WAY OUT — white ====================================== */}
      <section className="sec p--white" data-ground="white">
        <p className="eyeless">The whole site, in six links</p>
        <h2 className="res">Try one of these.</h2>

        <div className="work">
          {PRIMARY_LINKS.map((link) => {
            const copy = ROUTE_META[link.label];
            return (
              <Link key={link.href} className="row" href={link.href}>
                <span className="row__n">{link.label}</span>
                <span className="row__m">
                  {copy.meta}
                  <em>{copy.detail}</em>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="lead">
          If you followed a link from somewhere on this site and it brought you here, that is my
          mistake rather than yours &mdash;{' '}
          <a
            href={`${CONTACT.mailtoHref}?subject=Broken%20link`}
            style={{ borderBottom: '1.5px solid rgba(214,0,107,.5)', color: 'var(--magenta)' }}
          >
            tell me where it was
          </a>{' '}
          and I will fix it.
        </p>
      </section>
    </SiteChrome>
  );
}
