/**
 * The Martin / The Clothing Kings testimonial — ported verbatim from
 * `r9-kota-level.html`'s aqua panel. `.quote` carries the `res` class (the
 * grey-resolves-to-ink reveal on scroll) exactly as the prototype does.
 */

import { QUOTE } from './home-data';

export function Quote() {
  return (
    <>
      <p className="quote res">{QUOTE.text}</p>
      <p className="quote__a">
        {QUOTE.author} <span>{QUOTE.context}</span>
      </p>
    </>
  );
}
