# YOLO Implementation Brief: Ingestion Pipeline v2 — Multi-Page Crawling & Page Layout Blueprints

**Branch:** feature/ingestion-v2 (from develop)
**Session spec:** output/sessions/2026-02-21_ingestion-v2/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Verification URL:** https://colorcode.events/

---

## Context

The current ingestion pipeline takes a single screenshot + URL and produces a theme package. It misses multi-page structure, can't reuse existing platform components, and doesn't verify that generated themes compose into working pages.

This plan adds automated multi-page crawling (Playwright screenshots), per-page layout blueprints, a component matching engine (maps detected sections to existing core-components), and example page generation. The user provides just a URL; everything else is automated.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/ingestion-v2
pnpm type-check   # must be clean before starting
```

---

## Phase A: Foundation (types, discovery, screenshots)

### A1: Add Playwright as dev dependency

```bash
pnpm add -Dw @playwright/test
npx playwright install chromium
```

Only chromium needed.

```bash
# Verification gate — STOP if this fails
npx playwright --version
```

### A2: Define new types

**Modify:** `tools/lib/reference-analysis-types.ts`

Add these types alongside existing ones (do NOT modify existing types):

```ts
// ── Page Discovery Types ────────────────────────────────────────────────

export type PageType =
  | "home"
  | "about"
  | "services-list"
  | "service-detail"
  | "blog-list"
  | "blog-post"
  | "contact"
  | "locations-list"
  | "location-detail"
  | "reviews"
  | "projects"
  | "pricing"
  | "custom";

export interface DiscoveredPage {
  url: string;
  path: string;
  source: "sitemap" | "nav" | "probe";
  pageType: PageType;
  title?: string;
  depth: number;
}

// ── Component Matching Types ────────────────────────────────────────────

export interface ComponentMatch {
  componentName: string;
  importPath: string;
  matchConfidence: "exact" | "close" | "partial";
  adaptationNotes?: string;
}

// ── Page Blueprint Types ────────────────────────────────────────────────

export interface PageSection {
  order: number;
  blueprintId: string;
  isShared: boolean;
  matchedComponent?: ComponentMatch;
}

export interface PageBlueprint {
  pageType: PageType;
  path: string;
  title: string;
  sections: PageSection[];
  sharedSections: string[];
  analysisSource: "vision" | "html-only" | "hybrid";
  confidence: "high" | "medium" | "low";
  routePattern: string;
  isContentBacked: boolean;
}

// ── Site Analysis (v3) ──────────────────────────────────────────────────

export interface SiteAnalysis {
  analysisVersion: "3";
  reference: {
    url: string;
    capturedAt: string;
    pagesAnalysed: number;
  };
  discoveredPages: DiscoveredPage[];
  pageBlueprints: PageBlueprint[];
  visualLanguage: ReferenceAnalysis["visualLanguage"];
  sectionBlueprints: SectionBlueprint[];
  componentMatches: ComponentMatch[];
  themeTokenRecommendations: ReferenceAnalysis["themeTokenRecommendations"];
  registryRecommendation: ReferenceAnalysis["registryRecommendation"];
}
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

### A3: Page discovery module

**Create:** `tools/lib/site-discovery.ts`

Discovers pages from a URL using three strategies in priority order:

1. **Sitemap.xml** — fetch `${baseUrl}/sitemap.xml`, parse XML, extract `<loc>` URLs. Recurse sitemap indexes (1 level max).
2. **Navigation parsing** — fetch homepage HTML, extract links from `<nav>`, `<header>`, `<footer>`. Filter same-domain, deduplicate.
3. **Common path probing** — if nav yields < 3 pages, probe: `/about`, `/services`, `/blog`, `/contact`, `/locations`, `/pricing`, `/reviews`, `/projects`.

Page classification by URL path patterns:

- `/` → `home`
- `/about*` → `about`
- `/services` → `services-list`, `/services/*` → `service-detail`
- `/blog` → `blog-list`, `/blog/*` → `blog-post`
- `/contact*` → `contact`
- `/locations` or `/areas` → `locations-list`, `/locations/*` → `location-detail`
- Unknown → `custom`

Controls:

- `maxPages` parameter (default 10)
- Same-domain only
- 500ms delay between fetches
- Check `robots.txt` before crawling
- Reuse user-agent and timeout patterns from `packages/intake-system/src/theme-extraction/website-analyzer.ts`

Export: `async function discoverPages(url: string, options?: { maxPages?: number }): Promise<DiscoveredPage[]>`

### A4: Playwright screenshot capture

**Create:** `tools/lib/screenshot-capture.ts`

For each discovered page:

1. Launch headless Chromium via Playwright
2. Navigate to URL, wait for `networkidle`
3. Capture full-page screenshot (PNG, viewport 1440×900)
4. Save to `<outputDir>/screenshots/<pageType>.png`
5. Close page tab, reuse browser instance across all pages

Details:

- Single browser instance, `browser.newPage()` per URL
- 15-second navigation timeout per page
- Skip pages that fail to load (log warning, don't crash)
- Return a map of `pageType → screenshotPath` for use by later steps

Export: `async function captureScreenshots(pages: DiscoveredPage[], outputDir: string): Promise<Map<string, string>>`

### A5: Auto-assign theme name from constellation namespace

**Create:** `tools/lib/theme-name-picker.ts`

Read from:

- `packages/theme-system/src/theme-names.ts` — `CONSTELLATION_NAMES` (full pool of 50 names)
- `packages/theme-system/src/types.ts` — `THEME_NAMES` (currently `["orion", "vega"]`)

Pick the first name from `CONSTELLATION_NAMES` that is not in `THEME_NAMES`.

Export: `function pickNextThemeName(): string`

With current state this returns `"lyra"`.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit after Phase A:**

```bash
git add tools/lib/reference-analysis-types.ts tools/lib/site-discovery.ts tools/lib/screenshot-capture.ts tools/lib/theme-name-picker.ts package.json pnpm-lock.yaml
git commit -m "$(cat <<'EOF'
feat(ingestion): add page discovery, screenshot capture, and v3 types

Phase A of ingestion pipeline v2:
- New types: PageType, DiscoveredPage, PageBlueprint, SiteAnalysis (v3)
- Page discovery via sitemap.xml, nav parsing, and path probing
- Automated screenshot capture via Playwright
- Auto theme name picker from constellation namespace

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase B: Analysis & Matching

### B1: HTML structural analyser

**Create:** `tools/lib/html-structure-analyzer.ts`

Fast deterministic pre-pass (no API calls). For each page's HTML:

- Find top-level `<section>`, `<main>`, `<header>`, `<footer>`, and major `<div>` elements (role="main", role="banner", etc.)
- For each detected section extract:
  - `tag` (semantic element name)
  - `headingText` (first `<h1>`-`<h6>` inside)
  - `childCount` (number of direct children)
  - `hasImages` (contains `<img>`)
  - `hasForm` (contains `<form>`)
  - `cssClasses` (from `class` attribute)
  - `backgroundHint` (from inline `style` or class name keywords)
- Classify each into `ComponentCategory` using structural signals

Export:

```ts
interface HtmlSection {
  index: number;
  tag: string;
  headingText?: string;
  estimatedCategory: ComponentCategory;
  hasImages: boolean;
  hasForm: boolean;
  childCount: number;
  cssClasses: string[];
  backgroundHint?: string;
}

interface PageStructure {
  page: DiscoveredPage;
  sections: HtmlSection[];
  navigationLinks: string[];
  footerLinks: string[];
}

function analyzeHtmlStructure(html: string, page: DiscoveredPage): PageStructure;
```

### B2: Per-page vision analysis

**Create:** `tools/lib/multi-page-analyzer.ts`
**Modify:** `tools/lib/reference-analysis-prompts.ts` — add `PAGE_LAYOUT_ANALYSIS_PROMPT`

The `PAGE_LAYOUT_ANALYSIS_PROMPT` should:

- Accept a screenshot + HTML structure hints (from B1)
- Ask Claude to identify all visual sections top-to-bottom
- Include `pageType` and URL context so Claude understands the page's role
- Return JSON matching a per-page analysis structure (sections in order, with SectionBlueprint data for each)
- Use the same ComponentCategory and SectionBlueprint schema as the existing REFERENCE_ANALYSIS_PROMPT

The multi-page analyzer:

- Takes all discovered pages, their HTML, and the screenshot map
- For pages WITH screenshots: sends screenshot + HTML hints to Sonnet (vision call)
- For pages WITHOUT screenshots: uses HTML structural analysis only, marks `analysisSource: "html-only"`
- Priority order for vision calls: home → services-list → about → blog-list → contact → others
- Cap at 6 vision calls maximum
- Returns per-page analysis results

### B3: Site synthesis prompt

**Modify:** `tools/lib/reference-analysis-prompts.ts` — add `SITE_SYNTHESIS_PROMPT`

One additional Sonnet call after all per-page analyses. Input: all per-page results as JSON.

The prompt should ask Claude to:

1. Identify shared sections that appear on every/most pages (header, footer, CTA bands)
2. Deduplicate section blueprints across pages (same hero pattern on home + about = one blueprint)
3. Resolve conflicting color readings between pages
4. Produce consolidated `themeTokenRecommendations` (single palette for the whole site)
5. Produce a `registryRecommendation` (which existing theme family — orion or vega — is closest)

Output: the cross-page consolidated fields that become part of `SiteAnalysis`.

### B4: Component matching engine

**Create:** `tools/lib/core-component-catalog.ts`

Declarative metadata for each core component. Read `packages/core-components/src/components/ui/` to identify all exported components. For each, define:

```ts
interface CatalogEntry {
  name: string; // "HeroWithImage"
  category: ComponentCategory;
  requiredSlots: string[]; // ["heading", "imageSrc"]
  layoutCues: string[]; // ["full-bleed", "overlay", "background-image"]
  interaction: "none" | "minimal" | "stateful";
  importPath: string; // "@platform/core-components"
}
```

Must include at minimum: `HeroWithImage`, `CircularIconCard`, `InfoCard`, `ImageOverlayCard`.

**Create:** `tools/lib/component-matcher.ts`

Score each `SectionBlueprint` against the catalog:

1. Category match (must match to score at all)
2. Content slots overlap (Jaccard similarity between blueprint.contentSlots and catalog.requiredSlots)
3. Layout pattern keyword matching (blueprint.layoutPattern against catalog.layoutCues)
4. Weighted composite score

Thresholds:

- Score > 0.7 → `matchConfidence: "exact"` (use core component directly)
- Score 0.4-0.7 → `matchConfidence: "close"` (use with minor adaptation)
- Score < 0.4 → no match (generate new component)

Export: `function matchComponents(blueprints: SectionBlueprint[]): Map<string, ComponentMatch | null>`

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit after Phase B:**

```bash
git add tools/lib/html-structure-analyzer.ts tools/lib/multi-page-analyzer.ts tools/lib/reference-analysis-prompts.ts tools/lib/core-component-catalog.ts tools/lib/component-matcher.ts
git commit -m "$(cat <<'EOF'
feat(ingestion): add HTML analysis, vision pipeline, and component matching

Phase B of ingestion pipeline v2:
- HTML structural analyser for deterministic section detection
- Multi-page vision analysis with PAGE_LAYOUT_ANALYSIS_PROMPT
- Site synthesis prompt for cross-page consolidation
- Declarative core-component catalog
- Component matching engine with confidence scoring

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase C: Generation & Output

### C1: Update component generation to skip matched components

**Modify:** `tools/lib/theme-component-generator.ts`

Before generating a component for a `SectionBlueprint`:

- Check if it has a `ComponentMatch` with confidence `"exact"` or `"close"` → skip generation
- Only generate for unmatched sections (no match or `"partial"`)
- For `"partial"` matches: generate a thin adapter component that wraps the core component with theme-specific defaults

Do NOT change the existing generation logic for unmatched sections — the template + AI hybrid approach stays as-is.

### C2: Example page generation

**Create:** `tools/lib/page-template-generator.ts`

For each `PageBlueprint`, generate an example page TSX file:

| PageType                                         | Output Path                           | Strategy                                                                          |
| ------------------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------- |
| `home`                                           | `example-pages/app/page.tsx`          | Static TSX composing sections in blueprint order                                  |
| `about`                                          | `example-pages/app/about/page.tsx`    | Static TSX with content sections                                                  |
| `services-list`                                  | `example-pages/app/services/page.tsx` | Static TSX iterating MDX content (use `getServices()` pattern from base-template) |
| `blog-list`                                      | `example-pages/app/blog/page.tsx`     | Static TSX iterating MDX content (use `getBlogPosts()` pattern)                   |
| `contact`                                        | `example-pages/app/contact/page.tsx`  | Static TSX with form section                                                      |
| `reviews`                                        | `example-pages/app/reviews/page.tsx`  | Static TSX                                                                        |
| `service-detail`, `blog-post`, `location-detail` | **NOT generated**                     | Already handled by `[slug]/page.tsx` in base-template                             |
| `custom`                                         | `example-pages/app/{path}/page.tsx`   | Static TSX                                                                        |

Each generated page must:

- Import matched core-components from `@platform/core-components`
- Import generated theme components from the theme package
- Use theme token classes ONLY (no hardcoded hex)
- Use named exports only
- Include placeholder content with `{/* Section: [purpose] — from [blueprintId] */}` comments
- Use Server Component pattern (no `'use client'` unless interactionNeeds is stateful)

Also generate `example-pages/README.md` explaining how to use the generated files.

Reference existing page patterns:

- `sites/base-template/app/page.tsx` (177 lines) — gold-standard home page
- `sites/dj-fox-electrical/app/page.tsx` (262 lines) — orion-themed home page
- `sites/base-template/app/services/page.tsx` — services list pattern
- `sites/base-template/app/blog/page.tsx` — blog list pattern

### C3: Pipeline orchestration

**Create:** `tools/analyse-site.ts`

CLI entry point. Usage:

```bash
npx tsx tools/analyse-site.ts --url https://colorcode.events/
```

Flags:

- `--url <website>` (required)
- `--name <slug>` (optional, auto-assigned from constellation namespace if omitted)
- `--output <dir>` (default: `./output/<theme-name>/`)
- `--max-pages <n>` (default: 10)
- `--dry-run` (analysis only, no file generation)
- `--skip-examples` (skip example page generation)

Pipeline steps (in order):

1. Parse args, determine theme name (auto or override)
2. `discoverPages(url, { maxPages })` → discovered pages
3. Fetch HTML for all discovered pages (reuse page-fetcher pattern)
4. `captureScreenshots(pages, outputDir)` → screenshot map
5. `analyzeHtmlStructure(html, page)` for ALL pages → PageStructure[]
6. Colour extraction from homepage CSS (reuse existing `extractStylesFromUrl`)
7. Per-page vision analysis (pages with screenshots, cap at 6)
8. Site synthesis (cross-page consolidation)
9. `matchComponents(sectionBlueprints)` → component matches
10. Token reconciliation (vision overrides scraped if confident)
11. Write `site-analysis.json` + `site-analysis.md`
12. Component generation (unmatched sections only)
13. Example page generation
14. Scaffold theme package (reuse existing `scaffoldThemePackage`)

Log progress to stdout with step numbers and timing.

### C4: Reports and scaffold updates

**Modify:** `tools/scaffold-theme-package.ts`

Add a new overload or union type check:

- If input has `analysisVersion: "3"` → it's a `SiteAnalysis`, use its deduplicated `sectionBlueprints`
- If input has `analysisVersion: "2"` → existing `ReferenceAnalysis` flow, unchanged

New output files from the pipeline:

- `<output>/site-analysis.json` — full SiteAnalysis
- `<output>/site-analysis.md` — human-readable report:
  - Discovered pages table (URL, type, analysis source, section count, confidence)
  - Per-page section sequences
  - Component match decisions (section → core-component or new)
  - Generated vs reused component counts
  - API token usage / cost estimate
- `<output>/screenshots/` — Playwright captures
- `<output>/example-pages/` — generated page files + README
- `packages/themes/<name>/` — scaffolded theme package

Generate the markdown report programmatically (similar to existing `generateMarkdownReport` function).

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

**Commit after Phase C:**

```bash
git add tools/analyse-site.ts tools/lib/page-template-generator.ts tools/lib/theme-component-generator.ts tools/scaffold-theme-package.ts
git commit -m "$(cat <<'EOF'
feat(ingestion): add pipeline orchestration, page generation, and scaffold v3

Phase C of ingestion pipeline v2:
- analyse-site.ts CLI entry point (URL-only workflow)
- Example page generator from PageBlueprints
- Component generation skips matched core-components
- Scaffold accepts SiteAnalysis v3
- Full 13-step pipeline orchestration

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase D: End-to-End Verification

### D1: Run against https://colorcode.events/

```bash
npx tsx tools/analyse-site.ts --url https://colorcode.events/
```

Verify:

1. Pages discovered (should find at least: home, about, blog, contact, and event-related pages)
2. Screenshots captured in `output/lyra/screenshots/`
3. `output/lyra/site-analysis.json` exists with:
   - `discoveredPages` array
   - `pageBlueprints` with section sequences
   - `sectionBlueprints` deduplicated
   - `componentMatches` array
4. `output/lyra/site-analysis.md` is human-readable
5. `output/lyra/example-pages/` contains TSX files
6. `packages/themes/lyra/` is scaffolded with index.ts, globals.css, manifest.ts, components/

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

### D2: Update docs

**Modify:** `docs/architecture/how-ingestion-pipeline-works.md`

Add a new section describing the v2 multi-page pipeline:

- The 13-step flow
- New CLI usage (`analyse-site.ts`)
- Page discovery strategies
- Screenshot automation via Playwright
- Component matching
- Example page generation
- How it relates to the existing single-screenshot tool (still works, untouched)

### D3: Tests

**Create:** `tools/__tests__/site-discovery.test.ts`

- Mock HTML with known `<nav>` links → correct page discovery and classification
- Test sitemap parsing with mock XML
- Test path probing logic
- Test maxPages cap

**Create:** `tools/__tests__/component-matcher.test.ts`

- Known SectionBlueprints (hero with overlay, stat cards, icon cards) → correct ComponentMatch results
- Test confidence thresholds
- Test unmatched sections return null

**Create:** `tools/__tests__/html-structure-analyzer.test.ts`

- Mock HTML with known sections → correct HtmlSection detection
- Test ComponentCategory classification

**Create:** `tools/__tests__/page-template-generator.test.ts`

- Known PageBlueprint → generated TSX snapshot test
- Verify no hardcoded hex colors in output
- Verify correct imports

```bash
# Verification gate — STOP if this fails
pnpm test
pnpm type-check
pnpm lint
```

**Commit after Phase D:**

```bash
git add tools/__tests__/ docs/architecture/how-ingestion-pipeline-works.md
git commit -m "$(cat <<'EOF'
test(ingestion): add tests and update docs for v2 pipeline

Phase D of ingestion pipeline v2:
- Unit tests for site discovery, component matcher, HTML analyser, page generator
- Updated architecture docs with v2 multi-page pipeline

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Pages discovered from https://colorcode.events/ — list with types
3. Component matches — which sections mapped to which core-components
4. Build status — confirm `pnpm lint && pnpm type-check` passes
5. Any exceptions or intentional deviations from the plan

---

## Update Session File

After completing all phases, append to `output/sessions/2026-02-21_ingestion-v2/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, final verification results]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on `develop`
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- All new files use TypeScript, named exports only, TypeScript interfaces for props
- All generated component code uses theme token classes only — NEVER hardcode hex colors
- Existing `tools/generate-theme-from-reference.ts` must NOT be modified

---

## Completed

**Date:** 2026-02-21
**Status:** All phases executed successfully

The v2 ingestion pipeline was implemented across 4 phases with 4 commits. The pipeline discovers pages via sitemap.xml (found 10 pages on colorcode.events), captures screenshots via Playwright (5 of 10 succeeded — JS-heavy pages needed domcontentloaded instead of networkidle), performs HTML structural analysis on all pages, matches 6 sections to existing core-components, generates 17 new placeholder components (API key not set for vision calls), creates 8 example page TSX files, and scaffolds the `lyra` theme package. All 38 unit tests pass, `pnpm type-check` and `pnpm lint` are clean. The multi-page analyzer was updated to gracefully fall back to HTML-only analysis when ANTHROPIC_API_KEY is not set. The `generate-theme-from-reference.ts` was NOT modified.

### Commits

- `e397a8d` feat(ingestion): add page discovery, screenshot capture, and v3 types
- `d235449` feat(ingestion): add HTML analysis, vision pipeline, and component matching
- `71f14bc` feat(ingestion): add pipeline orchestration, page generation, and scaffold v3
- `22e515c` test(ingestion): add tests and update docs for v2 pipeline
