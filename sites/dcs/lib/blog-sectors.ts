/**
 * PROVISIONAL — the blog's "who it's for" filter axis.
 * =====================================================
 *
 * `sector` does NOT exist as a frontmatter field on any `content/blog/*.mdx`
 * file. Decision D4 (inner-pages design session) asked for a second filter
 * axis on `/blog` beyond `category`, to be designed in now rather than
 * retrofitted once the library reaches 40+ posts. Agent F (wave 2 design
 * session, `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/
 * notes-f.md` §5.4) derived a value for each of the 21 posts from the post's
 * OWN title/description text, not by invented editorial judgement:
 *
 *   - "trades" if the post's title or description names a trade or says
 *     "tradesperson"/"trades".
 *   - "motorsport" for the one post that is a motor-racing case study
 *     instead (`a-fast-team-needs-a-fast-website`, whose description opens
 *     "NP Racing's British Superbike homepage…").
 *
 * The four other values (retail, studios, property, creative) are the
 * `/projects` portfolio taxonomy's own sectors (`lib/project-sectors.ts`),
 * reused here so the two indexes share one vocabulary — see
 * `SECTOR_LABELS` there. No blog post currently carries any of the four.
 *
 * THIS MAPPING IS PROVISIONAL AND DERIVED, PENDING RICKY'S CONFIRMATION.
 * It is NOT authored/approved content in the way `lib/project-sectors.ts`'s
 * mapping is (that one is copied verbatim off an approved, signed-off
 * prototype's `data-sector` attributes). This file exists so the design's
 * two-axis filter can be built and tested against real numbers without
 * writing an unapproved `sector` field into 21 MDX files — see root
 * `CLAUDE.md`'s MDX-only / no-invented-content rules. If Ricky does not
 * confirm this axis, delete this file and `components/blog/blog-filter-
 * section.tsx`'s sector axis collapses to the topic-only filter with no
 * other change required.
 */

export const BLOG_SECTOR_KEYS = [
  'trades',
  'motorsport',
  'retail',
  'studios',
  'property',
  'creative',
] as const;

export type BlogSectorKey = (typeof BLOG_SECTOR_KEYS)[number];

/** Filter-chip labels, in the filter bar's own order (kept identical to
 *  `blog-list.html:240-246`). */
export const BLOG_SECTOR_LABELS: Record<BlogSectorKey, string> = {
  trades: 'Trades and contractors',
  motorsport: 'Motorsport and teams',
  retail: 'Retail and eCommerce',
  studios: 'Studios and practitioners',
  property: 'Professional and property',
  creative: 'Creative and B2B',
};

/** `content/blog/*.mdx` slug -> derived sector. Every one of the 21 real
 *  posts must have an entry — `blog-list-page.tsx` throws in dev if a real
 *  slug is missing here, rather than silently defaulting it to a sector,
 *  which would be inventing a value this file's own header says not to. */
export const BLOG_SECTOR_BY_SLUG: Record<string, BlogSectorKey> = {
  'a-fast-team-needs-a-fast-website': 'motorsport',
  'before-and-after-project-pages': 'trades',
  'best-websites-for-electricians': 'trades',
  'best-websites-for-plumbers': 'trades',
  'best-websites-for-scaffolding-companies': 'trades',
  'how-much-does-a-tradesperson-website-cost': 'trades',
  'how-to-get-google-reviews-as-a-tradesperson': 'trades',
  'how-to-get-more-leads-from-your-website': 'trades',
  'how-to-rank-on-google-maps': 'trades',
  'how-to-write-a-good-testimonials-page': 'trades',
  'is-it-worth-paying-for-seo': 'trades',
  'local-seo-for-tradespeople': 'trades',
  'mobile-friendly-websites-for-tradespeople': 'trades',
  'pay-monthly-vs-upfront-website': 'trades',
  'schema-markup-for-tradespeople': 'trades',
  'service-pages-vs-location-pages-explained': 'trades',
  'setting-up-google-workspace-for-small-business': 'trades',
  'website-vs-facebook-page-for-tradespeople': 'trades',
  'what-is-a-google-business-profile': 'trades',
  'what-to-put-on-your-tradesperson-website': 'trades',
  'why-tradespeople-need-a-website': 'trades',
};
