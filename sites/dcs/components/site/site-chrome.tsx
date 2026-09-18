/**
 * The r9 chrome for the `(site)` route group — everything an inner page gets
 * for free, in the prototype's own document order.
 *
 * Structure, matching `prototype/service-detail.html:38-364` exactly:
 *
 *   <header class="bar" id="bar" data-ground>   ← SiteBar   (no <nav>)
 *   <div class="menu" id="menu" hidden>         ← SiteMenu  (SIBLING, Trap 11)
 *   <main id="top">
 *     … the page …                              ← children
 *     <footer class="pagefoot p--navy" data-ground="navy">   ← PageFooter
 *   </main>
 *
 * Three things here are load-bearing rather than incidental:
 *
 * 1. **`.menu` is a sibling of `.bar`.** Nested inside a header carrying
 *    `backdrop-filter` or `transform`, a `fixed inset-0` overlay is trapped in
 *    that header's own box (~277x58) instead of covering the viewport
 *    (390x844). See `site-menu.tsx`'s header and root `CLAUDE.md`.
 *
 * 2. **`PageFooter` is INSIDE `<main>`.** The bar's ground probe queries
 *    `main [data-ground]`, so a footer outside `<main>` would be invisible to
 *    it and the bar would keep the last section's colour across the whole
 *    footer. The prototype closes `</main>` after `</footer>`
 *    (`service-detail.html:362-364`) for this reason.
 *
 * 3. **The reveal latch is re-pointed.** `HomeBehaviour` observes `.panel` by
 *    default, which an inner page has none of; the inner-page prototypes'
 *    script observes `.sec,.mast,.pagefoot,.work,.qa`
 *    (`service-detail.html:415`). Without it every `.res` heading on an inner
 *    page stays muted forever.
 *
 * `HomeBehaviour` is the shared client boundary. Its other three behaviours —
 * the `data-ground` probe, the burger/overlay state and the `layoutTop()`
 * in-page anchor interception — are all written against selectors the inner
 * pages use too, so they are reused rather than reimplemented. `children` is
 * passed through from a Server Component, so its state changes re-render only
 * the components that read the context (`SiteBar`, `SiteMenu`).
 */

import type { ReactNode } from 'react';

import { HomeBehaviour } from '@/components/home/home-behaviour';
import { SiteBar } from '@/components/home/site-bar';
import { CONTACT } from '@/components/home/home-data';
import { PageFooter } from '@/components/site/page-footer';
import { SiteMenu } from '@/components/site/site-menu';

/** The inner-page prototypes' own latch list (`service-detail.html:415`). */
export const INNER_REVEAL_SELECTOR = '.sec,.mast,.pagefoot,.work,.qa';

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <HomeBehaviour revealSelector={INNER_REVEAL_SELECTOR}>
      {/*
        `markHref="/"`: the prototype is a standalone file with no home page to
        link to, so its lockup falls back to `#top` — but its own
        `aria-label` reads "Digital Consulting Services — home"
        (service-detail.html:39), and the real site has a `/`. Wiring, not a
        design change.

        `ctaHref`/`ctaLabel`: `service-detail.html:52` — "Start a project",
        pointing at the mailto, which is what every CTA in this design does.
      */}
      <SiteBar markHref="/" ctaHref={CONTACT.mailtoHref} ctaLabel="Start a project" />
      <SiteMenu />

      <main id="top">
        {children}
        <PageFooter />
      </main>
    </HomeBehaviour>
  );
}
