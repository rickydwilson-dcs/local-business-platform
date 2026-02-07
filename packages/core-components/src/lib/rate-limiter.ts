import { Redis } from "@upstash/redis";

// Initialize Redis client using Upstash-provided environment variables
// In test/development environments without Redis, rate limiting is disabled
const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 300; // 5 minutes in seconds
const RATE_LIMIT_MAX = 5; // 5 requests per window

export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  // If Redis is not configured, allow all requests (test/development mode)
  if (!redis) {
    console.log("[Rate Limiter] Redis not configured - allowing request (test/dev mode)");
    return { allowed: true };
  }

  const key = `rate-limit:contact:${ip}`;

  try {
    // Get current count
    const current = await redis.get<number>(key);

    if (current === null) {
      // First request in window - set counter to 1 with expiration
      await redis.set(key, 1, { ex: RATE_LIMIT_WINDOW });
      return { allowed: true };
    }

    if (current >= RATE_LIMIT_MAX) {
      // Rate limit exceeded - get TTL for retry-after header
      const ttl = await redis.ttl(key);
      return {
        allowed: false,
        retryAfter: ttl > 0 ? ttl : RATE_LIMIT_WINDOW,
      };
    }

    // Increment counter
    await redis.incr(key);
    return { allowed: true };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open - allow request if Redis fails (graceful degradation)
    return { allowed: true };
  }
}
