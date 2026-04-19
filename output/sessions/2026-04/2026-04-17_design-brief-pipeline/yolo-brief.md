# YOLO Implementation Brief: Design Brief Pipeline — Session 1 (Phases 0–3)

**Branch:** feature/design-brief-pipeline (created from develop)
**Session spec:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The platform creates white-label websites by cloning reference sites and extracting theme packages. The extraction step (`extract-theme.ts`) is fundamentally lossy — it discards HTML structure and generates stub components. The new approach: **extract a structured DesignBrief from analysis outputs, then forward-generate components using AI design skills**. The brief is a clean, skill-agnostic intermediate format containing only design decisions (colors, fonts, layout patterns, section structures) — no HTML or CSS from the reference.

This is Session 1 of 2. It builds the foundation: types, the deterministic compiler, and the skill adapter layer. Session 2 will build the generator orchestration, CLI, and skill command.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/design-brief-pipeline   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 0: Skill Installation

**Goal:** Install third-party design skills so adapters can reference their prompt formats.
**Model:** haiku — shell commands, no code changes

```bash
npx skills add pbakaus/impeccable
npx skills add google-labs-code/stitch-skills --skill stitch-design
npx skills add google-labs-code/stitch-skills --skill enhance-prompt
npx skills add google-labs-code/stitch-skills --skill design-md
npx skills add arvindrk/extract-design-system --skill extract-design-system
```

```bash
# Verification gate — STOP if this fails
ls ~/.claude/commands/ | grep -E "impeccable|stitch|extract-design"
```

After verifying, commit:

```bash
git add .claude/
git commit -m "chore: install design pipeline skills (impeccable, stitch, extract-design-system)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 1: DesignBrief Schema & Types

**Goal:** Create the Zod-validated DesignBrief schema — the central data contract for the entire pipeline.
**Model:** sonnet — significant TypeScript design with interconnected types

### Files to create

**`tools/lib/design-brief-types.ts`**

The schema has 8 top-level sections. Implement each exactly as specified:

1. **`meta`**

   ```typescript
   const MetaSchema = z
     .object({
       briefVersion: z.literal("1"),
       generatedAt: z.string(),
       sourceUrl: z.string().url().optional(),
       pipelineVersion: z.string(),
     })
     .strict();
   ```

2. **`reference`**

   ```typescript
   const ReferenceSchema = z
     .object({
       url: z.string().url(),
       screenshots: z.record(z.string()), // pageType → file path
       capturedAt: z.string(),
       fidelityAreas: z.array(z.string()).optional(),
     })
     .strict();
   ```

3. **`palette`** — use `.refine()` on every color field to reject strings containing `<` or `{`. Brand: primary, primaryHover, secondary, accent, onPrimary. Surface: background, foreground, secondaryForeground (optional), tertiaryForeground (optional), muted, mutedForeground, card, cardBorder, subtle (optional), subtleBorder (optional), inverse (optional), inverseMutedForeground (optional). Semantic: success, warning, error, info. Overlay: dark, light, primary. Provenance: `z.record(z.object({ source: z.enum(["computed", "vision", "derived", "css-scraped", "fallback"]), confidence: z.enum(["high", "medium", "low"]).optional() }))`.

4. **`typography`**

   ```typescript
   const TypographySchema = z
     .object({
       fontFamily: z
         .object({
           sans: z.array(z.string()),
           heading: z.array(z.string()).optional(),
         })
         .strict(),
       scale: z
         .record(
           z.enum(["hero", "h1", "h2", "h3", "h4", "body", "small", "caption"]),
           z
             .object({
               size: z.string().optional(),
               lineHeight: z.string().optional(),
               letterSpacing: z.string().optional(),
               weight: z.number().optional(),
             })
             .strict()
         )
         .optional(),
       headingStyle: z.enum(["sans", "serif", "display"]),
       headingWeight: z.enum(["bold", "extrabold", "black"]),
       bodyWeight: z.enum(["normal", "medium"]),
       usesInlineColorHighlights: z.boolean(),
     })
     .strict();
   ```

5. **`layout`**

   ```typescript
   const LayoutSchema = z
     .object({
       heroPattern: z
         .object({
           type: z.enum(["dark-full-bleed", "split", "centered", "light"]),
           hasBackgroundImage: z.boolean(),
           headerDark: z.boolean(),
         })
         .strict(),
       spacingDensity: z.enum(["compact", "standard", "spacious"]),
       containerWidth: z.string().optional(),
       sectionPaddingY: z.string().optional(),
     })
     .strict();
   ```

6. **`componentVariants`**

   ```typescript
   const ComponentVariantsSchema = z
     .object({
       heroVariant: z.enum(["image-overlay", "split", "fullscreen", "minimal", "split-geometric"]),
       headerVariant: z.enum(["dark", "light"]),
       headerStyle: z.enum(["transparent", "solid", "blur"]).optional(),
       cardVariant: z.enum(["icon-circle", "standard", "elevated", "overlay"]),
       sectionVariant: z.enum(["dark-accent", "gradient", "standard", "skewed", "banded"]),
       buttonRadius: z.string().optional(),
       cardRadius: z.string().optional(),
       cardShadow: z.enum(["none", "sm", "md", "lg"]).optional(),
     })
     .strict();
   ```

7. **`pageBlueprints`**

   ```typescript
   const SectionBlueprintBriefSchema = z
     .object({
       order: z.number(),
       id: z.string(),
       name: z.string(),
       category: z.enum([
         "Hero",
         "Navigation",
         "Cards",
         "CTA",
         "Content",
         "Social Proof",
         "Blog",
         "Stats",
         "Footer",
         "Custom",
       ]),
       purpose: z.string(),
       layoutPattern: z.string(),
       contentSlots: z.array(z.string()),
       interactionNeeds: z.enum(["none", "minimal", "stateful"]),
       tokenUsageHints: z.array(z.string()),
       confidence: z.enum(["high", "medium", "low"]).optional(),
     })
     .strict();

   const PageBlueprintBriefSchema = z
     .object({
       pageType: z.string(),
       sections: z.array(SectionBlueprintBriefSchema),
     })
     .strict();
   ```

8. **`visualTone`**
   ```typescript
   const VisualToneSchema = z
     .object({
       description: z.string(),
       designSkillHints: z
         .object({
           variance: z.number().min(1).max(10),
           density: z.number().min(1).max(10),
           motion: z.number().min(1).max(10),
         })
         .strict(),
       antiPatterns: z.array(z.string()),
       referenceDescription: z.string(),
     })
     .strict();
   ```

**Top-level export:**

```typescript
export const DesignBriefSchema = z
  .object({
    meta: MetaSchema,
    reference: ReferenceSchema,
    palette: PaletteSchema,
    typography: TypographySchema,
    layout: LayoutSchema,
    componentVariants: ComponentVariantsSchema,
    pageBlueprints: z.array(PageBlueprintBriefSchema),
    visualTone: VisualToneSchema,
  })
  .strict();

export type DesignBrief = z.infer<typeof DesignBriefSchema>;
// Also export sub-types for use in adapters and mappers:
export type PageBlueprintBrief = z.infer<typeof PageBlueprintBriefSchema>;
export type SectionBlueprintBrief = z.infer<typeof SectionBlueprintBriefSchema>;
export type DesignBriefPalette = z.infer<typeof PaletteSchema>;
export type DesignBriefTypography = z.infer<typeof TypographySchema>;
export type DesignBriefVisualTone = z.infer<typeof VisualToneSchema>;
```

**`tools/__fixtures__/briefs/sample-brief.json`**

Create a valid DesignBrief fixture by hand (not generated). Use realistic values appropriate for a trade business website (dark hero, red primary, professional tone). This fixture is used in all downstream tests. It must pass `DesignBriefSchema.parse()`.

**`tools/__fixtures__/briefs/invalid-brief-html-in-color.json`**

Copy of sample-brief with `"<div>"` injected into `palette.brand.primary`. Must fail validation.

**`tools/__fixtures__/briefs/minimal-brief.json`**

Minimal valid brief representing html-only mode output: no typography scale, no screenshots beyond home, 3 sections (Hero, Cards, CTA).

```bash
# Verification gate — STOP if this fails
npx tsx -e "
import { DesignBriefSchema } from './tools/lib/design-brief-types';
import valid from './tools/__fixtures__/briefs/sample-brief.json';
import invalid from './tools/__fixtures__/briefs/invalid-brief-html-in-color.json';
const r1 = DesignBriefSchema.safeParse(valid);
if (!r1.success) { console.error('FAIL: valid brief rejected:', r1.error.issues); process.exit(1); }
const r2 = DesignBriefSchema.safeParse(invalid);
if (r2.success) { console.error('FAIL: invalid brief accepted'); process.exit(1); }
console.log('PASS: schema validation works correctly');
"
```

Then commit:

```bash
git add tools/lib/design-brief-types.ts tools/__fixtures__/
git commit -m "feat(design-brief): DesignBrief Zod schema + test fixtures

- Strict schemas with HTML/CSS injection guards on color fields
- 8-section schema: meta, reference, palette, typography, layout, componentVariants, pageBlueprints, visualTone
- Valid, invalid, and minimal fixture files for offline testing

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 2: Brief Compiler

**Goal:** Build the deterministic compiler that transforms `SiteAnalysis + MappedTokens` into a `DesignBrief`. No AI calls.
**Model:** opus — 9 files with complex data mapping logic; must correctly handle all token reconciliation edge cases

### Key facts before coding

- `SiteAnalysis` is at `tools/lib/reference-analysis-types.ts`. Key fields: `visualLanguage`, `sectionBlueprints`, `pageBlueprints`, `themeTokenRecommendations`, `registryRecommendation`, `computedStyles`.
- `MappedTokens` is at `tools/lib/computed-style-token-mapper.ts`. Key fields: `config` (DeepPartialThemeConfig), `provenance` (Record<string, TokenProvenance>).
- The compiler reconstructs `MappedTokens` from `SiteAnalysis` via: `mapStylesToTokens(siteAnalysis.computedStyles)` — already exported.
- Read `output/ingestion/bexhill-removals/site-analysis.json` to understand the actual data shape before writing any mapper.

### Files to create

**`tools/lib/design-brief-mappers/map-palette.ts`**

```typescript
export function mapPalette(
  siteAnalysis: SiteAnalysis,
  mappedTokens: MappedTokens
): { palette: DesignBriefPalette; warnings: string[] };
```

Mapping logic (priority: themeTokenRecommendations → mappedTokens.config → derived → defaults):

- `brand.*` ← `siteAnalysis.themeTokenRecommendations.brand` (prefer) or `mappedTokens.config.colors?.brand`
- `surface.*` ← merge of both sources, prefer siteAnalysis, fill gaps from mappedTokens
- `semantic.*` ← hardcoded defaults `{ success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' }` (rarely extractable from reference sites)
- `overlay.*` ← derive from brand.primary: parse hex → `rgba(r,g,b,0.7)` for dark, `rgba(255,255,255,0.8)` for light, `rgba(r,g,b,0.8)` for primary
- `provenance` ← remap `mappedTokens.provenance` keys to match brief field paths; add `confidence` from source type
- Add to warnings any token where source is "fallback" or "css-scraped" (low confidence)

**`tools/lib/design-brief-mappers/map-typography.ts`**

```typescript
export function mapTypography(
  siteAnalysis: SiteAnalysis,
  mappedTokens: MappedTokens
): { typography: DesignBriefTypography; warnings: string[] };
```

- `fontFamily` ← `siteAnalysis.themeTokenRecommendations.typography` if present, else `mappedTokens.config.typography?.fontFamily`; fallback to `{ sans: ['system-ui', 'sans-serif'] }`
- `scale` ← `mappedTokens.config.typography?.scale` (direct mapping if computed styles captured); omit if not available
- `headingStyle`, `headingWeight`, `bodyWeight`, `usesInlineColorHighlights` ← `siteAnalysis.visualLanguage.typography` direct mapping

**`tools/lib/design-brief-mappers/map-layout.ts`**

```typescript
export function mapLayout(siteAnalysis: SiteAnalysis): {
  layout: DesignBriefLayout;
  warnings: string[];
};
```

- `heroPattern` ← `siteAnalysis.visualLanguage.heroPattern` direct mapping
- `spacingDensity` ← `siteAnalysis.visualLanguage.spacingDensity` direct mapping
- `containerWidth` ← infer from spacingDensity: compact → `"max-w-screen-xl"`, standard → `"max-w-7xl"`, spacious → `"max-w-6xl"`
- `sectionPaddingY` ← infer from spacingDensity: compact → `"py-12 md:py-16"`, standard → `"py-16 md:py-24"`, spacious → `"py-24 md:py-32"`

**`tools/lib/design-brief-mappers/map-component-variants.ts`**

```typescript
// REGISTRY_PRESETS maps theme names to their registry config
const REGISTRY_PRESETS = {
  vega: {
    heroVariant: "split",
    headerVariant: "light",
    cardVariant: "standard",
    sectionVariant: "standard",
  },
  orion: {
    heroVariant: "image-overlay",
    headerVariant: "dark",
    cardVariant: "icon-circle",
    sectionVariant: "dark-accent",
  },
  // ... other themes
};

export function mapComponentVariants(siteAnalysis: SiteAnalysis): {
  componentVariants: ComponentVariants;
  warnings: string[];
};
```

- Look up `siteAnalysis.registryRecommendation.themeName` in REGISTRY_PRESETS
- If found: use preset as base
- Overlay with visual cues: if `visualLanguage.heroPattern.headerDark` → set `headerVariant: "dark"`, `headerStyle: "solid"`
- If no preset found: derive heuristically from visualLanguage (dark header → orion-like, light → vega-like)

**`tools/lib/design-brief-mappers/map-page-blueprints.ts`**

```typescript
export function mapPageBlueprints(siteAnalysis: SiteAnalysis): {
  pageBlueprints: PageBlueprintBrief[];
  warnings: string[];
};
```

- Iterate `siteAnalysis.pageBlueprints` (v3 has per-page blueprints)
- For each page, map its sections from `siteAnalysis.sectionBlueprints` (matched by blueprint id)
- **Strip** all clone-specific fields: `cloneHtmlFragment`, `cloneRelevantCss`, `matchScore`, `matchConfidenceLevel`, `matchBreakdown`, `sectionIndex`
- Keep: `id`, `name`, `category`, `purpose`, `layoutPattern`, `contentSlots`, `interactionNeeds`, `tokenUsageHints`, `confidence`
- Add `order` field based on section position in page blueprint
- If `siteAnalysis.pageBlueprints` is empty, create a minimal homepage blueprint with 3 sections using `siteAnalysis.sectionBlueprints`

**`tools/lib/design-brief-mappers/map-visual-tone.ts`**

```typescript
export function mapVisualTone(
  siteAnalysis: SiteAnalysis,
  palette: DesignBriefPalette
): { visualTone: DesignBriefVisualTone; warnings: string[] };
```

Heuristic derivation:

- `description` ← compose from: heroPattern.type, spacingDensity, headingWeight, primary color warmth (warm/cool hue detection). Example: "Bold, professional dark-hero layout with tight spacing and high-contrast red accents"
- `designSkillHints.variance` ← count distinct section categories in sectionBlueprints; 1-3 → 4, 4-6 → 6, 7+ → 8
- `designSkillHints.density` ← spacingDensity: compact → 8, standard → 5, spacious → 3
- `designSkillHints.motion` ← count sections with `interactionNeeds !== "none"`; 0 → 3, 1-2 → 5, 3+ → 7
- `antiPatterns` ← derive from visual language: if spacious → "avoid tight card grids", if dark hero → "avoid light background hero variants", etc.
- `referenceDescription` ← free-text synthesis from available metadata

**`tools/lib/design-brief-mappers/index.ts`** — barrel export of all mapper functions

**`tools/lib/design-brief-compiler.ts`**

```typescript
import { mapPalette } from "./design-brief-mappers/map-palette";
import { mapTypography } from "./design-brief-mappers/map-typography";
// ... etc

export function compileDesignBrief(inputs: {
  siteAnalysis: SiteAnalysis;
  mappedTokens: MappedTokens;
  screenshotPaths: Record<string, string>;
}): { brief: DesignBrief; warnings: string[] };
```

Orchestrates all mappers, collects warnings, assembles the final DesignBrief:

```typescript
const meta: DesignBriefMeta = {
  briefVersion: "1",
  generatedAt: new Date().toISOString(),
  sourceUrl: siteAnalysis.reference.url,
  pipelineVersion: "1.0.0",
};
const reference = {
  url: siteAnalysis.reference.url,
  screenshots: screenshotPaths,
  capturedAt: siteAnalysis.reference.capturedAt,
};
// ... call each mapper, collect warnings
const brief = DesignBriefSchema.parse({
  meta,
  reference,
  palette,
  typography,
  layout,
  componentVariants,
  pageBlueprints,
  visualTone,
});
return { brief, warnings };
```

**`tools/lib/design-brief-renderer.ts`**

```typescript
export function renderBriefSummary(brief: DesignBrief): string;
```

Produces a human-readable markdown file. Include:

- **Color palette** table: token name | hex value | role
- **Typography** section: font families, heading style/weight
- **Layout** section: hero type, spacing density, container
- **Component variants** table: variant type | value
- **Page blueprints** section: per-page list of section IDs, categories, purposes
- **Visual tone** section: description, skill dial hints (variance/density/motion), anti-patterns
- **Warnings** section (if any): list of low-confidence mappings needing human review

**`tools/__fixtures__/analyses/`**

Copy `output/ingestion/bexhill-removals/site-analysis.json` to `tools/__fixtures__/analyses/bexhill-removals-site-analysis.json`. This is the offline fixture for compiler tests.

```bash
# Verification gate — STOP if this fails
npx tsx -e "
import { readFileSync } from 'fs';
import { mapStylesToTokens } from './tools/lib/computed-style-token-mapper';
import { compileDesignBrief } from './tools/lib/design-brief-compiler';
import { DesignBriefSchema } from './tools/lib/design-brief-types';

const siteAnalysis = JSON.parse(readFileSync('./tools/__fixtures__/analyses/bexhill-removals-site-analysis.json', 'utf-8'));
const mappedTokens = mapStylesToTokens(siteAnalysis.computedStyles ?? { pages: [] });
const { brief, warnings } = compileDesignBrief({ siteAnalysis, mappedTokens, screenshotPaths: {} });

// Validate schema
DesignBriefSchema.parse(brief);

// Property: no HTML/CSS in color fields
const briefStr = JSON.stringify(brief.palette);
if (briefStr.includes('<') || briefStr.includes('{')) {
  console.error('FAIL: HTML/CSS found in palette fields');
  process.exit(1);
}

// Determinism: run twice, outputs must match
const { brief: brief2 } = compileDesignBrief({ siteAnalysis, mappedTokens, screenshotPaths: {} });
if (JSON.stringify(brief) !== JSON.stringify(brief2)) {
  console.error('FAIL: compiler is not deterministic');
  process.exit(1);
}

console.log('PASS: compiler produces valid, clean, deterministic DesignBrief');
console.log('Warnings:', warnings);
"

pnpm type-check
```

Then commit:

```bash
git add tools/lib/design-brief-compiler.ts tools/lib/design-brief-mappers/ tools/lib/design-brief-renderer.ts tools/__fixtures__/analyses/
git commit -m "feat(design-brief): deterministic DesignBrief compiler with per-section mappers

- Orchestrator compileDesignBrief(): SiteAnalysis + MappedTokens → DesignBrief
- Per-section mappers: palette, typography, layout, componentVariants, pageBlueprints, visualTone
- Brief renderer: outputs human-readable markdown summary
- Analysis fixture from bexhill-removals for offline testing
- No AI calls in compiler — pure data transformation

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 3: Skill Adapters

**Goal:** Build the adapter layer that translates a DesignBrief into skill-specific generation prompts and parses responses back into section TSX blocks.
**Model:** sonnet — well-specified interface, 6 files, moderate complexity

### Read first

Before writing any adapter, read these files to understand the prompt patterns each skill uses:

- `~/.claude/commands/impeccable.md` (or wherever Impeccable installed) — understand `/craft` vocabulary
- `tools/lib/token-class-allowlist.ts` — for the shared constraints block

### Files to create

**`tools/lib/design-skills/adapter-types.ts`**

```typescript
export interface DesignSkillAdapter {
  id: string;
  name: string;

  /**
   * Build prompts for generating a full page (header + sections + footer).
   * Returns system prompt (skill personality) + user prompt (brief + blueprint).
   */
  buildPagePrompt(
    brief: DesignBrief,
    page: PageBlueprintBrief,
    options: {
      includeHeader: boolean;
      includeFooter: boolean;
      existingHeaderTsx?: string;   // TSX of frozen header (for page 2+)
      existingFooterTsx?: string;   // TSX of frozen footer (for page 2+)
    }
  ): { systemPrompt: string; userPrompt: string };

  /**
   * Build a targeted correction prompt for failing sections after visual QA.
   * diagnosis.sections contains briefDelta overrides for each failing section.
   */
  buildCorrectionPrompt(
    brief: DesignBrief,
    diagnosis: DiffDiagnosis,
    failingSectionIds: string[]
  ): string;

  /**
   * Parse the AI's raw response into individual section TSX blocks.
   * Looks for {/* SECTION: id */} markers. Falls back to single component.
   */
  normalizeOutput(raw: string): { sections: Array<{ id: string; tsx: string }> };
}

export interface DiffDiagnosis {
  sections: Array<{
    id: string;
    issue: string;
    severity: "major" | "minor";
    briefDelta: Record<string, unknown>;
  }>;
  overallAssessment: string;
  estimatedImprovement: number;
}
```

**`tools/lib/design-skills/shared-constraints.ts`**

```typescript
/**
 * Platform constraints injected into every skill prompt.
 * This block is appended to all prompts regardless of skill.
 */
export function buildConstraintsBlock(): string;
```

Returns a markdown-formatted constraint block containing:

- The list of allowed Tailwind token classes (import from `tools/lib/token-class-allowlist.ts` and format as a reference list)
- Animation primitive imports available: `import { RevealOnScroll, Carousel, ParallaxSection } from '@platform/core-components/components/animation'`
- CSS animation classes: `animate-fade-in-up`, `animate-slide-in-left`, `animate-slide-in-right`, `animate-scale-up`
- Export format: `export function ComponentName(props: ComponentNameProps) { ... }` — named export, no default
- TypeScript interface required for props
- React Server Component by default — no `useState`, `useEffect`, `"use client"` unless `interactionNeeds === "stateful"`
- No hardcoded hex colors — use only `bg-brand-primary`, `text-surface-foreground`, etc.
- Wrap each section in `{/* SECTION: section-id */}` comment markers so sections can be extracted

```typescript
/**
 * Format the brief's palette as a hex→token mapping table for inclusion in prompts.
 */
export function buildPaletteBlock(palette: DesignBriefPalette): string;

/**
 * Format the brief's typography as a rules block for inclusion in prompts.
 */
export function buildTypographyBlock(typography: DesignBriefTypography): string;

/**
 * Format a page blueprint as a section-by-section structure spec.
 */
export function buildBlueprintBlock(page: PageBlueprintBrief): string;
```

**`tools/lib/design-skills/adapters/generic-adapter.ts`**

For skills: `high-end-visual-design`, `design-taste-frontend`, `minimalist-ui`, `industrial-brutalist-ui`.

```typescript
export class GenericSkillAdapter implements DesignSkillAdapter {
  constructor(
    public readonly id: string,
    public readonly name: string,
    private readonly skillPersonality: string // the skill's system prompt / persona
  ) {}
  // ...
}
```

`buildPagePrompt` system prompt structure:

```
[skillPersonality — the skill's full design personality and rules]

[buildConstraintsBlock() — platform constraints, always last in system prompt]
```

`buildPagePrompt` user prompt structure:

````
## Design Brief

Reference: [url]
Visual Tone: [description]
Anti-patterns to avoid: [list]

## Color Palette (use these tokens, never hardcode hex)
[buildPaletteBlock(brief.palette)]

## Typography
[buildTypographyBlock(brief.typography)]

## Layout
Hero: [heroPattern.type], spacing: [spacingDensity]
Component variants: hero=[heroVariant], header=[headerVariant], card=[cardVariant]

## Page Blueprint — [pageType]
[buildBlueprintBlock(page)]

## Generation Instructions
Generate a complete [pageType] page as React TSX components.
[if includeHeader: "Include a Header component first."]
[if includeFooter: "Include a Footer component last."]
[if existingHeaderTsx: "Use this exact Header component (do not modify):\n```tsx\n[existingHeaderTsx]\n```"]
Wrap each section with {/* SECTION: section-id */} markers.
Use Tailwind CSS with the token classes above. No hardcoded colors.
````

`buildCorrectionPrompt` structure:

```
The following sections need corrections based on visual comparison with the reference:

[for each failing section in failingSectionIds]:
Section: [id]
Issue: [diagnosis.sections[id].issue]
Required changes: [diagnosis.sections[id].briefDelta formatted as readable adjustments]

Regenerate only these sections with the corrections applied. Keep all other sections unchanged.
Maintain {/* SECTION: id */} markers.
```

`normalizeOutput`:

- Parse response for `{/* SECTION: id */}` markers
- Extract TSX between consecutive markers
- If no markers found: treat entire response as a single component with id `"homepage"`

**`tools/lib/design-skills/adapters/impeccable-adapter.ts`**

Extends GenericSkillAdapter but customises the vocabulary for Impeccable's `/craft` methodology:

- Translates colors using tinted-neutral descriptions (OKLCH-aware language where possible)
- Maps `visualTone.antiPatterns` to Impeccable's explicit avoidance instructions
- Adds Impeccable's specific anti-slop directives to the system prompt preamble

**`tools/lib/design-skills/adapters/stitch-adapter.ts`**

For Stitch MCP workflow. Produces DESIGN.md-formatted output for `generate_screen_from_text`.

`buildPagePrompt` user prompt is a DESIGN.md structure:

```
# Design System

## Visual Theme & Atmosphere
[visualTone.description + referenceDescription]

## Color Palette & Roles
[palette formatted with Stitch naming conventions: "Deep Navy Blue (#1e3a5f) — primary brand color"]

## Typography Rules
[typography formatted with Stitch conventions]

## Component Stylings
[componentVariants formatted as component descriptions]

## Layout Principles
[layout formatted as whitespace/grid descriptions]

---

# Screen: [pageType]

[page blueprint formatted as numbered sections with Stitch-style descriptions]
```

`normalizeOutput` for Stitch: Stitch returns HTML, not TSX. For v1, treat the entire Stitch response as a single block with id `"stitch-output"` — the generator will handle conversion separately. Add a warning that Stitch output requires HTML→JSX conversion.

**`tools/lib/design-skills/adapter-registry.ts`**

```typescript
import { GenericSkillAdapter } from "./adapters/generic-adapter";
import { ImpeccableAdapter } from "./adapters/impeccable-adapter";
import { StitchAdapter } from "./adapters/stitch-adapter";

// Skill personalities — brief descriptions used as system prompt context.
// We don't inline the full skill SKILL.md content here; adapters reference the
// installed skill's personality via these shorthand descriptions.
const SKILL_PERSONALITIES = {
  "high-end":
    "You are a premium agency UI engineer. Design with editorial sophistication, asymmetric layouts, premium typography, and hardware-accelerated animations. Avoid generic patterns.",
  "design-taste":
    "You are a senior UI engineer with metric-based design rules. Apply calibrated variance (variance=8, motion=6, density=4). No generic patterns, no AI slop.",
  minimalist:
    "You are a minimalist UI engineer. Clean editorial interfaces, warm monochrome palettes, flat bento grids, diffuse shadows. No gradients, no heavy shadows.",
  brutalist:
    "You are an industrial brutalist UI engineer. Swiss typography, rigid CSS grids, extreme type contrast, utilitarian color. Raw mechanical interfaces.",
};

export function getAdapter(skillId: string): DesignSkillAdapter {
  switch (skillId) {
    case "impeccable":
      return new ImpeccableAdapter();
    case "stitch":
      return new StitchAdapter();
    case "high-end":
      return new GenericSkillAdapter(
        "high-end",
        "High-End Visual Design",
        SKILL_PERSONALITIES["high-end"]
      );
    case "design-taste":
      return new GenericSkillAdapter(
        "design-taste",
        "Design Taste Frontend",
        SKILL_PERSONALITIES["design-taste"]
      );
    case "minimalist":
      return new GenericSkillAdapter(
        "minimalist",
        "Minimalist UI",
        SKILL_PERSONALITIES["minimalist"]
      );
    case "brutalist":
      return new GenericSkillAdapter(
        "brutalist",
        "Industrial Brutalist UI",
        SKILL_PERSONALITIES["brutalist"]
      );
    default:
      throw new Error(
        `Unknown skill: ${skillId}. Valid: impeccable, stitch, high-end, design-taste, minimalist, brutalist`
      );
  }
}

export const AVAILABLE_SKILLS = [
  "impeccable",
  "stitch",
  "high-end",
  "design-taste",
  "minimalist",
  "brutalist",
] as const;
export type SkillId = (typeof AVAILABLE_SKILLS)[number];
```

```bash
# Verification gate — STOP if this fails
npx tsx -e "
import { getAdapter } from './tools/lib/design-skills/adapter-registry';
import { DesignBriefSchema } from './tools/lib/design-brief-types';
import { readFileSync } from 'fs';

const brief = JSON.parse(readFileSync('./tools/__fixtures__/briefs/sample-brief.json', 'utf-8'));
const homepageBp = brief.pageBlueprints.find((p: any) => p.pageType === 'home') ?? brief.pageBlueprints[0];

// Test generic adapter
const genericAdapter = getAdapter('high-end');
const { systemPrompt, userPrompt } = genericAdapter.buildPagePrompt(brief, homepageBp, { includeHeader: true, includeFooter: true });
if (!systemPrompt || !userPrompt) { console.error('FAIL: generic adapter returned empty prompts'); process.exit(1); }
if (!userPrompt.includes('SECTION:')) { console.error('FAIL: user prompt missing SECTION marker instructions'); process.exit(1); }

// Test impeccable adapter
const impeccableAdapter = getAdapter('impeccable');
const { systemPrompt: iSys } = impeccableAdapter.buildPagePrompt(brief, homepageBp, { includeHeader: true, includeFooter: true });
if (!iSys) { console.error('FAIL: impeccable adapter returned empty system prompt'); process.exit(1); }

// Test normalizeOutput with markers
const mockResponse = \`
{/* SECTION: hero */}
export function Hero(props: HeroProps) { return <div className='bg-brand-primary'>Hero</div>; }
{/* SECTION: cards */}
export function Cards(props: CardsProps) { return <div>Cards</div>; }
\`;
const result = genericAdapter.normalizeOutput(mockResponse);
if (result.sections.length !== 2) { console.error('FAIL: expected 2 sections, got', result.sections.length); process.exit(1); }
if (result.sections[0].id !== 'hero') { console.error('FAIL: first section id should be hero'); process.exit(1); }

console.log('PASS: all adapters return valid prompts and parse section markers correctly');
"

pnpm type-check
```

Then commit:

```bash
git add tools/lib/design-skills/
git commit -m "feat(design-brief): skill adapter layer with generic, impeccable, and stitch adapters

- DesignSkillAdapter interface: buildPagePrompt, buildCorrectionPrompt, normalizeOutput
- GenericSkillAdapter for high-end/design-taste/minimalist/brutalist skills
- ImpeccableAdapter with OKLCH-aware color descriptions and anti-slop directives
- StitchAdapter producing DESIGN.md-formatted prompts
- AdapterRegistry maps skill IDs to adapter instances
- Shared constraints block: platform token rules, animation imports, RSC defaults
- Section extraction via {/* SECTION: id */} comment markers with single-component fallback

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Parallel Execution Groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed.

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                       | File overlap      | Model  | Rationale                                           |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ | --------------------------------------------------- |
| G1    | Phase 0 | All 5 `npx skills add` commands                                                                                                                             | none              | haiku  | Independent install commands — batch in one message |
| G2    | Phase 2 | Read `tools/lib/reference-analysis-types.ts`, `tools/lib/computed-style-token-mapper.ts`, `tools/__fixtures__/analyses/bexhill-removals-site-analysis.json` | none (reads only) | n/a    | Independent reads — batch before writing any mapper |
| G3    | Phase 2 | Write `map-palette.ts`, `map-typography.ts`, `map-layout.ts`                                                                                                | none              | sonnet | Independent mapper files, no shared state           |
| G4    | Phase 2 | Write `map-component-variants.ts`, `map-page-blueprints.ts`, `map-visual-tone.ts`                                                                           | none              | sonnet | Independent mapper files                            |
| G5    | Phase 3 | Read `~/.claude/commands/impeccable.md`, `tools/lib/token-class-allowlist.ts`                                                                               | none (reads only) | n/a    | Independent reads before writing adapters           |
| G6    | Phase 3 | Write `generic-adapter.ts`, `stitch-adapter.ts`                                                                                                             | none              | sonnet | Independent adapter files                           |

### Cross-phase groups

| Group  | Phases | Items | Rationale                             |
| ------ | ------ | ----- | ------------------------------------- |
| (none) |        |       | All phases have ordering dependencies |

### Sequential points — MUST NOT parallelise

| Item                                                   | Reason                                                 |
| ------------------------------------------------------ | ------------------------------------------------------ |
| Verification gates (`pnpm type-check`, inline npx tsx) | Each phase's output gates the next                     |
| Git commits                                            | One commit per phase, in order                         |
| `map-index.ts` barrel                                  | Must be written after all mappers exist                |
| `design-brief-compiler.ts`                             | Must be written after all mappers exist                |
| `adapter-registry.ts`                                  | Must be written after all adapters exist               |
| `impeccable-adapter.ts`                                | Extends GenericSkillAdapter — must write generic first |

---

## Cost Estimate

| Phase                  | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 0: Skill install | haiku  | ~2k               | ~0.5k              | ~$0.00     |
| Phase 1: Schema        | sonnet | ~8k               | ~4k                | ~$0.08     |
| Phase 2: Compiler      | opus   | ~30k              | ~10k               | ~$1.20     |
| Phase 3: Adapters      | sonnet | ~20k              | ~8k                | ~$0.18     |
| **Total**              |        | **~60k**          | **~22k**           | **~$1.46** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

   Estimate tokens from: files read (lines x 5) and written (lines x 5).
   For exact figures: check console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** Session 1 — Phases 0-3 complete

[1-paragraph summary: what was implemented, any surprises, what Session 2 needs to pick up]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel Execution Groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning (Phase 2)
- The Co-Authored-By line in commits must reflect the orchestrator model used: `Claude Sonnet 4.6`
- This brief does NOT touch pipeline tools or theme packages, so `pnpm pipeline:smoke` is not required

## Completed

**Date:** 2026-04-17
**Status:** Session 1 — Phases 0-3 complete

Implemented the full DesignBrief pipeline foundation: Phase 0 installed 5 design skills (impeccable, stitch-design, enhance-prompt, design-md, extract-design-system) via `npx skills add --yes` into `.agents/skills/`. Phase 1 created the 8-section Zod DesignBrief schema with HTML/CSS injection guards and three fixture files (valid, invalid, minimal). Phase 2 built the deterministic compiler — 6 per-section mappers (palette, typography, layout, componentVariants, pageBlueprints, visualTone) plus the orchestrating `compileDesignBrief()` function and a markdown renderer. Phase 3 created the skill adapter layer: `DesignSkillAdapter` interface, `GenericSkillAdapter`, `ImpeccableAdapter` (extends generic with OKLCH color descriptions and anti-slop directives), `StitchAdapter` (DESIGN.md format for Stitch MCP), and an `adapter-registry`. Two deviations noted: skills installed to `.agents/skills/` not `~/.claude/commands/` (different CLI behaviour); verification gate Phase 2 HTML check was `JSON.stringify(brief.palette).includes('{')` which always fails (JSON uses `{`), fixed by checking only color string values — the Zod `.refine()` already enforces this correctly. Session 2 needs to build the generator orchestration, CLI tool, and `/generate-theme-from-brief` skill command.

### Commits

- `84d6160` chore: install design pipeline skills (impeccable, stitch, extract-design-system)
- `1ab64e1` feat(design-brief): DesignBrief Zod schema + test fixtures
- `87bc365` feat(design-brief): deterministic DesignBrief compiler with per-section mappers
- `d1f9d37` feat(design-brief): skill adapter layer with generic, impeccable, and stitch adapters
