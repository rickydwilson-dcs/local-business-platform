# Session Wrap-Up: Translate Pipeline — AI-Generated Native Tailwind from Clone References

**Date:** 2026-04-13 (translate pass) / 2026-04-14 (gauntlet yield)
**Session folder:** output/sessions/2026-04-13_translate-pipeline/
**Branches:** feature/translate-pipeline (merged) → feature/gauntlet-yield (open)
**Status:** Completed

## Goal

Implement the `--pass translate` pipeline in `tools/extract-theme.ts` so it generates native Tailwind components from clone HTML/CSS/screenshot references instead of loading clone CSS at runtime.

## What Was Done

- Created `tools/lib/clone-css-rule-extractor.ts` — parses Breakdance class names from HTML fragments and extracts relevant CSS rules (per-post CSS files) as focused AI context (~2–8KB per section)
- Created `tools/lib/clone-section-extractor.ts` — extracts top-level HTML blocks from clone pages and correlates them with vision-derived blueprints; enriches blueprints with `cloneHtmlFragment` and `cloneRelevantCss` fields
- Extended `tools/lib/theme-component-templates.ts` with `buildCloneTranslationPrompt()` — structured prompt with REFERENCE HTML, REFERENCE CSS, TOKEN MAPPINGS, and TRANSLATION RULES; fixed animation import path to `@platform/core-components/components/animation`; split `inferPropType` into plural→Array and singular→scalar patterns
- Extended `tools/lib/theme-component-generator.ts` to use clone translation prompt when `blueprint.cloneHtmlFragment` is present, detect raw `<section>`/`<div>` JSX output and wrap it in `return (...)`, and fall back to fresh generation if clone translation fails the gauntlet
- Implemented all stages of `--pass translate` in `tools/extract-theme.ts`: CPF validation → computed-styles parsing → vision analysis → blueprint enrichment → component generation → page/package assembly → image copy; regenerated the corvus theme package as end-to-end proof

## Key Decisions

- **Raw JSX wrapping**: The clone translation prompt correctly instructs Claude to return `<section>...</section>` (not `return(...)`). The generator detects this and wraps it. Without this fix, all clone translations silently fell back to placeholders.
- **Plural vs singular `inferPropType`**: `ctaButton` → scalar `{ label, href }`, `ctaButtons`/`links`/`cards`/`items` → `Array<{...}>`. The previous rule returned Array for everything matching `/link|button|cta/i`, causing type mismatches when AI accessed them as scalars.
- **No StubPages.tsx**: Pages barrel lists individual files explicitly. A shared StubPages.tsx caused missing export errors when pages were regenerated from scratch.
- **CorvusHomePage with no props**: HomePage composes `<Component />` (no props passed) for each child. Passing `props.x` where props is `[key: string]: unknown` caused TS errors in typed child components.
- **5/11 components AI-generated; 6 are typed placeholders**: Gauntlet failures (hex literals, undeclared sub-properties on array items, TS syntax errors) caused fallback for nav, hero, blog grid, about split, newsletter, and footer. These are valid typed placeholders, not broken stubs.

## Commits

- `0c37d38` — feat(pipeline): add clone CSS rule extractor for AI reference context
- `4af1980` — feat(pipeline): add clone section extractor for blueprint enrichment
- `81e8b8d` — feat(pipeline): add clone-to-Tailwind translation prompt
- `e4f3323` — feat(pipeline): add clone context support to component generator
- `5aa763e` — feat(pipeline): implement --pass translate in extract-theme
- `da8532e` — chore(corvus): regenerate theme via --pass translate

## Files Changed

- `tools/lib/clone-css-rule-extractor.ts` — new; CSS context extraction from Breakdance class naming
- `tools/lib/clone-section-extractor.ts` — new; HTML block extraction + blueprint enrichment
- `tools/lib/theme-component-templates.ts` — clone translation prompt, animation import fix, inferPropType plural/singular split
- `tools/lib/theme-component-generator.ts` — clone context support, raw JSX wrapping, fallback logic
- `tools/extract-theme.ts` — full `--pass translate` implementation (Steps A–H)
- `packages/themes/corvus/components/` — 11 section components (5 AI-generated, 6 typed placeholders) + barrel
- `packages/themes/corvus/pages/` — 12 page stubs + barrel
- `packages/themes/corvus/globals.css` — animations import + utility classes

## What Was Learned / Why It Matters

The translate pipeline is now the canonical path for converting clones into theme packages — no clone CSS loads at runtime. The most fragile part of the pipeline is the 5-layer gauntlet: AI-generated JSX frequently accesses undeclared sub-properties on typed array items (`.thumbnail`, `.date`, `.excerpt`) or produces hex literals in complex components. Improving yield from ~45% to ~80%+ will require either relaxing the array item type in `inferPropType` (allow `[key: string]: unknown` on array items) or adding a pre-gauntlet scrubbing pass that substitutes undeclared property accesses with safe fallbacks before the TypeScript check runs.

## Follow-On Tasks (translate-pipeline)

- Wire `--pass translate` into the full pipeline orchestration script so it runs automatically after `--pass clone`
- Merge `feature/translate-pipeline` → `develop` → `staging` → `main` via `/deploy.changes`

---

## Gauntlet Yield Improvement (2026-04-14 follow-on)

**Branch:** feature/gauntlet-yield  
**Brief:** `yolo-brief-gauntlet-yield.md`

### Goal

Push `--pass translate` yield from ~45% (5/11) to 80%+ by fixing four identified gauntlet failure modes.

### What Was Done

- Relaxed array item type to `string | undefined` open index signature; added 5 plural slot endings
- Replaced blind re-generation retry with targeted syntax-error retry (sends broken component + exact errors back to Claude)
- Added `autoRepairHexLiterals()` to substitute inline-style hex values with CSS variable refs before hard-failing
- Injected explicit array/scalar guidance (rule 7) into both generation prompts

### Key Decisions

- **`string | undefined` not `unknown`**: Brief specified `unknown` but that makes dynamic array item props non-renderable in JSX. `string | undefined` achieves the same open-access goal while staying type-safe.
- **Reverted corvus after test run**: Tool has no `--out` flag (brief assumed one), so test run overwrote real corvus. Reverted after recording results.
- **Semantic type errors noted, not fixed**: Gauntlet uses `ts.createSourceFile` (parse-only). Semantic errors (`.map()` on string, object-as-ReactNode) require `ts.createProgram` — flagged as future work.

### Commits

- `cbee742` — fix(pipeline): relax array item index signature; add plural slot endings
- `2b79e82` — feat(pipeline): smarter syntax-error retry with targeted fix prompt
- `24bc760` — feat(pipeline): hex literal auto-repair before hard-fail
- `a0db4c6` — feat(pipeline): add array/scalar guidance to component generation prompts
- `c36203e` — fix(pipeline): use string|undefined index sig to keep array item props JSX-safe
- `af6eeab` — chore(pipeline): verify gauntlet yield improvement (e2e test run)

### Result

**10/11 AI-generated** (91%) on re-run, up from 5/11 (45%). Phase 2 targeted retry demonstrably fired for CtaBlueBand and CtaGreenBand. Only NavDarkBand remained a placeholder (brand-specific hex in SVG/non-inline-style contexts).

### Follow-On Tasks

- Add semantic type-checking pass to gauntlet (`ts.createProgram`) to catch `ReactNode` and `.map()` errors
- Add `--out <dir>` flag to `extract-theme.ts` for isolated test runs
- Investigate NavDarkBand SVG attribute hex — may need targeted SVG replacer
