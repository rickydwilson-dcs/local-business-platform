/**
 * Composes the full r9 homepage furniture in the prototype's own document
 * order — `.bar` and `.menu` as siblings (Trap 11), then `<main id="top">`
 * holding the hero and the `.stack` of chapter panels. Ported from
 * `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`
 * lines 748-1050.
 *
 * `WorkStack`, `ServicesStack` and `StepsSection` each wrap their own content
 * in a `ChapterPanel` (they own a heading that reads naturally next to their
 * body). `Pricing`, `Questions`, `Quote` and `EndSection` do not — they are
 * pure content, so their `ChapterPanel` wrapper (heading + cornerfill
 * pairing) is composed here instead. See `chapter-panel.tsx`'s boundary
 * table for why each `cornerfillColor` is the colour of the pane ABOVE, not
 * the panel being opened.
 *
 * This is the single import Phase 7's `app/page.tsx` needs for the
 * homepage's own furniture (it does not render `PageShell`/`SiteHeader`/
 * `SiteFooter` — those stay with the `(site)` route group's 14 inner
 * routes).
 */

import { ChapterPanel } from './chapter-panel';
import { EndSection } from './end-section';
import { Hero } from './hero';
import { HomeBehaviour } from './home-behaviour';
import { MobileMenu } from './mobile-menu';
import { Pricing } from './pricing';
import { Questions } from './questions';
import { Quote } from './quote';
import { ServicesStack } from './services-stack';
import { SiteBar } from './site-bar';
import { StepsSection } from './steps-section';
import { WorkStack } from './work-stack';

export function HomeBody() {
  return (
    // `HomeBehaviour` (Phase 6) is the client boundary that runs the
    // prototype's scroll and interaction script. Everything below it is passed
    // as `children` from this Server Component, so its state changes only
    // re-render the components that actually read its context (`SiteBar`,
    // `MobileMenu`) — not this whole tree.
    <HomeBehaviour>
      <SiteBar />
      <MobileMenu />

      <main id="top">
        <Hero />

        <div className="stack">
          <WorkStack />
          <ServicesStack />
          <StepsSection />

          <ChapterPanel cornerfillColor="ink" panelBg="white" dataGround="white" id="pricing">
            <h2 className="res">
              Two ways to pay
              <br />
              for the same site.
            </h2>
            <Pricing />
          </ChapterPanel>

          <ChapterPanel cornerfillColor="white" panelBg="magenta" dataGround="magenta" id="faq">
            <h2 className="res">
              Questions I get asked
              <br />
              before people say yes.
            </h2>
            <Questions />
          </ChapterPanel>

          <ChapterPanel cornerfillColor="magenta" panelBg="aqua" dataGround="aqua">
            <Quote />
          </ChapterPanel>

          <ChapterPanel
            cornerfillColor="aqua"
            panelBg="navy"
            dataGround="navy"
            id="end"
            className="end"
          >
            <EndSection />
          </ChapterPanel>
        </div>
      </main>
    </HomeBehaviour>
  );
}
