import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { ContactForm } from '../components/pages/ContactForm';
import { GET as csrfTokenGET } from '../app/api/csrf-token/route';
import { POST as contactPOST } from '../app/api/contact/route';

/**
 * Golden-fixture gate for Phase 4, row 4a
 * (`output/sessions/2026-09/2026-09-18_dcs-inner-pages-port/yolo-brief.md`):
 * "The contact form cannot receive an enquiry."
 *
 * This does NOT hand-write a synthetic payload. It renders the REAL
 * `ContactForm` client component (`components/pages/ContactForm.tsx`), fills
 * its REAL inputs via `fireEvent` (exactly what a visitor's keystrokes
 * produce), triggers a REAL submit, and captures the REAL
 * `fetch('/api/contact', ...)` call the component's own `handleSubmit`
 * makes — the exact method, headers and JSON body it emits, byte for byte.
 * That captured request is then replayed, unmodified, against the REAL
 * `POST` handler exported by `app/api/contact/route.ts` (the actual deployed
 * route for this site, imported directly — not a stand-in or a copy).
 *
 * What's stubbed, and why (fail-fast honesty per the brief's failure
 * contract — nothing here is silently weakened):
 *   - `global.fetch` is replaced for exactly two URLs: `/api/csrf-token`
 *     (proxied straight through to the REAL `GET` handler, so every CSRF
 *     token used below is genuinely produced by `generateCsrfToken()` and
 *     genuinely checked by `verifyCsrfToken()` inside the real
 *     `/api/contact` handler — CSRF is never bypassed, mocked, or
 *     disabled) and `/api/contact` (captured rather than actually sent, so
 *     this test can inspect the exact request before replaying it).
 *   - `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` (rate limiting) and
 *     `RESEND_API_KEY` (outbound email) are forced empty for the duration
 *     of each test. Both are documented fail-open/no-op paths in the real
 *     code when unset — not special-cased for this test:
 *     `packages/core-components/src/lib/rate-limiter.ts`'s `getSupabase()`
 *     returns `null` when the env vars are absent, which `checkRateLimit`
 *     turns into `{ allowed: true }`; `contact-route.ts`'s
 *     `sendContactEmail()` logs and returns `false` without making any
 *     network call when `RESEND_API_KEY` is absent, and the handler's
 *     `Response.json({ success: true, ... })` at the end is unconditional on
 *     that return value. Without this stub, running this test would read
 *     `sites/dcs/.env.local`'s real, committed Resend API key and Supabase
 *     service key — sending a real email and making a real Supabase RPC call
 *     on every test run, which also breaks the "offline, <5s" gate
 *     requirement. `CSRF_SECRET` is deliberately left untouched: whatever
 *     value is ambient (or the module's own lazily-generated per-process
 *     fallback) is fine, since token generation and verification both read
 *     the same cached module-level secret within this one test run.
 */

const CSRF_ENDPOINT = '/api/csrf-token';
const CONTACT_ENDPOINT = '/api/contact';

interface CapturedContactRequest {
  method: string;
  headers: Record<string, string>;
  body: string;
}

function headersToPlainObject(headers: HeadersInit | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!headers) return result;
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    for (const [key, value] of headers) result[key] = value;
    return result;
  }
  return { ...(headers as Record<string, string>) };
}

describe('/contact — real submission golden fixture (Phase 4, row 4a)', () => {
  let capturedContactRequests: CapturedContactRequest[];
  let originalFetch: typeof fetch;

  beforeEach(() => {
    capturedContactRequests = [];
    originalFetch = global.fetch;

    global.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url === CSRF_ENDPOINT) {
        // Real token issuance — the same factory-built handler
        // `sites/dcs/app/api/csrf-token/route.ts` exports as its real `GET`.
        return csrfTokenGET();
      }

      if (url === CONTACT_ENDPOINT) {
        capturedContactRequests.push({
          method: init?.method ?? 'GET',
          headers: headersToPlainObject(init?.headers),
          body: typeof init?.body === 'string' ? init.body : '',
        });
        // A plausible ack so ContactForm's own success/error branch has
        // something to react to. The real assertions happen later, by
        // replaying the captured request against the real handler below —
        // this response is never itself asserted on.
        return new Response(JSON.stringify({ success: true, message: 'mock ack' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      throw new Error(`ContactForm made an unexpected fetch call in test: ${url}`);
    }) as unknown as typeof fetch;

    vi.stubEnv('SUPABASE_URL', '');
    vi.stubEnv('SUPABASE_SERVICE_KEY', '');
    vi.stubEnv('RESEND_API_KEY', '');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  /**
   * Renders a fresh `<ContactForm />`, waits for its real mount-time CSRF
   * fetch to settle, fills the given fields (keyed by DOM id) via real
   * `fireEvent.change` calls, and submits. A fresh instance per call is
   * deliberate: CSRF tokens are single-use
   * (`packages/core-components/src/lib/security/csrf.ts`'s `usedTokens`
   * Set), so reusing one across two real handler calls in this suite would
   * 403 the second as a replay — a false failure unrelated to what each
   * test is actually checking.
   */
  async function renderFillAndSubmit(
    fields: Record<string, string>
  ): Promise<CapturedContactRequest> {
    const { container } = render(React.createElement(ContactForm));

    // Let the mount-time CSRF fetch — and its chained .json() / setState —
    // fully settle before interacting. A macrotask tick guarantees every
    // already-queued microtask (including React's state update) has run.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    for (const [id, value] of Object.entries(fields)) {
      const field = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
      if (!field) throw new Error(`renderFillAndSubmit: no field #${id} in the rendered form`);
      fireEvent.change(field, { target: { value } });
    }

    const form = container.querySelector<HTMLFormElement>('#cform');
    if (!form) throw new Error('renderFillAndSubmit: #cform not found in the rendered output');

    const before = capturedContactRequests.length;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(capturedContactRequests.length).toBeGreaterThan(before);
    });

    return capturedContactRequests[capturedContactRequests.length - 1];
  }

  it('a real filled-in submission is captured with a JSON body, a real x-csrf-token header, and an empty honeypot', async () => {
    const captured = await renderFillAndSubmit({
      'c-name': 'Jane Test',
      'c-email': 'jane@example.com',
      'c-message': 'Real recorded test submission — not hand-written JSON.',
    });

    expect(captured.method).toBe('POST');
    expect(captured.headers['Content-Type'] ?? captured.headers['content-type']).toMatch(
      /application\/json/
    );

    const csrfHeader = captured.headers['x-csrf-token'] ?? captured.headers['X-Csrf-Token'];
    expect(csrfHeader, 'no x-csrf-token header on the captured request').toBeTruthy();
    expect(
      csrfHeader!.split('.').length,
      'CSRF token is not in the real value.timestamp.signature format'
    ).toBe(3);

    const body = JSON.parse(captured.body);
    expect(body.name).toBe('Jane Test');
    expect(body.email).toBe('jane@example.com');
    expect(body.website).toBe(''); // honeypot left empty, exactly as a real visitor leaves it
  });

  it('the real captured submission is ACCEPTED by the real /api/contact handler — not 403, not 400', async () => {
    const captured = await renderFillAndSubmit({
      'c-name': 'Jane Test',
      'c-email': 'jane@example.com',
      'c-message': 'Real recorded test submission — not hand-written JSON.',
    });

    const request = new Request(`http://localhost${CONTACT_ENDPOINT}`, {
      method: captured.method,
      headers: captured.headers,
      body: captured.body,
    });

    const response = await contactPOST(request);
    const result = await response.json();

    expect(
      response.status,
      `handler rejected the real submission: ${JSON.stringify(result)}`
    ).not.toBe(403);
    expect(
      response.status,
      `handler rejected the real submission: ${JSON.stringify(result)}`
    ).not.toBe(400);
    expect(response.status).toBe(200);
    expect(result.success).toBe(true);

    let acceptedCount = 0;
    if (response.status === 200 && result.success === true) acceptedCount += 1;
    expect(acceptedCount).toBeGreaterThan(0);
  });

  it('the real captured submission is REJECTED when the honeypot field is filled in', async () => {
    const captured = await renderFillAndSubmit({
      'c-name': 'Bot Test',
      'c-email': 'bot@example.com',
      'c-message': 'A bot filled in the honeypot field.',
      website: 'http://spam.example', // the honeypot input's id IS "website"
    });

    const body = JSON.parse(captured.body);
    expect(body.website, 'fixture assumption: honeypot must actually be filled').toBe(
      'http://spam.example'
    );

    const request = new Request(`http://localhost${CONTACT_ENDPOINT}`, {
      method: captured.method,
      headers: captured.headers,
      body: captured.body,
    });

    const response = await contactPOST(request);
    const result = await response.json();

    // contact-route.ts:98-100 short-circuits a filled honeypot to a silent
    // 200 (so a scraping bot can't tell its message was dropped) rather than
    // a 403 — by design, not an oversight, and not something this fix
    // changes. "Rejected" is verified against that REAL behaviour: the
    // handler took the honeypot branch and never reached name/email/message
    // validation or the send path, which is observable because that
    // branch's ack message is a different, shorter string than the one a
    // genuinely processed submission gets (compare contact-route.ts:99 vs.
    // :162). This test does NOT assert a 403/400 here, because asserting
    // that would misrepresent what the shared handler actually does.
    expect(response.status).toBe(200);
    expect(result.message).toBe('Thank you for your message.');
    expect(result.message).not.toBe(
      'Thank you for your message. We will get back to you within 24 hours.'
    );
  });
});
