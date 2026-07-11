/**
 * URL helpers for the Car Remaps catalogue.
 *
 * Relative paths only — the caller composes an absolute URL (e.g. for JSON-LD
 * or the MCP endpoint) using the site's existing `absUrl` helper
 * (`@/lib/site`) if one is needed downstream.
 */

/** Page URL for a make's model listing, e.g. `getMakePageUrl('bmw')` -> `/car-remaps/bmw`. */
export function getMakePageUrl(makeSlug: string): string {
  return `/car-remaps/${makeSlug}`;
}
