import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createContactHandler } from "../api/contact-route";
import { generateCsrfToken } from "../security/csrf";
import { SPAM_PRESETS } from "../api/spam-score";

/**
 * Spam tagging is opt-in, and this proves it for the nine client sites that
 * have NOT opted in.
 *
 * DCS is the only site with `spamTagging` configured. Every other site's
 * contact route calls this same factory, so a change here reaches all of them:
 * if tagging ever became the default, ten clients' notification subjects would
 * change without anyone asking. That is the regression this guards.
 *
 * The message used is the real pitch DCS received, anonymised — one that scores
 * 17 against a threshold of 5. If tagging were on, it could not fail to fire,
 * so an unchanged subject here is meaningful rather than vacuous.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const UNAMBIGUOUS_SPAM =
  "Hello Team, Hope you are doing well and staying safe!! I provide high-quality guest posting " +
  "and link-building services. I have access to high-authority websites with strong DA, DR, and " +
  "organic traffic. Our placements include permanent, do-follow links. Please let me know if " +
  "you are interested, and I will send over our site lists for your review.";

const BASE_CONFIG = {
  siteSlug: "test-site",
  businessName: "Test Business",
  businessEmail: "owner@example.com",
  fromEmail: "noreply@example.com",
  // Values are irrelevant to this suite — it asserts on the subject line, not
  // on colour. Kept as CSS variables rather than hex so the fixture does not
  // trip the repo's no-raw-hex rule, which exists to protect white-labelling.
  themeColors: {
    brandPrimary: "var(--color-brand-primary)",
    textPrimary: "var(--color-surface-foreground)",
    background: "var(--color-surface-muted)",
    textMuted: "var(--color-surface-muted-foreground)",
  },
  rateLimit: false,
};

describe("createContactHandler — spam tagging is opt-in", () => {
  let sent: Array<{ subject: string; html: string }>;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    sent = [];
    originalFetch = global.fetch;
    vi.stubEnv("RESEND_API_KEY", "re_test_key_not_real");

    global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url !== RESEND_ENDPOINT) throw new Error(`unexpected outbound fetch: ${url}`);
      sent.push(JSON.parse(init?.body as string));
      return new Response(JSON.stringify({ id: "test-id" }), { status: 200 });
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  async function post(handler: (r: Request) => Promise<Response>) {
    const response = await handler(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": generateCsrfToken() },
        body: JSON.stringify({
          name: "Sender",
          email: "digitalstrategist.pg@example.com",
          phone: "+91 90000 00000",
          message: UNAMBIGUOUS_SPAM,
          website: "",
        }),
      })
    );
    expect(response.status).toBe(200);
    return sent[0];
  }

  it("a site with no spamTagging config never tags, even on unambiguous spam", async () => {
    const notification = await post(createContactHandler(BASE_CONFIG));

    expect(notification.subject).not.toContain("[SPAM?]");
    expect(notification.subject).toMatch(/^New Contact:/);
    expect(notification.html).not.toMatch(/Tagged as likely spam/);
  });

  it("the same submission IS tagged once a site opts in — so the assertion above has teeth", async () => {
    const notification = await post(
      createContactHandler({
        ...BASE_CONFIG,
        spamTagging: { preset: SPAM_PRESETS.ProfessionalService, rules: {} },
      })
    );

    expect(notification.subject).toContain("[SPAM?]");
  });
});
