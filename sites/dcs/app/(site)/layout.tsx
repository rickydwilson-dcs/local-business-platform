import type { Metadata } from 'next';
// Must stay above the inner-pages import, for the same reason `app/page.tsx`
// puts it above `home-r9.css`: it rolls the app-wide base layer (Tailwind
// Preflight plus the solaris base rules that `app/globals.css` contributes)
// back to the browser-default environment the ported stylesheet was authored
// against. `inner-pages.css` §02 says so in its own words — "Do NOT add a
// Preflight-style normalise on top of this".
import '@/styles/home-r9-reset.css';
import '@/styles/inner-pages.css';
import { SiteChrome } from '@/components/site/site-chrome';

/**
 * The `(site)` route group carries the r9 chrome — `.bar`, the `.menu`
 * overlay and the `.pagefoot` page footer — for the inner routes (about,
 * blog, contact, cookie-policy, locations, pricing, privacy-policy, projects,
 * services, terms-and-conditions and their dynamic `[slug]` children). Route
 * groups are parenthesised so this segment does not appear in any URL.
 *
 * ## What replaced what (2026-09-18, inner-pages port Phase 1)
 *
 * This layout previously rendered the solaris chrome — the shared page shell
 * from `@platform/core-components` plus this site's own header and footer
 * components. All three are gone; the markup is now the approved r9 design in
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/_chrome.html`,
 * composed by `components/site/site-chrome.tsx`. Two consequences worth
 * knowing:
 *
 *   - Those header and footer components took a `logoAlt`, and this file
 *     passed `"DCS Gardening & Landscaping"` to it in BOTH places (the header
 *     at the old line 36 and the footer at the old line 48). DCS is a web
 *     design studio; that string was wrong on every inner page. The r9 lockup
 *     takes no `logoAlt` at all — it is an inline SVG marked `aria-hidden`
 *     beside real text ("digital consulting" / "services" plus an `.sr-only`
 *     " (home)"), so its accessible name is the business's actual name and
 *     there is no alt string left to get wrong.
 *   - The old shell supplied a "Skip to main content" link and a
 *     `<main id="main-content">`. The r9 design has neither; its main is
 *     `<main id="top">`, matching the homepage and every prototype. The skip
 *     link was not re-added, because adding chrome the approved design does
 *     not contain is a design decision and this phase is a port — flagged for
 *     Ricky rather than decided here.
 *
 * ## The `/reviews` route is deliberately gone
 *
 * Decision D3: a page holding three testimonials advertises that there are
 * only three. Those three now live on `/projects` and in the relevant case
 * studies via the `.quote` pattern. `app/(site)/reviews/page.tsx` was deleted,
 * along with its (already commented-out) `app/sitemap.ts` entry and its
 * `proxy.ts` analytics title. Nothing in the nav or footer ever linked to it.
 *
 * ## Stylesheet strategy
 *
 * `styles/inner-pages.css` is a verbatim copy of the design session's merged
 * `kit.css`, imported HERE rather than in the root layout — mirroring how
 * `app/page.tsx` imports `home-r9.css` for `/` only. That is the one strategy
 * that cannot regress the byte-for-byte parity-guarded homepage. See that
 * file's header for why `home-r9.css` is deliberately NOT imported alongside
 * it (`inner-pages.css` §01 carries the full token set itself).
 *
 * ## Indexing
 *
 * Until the inner pages ship, only `/` is indexable. Next.js merges metadata
 * field-by-field down the segment tree, so this single `robots` declaration is
 * inherited by every route in the group without a per-page export.
 * `app/page.tsx` sits outside this group and inherits nothing, so it stays
 * indexable by default.
 *
 * **Do not remove this declaration** to open the section up — `PRODUCT.md:53-56`
 * forbids it, because it would re-index every route at once including the ones
 * still not ready. Opt in per page with a page-level `robots` export and
 * uncomment that page's entry in `app/sitemap.ts`, the two always moving
 * together (a `noindex` page listed in a sitemap is a Search Console warning).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
