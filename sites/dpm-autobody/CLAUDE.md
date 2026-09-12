# CLAUDE.md - DPM Autobody

Guidance for Claude Code when working with `sites/dpm-autobody`.

## Overview

DPM Autobody is a high-end concours classic car restoration workshop in Berwick, East Sussex
(director David Pearce-Martin). The site was scaffolded from `sites/base-template` on 2026-09-11.
Full discovery/design history lives in
`output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/` (read `synthesis.md` and
`positioning.md` first) and the build-out plan in
`output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/session.md`.

## Not a typical trade site — no services/locations/blog/projects/reviews

DPM's approved design (home / workshop / build-library / individual build pages) has no use for
base-template's default services/locations/blog/projects/reviews content types or routes — David
is a single workshop, not a multi-location trade business, and the site's real structure is an
auction-lot-catalogue register of restoration builds, not a service list. Those routes, their MDX
content directories, and their page components were deleted at scaffold time rather than left in
place with generic placeholder content. `site.config.ts`'s `services`/`serviceAreas` fields still
exist but feed schema.org JSON-LD only — there is no `/services` or `/locations` route.

## Current state (as of the 2026-09-11 build-out)

- **Real pages, ported and visually verified.** Header, footer, home, workshop, contact, and
  library are real React components built from the approved static prototype — no longer
  base-template placeholders. They went through a visual fidelity gate (Phase 7 of the build-out
  brief) that found extensive drift on first pass and required three further rounds of fixes
  before landing. See
  `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md`'s "Completed" section
  for the full root-cause detail (missing webfonts, a Tailwind mixed-units breakpoint bug that made
  the nav invisible, a genuinely missing "Enquiries" CTA section, and more) rather than repeating it
  here.
- **All 10 real builds now have real `/builds/[slug]` pages** (`pageStatus: built`), as of a
  2026-09-12 pass. (`p1800-pair-one-client` was removed the same day — see below — so the library
  is 10 builds, not the 11 or 12 earlier notes in this file describe; check `LIBRARY_ORDER` in
  `app/library/page.tsx` for the current authoritative count and order, not this prose.) The two
  richest (P1800 Candy, E-type 941 PVO) use hand-written MDX bodies with the full "documented car"
  template (chapters, spec tables, plaques — see `components/pages/build-detail-page.tsx`'s file
  header). The other 8 use that same component's built-in thin-content fallback: no
  `##`-structured body needed, just frontmatter (`heroImage`, `galleryImages`, the structured
  facts) plus one or two plain paragraphs of prose reusing already-approved copy — the template
  auto-renders a "The record" fact panel and a trailing photo grid from that alone. Do not invent
  narrative for a thin build; reuse this fallback path instead of writing chapters the source
  material doesn't support.
- **`p1800-pair-one-client` was removed 2026-09-12 — it was a duplicate, not a distinct car.**
  BACKLOG.md and the approved prototype both listed "two P1800s, one client, both won show
  awards" as its own library lot, but at least one of the two cars in that pair is the resto-mod
  (`p1800-candy-restomod.mdx`, chassis 23925) — confirmed by Ricky, 2026-09-12 — which already has
  its own real build entry. Rather than double-list that car under two lots, the pair fact now
  lives as a `sourcingGaps` note on the resto-mod build ("the second car in this pair and both
  cars' specific show names and award placings"). The second car itself is still not identified —
  don't guess which of the other P1800 builds it is; only the resto-mod is confirmed.
- **Hero image brightness was too low for real (non-prototype) photography — fixed 2026-09-12.**
  `BuildDetailPage`'s top hero used a `brightness-[1.1]` filter plus two scrim gradients tuned
  against the two flagship pages' professionally lit prototype photography. Applied to the 8 thin
  builds' un-curated workshop snapshots, the car itself was hard to make out, not just the
  text-legibility area behind the title. Now `brightness-[1.35] saturate-[1.15]` with lighter scrim
  opacities (see the component's inline comment at the hero). If a future build's hero still reads
  too dark, this shared filter/scrim is the first thing to check, not a per-build fix.
- **Mobile nav is a real hamburger menu, not the prototype's scroll-triggered pill — changed
  2026-09-12.** The approved prototype's mobile pattern (a fixed "Contents" pill fading in at the
  bottom of the viewport once the hero scrolled out of view) was flagged by Ricky as unclear:
  invisible until you scroll, and its translucent dark fill blended into the page. Replaced in
  `components/site-header.tsx` with a standard always-visible hamburger button and a full-screen
  panel, following the same portal-to-`document.body`/Escape-to-close/body-scroll-lock pattern
  already established on NP Racing (`sites/npracing-v1/components/site-nav-mobile.tsx`). The phone
  number moved into this panel too — it no longer appears in the collapsed mobile header bar at
  all, only inside the menu and in the always-visible desktop nav (≥896px). Social icons
  (Instagram/Facebook/YouTube — same `siteConfig.business.socialMedia` set and icons as
  `site-footer.tsx`'s colophon, kept as a second small local map rather than a shared import)
  sit below the phone number in the panel, added the same day.
- **Homepage's bottom "one car, documented in full" link now points at `/library`**, not
  `/builds/p1800-candy` — copy changed to "See even more of our work" (2026-09-12, Ricky's
  request). It's the closing link after the credentials/proof section, distinct from each lot's
  own "The full record of the [car]" link earlier on the page, which still points at that car's
  own build page and was correctly untouched.
- **The Bentley S3 Continental's homepage section no longer has its own small "whole car"
  establishing shot ahead of its scroll photo — removed 2026-09-12.** This was a genuine,
  deliberate one-off in the approved prototype (`.section-hero`, verified only ever used once,
  for Bentley) — not a porting bug, and it rendered at an exact 16:9 on every width, measured
  live. But it made the Bentley section's first image read as a different size from the other
  three lots (P1800, DB6, E-type), none of which have an equivalent small photo — their first
  image is the same full-screen scroll photo Bentley's own `<Track>` already provides. Removed
  per Ricky's request rather than trying to add a matching small shot to the other three; the
  same "whole car" image is still shown, via the Track's own closing `resolve2` stage, exactly
  as before. If this section's spacing/structure ever looks wrong again, compare it directly
  against the P1800 section immediately above it — they're now structurally identical.
- **`sourcingGaps` frontmatter field** (`lib/content-schemas.ts`) flags facts a build's page
  genuinely doesn't have yet — rendered as a visible amber "Needs sourcing from David" notice
  (`components/sourcing-gap-notice.tsx`) on both the library card and the build page. Use this
  instead of a silent code comment or a guessed value whenever a real fact is missing; remove the
  gap entry (not just fill the fact) once David confirms it.
- **A build's confirmed `video` (YouTube id) now actually renders** — `BuildVideoSection` in
  `build-detail-page.tsx`, added 2026-09-12. It previously had a schema and had been confirmed by
  David for the Bentley S3 Continental, but nothing in the template rendered `fm.video` until this
  build-out pass, so the confirmed credit sat invisible even after `pageStatus` allowed the page to
  exist. Uses `youtube-nocookie.com` — `next.config.ts`'s CSP `frame-src` had to be widened to
  allow it, since a plain `youtube.com`/`youtu.be` iframe is silently dropped by CSP with no visible
  error (same class of bug as the root CLAUDE.md's other CSP notes).
- **Homepage's No. 03 slot is the Aston Martin DB6 ("the pink one"), not the Jaguar Sea Green**,
  swapped 2026-09-12 at Ricky's request — DB6 is a finished, delivered car ("Finished and
  delivered", matching No. 01/02's framing) rather than an in-progress one. Jaguar Sea Green is
  still in the library register as its own build, just no longer one of the homepage's four
  featured slots.
- **Colors and fonts in `theme.config.ts` are sourced from the approved static prototype**
  (`output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/src/library.html`'s CSS
  custom properties); fonts now load via `next/font` and the role-mapping has been exercised by
  real component usage across all shipped pages.
- **Several real business facts are not yet confirmed by David**: exact street address/postcode,
  opening hours, year established, certifications. Marked `TBC` or omitted in `site.config.ts`
  rather than guessed — do not fill these in with plausible-sounding values, ask David. (Instagram
  and YouTube handles were confirmed against the prototype source during the build-out and are now
  live in the footer/social links.)

### Still not done

- **A run of David-confirmation facts is still open**, tracked as `sourcingGaps` on the affected
  builds and visible on their pages: the singer's name for Pearl White P1800, the second car and
  both show names/award placings for the resto-mod's client pair, chassis numbers for Bentley S3
  1964 and Bentley S3 Continental, the Porsche 356 SC "might/minor mechanical rebuild" wording, the
  DB6's current race status and its magazine's exact title, and Jaguar Sea Green's status field
  (frontmatter says `completed`, the approved prototype's own copy for it says still in the
  workshop — one of these is wrong). Chase these with David before removing the corresponding
  `sourcingGaps` entries.
- **No homepage rotating-featured-build mechanism will be built — closed, 2026-09-12, not just deferred.** Ricky's decision: the homepage's four featured cars will be updated by hand (editing `home-page.tsx`/frontmatter directly, then redeploying) whenever the selection should change, occasionally rather than on a schedule. Do not propose or scope a CMS/admin/rotation feature for this — there is no such feature planned.
- **Contact form is not wired up** — `site.config.ts`'s `features.contactForm` flag is still
  `false`. Blocked on domain access: Ricky doesn't yet have the access needed to verify DPM's
  sending domain with Resend (`RESEND_FROM_EMAIL` needs a domain verified at
  resend.com/domains — see root `docs/standards/security.md`'s Environment Variables section).
  Not a coding task until that access exists.
- **Workshop page's hero will not carry a video — closed, 2026-09-12, not just deferred.** Ricky's
  decision: no film is planned; the hero will instead be updated with different/better photography
  when it's available. Do not scope a video-embed build for this page (the `BuildVideoSection`
  pattern added for individual builds — see `components/pages/build-detail-page.tsx` — has no
  workshop-page equivalent to build). When new hero photography arrives, it's a straightforward
  swap of `HERO_IMAGE` in `app/workshop/page.tsx`, not a structural change.
- **Known MEDIUM/LOW visual-fidelity follow-ups on the two flagship build pages**, next up per
  Ricky's direction 2026-09-12 (full list in the yolo-brief's "Completed" section): P1800 headline
  line-breaks don't exactly match the prototype; the P1800 plaque photo and one E-type pairing
  figure aren't full-bleed like the prototype; hero image crop/zoom differs slightly on a few
  panels; a portrait "trophy" photo on the E-type page is center-cropped in a 3:2 box instead of
  its natural aspect ratio (needs a content-schema change to carry real per-image intrinsic
  dimensions); minor social-icon glyph style (outline vs. filled) mismatch; a scroll-progress rail
  and film-grain overlay from the prototype were deliberately never ported (documented scope
  decisions, not defects).

## Legal pages

`/privacy-policy` and `/cookie-policy` existed since the base-template scaffold but were never
restyled — both were byte-identical to `base-template`'s own generic versions until 2026-09-12.
This wasn't just a fidelity gap: `bg-surface-subtle` (used throughout for card fills) has no
override in this site's `theme.config.ts`, so it fell back to the theme-system's light default
(`#f9fafb`, near-white), rendering a bright white "Contents" card on this all-dark site — a real
visible bug, not a nitpick. Restyled both to the same page-head pattern as `/library` (eyebrow
label, `font-heading` h1, `PAGE`-width container) using this site's real dark tokens
(`surface-card`/`surface-card-border`) throughout; dropped the `Breadcrumbs` component and its
wrapper bar (no other real DPM page uses a breadcrumb trail — the masthead's own back-link already
covers this). Content (the GDPR/cookie boilerplate itself, with real `siteConfig`/`contact-info`
data threaded through) was preserved as-is — this was a styling pass, not a content rewrite. If a
future `bg-surface-subtle`/`surface-border` usage turns up anywhere else on this site, check
`theme.config.ts` for an override before trusting it renders dark — the theme-system's light
defaults are the trap.

## Tests

`e2e/navigation.spec.ts` was deleted at scaffold time — it asserted against
services/locations nav links and footer that no longer exist, and a real rewrite needs the
real header/footer first. `e2e/accessibility.full.spec.ts`, `performance.full.spec.ts` and
`visual-regression.full.spec.ts` are still base-template's generic versions (opt-in via
`E2E_FULL=1`, not CI-gated for this site) — not yet updated for DPM's real pages either.
`e2e/smoke.spec.ts` now covers all six real routes (`/`, `/contact`, `/workshop`, `/library`,
`/builds/p1800-candy`, `/builds/etype-941pvo`) — extended from the original two (`/`, `/contact`)
once the other routes were built.

## Vercel

Live at **`dpm-autobody.vercel.app`**, project name `dpm-autobody` (`prj_A6RWtH01VGD9Yfmi1H2Ybmhpqzyf`).
Root directory `sites/dpm-autobody`, tracks `develop`. `vercel.json` carries the standard
`ignoreCommand`/`turbo-ignore` guard — see root `CLAUDE.md`.

**Naming history, 2026-09-11:** this project was first created as "dpm" because the obvious name
`dpm-autobody` was already claimed by the discovery-phase static-prototype project (live since
2026-08-29). Rather than leave that collision in place, both projects were renamed via the Vercel
API: the prototype became **`dpm-autobody-proto`** (now at `dpm-autobody-proto.vercel.app`,
`prj_klLuFWkCXJblYnoQ0Hyg7gruvWF2`), freeing `dpm-autobody` for this real site. See root
`CLAUDE.md`'s Vercel section for the standing rule this produced: prototype projects must always be
named `<site>-proto` from their first deploy. `prototype/publish.zsh`'s `PROJECT=` var was updated
to match. `NEXT_PUBLIC_SITE_URL` is set correctly to `https://dpm-autobody.vercel.app` (set via the
Vercel API, then a `vercel redeploy` to pick it up — the dashboard UI didn't persist the edit
reliably) — canonical/OG URLs and the sitemap all confirmed correct after redeploy.
