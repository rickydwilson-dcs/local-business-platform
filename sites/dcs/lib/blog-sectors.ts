/**
 * The blog's "who it's for" axis — the sector vocabulary and its labels.
 *
 * `sector` is a REAL authored frontmatter field on every `content/blog/*.mdx`
 * file (promoted 2026-09-25). This file no longer derives or stores per-post
 * values; it owns the vocabulary and the narrowing helper, and each post
 * carries its own value.
 *
 * History, so the next reader does not re-open a settled question:
 *
 *  - Decision D4 (inner-pages design session) asked for a second filter axis
 *    on `/blog` beyond `category`, designed in now rather than retrofitted at
 *    40+ posts.
 *  - The port shipped it as a PROVISIONAL derived map — Agent F inferred a
 *    value for each of the 21 posts from the post's own title/description
 *    text, rather than writing an unapproved field into content.
 *  - Ricky declined the interactive sector FILTER CHIPS on 2026-09-19
 *    (commit `84cc16f9`): with ~20 of 21 posts under one chip it wasn't
 *    useful yet. **That decision stands — there is no sector filter on
 *    `/blog`, and this file is not an invitation to re-add one.**
 *  - Ricky then promoted `sector` to real frontmatter on 2026-09-25 to close
 *    the loose end of live copy being driven by data marked "provisional".
 *
 * The derived values were checked against all 21 posts before being written:
 * each of the 20 `trades` posts names a trade or "tradesperson"/"trades" in
 * its own title or description, and the one `motorsport` post is the NP
 * Racing British Superbike case study.
 *
 * What still reads this axis (the filter chips do NOT):
 *  - `blog-list-page.tsx` — the featured post's badge and the aqua
 *    "who it's for" band.
 *  - `blog-post-page.tsx` — the per-post badge.
 *  - `blog-category-page.tsx` — the per-category summary line.
 *
 * The vocabulary is the `/projects` portfolio taxonomy's own sectors
 * (`lib/project-sectors.ts`), reused so the two indexes share one language.
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

const SECTOR_KEY_SET: ReadonlySet<string> = new Set(BLOG_SECTOR_KEYS);

/**
 * Narrow a raw frontmatter `sector` string to a known key.
 *
 * The shared `BlogFrontmatterSchema` types `sector` as an optional plain
 * string, because the vocabulary is per-site (see the schema's own comment).
 * So a typo — `"trade"`, `"Trades"` — would pass Zod and then silently render
 * nothing at all. This returns `undefined` for anything unrecognised, which
 * every caller already handles by omitting the badge, and shouts in dev so
 * the typo is found while authoring rather than in production.
 */
export function toBlogSector(value: string | undefined): BlogSectorKey | undefined {
  if (!value) return undefined;
  if (SECTOR_KEY_SET.has(value)) return value as BlogSectorKey;
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[blog] Unknown sector "${value}" in blog frontmatter. ` +
        `Expected one of: ${BLOG_SECTOR_KEYS.join(', ')}.`
    );
  }
  return undefined;
}
