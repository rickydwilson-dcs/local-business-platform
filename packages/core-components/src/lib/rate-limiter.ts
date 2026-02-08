/**
 * Supabase-backed Rate Limiter
 *
 * Uses the `rate_limits` table and `increment_rate_limit` RPC function
 * for atomic, fixed-window rate limiting. Fails open (allows requests)
 * when Supabase is unavailable or not configured.
 *
 * Usage (colossus pattern — direct check):
 *   import { checkRateLimit } from '@platform/core-components/lib/rate-limiter';
 *   const result = await checkRateLimit(ip);
 *   if (!result.allowed) return Response(429);
 *
 * Usage (base-template/smiths pattern — middleware wrapper):
 *   import { rateLimitMiddleware } from '@platform/core-components/lib/rate-limiter';
 *   const response = await rateLimitMiddleware(ip);
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
  const supabase = getSupabase();

  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Rate Limiter] Supabase not configured — allowing request");
    }
    return { allowed: true };
  }

  const {
    endpoint = DEFAULTS.endpoint,
    maxRequests = DEFAULTS.maxRequests,
    windowSeconds = DEFAULTS.windowSeconds,
    siteSlug = null,
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
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": result.retryAfter?.toString() || "300",
        },
      }
    );
  }

  return null;
}
