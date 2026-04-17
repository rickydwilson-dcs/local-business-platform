# Claude's Plan: Reference-Driven Theme Generation

**Date:** 2026-02-20
**Status:** Draft — awaiting Codex peer review

---

## Phase 0: Extend ThemeName (Foundation)

The entire feature depends on being able to register new theme names. This must be done first as a shared prerequisite.

**0a. Extend `ThemeName` union and Zod schema**

File: `packages/theme-system/src/types.ts`

```typescript
// Before:
export type ThemeName = "orion" | "vega";
export const ThemeNameSchema = z.enum(["orion", "vega"]);

// After:
export type ThemeName = "orion" | "vega" | "nova";
export const ThemeNameSchema = z.enum(["orion", "vega", "nova"]);
```

**Risk:** Every consumer of `ThemeName` must be audited. Run `pnpm type-check` after this change — TypeScript exhaustiveness checks will surface any switch/case that needs updating.

**Note on "nova":** The new theme name should be generic (conference/event aesthetic), not named after the specific client. "Nova" suggests energy, brightness, bold colour. Alternatives: "pulse", "prism". This choice should be validated with the user before committing.

**Verification gate:**

```bash
pnpm type-check  # Must pass — no ThemeName consumers should break
```

---

## Phase 1: Vision-Based Reference Analysis

**1a. New function: `analyseReferenceWithVision()` in `generate-theme-from-reference.ts`**

The CSS scraper approach (`extractStylesFromUrl`) is unreliable for sites using inline styles, JS-rendered content, or non-standard CSS variable names. For ColorCode Events it returned all-black.

The reliable approach: pass the screenshot to Claude Sonnet (vision-capable) with a structured prompt that asks it to identify:

- Full colour palette (hex values from visual inspection)
- Section inventory (list of distinct visual sections top-to-bottom)
- Layout patterns (hero type, card style, header appearance)
- Typography observations (font weight, size relationships, style)

**Prompt structure for vision analysis:**

```
You are analysing a website screenshot to extract its design system for replication.

Analyse the screenshot and return a JSON object with this exact structure:
{
  "palette": {
    "background": "#hex",           // dominant page background
    "foreground": "#hex",           // primary text colour
    "primary": "#hex",              // most prominent brand colour
    "secondary": "#hex",            // second most prominent colour
    "accent": "#hex",               // highlight/CTA colour
    "additional": ["#hex", ...]     // other significant colours (max 4)
  },
  "typography": {
    "headingWeight": "bold|extrabold|black",
    "bodyWeight": "normal|medium",
    "headingStyle": "sans|serif|display",
    "usesInlineColourHighlights": true|false
  },
  "heroPattern": {
    "type": "dark-full-bleed|split|centered|light",
    "hasBackgroundImage": true|false,
    "headerDark": true|false
  },
  "sections": [
    {
      "name": "string (descriptive name)",
      "background": "#hex or 'transparent'",
      "layoutType": "full-bleed-band|contained|split|grid",
      "purpose": "cta|info|blog|about|testimonial|nav|footer|custom",
      "notes": "brief description of visual character"
    }
  ]
}
```

**API call:** Claude `claude-sonnet-4-6` with `type: "image"`, `source.type: "base64"`, `source.media_type: "image/png"`. Read the image file → `fs.readFileSync` → `Buffer.toString('base64')`.

**1b. New function: `mapSectionsToComponents()` in `generate-theme-from-reference.ts`**

Static lookup table: map `purpose` + `layoutType` combinations to our existing components.

```typescript
const COMPONENT_MAP: Record<string, { existing: string | null; notes: string }> = {
  "cta|full-bleed-band": { existing: "cta-section.tsx", notes: "Needs bg colour prop" },
  "blog|grid": { existing: "blog-post-card.tsx", notes: "Good match" },
  "hero|dark-full-bleed": { existing: "hero-section.tsx", notes: "Needs dark bg variant" },
  "info|split": { existing: "service-about.tsx", notes: "Adapt" },
  "nav|solid-dark": { existing: "site-header.tsx", notes: "Already supports dark" },
  "footer|multi-column": { existing: "footer.tsx", notes: "Good match" },
  // GAP entries:
  "info|event-strip": { existing: null, notes: "NEW: EventInfoStrip — date/time/venue" },
  "newsletter|inline": { existing: null, notes: "NEW: NewsletterSignup — email input + CTA" },
  "sponsors|logo-grid": { existing: null, notes: "NEW: SponsorGrid — logo array display" },
};
```

**1c. Output format: Reference Analysis Report**

Two files written to `--output` directory:

`reference-analysis.json`:

```json
{
  "url": "https://colorcode.events/",
  "analysedAt": "2026-02-20T...",
  "palette": { ... },
  "typography": { ... },
  "heroPattern": { ... },
  "sections": [ ... ],
  "componentMapping": [
    { "section": "Hero", "existing": "hero-section.tsx", "status": "ADAPT", "notes": "..." },
    { "section": "EventStrip", "existing": null, "status": "NEW", "notes": "EventInfoStrip" }
  ],
  "gapComponents": [
    { "name": "EventInfoStrip", "description": "Horizontal strip showing event date, time, venue with icon labels" },
    { "name": "NewsletterSignup", "description": "..." },
    { "name": "SponsorGrid", "description": "..." }
  ],
  "recommendedTheme": "nova",
  "themeConfig": { /* full DeepPartialThemeConfig object */ }
}
```

`reference-analysis.md` — human-readable markdown report with the same data, formatted as a design brief.

**Verification gate:**

```bash
npx tsx tools/generate-theme-from-reference.ts \
  --url https://colorcode.events/ \
  --image output/screencapture-colorcode-events-2026-02-20-12_32_12.png \
  --name colorcode-events \
  --analyse \
  --output output/sessions/2026-02-20_colorcode-theme/

# Expect: both files exist
ls output/sessions/2026-02-20_colorcode-theme/reference-analysis.{json,md}
# Expect: JSON is valid
node -e "JSON.parse(require('fs').readFileSync('output/sessions/2026-02-20_colorcode-theme/reference-analysis.json', 'utf8')); console.log('valid')"
# Expect: gapComponents array is populated
node -e "const r = JSON.parse(require('fs').readFileSync('output/sessions/2026-02-20_colorcode-theme/reference-analysis.json', 'utf8')); console.log(r.gapComponents.length + ' gap components')"
```

---

## Phase 2: New Theme Package Scaffolding

**2a. New tool: `tools/scaffold-theme-package.ts`**

Takes `--analysis <path/to/reference-analysis.json>` and `--name <theme-name>` and creates `packages/themes/[name]/`.

Files created:

- `packages/themes/[name]/package.json`
- `packages/themes/[name]/tsconfig.json`
- `packages/themes/[name]/globals.css`
- `packages/themes/[name]/index.ts` — registry + default config from analysis JSON
- `packages/themes/[name]/README.md` — documents the reference site, component mapping, gap list

The `index.ts` content:

```typescript
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const [name]Registry: ComponentRegistry = {
  theme: "[name]",            // from analysis.recommendedTheme
  heroVariant: "image-overlay",  // derived from analysis.heroPattern
  headerVariant: "dark",         // from analysis.heroPattern.headerDark
  cardVariant: "standard",       // from analysis.componentMapping
  sectionVariant: "standard",    // ColorCode uses colour-band CTAs, not dark-accent
};

export const [name]DefaultConfig: DeepPartialThemeConfig = {
  // ... from analysis.themeConfig
};

registerTheme({ name: '[name]', label: '[Label]', config: [name]DefaultConfig });
```

**Note on sectionVariant:** ColorCode's full-bleed coloured bands don't map to `"dark-accent"`, `"gradient"`, or `"standard"`. Options:

- Add a new variant string `"colour-band"` to the `ComponentRegistry` type
- Accept that `sectionVariant: "standard"` is a documentation approximation
- Recommendation: Don't extend the registry variants for now. The registry is metadata — the actual component implementation will handle the colour-band pattern. Document the discrepancy in the README.

**Verification gate:**

```bash
npx tsx tools/scaffold-theme-package.ts \
  --analysis output/sessions/2026-02-20_colorcode-theme/reference-analysis.json \
  --name nova

ls packages/themes/nova/  # Must exist
pnpm --filter @platform/themes/nova build  # Must succeed
pnpm type-check  # Must pass
```

**2b. Add nova to pnpm workspace and Turborepo**

File: `pnpm-workspace.yaml` — already includes `packages/themes/*` glob, so nova is automatically included.

File: `turbo.json` — no changes needed, inherits from workspace glob.

File: `packages/theme-system/src/theme-registry.ts` — no changes needed; `registerTheme('nova', ...)` is called at import time.

---

## Phase 3: Component Design Briefs

**Not automated.** The reference analysis JSON and markdown report contain all the information a developer needs. The output from Phase 1 IS the brief.

For each `gapComponent` in `reference-analysis.json`:

- `name`: the component name to create
- `description`: what it renders
- `referenceSection`: which section of the reference site it comes from
- `mappedToExisting`: null (it's a gap)
- `implementationNotes`: styling guidance derived from vision analysis

For each `ADAPT` component in `componentMapping`:

- The current component file path
- What the reference site does with that component type
- What styling changes would make it match the reference

**The markdown report (`reference-analysis.md`) is the YOLO brief** for Phase 4.

---

## Phase 4: Gap Component Build (Workflow B)

**Architecture decision: core-components first, then per-theme styling.**

New components go into `packages/core-components/src/components/ui/[ComponentName].tsx` as base implementations using theme tokens. This makes them available to ALL themes automatically.

Each new component:

1. Uses only Tailwind theme token classes (`bg-brand-primary`, `text-surface-foreground`, etc.)
2. Has a TypeScript interface for props
3. Is a Server Component (no `use client`)
4. Is exported from the core-components barrel (`packages/core-components/src/index.ts`)
5. Is added to the relevant theme registries' documentation (README updates, not code changes)

**Cross-theme propagation:** Because components use theme tokens, they automatically adapt to every theme's colour palette. No per-theme code changes needed for Workflow B. The "propagation" is automatic via the token system.

**Exception:** If a component requires structural variation by theme (e.g. EventInfoStrip should have a dark background on nova but light on vega), that's handled via props:

```typescript
interface EventInfoStripProps {
  date: string;
  time: string;
  venue: string;
  variant?: "dark" | "light"; // Optional, defaults to theme-appropriate
}
```

**Verification gate (per new component):**

```bash
pnpm type-check
pnpm --filter @platform/core-components build
# Visual check: add component to sites/base-template/ temporarily, run dev server
```

---

## File Inventory

| File                                                              | Action                                                            | Phase |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----- |
| `packages/theme-system/src/types.ts`                              | Edit — extend ThemeName union + Zod schema                        | 0     |
| `tools/generate-theme-from-reference.ts`                          | Edit — add `--analyse` flag + vision analysis + component mapping | 1     |
| `tools/scaffold-theme-package.ts`                                 | Create — new tool                                                 | 2     |
| `packages/themes/nova/package.json`                               | Create — generated by scaffold tool                               | 2     |
| `packages/themes/nova/tsconfig.json`                              | Create — generated                                                | 2     |
| `packages/themes/nova/globals.css`                                | Create — generated                                                | 2     |
| `packages/themes/nova/index.ts`                                   | Create — generated                                                | 2     |
| `packages/themes/nova/README.md`                                  | Create — generated                                                | 2     |
| `packages/core-components/src/components/ui/EventInfoStrip.tsx`   | Create                                                            | 4     |
| `packages/core-components/src/components/ui/NewsletterSignup.tsx` | Create                                                            | 4     |
| `packages/core-components/src/components/ui/SponsorGrid.tsx`      | Create                                                            | 4     |
| `packages/core-components/src/index.ts`                           | Edit — add new component exports                                  | 4     |

---

## Risks and Open Questions

1. **ThemeName is a closed union.** Every new theme requires a code change to `types.ts`. This is fine for now (we're adding one theme) but will become friction at scale. A future improvement would be a fully registry-driven approach where `ThemeName` is `string` and the Zod schema validates against the runtime registry. Not worth doing now.

2. **Vision analysis reliability.** Claude Sonnet's vision analysis of a screenshot is good but not pixel-perfect. The hex colours it extracts may be approximate. The output should be treated as a starting point, not a spec. The `reference-analysis.json` should include a `confidence` field per colour, and the markdown report should say "verify these colours against the original before implementing."

3. **Component mapping is heuristic.** The static lookup table maps `purpose + layoutType` combinations. Edge cases will need manual correction. The report should make this clear and include a "review this mapping" note.

4. **`sectionVariant` enum doesn't fit ColorCode.** ColorCode's full-bleed coloured bands are a new structural pattern. The registry metadata will say `"standard"` which is inaccurate. The README for the nova theme should document the actual pattern. If this causes confusion at scale, extending the enum should be revisited.

5. **Screenshot freshness.** The analysis is based on a point-in-time screenshot. The tool uses the provided image file — it does not re-scrape the site on each run. This is intentional (reproducible) but should be documented.

6. **`--analyse` vs current output.** The `--analyse` flag should be additive — it should still output `theme.config.ts` content but ALSO output the full analysis report. Backwards compatible.
