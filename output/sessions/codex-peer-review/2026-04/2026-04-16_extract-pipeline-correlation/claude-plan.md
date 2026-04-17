# Claude Plan: Source-Agnostic Section Correlation

## Phase 1: Extend CloneSection with Content Signals

**Files:** `tools/lib/clone-section-extractor.ts`

### What

Add content-signal fields to `CloneSection` by calling the existing `classifySection()` from `html-structure-analyzer.ts`:

```typescript
export interface CloneSection {
  index: number;
  tag: string;
  headingText?: string;
  html: string;
  cssClasses: string[];
  // New fields:
  estimatedCategory: ComponentCategory; // from classifySection()
  hasForm: boolean;
  hasImages: boolean;
  imageCount: number;
  charCount: number; // html.length — for spacer detection
  keywords: string[]; // extracted from visible text (see below)
}
```

The `keywords` field contains source-agnostic content keywords extracted by stripping HTML tags and scanning for common section indicator words: "speaker", "sponsor", "volunteer", "subscribe", "newsletter", "blog", "about", "contact", "gallery", "photo", "team", "testimonial", "review", "pricing", "faq", "schedule", "event". This is a flat word list — no NLP, no CMS assumptions.

### Verification

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Should now show category + keywords for each section
```

---

## Phase 2: Multi-Signal Correlation Algorithm

**Files:** `tools/lib/clone-section-extractor.ts`

### What

Replace the current 2-step correlation (heading match → index fallback) with a scored multi-signal algorithm:

```
For each blueprint × each unmatched section:
  score = 0

  1. Heading text match (existing):     +50 if blueprint.name substring matches section.headingText
  2. Category match (new):              +30 if blueprint.category === section.estimatedCategory
  3. Keyword match (new):               +20 per keyword overlap (blueprint.purpose words ∩ section.keywords)
  4. Content shape match (new):         +15 if form presence matches (blueprint has form slots ↔ section.hasForm)
                                        +15 if image density matches (blueprint has image slots ↔ section.hasImages)
  5. Tag match (semantic):              +10 if blueprint.category==="Navigation" and section.tag==="header"
                                        +10 if blueprint.category==="Footer" and section.tag==="footer"
  6. Spacer penalty:                    -40 if section.charCount < 300

  Best match wins. Tie-breaking: prefer lower section.index (document order).
  Minimum threshold: score must be >= 20 to match (prevents garbage matches).
```

Each blueprint gets matched to the highest-scoring unmatched section. Once a section is claimed, it's removed from the pool. Process blueprints in document order (by `referenceSection` or blueprint index).

### Confidence scoring

Map total score to confidence:

- `>= 60`: high confidence
- `>= 30`: medium confidence
- `>= 20`: low confidence
- `< 20`: no match (leave blueprint un-enriched)

Log each match with score breakdown:

```
[extract] CtaYellowBand → section 3 (score: 70, heading: +50, category: +0, keywords: +20) [high]
[extract] CtaGreenBand → section 6 (score: 30, heading: +0, category: +30, keywords: +0) [medium]
```

### How keyword matching works

Blueprint side: extract keywords from `blueprint.purpose` and `blueprint.contentSlots`:

- "High-visibility call-to-action band for speaker applications" → ["speaker", "call"]
- contentSlots: ["heading", "bodyText", "ctaButton"] → ["cta"]

Section side: already extracted in Phase 1 from visible text content.

Score: +20 per overlapping keyword, capped at +40.

### Verification

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Should show score breakdown for each match
# CtaGreenBand should no longer match section 6 (newsletter section)
```

---

## Phase 3: Handle Mega-Sections

**Files:** `tools/lib/clone-section-extractor.ts`, `tools/lib/html-structure-analyzer.ts`

### What

Some websites have a single `<section>` that contains multiple logical blocks (e.g. "Call for Speakers" + "Call for Sponsors" + "Call for Volunteers" all under one `<section class="bde-section-17-114">`). The corvus clone has this: section 3 is 14,414 chars and contains three distinct CTA sub-sections.

**Strategy: Sub-section splitting.** After extracting top-level sections, scan each section for internal heading boundaries:

1. Find all `<h2>` and `<h3>` headings within the section
2. If a section has 3+ headings AND the section's charCount > 3000, split it at heading boundaries
3. Each sub-section gets its own `CloneSection` entry with a compound index (e.g. `3.0`, `3.1`, `3.2`)
4. The parent section is still available if no sub-section matches

This handles the mega-section case without CMS assumptions. Any HTML with multiple headings in one section will be split the same way.

**Safety:** Only split when multiple headings are found AND the section is large. Small sections with multiple headings (e.g. a card grid where each card has a heading) should NOT be split — the 3000-char threshold prevents this.

### Verification

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Section 3 (14414 chars, "Call For Speakers") should now show 3 sub-sections:
#   3.0: "Call For Speakers"
#   3.1: "Call For Sponsors"
#   3.2: "Call For Volunteers"
```

---

## Phase 4: Update Diagnostic Tool

**Files:** `tools/diagnose-clone-sections.ts`

### What

Update the diagnostic to show the new signals and scoring:

```
=== Clone Section Diagnostic: corvus ===

--- Extracted 11 sections (+ 3 sub-sections) ---

Idx  | Tag     | Category    | Heading                  | Chars | Keywords            | Form | Imgs
-----|---------|-------------|--------------------------|-------|---------------------|------|-----
0    | header  | Navigation  | [none]                   |  1900 | []                  | no   | 1
1    | section | Hero        | [none]                   |   814 | []                  | no   | 0
2    | section | Hero        | Saturday                 |  1418 | [event]             | no   | 1
3    | section | CTA         | Call For Speakers        | 14414 | [speaker, sponsor]  | no   | 8
 3.0 | (sub)   | CTA         | Call For Speakers        |  4800 | [speaker]           | no   | 4
 3.1 | (sub)   | CTA         | Call For Sponsors        |  5100 | [sponsor]           | no   | 4
 3.2 | (sub)   | CTA         | Call For Volunteers      |  4500 | [volunteer]         | no   | 0
...

--- Correlation (scored) ---

Blueprint            | Match | Idx | Score | Breakdown                              | Confidence
---------------------|-------|-----|-------|----------------------------------------|----------
NavDarkBand          | YES   |   0 | 40    | tag:+10, category:+30                  | medium
HeroHeadlineColoured | YES   |   1 | 30    | category:+30                           | medium
HeroEventBanner      | YES   |   2 | 50    | heading:+50                            | high
CtaYellowBand        | YES   | 3.0 | 70    | heading:+50, keywords:+20              | high
CtaBlueBand          | YES   | 3.1 | 50    | heading:+0, keywords:+20, category:+30 | high
CtaGreenBand         | YES   | 3.2 | 50    | heading:+0, keywords:+20, category:+30 | high
...
```

### Verification

```bash
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# Output should be readable, all scores shown
```

---

## Phase 5: Integration & Verification

**Files:** `tools/extract-theme.ts` (logging only), all test files

### What

1. Add score logging to the main `extract-theme.ts` translate pass (after `enrichBlueprintsForPage`)
2. Run the full translate pipeline on corvus to verify the correlation produces correct matches:

```bash
npx tsx tools/extract-theme.ts --clone corvus --pass translate --out /tmp/corvus-test-v2
```

3. Compare the component quality against the Phase 2 results from the retranslate session
4. Run `pnpm type-check` to verify no breakage

### Verification

```bash
pnpm type-check
npx tsx tools/diagnose-clone-sections.ts --clone corvus
# CtaGreenBand should now match a volunteer section, not a footer
# Content-split-about should match an about section, not a newsletter form
```

---

## Risks & Trade-offs

1. **Keyword list is English-only.** The hardcoded keyword list ("speaker", "sponsor", etc.) won't work for non-English sites. Mitigation: keywords are one signal among many — category and heading matching still work. For future: extract keywords from the blueprint's purpose field (which is always English, generated by Claude) rather than from the HTML text.

2. **Sub-section splitting is heuristic.** Splitting at heading boundaries may produce fragments that are too small or split in the wrong place. Mitigation: the 3000-char threshold and 3+ heading requirement prevents over-splitting. Sub-sections are candidates alongside the parent, so the algorithm can use whichever matches better.

3. **Scoring weights are hand-tuned.** The weights (50, 30, 20, etc.) were estimated from the corvus test case. They may need adjustment for other sites. Mitigation: log the full score breakdown so weights can be tuned empirically across multiple clones.

4. **Performance.** The N x M scoring is O(blueprints \* sections). With typical homepages having 8-15 sections and 5-12 blueprints, this is <200 comparisons — negligible. Sub-section splitting adds at most 2-3x sections.
