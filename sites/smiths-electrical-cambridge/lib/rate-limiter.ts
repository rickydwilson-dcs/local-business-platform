/**
 * Rate Limiter Stub
 *
 * This is a stub implementation for the base template.
 * Rate limiting is disabled by default and all requests are allowed.
 *
 * To enable rate limiting:
 * 1. Install packages: npm install @upstash/ratelimit @upstash/redis
 * 2. Set environment variables: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * 3. Replace this file with the full implementation from colossus-reference
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
