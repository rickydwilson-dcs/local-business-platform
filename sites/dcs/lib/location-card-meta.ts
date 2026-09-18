/**
 * Curated presentation metadata for the 8 `content/locations/*.mdx` towns,
 * ported from the approved design
 * (`output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/
 * locations-list.html`).
 *
 * WHY THIS FILE EXISTS RATHER THAN READING EVERYTHING FROM FRONTMATTER.
 * `/locations`'s `.work--loc` row list needs one thing no
 * `content/locations/*.mdx` field carries: a short differentiator line per
 * town (`.row__m`'s text before the distance `<em>`) — design-authored
 * microcopy, not derived from a structured field. Mirrors
 * `lib/service-card-meta.ts`'s `SERVICE_CARDS`, same rationale, same
 * citation style.
 *
 * The distance itself is NOT in this file — it is computed for real from
 * frontmatter `coordinates` by `lib/location-geo.ts`, never hardcoded here.
 */

/** `.row__m` differentiator text, one per real town — verbatim from
 *  `prototype/locations-list.html:174-205`. A real slug missing from this
 *  map falls back to a generic line (see `locations-list-page.tsx`) rather
 *  than crashing or inventing town-specific copy. */
export const LOCATION_ROW_META: Readonly<Record<string, string>> = {
  polegate: 'The studio is here, on Chaucer Business Park',
  hailsham: 'A market town with steady demand',
  eastbourne: 'One of the largest, busiest towns in the county',
  seaford: 'A smaller town with a much wider catchment',
  lewes: 'The county town, and a discerning market',
  uckfield: 'A town plus a ring of villages across the Weald',
  brighton: 'One of the most competitive markets in the south',
  hove: 'Its own search market, not an extension of Brighton',
};

/**
 * D2's h1 reframe, applied at render time to the real MDX `title` rather
 * than hand-typed per town — mirrors `service-card-meta.ts`'s
 * `displayTitle`/`toFirstPersonSingular` precedent (a documented, mechanical
 * transform of real data, not invented copy). Every one of the 8 real
 * `content/locations/*.mdx` titles matches the literal pattern "Website
 * Design for Tradespeople in {Town}"
 * (`prototype/location-detail.html:118-119`'s own citation of
 * `brighton.mdx:2`); an unrecognised pattern is returned unchanged rather
 * than mangled, so a future content edit degrades safely instead of
 * crashing.
 */
export function toLocationDisplayTitle(rawTitle: string): string {
  const match = rawTitle.match(/^Website Design for Tradespeople in (.+)$/);
  return match ? `Website design in ${match[1]}` : rawTitle;
}

/**
 * The plain town name (e.g. "Brighton"), for row labels, the masthead
 * eyebrow and body copy that need the bare town rather than the full SEO
 * `title` string ("Website Design for Tradespeople in Brighton"). Derived
 * from the real `content/locations/*.mdx` filename slug rather than parsed
 * out of prose — safe because every one of the 8 real slugs is a
 * single-word town name (`brighton`, `eastbourne`, `hailsham`, `hove`,
 * `lewes`, `polegate`, `seaford`, `uckfield`).
 */
export function toTownNameFromSlug(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export interface FrontmatterBreadcrumb {
  title: string;
  href: string;
}

/**
 * Collapses consecutive duplicate entries in a location's own frontmatter
 * `breadcrumbs` array. `content/locations/brighton.mdx:21-25` lists
 * "Locations" twice (the only one of the 8 with the duplicate — a known,
 * confirmed content bug scoped to Phase 4, agent 4c, NOT fixed here), which
 * without this would render "Home / Locations / Locations / Brighton". This
 * is the graceful render-time workaround the Phase 3 brief asks for; the
 * MDX source itself is untouched.
 */
export function dedupeBreadcrumbs(raw: FrontmatterBreadcrumb[]): FrontmatterBreadcrumb[] {
  const out: FrontmatterBreadcrumb[] = [];
  for (const item of raw) {
    const prev = out[out.length - 1];
    if (prev && prev.title === item.title && prev.href === item.href) continue;
    out.push(item);
  }
  return out;
}

/** Oxford-less "A, B and C" join — the exact form
 *  `prototype/locations-list.html:231`'s "Hailsham, Eastbourne and Seaford"
 *  uses. Small and local rather than imported from
 *  `components/projects/project-detail-page.tsx`'s private copy of the same
 *  helper, matching how that file keeps its own rather than sharing one. */
export function joinWithAnd(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
