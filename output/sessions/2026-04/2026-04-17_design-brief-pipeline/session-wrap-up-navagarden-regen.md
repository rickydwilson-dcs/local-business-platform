# Session Wrap-Up: Navagarden Regen — Design Brief Pipeline

**Date:** 2026-04-17
**Session folder:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/
**Branch:** feature/design-brief-pipeline
**Status:** Completed

## Goal

Regenerate the navagarden theme using the impeccable skill (skipping harvest/compile, already done) and produce a working test site with a screenshot.

## What Was Done

- **Discovered and fixed a pipeline dedup bug:** Claude opus outputs 2–3 section markers per component (stub skeleton first, real JSX later). Generator was keeping the last-written file (always a stub). Fixed in `tools/lib/design-brief-generator.ts` by deduplicating on **longest TSX per section ID** after `normalizeOutput()`.
- **Fixed 6 generated components:** All used undefined type aliases (`NavigationProps`, `HeroSplitProps`, etc.) and referenced `RevealOnScroll` without import. Reconstructed each with proper exported interfaces and animation imports.
- **Patched `packages/themes/navagarden/index.ts`:** Added missing `overlay`, `semantic`, `brand.onPrimary`, 4 surface tokens, and `small`/`caption` typography scale entries.
- **Scaffolded `sites/navagarden-test`:** Copied from base-template; wired `ThemeProvider`, `navagardenRegistry`, navagarden CSS, and navagarden `HomePage`. Added missing `pages/index.ts` barrel.
- **Fixed `use-scroll-parallax.ts`** in core-components: missing `"use client"` caused RSC build failure when navagarden components imported from the animation index.
- **Build passed** (32 static pages, 3.8s compile) and full-page screenshot captured at `output/briefs/navagarden/generated-regen-screenshot.png`.

## Key Decisions

- **Longest-wins dedup over first-wins:** Claude's first section marker is always an interface-only stub; the real implementation comes in a later marker. Keeping the longest TSX string reliably selects real content without parsing semantic structure.
- **`"use client"` on `use-scroll-parallax.ts`:** The hook used only client APIs; the directive was simply missing. Fixing it in core-components is cleaner than rerouting imports in every consumer.
- **TPV-004 validator finding accepted as false positive:** All themes share `packages/themes/package.json` — no per-theme package.json is the existing pattern.
- **Simplified navagarden-test layout:** The generated `HomePage` already composes all 6 sections including nav/footer. The test site layout wraps only with `ThemeProvider` to avoid duplicate header/footer.

## Files Changed

| File                                                                       | Change                                                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `tools/lib/design-brief-generator.ts`                                      | Added longest-wins section dedup after normalizeOutput                  |
| `packages/themes/navagarden/index.ts`                                      | Added overlay, semantic, onPrimary, surface tokens, small/caption scale |
| `packages/themes/navagarden/components/*.tsx`                              | All 6: added interfaces, RevealOnScroll imports, cleaned artifacts      |
| `packages/themes/navagarden/components/index.ts`                           | Added NavagardenHeader/Footer aliases with prop type exports            |
| `packages/themes/navagarden/pages/index.ts`                                | Created missing barrel for subpath export                               |
| `packages/core-components/src/components/animation/use-scroll-parallax.ts` | Added "use client" directive                                            |
| `sites/navagarden-test/`                                                   | New test site wired to navagarden theme                                 |

## What Was Learned / Why It Matters

The core discovery: Claude opus generates section content multiple times in a single response — first a minimal stub/interface skeleton as a "plan", then the real JSX implementation. The `normalizeOutput` marker regex finds all markers, producing 2–3× more sections than expected, and the generator was last-write-wins per section ID (stubs always won). The **longest-TSX dedup strategy** is now robust against this pattern regardless of how many retries Claude includes in its output. This fix unblocks the generation pipeline for all impeccable and generic adapter runs.

## Follow-On Tasks

- The navagarden theme uses Unsplash placeholder images — replace with real property photos before production use.
- Gallery images appear as broken icons in screenshot (Unsplash URLs require network at render time) — acceptable for test site.
- Consider committing the dedup fix and `use-scroll-parallax.ts` `"use client"` fix to a PR — they benefit all pipelines, not just navagarden.
