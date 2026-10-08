import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createContactHandler } from "../api/contact-route";
import { generateCsrfToken } from "../security/csrf";

/**
 * Bot defences on the shared contact handler.
 *
 * The "junk" fixture is the shape of the real wave that hit Colossus in
 * October 2026 (random-letter name and subject, a ten-digit number as the
 * message) with every value regenerated — no real person's data is committed.
 *
 * Only two outbound hosts are stubbed, so an unexpected call throws instead of
 * silently passing: Resend (assert on what was actually sent) and Cloudflare's
 * siteverify (assert on what was actually asked).
 */

const RESEND = "https://api.resend.com/emails";
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const CONFIG = {
  siteSlug: "test-site",
  businessName: "Test Business",
  businessEmail: "owner@example.com",
  fromEmail: "noreply@example.com",
  themeColors: {
    brandPrimary: "var(--color-brand-primary)",
    textPrimary: "var(--color-surface-foreground)",
    background: "var(--color-surface-muted)",
    textMuted: "var(--color-surface-muted-foreground)",
  },
  rateLimit: false,
};

const GENUINE = {
  name: "Sam Taylor",
  email: "sam@example.com",
  phone: "07700 900123",
  message: "Can you quote for scaffolding on a two storey semi in Hastings?",
};

const JUNK = {
  name: "Qwxzt Plmbrk",
  email: "qwxzt.plmbrk@example.com",
  phone: "5551234567",
  subject: "aBcDeFgHiJkLmNoPqR",
  message: "8310916268",
};

describe("createContactHandler — bot defences", () => {
  let resendCalls: Array<{ subject: string; to: string[] }>;
  let siteverifyCalls: URLSearchParams[];
  let siteverifyImpl: () => Response | Promise<Response>;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    resendCalls = [];
    siteverifyCalls = [];
    siteverifyImpl = () => Response.json({ success: true, "error-codes": [] });
    originalFetch = global.fetch;
    vi.stubEnv("RESEND_API_KEY", "re_test_key_not_real");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");

    global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url === RESEND) {
        resendCalls.push(JSON.parse(init?.body as string));
        return new Response(JSON.stringify({ id: "test-id" }), { status: 200 });
      }
      if (url === SITEVERIFY) {
        siteverifyCalls.push(init?.body as URLSearchParams);
        return siteverifyImpl();
      }
      throw new Error(`unexpected outbound fetch: ${url}`);
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  function post(body: Record<string, unknown>) {
    return createContactHandler(CONFIG)(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": generateCsrfToken() },
        body: JSON.stringify(body),
      })
    );
  }

  describe("junk content (needs no keys)", () => {
    it("answers success but sends nothing — no notification and no confirmation to the bot's address", async () => {
      const res = await post(JUNK);
      expect(res.status).toBe(200);
      expect((await res.json()).success).toBe(true);
      expect(resendCalls).toHaveLength(0);
    });

    it("still delivers a genuine enquiry, including one that is mostly a phone number", async () => {
      expect((await post(GENUINE)).status).toBe(200);
      expect((await post({ ...GENUINE, message: "Call me on 07700 900123" })).status).toBe(200);
      expect(resendCalls.length).toBe(4); // notification + confirmation, twice
    });

    it("an empty message is still a validation error, not a silent drop", async () => {
      expect((await post({ ...GENUINE, message: "" })).status).toBe(422);
    });
  });

  describe("Turnstile", () => {
    beforeEach(() => vi.stubEnv("TURNSTILE_SECRET_KEY", "0x_test_secret_not_real"));

    it("is not enforced on a site with no secret configured (rollout is per-site)", async () => {
      vi.stubEnv("TURNSTILE_SECRET_KEY", "");
      expect((await post(GENUINE)).status).toBe(200);
      expect(siteverifyCalls).toHaveLength(0);
    });

    it("rejects a submission with no token, sends nothing, never asks Cloudflare", async () => {
      const res = await post(GENUINE);
      expect(res.status).toBe(403);
      expect(resendCalls).toHaveLength(0);
      expect(siteverifyCalls).toHaveLength(0);
    });

    it("posts secret and token to siteverify, and delivers when Cloudflare says success", async () => {
      const res = await post({ ...GENUINE, turnstileToken: "tok_abc" });
      expect(res.status).toBe(200);
      expect(siteverifyCalls[0].get("secret")).toBe("0x_test_secret_not_real");
      expect(siteverifyCalls[0].get("response")).toBe("tok_abc");
      expect(resendCalls.length).toBe(2);
    });

    it("does not leak the token into the emailed extra fields", async () => {
      await post({ ...GENUINE, turnstileToken: "tok_abc" });
      expect(JSON.stringify(resendCalls)).not.toContain("tok_abc");
    });

    it("rejects when Cloudflare says the token is bad or already used", async () => {
      siteverifyImpl = () =>
        Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] });
      const res = await post({ ...GENUINE, turnstileToken: "tok_replayed" });
      expect(res.status).toBe(403);
      expect(resendCalls).toHaveLength(0);
    });

    it("fails OPEN when Cloudflare is unreachable — an outage must not take the lead form down", async () => {
      siteverifyImpl = () => {
        throw new Error("network down");
      };
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect((await post({ ...GENUINE, turnstileToken: "tok_abc" })).status).toBe(200);
    });

    it("fails open on a misconfigured secret rather than locking out every customer", async () => {
      siteverifyImpl = () =>
        Response.json({ success: false, "error-codes": ["invalid-input-secret"] });
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect((await post({ ...GENUINE, turnstileToken: "tok_abc" })).status).toBe(200);
    });

    it("junk is dropped before Cloudflare is called, saving a round trip per bot", async () => {
      await post({ ...JUNK, turnstileToken: "tok_abc" });
      expect(siteverifyCalls).toHaveLength(0);
    });
  });
});
