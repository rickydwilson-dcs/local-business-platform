# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-20_reference-theme-generation/`

When done, tell the user to run `/plan.with.codex synthesise` in Claude Code.

---

## Brief: Reference-Driven Theme Generation — New Theme + Component Gap Analysis

**Date:** 2026-02-20
**Project:** Local Business Platform monorepo (Next.js 15, Turborepo, pnpm workspaces)
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

---

### Problem Statement

The platform currently generates new client sites by: (a) extracting brand colours from a URL or logo image, (b) classifying the visual style as either "orion" or "vega" (two existing named themes), and (c) emitting a `theme.config.ts` that re-colours one of those existing themes. This is useful for simple re-colouring but fundamentally misses the purpose of a reference site.

What we actually want is: **given a reference site (URL + screenshot), produce a complete analysis of that site's visual language, map its components against our existing component library, identify gaps (sections/components that don't exist in our library), and — critically — treat the reference site as the target aesthetic for a genuinely new named theme.**

The test case is **ColorCode Events** (`https://colorcode.events/`), a tech conference website with a bold event/conference aesthetic that is neither orion (industrial dark) nor vega (clean professional). It has:

- Dark navy/purple page background (`#2A2A64`)
- Bold typographic hero with multi-colour inline word highlights (yellow, pink, blue highlight spans)
- Full-bleed horizontal coloured section bands (yellow, blue, green) used as high-contrast CTAs
- Event-specific info strip (date / time / venue)
- Blog post card grid with image thumbnails and dates
- Newsletter signup section
- Sponsor logo grid
- Multi-column footer

This workflow has two distinct sub-problems:

1. **Workflow A (reference → new theme):** Analyse the reference → produce a new named theme package with brand tokens + component registry + a component mapping report that tells a developer what to build/adapt.
2. **Workflow B (gap → cross-theme component):** For each new component identified in Workflow A that doesn't exist in the library, build it in `packages/core-components/` and wire it into ALL existing theme packages.

---

### Constraints

**Hard constraints — non-negotiable:**

- `ThemeName` is a TypeScript union type `"orion" | "vega"` in `packages/theme-system/src/types.ts`. Adding a new theme requires extending this union AND the Zod schema `ThemeNameSchema`. This is a **breaking change to a shared type** — every consumer of `ThemeName` must be updated.
- `ComponentRegistry` has an optional `theme: ThemeName` field. If `ThemeName` is extended, existing orion/vega registries remain valid. New registry entries must use the new name string.
- Components in `packages/core-components/` are **React Server Components** — no `use client`, no React context imports, no hooks. The `ThemeProvider` (React context) is client-only and must not be used in core-components.
- All styling uses **Tailwind CSS theme tokens only** — `bg-brand-primary`, `text-surface-foreground`, etc. No hardcoded hex colours in component files. This means a new theme's visual character comes entirely from its `theme.config.ts` token values.
- Theme packages live at `packages/themes/[name]/` and follow the exact structure of orion/vega:
  - `index.ts` — exports `[name]Registry: ComponentRegistry` and `[name]DefaultConfig: DeepPartialThemeConfig`, calls `registerTheme()`
  - `globals.css` — imports base CSS variables
  - `package.json` with `"name": "@platform/themes/[name]"`
  - `tsconfig.json`
- The `generate-theme-from-reference.ts` tool imports directly from package source (no build step): `import { ... } from '../packages/intake-system/src/theme-extraction/index'`
- All content is MDX-only — no new TypeScript data files, no hardcoded page content.
- Sites import theme packages: `import { vegaRegistry } from '@platform/themes/vega'` — this is a static build-time import.

**Soft constraints:**

- The new theme name (for ColorCode Events) should be generic enough to be reused for other event/conference businesses (not named "colorcode"). Something like `"nova"` or `"pulse"`.
- Component redesign (making existing components look like the reference site) is a **separate concern from component extraction** — the analysis tool should output design briefs, not attempt to auto-generate TSX.
- The gap component build (Workflow B) should not be part of the automated tool — it should produce a brief that a developer (Claude in YOLO mode) implements manually.

---

### Relevant Architecture

**How themes work:**

1. A site has `theme.config.ts` that exports `themeConfig: DeepPartialThemeConfig`
2. `themeConfig` includes `componentRegistry: [name]Registry` imported from `packages/themes/[name]`
3. The theme system's Tailwind plugin reads `theme.config.ts` at build time → generates CSS custom properties (`:root { --color-brand-primary: #xxx }`) → Tailwind utilities reference these variables (`bg-brand-primary` → `var(--color-brand-primary)`)
4. Components use Tailwind classes with theme tokens — they have no knowledge of which theme is active
5. `ThemeProvider` (React context, client-only) provides `theme` name and `registry` at runtime — used ONLY for mobile menu state, consent manager, and button tokens. NOT used by layout/page components.

**How component variant selection works currently:**

- `ComponentRegistry` is **metadata only** — it documents which variants a theme uses (e.g. `heroVariant: "image-overlay"`) but does NOT drive runtime component selection
- Sites statically import the components they want: `import { ServiceHero } from '@platform/core-components'`
- There are no per-theme component implementations yet — `packages/themes/orion/src/components/` and `packages/themes/vega/src/components/` directories don't exist yet

**The CSS variable approach means:**

- The same TSX component can look dramatically different between themes purely through token values
- A `CTASection` component that uses `bg-brand-primary` will be red on DJ Fox (orion), blue on colossus (vega), and navy/purple on a ColorCode Events site
- BUT: structural differences (dark hero vs light hero, full-bleed bands vs contained cards) cannot be achieved through tokens alone — they require different component implementations

---

### Codebase Snapshot

```
packages/
  theme-system/
    src/
      types.ts              # ThemeConfig, ComponentRegistry, ThemeName union, Zod schemas
      defaults.ts           # Base token values (spacing, radius, typography scale, etc.)
      tailwind-plugin.ts    # Tailwind plugin: theme.config.ts → CSS custom properties
      generate-css.ts       # generateCssVariables() function
      theme-registry.ts     # registerTheme(), getRegisteredThemes()
  themes/
    orion/
      index.ts              # orionRegistry, orionDefaultConfig, registerTheme('orion')
      globals.css           # CSS variable imports
      package.json          # "@platform/themes/orion"
      tsconfig.json
    vega/
      index.ts              # vegaRegistry, vegaDefaultConfig, registerTheme('vega')
      globals.css
      package.json          # "@platform/themes/vega"
      tsconfig.json
  core-components/
    src/
      components/
        ui/                 # ~58 components: hero-section, cta-section, blog-post-card,
                            # service-hero, faq-section, footer, site-header, etc.
        hero/               # HeroV1, HeroV2, HeroV3 variants
      index.ts              # Barrel export
  intake-system/
    src/
      theme-extraction/
        index.ts            # Exports extractStylesFromUrl, analyzeImage, generateThemeConfigContent
        theme-generator.ts  # generateThemeConfigContent(suggestion, siteName, themeVariant)
        website-analyzer.ts # extractStylesFromUrl() — CSS variable scraper
        image-analyzer.ts   # analyzeImage() — sharp pixel analysis

tools/
  generate-theme-from-reference.ts  # Current: URL/image → theme.config.ts only
  create-site-from-project.ts       # ProjectFile JSON → new site directory

sites/
  base-template/           # Gold-standard template (vega theme)
  dj-fox-electrical/       # Live site (orion theme, red)
  colossus-scaffolding/    # Reference site (vega theme, navy)

output/sessions/
  codex-peer-review/
    2026-02-20_reference-theme-generation/
      codex-prompt.md       # This file
      claude-plan.md        # Claude's independent plan (do not read before writing yours)
```

**Key type definitions:**

```typescript
// packages/theme-system/src/types.ts

export type ThemeName = "orion" | "vega"; // NEW THEME MUST BE ADDED HERE

export interface ComponentRegistry {
  theme: ThemeName;
  heroVariant: "image-overlay" | "split" | "minimal";
  headerVariant: "dark" | "light";
  cardVariant: "icon-circle" | "standard" | "overlay";
  sectionVariant: "dark-accent" | "gradient" | "standard";
}

// ThemeNameSchema = z.enum(["orion", "vega"])  // Zod — must be extended too
// ComponentRegistrySchema validates against these enums
```

**Current tool output (what we're extending FROM):**

```typescript
// generate-theme-from-reference.ts currently emits:
export const themeConfig: DeepPartialThemeConfig = {
  componentRegistry: orionRegistry,
  colors: { brand: { primary: '#2A2A64', ... }, surface: {...} },
  typography: { fontFamily: { sans: [...], heading: [...] } },
};
// That's it. No component analysis, no gap report, no new theme package.
```

---

### What a Good Plan Should Cover

1. **ThemeName extension strategy** — How to add new theme names to the union type without breaking existing orion/vega consumers. Is this done once (hardcoded new value) or is it made dynamic/registry-driven?

2. **Reference analysis tool design** — What does the `--analyse` mode of `generate-theme-from-reference.ts` actually produce? What information is captured, in what format (JSON? markdown?), and how is it used downstream?

3. **Vision analysis approach** — The CSS scraper (`extractStylesFromUrl`) missed ColorCode's vivid yellow/pink/blue palette entirely (returned all-black). A screenshot + Claude vision call is needed to reliably identify visual sections, colour palette, and component patterns. What model? What prompt structure? How does the screenshot get passed (file path → base64 → API)?

4. **Component mapping logic** — Given a list of visual sections detected in the reference site, how do we map each to an existing core-component (or flag as NEW)? Is this a static lookup table? Another Claude call? A hybrid?

5. **New theme package scaffolding** — What's the mechanical process to create `packages/themes/[name]/`? Is this a new tool (`scaffold-theme-package.ts`) or an extension of the existing tool? What files are created?

6. **Cross-theme component propagation (Workflow B)** — When a new component is added to `packages/core-components/`, what's the process for adding it to all existing theme packages? Is this manual? Is there a checklist? A tool?

7. **ComponentRegistry extension** — The ColorCode site has structural patterns that don't fit current variant enums (e.g. full-bleed coloured bands aren't `dark-accent`, `gradient`, or `standard`). Should the registry variant enums be extended? Or should theme-specific structural choices live outside the registry?

8. **Sequencing and phases** — What order should this be built in? What's the minimal viable first step that validates the approach?

---

## Deliverable

Produce a numbered implementation plan with:

- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-20_reference-theme-generation/`.
