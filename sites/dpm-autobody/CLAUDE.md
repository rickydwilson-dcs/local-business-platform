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

## Current state (as of the 2026-09-11 scaffold)

- **Scaffold only.** `app/page.tsx` / `components/pages/home-page.tsx` and `app/contact/page.tsx`
  are still base-template's generic placeholder layouts, stripped of dead links to deleted routes
  but not yet rebuilt with DPM's real design. The `/workshop` and `/library` routes referenced in
  `site.config.ts`'s nav do not exist yet — that's the next pass.
- **Colors and fonts in `theme.config.ts` are sourced from the approved static prototype**
  (`output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/src/library.html`'s CSS
  custom properties) but the role-mapping (which token feeds primaryHover vs. secondary, etc.)
  hasn't been verified against real component usage — see the comment block in that file.
- **Several real business facts are not yet confirmed by David**: exact street address/postcode,
  opening hours, year established, certifications, Instagram/YouTube handles. Marked `TBC` or
  omitted in `site.config.ts` rather than guessed — do not fill these in with plausible-sounding
  values, ask David.
- The real header/footer/homepage/workshop/library/build-page design (near-black ground,
  auction-lot-page structure, paint-code accent) still needs to be ported from the static
  prototype into real React components — see build-out `session.md` Phase 1 (remaining) onward.

## Tests

`e2e/navigation.spec.ts` was deleted at scaffold time — it asserted against
services/locations nav links and footer that no longer exist, and a real rewrite needs the
real header/footer first. `e2e/accessibility.full.spec.ts`, `performance.full.spec.ts` and
`visual-regression.full.spec.ts` are still base-template's generic versions (opt-in via
`E2E_FULL=1`, not CI-gated for this site) — not yet updated for DPM's real pages either.
`e2e/smoke.spec.ts` was trimmed to the two routes that currently exist (`/`, `/contact`).

## Vercel

Live at `dpm-ecru.vercel.app`, project name **"dpm"** (not `dpm-autobody` — that name is already
taken by the `dpm-autobody.vercel.app` static-prototype project, which is untouched and keeps
serving the discovery-phase HTML prototype until this real site is ready to cut over). Root
directory `sites/dpm-autobody`, tracks `develop`. `vercel.json` carries the standard
`ignoreCommand`/`turbo-ignore` guard — see root `CLAUDE.md`.

`NEXT_PUBLIC_SITE_URL` is not yet set on the project (an attempt to set it via the dashboard didn't
persist) — production currently falls back to the `http://localhost:3000` default in
`site.config.ts`, which only affects `metadataBase`/OG/canonical URLs, not functionality. Set it to
`https://dpm-ecru.vercel.app` (via `vercel env add` or the dashboard) before this URL is shared
with anyone.
