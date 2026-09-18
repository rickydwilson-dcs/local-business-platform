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
 * WHAT WAS NOT PORTED (Phase 2) / WHERE IT LANDED (Phase 4).
 * `contact.html`'s <script> is real client behaviour: inline validation on
 * blur, a form-level error summary, a pending/disabled state, and a
 * JS-driven swap to the `.done` success panel. Phase 2 shipped none of that
 * — a structural/visual port only, deliberately deferred because a
 * hand-rolled fetch() then would have fought Phase 4, which had to rebuild
 * the network call anyway to send the CSRF header and JSON body the real
 * handler requires (`packages/core-components/src/lib/api/contact-route.ts:55,88`).
 * Phase 4 (row 4a of the yolo-brief) did that rebuild: submission mechanics
 * — the CSRF fetch, the intercepted submit, and the `.done`/`.formerr` swap
 * — now live in `ContactForm.tsx`, rendered below. See that file's header
 * for the full account of what was wired and why. Per-field `.f__e` inline
 * validation remains inert — a separate, still-unwritten feature.
 *
 * The honeypot is named `website`, matching what the handler actually reads
 * (`contact-route.ts:98`), not the pre-port component's `_gotcha` (which the
 * handler never checked, so that honeypot did nothing).
 *
 * PRICES. This page carries none — the fee figures live on `/pricing` only.
 */

import Link from 'next/link';
import { CONTACT } from '@/components/home/home-data';
import { ContactForm } from './ContactForm';

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
          {/* ---------- LEFT: the form, and the success state -------------- */}
          <div>
            <ContactForm />
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
