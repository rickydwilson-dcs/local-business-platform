# Session Wrap-Up: Two-Pass Theme Extraction (Componentize → Strip)

**Date:** 2026-04-13
**Session folder:** output/sessions/2026-04-13_extract-theme-verify-strip/
**Branch:** feature/extract-theme-verify-strip
**Status:** Completed

## Goal

Implement a two-pass extraction system in `tools/extract-theme.ts` so the pipeline preserves the clone's actual JSX markup (componentize pass) before stripping business-specific content to produce a reusable theme shell (strip pass).

## What Was Done

- Added `--pass componentize|strip|both` CLI flag to `extract-theme.ts`; default is `both`
- **Componentize pass**: reads clone JSX pages, extracts header/footer, wraps markup in `// @ts-nocheck` components preserving Breakdance class names and layout structure
- **Strip pass**: replaces heading text and long paragraphs with `{props.heading}`, `{props.sectionTitle}`, `{props.body}` etc.; skips any file without `// @ts-nocheck` (typed stubs + fallback footer)
- Fixed `sanitizeForJsx()` balanced-brace scanner to remove Breakdance `data-options="{json}"` attributes that caused JSX parse errors
- Fixed all 13 corvus page stubs and barrel to use proper `*TemplateProps` from core-components; fixed `CorvusBlogPage` → `CorvusBlogListPage` import in the test site

## Key Decisions

- **`@ts-nocheck` as the componentize marker**: using this header to distinguish generated-from-clone pages from hand-authored typed stubs avoids a separate metadata file and is self-documenting. Strip pass checks for this marker before processing.
- **Guard components as well as pages**: initially the strip pass unconditionally processed `header.tsx` and `footer.tsx`, damaging the fallback footer stub (which has no clone markup and no `@ts-nocheck`). Fixed to apply the same guard.
- **Brief business name mismatch**: the brief's `business.name` ("Digital Marketing Weekend") doesn't match the clone's visible text ("ColorCode Events"). The stripper replaces what it finds (headings, paragraphs, emails, addresses) — remaining `ColorCode` references are in image paths, URLs, and `alt` attributes which are structural and not stripped generically. Acceptable for v1.
- **Barrel generated from all `.tsx` files**: initial implementation generated the pages barrel only from clone pages (missing 8 typed stubs). Fixed to scan the full pages directory after writing.

## Commits

- `1af7fb1` — fix(corvus): update page stubs with proper template prop types
- `ebbf24c` — feat(pipeline): add --pass flag to extract-theme CLI
- `d587d81` — feat(pipeline): implement componentize pass — preserve clone JSX
- `4cf27c3` — feat(corvus): regenerate theme with componentized clone markup
- `0cb6425` — feat(pipeline): implement strip pass — skip typed stubs, guard components
- `b88e6b6` — feat(corvus): apply strip pass — replace clone content with props
- `21e2360` — feat(corvus): final both-pass — componentize + strip end-to-end verified

## Files Changed

- `tools/extract-theme.ts` — core rewrite: `--pass` flag, `sanitizeForJsx()`, `generatePageLayoutFromClone()`, `generateHeaderFromClone()`, `generateFooterFromClone()`, strip pass with `@ts-nocheck` guard
- `packages/themes/corvus/pages/HomePage.tsx` — 1122-line componentize+strip result from colorcode.events clone
- `packages/themes/corvus/pages/{AboutPage,BlogListPage,BlogPostPage,CustomPage}.tsx` — componentize+strip from clone
- `packages/themes/corvus/components/header.tsx` — componentize from clone (Breakdance markup)
- `packages/themes/corvus/pages/index.ts` — barrel now exports all 13 pages
- `packages/themes/corvus/pages/{ContactPage,LocationDetailPage,...}.tsx` — restored proper typed `*TemplateProps`
- `sites/_corvus-digital-marketing-events/app/blog/page.tsx` — fix `CorvusBlogListPage` import

## What Was Learned / Why It Matters

The componentize pass is the critical missing piece in the clone→theme pipeline: without it, the extract step threw away the clone's actual layout and generated empty stubs, making visual verification impossible. With it, the pipeline now produces a "clone of the clone" — a renderable Next.js component tree that faithfully reproduces the reference site's structure using the clone's Breakdance JSX. The `@ts-nocheck` marker as a generation sentinel is a lightweight but effective pattern: it lets the strip pass distinguish generated files from hand-authored ones without any external metadata, and it keeps the componentize-generated files from polluting the TypeScript type graph. The main unresolved limitation is that business-name stripping only works when the clone text matches the brief's `business.name` exactly — URLs, image paths, and `alt` text containing the old brand remain.

## Follow-On Tasks

- Strip pass could be extended to replace image src paths (not just `assets/images/` pattern) and `alt` attribute values with props — would get `ColorCode` count to 0
- Visual QA gate between componentize and strip passes (Phase 3 in the brief) was not implemented — a screenshot diff against the reference would confirm fidelity before stripping
- Brief auto-discovery when using `--clone` without `--brief` would make strip more effective (currently `businessName` defaults to `""` when brief is omitted)
