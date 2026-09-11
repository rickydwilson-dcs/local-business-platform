# DPM Autobody - Deployment History

High-end concours classic car restoration workshop, Berwick, East Sussex. Live at
`dpm-autobody.vercel.app` since 2026-09-11.

---

## 2026-09-11

### Real pages

- Header, footer, home, workshop, contact, library, and two individual `/builds/[slug]` pages
  (P1800 Candy, E-type 941 PVO) ported from the approved static prototype into real Next.js/MDX,
  replacing base-template's generic placeholders. Added the `builds` MDX content type (12 rows,
  2 with full body content) and the library route as a generated view over that same collection.
- Ran a visual-fidelity gate against the approved prototype that found extensive drift on first
  pass — missing webfonts, an invisible primary nav (a Tailwind mixed-units breakpoint bug: an
  arbitrary `min-[Xrem]:` variant silently emits zero CSS against a px-based `screens` config),
  wrong accent colors, and both build pages missing real structure including an entire closing
  "Enquiries" CTA section. Took three further rounds of fixes and re-verification before the
  gate cleared — full root-cause detail in
  `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md`'s "Completed" section.
- Extended `e2e/smoke.spec.ts` from 2 routes (`/`, `/contact`) to all 6 real routes.
- Not yet done: the other 10 library builds (need real photos/facts from the client — see
  site-level `CLAUDE.md`'s "Still not done"), the homepage's rotating-featured-build mechanism,
  the contact form's live wiring, and the workshop's video hero.

### Scaffold

- Copied from `sites/base-template`. Stripped services/locations/blog/projects/reviews/about
  routes, content directories, and page components — DPM's approved design has no use for them
  (single workshop, no service-list page; see site-level `CLAUDE.md`).
- `site.config.ts` filled with real DPM business facts from the discovery-phase client brief;
  unconfirmed facts (address, hours, etc.) marked `TBC` rather than guessed.
- `theme.config.ts` colors/fonts sourced from the approved static prototype's CSS custom
  properties.
- Added `vercel.json` (`ignoreCommand`/turbo-ignore guard) and `media-src` to the CSP for the
  planned video hero.
