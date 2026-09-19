/**
 * Nearest-first ordering for `/locations`, computed from REAL data — the
 * haversine great-circle distance between each `content/locations/*.mdx`
 * file's own `coordinates` frontmatter block and the studio's own
 * coordinates — rather than a hardcoded town order.
 *
 * REFERENCE POINT. `site.config.ts`'s `business.geo` (50.8233, 0.2557) is the
 * platform's existing "home base" concept: it is the exact value already fed
 * into this site's `LocalBusiness` schema.org markup (`site.config.ts`'s
 * `schema.businessConfig.geo`) as the studio's registered address. It is
 * also, independently, `content/locations/polegate.mdx`'s own `coordinates`
 * block, byte-for-byte — Polegate IS where the studio is, so the two
 * "sources of truth" agree. Using `business.geo` rather than re-reading
 * `polegate.mdx` means the reference point survives even if a future edit
 * ever renamed or removed the Polegate location page.
 *
 * VERIFIED, NOT ASSUMED. The design session's own notes
 * (`output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/notes-g.md`
 * §5, "Data I computed") record the same eight distances computed the same
 * way, at R = 6371.0088 km converted to miles: Hailsham 3, Eastbourne 4,
 * Seaford 8, Lewes 11, Uckfield 12, Brighton 17, Hove 19. Re-run against the
 * real `content/locations/*.mdx` coordinates here (R = 3958.8 mi, computed
 * directly rather than km-then-converted) before writing this file and
 * confirmed to agree with that table to the mile on all eight real towns.
 */

import { siteConfig } from '@/site.config';

export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_MILES = 3958.8;

/** Great-circle distance between two points, in miles. */
export function haversineMiles(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(Math.min(1, h)));
}

if (!siteConfig.business.geo) {
  throw new Error(
    'site.config.ts business.geo is required to compute /locations nearest-first ordering'
  );
}

/** The studio's own coordinates — see this file's header for why this field,
 *  not a re-read of `polegate.mdx`, is the reference point. */
export const STUDIO_COORDINATES: LatLng = {
  lat: siteConfig.business.geo.latitude,
  lng: siteConfig.business.geo.longitude,
};

/**
 * Rounded whole-mile distance from the studio, or `null` when the given
 * coordinates ARE the studio's own (distance rounds to 0 — i.e. Polegate's
 * own page). Callers use `null` to render "Where I work from" instead of
 * "0 miles from the studio", matching the approved design's own treatment of
 * Polegate's row in `prototype/locations-list.html:174-177`.
 */
export function milesFromStudio(coords: LatLng): number | null {
  const miles = Math.round(haversineMiles(STUDIO_COORDINATES, coords));
  return miles === 0 ? null : miles;
}

/**
 * Parses a location's raw frontmatter `coordinates` block — an untyped
 * `{ lat, lng }` object (e.g. `content/locations/polegate.mdx:9-11`), not
 * validated by `LocationFrontmatterSchema` (which has an unrelated, unused
 * `coords` tuple field of its own) — into a `LatLng`.
 */
export function parseCoordinates(raw: unknown): LatLng | null {
  if (!raw || typeof raw !== 'object') return null;
  const { lat, lng } = raw as Record<string, unknown>;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
}

export interface LocationWithDistance<T> {
  location: T;
  /** `null` for the studio's own town — see `milesFromStudio`. */
  miles: number | null;
}

/**
 * Sorts real locations nearest-first by real haversine distance. Fails fast
 * (rather than silently mis-ordering) when a location is missing its
 * `coordinates` block — every one of the 8 real `content/locations/*.mdx`
 * files carries one, so this should never fire on real content.
 */
export function sortLocationsNearestFirst<T extends { slug: string; coordinates?: unknown }>(
  locations: readonly T[]
): LocationWithDistance<T>[] {
  const withDistance = locations.map((location) => {
    const coords = parseCoordinates(location.coordinates);
    if (!coords) {
      throw new Error(
        `content/locations/${location.slug}.mdx has no valid "coordinates" frontmatter block — required for nearest-first ordering`
      );
    }
    return { location, miles: milesFromStudio(coords) };
  });

  // The studio's own town (miles === null) sorts first, ahead of every real
  // distance — matching the approved design ("it puts the studio's own town
  // at the top", `prototype/locations-list.html:143-146`).
  return withDistance.sort((a, b) => (a.miles ?? -1) - (b.miles ?? -1));
}
