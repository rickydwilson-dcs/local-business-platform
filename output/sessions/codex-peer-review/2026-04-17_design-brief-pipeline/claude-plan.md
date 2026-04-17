# Claude Plan: Design Brief Pipeline

**Date:** 2026-04-17
**Author:** Claude (independent, pre-synthesis)

---

## Phase 1: DesignBrief Schema & Types

### Step 1.1: Create `tools/lib/design-brief-types.ts`

**New file.** Zod-validated schema defining the intermediate format between harvest and generation.

**Schema structure:**

```typescript
// Section A: Palette
const PaletteSchema = z.object({
  brand: z.object({
    primary: z.string(), // hex
    primaryHover: z.string(),
    secondary: z.string(),
    accent: z.string(),
    onPrimary: z.string(), // text color on primary bg
  }),
  surface: z.object({
    background: z.string(),
    foreground: z.string(),
    secondaryForeground: z.string().optional(),
    tertiaryForeground: z.string().optional(),
    muted: z.string(),
    mutedForeground: z.string(),
    card: z.string(),
    cardBorder: z.string(),
    subtle: z.string().optional(),
    subtleBorder: z.string().optional(),
    inverse: z.string().optional(),
    inverseMutedForeground: z.string().optional(),
  }),
  semantic: z.object({
    success: z.string(),
    warning: z.string(),
    error: z.string(),
    info: z.string(),
  }),
  overlay: z.object({
    dark: z.string(), // rgba
    light: z.string(),
    primary: z.string(),
  }),
  provenance: z.record(
    z.object({
      source: z.enum(["computed", "vision", "derived", "css-scraped", "fallback"]),
      confidence: z.enum(["high", "medium", "low"]).optional(),
    })
  ),
});

// Section B: Typography
const TypographySchema = z.object({
  fontFamily: z.object({
    sans: z.array(z.string()),
    heading: z.array(z.string()).optional(),
  }),
  scale: z
    .record(
      z.enum(["hero", "h1", "h2", "h3", "h4", "body", "small", "caption"]),
      z.object({
        size: z.string().optional(),
        lineHeight: z.string().optional(),
        letterSpacing: z.string().optional(),
        weight: z.number().optional(),
      })
    )
    .optional(),
  headingStyle: z.enum(["sans", "serif", "display"]),
  headingWeight: z.enum(["bold", "extrabold", "black"]),
  bodyWeight: z.enum(["normal", "medium"]),
  usesInlineColorHighlights: z.boolean(),
});

// Section C: Layout
const LayoutSchema = z.object({
  heroPattern: z.object({
    type: z.enum(["dark-full-bleed", "split", "centered", "light"]),
    hasBackgroundImage: z.boolean(),
    headerDark: z.boolean(),
  }),
  spacingDensity: z.enum(["compact", "standard", "spacious"]),
  containerWidth: z.string().optional(), // Tailwind class e.g. "max-w-7xl"
  sectionPaddingY: z.string().optional(), // Tailwind class e.g. "py-16 md:py-24"
});

// Section D: Component Variants
const ComponentVariantsSchema = z.object({
  heroVariant: z.enum(["image-overlay", "split", "fullscreen", "minimal", "split-geometric"]),
  headerVariant: z.enum(["dark", "light"]),
  headerStyle: z.enum(["transparent", "solid", "blur"]).optional(),
  cardVariant: z.enum(["icon-circle", "standard", "elevated", "overlay"]),
  sectionVariant: z.enum(["dark-accent", "gradient", "standard", "skewed", "banded"]),
  buttonRadius: z.string().optional(), // e.g. "rounded-lg"
  cardRadius: z.string().optional(),
  cardShadow: z.enum(["none", "sm", "md", "lg"]).optional(),
});

// Section E: Page Blueprints
const SectionBlueprintBriefSchema = z.object({
  order: z.number(),
  id: z.string(), // "hero-full-bleed"
  name: z.string(), // "HeroFullBleed" (PascalCase)
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
  layoutPattern: z.string(), // "full-bleed with overlay"
  contentSlots: z.array(z.string()),
  interactionNeeds: z.enum(["none", "minimal", "stateful"]),
  tokenUsageHints: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]).optional(),
});

const PageBlueprintBriefSchema = z.object({
  pageType: z.string(), // "home", "about", "services", etc.
  sections: z.array(SectionBlueprintBriefSchema),
});

// Section F: Visual Tone
const VisualToneSchema = z.object({
  description: z.string(), // Free-text: "Industrial, professional, bold red accents..."
  designSkillHints: z.object({
    variance: z.number().min(1).max(10),
    density: z.number().min(1).max(10),
    motion: z.number().min(1).max(10),
  }),
  antiPatterns: z.array(z.string()), // Things to avoid
  referenceDescription: z.string(), // What makes this site feel the way it does
});

// Top-level brief
export const DesignBriefSchema = z.object({
  version: z.literal("1"),
  reference: z.object({
    url: z.string().url(),
    screenshots: z.record(z.string()), // pageType → file path
    capturedAt: z.string(),
  }),
  palette: PaletteSchema,
  typography: TypographySchema,
  layout: LayoutSchema,
  componentVariants: ComponentVariantsSchema,
  pageBlueprints: z.array(PageBlueprintBriefSchema),
  visualTone: VisualToneSchema,
});

export type DesignBrief = z.infer<typeof DesignBriefSchema>;
```

**Design rationale:**

- Every field maps directly to either `SiteAnalysis`, `MappedTokens`, or `ReferenceAnalysis` — no fields require new analysis
- `provenance` tracks where each color came from (for debugging token mismatches)
- `pageBlueprints[].sections[]` is a cleaned version of `SectionBlueprint` without clone-specific fields (cloneHtmlFragment, cloneRelevantCss, matchScore, etc.)
- `visualTone` captures subjective qualities that inform design skill selection but aren't tokens

**Verification gate:** Write a test that creates a DesignBrief from fixture data and validates it against the Zod schema.

---

## Phase 2: Brief Compiler

### Step 2.1: Create `tools/lib/design-brief-compiler.ts`

**New file.** Pure data transformation — no AI calls.

**Function signature:**

```typescript
export function compileDesignBrief(inputs: {
  siteAnalysis: SiteAnalysis;
  mappedTokens: MappedTokens;
  screenshotPaths: Record<string, string>;
}): DesignBrief;
```

**Mapping logic:**

| Brief field                                 | Source                                                                                             | Transformation                                                                                    |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `palette.brand.*`                           | `siteAnalysis.themeTokenRecommendations.brand`                                                     | Direct mapping, hex values                                                                        |
| `palette.surface.*`                         | `siteAnalysis.themeTokenRecommendations.surface` + `mappedTokens.config.colors.surface`            | Merge: prefer siteAnalysis, fill gaps from mappedTokens                                           |
| `palette.semantic.*`                        | Hardcoded defaults (`#10b981`, `#f59e0b`, `#ef4444`, `#3b82f6`)                                    | Semantic colors rarely vary across reference sites                                                |
| `palette.overlay.*`                         | Derived from brand primary                                                                         | `rgba(r,g,b,0.7)` for dark, `rgba(255,255,255,0.8)` for light                                     |
| `palette.provenance`                        | `mappedTokens.provenance`                                                                          | Remap keys to match brief field paths                                                             |
| `typography.fontFamily`                     | `siteAnalysis.themeTokenRecommendations.typography` or `mappedTokens.config.typography.fontFamily` | Prefer siteAnalysis if available                                                                  |
| `typography.scale`                          | `mappedTokens.config.typography.scale`                                                             | Direct mapping if computed styles captured                                                        |
| `typography.headingStyle/Weight/bodyWeight` | `siteAnalysis.visualLanguage.typography`                                                           | Direct mapping                                                                                    |
| `layout.heroPattern`                        | `siteAnalysis.visualLanguage.heroPattern`                                                          | Direct mapping                                                                                    |
| `layout.spacingDensity`                     | `siteAnalysis.visualLanguage.spacingDensity`                                                       | Direct mapping                                                                                    |
| `componentVariants.*`                       | `siteAnalysis.registryRecommendation` → lookup `REGISTRY_PRESETS`                                  | Map theme name to preset, then overlay from visualLanguage                                        |
| `pageBlueprints`                            | `siteAnalysis.pageBlueprints` + `siteAnalysis.sectionBlueprints`                                   | Strip clone-specific fields, keep structure                                                       |
| `visualTone.description`                    | Derived from visualLanguage                                                                        | Compose from palette warmth, heroPattern, spacingDensity                                          |
| `visualTone.designSkillHints`               | Heuristic from siteAnalysis                                                                        | variance from section diversity, density from spacingDensity, motion from interactionNeeds counts |

**Edge case handling:**

- Missing computed styles: fall back to vision palette → hardcoded defaults
- Failed vision analysis (html-only mode): minimal brief with just computed styles + default blueprints (Hero, Cards, CTA)
- No discovered pages beyond home: single pageBlueprint with homepage sections only

**Verification gate:** Run compiler against a real `site-analysis.json` from a previous `/pipeline.ingest` run. Validate output with `DesignBriefSchema.parse()`. Manually review the JSON for sanity.

### Step 2.2: Create `tools/lib/design-brief-renderer.ts`

**New file.** Renders a `DesignBrief` to a human-readable markdown summary.

**Function:**

```typescript
export function renderBriefSummary(brief: DesignBrief): string;
```

Produces `design-brief-summary.md` with:

- Color swatches (hex values with descriptions)
- Typography stack
- Section-by-section page blueprint
- Visual tone narrative
- Component variant table

Purpose: lets the user review and manually tweak the brief before generation.

**Verification gate:** Run on fixture brief, confirm output is readable and complete.

---

## Phase 3: Design Skill Adapters

### Step 3.1: Create `tools/lib/design-brief-prompts.ts`

**New file.** Formats a `DesignBrief` into prompts suitable for different design skills.

**Core interface:**

```typescript
interface SkillAdapter {
  formatPagePrompt(
    brief: DesignBrief,
    pageBlueprint: PageBlueprintBrief,
    options: {
      includeHeader: boolean;
      includeFooter: boolean;
      existingHeader?: string; // TSX of previously generated header
      existingFooter?: string; // TSX of previously generated footer
    }
  ): string;

  formatSectionPrompt(brief: DesignBrief, section: SectionBlueprintBrief): string;
}
```

**Adapter implementations:**

**`GenericSkillAdapter`** (for high-end-visual-design, design-taste-frontend, minimalist-ui):

- Formats brief as a structured context block at the top of the prompt
- Includes full palette as hex→token mapping table
- Includes typography rules with explicit font stacks
- Includes section blueprint with purpose, layout, content slots
- Appends hard constraints: "Use only these Tailwind token classes", "No hardcoded hex", "Export as named function", "React Server Component unless interactionNeeds === stateful"

**`StitchAdapter`** (for stitch-design + enhance-prompt):

- Formats brief into the DESIGN.md format that Stitch skills expect
- Uses `enhance-prompt` methodology: mood amplification, structural organization, color role formatting
- Outputs a Stitch-optimized prompt suitable for `generate_screen_from_text` MCP call

**`ImpeccableAdapter`** (for pbakaus/impeccable):

- Formats brief as `/impeccable craft` input context
- Maps visual tone to Impeccable's vocabulary (tinted neutrals, OKLCH-aware color descriptions)
- Includes anti-pattern list from brief as explicit avoidance instructions

**Why adapters, not a single prompt:**
Each skill has different prompt formats and vocabulary. Impeccable expects `/craft` context. Stitch expects DESIGN.md + structural prompts. Our existing skills expect system context + component generation prompts. The adapter pattern keeps this contained — one adapter per skill family, swappable at runtime.

**Shared across all adapters:**

- Token constraint block (always appended)
- Animation primitive imports available
- Component shell format (server vs client component)
- The "existing header/footer" injection for page 2+

**Verification gate:** Generate prompts for the same brief with 2 different adapters. Manually review for correctness and skill-appropriateness.

---

## Phase 4: Generator

### Step 4.1: Create `tools/lib/design-brief-generator.ts`

**New file.** Takes a `DesignBrief` + skill choice → produces component files.

**Function signature:**

```typescript
export async function generateFromBrief(options: {
  brief: DesignBrief;
  themeName: string;
  skill: "impeccable" | "stitch" | "high-end" | "design-taste" | "minimalist" | "brutalist";
  outputDir: string;
  anthropicApiKey?: string;
}): Promise<GenerationResult>;
```

**Generation flow:**

1. **Select adapter** based on `skill` parameter
2. **Generate homepage:**
   a. Format full-page prompt (header + all sections + footer)
   b. Call Claude API with skill-specific system prompt loaded
   c. Parse response into individual section components
   d. Run validation pipeline on each component:
   - `validateTypeScriptSyntax()` → retry if failed
   - `validateTypeScriptSemantic()` → retry if failed
   - `validateAndFixTokenClasses()` → auto-fix
   - `autoRepairHexLiterals()` → auto-fix
   - `fixBracketNotationProps()` → auto-fix
   - `verifyNamedExport()` → fail if missing
     e. Write components to `{outputDir}/components/`
     f. Extract header and footer as fixed assets

3. **Assemble HomePage:**
   - Import all generated section components
   - Compose into a `HomePage` template following the page blueprint order
   - Write to `{outputDir}/pages/home.tsx`

4. **Write theme package files:**
   - Use `scaffoldThemePackage()` for: `index.ts`, `globals.css`, `manifest.ts`, `components/index.ts`
   - Override the registry with `brief.componentVariants`
   - Override the config colors with `brief.palette`
   - Override typography with `brief.typography`

**Key decision: page-level vs section-level generation:**

I recommend **page-level generation with section extraction**, not individual section prompts. Here's why:

- Design skills produce better visual coherence when they see the full page context
- Section-level generation tends to produce components that don't flow together (inconsistent padding, clashing visual weight)
- The homepage prompt includes the full blueprint, and the AI returns a single page with marked section boundaries
- We then split the response into individual components using comment markers or export boundaries

The prompt would instruct: "Generate a complete homepage with these sections. Wrap each section in a comment `{/* SECTION: section-id */}` so they can be extracted into individual components."

**Verification gate:** Generate a homepage for a test brief. Confirm all components pass validation. Confirm `index.ts` has correct registry and config.

### Step 4.2: Integrate with `scaffold-theme-package.ts`

**Modify existing file** (minimal changes). Add an optional parameter to accept pre-built config values from a `DesignBrief` instead of deriving them from `ReferenceAnalysis`:

```typescript
export function scaffoldThemePackage(
  analysis: ReferenceAnalysis | SiteAnalysis,
  name: string,
  outputDir?: string,
  briefOverrides?: {
    registry?: ComponentRegistry;
    config?: DeepPartialThemeConfig;
  }
): string;
```

When `briefOverrides` is provided, use those values instead of inferring from analysis. This ensures the brief's palette and variants are used exactly.

**Verification gate:** Scaffold a package with briefOverrides. Diff against a package scaffolded without overrides. Confirm only the token values differ.

---

## Phase 5: CLI Entry Point & Skill Command

### Step 5.1: Create `tools/generate-from-brief.ts`

**New file.** CLI orchestrator.

```
Usage:
  npx tsx tools/generate-from-brief.ts --url https://example.com --skill impeccable [--name my-theme]
  npx tsx tools/generate-from-brief.ts --brief output/briefs/my-theme/design-brief.json --skill high-end [--name my-theme]

Flags:
  --url <website>     Entry A: full pipeline (harvest + compile + generate)
  --brief <path>      Entry B: skip harvest, use existing brief
  --skill <name>      Required: impeccable | stitch | high-end | design-taste | minimalist | brutalist
  --name <slug>       Theme name (auto-assigned if omitted)
  --output <dir>      Brief output directory (default: output/briefs/<name>/)
  --qa-iterations <n> Visual QA iterations (default: 3, 0 = skip QA)
  --dry-run           Compile brief only, no generation
```

**Orchestration flow:**

1. Parse CLI args
2. If `--url`: run `analyse-site.ts` subprocess → get `SiteAnalysis` + `MappedTokens`
3. If `--url`: compile brief via `compileDesignBrief()` → write `design-brief.json` + `design-brief-summary.md`
4. If `--brief`: read existing brief JSON
5. Validate brief with `DesignBriefSchema.parse()`
6. If `--dry-run`: stop here
7. Generate theme package via `generateFromBrief()`
8. If `--qa-iterations > 0`: run visual QA loop

### Step 5.2: Create `.claude/commands/pipeline.design-brief.md`

**New file.** Skill definition for `/pipeline.design-brief`.

**Phases:**

- **A: Preflight** — verify on `develop` branch, parse arguments
- **B: Harvest** — run `analyse-site.ts` (reuse pipeline.ingest Phase A0)
- **C: Compile Brief** — run compiler, write to `output/briefs/<name>/`, display summary
- **D: Skill Selection** — show available skills, display recommendation based on brief visual tone, user picks
- **E: Generate Homepage** — run generator for homepage (header + footer + body sections)
- **F: Test Site + QA** — scaffold test site from base-template, wire theme, run visual QA loop
- **G: Review** — display side-by-side screenshots (reference vs generated), prompt for manual approval or re-run with different skill

**Verification gate:** Run the full skill against a known URL. Confirm each phase completes and produces expected artifacts.

---

## Phase 6: Visual QA Enhancement

### Step 6.1: Enhance `tools/lib/visual-qa-loop.ts`

**Modify existing file.** Add a vision-based diff diagnosis step.

**New function:**

```typescript
async function diagnoseVisualDiff(
  referenceScreenshot: string,
  generatedScreenshot: string,
  pixelDiffPercent: number
): Promise<DiffDiagnosis>;
```

Uses Claude vision API to compare two screenshots and produce:

```typescript
interface DiffDiagnosis {
  sections: Array<{
    id: string; // which section differs
    issue: string; // "hero is too tall", "card grid has 2 cols not 3"
    severity: "major" | "minor";
    suggestedFix: string; // "reduce hero min-height", "change grid-cols-2 to grid-cols-3"
  }>;
  overallAssessment: string;
}
```

**Modified QA loop flow:**

1. Capture screenshots
2. Pixel diff → if pass, done
3. If fail: `diagnoseVisualDiff()` → get structured diagnosis
4. Format diagnosis as correction prompt using the active skill adapter
5. Re-generate only the failing section components (not the whole page)
6. Replace updated components in theme package
7. Restart dev server, re-screenshot, re-diff
8. Repeat up to `maxIterations`

**Verification gate:** Manually introduce a known visual error (wrong background color). Confirm the diagnosis identifies it and the correction prompt addresses it.

---

## Phase 7: Deprecation

### Step 7.1: Mark deprecated modules

After the new pipeline is validated end-to-end:

1. Add `@deprecated` JSDoc comments to:
   - `tools/extract-theme.ts`
   - `tools/lib/theme-component-templates.ts`
   - `tools/lib/clone-section-extractor.ts`
   - `tools/lib/clone-css-rule-extractor.ts`
   - `tools/lib/clone-entry/design-skill.ts`
   - `tools/lib/html-to-jsx-converter.ts`

2. Add deprecation note to `tools/clone-site.ts` (kept but not in primary path)

3. Update `/pipeline.ingest` to note that `/pipeline.design-brief` is now the recommended path

4. Do NOT delete yet — keep for rollback safety until the new pipeline has been used successfully on 2-3 real client themes

### Step 7.2: Update documentation

- Add `docs/architecture/how-design-brief-pipeline-works.md`
- Update `docs/guides/creating-new-theme.md` to reference the new pipeline
- Update CLAUDE.md to list `/pipeline.design-brief` as the primary theme creation command

**Verification gate:** Run `/update.docs` to verify all doc links resolve and content matches current code.

---

## Phase 8: Skill Installation

### Step 8.1: Install new third-party skills

```bash
npx skills add pbakaus/impeccable
npx skills add google-labs-code/stitch-skills --skill stitch-design
npx skills add google-labs-code/stitch-skills --skill enhance-prompt
npx skills add google-labs-code/stitch-skills --skill design-md
npx skills add arvindrk/extract-design-system --skill extract-design-system
```

**Verification gate:** Confirm each skill is installed at `~/.claude/` or project `.claude/`. Test that skill commands are recognized.

**Note:** This is listed as Phase 8 but should be executed first (or in parallel with Phase 1) since the adapters in Phase 3 need to reference the actual skill prompt formats.

---

## Risks and Trade-offs

### Risk 1: Design skills produce visually inconsistent output

**Mitigation:** The brief constrains colors/fonts/layout tightly. The visual QA loop catches drift. If a skill consistently produces poor output, the adapter can add stronger constraints.

### Risk 2: Page-level generation produces components that are hard to extract

**Mitigation:** Use explicit section markers (`{/* SECTION: id */}`). If extraction fails, fall back to section-by-section generation for that skill.

### Risk 3: Brief doesn't capture enough information for high-quality generation

**Mitigation:** The brief is versioned (`"version": "1"`). We can add fields in v2 without breaking existing briefs. Start minimal, add detail based on what skills actually need.

### Risk 4: Scaffold-theme-package changes break existing themes

**Mitigation:** The `briefOverrides` parameter is additive — no existing code paths change. Existing themes continue to scaffold identically.

### Risk 5: Visual QA vision-based diagnosis is expensive ($) per iteration

**Mitigation:** Only invoke vision diagnosis when pixel diff exceeds threshold. Structural mode (free, no API call) runs first as a gate. Cap at 3 iterations.

### Risk 6: Third-party skills may have conflicting opinions

**Mitigation:** Test-then-consolidate approach. Use skills as-is initially, identify what works, build composite skill later. The adapter pattern isolates skill-specific logic.

---

## Implementation Order

Recommended sequence:

1. **Phase 8** (skill installation) — prerequisite, no code changes
2. **Phase 1** (types) — foundational, blocks everything else
3. **Phase 2** (compiler) — can test independently with existing analysis data
4. **Phase 3** (adapters) — can test with fixture briefs
5. **Phase 4** (generator) — integrates compiler + adapters
6. **Phase 5** (CLI + skill command) — wires everything together
7. **Phase 6** (QA enhancement) — polish, can come after initial E2E works
8. **Phase 7** (deprecation) — only after validation on 2-3 real sites
