I’ll draft the implementation plan and write it to:

`output/sessions/codex-peer-review/2026-04-16_extract-pipeline-correlation/codex-plan.md`

Then I’ll return the exact synthesize command.

Implemented plan drafted for:

`output/sessions/codex-peer-review/2026-04-16_extract-pipeline-correlation/codex-plan.md`

### `codex-plan.md`

```md
# Codex Peer Review Plan: Source-Agnostic Section Correlation

**Date:** 2026-04-16  
**Scope:** Improve blueprint↔HTML section correlation in extract-theme pipeline using source-agnostic signals.

## 1) Baseline + Refactor Boundary

1. **Capture baseline behavior before edits**
   - Run `tools/diagnose-clone-sections.ts` on:
     - `output/clones/corvus/html/pages/home.html`
     - one non-Breakdance fixture (e.g. polaris clone)
   - Record:
     - matched/unmatched counts
     - heading-match hit rate
     - known misassemblies (`cta-green-band`, `content-split-about`).

2. **Establish correlation module boundary**
   - Keep public API of `correlateWithBlueprints()` intact for backward compatibility.
   - Internally split logic into:
     - candidate signal extraction
     - candidate scoring
     - assignment strategy
     - debug output.

**Files modified**

- `tools/lib/clone-section-extractor.ts`

**Verification gate**

- Existing diagnostics still run pre-change; baseline metrics captured.

---

## 2) Enrich Clone Sections with Analyzer Signals (No new deps)

1. **Extend clone section model (additive, backward-compatible)**
   - Add optional fields to `CloneSection` (or introduce `CorrelatableCloneSection` internal type):
     - `estimatedCategory?: ComponentCategory`
     - `hasImages?: boolean`
     - `hasForm?: boolean`
     - `childCount?: number`
     - `backgroundHint?: string`
     - `textLength?: number`
     - `headingCandidates?: string[]`
     - `isSpacerLike?: boolean`

2. **Reuse existing classifier**
   - Import and use existing logic from `html-structure-analyzer.ts` (`classifySection` + helper-style signals already available there).
   - For each extracted top-level section-like block (`section`, `header`, `footer`, etc.), compute classification and shape signals.

3. **Compute source-agnostic text signals**
   - Normalize visible text (strip tags/scripts/styles).
   - Collect heading candidates (`h1..h6`) rather than only first heading.
   - Build lightweight keyword bag from heading + button/link text + strong/emphasis text.

4. **Spacer detection heuristic**
   - `isSpacerLike = textLength < 300 && !hasForm && imageCount <= 1 && headingCandidates.length === 0`
   - Keep in candidate list but apply strong penalty (do not hard-delete globally).

**Files modified**

- `tools/lib/clone-section-extractor.ts`
- (optional tiny export adjustment) `tools/lib/html-structure-analyzer.ts` if helper exports need widening

**Verification gate**

- `pnpm type-check` passes.
- Diagnostic output shows per-section `estimatedCategory`, `hasForm`, `hasImages`, `textLength`, `isSpacerLike`.

---

## 3) Introduce Multi-Signal Scoring (Replace heading/index-only logic)

1. **Blueprint feature extraction**
   - Derive normalized keyword set from:
     - `blueprint.name` (tokenized PascalCase)
     - `blueprint.purpose`
     - `blueprint.contentSlots`
     - `blueprint.category`

2. **Candidate score components (weighted)**
   - **Category alignment** (strong): exact/near match between blueprint category and section `estimatedCategory`.
   - **Heading similarity**: token overlap between blueprint keywords and section headings.
   - **Keyword overlap**: purpose/content-slot tokens vs section keyword bag.
   - **Shape compatibility**:
     - CTA favors button/link dense segments, optional forms
     - Blog favors article/post/date patterns
     - Stats favors number-heavy/stat patterns
     - Social Proof favors testimonial/review cues
     - Footer/nav prefer `footer`/`header`/`nav` tags where applicable
   - **Penalty terms**:
     - spacer-like penalty
     - obvious category conflict penalty (e.g., Footer section vs CTA blueprint)
   - **Weak positional prior only**:
     - light index proximity bonus as tie-breaker, not primary match signal.

3. **Confidence model**
   - Produce `confidence` (0..1) from normalized weighted score.
   - Keep per-match `scoreBreakdown` for diagnostics:
     - e.g. `{ category: +0.35, heading: +0.12, keywords: +0.09, shape: +0.18, spacer: -0.22 }`.

4. **Assignment strategy**
   - One-to-one greedy with confidence-aware selection:
     - rank all candidate sections per blueprint
     - choose highest non-used candidate above threshold
   - Thresholds:
     - `>= strongThreshold`: accept
     - between weak/strong: accept with warning
     - `< weakThreshold`: leave unmatched (safer than incorrect mapping)

**Files modified**

- `tools/lib/clone-section-extractor.ts`

**Verification gate**

- Corvus known failure cases now choose semantically correct sections in diagnostic run.
- Heading-match no longer sole success path.

---

## 4) Mega-Section Handling (Safe Strategy)

1. **Detect mega-section candidates**
   - Heuristics: many headings, very high text length, multiple repeated CTA blocks, repeated subgroup labels.
2. **Adopt safer acceptance-criteria option**
   - Map mega-section to first highest-confidence matching blueprint.
   - Prevent reusing same mega-section for additional blueprints unless confidence gap is exceptionally high and categories differ materially.
   - Remaining blueprints stay unmatched if no strong alternative.

> This satisfies acceptance criterion option: “map to first matching blueprint and leave rest unmatched.”

3. **Emit explicit diagnostic reason**
   - e.g. `unmatchedReason: "best candidate already consumed as mega-section"`.

**Files modified**

- `tools/lib/clone-section-extractor.ts`

**Verification gate**

- In pages with merged “Call for X” blocks, only one blueprint consumes that HTML block; others are not incorrectly forced by index fallback.

---

## 5) Logging + Diagnostics Upgrade

1. **Add confidence and signal logs in correlator**
   - For each blueprint:
     - selected section index/tag/category/confidence
     - top 3 candidates with score breakdown
     - unmatched reason where applicable.

2. **Update diagnose tool output**
   - Show:
     - section signals (`estimatedCategory`, `hasForm`, `hasImages`, `textLength`, `isSpacerLike`)
     - per-blueprint top candidates and confidence
     - whether match came from strong vs weak threshold
     - mega-section conflict notes.

3. **Keep logging opt-in/noisy-safe**
   - Controlled by a CLI flag or env var used by diagnostics (avoid noisy normal pipeline output).

**Files modified**

- `tools/diagnose-clone-sections.ts`
- `tools/lib/clone-section-extractor.ts`

**Verification gate**

- Diagnostic command clearly explains _why_ each match happened.
- Confidence visible for all matches.

---

## 6) Backward Compatibility + Integration Checks

1. **Ensure output contract unchanged**
   - Existing enrich pipeline still receives expected blueprint fields (`cloneHtmlFragment`, `cloneRelevantCss`, etc.).
   - New debug metadata stays optional/internal.

2. **Run end-to-end checks**
   - `tools/extract-theme.ts --pass translate` on corvus and polaris clones.
   - Confirm generated component set still valid and no runtime/type regressions.

3. **Type safety and linting**
   - `pnpm type-check` must pass.

**Files modified**

- likely only prior files; no new dependencies added.

**Verification gate**

- No TypeScript breaks.
- Existing clones still produce valid outputs.

---

## 7) Validation Criteria Mapping (explicit)

1. **Content-shape signals used:** ✅ category + keyword + form/image + structural cues in scorer
2. **Spacer sections deprioritized/skipped:** ✅ `isSpacerLike` penalty/threshold
3. **Mega-section handling:** ✅ safe-first mapping with explicit unmatched outcomes
4. **Confidence score per match:** ✅ score + confidence + breakdown logged
5. **Diagnostic tool updated:** ✅ top-candidate breakdown + signals
6. **`pnpm type-check` passes:** ✅ mandatory final gate

---

## 8) Risks / Trade-offs

1. **Risk: overfitting weights to corvus**
   - Mitigation: keep weights category-first and semantic, avoid class-name/source cues.
2. **Risk: false unmatched due to strict thresholds**
   - Mitigation: dual-threshold (strong/weak) and log weak matches for tuning.
3. **Risk: regex parsing noise**
   - Mitigation: robust text normalization and conservative penalties rather than hard exclusion.
4. **Trade-off chosen:** no aggressive section splitting
   - Safer correctness over completeness for mega-sections; avoids brittle regex “subsection extraction”.

---

## 9) Optional Follow-up (post-merge, non-blocking)

- Add a tiny fixture-driven correlation evaluation script to score match accuracy across several clones.
- Persist confidence stats to compare future changes and prevent regressions.
```

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-16_extract-pipeline-correlation/
