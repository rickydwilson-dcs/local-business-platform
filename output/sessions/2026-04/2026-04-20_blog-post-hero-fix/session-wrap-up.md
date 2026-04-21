# Session Wrap-Up: Blog Post Page Hero Fix

**Date:** 2026-04-20
**Session folder:** output/sessions/2026-04/2026-04-20_blog-post-hero-fix/
**Branch:** feature/blog-post-hero-fix
**Status:** Completed

## Goal

Fix three visual bugs on the `dj-fox-electrical-test` blog post page: single-column hero (no image), unwanted breadcrumbs in the hero, and raw category slugs displayed instead of human-readable labels.

## What Was Done

- Flipped `composition.json` blog-post `HeroSection` to `"align": "split"`, `showHeroImage: true`, `showBreadcrumbs: false` — enabling the two-column split layout with hero image
- Added `CATEGORY_LABELS` map to `app/blog/page.tsx` and substituted it in the posts array — listing grid cards now show "Industry Tips" not "industry-tips"
- Added the same `CATEGORY_LABELS` map to `app/blog/[slug]/page.tsx` and substituted it in the hero `eyebrow` field — hero badge now shows display label
- All three `pnpm type-check` gates passed; 3 commits on `feature/blog-post-hero-fix`

## Commits

- `c58900c` — fix(dj-fox-test): blog-post hero — split layout, show image, hide breadcrumbs
- `cc8d19c` — fix(dj-fox-test): blog listing — show pretty category labels not raw slugs
- `6a9a218` — fix(dj-fox-test): blog post hero — show pretty category label in eyebrow

## Files Changed

- `sites/dj-fox-electrical-test/composition.json` — blog-post hero slots + layout
- `sites/dj-fox-electrical-test/app/blog/page.tsx` — CATEGORY_LABELS + substitution
- `sites/dj-fox-electrical-test/app/blog/[slug]/page.tsx` — CATEGORY_LABELS + eyebrow substitution

## Supplemental Work

### Content-area font sizes scaled down by one step

All composable component fonts were consistently too large. Stepped every Tailwind `text-*` class down one increment across all 22 composable components and the `globals.css` typography utility classes. Header and footer files were left untouched.

**Commit:** `1df7365` — fix(composable): scale down all content-area font sizes by one Tailwind step

**Files changed:** `packages/core-components/src/components/composable/*.tsx` (22 files), `sites/dj-fox-electrical-test/app/globals.css`

**Implementation:** Perl placeholder-swap pattern (step all sizes to placeholders first, then resolve) prevents double-substitution when chaining multiple `text-*` replacements in a single pass.

---

## What Was Learned / Why It Matters

The `ComposableHeroSection` requires both `layout.align === "split"` AND `slots.showHeroImage === true` to render the image column — setting only one is silent (no image, no error). The category label pattern (a static map at page level, substituting before passing to the renderer) is the right approach for this composition architecture: the renderer is display-only, so label mapping belongs in the page data layer, not the component. This pattern should be applied to any future slug-to-label translations.
