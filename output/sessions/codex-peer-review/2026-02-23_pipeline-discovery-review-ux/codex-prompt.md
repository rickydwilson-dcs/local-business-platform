# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-23_pipeline-discovery-review-ux/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise
```

---

## Brief: Pipeline URL Discovery + Test Site Review Experience

**Date:** 2026-02-23
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The ingestion pipeline (`tools/analyse-site.ts`) takes a reference website URL, crawls it, captures screenshots, runs AI analysis, and generates a theme package with components + example pages. Two areas need improvement:

**Area 1: URL discovery breaks on theme showcase sites.**

The pipeline's `discoverPages()` function in `tools/lib/site-discovery.ts` uses a three-strategy cascade: sitemap parsing, nav link extraction, common path probing. This was designed for real business sites with standard URL structures. It fails on theme showcase/demo sites in three specific ways:

1. **Base URL scoping bug.** `normaliseBaseUrl()` (line 49-52) strips the URL to `protocol://host`, discarding the path. A reference URL like `https://themefoundry.io/themes/bold/` becomes `https://themefoundry.io/` — nav links resolve to the parent agency site, not the theme demo. This is why the Atlas theme ingestion (from `themes.boldway.agency/deep/bold/`) only found a directory listing page.

2. **Rigid path classification.** `classifyPage()` (line 98-123) matches only exact path stems: `/about`, `/services`, `/blog`, `/contact`, `/locations`, `/pricing`, `/reviews`, `/projects`. Anything else (`/our-services`, `/what-we-do`, `/get-in-touch`, `/work`, `/portfolio`, `/team`, `/case-studies`) falls to `"custom"` and receives no vision analysis priority.

3. **No URL manifest.** When the operator already knows which pages matter, there's no `--pages` flag to provide them directly. The crawler either misses them or discovers unrelated parent-site pages.

4. **No page-type priority.** When more URLs are available than `maxPages` allows, the pipeline takes them in sitemap/discovery order rather than prioritising the most important page types (home > services > about > blog-list > contact).

**Area 2: Test site review experience is painful.**

After generation, the reviewer must manually type route URLs to navigate between pages. Three specific gaps:

1. **No cross-page navigation.** The bare-shell `layout.tsx` (ThemeProvider only) has no links to other generated pages. The generated `TopNavigation` component has placeholder `href="#"` or undefined `props['kebab-key']` values.

2. **No placeholder images.** Components with image props (`backgroundImage`, `logo`, `cardImages`) render nothing because no props are passed. Layout and visual weight cannot be assessed.

3. **Props access bug.** AI-generated JSX uses `props['kebab-case']` (e.g. `props['event-info-cta']`) but the TypeScript interface defines camelCase (`eventInfoCta`). Every bracketed prop is `undefined`, causing silent render failures in all generated components.

### Goals

**Area 1:**
- Add `--pages` CLI flag that provides specific URLs, bypassing auto-discovery entirely
- Fix `normaliseBaseUrl()` to preserve the path prefix for subdirectory-based reference sites
- Expand `classifyPage()` with synonym/keyword matching for common page types
- Add page-type priority selection: when more URLs are available than `maxPages`, select by type priority (home > services-list > about > blog-list > contact > service-detail > blog-post > other)
- When discovery yields only 1-2 pages, warn and suggest using `--pages`

**Area 2:**
- Add a review panel: a fixed-position dev overlay on every page listing clickable route links to all generated routes (just links, no thumbnails). Injected into `layout.tsx` reading from a static route manifest JSON.
- Add placeholder images: when a component has image-type props, pass inline SVG data URIs (grey rectangles with dimension text) so layout can be assessed.
- Fix the props access bug: both an AI prompt fix (require `props.camelCase` in `buildComponentGenerationPrompt()`) AND a post-processing regex in `theme-component-generator.ts` that converts `props['kebab-key']` to `props.camelKey`.

### Non-Goals

- Full semantic page classification using AI (this is heuristic pattern matching only)
- Auto-discovery of sub-theme variants within a showcase directory
- Crawling beyond the provided URL set
- Full content population with real business data
- Dynamic routing between pages (the `[slug]` routes are not generated)
- Making the test site production-ready or deployable

### Acceptance Criteria

1. `npx tsx tools/analyse-site.ts --url https://example.com --pages https://example.com/,https://example.com/about,https://example.com/services` produces exactly 3 discovered pages with correct types
2. `normaliseBaseUrl("https://host.com/themes/bold/")` returns `https://host.com/themes/bold` (preserves path)
3. `classifyPage("/our-services")` returns `"services-list"` (not `"custom"`)
4. When discovery finds 15 pages but `maxPages` is 10, the returned set contains home, services-list, about, blog-list, contact before any blog-posts or custom pages
5. Test site layout.tsx contains a review panel component with links to all generated routes
6. Generated example pages pass placeholder image objects to components with image-type props
7. AI-generated components use `props.camelCase` not `props['kebab-case']`
8. `pnpm type-check` passes after all changes

### Constraints

- `discoverPages()` signature must remain backward-compatible — extend the options object
- `classifyPage()` must stay pure/synchronous — no async, no external lookups
- Common path probing threshold (nav < 3 pages fires probing) is unchanged
- No new npm dependencies for either area
- Review panel must be visually distinct from the theme (clearly dev tooling, not content)
- Placeholder images must work offline (no external URLs) — inline SVG data URIs
- Props bug fix must not alter the TypeScript interface (camelCase interface is correct; only JSX access needs changing)
- `DiscoveredPage.source` field is currently `"sitemap" | "nav" | "probe"` — may need `"manifest"` added

### Relevant Architecture

**URL Discovery (current):**
- `tools/lib/site-discovery.ts` — Three-strategy cascade: sitemap → nav parsing → common path probing
- `discoverPages(url, { maxPages? })` is the public API, returns `DiscoveredPage[]`
- `normaliseBaseUrl(raw)` strips to `protocol://host` (the bug)
- `classifyPage(path)` matches path stems via regex — only covers 8 exact patterns
- `COMMON_PATHS` = ["/about", "/services", "/blog", "/contact", "/locations", "/pricing", "/reviews", "/projects"]
- Results sorted: home first, then by depth, then alphabetically, sliced to maxPages
- No priority by page type — first-come-first-served from sitemap/nav order

**Vision Priority (downstream consumer):**
- `tools/lib/multi-page-analyzer.ts` — `VISION_PRIORITY` array determines which pages get AI vision calls (max 6)
- Order: `home > services-list > about > blog-list > contact > (others)`

**Component Generation:**
- `tools/lib/theme-component-templates.ts` — `buildComponentGenerationPrompt()` gives AI the props interface but doesn't prohibit bracket notation
- `tools/lib/theme-component-generator.ts` — `generateSingleComponent()` wraps AI output in shells, runs post-processing (token validation, syntax check, hex scan) but does NOT check for bracket-notation prop access
- `inferPropType(slotName)` returns `"{ src?: string; alt?: string }"` for image/photo slots — this is how we know which props are image-type

**Page Generation:**
- `tools/lib/page-template-generator.ts` — `generatePageTsx()` renders `<Component />` with no props at all
- `getOutputPath(pageType, pagePath)` maps page types to file paths
- `SKIP_PAGE_TYPES` = ["service-detail", "blog-post", "location-detail"]

**Test Site Layout:**
- `sites/test-<theme>/app/layout.tsx` — bare shell: imports ThemeProvider, wraps children, no nav/footer
- Defined in `.claude/commands/pipeline.ingest.md` Step 5e

### Codebase Snapshot

```
tools/analyse-site.ts              — Pipeline entry point, CLI arg parsing, 14-step main()
tools/lib/site-discovery.ts        — discoverPages(), normaliseBaseUrl(), classifyPage()
tools/lib/reference-analysis-types.ts — PageType union, DiscoveredPage interface
tools/lib/multi-page-analyzer.ts   — VISION_PRIORITY, per-page analysis, synthesis
tools/lib/theme-component-templates.ts — buildComponentGenerationPrompt(), inferPropType()
tools/lib/theme-component-generator.ts — generateSingleComponent(), post-processing
tools/lib/page-template-generator.ts — generatePageTsx(), generateExamplePages()
.claude/commands/pipeline.ingest.md — Pipeline instruction (bare shell layout in Step 5e)
sites/test-atlas/app/layout.tsx     — Example bare-shell test site layout
packages/themes/atlas/components/   — Example generated components (props bug visible here)
```

**Key type definitions:**

```typescript
// reference-analysis-types.ts
type PageType = "home" | "about" | "services-list" | "service-detail"
  | "blog-list" | "blog-post" | "contact" | "locations-list"
  | "location-detail" | "reviews" | "projects" | "pricing" | "custom";

interface DiscoveredPage {
  url: string;
  path: string;
  source: "sitemap" | "nav" | "probe";  // may need "manifest"
  pageType: PageType;
  title?: string;
  depth: number;
}

// SectionBlueprint.contentSlots examples:
// ["heading", "subheading", "backgroundImage", "ctaButtons"]
// inferPropType("backgroundImage") → "{ src?: string; alt?: string }"
```

**Current classifyPage() logic:**

```typescript
function classifyPage(path: string): PageType {
  const lower = path.toLowerCase();
  if (lower === "/" || lower === "") return "home";
  if (/^\/about/.test(lower)) return "about";
  if (lower === "/services") return "services-list";
  if (/^\/services\/.+/.test(lower)) return "service-detail";
  if (lower === "/blog") return "blog-list";
  if (/^\/blog\/.+/.test(lower)) return "blog-post";
  if (/^\/contact/.test(lower)) return "contact";
  if (lower === "/locations" || lower === "/areas") return "locations-list";
  if (/^\/locations\/.+/.test(lower)) return "location-detail";
  if (/^\/reviews/.test(lower)) return "reviews";
  if (/^\/projects/.test(lower)) return "projects";
  if (/^\/pricing/.test(lower)) return "pricing";
  return "custom";
}
```

**Current buildComponentGenerationPrompt() rules (relevant excerpt):**

```
RULES:
1. NEVER invent colour names like bg-brand-dark-purple, text-accent-light, etc.
...
5. The component receives "props" as the parameter name.
6. Output ONLY the function body starting with "  return (" — no imports, no interface, no function declaration.
7. Keep it clean, semantic, and accessible.
```

Note: Rule 5 mentions "props" but does NOT specify `.camelCase` access. The AI frequently uses `props['kebab-case']` bracket notation matching the blueprint ID slugs.

### What a Good Plan Should Cover

1. **`--pages` flag:** Exact signature change to `discoverPages()`, how provided URLs are classified, what `source` value they get, whether nav parsing still runs on them (recommendation: no — full replacement is predictable)
2. **Base-URL bug:** Whether `normaliseBaseUrl()` should preserve the path prefix, the ripple effect on `isSameDomain()`, `toCleanPath()`, and common-path probing (which appends to the base — needs to append relative to the subdirectory)
3. **`classifyPage()` expansion:** Concrete list of additional patterns, and how to handle false-positive risk
4. **Page-type priority:** Where should priority selection happen — in `discoverPages()` before returning, or in the caller after receiving all discovered pages? Concrete priority ordering.
5. **Review panel:** Data source (route manifest JSON), placement (layout.tsx), component structure, how it gets generated, how it knows which routes exist
6. **Placeholder images:** Where the placeholder is defined, how image-type props are detected from blueprints, how they're passed into the `<Component />` render calls in `generatePageTsx()`
7. **Props bug fix:** The AI prompt text to add, the post-processing regex pattern, how to handle edge cases like `props['items'][0]` or `props['cta-button'].map(...)`
8. **Verification gates:** How to confirm each fix works without running the full 14-step pipeline

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-23_pipeline-discovery-review-ux/`.

Then output this command for the user to copy-paste into Claude Code:
```
/plan.with.codex synthesise
```
