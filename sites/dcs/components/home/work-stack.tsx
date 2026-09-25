/**
 * The r9 prototype's work chapter — the `#work` chapter opener plus the
 * `.wstack` of five `.wpanel` case studies. Ported class-name for
 * class-name from lines 810-866 of
 * `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`.
 *
 * `.wstack::after` (the tail that gives the sticky stack room to pin — see
 * root CLAUDE.md's sticky-stack trap) lives in the already-committed
 * `styles/home-r9.css` and is CSS-only; nothing here replicates it.
 *
 * All five panels carry an outbound link to the live client site (the
 * prototype's pill chips have been dropped in favour of a link on every
 * panel).
 *
 * ## The onward links, added 2026-09-25
 *
 * Three of the five also carry a `/projects/<slug>` case-study link — the
 * three that HAVE a page in `content/projects/`. NP Racing and SM Commercial
 * do not, so they show the live-site link alone. Ricky chose this knowing the
 * set reads unevenly (`home-data.ts`'s `caseStudy` field documents the
 * trade-off); the section-level "See all work" link below covers the onward
 * path for all five regardless.
 *
 * That section link uses `.btn--ghost`, which is authored for LIGHT grounds
 * (`home-r9.css:128` — `color:var(--ink)`, a dark translucent border). This
 * chapter opener is `panelBg="white"`, so it is in its designed context. The
 * services chapter opener deliberately has no equivalent link: it is magenta,
 * and putting a ghost button on a non-light ground is design-kit gap **G13**,
 * an explicitly open decision — not something to settle in a wiring change.
 * All six service cards link to their own pages anyway, and `/services` is in
 * both the menu and the footer.
 */

import Link from 'next/link';
import { ChapterPanel } from './chapter-panel';
import { LazyVideo } from './lazy-video';
import { WORK } from './home-data';
import { HOME_ASSETS } from '@/lib/home-assets';

export function WorkStack() {
  return (
    <>
      <ChapterPanel cornerfillColor="ink" panelBg="white" dataGround="white" id="work">
        <h2 className="res">
          You do you.
          <br />
          I&rsquo;ve got this.
        </h2>
        <p className="lead">No clue? No problem. No judgement.</p>
        {/* `.wpanel__r` is the design's own link-row primitive — `margin-top:22px`
            plus a wrapping flex row (`home-r9.css:303`) — and it is an unscoped
            class, so it applies here as it does in a panel. Reused rather than
            adding a new rule because `home-r9.css` is asserted verbatim against
            the prototype by `test/home-css-parity.test.ts`; a bare <p> would
            give zero spacing, since Tailwind Preflight zeroes p margins. */}
        <div className="wpanel__r">
          <Link className="btn btn--ghost" href="/projects">
            See all work &rarr;
          </Link>
        </div>
      </ChapterPanel>

      <div className="wstack">
        {WORK.map((item, i) => (
          <article
            className="wpanel"
            id={`work-${i + 1}`}
            data-ground="ink"
            key={item.name}
            style={{ backgroundColor: 'var(--ink)' }}
          >
            <span className="wpanel__ix">{item.index}</span>
            <LazyVideo src={HOME_ASSETS[item.video].url} poster={HOME_ASSETS[item.poster].url} />
            <h3 className="wpanel__n">{item.name}</h3>
            <p className="wpanel__d">{item.description}</p>
            <div className="wpanel__r">
              {item.caseStudy && (
                <Link className="wpanel__l" href={item.caseStudy}>
                  Read the case study &rarr;
                </Link>
              )}
              <a className="wpanel__l" href={item.link.href} target="_blank" rel="noopener">
                {item.link.label}
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
