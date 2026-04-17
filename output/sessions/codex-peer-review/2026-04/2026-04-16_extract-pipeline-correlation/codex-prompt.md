# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04-16_extract-pipeline-correlation/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-16_extract-pipeline-correlation/
```

---

## Brief: Source-Agnostic Section Correlation for Extract-Theme Pipeline

**Date:** 2026-04-16
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The extract-theme pipeline (`tools/extract-theme.ts --pass translate`) converts cloned website HTML into React/Tailwind theme components. It works in two stages: (1) a vision API analyses a screenshot and produces "section blueprints" (JSON descriptions of each visual section), then (2) an enrichment step correlates those blueprints with actual HTML `<section>` blocks from the clone, so the LLM has real markup to translate.

The correlation step is the weakest link. Currently it tries:

1. **Heading-text match** — fuzzy case-insensitive substring between blueprint name and HTML section heading
2. **Index fallback** — if heading match fails, map blueprint N to HTML `<section>` N

Both strategies are fragile and source-specific in practice:

- Vision names (e.g. "CtaYellowBand") rarely match HTML headings (e.g. "Call For Speakers")
- Index fallback breaks when the HTML has spacer sections, combined mega-sections, or non-`<section>` top-level elements
- The result: components get matched to the wrong HTML fragment and the LLM generates the wrong component (e.g. a footer layout instead of a CTA band)

In a recent test on the corvus clone (colorcode.events), 2 of 11 components were misassembled due to correlation errors — `cta-green-band` got a footer-like section, `content-split-about` got a newsletter form. The heading match succeeded for only 1 of 11 sections.

**This solution must be source-agnostic.** The pipeline processes sites cloned from WordPress/Breakdance, Shopify, Squarespace, static HTML, and other CMS platforms. The correlation must NOT rely on CMS-specific CSS class patterns (e.g. `bde-section-17-114`). It must work on any HTML that has standard semantic structure.

### Goals

1. Improve blueprint-to-HTML correlation accuracy from ~73% (8/11) to >90%
2. Use only source-agnostic content signals: semantic HTML tags, heading/keyword text, content shape (forms, images, article elements), visible text density
3. Integrate with the existing `html-structure-analyzer.ts` which already classifies sections into `ComponentCategory` (Hero, CTA, Blog, Cards, etc.) using content signals — this classification exists but isn't used by the correlator
4. Handle common real-world HTML patterns: mega-sections containing multiple logical sub-sections, spacer/divider sections with <300 chars, `<header>`/`<footer>` elements mixed with `<section>` elements

### Non-Goals

- Changing the vision analysis prompt or the blueprints it produces
- Fixing the HomePage prop-wiring gap (separate work stream)
- Handling non-homepage pages (correlation only runs on the home page currently)
- Adding new dependencies (e.g. a DOM parser like cheerio) — the pipeline uses regex-based parsing for speed

### Acceptance Criteria

1. `correlateWithBlueprints()` uses content-shape signals (category matching, keyword scanning, form/image detection) in addition to heading text
2. Spacer sections (<300 chars) are deprioritized or skipped
3. When a single HTML section contains multiple logical sub-sections (e.g. "Call For Speakers" + "Call For Sponsors" + "Call For Volunteers" all in one `<section>`), the correlation either:
   - Splits the mega-section and maps sub-sections to individual blueprints, OR
   - Maps the mega-section to the first matching blueprint and leaves the rest unmatched (safer)
4. The correlation produces a confidence score per match, logged for debugging
5. The existing `diagnose-clone-sections.ts` diagnostic tool is updated to show the new matching signals
6. All changes pass `pnpm type-check`

### Constraints

- No CMS-specific logic (no Breakdance class patterns, no WordPress assumptions)
- No new npm dependencies
- The pipeline uses regex-based HTML parsing (`html-structure-analyzer.ts`) — don't introduce a full DOM parser
- Must be backward-compatible: existing clone directories (corvus, polaris) must still produce valid output
- The `SectionBlueprint` type has a `category: ComponentCategory` field and the `HtmlSection` type has an `estimatedCategory: ComponentCategory` field — both use the same enum

### Relevant Architecture

**Pipeline flow:**

```
Screenshot → Vision API → SectionBlueprint[] (with category, name, purpose, contentSlots)
     ↓
Clone HTML → extractCloneSections() → CloneSection[] (with index, tag, headingText, html)
     ↓
correlateWithBlueprints() → enriched SectionBlueprint[] (with cloneHtmlFragment, cloneRelevantCss)
     ↓
For each enriched blueprint → LLM generates React component
```

**Key types:**

`SectionBlueprint` (from vision API):

- `category: ComponentCategory` — "Hero" | "Navigation" | "Cards" | "CTA" | "Content" | "Social Proof" | "Blog" | "Stats" | "Footer" | "Custom"
- `name: string` — PascalCase like "CtaYellowBand"
- `purpose: string` — e.g. "High-visibility call-to-action band for speaker applications"
- `contentSlots: string[]` — e.g. ["heading", "bodyText", "ctaButton"]
- `interactionNeeds: "none" | "minimal" | "stateful"`

`HtmlSection` (from `analyzeHtmlStructure()` in html-structure-analyzer.ts — NOT currently used by correlator):

- `estimatedCategory: ComponentCategory` — same enum as blueprint category
- `hasImages: boolean`
- `hasForm: boolean`
- `childCount: number`
- `backgroundHint?: string`

`CloneSection` (from `extractCloneSections()` in clone-section-extractor.ts — currently used by correlator):

- `index: number`
- `tag: string` — "section", "header", "footer", etc.
- `headingText?: string`
- `html: string`
- `cssClasses: string[]`

### Codebase Snapshot

| File                                        | What it does                                                                                                                                           | Lines |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| `tools/lib/clone-section-extractor.ts`      | Extracts sections from clone HTML, correlates with blueprints. **This is the primary file to modify.**                                                 | 139   |
| `tools/lib/html-structure-analyzer.ts`      | Classifies HTML sections into categories using content signals (headings, forms, images, keywords). Already exists but **not used by the correlator**. | 565   |
| `tools/lib/reference-analysis-types.ts`     | Type definitions for `SectionBlueprint`, `ComponentCategory`, `HtmlSection`, etc.                                                                      | 268   |
| `tools/extract-theme.ts`                    | Main pipeline CLI — calls `enrichBlueprintsForPage()`.                                                                                                 | 840   |
| `tools/diagnose-clone-sections.ts`          | Diagnostic tool that shows section extraction and correlation results.                                                                                 | ~104  |
| `output/clones/corvus/html/pages/home.html` | Test fixture — colorcode.events clone (Breakdance)                                                                                                     | ~1000 |

**The html-structure-analyzer already has:**

- `classifySection()` — returns ComponentCategory from tag, innerHtml, headingText, hasImages, hasForm, isFirstSection, classes
- `hasStatContent()` — detects stat/number patterns
- `hasTestimonialContent()` — detects review/testimonial patterns
- `hasBlogContent()` — detects blog/article patterns
- `countImages()` — counts `<img>` tags
- `extractFirstHeading()` — gets heading text

### What a Good Plan Should Cover

1. How to enrich `CloneSection` with category classification (using the existing `classifySection()`)
2. The matching algorithm: what signals to use, in what priority order, and how to handle ties
3. How to handle mega-sections (one HTML section containing content for multiple blueprints)
4. How to handle spacer/divider sections (tiny HTML blocks that shouldn't match anything)
5. How confidence scores are computed and logged
6. How the diagnostic tool is updated to show the new signals
7. Testing strategy — how to verify the fix works on corvus and would work on non-Breakdance sites
8. Whether `CloneSection` should be extended with new fields or replaced with `HtmlSection`

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04-16_extract-pipeline-correlation/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-16_extract-pipeline-correlation/`
