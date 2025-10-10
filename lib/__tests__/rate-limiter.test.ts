import { describe, it, expect, vi, beforeEach } from "vitest";

// Set environment variables BEFORE importing (rate limiter checks at module load)
process.env.KV_REST_API_URL = "https://test-redis.upstash.io";
process.env.KV_REST_API_TOKEN = "test-token";

// Create mock functions
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockIncr = vi.fn();
const mockTtl = vi.fn();

// Mock Upstash Redis BEFORE importing
vi.mock("@upstash/redis", async () => {
  return {
    Redis: vi.fn().mockImplementation(() => ({
      get: mockGet,
      set: mockSet,
      incr: mockIncr,
      ttl: mockTtl,
    })),
  };
});

// Import after setting up mocks and env vars
const { checkRateLimit } = await import("../rate-limiter");

describe("Rate Limiter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("First request", () => {
    it("should allow first request from new IP", async () => {
      mockGet.mockResolvedValue(null);

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
      expect(mockSet).toHaveBeenCalledWith("rate-limit:contact:192.168.1.1", 1, {
        ex: 300,
      });
    });
  });

  describe("Subsequent requests", () => {
    it("should allow requests under limit", async () => {
      mockGet.mockResolvedValue(3); // 3 requests so far

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
      expect(mockIncr).toHaveBeenCalledWith("rate-limit:contact:192.168.1.1");
    });

    it("should block requests at limit", async () => {
      mockGet.mockResolvedValue(5); // Already at limit
      mockTtl.mockResolvedValue(240); // 4 minutes remaining

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBe(240);
      expect(mockIncr).not.toHaveBeenCalled();
    });

    it("should block requests over limit", async () => {
      mockGet.mockResolvedValue(10); // Way over limit
      mockTtl.mockResolvedValue(120);

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBe(120);
    });
  });

  describe("TTL handling", () => {
    it("should use TTL for retry-after when available", async () => {
      mockGet.mockResolvedValue(5);
      mockTtl.mockResolvedValue(180);

      const result = await checkRateLimit("192.168.1.1");

      expect(result.retryAfter).toBe(180);
    });

    it("should fallback to window duration if TTL invalid", async () => {
      mockGet.mockResolvedValue(5);
      mockTtl.mockResolvedValue(-1); // Invalid TTL

      const result = await checkRateLimit("192.168.1.1");

      expect(result.retryAfter).toBe(300); // Default window
    });
  });

  describe("IP isolation", () => {
    it("should track different IPs separately", async () => {
      mockGet.mockResolvedValue(null);

      await checkRateLimit("192.168.1.1");
      await checkRateLimit("192.168.1.2");

      expect(mockSet).toHaveBeenCalledWith("rate-limit:contact:192.168.1.1", 1, {
        ex: 300,
      });
      expect(mockSet).toHaveBeenCalledWith("rate-limit:contact:192.168.1.2", 1, {
        ex: 300,
      });
    });
  });

  describe("Error handling", () => {
    it("should fail open when Redis errors", async () => {
      mockGet.mockRejectedValue(new Error("Redis connection failed"));

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it("should fail open when Redis times out", async () => {
      mockGet.mockRejectedValue(new Error("ETIMEDOUT"));

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle exactly at limit (5th request)", async () => {
      mockGet.mockResolvedValue(4); // 4 requests so far, this is 5th

      const result = await checkRateLimit("192.168.1.1");

      expect(result.allowed).toBe(true);
      expect(mockIncr).toHaveBeenCalled();
    });

    it("should handle empty IP string", async () => {
      mockGet.mockResolvedValue(null);

      const result = await checkRateLimit("");

      expect(result.allowed).toBe(true);
      expect(mockSet).toHaveBeenCalledWith("rate-limit:contact:", 1, { ex: 300 });
    });

    it("should handle IPv6 addresses", async () => {
      mockGet.mockResolvedValue(null);

      const result = await checkRateLimit("2001:0db8:85a3:0000:0000:8a2e:0370:7334");

      expect(result.allowed).toBe(true);
      expect(mockSet).toHaveBeenCalledWith(
        "rate-limit:contact:2001:0db8:85a3:0000:0000:8a2e:0370:7334",
        1,
        { ex: 300 }
      );
    });
  });
});
