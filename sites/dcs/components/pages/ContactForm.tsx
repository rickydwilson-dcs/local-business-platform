'use client';

/**
 * Client-side wiring for the `/contact` form's submission mechanics — Phase 4
 * of `output/sessions/2026-09/2026-09-18_dcs-inner-pages-port/yolo-brief.md`
 * (row 4a). The markup below is the Phase 2 port from `ContactPage.tsx`
 * (see that file's header for provenance/what-was-deleted) — structurally
 * and visually unchanged. This file only wires the behaviour that file's own
 * header explicitly flagged as deliberately NOT ported:
 *
 *   - A bare `<form action="/api/contact" method="post">` cannot reach the
 *     shared handler at all. It POSTs form-encoded with no CSRF header, so
 *     `validateCsrfToken` (`packages/core-components/src/lib/api/contact-route.ts:55`)
 *     403s it before `request.json()` (`:88`) would even get a chance to
 *     400 on the form-encoded body.
 *   - Fix: fetch a real token from `/api/csrf-token` on mount (the exact
 *     mechanism `sites/dch-automotive/components/contact-form.tsx` already
 *     uses — the one other site in this monorepo with a client-wired contact
 *     form), intercept submit, and POST JSON with the `x-csrf-token` header
 *     the handler actually reads (`csrf.ts:221`/`227`). CSRF is not disabled
 *     anywhere in this fix — it's the mechanism being satisfied correctly.
 *   - `action`/`method` stay on the `<form>` element even though JS
 *     intercepts every submit via `preventDefault()`: they're dead at
 *     runtime, but the `<noscript>` fallback below is honest about needing
 *     JS, and `test/page-parity.test.ts` asserts on their presence.
 *   - `#done` and `#cform` both stay permanently mounted and swap via the
 *     `hidden` attribute, matching the prototype's own intended mechanism
 *     (not a conditional unmount) — an unmount would drop `.done`'s classes
 *     from the render entirely and fail the "every live class of the
 *     prototype body appears in the render" parity test.
 *   - Only the coarse, already-markup-ready surfaces are wired: the overall
 *     success swap and the single `.formerr` summary. Per-field `.f__e`
 *     inline-validation errors stay inert, exactly as the Phase 2 header
 *     flagged them — that's a separate, genuinely-unwritten feature, not
 *     part of this fix's scope.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CONTACT } from '@/components/home/home-data';

// Same icon geometry as the rest of this page's prototype-sourced `<defs>`
// (`#arr` / `#tick` / `#warn`) — moved here from `ContactPage.tsx` because
// every usage of all three lives inside the markup this file now owns.

function ArrIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 4.5"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.1" stroke="currentColor" strokeWidth={2} fill="none" />
      <path d="M8 4.7v4.1" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M8 11.4h.01" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

interface SubmittedInfo {
  name: string;
  email: string;
}

const GENERIC_ERROR =
  'Something went wrong sending that. Please try again, or use the email/phone opposite.';
const NETWORK_ERROR = 'Network error. Please check your connection and try again.';

export function ContactForm() {
  const [csrfToken, setCsrfToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedInfo | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCsrfToken() {
      try {
        const response = await fetch('/api/csrf-token');
        if (!response.ok) return;
        const data = (await response.json()) as { token?: string };
        if (!cancelled && data.token) setCsrfToken(data.token);
      } catch {
        // Left as an empty token: the handler correctly 403s a missing
        // token with a clear error, which handleSubmit surfaces below —
        // better than a silently non-functional form.
      }
    }

    fetchCsrfToken();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (response.ok && result.success) {
        setSubmitted({
          name: typeof payload.name === 'string' ? payload.name : '',
          email: typeof payload.email === 'string' ? payload.email : '',
        });
        form.reset();
      } else {
        setErrorMessage(result.error || GENERIC_ERROR);
      }
    } catch {
      setErrorMessage(NETWORK_ERROR);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <p className="vh" id="live" role="status" aria-live="polite">
        {submitted
          ? `Thanks, ${submitted.name}. Your message has been sent.`
          : (errorMessage ?? '')}
      </p>

      <section
        className="done swap"
        id="done"
        hidden={!submitted}
        tabIndex={-1}
        aria-labelledby="done-h"
      >
        <p className="eyeless">Sent</p>
        <h2 id="done-h">
          Thanks, <span id="done-name">{submitted?.name || '—'}</span>. That&rsquo;s with me.
        </h2>
        <p className="lead">
          I&rsquo;ll reply to <b id="done-mail">{submitted?.email || '—'}</b> &mdash; usually the
          same working day, and always within one. If nothing has landed by then it will be in your
          spam folder. Failing that, call me.
        </p>

        <div className="done__next">
          <p className="eyeless">What happens next</p>
          <div className="detail__l">
            <div>
              <TickIcon /> I read it properly rather than skimming it, so the reply answers what you
              actually asked.
            </div>
            <div>
              <TickIcon /> You get a straight answer: what I&rsquo;d build, what it would cost, and
              how long it would take.
            </div>
            <div>
              <TickIcon /> If it&rsquo;s a fit, a short call. If it isn&rsquo;t, I&rsquo;ll say so
              and point you somewhere better.
            </div>
          </div>
        </div>

        <div className="hero__act">
          <Link className="btn" href="/projects">
            See the work
            <ArrIcon />
          </Link>
          <a className="btn btn--ghost" href="#top">
            Back to the top
          </a>
        </div>
      </section>

      <form
        id="cform"
        className="form"
        action="/api/contact"
        method="post"
        aria-describedby="formerr"
        hidden={!!submitted}
        onSubmit={handleSubmit}
      >
        {/* HONEYPOT. Named `website` — the field the handler actually
            checks (contact-route.ts:98). Not display:none and not
            [hidden]: a bot that parses CSS skips those. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="formerr" id="formerr" role="alert" hidden={!errorMessage}>
          <WarnIcon />
          <div>
            <b id="formerr-t">{errorMessage ? 'Something went wrong' : ''}</b>
            <p id="formerr-b">{errorMessage ?? ''}</p>
          </div>
        </div>

        <div className="f" data-f="name">
          <label className="f__l" htmlFor="c-name">
            Your name
          </label>
          <div className="f__w">
            <input
              className="f__c"
              id="c-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              aria-describedby="e-name"
            />
          </div>
          <p className="f__e" id="e-name" hidden>
            <WarnIcon />
            <span></span>
          </p>
        </div>

        <div className="f" data-f="email">
          <label className="f__l" htmlFor="c-email">
            Email address
          </label>
          <div className="f__w">
            <input
              className="f__c"
              id="c-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              aria-describedby="h-email e-email"
            />
          </div>
          <div className="f__foot">
            <p className="f__h" id="h-email">
              This is where the reply goes, so it is worth a second look.
            </p>
          </div>
          <p className="f__e" id="e-email" hidden>
            <WarnIcon />
            <span></span>
          </p>
        </div>

        <div className="f" data-f="phone">
          <label className="f__l" htmlFor="c-phone">
            Phone <em>(optional)</em>
          </label>
          <div className="f__w">
            <input
              className="f__c"
              id="c-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={30}
              aria-describedby="h-phone e-phone"
            />
          </div>
          <div className="f__foot">
            <p className="f__h" id="h-phone">
              Quicker than email, if you&rsquo;d rather I rang.
            </p>
          </div>
          <p className="f__e" id="e-phone" hidden>
            <WarnIcon />
            <span></span>
          </p>
        </div>

        {/* The one field that justifies a <select>: the handler reads
            `service` and puts it in the subject line of the email it
            sends (contact-route.ts:214). Six options = the six real
            MDX files in content/services/. */}
        <div className="f f--sel" data-f="service">
          <label className="f__l" htmlFor="c-service">
            What do you need? <em>(optional)</em>
          </label>
          <div className="f__w">
            <select
              className="f__c"
              id="c-service"
              name="service"
              aria-describedby="h-service"
              defaultValue=""
            >
              <option value="">I&rsquo;m not sure yet</option>
              <option>A new website</option>
              <option>An online shop</option>
              <option>Local SEO</option>
              <option>Ongoing website management</option>
              <option>Analytics &amp; reporting</option>
              <option>Google Workspace email</option>
              <option>Something else</option>
            </select>
          </div>
          <div className="f__foot">
            <p className="f__h" id="h-service">
              Only a starting point &mdash; it doesn&rsquo;t commit you to anything.
            </p>
          </div>
        </div>

        <div className="f f--area" data-f="message">
          <label className="f__l" htmlFor="c-message">
            Your message
          </label>
          <div className="f__w">
            <textarea
              className="f__c"
              id="c-message"
              name="message"
              rows={6}
              required
              maxLength={2000}
              aria-describedby="h-message e-message"
            />
          </div>
          <div className="f__foot">
            <p className="f__h" id="h-message">
              What the business does, where you are, and what you want the site to do. Up to 2000
              characters.
            </p>
            <span className="count" id="count" hidden></span>
          </div>
          <p className="f__e" id="e-message" hidden>
            <WarnIcon />
            <span></span>
          </p>
        </div>

        <div className="hero__act">
          <button className="btn" type="submit" id="send" disabled={submitting}>
            <span id="send-t">{submitting ? 'Sending…' : 'Send it'}</span>
            <ArrIcon />
          </button>
        </div>

        <p className="f__h" style={{ maxWidth: '52ch' }}>
          I only use this to reply to you. No mailing list, no follow-up sequence, and nothing
          passed on to anyone else.
        </p>

        <noscript>
          {/* HONEST. Without JS the intercepted fetch() never runs, and the
              shipped endpoint requires an x-csrf-token header and JSON body
              a plain form POST cannot produce — so this remains a real,
              accurate fallback message rather than a prototype limitation. */}
          <div className="formerr" style={{ marginTop: 22, marginBottom: 0 }}>
            <WarnIcon />
            <div>
              <b>This form needs JavaScript to send.</b>
              <p>
                It&rsquo;s a limitation at my end, not yours. Email me at{' '}
                <a href={CONTACT.mailtoHref}>{CONTACT.email}</a> or call{' '}
                <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> and you&rsquo;ll get the same
                answer.
              </p>
            </div>
          </div>
        </noscript>
      </form>
    </>
  );
}
