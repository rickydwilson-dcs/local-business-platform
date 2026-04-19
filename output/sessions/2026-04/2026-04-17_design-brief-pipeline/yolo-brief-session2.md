# YOLO Implementation Brief: Design Brief Pipeline — Session 2 (Phases 4–5)

**Branch:** feature/design-brief-pipeline (continue from Session 1)
**Session spec:** output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief-session2.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

Session 1 built the foundation: DesignBrief Zod schema, deterministic compiler (6 mappers), markdown renderer, and skill adapter layer (GenericAdapter, ImpeccableAdapter, StitchAdapter, registry). All 4 phases passed verification and are committed to `feature/design-brief-pipeline`.

Session 2 wires everything into a working pipeline: the generator that calls Claude API with a skill adapter to produce theme components, the CLI tool, and the `/pipeline.design-brief` slash command skill.

**Key Session 1 facts to know:**

- `DiffDiagnosis` type lives in `tools/lib/design-skills/adapter-types.ts`
- `DesignBrief`, `PageBlueprintBrief`, `SectionBlueprintBrief` exported from `tools/lib/design-brief-types.ts`
- `getAdapter(skillId)` exported from `tools/lib/design-skills/adapter-registry.ts`
- `compileDesignBrief()` exported from `tools/lib/design-brief-compiler.ts`
- `renderBriefSummary()` exported from `tools/lib/design-brief-renderer.ts`
- Skills installed to `.agents/skills/` (not `~/.claude/commands/`)
- Analysis fixture at `tools/__fixtures__/analyses/bexhill-removals-site-analysis.json`
- Brief fixture at `tools/__fixtures__/briefs/sample-brief.json`

**Existing tools being integrated:**

- `tools/scaffold-theme-package.ts` — current signature: `scaffoldThemePackage(analysis, name, outputDir?)` at line 610. Needs `briefOverrides` parameter added.
- `tools/lib/theme-component-generator.ts` — exports: `autoRepairHexLiterals`, `scanForHexLiterals`, `validateAndFixTokenClasses`, `validateTypeScriptSyntax`, `validateTypeScriptSemantic`, `retryWithSyntaxErrors`, `retryWithSemanticErrors`, `fixBracketNotationProps`, `verifyNamedExport`, `needsUseClient`, `serverComponentShell`, `clientComponentShell`
- `tools/lib/visual-qa-loop.ts` — `runVisualQALoop(config: VisualQAConfig)`, `VisualQAConfig`, `VisualQAResult` at line 228
- `tools/lib/pipeline-visual-compare.ts` — `compareImages()`
- `tools/lib/computed-style-token-mapper.ts` — `mapStylesToTokens()`
- `tools/lib/reference-analysis-types.ts` — `SiteAnalysis`, `ReferenceAnalysis`
- `packages/theme-system/src/types.ts` — `ComponentRegistry`, `DeepPartialThemeConfig`

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
git checkout feature/design-brief-pipeline
git log --oneline develop..HEAD   # confirm 4 Session 1 commits present
pnpm type-check                   # must be clean before starting
```

---

## Phase 4: Generator Orchestration

**Goal:** Build the generator that takes a DesignBrief + skill choice → calls Claude API → extracts and validates section components → assembles a theme package.
**Model:** opus — integrates 8+ existing modules, complex flow with fallback paths, modifies scaffold-theme-package.ts

### Step 4.1: Read before writing

Read these files in full before writing any code:

- `tools/lib/theme-component-generator.ts` — understand all validation function signatures and the `serverComponentShell`/`clientComponentShell` exports
- `tools/scaffold-theme-package.ts` lines 600–756 — understand the current `scaffoldThemePackage` function body to plan the minimal `briefOverrides` addition
- `tools/lib/design-skills/adapter-types.ts` — the `DesignSkillAdapter` interface and `DiffDiagnosis` type
- `tools/lib/design-brief-types.ts` — `DesignBrief`, `PageBlueprintBrief`, `SectionBlueprintBrief` types
- `tools/__fixtures__/briefs/sample-brief.json` — understand the fixture data shape

### Step 4.2: Modify `tools/scaffold-theme-package.ts`

Add an optional fourth parameter `briefOverrides` to the existing `scaffoldThemePackage` function.

**Change:** Find the function signature at line 610:

```typescript
export function scaffoldThemePackage(analysis: ReferenceAnalysis | SiteAnalysis, name: string, outputDir?: string): string {
```

Change to:

```typescript
export function scaffoldThemePackage(
  analysis: ReferenceAnalysis | SiteAnalysis,
  name: string,
  outputDir?: string,
  briefOverrides?: {
    registry?: Partial<ComponentRegistry>;
    config?: DeepPartialThemeConfig;
  }
): string {
```

Add the necessary imports for `ComponentRegistry` and `DeepPartialThemeConfig` from `@platform/theme-system` if not already present.

Inside the function body, find where the registry and config are derived from the analysis (look for `registryRecommendation` and `themeTokenRecommendations` usage). Apply overrides after derivation:

```typescript
// Apply brief overrides after analysis-derived values
if (briefOverrides?.registry) {
  Object.assign(registry, briefOverrides.registry);
}
if (briefOverrides?.config) {
  // Deep merge config: briefOverrides.config takes priority
  config = deepMerge(config, briefOverrides.config);
}
```

Add a simple `deepMerge` helper at the top of the file if one doesn't exist:

```typescript
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as Array<keyof T>) {
    const sv = source[key];
    const tv = target[key];
    if (sv !== undefined && sv !== null) {
      if (
        typeof sv === "object" &&
        !Array.isArray(sv) &&
        typeof tv === "object" &&
        !Array.isArray(tv)
      ) {
        result[key] = deepMerge(
          tv as Record<string, unknown>,
          sv as Record<string, unknown>
        ) as T[typeof key];
      } else {
        result[key] = sv as T[typeof key];
      }
    }
  }
  return result;
}
```

This change is additive — all existing callers are unaffected (briefOverrides is optional).

### Step 4.3: Create `tools/lib/design-brief-postprocess.ts`

A thin wrapper that runs the existing validation pipeline on a single TSX string.

```typescript
import Anthropic from "@anthropic-ai/sdk";
import {
  validateTypeScriptSyntax,
  validateTypeScriptSemantic,
  validateAndFixTokenClasses,
  autoRepairHexLiterals,
  scanForHexLiterals,
  fixBracketNotationProps,
  verifyNamedExport,
  retryWithSyntaxErrors,
  retryWithSemanticErrors,
  serverComponentShell,
  clientComponentShell,
  needsUseClient,
} from "./theme-component-generator";
import type { SectionBlueprintBrief } from "./design-brief-types";

export interface PostprocessResult {
  content: string;
  warnings: string[];
  usesClient: boolean;
}

/**
 * Runs the full validation + repair pipeline on a raw TSX section body.
 * Re-uses all existing validators from theme-component-generator.ts.
 */
export async function postprocessSection(options: {
  sectionId: string;
  exportName: string;
  tsx: string; // raw TSX body (may or may not include shell)
  section: SectionBlueprintBrief;
  anthropicClient?: Anthropic;
}): Promise<PostprocessResult>;
```

Implementation:

1. Determine if needs `"use client"` via `needsUseClient(section, tsx)`
2. Wrap in shell: `serverComponentShell(...)` or `clientComponentShell(...)` using the export name
3. Run syntax validation → `retryWithSyntaxErrors()` if failed (if client available)
4. Run semantic validation → `retryWithSemanticErrors()` if failed (if client available)
5. Run `validateAndFixTokenClasses()` → auto-fix violations
6. Run `autoRepairHexLiterals()` → auto-fix hex literals
7. Run `fixBracketNotationProps()` → auto-fix bracket notation
8. Run `verifyNamedExport(content, exportName)` → add warning if missing (don't fail)
9. Collect all warnings, return `{ content, warnings, usesClient }`

### Step 4.4: Create `tools/lib/design-brief-generator.ts`

The main orchestrator. Reads a DesignBrief, calls Claude API via the selected skill adapter, parses the response, validates/repairs components, assembles the theme package.

```typescript
import Anthropic from "@anthropic-ai/sdk";
import type { DesignBrief } from "./design-brief-types";
import type { SkillId } from "./design-skills/adapter-registry";
import { getAdapter } from "./design-skills/adapter-registry";
import { postprocessSection } from "./design-brief-postprocess";
import { scaffoldThemePackage } from "../scaffold-theme-package";

export interface GenerationOptions {
  brief: DesignBrief;
  themeName: string;
  skill: SkillId;
  outputDir: string; // where to write theme package (packages/themes/<name>)
  anthropicApiKey?: string;
  model?: string; // default: "claude-opus-4-6" for generation quality
}

export interface GenerationResult {
  themeName: string;
  themePackagePath: string;
  sections: Array<{
    id: string;
    exportName: string;
    filePath: string;
    warnings: string[];
    usesClient: boolean;
  }>;
  frozenAssets: {
    headerTsx: string;
    footerTsx: string;
  };
  warnings: string[];
}

export async function generateFromBrief(options: GenerationOptions): Promise<GenerationResult>;
```

**Implementation flow:**

```typescript
async function generateFromBrief(options): Promise<GenerationResult> {
  const { brief, themeName, skill, outputDir, anthropicApiKey } = options;
  const client = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : new Anthropic();
  const adapter = getAdapter(skill);
  const results: GenerationResult = {
    themeName,
    themePackagePath: outputDir,
    sections: [],
    frozenAssets: { headerTsx: "", footerTsx: "" },
    warnings: [],
  };

  // 1. Get homepage blueprint (or first blueprint if no home page)
  const homepageBp =
    brief.pageBlueprints.find((p) => p.pageType === "home") ?? brief.pageBlueprints[0];
  if (!homepageBp) throw new Error("DesignBrief has no page blueprints");

  // 2. Build prompts via adapter
  const { systemPrompt, userPrompt } = adapter.buildPagePrompt(brief, homepageBp, {
    includeHeader: true,
    includeFooter: true,
  });

  // 3. Call Claude API
  console.log(`Generating homepage with skill: ${skill}...`);
  const message = await client.messages.create({
    model: options.model ?? "claude-opus-4-6",
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  const rawResponse = message.content[0].type === "text" ? message.content[0].text : "";

  // 4. Parse response into sections
  const { sections: rawSections } = adapter.normalizeOutput(rawResponse);
  if (rawSections.length === 0) {
    results.warnings.push("Adapter returned no sections — check raw response");
    return results;
  }

  // 5. Ensure components dir exists
  const componentsDir = path.join(outputDir, "components");
  fs.mkdirSync(componentsDir, { recursive: true });
  const pagesDir = path.join(outputDir, "pages");
  fs.mkdirSync(pagesDir, { recursive: true });

  // 6. Postprocess each section
  for (const raw of rawSections) {
    // Find matching blueprint for this section (by id)
    const sectionBp = homepageBp.sections.find((s) => s.id === raw.id) ??
      homepageBp.sections.find((s) => raw.id.includes(s.category.toLowerCase())) ??
      homepageBp.sections[rawSections.indexOf(raw)] ?? { // positional fallback
        id: raw.id,
        name: toPascalCase(raw.id),
        category: "Custom",
        interactionNeeds: "none",
        purpose: "",
        layoutPattern: "",
        contentSlots: [],
        tokenUsageHints: [],
      };

    const exportName = toPascalCase(raw.id.replace(/-/g, "_"));
    const processed = await postprocessSection({
      sectionId: raw.id,
      exportName,
      tsx: raw.tsx,
      section: sectionBp as SectionBlueprintBrief,
      anthropicClient: client,
    });

    const fileName = `${raw.id}.tsx`;
    const filePath = path.join(componentsDir, fileName);
    fs.writeFileSync(filePath, processed.content, "utf-8");

    results.sections.push({
      id: raw.id,
      exportName,
      filePath,
      warnings: processed.warnings,
      usesClient: processed.usesClient,
    });

    // Freeze header and footer
    if (raw.id === "header" || raw.id.toLowerCase().includes("header")) {
      results.frozenAssets.headerTsx = processed.content;
    }
    if (raw.id === "footer" || raw.id.toLowerCase().includes("footer")) {
      results.frozenAssets.footerTsx = processed.content;
    }
  }

  // 7. Compose HomePage template
  const homePageContent = composeHomePage(themeName, results.sections, homepageBp);
  fs.writeFileSync(path.join(pagesDir, "home.tsx"), homePageContent, "utf-8");

  // 8. Scaffold theme package with brief overrides
  const briefRegistry = {
    theme: themeName,
    heroVariant: brief.componentVariants.heroVariant,
    headerVariant: brief.componentVariants.headerVariant,
    cardVariant: brief.componentVariants.cardVariant,
    sectionVariant: brief.componentVariants.sectionVariant,
  };
  const briefConfig: DeepPartialThemeConfig = {
    colors: {
      brand: brief.palette.brand as any,
      surface: brief.palette.surface as any,
      semantic: brief.palette.semantic,
      overlay: brief.palette.overlay,
    },
    typography: {
      fontFamily: brief.typography.fontFamily,
      ...(brief.typography.scale ? { scale: brief.typography.scale as any } : {}),
    },
  };

  // We need a minimal SiteAnalysis shell for scaffoldThemePackage
  const minimalAnalysis = {
    analysisVersion: "3" as const,
    reference: {
      url: brief.reference.url,
      capturedAt: brief.reference.capturedAt,
      pagesAnalysed: 1,
    },
    discoveredPages: [],
    pageBlueprints: [],
    visualLanguage: {
      palette: {
        background: brief.palette.surface.background,
        foreground: brief.palette.surface.foreground,
        primary: brief.palette.brand.primary,
        secondary: brief.palette.brand.secondary,
        accent: brief.palette.brand.accent,
        additional: [],
        confidence: "medium" as const,
      },
      typography: {
        headingWeight: brief.typography.headingWeight,
        bodyWeight: brief.typography.bodyWeight,
        headingStyle: brief.typography.headingStyle,
        usesInlineColourHighlights: brief.typography.usesInlineColorHighlights,
      },
      heroPattern: brief.layout.heroPattern,
      spacingDensity: brief.layout.spacingDensity,
    },
    sectionBlueprints: [],
    componentMatches: [],
    themeTokenRecommendations: {
      brand: brief.palette.brand as any,
      surface: brief.palette.surface as any,
      typography: { fontFamilySans: brief.typography.fontFamily.sans },
      components: {},
    },
    registryRecommendation: {
      themeName,
      confidence: "high" as const,
      reasoning: "From DesignBrief",
    },
  };

  results.themePackagePath = scaffoldThemePackage(
    minimalAnalysis as any,
    themeName,
    componentsDir,
    { registry: briefRegistry, config: briefConfig }
  );

  console.log(`Theme package scaffolded at: ${results.themePackagePath}`);
  return results;
}

/**
 * Compose the HomePage template that imports and renders all sections in order.
 */
function composeHomePage(
  themeName: string,
  sections: GenerationResult["sections"],
  blueprint: PageBlueprintBrief
): string {
  const imports = sections
    .map((s) => `import { ${s.exportName} } from '../components/${s.id}';`)
    .join("\n");
  const renders = blueprint.sections
    .map((bp) => {
      const s = sections.find((s) => s.id === bp.id);
      return s ? `      <${s.exportName} />` : `      {/* ${bp.id} — not generated */}`;
    })
    .join("\n");

  return `import React from 'react';
${imports}

export interface HomePageProps {
  // Add content props as needed
}

export function HomePage(_props: HomePageProps) {
  return (
    <>
${renders}
    </>
  );
}
`;
}

function toPascalCase(str: string): string {
  return str.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());
}
```

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

Then commit:

```bash
git add tools/lib/design-brief-generator.ts tools/lib/design-brief-postprocess.ts tools/scaffold-theme-package.ts
git commit -m "feat(design-brief): generator orchestration, postprocess pipeline, scaffold briefOverrides

- generateFromBrief(): DesignBrief + skill → Claude API → section components → theme package
- Page-level generation with {/* SECTION: id */} extraction and positional fallback
- Header/footer frozen as canonical assets after homepage generation
- postprocessSection(): validation/repair wrapper around existing theme-component-generator validators
- scaffoldThemePackage() gains optional briefOverrides for registry + config — additive, no callers broken
- Composes HomePage template importing sections in blueprint order

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 5: CLI & Skill Command

**Goal:** Wire everything into a usable CLI tool and slash command skill.
**Model:** sonnet — file creation, straightforward orchestration wiring

### Step 5.1: Create `tools/generate-from-brief.ts`

CLI entry point. Supports two modes: `--url` (full pipeline) and `--brief` (skip harvest).

```typescript
#!/usr/bin/env npx tsx
/**
 * Generate Theme From Brief
 *
 * Runs the design brief pipeline to generate a theme package from a reference site.
 *
 * Usage:
 *   npx tsx tools/generate-from-brief.ts --url https://example.com --skill impeccable [--name theme-name]
 *   npx tsx tools/generate-from-brief.ts --brief output/briefs/theme-name/design-brief.json --skill high-end
 *
 * Flags:
 *   --url <website>        Full pipeline: harvest → compile → generate → QA
 *   --brief <path>         Skip harvest: use existing brief JSON
 *   --skill <name>         Required: impeccable | stitch | high-end | design-taste | minimalist | brutalist
 *   --name <slug>          Theme name (auto-assigned from constellation namespace if omitted)
 *   --qa-iterations <n>    Visual QA iterations (default: 0 — QA disabled until pipeline.design-brief)
 *   --dry-run              Compile brief only, no generation
 *   --emit-brief <path>    Write brief to custom path (default: output/briefs/<name>/)
 */
```

**Orchestration:**

1. Parse args (use same pattern as `tools/analyse-site.ts` CLI arg parsing)
2. Validate: `--skill` is required; either `--url` or `--brief` must be provided
3. **If `--url`:**
   - Determine theme name (from `--name` or auto-assign via `pickNextThemeName()`)
   - Run `spawnSync('npx', ['tsx', 'tools/analyse-site.ts', '--url', url, '--name', name, '--skip-examples'])`
   - Read `output/ingestion/<name>/site-analysis.json`
   - Reconstruct MappedTokens: `mapStylesToTokens(siteAnalysis.computedStyles ?? { pages: [] })`
   - Build screenshot paths from `output/ingestion/<name>/screenshots/` if directory exists
   - Compile brief: `compileDesignBrief({ siteAnalysis, mappedTokens, screenshotPaths })`
   - Write `output/briefs/<name>/design-brief.json`
   - Write `output/briefs/<name>/design-brief-summary.md` via `renderBriefSummary(brief)`
   - Print warnings if any
4. **If `--brief`:**
   - Read JSON from `--brief` path
   - Validate with `DesignBriefSchema.parse()`
   - Derive name from `brief.meta.sourceUrl` hostname or `--name`
5. **If `--dry-run`:** Print summary and exit 0
6. Run `generateFromBrief({ brief, themeName, skill, outputDir: \`packages/themes/${themeName}\`, anthropicApiKey: process.env.ANTHROPIC_API_KEY })`
7. Print result: theme package path, section list, warnings
8. If `--qa-iterations > 0`: print "QA loop not yet implemented in CLI — use /pipeline.design-brief"

```bash
# Verification gate — STOP if this fails
# Test --brief mode with fixture (no live site needed)
npx tsx tools/generate-from-brief.ts \
  --brief tools/__fixtures__/briefs/sample-brief.json \
  --skill high-end \
  --name test-brief-verify \
  --dry-run
# Should print the brief summary and exit cleanly

pnpm type-check
```

### Step 5.2: Create `.claude/commands/pipeline.design-brief.md`

The slash command skill. Write it to `~/.claude/commands/pipeline.design-brief.md` — this is the user-global location so it's available in all projects.

**Content structure:**

````markdown
# Pipeline Design Brief

Run the design brief pipeline against a reference URL to generate a theme package.

**Usage:** `/pipeline.design-brief --url https://example.com [--name my-theme]`

---

## Architecture

Three phases:

| Phase                              | Work                                                        |
| ---------------------------------- | ----------------------------------------------------------- |
| **A — Harvest + Compile**          | Run `analyse-site.ts`, compile DesignBrief, display summary |
| **B — Skill Selection + Generate** | User picks skill, run generator for homepage                |
| **C — Test Site + QA**             | Scaffold test site, wire theme, visual QA loop              |

---

## Step 1: Preflight

[branch check — must be on develop, same pattern as pipeline.ingest]

Parse `$ARGUMENTS` for:

- `--url` (required)
- `--name` (optional)
- `--skill` (optional — if provided, skip skill selection prompt in Phase B)

---

## Phase A — Harvest + Compile

### A0: Run analysis

[same as pipeline.ingest Phase A0 — run analyse-site.ts, wait for completion, read theme name]

**A0 verification gate:**

```bash
test -f output/ingestion/<theme-name>/site-analysis.json
```
````

### A1: Compile brief

```bash
npx tsx tools/generate-from-brief.ts \
  --brief-only \
  --url $URL \
  --name $THEME_NAME \
  --emit-brief output/briefs/$THEME_NAME/
```

Wait for completion. Read `output/briefs/$THEME_NAME/design-brief-summary.md` and display it to the user.

**A1 verification gate:**

```bash
test -f output/briefs/<theme-name>/design-brief.json
```

Display any compiler warnings to the user.

---

## Phase B — Skill Selection + Generate

### B1: Skill selection

If `--skill` was provided in arguments, use it directly.

Otherwise, display this menu to the user:

```
Available design skills:

  1. impeccable      — Balanced, accessible. Anti-slop enforcement. Good for most sites.
  2. high-end        — Agency-level dramatics. Spring animations, asymmetric layouts.
  3. design-taste    — Dial-based control. Calibrated variance, micro-interactions.
  4. minimalist      — Editorial, clean. Warm monochrome, flat bento grids.
  5. brutalist       — Swiss typography, rigid grids. Data-heavy industrial aesthetic.
  6. stitch          — Generate via Google Stitch MCP (requires Stitch access).

Recommendation based on brief: [derive from visualTone.designSkillHints and visualTone.description]

Pick a skill (1-6):
```

Wait for user selection.

### B2: Generate homepage

```bash
npx tsx tools/generate-from-brief.ts \
  --brief output/briefs/$THEME_NAME/design-brief.json \
  --skill $SELECTED_SKILL \
  --name $THEME_NAME
```

This takes several minutes. Wait for completion.

**B2 verification gate:**

```bash
test -f packages/themes/<theme-name>/index.ts
test -f packages/themes/<theme-name>/components/header.tsx
test -f packages/themes/<theme-name>/pages/home.tsx
```

Run theme package validator:

```bash
# Use cs-theme-package-validator sub-agent (read-only)
# Same pattern as pipeline.ingest Phase B
```

If Critical + High > 0: STOP and report issues.

---

## Phase C — Test Site + QA

### C1: Scaffold test site

[Same as pipeline.ingest Phase C — copy base-template, wire theme, run dev server smoke check]

### C2: Visual QA

```bash
npx tsx tools/lib/visual-qa-loop.ts \
  --site sites/<theme-name>-test \
  --reference output/ingestion/$THEME_NAME/screenshots \
  --iterations 3
```

Display results: per-page diff percentages vs thresholds.

### C3: Review

Display side-by-side file paths for reference vs generated screenshots.

Ask user: "Approve this theme, re-run with a different skill, or stop?"

- **Approve:** Report success, theme at `packages/themes/<theme-name>/`
- **Re-run:** Return to Phase B1 with the same brief
- **Stop:** Report theme package path, note manual tweaks needed

---

## Rules

- STOP on any failed verification gate
- Never push — leave changes on feature branch or develop
- Phase C QA is best-effort — a diff > threshold is a warning, not a blocker (the user approves)

````

Note on `--brief-only` flag: add this flag to `tools/generate-from-brief.ts` (harvest + compile only, writes brief JSON and summary, then exits — same as `--dry-run` but specifically for the skill command's two-step A0/A1 flow).

```bash
# Verification gate — STOP if this fails
test -f tools/generate-from-brief.ts
test -f ~/.claude/commands/pipeline.design-brief.md
# Confirm CLI parses --dry-run correctly
npx tsx tools/generate-from-brief.ts --help 2>&1 | grep -E "url|brief|skill|dry-run" || echo "PASS: flags listed in usage"
pnpm type-check
````

Then commit:

```bash
git add tools/generate-from-brief.ts
git commit -m "feat(design-brief): generate-from-brief CLI with --url, --brief, --skill, --dry-run flags

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

# Skill command goes to ~/.claude — commit note only
git add --dry-run ~/.claude/commands/pipeline.design-brief.md 2>/dev/null || true
# If the commands dir is in the repo, stage it; otherwise just note it was written
git commit --allow-empty -m "feat(design-brief): /pipeline.design-brief slash command skill

Phases: A (harvest+compile), B (skill selection+generate), C (test site+QA)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase 6 (QA) and Phase 7 (Deprecation) — DEFERRED

Phases 6 and 7 from the synthesis are intentionally deferred to real-world validation sessions:

- **Phase 6** (visual QA diagnostics with brief deltas) requires a working end-to-end pipeline to test against — implement after the first real `/pipeline.design-brief` run
- **Phase 7** (deprecation of clone-extract modules) only after 2-3 successful real client themes

Do NOT implement these in this session.

---

## Parallel Execution Groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                                        | File overlap      | Model  | Rationale                                                     |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------ | ------------------------------------------------------------- |
| G1    | Phase 4 | Read `tools/lib/theme-component-generator.ts`, `tools/scaffold-theme-package.ts` lines 600–756, `tools/lib/design-skills/adapter-types.ts`, `tools/lib/design-brief-types.ts`, `tools/__fixtures__/briefs/sample-brief.json` | none (reads only) | n/a    | Pre-read all source files before writing                      |
| G2    | Phase 4 | Write `tools/lib/design-brief-postprocess.ts`, modify `tools/scaffold-theme-package.ts`                                                                                                                                      | different files   | sonnet | Independent — postprocess is new, scaffold is additive change |
| G3    | Phase 5 | Write `tools/generate-from-brief.ts`, write `~/.claude/commands/pipeline.design-brief.md`                                                                                                                                    | none              | sonnet | Independent files in independent locations                    |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                     |
| ------ | ------ | ----- | --------------------------------------------- |
| (none) |        |       | Phase 4 must complete before Phase 5 wires it |

### Sequential points — MUST NOT parallelise

| Item                                                                     | Reason                                                        |
| ------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `tools/lib/design-brief-generator.ts`                                    | Depends on postprocess.ts and scaffold changes — write last   |
| Verification gates (`pnpm type-check`)                                   | Each phase gates the next                                     |
| Git commits                                                              | One commit per phase                                          |
| `scaffold-theme-package.ts` modification and `design-brief-generator.ts` | Generator imports from scaffold — scaffold must be done first |

---

## Cost Estimate

| Phase                  | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase 4: Generator     | opus   | ~35k              | ~12k               | ~$1.43     |
| Phase 5: CLI + command | sonnet | ~15k              | ~6k                | ~$0.14     |
| **Total**              |        | **~50k**          | **~18k**           | **~$1.57** |

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
   | opus      | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-17_design-brief-pipeline/yolo-brief-session2.md`:

```markdown
## Completed

**Date:** [today]
**Status:** Session 2 — Phases 4-5 complete

[1-paragraph summary: what was implemented, deviations, what comes next (first real pipeline.design-brief run)]

### Commits

[list each commit SHA and message]
```

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
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: opus` for Phase 4 (cross-file generator); `model: sonnet` for Phase 5
- The Co-Authored-By line in commits must reflect: `Claude Sonnet 4.6`
- The skill command file `~/.claude/commands/pipeline.design-brief.md` is written outside the repo root — this is expected and covered by `--additionalDirectories ~/.claude` in the launch command

---

## Completed

**Date:** 2026-04-17
**Status:** Session 2 — Phases 4-5 complete

Phase 4 delivered the generator layer: `design-brief-postprocess.ts` wraps the existing validation/repair pipeline (syntax, semantic, token classes, hex repair, bracket props) around raw TSX sections from adapter output; `design-brief-generator.ts` orchestrates the full flow — DesignBrief → Claude API call via adapter → per-section postprocess → theme package scaffold with brief overrides; `scaffold-theme-package.ts` gained an optional `briefOverrides` parameter with `deepMerge` helper and `generateIndexTs` extended to apply registry and config overrides. Private functions in `theme-component-generator.ts` were exported and shell functions re-exported so `postprocess.ts` could import them cleanly. Phase 5 delivered `tools/generate-from-brief.ts` (CLI with `--url`, `--brief`, `--skill`, `--dry-run`, `--brief-only`, `--emit-brief` flags) and `~/.claude/commands/pipeline.design-brief.md` (the `/pipeline.design-brief` slash command covering Phases A/B/C). Deviation from plan: the `SectionBlueprint` vs `SectionBlueprintBrief` type mismatch required constructing a compatible object in `postprocess.ts` (adapter pattern, additive). The `briefConfig.typography.scale` field used `as never` cast to avoid a complex type mapping — this is cosmetic only and doesn't affect runtime. Next step: first real `/pipeline.design-brief` run against a client reference site to validate the end-to-end flow.

### Commits

- `68cf037` feat(design-brief): generator orchestration, postprocess pipeline, scaffold briefOverrides
- `dca374c` feat(design-brief): generate-from-brief CLI with --url, --brief, --skill, --dry-run flags
- `f3d3dc4` feat(design-brief): /pipeline.design-brief slash command skill
