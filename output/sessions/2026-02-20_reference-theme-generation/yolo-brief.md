# YOLO Implementation Brief: Reference-Driven Theme Generation

**Branch:** develop
**Session spec:** output/sessions/2026-02-20_reference-theme-generation/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The `generate-theme-from-reference.ts` tool currently only re-colours an existing theme (orion/vega). The goal is to extend it into a full reference-site analysis pipeline that: (1) uses Claude vision to extract palette + section inventory from a screenshot, (2) maps sections to existing core-components, (3) flags gaps as new component briefs, and (4) scaffolds a genuinely new named theme package (`nova`) from the analysis JSON. The synthesis was reviewed and approved via dual-model peer review (Claude + Codex). Implement it exactly as specified below.

---

## Pre-flight

```bash
# Verification gate — STOP if this fails
git checkout develop && git pull
pnpm type-check
```

---

## Phase 0 — Foundation: ThemeName Extension + Audit

**Goal:** Make the type system extensible before any feature work. All phases depend on this.

### 0a. Verify actual theme package structure (READ ONLY — informs Phase 3)

```bash
ls packages/themes/
cat packages/themes/orion/package.json 2>/dev/null || echo "no per-theme package.json"
cat packages/themes/package.json 2>/dev/null || echo "no shared themes package.json"
```

Record the result. If orion has its own `package.json`, Phase 3 creates per-theme packages. If there's a shared `packages/themes/package.json` with exports map, Phase 3 edits that instead. Do NOT guess — read and confirm.

### 0b. Extend ThemeName using constant-array pattern

**File:** `packages/theme-system/src/types.ts`

Read the file first. Find the current `ThemeName` type and `ThemeNameSchema`. Replace with:

```typescript
export const THEME_NAMES = ["orion", "vega", "nova"] as const;
export type ThemeName = (typeof THEME_NAMES)[number];
export const ThemeNameSchema = z.enum(THEME_NAMES);
```

### 0c. Export THEME_NAMES from theme-system index

**File:** `packages/theme-system/src/index.ts`

Read the file. Add `THEME_NAMES` to the exports. Do not remove existing exports.

### 0d. Audit and fix ThemeName consumers

```bash
grep -r '"orion".*"vega"\|"vega".*"orion"' packages/ sites/ tools/ --include="*.ts" --include="*.tsx" -l
```

For each file found (expect: `packages/core-components/src/context/theme-context.tsx` and possibly others):
- Read the file
- Replace hardcoded `"orion" | "vega"` union with `ThemeName` imported from `@platform/theme-system`

### 0e. Extend `sectionVariant` enum

In the same `packages/theme-system/src/types.ts` edit:

```typescript
// ComponentRegistry interface:
sectionVariant: "dark-accent" | "gradient" | "standard" | "banded";

// ComponentRegistrySchema:
sectionVariant: z.enum(["dark-accent", "gradient", "standard", "banded"]),
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
pnpm --filter sites/dj-fox-electrical build 2>&1 | tail -5
pnpm --filter sites/base-template build 2>&1 | tail -5
```

---

## Phase 1 — Vision-Based Reference Analysis Tool

**Goal:** Add `--analyse` mode to `generate-theme-from-reference.ts` that calls Claude vision on the screenshot, maps sections to components, and outputs `reference-analysis.json` + `reference-analysis.md`. Additive — existing `theme.config.ts` output is not removed.

### 1a. Create types module

**File:** `tools/lib/reference-analysis-types.ts` (NEW)

```typescript
export interface ReferenceAnalysis {
  analysisVersion: "1";
  reference: {
    url?: string;
    screenshotPath?: string;
    capturedAt: string;
  };
  visualLanguage: {
    palette: {
      background: string;
      foreground: string;
      primary: string;
      secondary: string;
      accent: string;
      additional: string[];
      confidence: "high" | "medium" | "low";
    };
    typography: {
      headingWeight: "bold" | "extrabold" | "black";
      bodyWeight: "normal" | "medium";
      headingStyle: "sans" | "serif" | "display";
      usesInlineColourHighlights: boolean;
    };
    heroPattern: {
      type: "dark-full-bleed" | "split" | "centered" | "light";
      hasBackgroundImage: boolean;
      headerDark: boolean;
    };
    spacingDensity: "compact" | "standard" | "spacious";
  };
  detectedSections: Array<{
    name: string;
    background: string;
    layoutType: "full-bleed-band" | "contained" | "split" | "grid" | "strip";
    purpose: "cta" | "info" | "blog" | "about" | "testimonial" | "nav" | "footer" | "sponsor" | "newsletter" | "hero" | "custom";
    notes: string;
  }>;
  componentMappings: Array<{
    section: string;
    status: "REUSE" | "ADAPT" | "NEW";
    existingComponent: string | null;
    notes: string;
    confidence: "high" | "medium" | "low";
  }>;
  newComponentBacklog: Array<{
    name: string;
    description: string;
    propsContract: string;
    tokenConstraints: string;
    acceptanceCriteria: string[];
    referenceSection: string;
  }>;
  registryRecommendation: {
    themeName: string;
    heroVariant: "image-overlay" | "split" | "minimal";
    headerVariant: "dark" | "light";
    cardVariant: "icon-circle" | "standard" | "overlay";
    sectionVariant: "dark-accent" | "gradient" | "standard" | "banded";
    confidence: "high" | "medium" | "low";
    reasoning: string;
  };
  themeTokenRecommendations: {
    brand: {
      primary: string;
      primaryHover: string;
      secondary: string;
      accent: string;
    };
    surface: {
      background: string;
      foreground: string;
      muted: string;
    };
    typography: {
      fontFamilySans: string[];
      fontFamilyHeading: string[];
    };
  };
}
```

### 1b. Create prompts module

**File:** `tools/lib/reference-analysis-prompts.ts` (NEW)

Export a `REFERENCE_ANALYSIS_PROMPT` constant. The prompt must:
1. Instruct the model to return ONLY a JSON object matching the `ReferenceAnalysis` schema — no prose, no markdown fences
2. Ask for palette with actual hex values (not colour names — sample the pixels)
3. Ask for ordered section inventory (top to bottom of page)
4. Map each section to one of these known components: `hero-section`, `hero-with-image`, `cta-section`, `blog-post-card`, `blog-post-hero`, `site-header`, `footer`, `service-about`, `service-hero`, `service-benefits`, `service-faq`, `faq-section`, `testimonial-card`, `pricing-packages`, `circular-icon-card`, `content-card`, `card-grid`
5. Flag sections with no match as `"status": "NEW"` and include a TypeScript props interface draft in `propsContract`
6. Recommend registry variant values in `registryRecommendation`
7. Include the note: "This screenshot may have been captured at a different time than today. Analyse what is visible, not what may have changed."

### 1c. Extend `generate-theme-from-reference.ts`

Read the file first.

Add to `ThemeGenerationInput`: `analyse?: boolean`

In `parseArgs()`: handle `--analyse` flag (sets `args.analyse = true`).

Add function `analyseWithVision(screenshotPath: string, url: string | undefined, suggestion: ThemeSuggestion): Promise<ReferenceAnalysis>`:
1. `fs.readFileSync(screenshotPath).toString('base64')`
2. Call `claude-sonnet-4-6` at temperature 0 with the prompt from `reference-analysis-prompts.ts` and the base64 image as a vision content block (`type: "image"`, `source.type: "base64"`, `source.media_type: "image/png"`)
3. Extract JSON with `/\{[\s\S]*\}/` regex, parse, return as `ReferenceAnalysis`
4. On any failure: return minimal partial analysis with `confidence: "low"` — do NOT throw or exit

Add function `generateMarkdownReport(analysis: ReferenceAnalysis): string` that produces a human-readable report with: palette table, section inventory table, component mapping table (section | status | existing | notes), gap component list with props contracts, registry recommendation.

In `main()`, after existing layout classification step, if `args.analyse`:
1. If no `args.imagePath`, print warning and skip
2. Call `analyseWithVision()`
3. Write `reference-analysis.json` to `args.outputPath` directory (default `./`)
4. Write `reference-analysis.md` to same directory
5. Continue to existing `theme.config.ts` output — do not skip

```bash
# Verification gate — STOP if this fails
mkdir -p output/sessions/2026-02-20_colorcode-theme

npx tsx tools/generate-theme-from-reference.ts \
  --url https://colorcode.events/ \
  --image output/screencapture-colorcode-events-2026-02-20-12_32_12.png \
  --name colorcode-events \
  --analyse \
  --output output/sessions/2026-02-20_colorcode-theme/

ls output/sessions/2026-02-20_colorcode-theme/reference-analysis.json
ls output/sessions/2026-02-20_colorcode-theme/reference-analysis.md

node -e "
  const r = JSON.parse(require('fs').readFileSync(
    'output/sessions/2026-02-20_colorcode-theme/reference-analysis.json', 'utf8'
  ));
  if (r.analysisVersion !== '1') throw new Error('Missing analysisVersion');
  if (!r.newComponentBacklog.length) throw new Error('No gap components');
  if (r.visualLanguage.palette.primary === '#000000') throw new Error('FAIL: all-black palette');
  console.log('PASS:', r.newComponentBacklog.length, 'gap components,', r.componentMappings.length, 'mappings');
  console.log('Primary:', r.visualLanguage.palette.primary);
"
```

---

## Phase 2 — Component Mapping Catalog

**File:** `tools/lib/component-mapping-catalog.ts` (NEW)

```typescript
export interface CatalogEntry {
  componentPath: string;
  status: "REUSE" | "ADAPT";
  notes: string;
}

export const COMPONENT_CATALOG: Record<string, CatalogEntry> = {
  "hero:dark-full-bleed":   { componentPath: "components/ui/hero-section.tsx",       status: "ADAPT", notes: "Needs dark background variant" },
  "hero:split":             { componentPath: "components/ui/hero-with-image.tsx",     status: "REUSE", notes: "Good match for split layout" },
  "hero:centered":          { componentPath: "components/ui/hero-section.tsx",        status: "REUSE", notes: "Default centered layout" },
  "cta:full-bleed-band":    { componentPath: "components/ui/cta-section.tsx",         status: "ADAPT", notes: "Add background colour prop" },
  "blog:grid":              { componentPath: "components/ui/blog-post-card.tsx",      status: "REUSE", notes: "Good match for blog card grid" },
  "nav:dark":               { componentPath: "components/ui/site-header.tsx",         status: "REUSE", notes: "Already supports dark appearance" },
  "nav:light":              { componentPath: "components/ui/site-header.tsx",         status: "REUSE", notes: "Default light appearance" },
  "footer:multi-column":    { componentPath: "components/ui/footer.tsx",              status: "REUSE", notes: "Good match" },
  "about:split":            { componentPath: "components/ui/service-about.tsx",       status: "ADAPT", notes: "Adapt for non-service context" },
  "about:capability":       { componentPath: "components/ui/capability-showcase.tsx", status: "ADAPT", notes: "Adapt for general about content" },
  "testimonial:grid":       { componentPath: "components/ui/testimonial-card.tsx",    status: "REUSE", notes: "Good match" },
  "faq:accordion":          { componentPath: "components/ui/faq-section.tsx",         status: "REUSE", notes: "Good match" },
  "pricing:cards":          { componentPath: "components/ui/pricing-packages.tsx",    status: "REUSE", notes: "Good match" },
  "cards:icon-grid":        { componentPath: "components/ui/circular-icon-card.tsx",  status: "REUSE", notes: "Orion-style icon card grid" },
  "cards:standard-grid":    { componentPath: "components/ui/card-grid.tsx",           status: "REUSE", notes: "Generic card grid" },
};
// Sections not in catalog → status: "NEW" → goes to newComponentBacklog
```

The `analyseWithVision()` function in Phase 1 should use this catalog as its fallback resolver when mapping detected sections.

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

---

## Phase 3 — Theme Package Scaffold Tool

**File:** `tools/scaffold-theme-package.ts` (NEW)

CLI: `npx tsx tools/scaffold-theme-package.ts --analysis <path> --name <slug>`

The tool:
1. Validates `--name` matches `^[a-z][a-z0-9-]*$`
2. Reads and parses the `reference-analysis.json`
3. Derives all values from `registryRecommendation` and `themeTokenRecommendations`
4. Creates `packages/themes/<name>/` — use Phase 0a result to decide whether to create per-theme `package.json`/`tsconfig.json` or update a shared exports map
5. Writes: `index.ts`, `globals.css`, `README.md`, `SETUP.md`, and (if per-theme packages) `package.json` + `tsconfig.json`

**`index.ts`** template — use actual values from the analysis JSON, not placeholder strings:
```typescript
import type { ComponentRegistry, DeepPartialThemeConfig } from "@platform/theme-system";
import { registerTheme } from "@platform/theme-system";

export const [name]Registry: ComponentRegistry = {
  theme: "[name]",
  heroVariant: "[from registryRecommendation]",
  headerVariant: "[from registryRecommendation]",
  cardVariant: "[from registryRecommendation]",
  sectionVariant: "[from registryRecommendation]",
};

export const [name]DefaultConfig: DeepPartialThemeConfig = {
  colors: {
    brand: { /* from themeTokenRecommendations.brand */ },
    surface: { /* from themeTokenRecommendations.surface */ },
  },
  typography: {
    fontFamily: { /* from themeTokenRecommendations.typography */ },
  },
};

registerTheme({ name: "[name]", label: "[Name]", config: [name]DefaultConfig });
```

**`globals.css`**: comments only — reference site URL, capture date, verification note.

**`README.md`**: reference site URL, analysis date, component mapping table, gap component list with props contracts, registry values, verification note about colours.

**`SETUP.md`** (also printed to stdout):
```
Manual steps required after scaffolding:
  1. pnpm install
  2. Add path alias to each site's tsconfig.json that uses this theme:
     "@platform/themes/<name>": ["../../packages/themes/<name>/index.ts"]
  3. Add same alias to tools/tsconfig.json if needed
  4. If sites/showcase exists: import <name> theme in sites/showcase/lib/register-all-themes.ts
  5. pnpm type-check
```

Then run it:

```bash
# Verification gate — STOP if this fails
npx tsx tools/scaffold-theme-package.ts \
  --analysis output/sessions/2026-02-20_colorcode-theme/reference-analysis.json \
  --name nova

ls packages/themes/nova/index.ts
ls packages/themes/nova/README.md

# Complete the manual checklist steps from SETUP.md, then:
pnpm install
pnpm type-check
```

---

## Phase 4 — Cross-Theme Propagation Checklist

**File:** `packages/core-components/CLAUDE.md`

Read the file first. Append this section (do not add if already present):

```markdown
## Cross-Theme Component Propagation

When adding a new component identified via reference analysis (`newComponentBacklog` in `reference-analysis.json`):

### Checklist
- [ ] Named export only (no default export)
- [ ] TypeScript interface for all props
- [ ] Server Component — no `'use client'`, no React hooks, no context imports
- [ ] Token-only Tailwind classes (`bg-brand-primary`, `text-surface-foreground`, etc.)
- [ ] No hardcoded hex colours
- [ ] Exported from `packages/core-components/src/index.ts`
- [ ] If MDX-driven: schema added to `packages/core-components/src/lib/content-schemas.ts`
- [ ] `pnpm type-check` passes
- [ ] `pnpm --filter @platform/core-components build` passes
- [ ] Visual check in `sites/base-template` (vega) dev server
- [ ] Visual check in `sites/dj-fox-electrical` (orion) dev server if practical

### Why core-components first?
Components use theme tokens → single implementation adapts to every theme's colour palette automatically. No per-theme duplication needed.

### Gap component briefs
Run `tools/generate-theme-from-reference.ts --analyse` → `newComponentBacklog` in `reference-analysis.json` contains props contract, token constraints, and acceptance criteria for each gap component.
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

---

## Commit

```bash
git add \
  packages/theme-system/src/types.ts \
  packages/theme-system/src/index.ts \
  packages/core-components/src/context/theme-context.tsx \
  tools/lib/ \
  tools/generate-theme-from-reference.ts \
  tools/scaffold-theme-package.ts \
  packages/themes/nova/ \
  packages/core-components/CLAUDE.md \
  output/sessions/2026-02-20_colorcode-theme/

git commit -m "$(cat <<'EOF'
feat(ingestion): reference-site analysis pipeline + nova theme scaffold

- Extend ThemeName to use THEME_NAMES as const array (eliminates type-spread risk)
- Add 'banded' to sectionVariant enum (reusable full-bleed colour-band pattern)
- Add --analyse flag to generate-theme-from-reference.ts: Claude vision extracts
  palette, section inventory, component mapping, and gap backlog from screenshot
- Add tools/lib/reference-analysis-types.ts: versioned ReferenceAnalysis schema
- Add tools/lib/reference-analysis-prompts.ts: vision prompt template
- Add tools/lib/component-mapping-catalog.ts: static section→component lookup
- Add tools/scaffold-theme-package.ts: creates packages/themes/<name>/ from JSON
- Scaffold packages/themes/nova/ from ColorCode Events reference analysis
- Add cross-theme propagation checklist to packages/core-components/CLAUDE.md

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final Report

After all phases complete, output:
1. Phases completed — list each (0–4) with confirmation
2. Verification gates passed
3. Commit SHA
4. ColorCode analysis summary — primary colour, section count, gap component count
5. Any exceptions or deviations

---

## Update Session File

Append to this file (`output/sessions/2026-02-20_reference-theme-generation/yolo-brief.md`):

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary]

### Commits
- [SHA] feat(ingestion): reference-site analysis pipeline + nova theme scaffold
```

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on `develop`
- Independent reads (1a, 1b, 2) can be done concurrently with parallel Task agents
- Minimal changes only
- Phase 4 gap components (EventInfoStrip, NewsletterSignup, SponsorGrid) are NOT built in this session — next session, driven by `newComponentBacklog` in the analysis JSON

## Completed

**Date:** 2026-02-20
**Status:** All phases executed successfully

All five phases (0–4) completed with every verification gate passing on first attempt. The ThemeName type system was extended to use a const array pattern (`THEME_NAMES`), `sectionVariant` gained the `"banded"` option, and three consumer files were updated. The `--analyse` flag was wired into `generate-theme-from-reference.ts` calling Claude Sonnet vision on the ColorCode Events screenshot, producing a structured `reference-analysis.json` with 11 sections, 11 component mappings, and 3 gap components (EventDetailsBand, PhotoStrip, NewsletterSignup). The `scaffold-theme-package.ts` tool was created and used to scaffold `packages/themes/nova/` from the analysis JSON, with the shared exports map updated automatically. The cross-theme propagation checklist was appended to `packages/core-components/CLAUDE.md`.

### Commits
- 0972f0e feat(ingestion): reference-site analysis pipeline + nova theme scaffold
