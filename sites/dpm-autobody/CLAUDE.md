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
- **All real builds have real `/builds/[slug]` pages** (`pageStatus: built`), as of a 2026-09-12
  pass. (`p1800-pair-one-client` was removed 2026-09-12, `jaguar-sea-green` on 2026-09-15 at
  David's request, and a new `volvo-262c` build was added 2026-09-16 — see below for both — so the
  library is 10 builds, not the 9, 11 or 12 earlier notes in this file describe; check
  `LIBRARY_ORDER` in `app/library/page.tsx` for the current authoritative count and order, not this
  prose.) The two
  richest (P1800 Candy, E-type 941 PVO) use hand-written MDX bodies with the full "documented car"
  template (chapters, spec tables, plaques — see `components/pages/build-detail-page.tsx`'s file
  header). The other 8 use that same component's built-in thin-content fallback: no
  `##`-structured body needed, just frontmatter (`heroImage`, `galleryImages`, the structured
  facts) plus one or two plain paragraphs of prose reusing already-approved copy — the template
  auto-renders a "The record" fact panel and a trailing photo grid from that alone. Do not invent
  narrative for a thin build; reuse this fallback path instead of writing chapters the source
  material doesn't support.
- **New `volvo-262c` build added 2026-09-16** — a rare model David restored for a repeat client,
  the first of David's 2026-09-15 batch that was a genuinely new car rather than a content update
  to an existing one. Uses the same thin-content fallback as the other 8. Chassis number is still
  `TBC` (David left it blank in his email) — tracked as `sourcingGaps`, not guessed.
- **Workshop page gained a "Workshop atmosphere" section, 2026-09-16** (`app/workshop/page.tsx`,
  `WORKSHOP_ACTION_PHOTOS`) — 8 photos selected from the 19-photo `workshop-action` album David
  sent, deliberately not tied to any one build ("atmosphere and craft, not 'here's car X being
  welded'", his own framing from the 2026-09-08 and 2026-09-15 conversations). Includes the
  workshop dog photo David specifically asked for. This is a separate thing from the workshop
  page's hero, which still has no video planned — see "Still not done" below.
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
- **`videoLinks` frontmatter field** — thumbnail link-out cards to YouTube, added 2026-09-12
  (`BuildVideoLinksSection` in `build-detail-page.tsx`) as the alternative to `video` for a build
  with more than one video, or raw/unedited footage a straight embed would oversell. First use:
  the resto-mod's three-part restoration video (David's own footage, confirmed amateur, not
  professional — meeting transcript, 2026-09-07). Thumbnails come from `i.ytimg.com`, YouTube's own
  thumbnail CDN — this needs **two separate** allow-lists in `next.config.ts`, not one: the CSP
  `img-src` directive, and `images.remotePatterns` for `next/image` itself. Missing either one
  fails differently (CSP silently drops the image with no console error; a missing
  `remotePatterns` entry throws a loud "Invalid src prop... hostname is not configured" runtime
  error) — both were needed here, confirmed by hitting the second error live after fixing the
  first.
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
  builds and visible on their pages: chassis numbers for the new Volvo 262C and for the Red P1800
  (both still `TBC`), the resto-mod's second client pair (a different client from Tonja/Ahmet, two
  P1800s, show names and award placings — still unidentified), and the DB6's magazine's exact
  title. Chase these with David before removing the corresponding `sourcingGaps` entries.
  - **Resolved 2026-09-15:** the DB6's race status and pre-crash livery — David confirmed it
    hasn't raced since the crash (still due to) and that the crash photos show its original
    livery, not yet replaced with the new pink-request design. Both `sourcingGaps` entries removed
    from `aston-martin-db6-pink.mdx` and its copy updated to state both facts directly.
  - **Resolved 2026-09-15:** the Pearl White P1800's "well-known singer" previous owner was
    wrong — David says it never happened, likely confused with a Rolls-Royce DPM restored for
    Julie Andrews. Claim removed from `p1800-pearl-white.mdx` entirely, not just the
    `sourcingGaps` note.
  - **Resolved 2026-09-15:** the resto-mod's "one of two P1800s, one client" pairing was also
    wrong — David confirmed that story belongs to a different client entirely (still awaiting
    their show names/awards, tracked separately, not as a fact about the resto-mod).
    `p1800-candy-restomod.mdx`'s `sourcingGaps` entry removed; its `scopeOfWork` now states the
    correction directly.
  - **Resolved 2026-09-15 (re-confirmed):** Porsche 356 SC's mechanical rebuild is "minor" — David
    confirmed this again independently, matching the 2026-09-12 confirmation already in the copy.
    No `sourcingGaps` entry existed for this; noted here only because the CLAUDE.md text above had
    drifted and still listed it as open.
  - **Resolved 2026-09-16:** Bentley S3 1964's and Bentley S3 Continental's chassis numbers,
    supplied by David 2026-09-15 (**BC60 XC** and **BC66 XA** respectively), are now applied in
    both MDX files — no longer just noted in `BACKLOG.md`.
  - **Resolved 2026-09-16 (photo evidence, not inference):** the "Porsche SC" album's ambiguity —
    whether it was the same car as the live `porsche-356-sc.mdx` or a second model — turned out to
    contain `IMG_0304.jpg`, the exact filename already used as that build's `heroImage`, confirming
    same car. Its photos were folded into `porsche-356-sc.mdx`. The album also contained a second,
    distinct white bare-shell 356 not documented anywhere on the site — not acted on, flagged in
    `BACKLOG.md` in case it's a separate, unannounced build worth asking David about.
- **`jaguar-sea-green` was removed entirely, 2026-09-15** — David's own call: "an old not
  particularly well documented restoration," not worth chasing sourcing facts for.
- **OPEN — a DB6 photo batch may or may not be genuinely new, needs a real answer from David, not
  just the flag.** David's 2026-09-15 email said this build's correction was "no new photos," but
  the batch photo pipeline received a 15-photo `db6-pink-2026-09` album keyed to it anyway. 6 of
  those 15 filenames match ones already live in the gallery; the other 9 show no clearly new
  content. Zero photos were added from it — this is a live `sourcingGaps` entry on
  `aston-martin-db6-pink.mdx`, not just a note here; don't add photos from that album without
  checking with David first.
- **A live plate-exposure incident, fixed 2026-09-17, worth knowing the shape of.** The 2026-09-16
  automated redaction pass missed a fully legible plate ("723 HYK", on a shelf in the background,
  not on the car) in `p1800-red-2026-09/redacted/IMG_1601.jpg`. The photo hadn't been used in any
  gallery, but the _unredacted_ file had already been uploaded to R2 by that pass's upload step
  regardless — confirmed live via `headFile`, publicly reachable even though unlinked. Fixed by
  hand: redacted with `tools/plate-redact/apply.py`, then — per this platform's R2 cache-busting
  rule (root `CLAUDE.md`) — uploaded under a **new** key (`.../IMG_1601-redacted.jpg`) rather than
  overwriting the exposed one, and deleted the old object outright rather than leaving it live-but-
  unlinked. Lesson for any future redaction batch: the "not used in a gallery, so nothing live is
  affected" assumption is wrong whenever the upload step runs over every file in a `redacted/`
  folder rather than just the ones actually referenced in MDX — check R2 directly, not just the
  page.
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
