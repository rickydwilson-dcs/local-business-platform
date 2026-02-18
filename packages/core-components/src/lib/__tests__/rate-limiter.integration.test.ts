import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock RPC with per-site counter simulation
//
// Instead of returning a fixed response, the mock tracks request counts
// keyed by "identifier|endpoint|site_slug" -- mimicking how the database
// UNIQUE constraint (identifier, endpoint, site_slug, window_start) would
// produce independent counters per site.
// ---------------------------------------------------------------------------

// Tracks request counts keyed by "identifier|endpoint|site_slug"
const requestCounts = new Map<string, number>();

const mockRpc = vi.fn(
  (
    _fnName: string,
    params: {
      p_identifier: string;
      p_endpoint: string;
      p_site_slug: string | null;
      p_window_start: string;
      p_window_end: string;
      p_max_requests: number;
    }
  ) => {
    const key = `${params.p_identifier}|${params.p_endpoint}|${params.p_site_slug}`;
    const current = (requestCounts.get(key) ?? 0) + 1;
    requestCounts.set(key, current);

    const allowed = current <= params.p_max_requests;
    return Promise.resolve({
      data: { request_count: current, allowed },
      error: null,
    });
  }
);

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
  })),
}));

// Set env vars so the Supabase client is created
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_KEY = "test-service-key";

// Import after mocks are set up
const { checkRateLimit } = await import("../rate-limiter");

// ---------------------------------------------------------------------------
// Integration tests: multi-tenant rate limiting
// ---------------------------------------------------------------------------

describe("Multi-tenant rate limiting integration", () => {
  const testIP = "203.0.113.99";

  beforeEach(() => {
    vi.clearAllMocks();
    requestCounts.clear();
  });

  it("should isolate rate limits per site", async () => {
    // Exhaust dj-fox's rate limit (5 requests)
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(testIP, {
        siteSlug: "dj-fox-electrical",
        maxRequests: 5,
      });
    }

    // dj-fox's 6th request should be blocked
    const djFoxBlocked = await checkRateLimit(testIP, {
      siteSlug: "dj-fox-electrical",
      maxRequests: 5,
    });
    expect(djFoxBlocked.allowed).toBe(false);
    expect(djFoxBlocked.retryAfter).toBeGreaterThan(0);

    // Colossus should NOT be blocked for the same IP (independent counter)
    const colossusAllowed = await checkRateLimit(testIP, {
      siteSlug: "colossus-reference",
      maxRequests: 5,
    });
    expect(colossusAllowed.allowed).toBe(true);
    expect(colossusAllowed.retryAfter).toBeUndefined();

    // Verify the RPC received distinct site slugs proving isolation
    const djFoxCalls = mockRpc.mock.calls.filter(
      ([, params]) => params.p_site_slug === "dj-fox-electrical"
    );
    const colossusCalls = mockRpc.mock.calls.filter(
      ([, params]) => params.p_site_slug === "colossus-reference"
    );
    expect(djFoxCalls).toHaveLength(6); // 5 allowed + 1 blocked
    expect(colossusCalls).toHaveLength(1); // 1 allowed
  });

  it("should fail closed when siteSlug is missing in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    try {
      const result = await checkRateLimit(testIP, {
        // Deliberately omitting siteSlug
      });

      // In production, missing siteSlug must fail closed (deny the request)
      expect(result.allowed).toBe(false);
      expect(result.error).toContain("missing site identifier");

      // The RPC should never have been called -- the guard returns early
      expect(mockRpc).not.toHaveBeenCalled();
    } finally {
      // Always restore NODE_ENV, even if assertions fail
      process.env.NODE_ENV = originalEnv;
    }
  });
});
