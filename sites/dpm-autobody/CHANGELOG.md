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

### Small content and navigation fixes

- Header nav's "The Work" link changed from the homepage's `#work` in-page anchor to `/library` —
  the real, full register of every build, not just the four featured on the homepage.
- Removed the word "rivet"/"riveted" everywhere it described DPM's own chassis plaques (homepage
  tagline and P1800 blurb, the workshop page, five spots on the P1800 Candy build page) — corrected
  by David: the plaques are fixed to the chassis, not riveted. Left the one unrelated reference to
  the factory Volvo identification plate (a different, genuinely riveted OEM part) untouched.

### Backlog decisions closed

- No homepage rotating-featured-build mechanism will be built — Ricky will update the four
  featured cars by hand, occasionally, rather than on any kind of schedule or CMS.
- The workshop page's hero will not carry a video — no film is planned; it will be updated with
  different photography instead, when available.
- Contact form wiring is blocked on domain access, not code — Ricky doesn't yet have what's
  needed to verify DPM's sending domain with Resend.

### Fixed a real bug: two legal pages and the 404 page were still base-template's generic scaffold

- `/privacy-policy`, `/cookie-policy`, and `app/not-found.tsx` were still using base-template's
  generic light-theme classes (`bg-surface-subtle`, `border-surface-border`, one literal
  `bg-white`) — none of these tokens are overridden in this site's dark `theme.config.ts`, so they
  fell back to the theme-system's light defaults and rendered as bright white cards on an
  otherwise all-dark site. Not just a fidelity gap — a real, visible defect on three pages a real
  visitor can land on. Restyled all three to the site's actual dark tokens and typography, matching
  `/library`'s page-head pattern; content on the two legal pages was left as-is (a styling pass,
  not a rewrite).

### Mobile nav replaced with a real hamburger menu

- The approved prototype's mobile nav (a fixed "Contents" pill fading in once you scrolled past
  the hero) wasn't clear enough — invisible until you scrolled, and blended into the dark
  background once it appeared. Replaced with a standard always-visible hamburger button and a
  full-screen menu panel, matching the accessible pattern already used on NP Racing. The phone
  number moved into the panel too, off the collapsed mobile header bar entirely. Social icons
  (Instagram/Facebook/YouTube) sit below it in the panel.
- The homepage's closing "One car, documented in full" link (which pointed at the P1800 Candy
  build specifically) now reads "See even more of our work" and points at `/library` instead —
  a better closing link than sending everyone to the same one car.
- Removed the Bentley S3 Continental's small "whole car" establishing shot on the homepage —
  genuinely a real, deliberate one-off from the approved prototype (verified), but it made that
  section's first image read as a different size from the other three cars, none of which have
  an equivalent. The same "whole car" photo still appears via the section's own scroll sequence.

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
