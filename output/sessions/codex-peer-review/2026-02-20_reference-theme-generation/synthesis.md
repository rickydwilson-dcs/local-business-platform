# Implementation Plan: Reference-Driven Theme Generation

**Date:** 2026-02-20
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect | Claude | Codex | Synthesised Decision |
|--------|--------|-------|----------------------|
| **ThemeName extensibility** | Add `"nova"` directly to the union literal and Zod enum | Introduce `THEME_NAMES = [...] as const`, derive `ThemeName` from it, eliminate duplicate unions elsewhere | **Codex wins.** The constant-array pattern is more robust and eliminates the type-spread risk Codex identified. |
| **Duplicate ThemeName consumers** | Not addressed | Explicitly audit `theme-context.tsx`, `apply-theme.ts`, any local `"orion" \| "vega"` declarations | **Codex wins.** This is a real risk Claude missed — hardcoded unions in other files will drift. |
| **Scaffold tool location** | New standalone `tools/scaffold-theme-package.ts` | Integrated as `--scaffold-theme` mode of `generate-theme-from-reference.ts` | **Claude wins.** A separate tool keeps concerns cleanly separated and is easier to test. The reference tool's output is the scaffold tool's input — they shouldn't be the same process. |
| **Theme package structure** | Per-theme `package.json` + `tsconfig.json` (treating each as a full workspace package) | Single `packages/themes/package.json` with subpath exports (e.g. `"./nova": "./nova/index.ts"`) | **Codex wins on observation, Claude wins on action.** Codex correctly flagged that the current orion/vega structure may use a shared `packages/themes/package.json`. Must verify before scaffolding. See Phase 0b. |
| **Component mapping** | Static lookup table in tool code | Separate `tools/lib/component-mapping-catalog.ts` + LLM-assist for ambiguous cases | **Split.** Static catalog is correct (better repeatability). LLM-assist for ambiguous cases adds value but must not be blocking — make it optional, fallback to `"ADAPT"` if LLM unavailable. |
| **Analysis artifact location** | `output/sessions/<date>_<topic>/` | `output/theme-analysis/<theme-name>-<timestamp>/` | **Claude wins.** The sessions folder is already the established pattern for this project. |
| **Analysis schema** | Freeform JSON with top-level keys | Versioned schema with `analysisVersion` field, explicit `newComponentBacklog[]` with acceptance criteria | **Codex wins.** Versioning the schema prevents downstream tools from breaking silently. Add `analysisVersion: "1"` as a required top-level field. The `newComponentBacklog[]` structure is richer than Claude's `gapComponents[]` — adopt Codex's naming. |
| **Workflow B checklist** | Not codified — implied by convention | Explicit cross-theme propagation checklist in docs | **Codex wins.** Should be added to `packages/core-components/` docs. |
| **`sectionVariant` extension** | Leave as `"standard"` (approximation), document in README | Extend to `"banded"` if multiple themes will use it | **Synthesised:** Add `"banded"` to the `sectionVariant` enum now. ColorCode is not the only business that uses full-bleed colour bands — it's a legitimate pattern worth naming. Extend both the TS type and Zod schema together. |
| **tsconfig path aliases for new theme** | Not addressed | Every site's `tsconfig.json` needs `@platform/themes/nova` path added | **Codex wins — this is a real operational step.** Must be included in the scaffold tool. |
| **Showcase site registration** | Not addressed | `sites/showcase/lib/register-all-themes.ts` needs import | **Codex wins — address if showcase exists, skip otherwise.** Verify first. |

---

## Blind Spots Caught

**Codex caught (Claude missed):**
1. **Duplicate ThemeName unions in consumers** — `theme-context.tsx` and `apply-theme.ts` may have their own hardcoded `"orion" | "vega"` literals. If these aren't updated, they'll silently reject `"nova"`. The `THEME_NAMES as const` pattern makes this a single source-of-truth.
2. **Theme package structure ambiguity** — Codex flagged that orion/vega may live under a single `packages/themes/package.json` with subpath exports, not as individual workspace packages. If the scaffold tool creates a `packages/themes/nova/package.json` and that's not the actual pattern, it won't compile. Must verify the actual structure before implementing.
3. **tsconfig path alias updates** — Every site needs `@platform/themes/nova` added to its `tsconfig.json` paths. Claude's plan didn't address this — it would have broken after scaffolding.
4. **Analysis schema versioning** — Without `analysisVersion`, any schema change will silently break the scaffold tool. The version field costs nothing to add.
5. **`sectionVariant: "banded"` as a reusable pattern** — Codex pushed back on treating colour-band CTAs as "standard". This is a common layout pattern worth encoding properly.

**Claude caught (Codex missed):**
1. **Separate scaffold tool vs integrated flag** — Codex proposed folding scaffolding into the existing tool. Claude's instinct to keep them separate is correct: the analysis tool produces an artifact; the scaffold tool consumes it. They have different inputs, different outputs, different reasons to run.
2. **`--analyse` should be additive** — Codex's plan doesn't address backwards compatibility. The `--analyse` flag should still produce the existing `theme.config.ts` output in addition to the new report, so existing usage isn't broken.
3. **Screenshot freshness documentation** — The analysis is point-in-time and reproducible from a saved screenshot. This should be documented explicitly.

---

## Implementation Plan

### Phase 0: Foundation

**0a. Verify actual theme package structure**

Before writing a single line of code, run:
```bash
ls packages/themes/
cat packages/themes/orion/package.json 2>/dev/null || echo "no per-theme package.json"
cat packages/themes/package.json 2>/dev/null || echo "no shared package.json"
```

This determines whether the scaffold tool creates per-theme `package.json` + `tsconfig.json` (workspace package approach) or updates a shared `packages/themes/package.json` exports map. The rest of the plan assumes per-theme workspace packages (matching orion/vega structure) — but verify first.

**0b. Extend `ThemeName` using constant-array pattern**

File: `packages/theme-system/src/types.ts`

```typescript
// Replace the current union literal with:
export const THEME_NAMES = ["orion", "vega", "nova"] as const;
export type ThemeName = (typeof THEME_NAMES)[number];
export const ThemeNameSchema = z.enum(THEME_NAMES);
```

Export `THEME_NAMES` from `packages/theme-system/src/index.ts`.

**0c. Audit and fix ThemeName consumers**

Grep for hardcoded `"orion" | "vega"` or `"orion","vega"` outside `types.ts`:
```bash
grep -r '"orion".*"vega"\|"vega".*"orion"' packages/ sites/ tools/ --include="*.ts" --include="*.tsx" -l
```

For each file found:
- Replace hardcoded union with `import { ThemeName } from '@platform/theme-system'` (or from compiled package boundary)
- Key files to check: `packages/core-components/src/context/theme-context.tsx`, any `tools/*.ts`

**0d. Extend `sectionVariant` enum**

File: `packages/theme-system/src/types.ts`

```typescript
// ComponentRegistry:
sectionVariant: "dark-accent" | "gradient" | "standard" | "banded";

// ComponentRegistrySchema:
sectionVariant: z.enum(["dark-accent", "gradient", "standard", "banded"]),
```

Backward compatible — existing orion/vega registries use `"dark-accent"` and `"standard"`, which remain valid.

**Verification gate — Phase 0:**
```bash
pnpm type-check  # Must pass monorepo-wide
# Confirm existing sites still build:
pnpm --filter sites/dj-fox-electrical build
pnpm --filter sites/base-template build
```

---

### Phase 1: Vision-Based Reference Analysis Tool

**1a. New types module**

File: `tools/lib/reference-analysis-types.ts` (new)

Define the versioned analysis schema as TypeScript interfaces:
```typescript
export interface ReferenceAnalysis {
  analysisVersion: "1";
  reference: {
    url?: string;
    screenshotPath?: string;
    capturedAt: string;  // ISO timestamp
  };
  visualLanguage: {
    palette: {
      background: string;   // hex
      foreground: string;   // hex
      primary: string;      // hex
      secondary: string;    // hex
      accent: string;       // hex
      additional: string[]; // hex array, max 4
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
    existingComponent: string | null;  // path relative to packages/core-components/src/
    notes: string;
    confidence: "high" | "medium" | "low";
  }>;
  newComponentBacklog: Array<{
    name: string;                    // e.g. "EventInfoStrip"
    description: string;
    propsContract: string;           // TypeScript interface as string
    tokenConstraints: string;        // Which theme tokens to use
    acceptanceCriteria: string[];
    referenceSection: string;        // Which detected section this maps to
  }>;
  registryRecommendation: {
    themeName: string;               // e.g. "nova"
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

**1b. New prompts module**

File: `tools/lib/reference-analysis-prompts.ts` (new)

Contains the vision prompt template as an exported constant. Keeps the prompt versioned and testable separately from the tool code.

The prompt asks Claude to:
1. Identify full colour palette with hex values (not descriptions — actual hex)
2. Segment the page into ordered sections with background colour, layout type, and purpose
3. Map each section to known component archetypes (provide the full list of our components)
4. Flag sections with no good mapping as NEW with a brief and props contract
5. Recommend registry variant values

**1c. Extend `generate-theme-from-reference.ts`**

Add `--analyse` flag. When set:
- Read the screenshot file → base64 encode
- Call Claude Sonnet vision with the structured prompt (temperature 0)
- Parse JSON response (extract from markdown fences if present)
- Validate against `ReferenceAnalysis` schema
- Merge with CSS scraper output as corroborating signal (secondary)
- Write `reference-analysis.json` + `reference-analysis.md` to `--output` directory
- Also write `theme.config.ts` (existing behaviour — additive, not replacing)
- If vision API unavailable: write partial analysis with `confidence: "low"`, print warning, exit 0 (don't block CI)

**Verification gate — Phase 1:**
```bash
npx tsx tools/generate-theme-from-reference.ts \
  --url https://colorcode.events/ \
  --image output/screencapture-colorcode-events-2026-02-20-12_32_12.png \
  --name colorcode-events \
  --analyse \
  --output output/sessions/2026-02-20_colorcode-theme/

# Both files must exist
ls output/sessions/2026-02-20_colorcode-theme/reference-analysis.json
ls output/sessions/2026-02-20_colorcode-theme/reference-analysis.md
ls output/sessions/2026-02-20_colorcode-theme/theme.config.ts

# JSON must be valid and versioned
node -e "
  const r = JSON.parse(require('fs').readFileSync(
    'output/sessions/2026-02-20_colorcode-theme/reference-analysis.json', 'utf8'
  ));
  if (r.analysisVersion !== '1') throw new Error('Missing version');
  if (!r.newComponentBacklog.length) throw new Error('No gap components found');
  if (r.visualLanguage.palette.primary === '#000000') throw new Error('FAIL: all-black palette — vision extraction not working');
  console.log('PASS:', r.newComponentBacklog.length, 'gap components,', r.componentMappings.length, 'mappings');
"
```

---

### Phase 2: Component Mapping Catalog

File: `tools/lib/component-mapping-catalog.ts` (new)

Static lookup table mapping section archetypes to known core-component file paths. This is the deterministic backbone — the LLM proposes the section classification, the catalog maps to files.

```typescript
interface CatalogEntry {
  componentPath: string;  // relative to packages/core-components/src/
  status: "REUSE" | "ADAPT";
  notes: string;
}

export const COMPONENT_CATALOG: Record<string, CatalogEntry> = {
  "hero:dark-full-bleed":        { componentPath: "components/ui/hero-section.tsx",     status: "ADAPT",  notes: "Needs dark bg variant" },
  "hero:split":                  { componentPath: "components/ui/hero-with-image.tsx",  status: "REUSE",  notes: "Good match for split layout" },
  "cta:full-bleed-band":         { componentPath: "components/ui/cta-section.tsx",      status: "ADAPT",  notes: "Add background colour prop" },
  "blog:grid":                   { componentPath: "components/ui/blog-post-card.tsx",   status: "REUSE",  notes: "Good match" },
  "nav:dark":                    { componentPath: "components/ui/site-header.tsx",      status: "REUSE",  notes: "Already supports dark appearance" },
  "nav:light":                   { componentPath: "components/ui/site-header.tsx",      status: "REUSE",  notes: "Default light appearance" },
  "footer:multi-column":         { componentPath: "components/ui/footer.tsx",           status: "REUSE",  notes: "Good match" },
  "about:split":                 { componentPath: "components/ui/service-about.tsx",    status: "ADAPT",  notes: "Adapt for non-service context" },
  "testimonial:grid":            { componentPath: "components/ui/testimonial-card.tsx", status: "REUSE",  notes: "Good match" },
  "faq:accordion":               { componentPath: "components/ui/faq-section.tsx",      status: "REUSE",  notes: "Good match" },
  "pricing:cards":               { componentPath: "components/ui/pricing-packages.tsx", status: "REUSE",  notes: "Good match" },
};
// Sections not in catalog → status: "NEW" → goes to newComponentBacklog
```

**Verification gate — Phase 2:**
```bash
# Unit test the catalog with seeded inputs
pnpm --filter @platform/intake-system test  # or wherever the tool tests live
```

---

### Phase 3: Theme Package Scaffold Tool

**3a. New tool: `tools/scaffold-theme-package.ts`**

CLI: `npx tsx tools/scaffold-theme-package.ts --analysis <path> --name <slug>`

Reads `reference-analysis.json`, creates `packages/themes/<name>/`:

Files created:
- `packages/themes/<name>/package.json` — `"name": "@platform/themes/<name>"`, peer deps on theme-system
- `packages/themes/<name>/tsconfig.json` — extends monorepo root tsconfig
- `packages/themes/<name>/globals.css` — imports base theme CSS variables
- `packages/themes/<name>/index.ts` — registry + defaultConfig + registerTheme call
- `packages/themes/<name>/README.md` — reference site, component mapping table, gap list, "what to build next"

The `index.ts` uses `registryRecommendation` from the analysis JSON for all variant values.

**3b. Update consumers that need the new theme package**

The scaffold tool also outputs a checklist of manual steps:
```
Manual steps required after scaffolding:
  1. Add "@platform/themes/<name>": "*" to sites/*/package.json as needed
  2. Add "@platform/themes/<name>": ["./packages/themes/<name>/index.ts"] to sites/*/tsconfig.json
  3. Add "@platform/themes/<name>": ["./packages/themes/<name>/index.ts"] to tools/tsconfig.json
  4. If showcase site exists: import nova theme in sites/showcase/lib/register-all-themes.ts
  5. Run: pnpm install && pnpm type-check
```

These are printed to stdout and also written to `packages/themes/<name>/SETUP.md`.

**Verification gate — Phase 3:**
```bash
npx tsx tools/scaffold-theme-package.ts \
  --analysis output/sessions/2026-02-20_colorcode-theme/reference-analysis.json \
  --name nova

ls packages/themes/nova/{package.json,tsconfig.json,globals.css,index.ts,README.md}

# After manually completing the checklist steps:
pnpm install
pnpm type-check  # Must pass

# Verify a site can import the new theme:
node -e "require('./packages/themes/nova/index.ts')" 2>&1 | grep -v "error" && echo "PASS"
```

---

### Phase 4: Workflow B — Gap Component Build

**Not automated.** The `newComponentBacklog` array in `reference-analysis.json` IS the implementation brief for each gap component. Each entry includes:
- Props interface draft
- Token constraints
- Acceptance criteria
- Which section of the reference site inspired it

**Process for each gap component:**
1. Read the backlog entry from `reference-analysis.json`
2. Create `packages/core-components/src/components/ui/<ComponentName>.tsx`
   - Named export, TypeScript interface, Server Component, token-only Tailwind
3. Export from `packages/core-components/src/index.ts`
4. If the component has MDX-driven data, update `packages/core-components/src/lib/content-schemas.ts`
5. Run `pnpm type-check && pnpm --filter @platform/core-components build`
6. Verify visual appearance in base-template dev server
7. Update `packages/core-components/src/components/ui/README.md` (or CLAUDE.md) with component documentation

**Cross-theme propagation checklist** (add to `packages/core-components/CLAUDE.md`):
```
When adding a new component to core-components:
□ Named export only (no default)
□ TypeScript interface for all props
□ Server Component (no 'use client', no React hooks, no context imports)
□ Token-only Tailwind classes (bg-brand-primary, text-surface-foreground, etc.)
□ Exported from packages/core-components/src/index.ts
□ If MDX-driven: schema added to content-schemas.ts
□ pnpm type-check passes
□ pnpm --filter @platform/core-components build passes
□ Visual check in base-template (vega), dj-fox-electrical (orion), and nova dev server
```

**Verification gate (per component):**
```bash
pnpm type-check
pnpm --filter @platform/core-components build
```

---

## File Inventory

| File | Action | Phase |
|------|--------|-------|
| `packages/theme-system/src/types.ts` | Edit: `THEME_NAMES as const`, extend `ThemeName`, add `"banded"` to `sectionVariant` | 0 |
| `packages/theme-system/src/index.ts` | Edit: export `THEME_NAMES` constant | 0 |
| `packages/core-components/src/context/theme-context.tsx` | Edit: replace hardcoded `"orion" \| "vega"` with imported `ThemeName` | 0 |
| `tools/lib/reference-analysis-types.ts` | Create: versioned `ReferenceAnalysis` interface | 1 |
| `tools/lib/reference-analysis-prompts.ts` | Create: vision prompt template | 1 |
| `tools/generate-theme-from-reference.ts` | Edit: add `--analyse` flag, vision call, analysis output | 1 |
| `tools/lib/component-mapping-catalog.ts` | Create: static component catalog | 2 |
| `tools/scaffold-theme-package.ts` | Create: new scaffold tool | 3 |
| `packages/themes/nova/package.json` | Create: generated by scaffold tool | 3 |
| `packages/themes/nova/tsconfig.json` | Create: generated | 3 |
| `packages/themes/nova/globals.css` | Create: generated | 3 |
| `packages/themes/nova/index.ts` | Create: generated | 3 |
| `packages/themes/nova/README.md` | Create: generated | 3 |
| `packages/core-components/CLAUDE.md` | Edit: add cross-theme propagation checklist | 4 |
| `packages/core-components/src/components/ui/EventInfoStrip.tsx` | Create: gap component | 4 |
| `packages/core-components/src/components/ui/NewsletterSignup.tsx` | Create: gap component | 4 |
| `packages/core-components/src/components/ui/SponsorGrid.tsx` | Create: gap component | 4 |
| `packages/core-components/src/index.ts` | Edit: export new components | 4 |

---

## Execution Sequence

```
Phase 0 (Foundation)
  ↓ Gate: pnpm type-check passes monorepo-wide
Phase 1 (Analysis tool)
  ↓ Gate: ColorCode analysis produces non-black palette + gap list
Phase 2 (Mapping catalog)
  ↓ Gate: unit tests pass
Phase 3 (Scaffold tool)
  ↓ Gate: nova package compiles, pnpm type-check passes
Phase 4 (Gap components)  ← one component at a time, each has own gate
  ↓ Gate: each component passes type-check + build
```

---

## Risks

1. **Theme package structure** — Must verify orion/vega structure before implementing Phase 3. If it uses a shared `package.json` exports map, the scaffold tool needs to edit that file instead of creating per-theme files. Phase 0a addresses this.

2. **Vision output variability** — Temperature 0 reduces but doesn't eliminate variance. The `analysisVersion` field enables schema evolution. Treat generated colours as starting point, not spec — document this in the markdown report.

3. **tsconfig path aliases** — Every new theme requires manual updates to site tsconfig files. This is unavoidable friction; the scaffold tool should print the exact lines to add.

4. **`ThemeName` consumers beyond the audited files** — The grep in Phase 0c will surface known consumers, but dynamic string comparisons against theme names won't be caught by TypeScript. The constant-array pattern catches the TS cases; document that string equality checks elsewhere need manual audit.

5. **Nova is an event/conference theme** — It should be generic enough to reuse for other event clients, not designed around ColorCode specifically. The scaffold tool README should make this explicit.
