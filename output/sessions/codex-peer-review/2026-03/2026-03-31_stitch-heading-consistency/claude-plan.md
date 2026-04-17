# Claude's Plan: Stitch Pipeline — Cross-Page Heading Consistency

**Date:** 2026-03-31
**Author:** Claude (independent — written before seeing Codex plan)

---

## My Assessment

This is primarily a `designMd` content problem, not an architectural problem. The pipeline skill file is a `.md` instruction document that Claude executes — so fixing it means rewriting ~20 lines in Step 2b and adding ~5 lines to Step 2c-ii. No new tooling, no new packages.

The `stitch-design-taste` skill should be invoked dynamically (not static copy-paste), because the tone and dial values need to vary by trade. A plumber gets different dials than a signage studio. The taste skill is designed for this — it takes a project description and generates a calibrated DESIGN.md.

Post-processing HTML normalisation is a useful safety net but not the primary fix. I'd add it as a lightweight verification step, not a correction step — if Stitch still drifts after the richer designMd, we log which pages drifted so the user knows, but we don't silently rewrite classes (that would mask a problem in the prompt).

---

## Implementation Plan

### Phase 1: Enrich Step 2b — Replace minimal `designMd` with taste-informed block

**File modified:** `.claude/commands/pipeline.stitch-design.md`

**Change:** Step 2b currently constructs a minimal `designMd`. Replace the `designMd` construction with a two-part block:

**Part A — Brand Identity** (same as now, keep existing variables):

```markdown
# Brand Identity

Company: $COMPANY_NAME
Trade: $TRADE
[Location/Tagline/Logo if provided]

# Content

[Services/Phone if provided]
```

**Part B — Design System (new, via taste skill):**

Before Step 2b executes, the pipeline now invokes `stitch-design-taste` to generate a design block calibrated for the specific trade. The instruction to Claude is:

> Before calling `create_design_system`, use the `stitch-design-taste` skill to generate a design system brief for this project. Pass it the following:
>
> - Trade: $TRADE
> - Company: $COMPANY_NAME
> - Primary colour: $PRIMARY_COLOR (if provided)
> - **Dial overrides for local service businesses:**
>   - Creativity: 5 (balanced — not generic SaaS, not expressive editorial)
>   - Density: 5 (balanced — service sites need content density for trust signals)
>   - Variance: 5 (moderate — enough asymmetry to avoid boring symmetry, not artsy chaos)
>   - Motion Intent: 3 (restrained — local business clients don't want cinematic animation)
> - Output only sections 2 (Color Palette), 3 (Typography Rules), 4 (Component Stylings), 6 (Layout Principles), and 9 (Anti-Patterns) — omit motion philosophy and hero inline image technique (those are SaaS patterns)

Append the taste skill output to the brand identity block to form the full `designMd`.

**Why dial values 5/5/5/3:**

- Creativity 5: Produces clean, professional layouts with personality — right for a local business that wants to look premium but not edgy
- Density 5: Service pages need to communicate trust, accreditations, services — can't be gallery-airy
- Variance 5: Avoids the boring 3-column equal grid without going artsy-chaotic
- Motion Intent 3: Local business clients (and their CMS editors) are conservative; cinematic choreography reads as distracting

**Verification gate:** Log the full `designMd` string before calling `create_design_system`. Confirm it includes a Typography Rules section and an Anti-Patterns section.

---

### Phase 2: Harden Step 2c-ii — Add literal heading class constraints to per-page prompts

**File modified:** `.claude/commands/pipeline.stitch-design.md`

**Change:** The existing Step 2c-ii consistency instruction references the home screen ID and asks Stitch to "MATCH THE HOME PAGE EXACTLY for typography." This is a natural language request that Stitch may interpret loosely.

After Step 2c-i (home page generated), add a new extraction sub-step:

**New Step 2c-i-extract:**

> After the home screen is generated and before generating remaining pages, call `get_screen` for `$HOME_SCREEN_ID` to retrieve its HTML. Parse the HTML to extract:
>
> - The Tailwind class string on the first `<h1>` element → store as `$H1_CLASSES`
> - The most common Tailwind class string on `<h2>` elements (by frequency) → store as `$H2_CLASSES`
>
> Example: `$H1_CLASSES = "font-headline text-5xl md:text-7xl font-extrabold tracking-tight"`
>
> If extraction fails or no h1/h2 found, skip and continue with the consistency instruction only.

Then in the Step 2c-ii consistency block, append after the existing "MATCH THE HOME PAGE EXACTLY" instruction:

```
Typography hard constraints (use these exact Tailwind classes):
- All H1 elements: $H1_CLASSES
- All H2 elements: $H2_CLASSES
Do not deviate from these class strings. Do not add font-bold, font-black, uppercase, or other modifiers not present in these strings.
```

**Why both designMd AND literal class injection:**

- `designMd` sets the design system intent (Stitch should generate pages that conform to it)
- Literal class injection in the per-page prompt is a harder runtime constraint (Stitch is explicitly told what classes to use on this specific generation)
- Belt-and-braces: if Stitch ignores the design system brief, the literal constraint in the page prompt catches it

**Verification gate:** After all 5 screens are generated, log which H1/H2 class strings appear in each HTML file. Report any pages that deviate from `$H1_CLASSES` / `$H2_CLASSES`.

---

### Phase 3: Add lightweight post-generation drift report (not silent fix)

**File modified:** `.claude/commands/pipeline.stitch-design.md`

**Change:** After Step 2d (`apply_design_system`), add a new Step 2e:

**New Step 2e — Heading drift report:**

> After `apply_design_system` completes, parse all 5 downloaded HTML files (from `output/ingestion/$THEME_NAME-stitch/html/`) and report heading class consistency:
>
> For each file, extract all `<h1>` and `<h2>` class strings. Compare against `$H1_CLASSES` and `$H2_CLASSES`.
>
> Output a table:
>
> ```
> Page         H1 consistent?   H2 consistent?
> home.html    ✓                ✓
> about.html   ✓                DRIFT: font-bold vs font-extrabold
> services.html ✓               ✓
> ...
> ```
>
> If any drift is found: WARN the user, show the drift table, ask: "Headings drifted on [pages]. Proceed anyway, or re-generate those pages?" Do not silently fix.

**Why warn rather than silently fix:**

- Silent class rewriting masks the problem — if Stitch keeps drifting, we want to know and improve the prompt, not paper over it
- The user may want to manually review the drifted page anyway
- Silent fixing could introduce semantic errors (e.g. `font-black` and `font-extrabold` are visually similar but not identical)

---

### Phase 4: Document the changes

**File modified:** `docs/architecture/how-stitch-design-pipeline-works.md`

Add a section explaining:

- Why `designMd` enrichment matters
- That the taste skill is invoked inline during Step 2b
- The local business dial values and their rationale
- The heading extraction and literal class injection pattern
- The drift report step

---

## Risks and Trade-offs

| Risk                                                                                                                         | Likelihood                                          | Mitigation                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Taste skill invocation adds latency to Step 2b                                                                               | Low — it's a Claude reasoning step, not an API call | Acceptable overhead                                                                                     |
| Stitch `get_screen` doesn't return HTML with parseable class strings                                                         | Medium — API may return a different format          | Make extraction optional; fall back gracefully                                                          |
| Literal H1/H2 class constraints conflict with the page-specific design (e.g. a Service Detail page hero H1 should be larger) | Medium                                              | Use `$H1_CLASSES` as default; allow per-section override language in the prompt                         |
| Taste skill dial values too generic across all trades                                                                        | Low                                                 | Dials are baked into the pipeline with rationale; can be overridden via future `--creativity` etc. args |
| User frustrated by drift warning interruption                                                                                | Low — this is opt-in awareness                      | Warning can be demoted to a log line if user prefers                                                    |

## Files Modified

1. `.claude/commands/pipeline.stitch-design.md` — primary change (Step 2b rewrite, Step 2c-ii addition, new Step 2e)
2. `docs/architecture/how-stitch-design-pipeline-works.md` — documentation

## Verification End-to-End

1. Run `/pipeline.stitch-design --trade "plumber" --name "Test Plumbing Co" --colors "#1a5276"`
2. Confirm `designMd` logged before `create_design_system` includes Typography Rules section
3. Confirm H1/H2 classes extracted from home screen and logged
4. After all 5 screens, confirm drift report table is printed
5. Open test site → inspect heading classes across pages → all should match
