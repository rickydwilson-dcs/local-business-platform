/**
 * `/contact` — ported from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/contact.html`
 * (inner-pages port, Phase 2d).
 *
 * WHAT THIS FILE OWNS. The page body only. The r9 chrome (bar, menu,
 * pagefoot) is `SiteChrome`, rendered once by `app/(site)/layout.tsx`; this
 * component is its `children`. Structure mirrors the prototype's `<main>`
 * content exactly: `.crumb` -> `.mast` -> `.sec#form` (a `.cols` grid of the
 * form and a `.detail--flow` aside). The prototype's own
 * `<footer class="pagefoot">` is deliberately NOT ported here — `SiteChrome`
 * already renders one, and a second would duplicate it.
 *
 * WHAT WAS DELETED. The prototype's `.rig` block (its markup at the bottom of
 * the file, and its ~15-line `<style>` block) and the `rig` variable in the
 * submit-handler script are showcase scaffolding for the static prototype,
 * explicitly marked "delete at port time" / "SHOWCASE SCAFFOLDING ONLY — not
 * part of the design kit" in the source. None of it is here.
 *
 * WHAT WAS NOT PORTED — READ BEFORE WIRING PHASE 4.
 * `contact.html`'s <script> is real client behaviour: inline validation on
 * blur, a form-level error summary, a pending/disabled state, and a
 * JS-driven swap to the `.done` success panel. None of that behaviour is
 * wired here. This phase (2d, per the yolo-brief) is a structural/visual
 * port only — writing a hand-rolled fetch() now would fight Phase 4, which
 * has to rebuild the network call anyway to send the CSRF header and JSON
 * body the real handler requires
 * (`packages/core-components/src/lib/api/contact-route.ts:55,88`). So:
 *
 *   - The form is a plain, unenhanced `<form action="/api/contact"
 *     method="post">` — exactly as unwired as the component it replaces
 *     (also a bare native POST with no submit handler). Nothing regresses.
 *   - It still cannot reach the handler today: a form-encoded POST carries no
 *     `x-csrf-token` header, so `validateCsrfToken` 403s it before the
 *     handler parses the body at all. Same failure as before this port.
 *     Phase 4 fixes it (Ricky's D2 ruling deferred it there).
 *   - The honeypot is named `website`, matching what the handler actually
 *     reads (`contact-route.ts:95`), not the old component's `_gotcha`
 *     (which the handler never checked, so that honeypot did nothing). This
 *     isn't "fixing CSRF/honeypot" as a task in itself — it's what the
 *     approved design's own markup specifies; porting it faithfully happens
 *     to also be correct.
 *   - `.formerr`, `.f__e` and `.done` are real markup, `hidden` exactly as
 *     the prototype has them by default (its own "Ground rule 13: nothing is
 *     gated on JS"), so they render for free today and are ready for Phase 4
 *     to drive without a markup change.
 *   - Native HTML validation (`required` / `type="email"` / `maxLength`)
 *     still runs — nothing here calls `novalidate`, which the prototype only
 *     ever sets from its own script.
 *
 * PRICES. This page carries none — the fee figures live on `/pricing` only.
 */

import Link from 'next/link';
import { CONTACT } from '@/components/home/home-data';

// Inline path data for the three icons this page uses, matching the
// convention this codebase already uses elsewhere (`components/home/site-bar.tsx`
// inlines its own `<path>` rather than referencing a `<use href="#id">` into a
// shared sprite `<defs>` block — this design has no such shared sprite).
// Geometry copied verbatim from the prototype's own `<defs>` (contact.html's
// `#arr` / `#tick` / `#warn` symbols).

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

export function SiteContactPage() {
  return (
    <>
      {/* ===== 1. BREADCRUMB + MASTHEAD — ink ============================== */}
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span aria-current="page">Contact</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Contact</p>
        <h1>Tell me what you need.</h1>
        <p className="lead">
          A few questions and I&rsquo;ll come back with a straight answer &mdash; what I&rsquo;d
          build, what it would cost, and how long it would take. No obligation, and no sales call
          unless you want one.
        </p>
        <div className="mast__meta">
          <div>
            <b>One working day</b>
            <span>Typical reply</span>
          </div>
          <div>
            <b>Free</b>
            <span>Quotes and advice</span>
          </div>
          <div>
            <b>Polegate, East Sussex</b>
            <span>Where I am</span>
          </div>
          <div>
            <b>UK-wide</b>
            <span>Where I work</span>
          </div>
        </div>
      </header>

      {/* ===== 2. THE FORM — white ========================================= */}
      <section className="sec p--white" data-ground="white" id="form">
        <p className="eyeless">Start here</p>
        <h2 className="res">A few things and I can quote it.</h2>
        <p className="lead">
          Your name, an email address and a message are all I actually need. Everything else is
          optional &mdash; but the more you tell me, the more useful my first reply will be.
        </p>

        <div className="cols">
          {/* ---------- LEFT: the form, and the (inert) success state ------ */}
          <div>
            <p className="vh" id="live" role="status" aria-live="polite"></p>

            <section className="done swap" id="done" hidden tabIndex={-1} aria-labelledby="done-h">
              <p className="eyeless">Sent</p>
              <h2 id="done-h">
                Thanks, <span id="done-name">&mdash;</span>. That&rsquo;s with me.
              </h2>
              <p className="lead">
                I&rsquo;ll reply to <b id="done-mail">&mdash;</b> &mdash; usually the same working
                day, and always within one. If nothing has landed by then it will be in your spam
                folder. Failing that, call me.
              </p>

              <div className="done__next">
                <p className="eyeless">What happens next</p>
                <div className="detail__l">
                  <div>
                    <TickIcon /> I read it properly rather than skimming it, so the reply answers
                    what you actually asked.
                  </div>
                  <div>
                    <TickIcon /> You get a straight answer: what I&rsquo;d build, what it would
                    cost, and how long it would take.
                  </div>
                  <div>
                    <TickIcon /> If it&rsquo;s a fit, a short call. If it isn&rsquo;t, I&rsquo;ll
                    say so and point you somewhere better.
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
            >
              {/* HONEYPOT. Named `website` — the field the handler actually
                  checks (contact-route.ts:95). Not display:none and not
                  [hidden]: a bot that parses CSS skips those. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Form-level error summary. Inert without JS — never revealed
                  here, ready for Phase 4. */}
              <div className="formerr" id="formerr" role="alert" hidden>
                <WarnIcon />
                <div>
                  <b id="formerr-t"></b>
                  <p id="formerr-b"></p>
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
                  sends (contact-route.ts:211). Six options = the six real
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
                    What the business does, where you are, and what you want the site to do. Up to
                    2000 characters.
                  </p>
                  <span className="count" id="count" hidden></span>
                </div>
                <p className="f__e" id="e-message" hidden>
                  <WarnIcon />
                  <span></span>
                </p>
              </div>

              <div className="hero__act">
                <button className="btn" type="submit" id="send">
                  <span id="send-t">Send it</span>
                  <ArrIcon />
                </button>
              </div>

              <p className="f__h" style={{ maxWidth: '52ch' }}>
                I only use this to reply to you. No mailing list, no follow-up sequence, and nothing
                passed on to anyone else.
              </p>

              <noscript>
                {/* HONEST. The shipped endpoint requires an x-csrf-token
                    header and reads request.json(), so a plain form POST
                    cannot reach it regardless of JavaScript — a real finding
                    for Phase 4, not a prototype limitation. */}
                <div className="formerr" style={{ marginTop: 22, marginBottom: 0 }}>
                  <WarnIcon />
                  <div>
                    <b>This form needs JavaScript to send.</b>
                    <p>
                      It&rsquo;s a limitation at my end, not yours. Email me at{' '}
                      <a href={CONTACT.mailtoHref}>{CONTACT.email}</a> or call{' '}
                      <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a> and you&rsquo;ll get
                      the same answer.
                    </p>
                  </div>
                </div>
              </noscript>
            </form>
          </div>

          {/* ---------- RIGHT: the direct route ---------------------------- */}
          <aside className="detail detail--flow p--ink" aria-labelledby="direct-h">
            <p className="eyeless">Or skip the form</p>
            <h3 id="direct-h">Just call or email me. It reaches the same person.</h3>

            <div>
              <a className="line" href={CONTACT.mailtoHref}>
                {CONTACT.email}
              </a>
              <a className="line" href={CONTACT.phoneHref}>
                {CONTACT.phoneDisplay}
              </a>
            </div>

            <div className="facts">
              <div>
                <b>Mon&ndash;Fri, 9:00&ndash;17:30</b>
                <span>When I&rsquo;m about</span>
              </div>
              <div>
                <b>Saturday by appointment</b>
                <span>Sunday closed</span>
              </div>
              <div>
                <b>Unit H3, Chaucer Business Park</b>
                <span>Dittons Road, Polegate, East Sussex BN26 6QH</span>
              </div>
              <p>
                Most of the work is done remotely, so where you are makes no difference &mdash; I
                build for businesses from Cornwall to the Highlands. If you&rsquo;re local and would
                rather meet, say so and we will.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
