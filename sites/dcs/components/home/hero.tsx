/**
 * The r9 prototype's hero section — `.hero`.
 *
 * Trap 12 (root CLAUDE.md, and the yolo-brief's Traps section): the hero
 * headline must render visible with zero JS. The prototype's own thesis
 * names a reference site that gets this wrong. The per-character split
 * below (`splitChars`) runs as a plain function call during render — this
 * is a Server Component, there is no `useEffect` or `useState` here, so the
 * spans exist in the very first server-rendered HTML.
 *
 * The prototype builds this same markup client-side, in a `<script>` block
 * that runs after load:
 *
 *   document.querySelectorAll('h1 [data-t]').forEach(function(ln, li){
 *     var t = ln.dataset.t, out = '';
 *     for (var i=0;i<t.length;i++){
 *       var c = t[i] === ' ' ? '&nbsp;' : t[i];
 *       out += '<span class="ch" style="animation-delay:'+((li*0.14)+(i*0.028)).toFixed(3)+'s">'+c+'</span>';
 *     }
 *     ln.innerHTML = out;
 *   });
 *
 * `li` is the index of the element within the `h1 [data-t]` NodeList — three
 * elements match (the prototype's static "Websites" `.plate` span carries no
 * `data-t` and is never split), so `li` is 0 for "as", 1 for "professional",
 * 2 for "as you." — not the `.ln` index. `i` is the character index within
 * that line's own text. Spaces become `&nbsp;` (here: ` `) so a word
 * doesn't visually collapse when its characters are individually spanned.
 */

const HERO_SUB =
  'Designed, written, built, hosted and looked after by me. ' +
  'Work that stands next to what London studios put out, for a fraction of the cost.';

interface HeroLine {
  /** The line's index within the `[data-t]` match order — used in the delay formula. */
  lineIndex: number;
  text: string;
}

const HERO_LINES = {
  as: { lineIndex: 0, text: 'as' } satisfies HeroLine,
  professional: { lineIndex: 1, text: 'professional' } satisfies HeroLine,
  asYou: { lineIndex: 2, text: 'as you.' } satisfies HeroLine,
};

/**
 * Splits a hero line's text into `.ch` spans with the prototype's exact
 * per-character stagger delay: `((li * 0.14) + (i * 0.028)).toFixed(3)`.
 */
function splitChars({ lineIndex, text }: HeroLine) {
  return Array.from(text).map((char, i) => {
    const delay = (lineIndex * 0.14 + i * 0.028).toFixed(3);
    return (
      <span key={i} className="ch" style={{ animationDelay: `${delay}s` }}>
        {char === ' ' ? ' ' : char}
      </span>
    );
  });
}

export function Hero() {
  return (
    <section className="hero" data-ground="ink">
      <div className="hero__head">
        <h1>
          <span className="ln">
            <span className="plate">Websites</span>
            <span data-t="as">{splitChars(HERO_LINES.as)}</span>
          </span>
          <span className="ln" data-t="professional">
            {splitChars(HERO_LINES.professional)}
          </span>
          <span className="ln dim" data-t="as you.">
            {splitChars(HERO_LINES.asYou)}
          </span>
        </h1>
        <p className="hero__sub">{HERO_SUB}</p>
      </div>
      {/* Mobile only. Desktop keeps its persistent top-right pill as the
          single action; on a phone that pill is a thumb-stretch, so the
          fold gets its own. */}
      <div className="hero__m">
        <a className="btn" href="#end">
          Get a free quote
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 8h11M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a className="hero__m2" href="#work">
          See the work
        </a>
      </div>
    </section>
  );
}
