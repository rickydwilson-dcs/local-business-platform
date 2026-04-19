# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-04/2026-04-18_component-composition-system/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-18_component-composition-system/
```

---

## Brief: Component Composition System

**Date:** 2026-04-18
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The current platform generates per-site websites by having Claude write raw TSX for each section based on a visual analysis of a reference site. This approach has three failure modes: layout failures (flex children collapsing, images shrinking to zero), style drift (hardcoded hex colours, invented token class names), and section incompleteness (placeholder comments where the AI couldn't produce a working section).

The deeper problem is architectural: the AI conflates two distinct tasks — structural composition (which components appear, in what layout) and visual styling (what those components look like) — into a single generative act that produces fragile, hard-to-validate output.

The developer wants to replace this with a **configuration-driven composition system**:

1. A **library of purpose-built components** (built fresh, not retrofitted), each exporting typed slot declarations so individual sub-elements can be toggled on or off per site.
2. A **per-site composition config** (JSON) that declares which components appear on each page, in what order, with which slots active and which layout parameters set.
3. A **per-site visual transfer** (token values + CSS) derived from a reference site or Stitch design — not a reusable "theme package", just per-site config files.
4. A **two-pass AI pipeline** that separates the structural pass (select components, configure slots/layout → composition.json) from the visual pass (extract design language → theme.config.ts + CSS).

Importantly: **named theme packages are not a required layer**. The existing `packages/themes/orion`, `vega`, etc. become optional presets, not architecture. Every site gets its own composition config and visual config derived from its own reference.

Visual individuality in this model comes from: which components appear and which don't, their order and layout params, which sub-elements are active, and the CSS applied to them. The component is a structural skeleton — CSS does the creative work. This is not a constraint on design quality; it's where design quality lives.

### Goals

1. Define the component slot system — how components declare sub-element toggles in a typed, composable way
2. Define the composition config schema — the JSON structure that expresses page structure per site
3. Define the two-pass pipeline architecture — how structural analysis and visual analysis are separated
4. Define the component library structure — what components to build, what slots each should have, how they integrate with the token system
5. Enable a proof-of-concept: one reference site → one working home page, rendered without any AI-generated TSX

### Non-Goals

- Migrating or retrofitting the existing 55 components in `packages/core-components`
- Maintaining named theme packages as a required architectural layer
- Full pipeline CLI integration (manual JSON files are acceptable for PoC)
- Multi-page rendering (home page only for PoC)
- Backwards compatibility with the existing design-brief-generator TSX output

### Acceptance Criteria

1. A Zod schema for `SiteCompositionConfig` exists and validates: page type, ordered sections, component name (enum from catalog), slot overrides, layout params, conditions
2. A set of 6–8 new components exists in the library, each exporting `SlotsConfig`, `DEFAULT_SLOTS`, and accepting `slots?: Partial<SlotsConfig>` and `layout` params — using token classes only, no hardcoded colours
3. A page renderer function exists: given a `SiteCompositionConfig` and a page type, it resolves components and renders the page
4. A structural analysis prompt exists that takes a `DesignBrief` as input and produces a valid `SiteCompositionConfig` (validated by Zod before use)
5. A visual analysis prompt exists that takes a `DesignBrief` as input and produces `theme.config.ts` token values + CSS overrides
6. A PoC test site renders a home page from composition + token config alone, with no hand-written page TSX

### Constraints

**Hard architectural constraints:**

- All components use Tailwind token classes only — no hardcoded hex values, no inline styles, no `theme()` function in CSS
- Components are React Server Components by default — no `"use client"` unless genuinely stateful (accordion open/close, mobile menu, carousel)
- No `packages/themes/**` globs in Tailwind content config — use scoped globs (`packages/themes/*/*.{ts,tsx}`) to avoid descending into node_modules
- CSS `@import url()` for Google Fonts is broken by Tailwind — use `<link>` tags in layout.tsx instead
- `next build --webpack` in production (not Turbopack) — Turbopack has PostCSS bugs in CI
- Named exports only, no default exports, TypeScript interfaces for all props

**Pipeline constraints:**

- The existing `DesignBrief` schema (Zod-validated, produced by `tools/lib/design-brief-compiler.ts`) is the input to both analysis passes — do not redesign the ingestion pipeline
- The existing `computed-style-token-mapper.ts` already extracts button padding, border-radius, shadow — use this data in the visual pass
- Token provenance tracking (source: "computed" | "vision" | "derived" | etc.) should be preserved through to the visual output

**Component library constraints:**

- Components must work as Next.js Server Components (no React context, no useState at layout level)
- `SlotsConfig` is the mechanism for sub-element toggling — binary show/hide only; style variants belong in token values or layout params
- The slot system must be backwards-compatible: passing no `slots` prop renders the full component

### Relevant Architecture

**Current token system (`packages/theme-system/src/types.ts`):**

- `ThemeConfig` defines: colors (brand, surface, semantic, overlay), spacing (xs–4xl), radii, shadows, zIndex, transitions, opacity, typography (fontFamily, fontWeight, type scale: hero/h1–h4/body/small/caption), fonts (preload), components (button, card, hero, navigation, section)
- `ComponentRegistry` is metadata-only: heroVariant, headerVariant, cardVariant, sectionVariant — used by tooling, not at runtime
- Tailwind plugin transforms ThemeConfig → CSS custom properties (`:root { --color-brand-primary: #xxx }`) and extends Tailwind with utility classes (`bg-brand-primary` → `var(--color-brand-primary)`)

**Current pipeline (`tools/lib/`):**

- `reference-analysis-prompts.ts` — Claude Vision prompts that extract: palette (5 hex values + provenance), typography (weights, style), hero pattern, spacing density, section blueprints (per-section: category, layoutPattern, contentSlots, interactionNeeds, tokenUsageHints)
- `design-brief-compiler.ts` — combines SiteAnalysis + MappedTokens → DesignBrief (Zod-validated)
- `core-component-catalog.ts` — 24 components with: requiredSlots, layoutCues, interaction level, import path
- `design-brief-types.ts` — DesignBrief schema including palette with provenance, typography scale, componentVariants, pageBlueprints (sections with order/id/name/category/layoutPattern/contentSlots/confidence), constraints

**Real pipeline output (navagarden.hu):**

```json
{
  "palette": { "brand": { "primary": "#DBA746", "secondary": "#1E2F4B" }, ... },
  "typography": { "fontFamily": { "sans": "Work Sans", "heading": "Audrey" }, "headingStyle": "serif" },
  "componentVariants": { "heroVariant": "split", "headerVariant": "light" },
  "pageBlueprints": [
    {
      "pageType": "home",
      "sections": [
        { "id": "hero-split", "name": "HeroSplit", "category": "Hero", "layoutPattern": "split layout text-left image-right", "contentSlots": ["heading", "subheading", "ctaButton", "heroImage"], "confidence": "high" }
      ]
    }
  ]
}
```

**Real pipeline output (designlab-eastbourne.co.uk):**

```json
{
  "palette": { "brand": { "primary": "#ED9507" }, "surface": { "background": "#121212", "foreground": "#FFFFFF" } },
  "typography": { "fontFamily": { "sans": "century-gothic", "heading": "Inter" }, "headingStyle": "sans", "headingWeight": "bold" },
  "componentVariants": { "heroVariant": "image-overlay", "headerVariant": "dark", "cardVariant": "icon-circle", "sectionVariant": "dark-accent" },
  "pageBlueprints": [ ... 34 sections across 9 page types ... ]
}
```

**Per-site config today (`sites/dj-fox-electrical/theme.config.ts`):**

```typescript
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: orionRegistry,
  colors: { brand: { primary: '#db0b0b', primaryHover: '#ba0909' } },
  typography: { fontFamily: { sans: ['var(--font-outfit)', 'Outfit', ...] } },
  components: { button: { fontWeight: 600 } }
};
```

### Codebase Snapshot

| File                                           | Purpose                                                    |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `packages/theme-system/src/types.ts`           | ThemeConfig, ComponentRegistry, Zod schemas                |
| `packages/theme-system/src/tailwind-plugin.ts` | CSS variable generation from tokens                        |
| `tools/lib/design-brief-types.ts`              | DesignBrief Zod schema (pipeline output)                   |
| `tools/lib/design-brief-compiler.ts`           | Assembles DesignBrief from analysis + computed tokens      |
| `tools/lib/core-component-catalog.ts`          | 24-entry catalog with requiredSlots, layoutCues            |
| `tools/lib/reference-analysis-prompts.ts`      | Vision prompts → SiteAnalysis JSON                         |
| `packages/themes/vega/index.ts`                | Example: ComponentRegistry + DeepPartialThemeConfig export |
| `packages/themes/orion/index.ts`               | Example: ComponentRegistry + DeepPartialThemeConfig export |
| `sites/dj-fox-electrical/theme.config.ts`      | Example per-site config                                    |
| `output/briefs/navagarden/design-brief.json`   | Real pipeline output (gold/navy garden site)               |
| `output/briefs/designlab/design-brief.json`    | Real pipeline output (dark orange design agency)           |

### What a Good Plan Should Cover

1. **Slot system TypeScript shape** — exactly how a component declares its slots, exports its defaults, and merges passed overrides. How does this interact with optional data props (e.g. `location?` on TestimonialCard)?

2. **Composition config schema** — the full Zod shape for `SiteCompositionConfig`. How are component names validated (enum vs string)? How are slot overrides type-checked against the specific component's SlotsConfig? How does `condition` work (what string values, evaluated how)?

3. **Component library — which components to build first** — what 6–8 components cover the home page use case across both the navagarden and designlab reference sites? What slots does each need?

4. **Page renderer** — how does it work at runtime? Dynamic import by component name? Static registry map? How does it handle unknown component names gracefully?

5. **Structural analysis pass** — what prompt produces a valid `SiteCompositionConfig` from a `DesignBrief`? How is the component catalog communicated to the model? How is the output validated?

6. **Visual analysis pass** — what prompt produces token values and CSS from a `DesignBrief`? What is the exact output format? How does it integrate with the existing `ThemeConfig` Zod schema?

7. **PoC site setup** — where does the test site live? How does it consume the composition config and token config at build time? What does `app/page.tsx` look like under this model?

8. **Where named theme packages fit** — are they kept as presets? Removed? What happens to existing sites (dj-fox-electrical, colossus-scaffolding) that currently depend on them?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-04/2026-04-18_component-composition-system/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04/2026-04-18_component-composition-system/`
