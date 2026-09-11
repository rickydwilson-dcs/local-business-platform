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

- **Real pages, ported and visually verified.** Header, footer, home, workshop, contact, library,
  and two individual `/builds/[slug]` pages (P1800 Candy, E-type 941 PVO) are real React
  components built from the approved static prototype — no longer base-template placeholders.
  They went through a visual fidelity gate (Phase 7 of the build-out brief) that found extensive
  drift on first pass and required three further rounds of fixes before landing. See
  `output/sessions/2026-09/2026-09-08_dpm-autobody-build-out/yolo-brief.md`'s "Completed" section
  for the full root-cause detail (missing webfonts, a Tailwind mixed-units breakpoint bug that made
  the nav invisible, a genuinely missing "Enquiries" CTA section, and more) rather than repeating it
  here.
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

- **The other 10 builds in the library** have frontmatter only (photo-only or no body content yet)
  — per the brief's own honesty-pattern scope decision, they were deliberately not given full pages
  in this pass. They still need iCloud photo pulls, plate-redaction, and David's confirmations
  (chassis numbers, owner names, in-progress vs. completed status) before real pages can be built.
  See `session.md` Phase 3.
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
