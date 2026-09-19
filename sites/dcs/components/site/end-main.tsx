/**
 * `.end__main` — the closing "let's talk" block, shared by the homepage's
 * `.end` chapter panel and by every inner page's `.pagefoot`.
 *
 * The two are the same block in the design. `_chrome.html:426-439` states it
 * directly: `.pagefoot` "keeps the closing move and loses the chapter" — same
 * navy ground, same oversized `.big` contact links, same `.end__foot` rule and
 * microcopy row, at a shortened top padding. The only markup difference is the
 * `<p class="eyeless">Start a project</p>` kicker the footer carries and the
 * homepage does not (`_chrome.html:443` vs `r9-kota-level.html`'s `#end`).
 *
 * So this file holds the block once and takes that kicker as a prop, rather
 * than the inner-page footer re-typing five elements that already exist. The
 * default (no `eyebrow`) renders exactly what `end-section.tsx` rendered
 * before this extraction — `test/home-markup-parity.test.ts` is the guard on
 * that.
 */

import { CONTACT } from '@/components/home/home-data';

export interface EndMainProps {
  /** Optional `.eyeless` kicker above the heading. The inner-page footer
   *  passes "Start a project"; the homepage passes nothing. */
  eyebrow?: string;
}

export function EndMain({ eyebrow }: EndMainProps) {
  return (
    <div className="end__main">
      {eyebrow ? <p className="eyeless">{eyebrow}</p> : null}
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
  );
}
