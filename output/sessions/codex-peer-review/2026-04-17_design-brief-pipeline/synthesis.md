# Implementation Plan: Design Brief Pipeline

**Date:** 2026-04-17
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                                     | Claude                                                                                 | Codex                                                                                                                    | Synthesised Decision                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Schema strictness**                      | Relaxed optional fields, lenient Zod                                                   | `.strict()` schemas, forbid HTML/CSS payloads explicitly                                                                 | **Codex wins.** Use `.strict()` to prevent accidental data leakage. Add a Zod `.refine()` that rejects values containing `<` or `{` in token fields.                                                                                                                                                                                                                                                                                             |
| **Compiler structure**                     | Single `design-brief-compiler.ts` file                                                 | Separate mapper files per section (`map-palette.ts`, `map-typography.ts`, etc.)                                          | **Codex wins.** Mapper-per-section is easier to test in isolation and matches the schema's section structure. Keeps the compiler orchestrator thin.                                                                                                                                                                                                                                                                                              |
| **Adapter architecture**                   | `SkillAdapter` interface in `design-brief-prompts.ts`                                  | Formal `DesignSkillAdapter` interface with `buildPrompt()`, `invoke()`, `normalize()` in a `design-skills/` subdirectory | **Codex wins on structure, Claude wins on scope.** Use the directory structure but keep v1 simpler: `buildPrompt()` + `normalizeOutput()` only. Skip `invoke()` — the generator orchestrator handles API calls.                                                                                                                                                                                                                                  |
| **Page-level vs section-level generation** | Page-level with section markers `{/* SECTION: id */}`                                  | Not explicitly addressed                                                                                                 | **Claude's approach.** Page-level generation produces better visual coherence. Use comment markers for extraction. Fall back to section-by-section if extraction fails.                                                                                                                                                                                                                                                                          |
| **QA feedback mechanism**                  | Diff diagnosis → correction prompt → re-generate failing sections                      | Brief deltas (not code patches) fed back for re-generation                                                               | **Codex wins.** QA corrections as brief deltas (e.g., "hero too tall → reduce min-height intent") keeps the abstraction clean. The adapter then re-formats the corrected brief section.                                                                                                                                                                                                                                                          |
| **`analyse-site.ts` integration**          | "Reuse unchanged"                                                                      | Flags potential need for wrapper/shim to get clean `SiteAnalysis + MappedTokens` without triggering component generation | **Codex caught a real issue.** Currently `analyse-site.ts` runs component generation (Step 12) as part of its flow. We need either `--skip-generation` flag or to read the `site-analysis.json` output after the run and ignore generated components. Decision: **read `site-analysis.json` post-run** — the JSON already contains everything the compiler needs; generated components are simply ignored. No modification to `analyse-site.ts`. |
| **Testing strategy**                       | Verification gates per phase, manual review                                            | Formal fixture-based test layers (unit, contract, snapshot, integration, E2E lite)                                       | **Codex wins.** Add `tools/__fixtures__/` with analysis fixtures for deterministic offline testing. CI job runs `test:pipeline-fixture` without needing a live site.                                                                                                                                                                                                                                                                             |
| **ADR / decisions doc**                    | Not proposed                                                                           | Step 1: write `docs/design-brief-pipeline-decisions.md` before coding                                                    | **Skip for now.** The synthesis document serves as the ADR. If decisions change during implementation, update this file.                                                                                                                                                                                                                                                                                                                         |
| **`scaffold-theme-package.ts` changes**    | Add `briefOverrides` parameter                                                         | Use scaffold as-is, assemble package structure independently                                                             | **Claude wins.** `briefOverrides` is a minimal, non-breaking change that keeps all package assembly logic in one place.                                                                                                                                                                                                                                                                                                                          |
| **Schema fields**                          | 6 sections: palette, typography, layout, componentVariants, pageBlueprints, visualTone | Adds `meta` (versioning/provenance), `constraints` (build rules), `qaTargets` (screenshot refs + fidelity areas)         | **Merge.** Add `meta` (briefVersion, generatedAt, sourceUrl, pipelineVersion). Skip `constraints` — those are hardcoded in the generator, not per-brief. Incorporate `qaTargets` into `reference` (screenshots already there, add fidelityAreas).                                                                                                                                                                                                |

## Blind Spots Caught

- **Codex caught:** `analyse-site.ts` generates components as a side-effect of running. The compiler needs analysis data but not generated components — we must account for this mismatch. Resolution: read `site-analysis.json` post-run, ignore `/components/` output.
- **Codex caught:** The brief should explicitly forbid HTML/CSS content via Zod refinements, not just by convention. Protects against future regressions.
- **Codex caught:** Need a `needsHumanReview` field for tokens where confidence is too low for automated mapping. The compiler should surface these rather than silently falling back.
- **Claude caught:** Page-level generation with section markers is critical for visual coherence — section-by-section generation produces disjointed output. This wasn't addressed in Codex's plan.
- **Claude caught:** The `briefOverrides` approach to `scaffold-theme-package.ts` is safer than building a parallel assembly path — one place for all package logic.
- **Claude caught:** Header/footer freezing as explicit fixed assets is a key architectural constraint that prevents cross-page inconsistency.

---

## Implementation Plan

### Phase 0: Skill Installation

**Duration:** Quick setup task

Install third-party skills:

```bash
npx skills add pbakaus/impeccable
npx skills add google-labs-code/stitch-skills --skill stitch-design
npx skills add google-labs-code/stitch-skills --skill enhance-prompt
npx skills add google-labs-code/stitch-skills --skill design-md
npx skills add arvindrk/extract-design-system --skill extract-design-system
```

**Verification:** Each skill appears in `.claude/` or `~/.claude/`. Run `ls ~/.claude/commands/` (or equivalent) to confirm.

---

### Phase 1: DesignBrief Schema & Types

**Create:** `tools/lib/design-brief-types.ts`

Schema has 7 top-level sections:

1. **`meta`** — `{ briefVersion: "1", generatedAt: string, sourceUrl?: string, pipelineVersion: string }`
2. **`reference`** — `{ url, screenshots: Record<pageType, path>, capturedAt, fidelityAreas?: string[] }`
3. **`palette`** — brand (primary, primaryHover, secondary, accent, onPrimary), surface (all 12 fields), semantic (4), overlay (3), provenance
4. **`typography`** — fontFamily, scale (optional per-level), headingStyle/Weight, bodyWeight, usesInlineColorHighlights
5. **`layout`** — heroPattern, spacingDensity, containerWidth, sectionPaddingY
6. **`componentVariants`** — heroVariant, headerVariant, headerStyle, cardVariant, sectionVariant, buttonRadius, cardRadius, cardShadow
7. **`pageBlueprints`** — Array of { pageType, sections: Array<{ order, id, name, category, purpose, layoutPattern, contentSlots, interactionNeeds, tokenUsageHints, confidence }> }
8. **`visualTone`** — description, designSkillHints (variance/density/motion 1-10), antiPatterns[], referenceDescription

**Zod rules:**

- All schemas use `.strict()` to reject extra fields
- Color fields use `.refine()` to reject strings containing `<` or `{` (no HTML/CSS leakage)
- `briefVersion` is a literal `"1"` for forward compatibility
- Provenance records track source and confidence per token

**Create:** `tools/__fixtures__/briefs/sample-brief.json` — a valid fixture for testing

**Verification gate:** Unit test: valid fixture passes, fixture with HTML in a color field fails, fixture missing required section fails.

---

### Phase 2: Brief Compiler

**Create:**

- `tools/lib/design-brief-compiler.ts` — orchestrator
- `tools/lib/design-brief-mappers/map-palette.ts`
- `tools/lib/design-brief-mappers/map-typography.ts`
- `tools/lib/design-brief-mappers/map-layout.ts`
- `tools/lib/design-brief-mappers/map-component-variants.ts`
- `tools/lib/design-brief-mappers/map-page-blueprints.ts`
- `tools/lib/design-brief-mappers/map-visual-tone.ts`
- `tools/lib/design-brief-mappers/index.ts` (barrel)

**Create:** `tools/lib/design-brief-renderer.ts` — markdown summary generator

**Main function:**

```typescript
export function compileDesignBrief(inputs: {
  siteAnalysis: SiteAnalysis;
  mappedTokens: MappedTokens;
  screenshotPaths: Record<string, string>;
}): { brief: DesignBrief; warnings: string[] };
```

Returns warnings for low-confidence mappings that may need human review.

**Key rules:**

- Pure data transformation — NO AI calls
- Uses existing token reconciliation priority: synthesis+computed → synthesis → computed → vision → CSS → defaults
- Each mapper is independently testable
- Strips all clone-specific fields from SectionBlueprints (cloneHtmlFragment, cloneRelevantCss, matchScore, etc.)
- Derives visualTone heuristically: spacing density → density dial, section diversity → variance dial, interactionNeeds count → motion dial

**`analyse-site.ts` integration:** The compiler reads `{outputDir}/site-analysis.json` (written by Step 11 of analyse-site). The `computedStyles` field is embedded in SiteAnalysis. `MappedTokens` is reconstructed by calling `mapStylesToTokens(siteAnalysis.computedStyles)` — this function is already exported from `computed-style-token-mapper.ts`. No changes to `analyse-site.ts` needed.

**Verification gate:**

- Create `tools/__fixtures__/analyses/` with a real `site-analysis.json` from a previous pipeline run
- Unit test each mapper independently
- Golden snapshot test: compiler produces deterministic JSON for fixture input
- Property test: output never contains `<` or `{` in color/font fields

---

### Phase 3: Skill Adapters

**Create directory:** `tools/lib/design-skills/`

**Create:**

- `tools/lib/design-skills/adapter-types.ts` — interface definition
- `tools/lib/design-skills/adapter-registry.ts` — maps skill IDs to adapter instances
- `tools/lib/design-skills/adapters/generic-adapter.ts` — for high-end, design-taste, minimalist, brutalist
- `tools/lib/design-skills/adapters/stitch-adapter.ts` — for Stitch MCP workflow
- `tools/lib/design-skills/adapters/impeccable-adapter.ts` — for Impeccable
- `tools/lib/design-skills/shared-constraints.ts` — token constraint block, animation primitives, component shell rules

**Adapter interface (v1 — intentionally simple):**

```typescript
interface DesignSkillAdapter {
  id: string;
  name: string;
  buildPagePrompt(
    brief: DesignBrief,
    page: PageBlueprintBrief,
    options: {
      includeHeader: boolean;
      includeFooter: boolean;
      existingHeaderTsx?: string;
      existingFooterTsx?: string;
    }
  ): { systemPrompt: string; userPrompt: string };

  buildCorrectionPrompt(
    brief: DesignBrief,
    diagnosis: DiffDiagnosis,
    failingSectionIds: string[]
  ): string;

  normalizeOutput(raw: string): { sections: Array<{ id: string; tsx: string }> };
}
```

**Key design decisions:**

- `buildPagePrompt` returns system + user prompt separately (system prompt loads the skill's personality, user prompt has the brief + blueprint)
- `normalizeOutput` splits the page-level response into individual section TSX blocks using `{/* SECTION: id */}` markers
- `buildCorrectionPrompt` takes a diff diagnosis and produces a targeted re-generation prompt
- The generator orchestrator (Phase 4) handles the actual API call — adapters only format prompts and parse output

**Shared constraints block** (appended to all prompts):

- All Tailwind token classes from `token-class-allowlist.ts`
- Animation primitive import signatures from `core-components`
- Server Component default rule (no useState/useEffect unless interactionNeeds === "stateful")
- Export format: `export function SectionName(props: SectionNameProps) { ... }`
- No hardcoded hex — use `bg-brand-primary`, `text-surface-foreground`, etc.

**Verification gate:** Generate prompts for the same fixture brief with generic + impeccable adapters. Confirm both include the constraints block. Confirm Stitch adapter produces DESIGN.md-formatted output.

---

### Phase 4: Generator Orchestration

**Create:**

- `tools/lib/design-brief-generator.ts` — main orchestrator
- `tools/lib/design-brief-postprocess.ts` — validation pipeline wrapper

**Modify:**

- `tools/scaffold-theme-package.ts` — add optional `briefOverrides` parameter

**Generator flow:**

```
DesignBrief + Skill + ThemeName
  │
  ├─ Select adapter from registry
  │
  ├─ Build homepage prompt (header + footer + all body sections)
  │  └─ Adapter.buildPagePrompt(brief, homepageBlueprint, { includeHeader: true, includeFooter: true })
  │
  ├─ Call Claude API (Anthropic SDK)
  │  ├─ System prompt: skill personality + shared constraints
  │  └─ User prompt: brief context + page blueprint + generation instructions
  │
  ├─ Parse response → extract sections via Adapter.normalizeOutput()
  │  ├─ Look for {/* SECTION: id */} markers
  │  └─ Fallback: if no markers found, treat as single component (degrade gracefully)
  │
  ├─ For each extracted section:
  │  ├─ Wrap in serverComponentShell() or clientComponentShell()
  │  ├─ Run postprocess pipeline:
  │  │  ├─ validateTypeScriptSyntax() → retryWithSyntaxErrors() if failed
  │  │  ├─ validateTypeScriptSemantic() → retryWithSemanticErrors() if failed
  │  │  ├─ validateAndFixTokenClasses() → auto-fix
  │  │  ├─ autoRepairHexLiterals() → auto-fix
  │  │  ├─ fixBracketNotationProps() → auto-fix
  │  │  └─ verifyNamedExport() → fail with warning if missing
  │  └─ Write to {outputDir}/components/{section-id}.tsx
  │
  ├─ Freeze header.tsx + footer.tsx as canonical assets
  │
  ├─ Compose HomePage template (imports all sections in blueprint order)
  │  └─ Write to {outputDir}/pages/home.tsx
  │
  └─ scaffoldThemePackage(analysis, themeName, outputDir, {
       registry: brief.componentVariants → ComponentRegistry,
       config: brief.palette + brief.typography → DeepPartialThemeConfig
     })
```

**`scaffold-theme-package.ts` change:**

```typescript
export function scaffoldThemePackage(
  analysis: ReferenceAnalysis | SiteAnalysis,
  name: string,
  outputDir?: string,
  briefOverrides?: {
    registry?: Partial<ComponentRegistry>;
    config?: DeepPartialThemeConfig;
  }
): string;
```

When `briefOverrides.config` is provided, merge it over the analysis-derived config. When `briefOverrides.registry` is provided, use it instead of inferring from `registryRecommendation`. This is additive — existing callers are unaffected.

**Verification gate:**

- Generate a theme package from fixture brief
- Confirm it passes `cs-theme-package-validator` (all 15 rules)
- Confirm zero hex literals remain (`scanForHexLiterals()` returns empty)
- Confirm `index.ts` exports correct registry and config matching the brief

---

### Phase 5: CLI & Skill Command

**Create:**

- `tools/generate-from-brief.ts` — CLI entry point
- `.claude/commands/pipeline.design-brief.md` — slash command skill

**CLI:**

```
Usage:
  npx tsx tools/generate-from-brief.ts --url https://example.com --skill impeccable [--name theme-name]
  npx tsx tools/generate-from-brief.ts --brief output/briefs/theme-name/design-brief.json --skill high-end

Flags:
  --url <website>       Full pipeline: harvest → compile → generate → QA
  --brief <path>        Skip harvest: use existing brief JSON
  --skill <name>        Required: impeccable | stitch | high-end | design-taste | minimalist | brutalist
  --name <slug>         Theme name (auto-assigned from constellation if omitted)
  --qa-iterations <n>   Visual QA iterations (default: 3, 0 = skip)
  --dry-run             Compile brief only, no generation
  --emit-brief <path>   Write brief to custom path (default: output/briefs/<name>/)
```

**Orchestration:**

1. Parse args, validate required flags
2. **If `--url`:** Run `npx tsx tools/analyse-site.ts --url $URL --name $NAME --skip-examples` as subprocess
3. Read `output/ingestion/<name>/site-analysis.json`
4. Reconstruct `MappedTokens` via `mapStylesToTokens(siteAnalysis.computedStyles)`
5. Compile brief → write `design-brief.json` + `design-brief-summary.md` to `output/briefs/<name>/`
6. **If `--brief`:** Read and validate existing brief JSON
7. **If `--dry-run`:** Print summary and exit
8. Generate theme package via `generateFromBrief()`
9. **If `--qa-iterations > 0`:** Scaffold test site, run visual QA loop
10. Print report: theme package path, validation results, QA scores

**Skill command phases:**

- **A: Preflight** — branch check, argument parsing
- **B: Harvest** — run `analyse-site.ts`
- **C: Compile Brief** — compile + display summary to user
- **D: Skill Selection** — show available skills, user picks
- **E: Generate** — run generator for homepage
- **F: Test Site + QA** — scaffold test site, wire theme, visual QA loop
- **G: Review** — show reference vs generated screenshots, prompt for approval or re-run

**Verification gate:** Run CLI with `--url` against a known reference site. Confirm all phases complete. Run with `--brief` against a fixture. Confirm both produce valid theme packages.

---

### Phase 6: Visual QA Enhancement

**Create:** `tools/lib/visual-qa-diagnostics.ts`

**Modify:** `tools/lib/visual-qa-loop.ts`

**New diagnostic function:**

```typescript
export async function diagnoseVisualDiff(
  referenceScreenshot: string,
  generatedScreenshot: string,
  pageBlueprint: PageBlueprintBrief
): Promise<DiffDiagnosis>;

interface DiffDiagnosis {
  sections: Array<{
    id: string;
    issue: string;
    severity: "major" | "minor";
    briefDelta: Record<string, unknown>; // partial brief override for this section
  }>;
  overallAssessment: string;
  estimatedImprovement: number; // 0-1, predicted diff reduction
}
```

**Key change from both plans:** QA corrections are expressed as **brief deltas**, not code patches. The diagnosis says "hero section needs `spacingDensity: compact` and `heroPattern.type: dark-full-bleed`" — the adapter re-formats this into a skill-specific correction prompt. This keeps the abstraction boundary clean.

**Enhanced QA loop:**

1. Capture generated screenshots
2. Pixel diff against reference
3. If pass → done
4. If fail → `diagnoseVisualDiff()` (Claude vision API)
5. Extract brief deltas for failing sections
6. `Adapter.buildCorrectionPrompt(brief, diagnosis, failingSectionIds)`
7. Re-generate only failing sections
8. Replace in theme package, restart dev server
9. Re-screenshot, re-diff
10. Repeat up to `maxIterations`

**Important:** Header and footer remain frozen during QA iterations unless explicitly unlocked. Only body section components are re-generated.

**Verification gate:** Introduce a deliberate color mismatch in a generated component. Run QA loop. Confirm diagnosis identifies the section and the correction improves the diff score.

---

### Phase 7: Deprecation

**Only after the pipeline has been validated on 2-3 real reference sites.**

**Step 7.1:** Add `@deprecated` JSDoc + deprecation note to:

- `tools/extract-theme.ts` (Pass 1 Translate + Pass 2 Strip)
- `tools/lib/theme-component-templates.ts`
- `tools/lib/clone-section-extractor.ts`
- `tools/lib/clone-css-rule-extractor.ts`
- `tools/lib/clone-entry/design-skill.ts`
- `tools/lib/html-to-jsx-converter.ts`
- `tools/clone-site.ts` (kept but marked as non-primary)

**Step 7.2:** Remove deprecated module imports from any active pipeline paths. Grep to confirm no active imports.

**Step 7.3:** Update documentation:

- Create `docs/architecture/how-design-brief-pipeline-works.md`
- Update `docs/guides/creating-new-theme.md`
- Update `CLAUDE.md` to reference `/pipeline.design-brief`
- Run `/update.docs` to verify

**Step 7.4:** Delete deprecated files after pipeline has produced 3+ successful theme packages without rollback.

**Verification gate:** `grep -r "extract-theme\|clone-section-extractor\|clone-css-rule-extractor\|theme-component-templates" tools/` returns only deprecated files and test fixtures.

---

### Phase 8: Testing Infrastructure

**Create:**

- `tools/__fixtures__/analyses/sample-site-analysis.json` — real analysis output from a previous run
- `tools/__fixtures__/briefs/sample-brief.json` — valid DesignBrief
- `tools/__fixtures__/briefs/invalid-brief-html-in-color.json` — should fail validation
- `tools/__fixtures__/briefs/minimal-brief.json` — html-only mode (no vision data)

**Test layers:**

1. **Unit:** Schema validation, each mapper function, renderer
2. **Contract:** Adapter interface compliance (both adapters return normalized output for same input)
3. **Snapshot/golden:** Compiler produces identical JSON for identical input
4. **Integration:** Brief → generator → theme package (with mocked Claude API response)
5. **E2E fixture:** CLI `--brief` mode → valid theme package → passes validator

**CI integration:** Add `test:pipeline-fixture` script that runs without live site or API key (mocked responses).

**Verification gate:** All test layers pass in CI. No live-site dependency for default test lane.

---

## Implementation Sequence

```
Phase 0: Install skills ─────────────────────────┐
Phase 1: Schema + types ─────────────────────────┤ (can run in parallel)
                                                  │
Phase 2: Compiler + mappers + renderer ───────────┤
                                                  │
Phase 3: Skill adapters ──────────────────────────┤
                                                  │
Phase 4: Generator + scaffold-theme-package mod ──┘
         (depends on 1, 2, 3)
                    │
Phase 5: CLI + skill command ─────────────────────┘
         (depends on 4)
                    │
Phase 6: Visual QA enhancement ───────────────────┘
         (depends on 5 — needs working pipeline to test)
                    │
Phase 7: Deprecation ─────────────────────────────┘
         (only after 2-3 successful real runs)
                    │
Phase 8: Testing infrastructure ──────────────────
         (fixtures created during Phase 2, tests added throughout)
```

Phases 0-3 can be done as a single YOLO session (types + compiler + adapters).
Phase 4-5 is the second session (generator + wiring).
Phase 6-7 follow after real-world validation.

---

## New Files Summary

| File                                                       | Purpose                              |
| ---------------------------------------------------------- | ------------------------------------ |
| `tools/lib/design-brief-types.ts`                          | Zod schema + TypeScript types        |
| `tools/lib/design-brief-compiler.ts`                       | Orchestrator: analysis → DesignBrief |
| `tools/lib/design-brief-mappers/map-palette.ts`            | Palette section mapper               |
| `tools/lib/design-brief-mappers/map-typography.ts`         | Typography section mapper            |
| `tools/lib/design-brief-mappers/map-layout.ts`             | Layout section mapper                |
| `tools/lib/design-brief-mappers/map-component-variants.ts` | Component variants mapper            |
| `tools/lib/design-brief-mappers/map-page-blueprints.ts`    | Page blueprints mapper               |
| `tools/lib/design-brief-mappers/map-visual-tone.ts`        | Visual tone mapper                   |
| `tools/lib/design-brief-mappers/index.ts`                  | Barrel export                        |
| `tools/lib/design-brief-renderer.ts`                       | Brief → markdown summary             |
| `tools/lib/design-skills/adapter-types.ts`                 | Adapter interface                    |
| `tools/lib/design-skills/adapter-registry.ts`              | Skill ID → adapter map               |
| `tools/lib/design-skills/adapters/generic-adapter.ts`      | For existing design skills           |
| `tools/lib/design-skills/adapters/stitch-adapter.ts`       | For Stitch MCP                       |
| `tools/lib/design-skills/adapters/impeccable-adapter.ts`   | For Impeccable                       |
| `tools/lib/design-skills/shared-constraints.ts`            | Token rules, animation imports       |
| `tools/lib/design-brief-generator.ts`                      | Brief + skill → theme package        |
| `tools/lib/design-brief-postprocess.ts`                    | Validation pipeline wrapper          |
| `tools/lib/visual-qa-diagnostics.ts`                       | Vision-based diff diagnosis          |
| `tools/generate-from-brief.ts`                             | CLI entry point                      |
| `.claude/commands/pipeline.design-brief.md`                | Slash command skill                  |
| `tools/__fixtures__/briefs/*.json`                         | Test fixtures                        |
| `tools/__fixtures__/analyses/*.json`                       | Analysis fixtures                    |

**Modified files:**
| File | Change |
|------|--------|
| `tools/scaffold-theme-package.ts` | Add optional `briefOverrides` parameter |
| `tools/lib/visual-qa-loop.ts` | Integrate diagnostic step + brief-delta corrections |

---

## Risks

1. **Skill output variance** — Mitigation: strict validation pipeline + QA loop + brief constrains tokens tightly
2. **Page-level extraction fragility** — Mitigation: comment markers + fallback to section-by-section
3. **Brief schema too rigid/too loose** — Mitigation: versioned schema, start strict, relax based on real usage
4. **Vision QA cost** — Mitigation: structural mode first (free), vision only when pixel diff exceeds threshold, cap 3 iterations
5. **`analyse-site.ts` generates unwanted components** — Mitigation: ignore `components/` output, read only `site-analysis.json`
