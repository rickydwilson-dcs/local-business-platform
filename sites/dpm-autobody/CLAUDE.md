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
- **All 11 builds now have real `/builds/[slug]` pages** (`pageStatus: built`), as of a
  2026-09-12 pass. The two richest (P1800 Candy, E-type 941 PVO) use hand-written MDX bodies with
  the full "documented car" template (chapters, spec tables, plaques — see
  `components/pages/build-detail-page.tsx`'s file header). The other 9 use that same component's
  built-in thin-content fallback: no `##`-structured body needed, just frontmatter (`heroImage`,
  `galleryImages`, the structured facts) plus one or two plain paragraphs of prose reusing already-
  approved copy — the template auto-renders a "The record" fact panel and a trailing photo grid
  from that alone. Do not invent narrative for a thin build; reuse this fallback path instead of
  writing chapters the source material doesn't support.
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
  builds and visible on their pages: the singer's name for Pearl White P1800, show names/awards for
  the two-P1800s-one-client build, chassis numbers for Bentley S3 1964 and Bentley S3 Continental,
  the Porsche 356 SC "might/minor mechanical rebuild" wording, the DB6's current race status and
  its magazine's exact title, and Jaguar Sea Green's status field (frontmatter says `completed`,
  the approved prototype's own copy for it says still in the workshop — one of these is wrong).
  Chase these with David before removing the corresponding `sourcingGaps` entries.
- **Homepage rotating-featured-build mechanism** — not built; the homepage currently shows a
  static selection. Confirmed 2026-09-11: this does **not** need a client-editable admin
  capability — Ricky and Claude make homepage changes directly (editing config/frontmatter,
  redeploying), David never touches it. Scope any implementation accordingly; no CMS/admin UI
  work is needed here.
- **Contact form is not wired up** — `site.config.ts`'s `features.contactForm` flag is still
  `false`.
- **Workshop page's video hero** — not built; the film has not been delivered yet.
- **Known MEDIUM/LOW visual-fidelity follow-ups**, deliberately left open to stop iterating past
  diminishing returns (full list in the yolo-brief's "Completed" section): P1800 headline
  line-breaks don't exactly match the prototype; the P1800 plaque photo and one E-type pairing
  figure aren't full-bleed like the prototype; hero image crop/zoom differs slightly on a few
  panels; a portrait "trophy" photo on the E-type page is center-cropped in a 3:2 box instead of
  its natural aspect ratio (needs a content-schema change to carry real per-image intrinsic
  dimensions); minor social-icon glyph style (outline vs. filled) mismatch; a scroll-progress rail
  and film-grain overlay from the prototype were deliberately never ported (documented scope
  decisions, not defects).

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
