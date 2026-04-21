# Session Wrap-Up: Fix Missing Hero on Detail Pages

**Date:** 2026-04-20
**Session folder:** output/sessions/2026-04/2026-04-20_detail-page-hero-fix/
**Branch:** feature/detail-page-hero-fix
**Status:** Completed

## Goal

Make the `ComposableHeroSection` visually present on `/services/[slug]` and `/locations/[slug]` by adding background, CTA buttons, and trust badges.

## What Was Done

- `composition.json`: added `layout.background: "subtle"` + `layout.align: "split"` + `showTrustBadges: true` to `service-detail` HeroSection; added `layout.background: "subtle"` to `location-detail` HeroSection
- `services/[slug]/page.tsx`: added `primaryCtaText/Href`, `secondaryCtaText/Href`, and `trustBadges` to the hero data object
- `locations/[slug]/page.tsx`: same CTA/trust badge additions; dropped the old dynamic `trustBadges` frontmatter lookup in favour of hardcoded defaults; removed redundant `image` key (kept `heroImageSrc`)

See `## Completed` in `yolo-brief.md` for the full per-phase summary.

## Commits

- `d194b9c` — fix(dj-fox-test): add layout background and split align to detail page heroes
- `605c504` — fix(dj-fox-test): add CTA buttons and trust badges to service detail hero
- `6a45f89` — fix(dj-fox-test): add CTA buttons and trust badges to location detail hero

## Files Changed

- `sites/dj-fox-electrical-test/composition.json`
- `sites/dj-fox-electrical-test/app/services/[slug]/page.tsx`
- `sites/dj-fox-electrical-test/app/locations/[slug]/page.tsx`

## What Was Learned / Why It Matters

The composition renderer's layout params (`background`, `align`) are the correct lever for visual hero differentiation — the data object only needs to supply CTA/badge content, not structural appearance. Hardcoding trust badges at the page level (rather than reading from MDX frontmatter) is the right default: it guarantees every detail page shows badges without requiring each MDX file to declare them, and frontmatter overrides can be layered in later if needed.

## Follow-On Tasks

- This branch (`feature/detail-page-hero-fix`) stacks on `feature/dev-site-card-link-parity` — both need to merge together or in order into develop
