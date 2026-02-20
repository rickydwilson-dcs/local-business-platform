# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-20_ingestion-pipeline-redesign/`

When done, tell the user to run `/plan.with.codex synthesise` in Claude Code.

---

## Brief: Ingestion Pipeline Redesign — Per-Theme Component Generation

**Date:** 2026-02-20
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The ingestion pipeline currently analyses a reference website screenshot and tries to match each detected section against a flat list of existing shared components (REUSE/ADAPT/NEW). This produces a new "theme" that is really just new color tokens mapped onto existing component structures — a recolored version of an existing theme, not a genuinely new visual design.

This is architecturally wrong. In this platform, a **theme is a strict family of structurally compatible components**. Two sites using the same theme may have different homepage compositions, different colors, different fonts — but any component they share has the same DOM structure. A different theme means structurally different components (e.g., a full-screen overlay nav vs. inline text links nav — different HTML, not just different CSS).

The pipeline needs redesigning so that when it analyses a reference site, it produces a complete, self-contained set of components for that theme. No matching against existing components. Every section becomes a new component, themed to the new site's tokens and categorized for the showcase.

### Goals

1. When the pipeline analyses a reference site, it produces a new theme with its own complete set of components — no REUSE/ADAPT, everything is generated fresh
2. Each generated component is categorized (Hero, Nav, CTA, Testimonials, Cards, Footer, etc.) for the showcase to group variants across themes
3. Components use only theme tokens (no hardcoded hex colors) so they work with the token system
4. The showcase can display all variants of a category side-by-side across themes (e.g., "show me all Hero variants")

### Non-Goals

- Automatically replicating a component from one theme into another — components belong to the theme that introduced them
- Runtime theme switching — themes are build-time decisions
- Matching or scoring component similarity — if a new theme's footer happens to look identical to an existing theme's footer, build it anyway
- Changing the showcase's route structure (it already supports category filtering and per-theme views)
- Changing how sites are manually composed (developers still hand-pick which components to use in page files)

### Acceptance Criteria

1. Running the pipeline against a reference screenshot produces:
   - A theme package at `packages/themes/<name>/` with color tokens and a component manifest
   - A set of component files, one per detected section, each categorized
   - Each component uses only theme tokens (`bg-brand-primary`, `text-surface-foreground`, etc.)
2. The showcase registry can import new theme's components and display them categorized alongside existing themes
3. No cross-theme component coupling — deleting a theme's component folder doesn't break any other theme
4. The `ReferenceAnalysis` JSON output includes category metadata for each section but no REUSE/ADAPT/NEW matching status
5. The `REFERENCE_ANALYSIS_PROMPT` no longer contains a hardcoded list of existing components to match against

### Constraints

**Architecture constraints (from CLAUDE.md and codebase):**
- All components must use theme tokens exclusively — never hardcode hex colors
- Named exports only, TypeScript interfaces for all props
- Server Components by default; Client Components only when `useState`/`useEffect` is truly needed
- Tailwind CSS only — no inline styles, no CSS-in-JS (exception: dynamic values like opacity that can't be Tailwind classes)

**Pipeline constraints:**
- The vision analysis step uses `claude-sonnet-4-6` with a screenshot — this is the right tool for structural analysis
- The pipeline currently has two classification steps that overlap (Haiku text-only + Sonnet vision) — the redesign should resolve this redundancy
- Screenshots must currently be captured manually before running the pipeline (`--image` flag)

**Showcase constraints:**
- `ElementDefinition` has a `category` field already (10 categories defined)
- `ThemeFrame` uses `data-theme` CSS attribute for theme switching — purely CSS-based
- The `render: (theme: string) => React.ReactNode` function currently branches on theme name inside each registry file

### Relevant Architecture

**Current pipeline flow (to be redesigned):**
```
Reference URL + screenshot
  → [Step 1] Colour extraction (scraping + pixel sampling)
  → [Step 2] Layout classification (Haiku, text-only — picks "orion" | "vega")
  → [Step 2b] Vision analysis (Sonnet, screenshot — maps sections to existing components)
  → [Step 3] Token override (vision colors replace scraped colors)
  → [Step 4] theme.config.ts generation
  → [Step 5] scaffold-theme-package.ts (separate tool — creates packages/themes/<name>/)
  → [Step 6] Gap component implementation (manual session)
```

**Key pipeline files:**
- `tools/generate-theme-from-reference.ts` — main entry point (~400 lines)
- `tools/scaffold-theme-package.ts` — scaffolds theme package from analysis JSON (~200 lines)
- `tools/lib/reference-analysis-types.ts` — `ReferenceAnalysis` interface
- `tools/lib/reference-analysis-prompts.ts` — `REFERENCE_ANALYSIS_PROMPT` (vision model prompt)
- `tools/lib/component-mapping-catalog.ts` — static component catalog (currently UNUSED by pipeline)

**Theme packages (the output target):**
- `packages/themes/orion/index.ts` — exports `orionRegistry: ComponentRegistry` + `orionDefaultConfig: DeepPartialThemeConfig`
- `packages/themes/vega/index.ts` — same pattern
- `packages/themes/nova/index.ts` — generated by current pipeline (tokens only, no components)

**Component registry type (`packages/theme-system/src/types.ts`):**
```typescript
export interface ComponentRegistry {
  theme: ThemeName;
  heroVariant: "image-overlay" | "split" | "minimal";
  headerVariant: "dark" | "light";
  cardVariant: "icon-circle" | "standard" | "overlay";
  sectionVariant: "dark-accent" | "gradient" | "standard" | "banded";
}
```

**Showcase (`sites/showcase/`):**
- `registry/index.ts` — `ElementDefinition` with `category: ElementCategory` and `themes: string[]`
- 10 categories: Hero, Cards, Social Proof, CTAs, Content, Navigation, Blog, Stats, Typography, Tokens
- `render: (theme: string) => React.ReactNode` — branches on theme name to pick component
- `ThemeFrame` — wraps children in `data-theme={theme}` div for CSS-variable theming

**Existing component locations:**
- Shared: `packages/core-components/src/components/ui/` (~50+ components)
- Site-specific: `sites/[name]/components/ui/` (minimal — just ContactForm currently)
- Theme globals: `packages/themes/[name]/globals.css` (CSS utility classes that vary per theme)

### Codebase Snapshot

| File | What it contains |
|------|-----------------|
| `tools/generate-theme-from-reference.ts` | CLI entry: `--url`, `--image`, `--name`, `--output`, `--dry-run`, `--analyse`. Functions: `classifyLayoutPattern()` (Haiku), `analyseWithVision()` (Sonnet), `generateEnrichedThemeConfig()`, `createMinimalAnalysis()` |
| `tools/scaffold-theme-package.ts` | CLI: `--analysis <json>`, `--name <slug>`. Reads `ReferenceAnalysis`, writes `packages/themes/<name>/` with index.ts, globals.css, README.md, SETUP.md |
| `tools/lib/reference-analysis-types.ts` | `interface ReferenceAnalysis` with: `visualLanguage`, `detectedSections[]`, `componentMappings[]` (REUSE/ADAPT/NEW), `newComponentBacklog[]`, `registryRecommendation`, `themeTokenRecommendations` |
| `tools/lib/reference-analysis-prompts.ts` | `REFERENCE_ANALYSIS_PROMPT` — instructs Sonnet to map sections to hardcoded 17-component list |
| `tools/lib/component-mapping-catalog.ts` | `COMPONENT_CATALOG: Record<string, CatalogEntry>` — 15 entries, NEVER used by pipeline |
| `packages/theme-system/src/types.ts` | `THEME_NAMES`, `ThemeName`, `ComponentRegistry`, `ThemeConfig`, `DeepPartialThemeConfig` |
| `packages/themes/orion/index.ts` | `orionRegistry`, `orionDefaultConfig`, `registerTheme()` call |
| `packages/themes/nova/index.ts` | `novaRegistry`, `novaDefaultConfig` — generated by current pipeline, tokens only |
| `sites/showcase/registry/index.ts` | `ElementDefinition` interface, `elements` array, `categories` array |
| `sites/showcase/registry/hero.tsx` | Example: branches on `theme === 'orion'` to render `HeroWithImage` vs `HeroSection` |
| `sites/showcase/components/ThemeFrame.tsx` | `data-theme={theme}` wrapper for CSS-variable theming |

### What a Good Plan Should Cover

1. **Where do per-theme components live?** Currently all shared components are in `packages/core-components/`. Per-theme components need a new home — in the theme package? In a per-theme directory under core-components? Somewhere else?

2. **What replaces the REUSE/ADAPT/NEW matching?** The vision prompt currently asks the model to match against existing components. What should it ask instead? Just section detection + categorization?

3. **How does the component generation step work?** Currently gap components are built manually in a separate session. Should the pipeline generate component code directly? Or produce a spec that a developer/AI implements?

4. **What does the updated `ReferenceAnalysis` type look like?** The `componentMappings` and `newComponentBacklog` fields are matching-focused. What replaces them?

5. **How does the `ComponentRegistry` type evolve?** The current `heroVariant`/`headerVariant` etc. enums are a closed set. With per-theme unique components, does this type still make sense?

6. **How does the showcase consume per-theme components?** The current `render(theme)` function branches on theme name. With every theme having its own unique components, what's the registration pattern?

7. **What happens to existing themes (orion, vega)?** They currently share components from `core-components`. Do they get retrofitted to own their components, or is this new model only for newly-ingested themes?

8. **What about `globals.css` per theme?** Orion's globals has CSS classes (`.accent-underline`, `.icon-circle-lg`) that vega lacks. With per-theme components, does each theme's globals need to be self-contained?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-20_ingestion-pipeline-redesign/`.
