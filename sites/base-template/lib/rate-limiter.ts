/**
 * Rate Limiter Stub
 *
 * This is a stub implementation for the base template.
 * Rate limiting is disabled by default and all requests are allowed.
 *
 * TODO: Replace this stub with Supabase-based rate limiting.
 * The colossus-reference site currently uses Upstash Redis but this is being
 * migrated to Supabase to simplify infrastructure (Redis keep-alive was unreliable).
 * Use a Supabase table with TTL-based cleanup for rate-limit counters.
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier
 * Stub implementation - always allows requests
 */
export async function checkRateLimit(_identifier: string): Promise<RateLimitResult> {
  return {
    success: true,
    remaining: 999,
    reset: 0,
  };
}

/**
 * Rate limit middleware for API routes
 * Stub implementation - always returns null (allow request)
 */
export async function rateLimitMiddleware(_identifier: string): Promise<Response | null> {
  return null;
}
