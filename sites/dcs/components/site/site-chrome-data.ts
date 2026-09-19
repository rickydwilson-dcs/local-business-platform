/**
 * The link sets the r9 inner-page chrome carries — the overlay nav and the
 * four `.footmap` columns.
 *
 * Ported from the approved design, not invented here:
 *   - the six primary routes and their order:
 *     `prototype/_chrome.html:82` (the specimen bar) and
 *     `prototype/service-detail.html:43-50` (the overlay)
 *   - the four footer columns, their headings and their order:
 *     `prototype/_chrome.html:450-467` / `service-detail.html:307-355`
 *
 * The prototypes are standalone files with no routes, so every internal
 * `href` in them is the placeholder `"#"`. The real paths below are the
 * site's own existing routes — wiring, not design. Two of them are worth
 * naming explicitly:
 *
 *   - "Work" is `/projects`. The design labels the portfolio "Work"
 *     throughout (`_chrome.html:452`) while the route has always been
 *     `/projects`; the label is the design's, the path is the site's.
 *   - The eight towns are `/locations/<slug>` and live ONLY here, in the
 *     footer — decision D2 (`session.md:137-141`) keeps them out of the
 *     primary nav so the brand is not pulled back toward local trades at the
 *     top of every page.
 *
 * There is deliberately no `/reviews` entry: the route was dropped (D3 — a
 * page holding three testimonials advertises that there are only three), and
 * its testimonials live on `/projects` and in the case studies instead.
 */

export interface ChromeLink {
  label: string;
  href: string;
}

/** The six primary routes, in the design's order. Used by the overlay nav
 *  and by the footer's "Pages" column. */
export const PRIMARY_LINKS: readonly ChromeLink[] = [
  { label: 'Work', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/** `.footmap` column 2. Labels are the design's (`_chrome.html:455-457`);
 *  slugs are `content/services/*.mdx`. */
export const SERVICE_LINKS: readonly ChromeLink[] = [
  { label: 'Website design', href: '/services/web-design' },
  { label: 'Local SEO', href: '/services/local-seo' },
  { label: 'Ongoing management', href: '/services/monthly-management' },
  { label: 'eCommerce', href: '/services/ecommerce' },
  { label: 'Analytics & reporting', href: '/services/analytics' },
  { label: 'Google Workspace email', href: '/services/google-workspace' },
] as const;

/** `.footmap` column 3 — the eight towns in `content/locations/*.mdx`,
 *  alphabetical, exactly as `_chrome.html:459-461` lists them. */
export const LOCATION_LINKS: readonly ChromeLink[] = [
  { label: 'Brighton', href: '/locations/brighton' },
  { label: 'Eastbourne', href: '/locations/eastbourne' },
  { label: 'Hailsham', href: '/locations/hailsham' },
  { label: 'Hove', href: '/locations/hove' },
  { label: 'Lewes', href: '/locations/lewes' },
  { label: 'Polegate', href: '/locations/polegate' },
  { label: 'Seaford', href: '/locations/seaford' },
  { label: 'Uckfield', href: '/locations/uckfield' },
] as const;

/** `.footmap` column 4's three policy links. The email and phone rows above
 *  them are rendered separately — they are `mailto:`/`tel:`, not routes. */
export const LEGAL_LINKS: readonly ChromeLink[] = [
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'Cookie policy', href: '/cookie-policy' },
  { label: 'Terms & conditions', href: '/terms-and-conditions' },
] as const;
