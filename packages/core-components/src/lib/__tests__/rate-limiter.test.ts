import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock RPC function
const mockRpc = vi.fn();

// Mock @supabase/supabase-js BEFORE importing
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    rpc: mockRpc,
  })),
}));

// Set env vars so the client is created
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_KEY = "test-service-key";

// Import after mocks are set up
const { checkRateLimit, rateLimitMiddleware } = await import("../rate-limiter");

describe("Rate Limiter (Supabase)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkRateLimit", () => {
    it("should allow first request from new IP", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 1, allowed: true },
        error: null,
      });

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
      expect(mockRpc).toHaveBeenCalledWith(
        "increment_rate_limit",
        expect.objectContaining({
          p_identifier: "192.168.1.1",
          p_endpoint: "/api/contact",
          p_max_requests: 5,
        })
      );
    });

    it("should allow requests under limit", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 3, allowed: true },
        error: null,
      });

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
    });

    it("should allow the 5th request (at limit)", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 5, allowed: true },
        error: null,
      });

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
    });

    it("should block the 6th request (over limit)", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 6, allowed: false },
        error: null,
      });

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(300);
    });

    it("should block requests way over limit", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 50, allowed: false },
        error: null,
      });

      const result = await checkRateLimit("10.0.0.1");

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it("should fail open when Supabase RPC errors", async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: { message: "Connection refused", code: "PGRST301" },
      });

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
    });

    it("should fail open when RPC throws", async () => {
      mockRpc.mockRejectedValue(new Error("Network error"));

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
    });

    it("should track different IPs separately", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 1, allowed: true },
        error: null,
      });

      await checkRateLimit("192.168.1.1");
      await checkRateLimit("192.168.1.2");

      expect(mockRpc).toHaveBeenCalledTimes(2);
      expect(mockRpc).toHaveBeenCalledWith(
        "increment_rate_limit",
        expect.objectContaining({ p_identifier: "192.168.1.1" })
      );
      expect(mockRpc).toHaveBeenCalledWith(
        "increment_rate_limit",
        expect.objectContaining({ p_identifier: "192.168.1.2" })
      );
    });

    it("should handle IPv6 addresses", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 1, allowed: true },
        error: null,
      });

      const result = await checkRateLimit("2001:0db8:85a3:0000:0000:8a2e:0370:7334");

      expect(result.allowed).toBe(true);
      expect(mockRpc).toHaveBeenCalledWith(
        "increment_rate_limit",
        expect.objectContaining({
          p_identifier: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
        })
      );
    });

    it("should accept custom options", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 1, allowed: true },
        error: null,
      });

      await checkRateLimit("10.0.0.1", {
        endpoint: "/api/quote",
        maxRequests: 10,
        windowSeconds: 60,
        siteSlug: "smiths-electrical",
      });

      expect(mockRpc).toHaveBeenCalledWith(
        "increment_rate_limit",
        expect.objectContaining({
          p_identifier: "10.0.0.1",
          p_endpoint: "/api/quote",
          p_max_requests: 10,
          p_site_slug: "smiths-electrical",
        })
      );
    });
  });

  describe("rateLimitMiddleware", () => {
    it("should return null when request is allowed", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 1, allowed: true },
        error: null,
      });

      const response = await rateLimitMiddleware("192.168.1.1");

      expect(response).toBeNull();
    });

    it("should return 429 Response when rate limited", async () => {
      mockRpc.mockResolvedValue({
        data: { request_count: 6, allowed: false },
        error: null,
      });

      const response = await rateLimitMiddleware("192.168.1.1");

      expect(response).not.toBeNull();
      expect(response!.status).toBe(429);
      expect(response!.headers.get("Retry-After")).toBeTruthy();

      const body = await response!.json();
      expect(body.error).toBe("Too many requests. Please try again later.");
      expect(body.retryAfter).toBeGreaterThan(0);
    });

    it("should return null when Supabase errors (fail open)", async () => {
      mockRpc.mockRejectedValue(new Error("timeout"));

      const response = await rateLimitMiddleware("192.168.1.1");

      expect(response).toBeNull();
    });
  });
});
