/**
 * The final `.end` panel's content — `.end__main` (heading, lead, the two
 * `.big` contact links, and the CTA) plus `.end__foot` (in-page nav,
 * copyright, address). Ported verbatim from `r9-kota-level.html`'s
 * `#end` section; the outer `<section class="panel p--navy end" id="end"
 * data-ground="navy">` wrapper is composed elsewhere.
 *
 * Per Ricky's explicit nav decision (yolo-brief.md scope notes): the footer
 * nav stays as in-page anchors only. Do not add links to /services,
 * /pricing, /blog or any other route — the 14 existing inner routes are not
 * linked from the homepage yet.
 */

import { CONTACT } from './home-data';

export function EndSection() {
  return (
    <>
      <div className="end__main">
        <h2 className="res">
          Let&apos;s talk about
          <br />
          your website.
        </h2>
        <p className="lead">Free, and without obligation.</p>
        <div>
          <a className="big" href={CONTACT.mailtoHref}>
            {CONTACT.email}
          </a>
        </div>
        <div>
          <a className="big" href={CONTACT.phoneHref}>
            {CONTACT.phoneDisplay}
          </a>
        </div>
        <div className="hero__act">
          <a className="btn" href={CONTACT.mailtoHref}>
            Get a free quote
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8h11M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="end__foot">
        {/* In-page anchors only — see CONTACT/nav decision note above. */}
        <nav className="end__nav">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">Questions</a>
        </nav>
        <span>© 2026 Digital Consulting Services Ltd</span>
        <span>{CONTACT.address}</span>
      </div>
    </>
  );
}
