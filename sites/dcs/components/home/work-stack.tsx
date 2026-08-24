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
 */

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
      </ChapterPanel>

      <div className="wstack">
        {WORK.map((item, i) => (
          <article className="wpanel" id={`work-${i + 1}`} data-ground="ink" key={item.name}>
            <span className="wpanel__ix">{item.index}</span>
            <LazyVideo src={HOME_ASSETS[item.video].url} poster={HOME_ASSETS[item.poster].url} />
            <h3 className="wpanel__n">{item.name}</h3>
            <p className="wpanel__d">{item.description}</p>
            <div className="wpanel__r">
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
