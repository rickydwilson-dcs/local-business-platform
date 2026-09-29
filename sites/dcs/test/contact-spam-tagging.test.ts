import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST as contactPOST } from '../app/api/contact/route';
import { generateCsrfToken } from '@platform/core-components/lib/security/csrf';

/**
 * End-to-end check that spam tagging is actually WIRED, not merely implemented.
 *
 * `packages/core-components/src/lib/__tests__/spam-score.test.ts` calibrates the
 * scorer against a labelled corpus. That is a different question from whether
 * this site's route passes its preset through, and whether the verdict reaches
 * the subject line Resend is given. A scorer that is never called would pass
 * every test over there and change nothing in the inbox.
 *
 * So this drives the real DCS handler with a real CSRF token, stubs only the
 * Resend endpoint, and reads the exact JSON that would have gone out.
 *
 * The deliverability invariant matters as much as the tagging: a flagged
 * submission must still be sent, still carry its `reply_to`, and still produce
 * a customer confirmation. Tagging is advisory. If a future change starts
 * dropping flagged mail, these assertions fail.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

interface ResendPayload {
  to: string;
  subject: string;
  html: string;
  reply_to?: string;
}

/** The real pitch that reached this inbox on 29 September 2026, anonymised. */
const SPAM_MESSAGE =
  'Hello Team, Hope you are doing well and staying safe!! I provide high-quality guest posting ' +
  'and link-building services designed to boost your SEO performance. I have access to ' +
  'high-authority websites with strong DA, DR, and organic traffic. Our placements include ' +
  'permanent, do-follow links. I would love to support your business promotion projects. ' +
  'Please let me know if you are interested, and I will send over our site lists for your review.';

/** A DCS customer using the same vocabulary to ASK rather than to offer. */
const GENUINE_MESSAGE =
  "Hi, I hope you're well. We run a small joinery in Bexhill and we'd like more organic traffic " +
  'to the site, plus better SERP positions for our main services. Can you tell us what that ' +
  'would cost?';

describe('/api/contact — spam tagging on the outbound payload', () => {
  let sent: ResendPayload[];
  let originalFetch: typeof fetch;

  beforeEach(() => {
    sent = [];
    originalFetch = global.fetch;

    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('SUPABASE_SERVICE_KEY', '');
    vi.stubEnv('RESEND_API_KEY', 're_test_key_not_real');

    global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url !== RESEND_ENDPOINT) throw new Error(`unexpected outbound fetch: ${url}`);
      sent.push(JSON.parse(init?.body as string) as ResendPayload);
      return new Response(JSON.stringify({ id: 'test-message-id' }), { status: 200 });
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  async function submit(message: string, email: string, phone: string | null) {
    const response = await contactPOST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': generateCsrfToken() },
        body: JSON.stringify({
          name: 'Test Sender',
          email,
          phone: phone ?? '',
          message,
          website: '',
        }),
      })
    );
    expect(response.status).toBe(200);
    expect(sent).toHaveLength(2);
    return { notification: sent[0], confirmation: sent[1] };
  }

  it('prefixes the notification subject when a submission scores as spam', async () => {
    const { notification } = await submit(
      SPAM_MESSAGE,
      'digitalstrategist.pg@example.com',
      '+91 90000 00000'
    );

    expect(notification.subject).toMatch(/^\[SPAM\?\] New Contact:/);
    // The body explains the verdict rather than tagging silently.
    expect(notification.html).toMatch(/Tagged as likely spam/);
    expect(notification.html).toMatch(/A guess, not a verdict/);
  });

  it('still delivers a flagged submission in full — tagging is advisory, never a block', async () => {
    const { notification, confirmation } = await submit(
      SPAM_MESSAGE,
      'digitalstrategist.pg@example.com',
      '+91 90000 00000'
    );

    // The whole message is present, not truncated or withheld.
    expect(notification.html).toContain('guest posting');
    expect(notification.html).toContain('site lists for your review');
    // Reply-To is unaffected by the verdict.
    expect(notification.reply_to).toBe('digitalstrategist.pg@example.com');
    // The sender still gets their confirmation.
    expect(confirmation.to).toBe('digitalstrategist.pg@example.com');
  });

  it('leaves a genuine enquiry untagged, even using the vocabulary DCS sells on', async () => {
    const { notification } = await submit(
      GENUINE_MESSAGE,
      'hello@a-real-joinery.example.com',
      '07000 000005'
    );

    expect(notification.subject).toMatch(/^New Contact:/);
    expect(notification.subject).not.toContain('[SPAM?]');
    expect(notification.html).not.toMatch(/Tagged as likely spam/);
  });

  it("the site's ProfessionalService preset is actually applied, not just configured", async () => {
    // This message only stays clean because the preset exempts the SEO
    // vocabulary. If the preset stopped reaching the scorer, it would flag.
    const { notification } = await submit(
      GENUINE_MESSAGE,
      'hello@a-real-joinery.example.com',
      '07000 000005'
    );
    expect(notification.subject).not.toContain('[SPAM?]');

    // And the offer grammar the preset does NOT exempt still fires, proving the
    // preset narrows the rules rather than disabling them.
    sent.length = 0;
    const { notification: pitch } = await submit(
      'I would like to send you a proposal for your website. If you are interested, I can send ' +
        'over our pricing.',
      'someone@example.com',
      null
    );
    expect(pitch.subject).toContain('[SPAM?]');
  });
});
