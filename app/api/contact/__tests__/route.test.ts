import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

// Mock rate limiter
vi.mock("@/lib/rate-limiter", () => ({
  checkRateLimit: vi.fn(() => Promise.resolve({ allowed: true })),
}));

// Mock Resend
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn(() => Promise.resolve({ id: "test-id" })),
    },
  })),
}));

describe("Contact API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validation", () => {
    it("should reject empty request body", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.error).toBe("Validation failed");
      expect(data.details).toContain("Name is required.");
      expect(data.details).toContain("Email is required.");
      expect(data.details).toContain("Message is required.");
    });

    it("should reject invalid email format", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "invalid-email",
          message: "Test message",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.details).toContain("Email format looks invalid.");
    });

    it("should reject missing name", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "",
          email: "test@example.com",
          message: "Test message",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.details).toContain("Name is required.");
    });

    it("should reject missing message", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          message: "",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(data.details).toContain("Message is required.");
    });
  });

  describe("Valid submissions", () => {
    it("should accept valid contact form with required fields only", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          message: "I need scaffolding for my project.",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("received");
    });

    it("should accept valid contact form with all optional fields", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Jane Smith",
          email: "jane@example.com",
          message: "Need quote for commercial scaffolding",
          phone: "01424 466 661",
          subject: "Commercial Quote",
          service: "commercial-scaffolding",
          location: "brighton",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toContain("received");
    });

    it("should trim whitespace from inputs", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "  John Doe  ",
          email: "  JOHN@EXAMPLE.COM  ",
          message: "  Test message  ",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it("should convert email to lowercase", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "TEST@EXAMPLE.COM",
          message: "Test message",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe("Email formats", () => {
    it("should accept standard email", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test",
          email: "test@example.com",
          message: "Message",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("should accept email with dots", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test",
          email: "test.user@example.com",
          message: "Message",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("should accept email with plus sign", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test",
          email: "test+tag@example.com",
          message: "Message",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it("should reject email without @", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test",
          email: "testexample.com",
          message: "Message",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(422);
    });

    it("should reject email without domain", async () => {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "Test",
          email: "test@",
          message: "Message",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(422);
    });
  });
});
