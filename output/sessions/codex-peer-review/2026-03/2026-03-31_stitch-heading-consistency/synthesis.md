# Implementation Plan: Stitch Pipeline — Cross-Page Heading Consistency

**Date:** 2026-03-31
**Status:** Ready for implementation — approved by dual-model peer review
**Source:** Synthesised from Claude and Codex independent plans

---

## Key Differences Between Plans

| Aspect                              | Claude                                                      | Codex                                                                           | Synthesised Decision                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **taste skill integration**         | Dynamic only — invoke skill per run                         | Hybrid: dynamic primary + static fallback block                                 | **Hybrid wins.** If the taste skill is unavailable or produces unexpected output, the pipeline must not fail silently. A static fallback typography contract embedded in the pipeline is both a safety net and a readable spec.                                                                                                                 |
| **Dial values (local business)**    | Creativity 5, Density 5, Variance 5, Motion 3               | Creativity 4, Density 5, Variance 3, Motion 2                                   | **Codex is more conservative on Creativity and Variance.** Agreed: local trade businesses need predictability over expressiveness. Use Creativity 4, Density 5, Variance 3, Motion 2.                                                                                                                                                           |
| **Post-generation normalisation**   | Warn only — show drift table, ask user to decide            | Enforce mode — silently rewrite drifted classes, log changes                    | **Warn first, enforce optionally.** Silent rewriting masks prompt quality. Drift report is the default; normalisation script (`tools/stitch-normalize-headings.mjs`) exists but is opt-in via a `--normalize-headings` flag. This way, if the prompt + designMd improvements work, we never need the normaliser. If they don't, it's available. |
| **Normaliser as a tool**            | No new files — drift check inline in pipeline               | Create `tools/stitch-normalize-headings.mjs` as a script                        | **Codex is right to create a script.** Inline parsing in a `.md` instruction is fragile. A proper Node.js script is testable, auditable, and reusable. Build it.                                                                                                                                                                                |
| **H1/H2 extraction from home HTML** | Extract after home generates, inject into remaining prompts | Not explicitly proposed — relied on designMd + static class contract in prompts | **Claude's extraction approach adds real value.** Getting the actual class strings Stitch chose for home and feeding them back is the most concrete constraint we can give. Codex's static class contract is a good fallback when extraction fails.                                                                                             |

---

## Blind Spots Caught

**Codex caught (Claude missed):**

- The static fallback block is essential — if the taste skill invocation fails mid-pipeline, the whole `designMd` enrichment silently falls back to the old minimal brief. The fallback needs to be an explicit embedded typography contract, not just "continue without it."
- Variance should be lower than 5 for trade businesses. At Variance 5, Stitch still introduces meaningful asymmetry that can produce wild heading treatments on interior pages. Variance 3 is safer and still avoids boring symmetry.
- The normaliser should be a real script, not inline instructions — the pipeline `.md` format is not a reliable parser.

**Claude caught (Codex missed):**

- The H1/H2 literal class extraction from the home page HTML is the most powerful belt-and-braces mechanism. Without it, the per-page prompts reference a static contract that may not match what Stitch actually generated for the home page. If home ends up with `text-6xl font-black`, the static contract saying `font-extrabold text-5xl` creates an inconsistency between home and the other 4 pages — the opposite of the goal.
- The drift report should be interactive (ask user to proceed or re-generate), not just logged. Silent normalisation is fine once the prompt quality is proven; until then, user visibility matters.

---

## Implementation Plan

### Phase 1 — Enrich `designMd` in Step 2b

**File:** `.claude/commands/pipeline.stitch-design.md`

**Replace** the existing `designMd` construction block (currently lines ~170–191) with a three-part block:

**Part A — Brand Identity** (unchanged structure):

```markdown
# Brand Identity

Company: $COMPANY_NAME
Trade: $TRADE
[If $LOCATION:] Location: $LOCATION
[If $TAGLINE:] Tagline: $TAGLINE
[If $LOGO_DESC:] Logo: $LOGO_DESC

# Content

[If $SERVICES_LIST:] Services offered: $SERVICES_LIST
[If $PHONE:] Phone: $PHONE
```

**Part B — Taste-informed design system (primary path):**

Add instruction before calling `create_design_system`:

> Invoke `stitch-design-taste` with the following context to generate a design system brief for this project:
>
> - Project: $COMPANY_NAME — a $TRADE business
> - Primary colour: $PRIMARY_COLOR (if provided)
> - **Local business dial overrides (do not use skill defaults):**
>   - Creativity: 4
>   - Density: 5
>   - Variance: 3
>   - Motion Intent: 2
> - Request only: sections 2 (Color Palette), 3 (Typography Rules), 4 (Component Stylings), 6 (Layout Principles), and 9 (Anti-Patterns)
> - Omit: Hero inline image technique, motion philosophy, dashboard constraints — these are SaaS patterns inappropriate for local service businesses
>
> Store the output as `$TASTE_DESIGN_BLOCK`.

**Part C — Static fallback typography contract (embedded in pipeline, used if taste invocation fails or produces no output):**

```markdown
## Typography System

**Display/Headlines:** Track-tight (-0.025em), weight-driven hierarchy (700–900), leading 1.1. Not screaming — hierarchy through weight, not excessive size.
**Body:** Weight 400, leading 1.65, max 65 characters per line.
**Scale:** H1 at clamp(2.5rem, 5vw, 4rem). H2 at clamp(1.5rem, 3vw, 2.25rem). Body at 1rem.

**H1 rules:** font-weight 800–900, sentence case, tracking -0.025em, leading 1.1. NEVER uppercase.
**H2 rules:** font-weight 700, sentence case, tracking -0.015em, leading 1.2. NEVER uppercase.
**Eyebrow labels only** may use uppercase — never H1 or H2.

**Banned:**

- Inter font (use Geist, Work Sans, Space Grotesk, or the specified $HEADLINE_FONT)
- ALL CAPS on headings
- Gradient text on headings
- Decorative outline or shadow treatments on headings
- Different heading weights or casings across pages

## Anti-Patterns

- No generic 3-column equal card layouts — use 2-column zig-zag or asymmetric grids
- No overlapping elements — every element in its own spatial zone
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No pure black (#000000) — use off-black or dark grays
- No neon/oversaturated accents
- No fake round numbers (99.99%, 50%) — use organic data
- No emojis anywhere
```

**Construct `designMd`** as: `Part A + ($TASTE_DESIGN_BLOCK if non-empty, else Part C)`

**Verification gate:** Before calling `create_design_system`, log the full `designMd` to the session output. Confirm it contains a Typography Rules section (or equivalent) and an Anti-Patterns section.

---

### Phase 2 — Extract home page heading classes and inject into remaining page prompts

**File:** `.claude/commands/pipeline.stitch-design.md`

**Add new sub-step 2c-i-extract** (after home page is generated, before generating remaining 4):

> After `$HOME_SCREEN_ID` is stored, call `get_screen` for `$HOME_SCREEN_ID` to retrieve the home page HTML.
>
> Parse the HTML:
>
> - Find the first `<h1>` element and extract its `class` attribute → store as `$H1_CLASSES`
> - Find all `<h2>` elements, extract their `class` attributes, pick the most frequently occurring string → store as `$H2_CLASSES`
>
> Example result: `$H1_CLASSES = "font-headline text-5xl md:text-7xl font-extrabold tracking-tight"`
>
> If `get_screen` fails or no h1/h2 elements are found: set `$H1_CLASSES` and `$H2_CLASSES` to empty strings and continue — the static contract in the prompts below still applies.

**Modify Step 2c-ii** — after the existing "MATCH THE HOME PAGE EXACTLY" block, append:

```
Typography hard constraints — use these exact Tailwind classes on all heading elements:
[If $H1_CLASSES non-empty:] - All <h1> elements MUST use exactly: $H1_CLASSES
[If $H2_CLASSES non-empty:] - All <h2> elements MUST use exactly: $H2_CLASSES
[If $H1_CLASSES empty:] - All <h1> elements: font-extrabold tracking-tight leading-tight, size clamp(2.5rem,5vw,4rem). Sentence case. NEVER uppercase.
[If $H2_CLASSES empty:] - All <h2> elements: font-bold tracking-tight leading-snug, size clamp(1.5rem,3vw,2.25rem). Sentence case. NEVER uppercase.

Do not add, remove, or substitute any of these classes. Do not use uppercase, font-black, or any heading modifier not present in the constraints above.
```

**Verification gate:** After submitting each of the 4 remaining page generation calls, log which heading class constraints were injected into that prompt.

---

### Phase 3 — Post-generation drift report (and optional normaliser)

**File (new):** `tools/stitch-normalize-headings.mjs`

Create a Node.js script that:

1. Accepts `--dir output/ingestion/$THEME-stitch/html` and `--h1 "$H1_CLASSES"` and `--h2 "$H2_CLASSES"` arguments
2. Parses all HTML files in the directory
3. For each `<h1>` and `<h2>`, checks the class attribute against the canonical strings
4. In **report mode** (default): prints a drift table to stdout showing which pages/elements deviate
5. In **enforce mode** (`--enforce`): rewrites the class attribute to the canonical string, logs each change, and writes the modified HTML back

**File:** `.claude/commands/pipeline.stitch-design.md`

**Add new Step 2e** — after `apply_design_system` (Step 2d), before Step 3 (download assets):

> Run the heading drift report:
>
> ```bash
> npx tsx tools/stitch-normalize-headings.mjs \
>   --dir output/ingestion/$THEME_NAME-stitch/html \
>   --h1 "$H1_CLASSES" \
>   --h2 "$H2_CLASSES"
> ```
>
> Review the output table. If any pages show drift:
>
> - WARN the user with the drift table
> - Ask: "Headings drifted on [N] pages. Options: (1) Proceed anyway, (2) Auto-normalise and proceed, (3) Re-generate drifted pages."
> - If user chooses auto-normalise, re-run with `--enforce`
> - If user chooses re-generate, STOP and instruct them to re-run those specific screens manually, then resume from Step 3

**Verification gate:** Confirm drift report script runs without error. Confirm report table is printed. Confirm enforce mode modifies only heading typography classes and no other attributes.

---

### Phase 4 — Update documentation

**File:** `docs/architecture/how-stitch-design-pipeline-works.md`

Add or update a section: "Heading consistency mechanism" explaining:

- Why `designMd` enrichment was added and what the taste skill provides
- Local business dial values (4/5/3/2) and their rationale
- The H1/H2 class extraction and injection pattern
- The drift report and optional normaliser

---

## Files Changed

| File                                                    | Change type | What changes                                                                                                         |
| ------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- |
| `.claude/commands/pipeline.stitch-design.md`            | Modify      | Step 2b `designMd` block (enriched), new Step 2c-i-extract, Step 2c-ii heading constraints, new Step 2e drift report |
| `tools/stitch-normalize-headings.mjs`                   | Create      | Heading drift report + optional enforce-mode normaliser                                                              |
| `docs/architecture/how-stitch-design-pipeline-works.md` | Modify      | New section on heading consistency mechanism                                                                         |

---

## Verification End-to-End

1. Run `/pipeline.stitch-design --trade "plumber" --name "Test Plumbing Co" --colors "#1a5276"`
2. Confirm logged `designMd` includes Typography Rules and Anti-Patterns sections
3. Confirm H1/H2 class strings extracted from home screen are logged before remaining pages generate
4. Confirm per-page prompts for about/services/contact/service-detail include the extracted heading constraints
5. Confirm Step 2e drift report runs and prints a table
6. Open test site — inspect H1 and H2 classes across all 5 pages — all should match

---

## Implementation Notes

- The drift report should be the feedback loop for prompt quality. If Phase 1 + 2 work well, the drift table should show 0 deviations. Track this over runs to know when the pipeline has matured enough to make enforce mode the default.
- The `--enforce` flag on the normaliser is intentionally not the default, to avoid hiding Stitch's non-determinism. Once the pipeline reliably produces 0 drift, consider making enforce mode the default with silent logging.
- The static fallback typography contract (Part C) in the pipeline should be reviewed periodically — it should reflect what the taste skill would generate for a "typical" local business, so they stay in sync.
