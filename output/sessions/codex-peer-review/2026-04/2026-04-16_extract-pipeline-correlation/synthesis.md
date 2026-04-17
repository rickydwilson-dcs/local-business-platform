# Implementation Plan: Source-Agnostic Section Correlation

**Date:** 2026-04-16
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

## Key Differences Between Plans

| Aspect                       | Claude                                                | Codex                                                                                              | Synthesised Decision                                                                                                            |
| ---------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Mega-section handling        | Split at heading boundaries into sub-sections         | Map mega-section to first match, leave rest unmatched (safer)                                      | **Codex wins** — splitting is fragile and CMS-dependent. Map to first, leave rest unmatched. Log the reason.                    |
| Score format                 | Integer points (50, 30, 20, etc.)                     | Normalised 0..1 float with named components                                                        | **Claude wins** — integer scores are simpler to debug and tune. Normalised floats add complexity without benefit at this scale. |
| Keyword extraction           | Hardcoded English word list scanned from visible text | Keywords derived from blueprint purpose + contentSlots tokenised, matched against section text bag | **Codex wins** — extracting from blueprint.purpose is source-agnostic and language-flexible. No hardcoded word list needed.     |
| Spacer detection             | Penalty of -40 on charCount < 300                     | `isSpacerLike` boolean (charCount < 300 && !hasForm && imageCount <= 1 && no headings)             | **Codex wins** — the compound heuristic is more robust. A 250-char section with a form is not a spacer.                         |
| Threshold model              | Single minimum (>= 20 to match)                       | Dual threshold (strong/weak) with warnings on weak matches                                         | **Codex wins** — dual threshold gives visibility into borderline matches without hard-failing them.                             |
| CloneSection extension       | Add fields directly to CloneSection                   | Introduce internal `CorrelatableCloneSection` or add optional fields                               | **Claude wins** — keep it simple, add optional fields to CloneSection. No new internal type needed.                             |
| Diagnostic logging verbosity | Top-3 candidates with breakdown                       | Top-3 candidates + opt-in verbose via env var                                                      | **Codex wins** — verbose output behind env var keeps normal pipeline quiet.                                                     |

## Blind Spots Caught

- **Codex caught:** No aggressive section splitting — regex-based heading splitting is fragile across CMS platforms. A `<section>` in Shopify might nest headings differently than Breakdance. The safer approach (first match wins, rest unmatched) avoids misassembly.
- **Codex caught:** Keywords should come from the blueprint (always English, always structured) not from the HTML (may be any language, may have noise). Blueprint.purpose is the reliable source.
- **Claude caught:** The existing `classifySection()` in html-structure-analyzer.ts already produces `ComponentCategory` from content signals — both plans use it, but Claude explicitly called out the import path and function signature.
- **Claude caught:** Sub-section splitting needs a minimum char count threshold to avoid splitting card grids. Even though we're not splitting, this insight informs the mega-section detection heuristic.

---

## Implementation Plan

### Phase 1: Extend CloneSection with Content Signals

**Goal:** Enrich each extracted HTML section with source-agnostic classification signals.
**Files:** `tools/lib/clone-section-extractor.ts`, possibly `tools/lib/html-structure-analyzer.ts` (export widening)

1. Add optional fields to `CloneSection`:

   ```typescript
   estimatedCategory?: ComponentCategory;
   hasForm?: boolean;
   hasImages?: boolean;
   imageCount?: number;
   charCount: number;               // html.length
   headingCandidates?: string[];    // all h1-h6 texts, not just first
   isSpacerLike?: boolean;          // charCount < 300 && !hasForm && imageCount <= 1 && no headings
   ```

2. In `extractCloneSections()`, after extracting each section, call `classifySection()` from html-structure-analyzer to populate `estimatedCategory`, and compute the other fields from the raw HTML using existing helpers (`countImages`, `extractFirstHeading`, etc.).

3. Export any helpers from html-structure-analyzer that aren't already exported (if needed for `hasForm`, `countImages`, etc.).

**Verification:**

```bash
pnpm type-check
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Should show category, charCount, isSpacerLike for each section
```

**Commit:** `feat(pipeline): enrich CloneSection with source-agnostic content signals`

---

### Phase 2: Multi-Signal Scored Correlation

**Goal:** Replace heading-match + index-fallback with a scored multi-signal algorithm.
**Files:** `tools/lib/clone-section-extractor.ts`

1. Add a `scoreMatch()` function that computes an integer score for a (blueprint, section) pair:

   | Signal             | Points             | Condition                                                                                   |
   | ------------------ | ------------------ | ------------------------------------------------------------------------------------------- |
   | Heading text match | +50                | blueprint.name or keywords from blueprint.purpose appear in any section heading candidate   |
   | Category match     | +30                | blueprint.category === section.estimatedCategory                                            |
   | Keyword overlap    | +10 each (max +30) | Words from blueprint.purpose + contentSlots tokenised, matched against section visible text |
   | Content shape      | +15                | Form presence matches (blueprint has form-related slots ↔ section.hasForm)                 |
   | Content shape      | +15                | Image density matches (blueprint has image slots ↔ section.hasImages)                      |
   | Semantic tag       | +10                | Navigation↔header, Footer↔footer tag match                                                |
   | Spacer penalty     | -50                | section.isSpacerLike === true                                                               |

2. Keyword extraction from blueprints:
   - Tokenise `blueprint.purpose` into lowercase words, filter stop words
   - Tokenise `blueprint.contentSlots` names (camelCase → words)
   - Tokenise `blueprint.name` (PascalCase → words)
   - Combine into a unique keyword set

3. Keyword extraction from sections:
   - Strip HTML tags from section.html to get visible text
   - Lowercase, split on whitespace/punctuation
   - Combine with headingCandidates
   - This is the section's keyword bag

4. Assignment: greedy one-to-one matching
   - For each blueprint (in document order), score all unmatched sections
   - Select the highest-scoring section above the weak threshold
   - Mark the section as claimed
   - If no section scores above the weak threshold, leave blueprint un-enriched

5. Dual threshold:
   - Strong: >= 50 (high confidence)
   - Weak: >= 20 (low confidence — accept with warning)
   - Below 20: no match

6. Return enriched blueprints with new optional fields:
   ```typescript
   matchScore?: number;
   matchConfidenceLevel?: 'high' | 'medium' | 'low';
   matchBreakdown?: string;  // human-readable score breakdown for logging
   ```

**Verification:**

```bash
pnpm type-check
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# CtaGreenBand should NOT match section 6 (newsletter)
# Verify score breakdowns make sense
```

**Commit:** `feat(pipeline): multi-signal scored section correlation`

---

### Phase 3: Mega-Section Handling (Safe Strategy)

**Goal:** Prevent mega-sections from being reused by multiple blueprints while ensuring at least the best match gets it.
**Files:** `tools/lib/clone-section-extractor.ts`

1. After scoring, detect mega-section candidates:
   - charCount > 5000 AND headingCandidates.length >= 3

2. When a mega-section is claimed by one blueprint, mark it as consumed. Other blueprints that would have matched it are left un-enriched with a logged reason: `"best candidate already consumed as mega-section by [ComponentName]"`

3. This is the default behaviour from the greedy assignment in Phase 2. The only addition is:
   - Log a specific message when a blueprint's best candidate was a consumed mega-section
   - Track mega-section status in the assignment loop

**Verification:**

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Section 3 (14414 chars, "Call For Speakers") should be claimed by one blueprint
# Other CTAs should either find alternative sections or be left unmatched with logged reason
```

**Commit:** `feat(pipeline): mega-section detection and safe single-assignment`

---

### Phase 4: Update Diagnostic Tool

**Goal:** Show all new signals and scoring in the diagnostic output.
**Files:** `tools/diagnose-clone-sections.ts`

1. Update section table to show: category, charCount, isSpacerLike, hasForm, hasImages, headingCandidates count

2. Update correlation table to show: score, breakdown, confidence level, and for unmatched blueprints: the reason

3. Add verbose mode via `--verbose` flag or `EXTRACT_VERBOSE=1` env var that shows top-3 candidates per blueprint

4. Summary section: matched count, unmatched count, average confidence, mega-section warnings

**Verification:**

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Output is readable and informative
EXTRACT_VERBOSE=1 npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Shows top-3 candidates
```

**Commit:** `feat(pipeline): diagnostic tool shows correlation signals and scores`

---

### Phase 5: Integration & Final Verification

**Goal:** Confirm the pipeline works end-to-end with the new correlation.
**Files:** `tools/extract-theme.ts` (logging), `tools/lib/clone-section-extractor.ts`

1. Add correlation score logging to `extract-theme.ts` after `enrichBlueprintsForPage()`:
   - Log enrichment rate and any unmatched blueprints with reasons
   - Only when `EXTRACT_VERBOSE=1` or in diagnostic mode

2. Run full translate on corvus clone:

   ```bash
   npx tsx tools/extract-theme.ts --clone corvus --pass translate --out /tmp/corvus-correlation-test
   ```

3. Compare results against retranslate session (Phase 2 quality assessment)

4. Final type check:
   ```bash
   pnpm type-check
   ```

**Verification:**

```bash
pnpm type-check
# Corvus correlation: CtaGreenBand no longer misassembled
# Overall enrichment rate >= 90%
```

**Commit:** `feat(pipeline): integrate scored correlation into translate pass`

---

## Risks & Trade-offs

1. **Mega-sections leave blueprints un-enriched.** When 3 CTAs live in one HTML section, only the first gets enriched. The other two fall back to blueprint-only generation (no clone HTML context). This is safer than misassembly but means those components will be less faithful. Mitigation: the blueprint-only prompt still produces reasonable output; the vision blueprint provides layout and purpose info.

2. **Scoring weights are hand-tuned from corvus.** The weights (50, 30, 10, etc.) work for this test case but may need adjustment for other sites. Mitigation: log full score breakdowns so weights can be empirically tuned. The diagnostic tool makes this easy.

3. **Keyword matching is English-biased.** Blueprint purposes are always in English (generated by Claude), but section visible text may be in any language. Mitigation: category matching and content shape matching don't depend on language. Keywords are one signal among several.

4. **No sub-section splitting.** We chose not to split mega-sections because heading-boundary splitting is fragile across CMS platforms. This means some blueprints will be un-enriched. Follow-up: if this becomes a recurring problem, consider a more sophisticated splitting strategy (but only with evidence from multiple clone sources).
