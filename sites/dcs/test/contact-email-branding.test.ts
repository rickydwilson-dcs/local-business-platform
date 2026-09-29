import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST as contactPOST } from '../app/api/contact/route';
import { generateCsrfToken } from '@platform/core-components/lib/security/csrf';
import { BUSINESS_EMAIL } from '../lib/contact-info';

/**
 * Guards two things about the mail `/api/contact` actually hands to Resend,
 * both of which fail *silently* — nothing throws, nothing logs, the form still
 * returns `{ success: true }`, and the only way to notice is to receive one of
 * the emails and look at it.
 *
 *  1. Reply-to. Resend's REST API field is snake_case `reply_to`. The factory
 *     used to send camelCase `replyTo`, which the API drops as an unknown key —
 *     so replying to an enquiry notification went to the `from` noreply address
 *     instead of to the person who filled the form.
 *
 *  2. Brand. The email template can't read the site's CSS custom properties, so
 *     `app/api/contact/route.ts` resolves the r9 palette to hex at call time.
 *     Passing `colors.brand.*` instead (still the pre-r9 solaris teal, kept for
 *     the inner routes that haven't been reskinned) silently ships off-brand mail.
 *
 * Resend is the only outbound fetch stubbed here; the real route handler, real
 * CSRF verification and real template rendering all run.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const R9 = {
  magenta: '#D6006B',
  ink: '#0E0E12',
  paper: '#ECEBE9',
  grey: '#70707B',
} as const;

/** The pre-r9 solaris brand primary still sitting in `colors.brand.primary`. */
const SOLARIS_TEAL = '#61A3BA';

const ENQUIRER_EMAIL = 'jane.enquirer@example.com';

interface ResendPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
  reply_to?: string;
  replyTo?: string;
}

describe('/api/contact — outbound Resend payload', () => {
  let sent: ResendPayload[];
  let originalFetch: typeof fetch;

  beforeEach(async () => {
    sent = [];
    originalFetch = global.fetch;

    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('SUPABASE_SERVICE_KEY', '');
    // A non-empty key is what takes sendContactEmail past its early return.
    // No real request is made: the fetch below never reaches the network.
    vi.stubEnv('RESEND_API_KEY', 're_test_key_not_real');

    global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url !== RESEND_ENDPOINT) {
        throw new Error(`unexpected outbound fetch in test: ${url}`);
      }
      sent.push(JSON.parse(init?.body as string) as ResendPayload);
      return new Response(JSON.stringify({ id: 'test-message-id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as typeof fetch;

    const response = await contactPOST(
      new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Real token from the same module the handler verifies against.
          'x-csrf-token': generateCsrfToken(),
        },
        body: JSON.stringify({
          name: 'Jane Enquirer',
          email: ENQUIRER_EMAIL,
          phone: '01234 567890',
          message: 'I would like a quote for a new site.',
          website: '',
        }),
      })
    );

    expect(response.status, 'the handler rejected a valid submission').toBe(200);
    // Business notification first, then the customer confirmation.
    expect(sent).toHaveLength(2);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("sets reply_to on the business notification to the enquirer, using Resend's snake_case field", () => {
    const notification = sent[0];

    expect(notification.to).toBe(BUSINESS_EMAIL);
    expect(notification.reply_to).toBe(ENQUIRER_EMAIL);
    // A camelCase key would be accepted by JSON.stringify and dropped by Resend.
    expect(
      Object.keys(notification),
      'camelCase replyTo is silently ignored by the Resend REST API'
    ).not.toContain('replyTo');
  });

  it('sets reply_to on the customer confirmation to the business, so a reply is not lost', () => {
    const confirmation = sent[1];

    expect(confirmation.to).toBe(ENQUIRER_EMAIL);
    expect(confirmation.reply_to).toBe(BUSINESS_EMAIL);
    expect(Object.keys(confirmation)).not.toContain('replyTo');
    // The footnote used to say "do not reply", which contradicts the header.
    expect(confirmation.html).not.toMatch(/do not reply/i);
  });

  it('brands both emails with the r9 palette, not the pre-r9 solaris teal', () => {
    for (const mail of sent) {
      expect(mail.html).toContain(R9.magenta);
      expect(mail.html).not.toContain(SOLARIS_TEAL);
    }

    const [notification, confirmation] = sent;
    // Headings, message panel and footnote all come from the r9 tokens.
    expect(notification.html).toContain(R9.ink);
    expect(notification.html).toContain(R9.paper);
    expect(notification.html).toContain(R9.grey);
    expect(confirmation.html).toContain(R9.grey);
  });
});
