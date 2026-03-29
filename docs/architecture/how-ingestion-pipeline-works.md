# How the Ingestion Pipeline Works

The ingestion pipeline analyses a reference website and produces a complete, self-contained theme package with generated components. Every reference site gets its own set of components — there is no cross-theme matching or reuse.

## Core Principle

**A theme is a strict family of structurally compatible components.** Each ingestion produces a complete component set for that theme. Components from one theme are never mixed with another.

## Pipeline Flow

```
Reference URL + Screenshot
  → [Step 1] Colour extraction (URL scraping + image analysis)
  → [Step 2] Vision analysis (Sonnet) — sections, categories, blueprints, tokens
  → [Step 3] Token reconciliation (vision tokens override scraped if confident)
  → [Step 4] Write reference-analysis.json (v2) + .md report
  → [Step 5] Component generation (per blueprint, template + AI hybrid)
  → [Step 6] Scaffold theme package (index.ts, manifest.ts, globals.css, etc.)
```

### Step 1: Colour Extraction

Uses the intake-system's `extractStylesFromUrl()` and `analyzeImage()` to scrape CSS styles and extract dominant colours from a logo or screenshot. Produces a `ThemeSuggestion` with brand colours and style category.

### Step 2: Vision Analysis

Sends the screenshot to Claude Sonnet with the `REFERENCE_ANALYSIS_PROMPT`. The model:

1. Detects all visual sections top-to-bottom
2. Classifies each into a `ComponentCategory` (Hero, Navigation, Cards, CTA, Content, Social Proof, Blog, Stats, Footer, Custom)
3. Produces a `SectionBlueprint` for each section with:
   - Component name and file name
   - Layout pattern description
   - Content slots (named areas the component needs)
   - Interaction needs (none/minimal/stateful → Server vs Client Component)
   - Token usage hints (which Tailwind theme tokens to use)

### Step 3: Token Reconciliation

When vision analysis confidence is not "low", its token recommendations override the URL-scraped values — they're more accurate because they come from the actual screenshot pixels.

### Step 4: Analysis Output

Writes `reference-analysis.json` (the full v2 analysis) and `reference-analysis.md` (human-readable report) to the output directory.

### Step 5: Component Generation

For each `SectionBlueprint`, the generator produces a `.tsx` file:

1. **Deterministic wrapper** (template-based): file header, imports, TypeScript props interface from content slots, named export
2. **AI-generated body** (Sonnet at temperature 0): JSX using only theme token classes, responsive breakpoints
3. **Post-generation validation**: hex literal scanner rejects hardcoded colours; named export verification

Falls back to placeholder components when the API key is missing or AI generation fails.

### Step 6: Theme Package Scaffold

Creates the complete theme package under `packages/themes/<name>/`:

| File | Purpose |
|------|---------|
| `index.ts` | Theme tokens + `registerTheme()` call |
| `globals.css` | Theme-specific utility classes |
| `manifest.ts` | Component metadata array for tooling |
| `components/` | Generated component files (one per blueprint) |
| `showcase-registry.tsx` | ElementDefinition entries for showcase site |
| `README.md` | Generated inventory |

Also updates `packages/themes/package.json` exports and appends the theme name to `THEME_NAMES` in `packages/theme-system/src/types.ts`.

## Key Files

| File | Purpose |
|------|---------|
| `tools/generate-theme-from-reference.ts` | Pipeline entry point |
| `tools/lib/reference-analysis-types.ts` | v2 analysis schema |
| `tools/lib/reference-analysis-prompts.ts` | Vision analysis prompt |
| `tools/lib/theme-component-generator.ts` | Component generation engine |
| `tools/lib/theme-component-templates.ts` | Deterministic template fragments |
| `tools/scaffold-theme-package.ts` | Theme package scaffolder |

## Usage

```bash
# Full pipeline: analyse + generate components + scaffold theme
npx tsx tools/generate-theme-from-reference.ts \
  --url https://example.com \
  --image ./screenshot.png \
  --name my-theme \
  --output ./output/my-theme/

# Dry run (analysis only, no file generation)
npx tsx tools/generate-theme-from-reference.ts \
  --url https://example.com \
  --image ./screenshot.png \
  --dry-run
```

## Showcase Integration

Generated themes automatically integrate with the showcase site through the manifest-driven loader in `sites/showcase/registry/from-theme-manifest.ts`. Each theme's `showcase-registry.tsx` provides render functions that appear alongside existing theme entries.

## v2 Multi-Page Pipeline

The v2 pipeline (`tools/analyse-site.ts`) extends the original single-screenshot workflow with automated multi-page crawling, per-page layout analysis, component matching, and example page generation. The user provides just a URL; everything else is automated.

### CLI Usage

```bash
npx tsx tools/analyse-site.ts --url https://example.com/
```

Flags:
- `--url <website>` (required) — website to analyse
- `--name <slug>` (optional) — theme name, auto-assigned from constellation namespace if omitted
- `--output <dir>` (optional) — output directory, default: `./output/<theme-name>/`
- `--max-pages <n>` (optional) — max pages to discover, default: 10
- `--dry-run` — analysis only, no file generation
- `--skip-examples` — skip example page generation

### Pipeline Steps

The v2 pipeline runs 14 steps in order:

1. **Parse args, determine theme name** — auto-assigned from constellation namespace
2. **Discover pages** — sitemap.xml, nav parsing, path probing
3. **Fetch HTML** — all discovered pages
4. **Capture screenshots** — Playwright headless Chromium (1440x900)
5. **HTML structural analysis** — deterministic section detection
6. **Colour extraction** — CSS scraping from homepage
7. **Per-page vision analysis** — Claude Sonnet vision calls (cap at 6)
8. **Site synthesis** — cross-page consolidation
9. **Component matching** — map sections to core-components
10. **Token reconciliation** — vision overrides scraped if confident
11. **Write analysis files** — `site-analysis.json` + `site-analysis.md`
12. **Component generation** — unmatched sections only
13. **Example page generation** — TSX files from PageBlueprints
14. **Scaffold theme package** — `packages/themes/<name>/`

### Page Discovery Strategies

Three strategies in priority order:
1. **Sitemap.xml** — fetch and parse `<loc>` URLs, recurse indexes
2. **Navigation parsing** — extract links from `<nav>`, `<header>`, `<footer>`
3. **Common path probing** — probe `/about`, `/services`, `/blog`, `/contact`, etc.

### Screenshot Automation

Playwright captures full-page screenshots:
- Headless Chromium, 1440x900 viewport
- Single browser instance, one tab per page
- Pages that fail to load are skipped

### Component Matching

The component matcher scores each section blueprint against the core-component catalog using:
- Category match (must match to score at all)
- Content slots overlap (Jaccard similarity)
- Layout pattern keyword matching

Confidence thresholds: >0.7 = exact match (reuse directly), 0.4-0.7 = close match (minor adaptation), <0.4 = no match (generate new).

### Example Page Generation

For each PageBlueprint, a TSX file is generated that imports matched core-components and generated theme components. Detail pages (service-detail, blog-post, location-detail) are NOT generated — they use `[slug]/page.tsx` dynamic routes.

### Relationship to v1

The original single-screenshot pipeline (`tools/generate-theme-from-reference.ts`) is untouched and still works. The v2 pipeline is a superset that produces a `SiteAnalysis` (v3 schema) instead of a `ReferenceAnalysis` (v2 schema).

### Key Files (v2)

| File | Purpose |
|------|---------|
| `tools/analyse-site.ts` | v2 pipeline entry point |
| `tools/lib/site-discovery.ts` | Page discovery (sitemap, nav, probing) |
| `tools/lib/screenshot-capture.ts` | Playwright screenshot capture |
| `tools/lib/html-structure-analyzer.ts` | Deterministic HTML section detection |
| `tools/lib/multi-page-analyzer.ts` | Per-page vision + site synthesis |
| `tools/lib/core-component-catalog.ts` | Core component metadata |
| `tools/lib/component-matcher.ts` | Section → component matching |
| `tools/lib/page-template-generator.ts` | Example page TSX generation |
| `tools/lib/theme-name-picker.ts` | Auto theme name from constellation namespace |

## Test Site Naming

Two pipeline commands create test sites, using different naming conventions:

| Command | Creates | Example |
|---------|---------|---------|
| `/pipeline.ingest` | `sites/test-<theme-name>/` | `sites/test-lyra/` |
| `/pipeline.stitch-design` | `sites/<theme-name>-test/` | `sites/lyra-test/` |

Both conventions are handled by `/pipeline.kill-site` — pass either the full folder name or the bare theme name and it resolves the correct directory.
