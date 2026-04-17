# Session Wrap-Up: Extract Pipeline Section Correlation

**Date:** 2026-04-16
**Session folder:** output/sessions/2026-04-16_extract-pipeline-correlation/
**Branch:** feature/extract-pipeline-correlation
**Status:** Completed

## Goal

Replace the extract-theme pipeline's fragile heading-match + index-fallback section correlator with a multi-signal scored algorithm using source-agnostic content signals.

## What Was Done

- Enriched `CloneSection` with content signals (`estimatedCategory`, `hasForm`, `imageCount`, `charCount`, `headingCandidates`, `isSpacerLike`) by integrating the existing `classifySection()` from html-structure-analyzer.ts
- Implemented scored correlation algorithm with 7 signal types: heading match (+50), category match (+30), keyword overlap (+10 each, max +30), form/image shape (+15 each), semantic tag (+10), spacer penalty (-50)
- Added mega-section detection (>5000 chars, 3+ headings) to prevent large composite sections from being claimed by multiple blueprints
- Updated `diagnose-clone-sections.ts` to display all new signals, scores, confidence levels, and mega-section warnings
- Added `EXTRACT_VERBOSE=1` logging to `extract-theme.ts` and verified with a full corvus translate run

## Key Decisions

- Chose to leave unmatched blueprints unenriched (blueprint-only generation) rather than forcing a bad match. This trades raw enrichment rate (100% -> 64%) for accuracy (0 misassemblies vs 2+ previously).
- Exported `classifySection()` and `countImages()` from html-structure-analyzer.ts rather than duplicating logic — widened visibility only, no restructuring.
- Keyword extraction tokenises PascalCase/camelCase names rather than relying on heading text, making it fully source-agnostic.

## Commits

- `e870201` feat(pipeline): enrich CloneSection with source-agnostic content signals
- `9ec7f7c` feat(pipeline): multi-signal scored section correlation
- `7a279c7` feat(pipeline): mega-section detection and safe single-assignment
- `0a766ec` feat(pipeline): diagnostic tool shows correlation signals and scores
- `3ca2201` feat(pipeline): integrate scored correlation into translate pass

## Files Changed

- `tools/lib/clone-section-extractor.ts` — core scoring algorithm and enriched CloneSection interface
- `tools/lib/html-structure-analyzer.ts` — exported `classifySection()` and `countImages()`
- `tools/lib/reference-analysis-types.ts` — added `matchScore`, `matchConfidenceLevel`, `matchBreakdown` to SectionBlueprint
- `tools/diagnose-clone-sections.ts` — full diagnostic rewrite with signals and scores
- `tools/extract-theme.ts` — verbose correlation logging after enrichment

## What Was Learned / Why It Matters

The old index-fallback correlation was the single biggest source of misassembled components in the extract-theme pipeline. The scored approach eliminates false-positive matches at the cost of leaving some blueprints unenriched — but blueprint-only generation produces better components than misassembled ones. The mega-section detection is particularly valuable for sites like corvus where a single HTML section contains content for multiple logical components (14K chars, 6 headings). This establishes a pattern where correlation quality can be incrementally improved by adding new signal types without changing the algorithm structure.

## Follow-On Tasks

- Footer detection fails on sites that use `<section>` instead of `<footer>` tags — consider adding footer-keyword detection as an additional signal
- The `--verbose` flag in diagnose-clone-sections only shows matched result, not top-3 candidates — would need `scoreMatch` exported to show full candidate ranking
- Consider tuning score thresholds based on a larger sample of clone sites beyond corvus
