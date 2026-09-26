# Session: Delta T Racing site build

**Date:** 2026-09-26 · **Status:** Built, verified locally, awaiting Vercel project + review
**Branch / worktree:** `feature/delta-t-racing` in `.claude/worktrees/delta-t-racing`

## Brief

New site for Delta T Racing (motorcycle team, NOT the sim-racing brand at delta-t-racing.com),
sister/feeder team to NPRacing. Transform their Wix site (delta-t-racing.cc) into a copy of
npracing-v1 using the logo's blue instead of red. Straight to build (design already approved via
npracing). Must be go-live-ready with limited content. Client: Gene Goodrum (also Autcobel).

## Source material captured (delta-t-racing.cc, 2026-09-26)

- Pages: Home (welcome, Oulton Park R2 report, "Where are we?", sponsors), About Us, Racers
  (images only, no text), The Gallery (effectively empty — two archive labels), Sponsors (on home).
- 15 images: 8 rider/track photos (mostly 1024px), 4 sponsor logos, 2 logo files, Bemsee 2026
  calendar graphic. Originals + optimised versions in `assets/` (gitignored; on R2 under
  `delta-t-racing/`).
- Contact: Delta-T-Racing-UK@proton.me. Rider Instagram: @lj650.88 (Lance), @d_jordan25 (Dylan).
- Sponsor links on the old site: emersoncranes.com, cartisgroup.co.uk. MCCS / CEJ Resource: none.

## Decisions

- **Colour:** `#113A93` (most frequent blue pixel in the logo PNG) for all fills. As text on the
  dark UI it's 1.93:1, so text accents use a 40% white tint `#7089BE` (≥4.93:1). Flagged to the
  user as a derived colour for their decision. Logo red `#D30306` stays inside the logo only.
- **Logo** sits on a light plate in the nav/footer rather than being recoloured.
- **Four riders, not one:** single-rider spotlight replaced by a rider grid; brand schema loses
  raceNumber/riderName; team schema gains raceNumber/bike/instagram.
- **New `races` content type** for the Bemsee calendar; "next up" computed client-side.
- **Dropped:** merch (none), video (none), crew page (riders only).
- **JSON-LD:** local SportsTeam node — shared LocalBusiness generator needs geo we don't have.
- **Contact form off** until Resend/CSRF env vars exist; contact page leads with email.
- **Fonts:** kept identical to live npracing-v1 (system fallback). npracing-v1 has never actually
  loaded Barlow/Barlow Condensed despite its theme comment — reported to the user, not fixed.
- Nothing claimed that the source didn't say: no layouts for Oulton/Cadwell (calendar doesn't
  name them), no per-rider classes, no bike for Gene/Lance/Dylan, no NPRacing mention on-site.

## Verification

- type-check, lint, vitest (34 tests incl. new content-integrity suite), content validation,
  `turbo run build --filter=delta-t-racing` — all pass.
- `next start` on :3007: all 12 routes 200, unknown route 404. Desktop visual pass on every page.
  Playwright 390px: no horizontal scroll on 7 routes; mobile menu dialog measures 390×844.

## Outstanding

- Vercel project creation + first deploy; `NEXT_PUBLIC_SITE_URL` env.
- Content asks: `CONTENT-STATUS.md`.
