Implemented plan content for `output/sessions/codex-peer-review/2026-04-17_design-brief-pipeline/codex-plan.md`:

````md
# Codex Peer Review Plan — Design Brief Pipeline

_Date: 2026-04-17_

## 0) Executive approach

Replace clone→theme extraction with a **two-stage deterministic+generative pipeline**:

1. **Deterministic compiler**: `SiteAnalysis + MappedTokens (+ optional vision artifacts)` → validated `DesignBrief` JSON (no AI calls).
2. **Skill-driven generator**: `DesignBrief + selected skill adapter` → generated theme package, then run existing validation/repair + scaffold + visual QA loop.

This keeps “understand design” separate from “create implementation,” supports skill swapping, and makes results reproducible/tunable.

---

## 1) Scope alignment + assumptions check (must do first)

### Why

There are scope tensions in the brief that should be resolved before coding.

### Gaps / assumptions to challenge

1. **“Reuse analyse-site.ts unchanged” vs needing Stage-1 outputs only**
   - If `analyse-site.ts` doesn’t already expose clean machine-readable outputs for `SiteAnalysis` + `MappedTokens` without generating theme code, we need either:
     - a non-breaking wrapper around internals, or
     - a non-breaking flag addition (technically modifies file).
2. **Input contract ambiguity** for `--brief` mode
   - Is the brief always full (`DesignBrief`) or sometimes partial with required enrichment?
3. **Skill runtime mechanics**
   - Some skills are conversational command skills; pipeline needs deterministic invocation contracts and output capture.
4. **Vision artifact provenance**
   - Acceptance says compiler from `SiteAnalysis + MappedTokens`; brief says includes vision analysis. Need canonical source-of-truth fields and fallback chain.
5. **QA correction granularity**
   - Define whether iteration can regenerate only `home.tsx` or must regenerate all homepage sections each cycle.

### Deliverable

- `docs/design-brief-pipeline-decisions.md` (ADR-style decisions and unresolved items).

### Verification gate

- Team sign-off on decisions doc before implementation starts.

---

## 2) Define `DesignBrief` schema + Zod validation

### Create

- `tools/lib/design-brief-types.ts`
- `tools/lib/design-brief-schema.ts`
- `tools/lib/design-brief-schema.test.ts`

### Schema shape (minimum required keys)

- `meta`: `{ briefVersion, generatedAt, sourceUrl?, pipelineVersion, confidenceSummary }`
- `palette`:
  - semantic token intents (brand, surface, text, accent, feedback)
  - contrast expectations and token mapping provenance
- `typography`:
  - font families (heading/body), scale intent, weights, line-height density
- `layout`:
  - spacing rhythm, container widths, section cadence, breakpoint behavior intent
- `componentVariants`:
  - header, footer, hero, cards, CTAs, nav treatment, form style
- `pageBlueprints`:
  - homepage required; includes ordered section intents and content slot contracts (no HTML/CSS)
- `visualTone`:
  - adjectives, do/don’t patterns, motion subtlety, ornament level
- `constraints`:
  - token-only styling, RSC-by-default, package export rules, no `theme()` in CSS, etc.
- `qaTargets`:
  - screenshot references + prioritized fidelity areas

### Zod constraints

- Strict object schemas (`.strict()`), versioned schema.
- No fields allowing raw reference HTML/CSS strings.
- Enum-bounded variant categories where possible.
- Confidence/provenance fields required for fallback transparency.

### Verification gate

- Unit tests pass:
  - valid brief fixture
  - missing required sections fails
  - forbidden HTML/CSS payload rejected
  - backward-compatible version parsing behavior confirmed.

---

## 3) Build deterministic `DesignBrief` compiler

### Create

- `tools/lib/design-brief-compiler.ts`
- `tools/lib/design-brief-compiler.test.ts`
- `tools/lib/design-brief-mappers/`:
  - `map-palette.ts`
  - `map-typography.ts`
  - `map-layout.ts`
  - `map-component-variants.ts`
  - `map-page-blueprints.ts`
  - `map-visual-tone.ts`

### Modify

- `tools/lib/reference-analysis-types.ts` (only if shared type exports needed)
- `tools/lib/analysis-schemas.ts` (if adding parser helpers for source inputs)

### Compiler behavior

- Pure function:
  ```ts
  compileDesignBrief(input: {
    siteAnalysis: SiteAnalysis;
    mappedTokens: MappedTokens;
    vision?: ReferenceAnalysis;
  }): DesignBrief
  ```
````

- Deterministic fallback chain aligns with existing token priority.
- Include provenance trail per major brief section.
- Never calls LLM or external network.

### Edge case handling

- Missing computed styles → fallback to synthesis/vision/defaults with lowered confidence.
- Partial token reconciliation → include unresolved intents in `needsHumanReview`.
- Incomplete page discovery → still output homepage brief with warnings.

### Verification gate

- Golden tests on 3+ fixture analyses (high/medium/poor quality inputs) produce stable JSON snapshots.
- Property test: compiler never emits forbidden HTML/CSS fragments.

---

## 4) Build skill adapter interface + two concrete adapters

### Create

- `tools/lib/design-skills/adapter-types.ts`
- `tools/lib/design-skills/adapter-registry.ts`
- `tools/lib/design-skills/adapters/impeccable-adapter.ts`
- `tools/lib/design-skills/adapters/stitch-adapter.ts`
- `tools/lib/design-skills/prompt-normalizer.ts`
- `tools/lib/design-skills/output-parser.ts`

### Adapter contract

```ts
interface DesignSkillAdapter {
  id: string;
  supports: { interactive: boolean; artifacts: ("tsx" | "css" | "json")[] };
  buildPrompt(brief: DesignBrief, context: GenerationContext): SkillPrompt;
  invoke(prompt: SkillPrompt): Promise<SkillRawOutput>;
  normalize(raw: SkillRawOutput): Promise<GeneratedThemeArtifacts>;
}
```

### Architecture choice

- Keep brief→canonical generation spec generic.
- Keep only prompt phrasing / output parsing skill-specific.
- Enforce common post-processing regardless of skill.

### Verification gate

- Contract tests: both adapters return normalized artifact bundle.
- Smoke test with same brief on both adapters produces parseable outputs.

---

## 5) Implement generator orchestration with existing validators/scaffold

### Create

- `tools/lib/design-brief-generator.ts`
- `tools/lib/design-brief-postprocess.ts`
- `tools/lib/design-brief-artifact-writer.ts`

### Reuse (required)

- From `theme-component-generator.ts`:
  - `autoRepairHexLiterals`
  - `scanForHexLiterals`
  - `validateAndFixTokenClasses`
  - `validateTypeScriptSyntax`
  - `validateTypeScriptSemantic`
- `tools/scaffold-theme-package.ts` for assembly.

### Generation flow

1. Take `DesignBrief + skill + themeName`.
2. Generate homepage + header + footer in one pass.
3. **Freeze header/footer outputs** as canonical assets for future pages.
4. Validate/repair code to token-only classes and TS correctness.
5. Assemble package structure exactly as required.
6. Run `cs-theme-package-validator` and fail fast if not clean.

### Verification gate

- Generated package passes all 15 validator rules.
- Automated check confirms no hex literals remain.
- `index.ts` export constraints and jiti constraints verified.

---

## 6) CLI + pipeline entry points (`--url` and `--brief`)

### Create

- `tools/design-brief-pipeline.ts` (main CLI)
- `tools/lib/design-brief-cli-args.ts`

### CLI contract

- `--url <https://...>`: full pipeline (harvest/analyze → compile brief → generate → QA)
- `--brief <path/to/brief.json>`: skip harvest and compile stage (optional validate-only)
- `--skill <id>` required
- `--theme-name <name>` required
- Optional:
  - `--out-dir`
  - `--qa`
  - `--max-iterations`
  - `--emit-brief <path>`
  - `--dry-run`

### Integration note

- Prefer calling existing analysis pipeline as a black box and reading produced analysis artifacts.
- If unavailable, add minimal compatibility shim (non-breaking) and document exception in ADR.

### Verification gate

- CLI e2e tests for both entry modes.
- Error messages for bad flags/paths/skill IDs are actionable.

---

## 7) Visual QA enhancement and corrective loop

### Modify

- `tools/lib/visual-qa-loop.ts`
- `tools/lib/pipeline-visual-compare.ts`

### Create

- `tools/lib/visual-qa-diagnostics.ts`
- `tools/lib/qa-feedback-to-brief.ts`

### Enhancements

- Add diagnostics output:
  - region heatmap clusters
  - section-level mismatch attribution (hero/nav/cards/footer)
  - likely cause tags (spacing scale, typography weight, contrast, density)
- Feed diagnostics back as **brief deltas** (not raw code patching) for next generation iteration.
- Allow bounded selective regeneration:
  - homepage sections only
  - keep header/footer frozen unless explicitly unlocked.

### Verification gate

- QA run outputs both score and structured diagnostics JSON.
- At least one iterative run shows measurable diff-score improvement.

---

## 8) Deprecation/migration strategy for old clone extraction modules

### Phase-out targets

- `tools/extract-theme.ts`
- `tools/lib/theme-component-templates.ts`
- `tools/lib/clone-section-extractor.ts`
- `tools/lib/clone-css-rule-extractor.ts`
- `tools/lib/clone-entry/design-skill.ts`
- `tools/lib/html-to-jsx-converter.ts`
- `tools/clone-site.ts` (optional retention for baseline capture)

### Approach

1. Mark deprecated modules with warnings + doc pointer.
2. Remove references from default pipeline path.
3. Keep temporary compatibility command for one release window.
4. Delete after parity checks pass.

### Verification gate

- Static grep/dep graph confirms no active imports from deprecated modules in main path.
- Legacy command emits deprecation warning and still works during transition window.

---

## 9) Testing strategy (fast, offline, reproducible)

### Create fixtures

- `tools/__fixtures__/analysis/*.json` (`SiteAnalysis`, `MappedTokens`, optional vision)
- `tools/__fixtures__/brief/*.json`
- `tools/__fixtures__/generated-theme/*`

### Test layers

1. **Unit**: schema, mappers, fallback logic.
2. **Contract**: adapter input/output shape.
3. **Snapshot/golden**: compiler deterministic JSON output.
4. **Integration**: brief→theme generation with mocked skill responses.
5. **E2E lite**: run CLI with fixture brief, scaffold package, validator pass.
6. **Visual QA regression**: stored baseline screenshots + deterministic compare thresholds.

### Verification gate

- CI job matrix:
  - `test:unit`
  - `test:integration`
  - `test:pipeline-fixture`
- No live site dependency for default CI lane.

---

## 10) Implementation sequence with gates

1. Decision ADR and scope lock.
2. Schema/types + tests.
3. Compiler + deterministic fixture tests.
4. Adapter interface + 2 adapters.
5. Generator orchestration + validators/scaffold integration.
6. CLI (`--url`, `--brief`) + e2e fixture runs.
7. Visual QA diagnostics + iterative delta feedback.
8. Deprecation switch-over.
9. Hardening, docs, release notes.

---

## 11) Risks / trade-offs

1. **Skill output variance**
   - Mitigation: strict normalization + validator/repair pipeline + retries.
2. **Overfitting brief schema too early**
   - Mitigation: versioned schema + optional extension block.
3. **Constraint drift (token-only, export rules)**
   - Mitigation: keep all existing validators in critical path.
4. **`analyse-site.ts` integration ambiguity**
   - Mitigation: explicit ADR + compatibility shim if truly required.
5. **QA iteration cost/time**
   - Mitigation: section-scoped regeneration and capped iterations.

---

## 12) Done definition (mapped to acceptance criteria)

- Zod-validated `DesignBrief` includes required fields.
- Deterministic compiler from analysis artifacts, no AI calls.
- Generator outputs package passing all validator rules.
- No hardcoded hex colors remain after post-process.
- At least 2 skills work via adapter interface.
- Visual QA compare integrated with diagnostics and feedback loop.
- CLI supports both `--url` and `--brief`.

```

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-17_design-brief-pipeline/
```
