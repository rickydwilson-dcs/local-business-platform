/**
 * FAQ accordion. Ported verbatim as native `<details>`/`<summary>` — see
 * `r9-kota-level.html`'s `#faq` section — because `home-r9.css` animates
 * `.qa__a > div` (grid-template-rows trick) and the `summary::after` chevron
 * off the native `[open]` attribute and its pseudo-selectors. Reimplementing
 * with React state would decouple the markup from that CSS.
 */

import { FAQS } from './home-data';

export function Questions() {
  return (
    <div className="qa">
      {FAQS.map((faq) => (
        <details key={faq.question} open={faq.open}>
          <summary>{faq.question}</summary>
          <div className="qa__a">
            <div>
              <p>{faq.answer}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
