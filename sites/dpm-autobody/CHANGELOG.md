# DPM Autobody - Deployment History

High-end concours classic car restoration workshop, Berwick, East Sussex. Live at
`dpm-autobody.vercel.app` since 2026-09-11.

---

## 2026-09-12

### Every library build now has a real page

- All 10 real builds (down from 12 — see below) now have `pageStatus: built` `/builds/[slug]`
  pages, not just P1800 Candy and E-type 941 PVO. The 8 thinner builds use
  `BuildDetailPage`'s existing fallback for a build with no structured body (an auto-generated
  fact panel plus a trailing photo grid from `galleryImages`) rather than invented narrative —
  each is wired to its real photos from the prior session's R2 upload.
- Added a `sourcingGaps` frontmatter field and a shared `SourcingGapNotice` component: a visible
  amber "Needs sourcing from David" callout on both the library card and the build page for any
  fact that's still genuinely missing, replacing a silent gap or a guessed value.
- Fixed a real, previously-invisible gap: `bentley-s3-continental`'s confirmed `video` field never
  rendered anywhere, because nothing in `BuildDetailPage` read `fm.video` until this pass added a
  `BuildVideoSection`. Needed a CSP `frame-src` addition for `youtube-nocookie.com` — see root
  `CLAUDE.md`'s CSP notes and `docs/standards/security.md`.
- Merged the "Rare Volvo" (prototype's "model to be confirmed" row) and "Pearl White P1800" library
  entries into one — confirmed the same car, not two, correcting the approved prototype's own
  12-row structure to 11.
- Removed a second duplicate: "Volvo P1800 — pair, one client" double-listed a car (the resto-mod,
  chassis 23925) already catalogued on its own. Folded the pair/award fact into the resto-mod's
  `sourcingGaps` instead — 11 real builds down to 10.
- Swapped the homepage's No. 03 featured slot from Jaguar Sea Green to the finished Aston Martin
  DB6, matching the "Finished and delivered" framing No. 01/02 use rather than an in-progress one.
- Lightened `BuildDetailPage`'s shared hero brightness/scrim (tuned against the two flagship
  pages' professionally lit prototype photography) so the other builds' real workshop photography
  reads clearly instead of too dark.
- `/library`'s own hero copy changed from "Every car that's passed through the workshop." (with a
  subtitle) to "Some of the cars that have passed through the workshop." (no subtitle).
- Not yet done: the homepage's rotating-featured-build mechanism, the contact form's live wiring,
  and the workshop's video hero remain open. A run of David-confirmation facts is still open too —
  tracked visibly as `sourcingGaps` rather than in this changelog; see site-level `CLAUDE.md`.

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
