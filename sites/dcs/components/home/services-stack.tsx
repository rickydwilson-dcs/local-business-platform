/**
 * The r9 prototype's services chapter — the `#services` chapter opener plus
 * the `.svcstack` of six `.svccard` cards. Ported class-name for class-name
 * from lines 870-945 of
 * `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`.
 *
 * Each `.svccard` carries `style="--i:{n}"` in the prototype — the CSS
 * (`.svccard{top:calc(... + var(--i) * 10px)}`) uses that custom property
 * to compute its sticky stacking offset, so the index must be emitted as an
 * inline custom property via `style`, not as a class or data attribute.
 * TypeScript's `CSSProperties` has no `--i` key, hence the cast below.
 *
 * `home-data.ts`'s `ServiceColor` union (`ink | magenta | white | navy |
 * aqua`) matches the prototype's `svccard--*` modifiers one-for-one, so no
 * mapping table is needed. `ServiceMedia` is a discriminated union
 * (`video` | `image`) because the prototype mixes both inside `.svccard__well`
 * — the first two cards are video, the remaining four are images.
 */

import type { CSSProperties } from 'react';
import { ChapterPanel } from './chapter-panel';
import { SERVICES } from './home-data';
import { HOME_ASSETS } from '@/lib/home-assets';

export function ServicesStack() {
  return (
    <>
      <ChapterPanel cornerfillColor="ink" panelBg="magenta" dataGround="magenta" id="services">
        <h2 className="res">
          Everything a small business <br />
          actually needs online.
        </h2>
        <p className="lead">
          Six things. You need some of them, not all of them — and I&apos;ll tell you which.
        </p>
      </ChapterPanel>

      <section className="svcstack">
        {SERVICES.map((svc, i) => (
          <article
            className={`svccard svccard--${svc.color}`}
            style={{ '--i': i } as CSSProperties}
            key={svc.title}
          >
            <div className="svccard__body">
              <span className="svccard__ix">{svc.index}</span>
              <h3 className="svccard__t">{svc.title}</h3>
              <p className="svccard__d">{svc.description}</p>
              <a className="svccard__l" href="#end">
                {svc.linkLabel}
              </a>
            </div>
            <div className="svccard__well">
              {svc.media.kind === 'video' ? (
                <video
                  src={HOME_ASSETS[svc.media.video].url}
                  poster={HOME_ASSETS[svc.media.poster].url}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              ) : (
                <img src={HOME_ASSETS[svc.media.image].url} alt="" loading="lazy" />
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
