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
