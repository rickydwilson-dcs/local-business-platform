/**
 * Base SiteConfig interface for the Local Business Platform.
 *
 * All site `site.config.ts` files MUST satisfy this interface. It defines
 * the minimum set of fields that platform-level code (rate limiter,
 * analytics, deployment tooling) depends on.
 *
 * Individual sites extend this with their own site-specific fields
 * (navigation, credentials, services, etc.) by declaring a local
 * `SiteConfig` interface that includes these base fields.
 *
 * The `slug` field is critical for multi-tenant rate limiting -- it
 * isolates rate-limit counters per site in the shared Supabase database.
 */

/**
 * Minimum site configuration required by platform-level code.
 *
 * Sites import this as `BaseSiteConfig` and extend it with their own
 * fields. The `slug` field is enforced at both compile time (TypeScript)
 * and runtime (rate limiter validation).
 */
export interface BaseSiteConfig {
  /** Unique site identifier used for rate limiting isolation.
   *  Must match the site's directory name (e.g., "colossus-reference"). */
  slug: string;

  /** Display name of the site / business. */
  name: string;

  /** Production domain (e.g., "smithselectrical.co.uk"). */
  domain: string;
}
