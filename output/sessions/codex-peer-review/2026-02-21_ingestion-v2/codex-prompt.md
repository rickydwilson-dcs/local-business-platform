# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-21_ingestion-v2/`

When done, tell the user to run `/plan.with.codex synthesise` in Claude Code.

---

## Brief: Ingestion Pipeline v2 — Multi-Page Crawling & Page Layout Blueprints

**Date:** 2026-02-21
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The current ingestion pipeline (`tools/generate-theme-from-reference.ts`) takes a **single screenshot + URL** and produces a theme package with per-section component blueprints. This works, but is limited:

1. **Single page only** — it analyses one screenshot (typically the homepage). Real websites have multiple page types (Home, About, Services, Blog, Contact) with different layouts, and the current pipeline misses all of them.

2. **No page-level structure** — it detects individual sections (Hero, Cards, CTA, Footer) but has no concept of how those sections compose into complete pages. A "Home" page has a specific section sequence; a "Blog listing" page has a different one. This structural knowledge is lost.

3. **No example pages** — after generating a theme, someone still has to manually wire up pages. There's no way to verify that the theme's components actually compose correctly into full pages until a human builds them.

4. **No component reuse mapping** — the pipeline generates every component from scratch. The platform already has shared components in `packages/core-components/` (HeroWithImage, CircularIconCard, InfoCard, ImageOverlayCard, etc.) that should be reused when they match what's on the reference site.

The user wants to evolve the pipeline so they can provide a URL and have the system:
- Crawl the site to discover multiple pages
- Analyse each page's layout and section composition
- Map detected sections to existing platform components where possible
- Generate example pages that mirror the reference site's structure
- Produce a theme package where pages "wire up correctly" on first build

### Goals

1. **Multi-page discovery**: Given a URL, discover and categorise the site's main pages (home, about, services, service detail, blog listing, blog post, contact, etc.)
2. **Per-page layout blueprints**: For each discovered page, produce a structured blueprint that captures the full section sequence, not just individual sections
3. **Component matching**: Map detected sections to existing `core-components` where they match, only generating new components for genuinely novel patterns
4. **Example page generation**: Generate reference page files (TSX or MDX as appropriate) that demonstrate the correct section composition for each page type
5. **Backward compatibility**: The enhanced pipeline should be additive — existing single-screenshot analysis should still work

### Non-Goals

- Building a headless browser / Puppeteer integration (not available in the Claude Code environment)
- Replacing the existing theme system or component architecture
- Auto-generating MDX content (blog posts, service descriptions) — just the page structure
- Real-time crawling during `next build` — this is an offline analysis tool
- Supporting JavaScript-rendered SPAs (the pipeline analyses HTML/screenshots, not JS bundles)

### Acceptance Criteria

1. Running the enhanced pipeline with `--url https://example.com` discovers at least the main navigation pages
2. Output includes a `site-analysis.json` with per-page layout blueprints
3. Each page blueprint lists its sections in order, with each section mapped to either an existing core-component or a new blueprint
4. Example page files are generated that can be dropped into a site directory
5. The existing `--image` + single-screenshot workflow still works unchanged
6. A human-readable report (`site-analysis.md`) summarises what was found across all pages

### Constraints

**Environment constraints:**
- No headless browser (Puppeteer/Playwright) — Claude Code runs in a sandboxed terminal
- Must work with `fetch()` for HTML retrieval and Claude vision API for screenshot analysis
- Screenshots must be provided by the user (or fetched via a service), not captured programmatically

**Architecture constraints (from CLAUDE.md):**
- All content is MDX-only with YAML frontmatter — never create individual static page files for content routes
- Dynamic `[slug]` routes with `generateStaticParams()` — content pages use this pattern
- Theme tokens only — no hardcoded hex colors in generated components
- Named exports only, TypeScript interfaces for all props
- Server Components by default
- Home pages (`app/page.tsx`) ARE static files (not MDX) — they're the one exception to dynamic routing

**Existing tool constraints:**
- The website analyzer (`packages/intake-system/src/theme-extraction/website-analyzer.ts`) can `fetch()` HTML and extract CSS styles, but only from a single URL
- The vision analysis uses Claude Sonnet with a single screenshot — multi-image analysis would need multiple API calls
- Theme packages are scaffolded by `tools/scaffold-theme-package.ts` and expect a `ReferenceAnalysis` v2 structure

### Relevant Architecture

**Current pipeline flow (6 steps):**
```
Reference URL + Screenshot
  → [1] Colour extraction (URL CSS scraping + image analysis)
  → [2] Vision analysis (Sonnet) — one screenshot → SectionBlueprints
  → [3] Token reconciliation (vision overrides scraped if confident)
  → [4] Write reference-analysis.json (v2) + .md report
  → [5] Component generation (per blueprint, template + AI hybrid)
  → [6] Scaffold theme package
```

**Key types (`tools/lib/reference-analysis-types.ts`):**
```ts
type ComponentCategory = "Hero" | "Navigation" | "Cards" | "CTA" | "Content" | "Social Proof" | "Blog" | "Stats" | "Footer" | "Custom";

interface SectionBlueprint {
  id: string;                    // "hero-full-bleed"
  name: string;                  // "HeroFullBleed"
  category: ComponentCategory;
  purpose: string;
  layoutPattern: string;         // "full-bleed with overlay"
  contentSlots: string[];        // ["heading", "subheading", "ctaButtons"]
  interactionNeeds: "none" | "minimal" | "stateful";
  componentFileName: string;
  componentExportName: string;
  tokenUsageHints: string[];
  confidence: "high" | "medium" | "low";
  referenceSection: string;
}

interface ReferenceAnalysis {
  analysisVersion: "1" | "2";
  reference: { url?, screenshotPath?, capturedAt };
  visualLanguage: { palette, typography, heroPattern, spacingDensity };
  detectedSections: Array<{ name, background, layoutType, purpose, notes }>;
  sectionBlueprints: SectionBlueprint[];
  registryRecommendation: { themeName, confidence, reasoning };
  themeTokenRecommendations: { brand, surface, typography };
}
```

**Existing shared components (`packages/core-components/`):**
- `HeroWithImage` — full-bleed hero with image overlay, heading, subheading, CTA buttons
- `CircularIconCard` — icon in a circle, title, description, link
- `InfoCard` — icon + heading + text (stat/trust indicator cards)
- `ImageOverlayCard` — image with text overlay, category badge, link
- Plus various other UI primitives

**Page structure patterns (from existing sites):**

Home pages (`app/page.tsx`) are static TSX files that compose sections:
```
DJ Fox (orion theme): Hero → Stats → Services (circular icons) → Categories (image overlay) → Areas → Why Choose Us → CTA
Base template (vega theme): Hero → Trust indicators → Services (card grid) → Areas → CTA
```

Content pages use dynamic `[slug]` routes reading from MDX files.

List pages (services, locations, blog) are static TSX that iterate over MDX content.

**Website analyzer capabilities:**
- `extractStylesFromUrl(url)` — fetches HTML, scrapes CSS, extracts colors and fonts
- `extractStylesheetUrls(html, baseUrl)` — finds linked CSS files
- `analyzeCompetitorSites(urls[])` — analyses multiple URLs for common patterns
- These work with standard `fetch()` — no browser needed

### Codebase Snapshot

| Path | What it contains |
|------|-----------------|
| `tools/generate-theme-from-reference.ts` | Current pipeline entry point (520 lines) |
| `tools/scaffold-theme-package.ts` | Creates theme package dir structure (407 lines) |
| `tools/lib/reference-analysis-types.ts` | ReferenceAnalysis + SectionBlueprint types (87 lines) |
| `tools/lib/reference-analysis-prompts.ts` | Claude vision prompt for screenshot analysis (103 lines) |
| `tools/lib/theme-component-generator.ts` | AI component generation from blueprints |
| `tools/lib/theme-component-templates.ts` | Deterministic TSX templates |
| `packages/intake-system/src/theme-extraction/website-analyzer.ts` | URL→HTML→CSS style extraction (499 lines) |
| `packages/intake-system/src/theme-extraction/image-analyzer.ts` | Image→dominant colors (382 lines) |
| `packages/intake-system/src/theme-extraction/theme-generator.ts` | Merge analysis→ThemeSuggestion |
| `packages/core-components/src/components/ui/` | Shared components (HeroWithImage, CircularIconCard, etc.) |
| `sites/base-template/app/page.tsx` | Gold-standard home page (vega theme, 177 lines) |
| `sites/dj-fox-electrical/app/page.tsx` | Live home page (orion theme, 262 lines) |
| `sites/base-template/app/services/page.tsx` | Services list page |
| `sites/base-template/app/blog/page.tsx` | Blog list page |
| `packages/theme-system/src/types.ts` | ThemeConfig, ComponentRegistry, THEME_NAMES |
| `packages/themes/orion/` | Named theme: dark header, full-bleed hero, circular icons |
| `packages/themes/vega/` | Named theme: light header, split hero, card grid |

### What a Good Plan Should Cover

1. **Page discovery strategy**: How do you find a site's pages when you can't run a headless browser? HTML `<nav>` parsing? Sitemap.xml? Both? What page limit? How do you categorise pages (home, about, service, blog, contact)?

2. **Screenshot acquisition**: The user can't programmatically screenshot pages. What's the practical workflow? User provides multiple screenshots? Use a third-party screenshot API? Analyse HTML without screenshots? Some hybrid?

3. **Multi-page analysis schema**: What does the new output structure look like? How does it extend (not break) the existing `ReferenceAnalysis` v2 format?

4. **Page layout blueprints**: What is the schema for a "page blueprint"? How does it differ from a list of `SectionBlueprint`s? How does it capture section ordering, shared sections (header/footer), and page-specific patterns?

5. **Component matching**: How do you map a detected "hero with full-bleed image" to the existing `HeroWithImage` component? What's the matching algorithm or heuristic? What happens when there's a partial match?

6. **Example page generation**: What format are the generated pages? TSX for home pages, MDX for content pages? How do they reference the correct components? How much content is placeholder vs extracted from the reference?

7. **CLI interface changes**: What new flags are needed? How does the user invoke the enhanced pipeline? Is it a separate command or an extension of the existing one?

8. **Token budgeting**: Multi-page vision analysis = multiple Sonnet API calls. What's the cost profile? How to keep it reasonable?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-21_ingestion-v2/`.
