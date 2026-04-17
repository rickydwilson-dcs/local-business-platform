# Session Wrap-Up: Tear Down Componentize Pass

**Date:** 2026-04-13
**Session folder:** output/sessions/2026-04-13_teardown-componentize/
**Branch:** feature/teardown-componentize
**Status:** Completed

## Goal

Remove the broken `--pass componentize` code path from `extract-theme.ts` and all its supporting infrastructure (clone CSS preprocessor, `<link>` tag bypass, Preflight disable), leaving the pipeline clean for a future `--pass translate` implementation.

## What Was Done

- Deleted `tools/lib/clone-css-preprocessor.ts` (383 lines) and `docs/architecture/how-clone-css-works.md`
- Stripped `tools/extract-theme.ts` from 997 → 369 lines by removing all componentize functions and the entire componentize pass block from `main()`; added `--pass translate` placeholder; default pass changed from `both` to `translate`
- Cleaned the corvus test site: removed `public/clone-assets/`, restored `@tailwind base` to `globals.css`, removed the clone CSS `<link>` from `layout.tsx`, removed `corePlugins: { preflight: false }` from `tailwind.config.ts`
- Replaced all corvus theme package clone JSX (1000+ line `@ts-nocheck` files) with clean typed stub components using theme tokens; replaced `globals.css` with proper `@apply`-based component classes

## Key Decisions

- **StubPages.tsx kept as-is** — spec explicitly said "keep the existing stub structure"; the `@ts-nocheck` there is consistent with its role as a placeholder for pages not yet in the clone
- **No new features** — pure deletion; the translate pass is a `console.log` placeholder pending its own implementation session

## Commits

- `dec3891` — chore(pipeline): delete clone CSS preprocessor and bypass docs
- `46732e4` — refactor(pipeline): remove --pass componentize from extract-theme
- `79df235` — chore(corvus): remove clone CSS loading workarounds from test site
- `317c8bd` — chore(corvus): replace clone JSX with clean Tailwind stubs

## Files Changed

- `tools/extract-theme.ts` — 721 lines removed, translate placeholder added
- `tools/lib/clone-css-preprocessor.ts` — deleted
- `packages/themes/corvus/globals.css` — replaced with `@apply` component classes
- `packages/themes/corvus/pages/` — 5 clone JSX files replaced with typed stubs
- `packages/themes/corvus/components/header.tsx`, `footer.tsx` — Tailwind stubs
- `sites/_corvus-digital-marketing-events/app/globals.css`, `layout.tsx`, `tailwind.config.ts` — clone workarounds removed

## What Was Learned / Why It Matters

The componentize approach (verbatim clone JSX + runtime `<link>` CSS bypass + Preflight disabled) was fundamentally at odds with the Next.js/Tailwind pipeline. Removing it in a single focused session was straightforward because the code was well-isolated — no shared functions between componentize and the rest of the pipeline. The corvus theme package now has the same structural contract as orion/vega: typed components, theme tokens, no bypasses. The platform is ready for the translate pass, which will generate native Tailwind components from clone reference material using AI vision analysis.

## Follow-On Tasks

- Implement `--pass translate` (see placeholder message in `tools/extract-theme.ts` pointing to `output/sessions/2026-04-13_translate-pipeline/`)
- Regenerate corvus theme components via `--pass translate` once implemented
