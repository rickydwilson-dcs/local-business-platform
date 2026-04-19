# Session Wrap-Up: Pipeline Prompt Fixes — Inline Styles, Placeholders, Font Loading, Section Markers

**Date:** 2026-04-17
**Session folder:** output/sessions/2026-04/2026-04-17_pipeline-prompt-fixes/
**Branch:** feature/design-brief-pipeline
**Status:** Completed

## Goal

Fix four prompt-engineering gaps identified after the first real navagarden.hu pipeline run: inline style leakage, external placeholder URLs, missing font loading in the test site, and JS-style section markers.

## What Was Done

- Added `### Typography Rule` block to `buildConstraintsBlock()` banning `style={{fontFamily, fontSize, letterSpacing}}` and specifying when inline style IS acceptable (geometry, CSS custom properties only)
- Updated `buildTypographyBlock()` to append an explicit instruction to use `className` token classes, never inline style
- Added `/images/placeholder.jpg` ban to `buildLayoutConstraintsBlock()` — default prop values must use local path, never Unsplash/picsum
- Strengthened Section Markers instruction to require JSX `{/* SECTION: id */}` block comments, with explicit "NOT `// SECTION: id`" wording; updated both `impeccable-adapter.ts` and `generic-adapter.ts`
- Added `writeTestSiteLayout()` helper to `design-brief-generator.ts`: checks brief fonts against a `GOOGLE_FONTS` allowlist, builds a Google Fonts CSS URL, and writes `sites/{name}-test/app/layout.tsx` with `<link>` tags after generation

## Key Decisions

- **Font loading via `<link>` tags, not CSS `@import`**: consistent with the platform rule that `@import url()` in CSS is silently ignored by the Tailwind pipeline — must use `<link>` in `layout.tsx`
- **GOOGLE_FONTS allowlist approach**: commercial/unknown fonts get an HTML comment note instead of a broken link; the allowlist is intentionally conservative and easy to extend
- **Typography Rule in system prompt** (via `buildConstraintsBlock`) rather than user prompt: constraints that apply to all output belong with the persona/role instructions Claude receives at conversation start

## Commits

- `f655074` — fix(pipeline): ban inline styles/external images, strengthen section markers
- `fe853c8` — fix(pipeline): write test site layout.tsx with Google Fonts link after generation
- `f2cbb26` — fix(pipeline): add missing Typography Rule block to buildConstraintsBlock

## Files Changed

- `tools/lib/design-skills/shared-constraints.ts` — Typography Rule block, buildTypographyBlock sentence, placeholder ban, Section Markers header + body
- `tools/lib/design-skills/adapters/impeccable-adapter.ts` — generation instruction update
- `tools/lib/design-skills/adapters/generic-adapter.ts` — generation instruction update
- `tools/lib/design-brief-generator.ts` — `GOOGLE_FONTS` set, `buildGoogleFontsUrl()`, `writeTestSiteLayout()`, call site at end of `generateFromBrief()`

## What Was Learned / Why It Matters

Parallel Python write scripts on the same file have a race condition even when the logical changes touch separate functions — the last write wins and silently drops earlier changes. All `shared-constraints.ts` mutations in a single session should be serialised through one Python script (or one Edit call). The race was caught during Phase 4 prompt verification (`Typography Rule present: FAIL`), confirming the value of the automated check gate in the brief.

## Follow-On Tasks

- Re-run the navagarden pipeline with these prompt fixes to verify inline style leakage is resolved in generated output
- Extend `GOOGLE_FONTS` allowlist in `design-brief-generator.ts` as new fonts appear in briefs
