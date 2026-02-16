/**
 * Supabase-backed Rate Limiter
 *
 * Uses the `rate_limits` table and `increment_rate_limit` RPC function
 * for atomic, fixed-window rate limiting. Fails open (allows requests)
 * when Supabase is unavailable or not configured.
 *
 * Multi-tenant behaviour:
 *   - `siteSlug` is REQUIRED for per-site rate limit isolation.
 *   - In production, a missing `siteSlug` will **fail closed** (block the
 *     request) to prevent accidental cross-site rate limit pollution.
 *   - In development, a missing `siteSlug` will **fail open** with a
 *     console warning so local dev is not disrupted.
 *
 * Usage (colossus pattern -- direct check):
 *   import { checkRateLimit } from '@platform/core-components/lib/rate-limiter';
 *   const result = await checkRateLimit(ip, { siteSlug: siteConfig.slug });
 *   if (!result.allowed) return Response(429);
 *
 * Usage (base-template/smiths pattern -- middleware wrapper):
 *   import { rateLimitMiddleware } from '@platform/core-components/lib/rate-limiter';
 *   const response = await rateLimitMiddleware(ip, { siteSlug: siteConfig.slug });
 *   if (response) return response; // 429
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitOptions {
  endpoint?: string;
  maxRequests?: number;
  windowSeconds?: number;
  siteSlug?: string;
}

export interface RateLimitCheckResult {
  allowed: boolean;
  retryAfter?: number;
  error?: string;
}

// Legacy interface kept for backward-compatible imports
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

// ---------------------------------------------------------------------------
// Supabase client (lazy singleton)
// ---------------------------------------------------------------------------

let _supabase: SupabaseClient | null | undefined;

function getSupabase(): SupabaseClient | null {
  if (_supabase !== undefined) return _supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    _supabase = null;
    return null;
  }

  _supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabase;
}

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

const DEFAULTS = {
  endpoint: "/api/contact",
  maxRequests: 5,
  windowSeconds: 300,
} as const;

export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitCheckResult> {
  // -------------------------------------------------------------------------
  // Runtime validation: siteSlug must be present for multi-tenant isolation
  // -------------------------------------------------------------------------
  const siteSlug = options.siteSlug?.trim() || "";

  if (!siteSlug) {
    if (process.env.NODE_ENV === "production") {
      console.error("[Rate Limiter] CRITICAL: Missing siteSlug in production - failing closed", {
        identifier,
        endpoint: options.endpoint ?? DEFAULTS.endpoint,
        timestamp: new Date().toISOString(),
      });
      return {
        allowed: false,
        remaining: 0,
        error: "Configuration error: missing site identifier",
      } as RateLimitCheckResult;
    } else {
      console.warn("[Rate Limiter] Missing siteSlug in development - allowing request");
      return { allowed: true };
    }
  }

  // -------------------------------------------------------------------------
  // Supabase availability check
  // -------------------------------------------------------------------------
  const supabase = getSupabase();

  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Rate Limiter] Supabase not configured - allowing request");
    }
    return { allowed: true };
  }

  // -------------------------------------------------------------------------
  // Rate limit check via Supabase RPC
  // -------------------------------------------------------------------------
  const {
    endpoint = DEFAULTS.endpoint,
    maxRequests = DEFAULTS.maxRequests,
    windowSeconds = DEFAULTS.windowSeconds,
  } = options;

  try {
    const now = new Date();
    const windowMs = windowSeconds * 1000;
    const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
    const windowEnd = new Date(windowStart.getTime() + windowMs);

    const { data, error } = await supabase.rpc("increment_rate_limit", {
      p_identifier: identifier,
      p_endpoint: endpoint,
      p_site_slug: siteSlug,
      p_window_start: windowStart.toISOString(),
      p_window_end: windowEnd.toISOString(),
      p_max_requests: maxRequests,
    });

    if (error) throw error;

    if (!data.allowed) {
      const retryAfter = Math.ceil((windowEnd.getTime() - now.getTime()) / 1000);

      // Structured logging for rate limit denials
      console.log("[Rate Limiter] Request denied", {
        siteSlug,
        identifier,
        endpoint,
        requestCount: data.request_count,
        maxRequests,
        timestamp: new Date().toISOString(),
      });

      return { allowed: false, retryAfter };
    }

    return { allowed: true };
  } catch (err) {
    console.error("[Rate Limiter] Error:", err);
    return { allowed: true };
  }
}

// ---------------------------------------------------------------------------
// Middleware wrapper (returns Response | null)
// ---------------------------------------------------------------------------

export async function rateLimitMiddleware(
  identifier: string,
  options?: RateLimitOptions
): Promise<Response | null> {
  const result = await checkRateLimit(identifier, options);

  if (!result.allowed) {
    const body = result.error
      ? { error: result.error }
      : { error: "Too many requests. Please try again later.", retryAfter: result.retryAfter };

    return new Response(JSON.stringify(body), {
      status: result.error ? 503 : 429,
      headers: {
        "Content-Type": "application/json",
        ...(result.retryAfter ? { "Retry-After": result.retryAfter.toString() } : {}),
      },
    });
  }

  return null;
}
