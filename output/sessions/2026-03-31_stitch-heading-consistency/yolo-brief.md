# YOLO Implementation Brief: Stitch Pipeline — Cross-Page Heading Consistency

**Branch:** feature/stitch-heading-consistency (created from develop)
**Session spec:** output/sessions/2026-03-31_stitch-heading-consistency/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The `pipeline.stitch-design` skill generates 5 pages via Stitch AI, but heading typography (H1/H2 weight, size, casing) varies between pages because the `designMd` sent to Stitch is a bare-bones brand brief with no typography specification. Stitch fills the gap independently per page, producing inconsistent results. The fix has three layers: enrich `designMd` via the `stitch-design-taste` skill, extract home page heading classes and inject them as hard constraints into remaining page prompts, and add a post-generation drift report with an optional normaliser script.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier | Alias | Cost (in/out per MTok) | Use for |
|------|-------|----------------------|---------|
| Opus | `opus` | $15 / $75 | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15 | Standard implementation — file edits, feature wiring, most phases |
| Haiku | `haiku` | $0.25 / $1.25 | Mechanical tasks: find-replace, import additions, grep checks, content validation |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/stitch-heading-consistency   # create feature branch from develop
pnpm type-check   # must be clean before starting
```

---

## Phase 1 — Enrich Step 2b `designMd` in the pipeline skill

**Goal:** Replace the minimal `designMd` construction block in `pipeline.stitch-design.md` (currently lines ~170–191) with a three-part block: brand identity (same as now), taste-informed design system (invoked dynamically), and a static fallback typography contract (used if taste skill invocation fails).

**Model:** sonnet — requires careful reading of the existing pipeline structure and precise rewriting of the `designMd` block without breaking surrounding steps.

**Files modified:**
- `.claude/commands/pipeline.stitch-design.md`

**What to change:**

Read the file first. Find the `designMd` construction block in Step 2b (the markdown code block that starts with `# Brand Identity`). Replace the entire `designMd` construction instruction with the following:

---

**Construct `designMd`** using three parts:

**Part A — Brand Identity** (same variables as before):

```markdown
# Brand Identity

Company: $COMPANY_NAME
Trade: $TRADE
[If $LOCATION provided:] Location: $LOCATION
[If $TAGLINE provided:] Tagline: $TAGLINE
[If $LOGO_DESC provided:] Logo: $LOGO_DESC

# Content

[If $SERVICES_LIST provided:] Services offered: $SERVICES_LIST
[If $PHONE provided:] Phone: $PHONE
```

**Part B — Taste-informed design system (primary path):**

Before calling `create_design_system`, invoke the `stitch-design-taste` skill with the following parameters to generate a design system brief calibrated for this project:

- Project: $COMPANY_NAME — a $TRADE business
- Primary colour: $PRIMARY_COLOR (if provided)
- **Local business dial overrides (use these — do not use the skill's defaults):**
  - Creativity: 4
  - Density: 5
  - Variance: 3
  - Motion Intent: 2
- Request only sections: 2 (Color Palette), 3 (Typography Rules), 4 (Component Stylings), 6 (Layout Principles), and 9 (Anti-Patterns)
- Omit: Hero inline image technique, motion philosophy section, dashboard constraints — these are SaaS patterns inappropriate for local service businesses

Store the taste skill output as `$TASTE_DESIGN_BLOCK`.

**Part C — Static fallback typography contract:**

If `$TASTE_DESIGN_BLOCK` is empty or the skill invocation was not successful, use this embedded block instead:

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

**Final `designMd`** = Part A + (Part B `$TASTE_DESIGN_BLOCK` if non-empty, else Part C)

Before calling `create_design_system`, log the full `designMd` string to the terminal so it can be reviewed.

---

```bash
# Verification gate — STOP if this fails
# After editing the file, confirm the new designMd block is present:
grep -n "Taste-informed design system" .claude/commands/pipeline.stitch-design.md
grep -n "Static fallback typography contract" .claude/commands/pipeline.stitch-design.md
grep -n "Typography System" .claude/commands/pipeline.stitch-design.md
grep -n "Dial overrides" .claude/commands/pipeline.stitch-design.md
# All 4 must return at least one match
```

**Commit:**
```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): enrich designMd with taste-informed typography system

Replace minimal brand brief designMd with three-part block: brand identity,
taste skill invocation (Creativity 4, Density 5, Variance 3, Motion 2 for
local businesses), and embedded static fallback typography contract.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2 — Extract home heading classes and inject into remaining page prompts

**Goal:** After the home page generates, extract its actual H1/H2 Tailwind class strings from the HTML and inject them as hard literal constraints into all 4 remaining page prompts. This ensures remaining pages reference the actual classes Stitch used on home, not a static contract that may differ.

**Model:** sonnet — requires careful insertion into the existing multi-page generation flow without disrupting the surrounding step structure.

**Files modified:**
- `.claude/commands/pipeline.stitch-design.md`

**What to change:**

Read the file. Find Step 2c-i (home screen generation) — the section ending with `Store the returned screen ID as $HOME_SCREEN_ID`.

**Insert new sub-step 2c-i-extract immediately after** `$HOME_SCREEN_ID` is stored:

---

**2c-i-extract — Extract heading classes from home screen**

After storing `$HOME_SCREEN_ID`, call `get_screen` for `$HOME_SCREEN_ID` to retrieve the home page HTML.

Parse the returned HTML:
- Find the first `<h1>` element and extract its full `class` attribute value → store as `$H1_CLASSES`
- Find all `<h2>` elements, extract their `class` attribute values, pick the most frequently occurring class string (by exact string match) → store as `$H2_CLASSES`

Example of what to extract and store:
```
$H1_CLASSES = "font-headline text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
$H2_CLASSES = "font-headline text-3xl md:text-4xl font-bold tracking-tight leading-snug"
```

If `get_screen` fails, or the HTML contains no `<h1>` or `<h2>` elements, set both `$H1_CLASSES` and `$H2_CLASSES` to empty strings and continue — the static constraints in the per-page prompts below still apply.

Log the extracted values:
```
H1 classes extracted: $H1_CLASSES
H2 classes extracted: $H2_CLASSES
```

---

**Modify Step 2c-ii** — find the existing consistency instruction block (the one starting "MATCH THE HOME PAGE EXACTLY for:"). After the final bullet point in that block, append the following additional instruction:

```
Typography hard constraints — use these exact Tailwind classes on all heading elements:
[If $H1_CLASSES is non-empty:] - All <h1> elements MUST use exactly these classes: $H1_CLASSES
[If $H2_CLASSES is non-empty:] - All <h2> elements MUST use exactly these classes: $H2_CLASSES
[If $H1_CLASSES is empty:] - All <h1> elements: font-extrabold tracking-tight leading-tight, size equivalent to clamp(2.5rem,5vw,4rem). Sentence case. NEVER uppercase.
[If $H2_CLASSES is empty:] - All <h2> elements: font-bold tracking-tight leading-snug, size equivalent to clamp(1.5rem,3vw,2.25rem). Sentence case. NEVER uppercase.

Do not add, remove, or substitute any of these classes. Do not use uppercase, font-black, or any heading modifier not present in the constraints above.
```

---

```bash
# Verification gate — STOP if this fails
grep -n "2c-i-extract" .claude/commands/pipeline.stitch-design.md
grep -n "H1_CLASSES" .claude/commands/pipeline.stitch-design.md
grep -n "H2_CLASSES" .claude/commands/pipeline.stitch-design.md
grep -n "Typography hard constraints" .claude/commands/pipeline.stitch-design.md
# All must return at least one match
```

**Commit:**
```bash
git add .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): extract home heading classes and inject into remaining page prompts

After home screen generates, extract actual H1/H2 Tailwind class strings and
inject as hard literal constraints into all 4 remaining page prompts.
Falls back to static class contract if extraction fails.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3 — Create heading drift report + optional normaliser script

**Goal:** Create `tools/stitch-normalize-headings.mjs` — a Node.js script that parses all 5 generated HTML files, checks H1/H2 class consistency against canonical strings, and either reports drift (default) or rewrites classes to match (with `--enforce`). Then add a new Step 2e to the pipeline that runs this script after `apply_design_system`.

**Model:** sonnet — creating a new script with two modes and careful HTML class manipulation.

**Files modified/created:**
- `tools/stitch-normalize-headings.mjs` (new)
- `.claude/commands/pipeline.stitch-design.md` (new Step 2e)

**Script requirements for `tools/stitch-normalize-headings.mjs`:**

```javascript
// CLI args: --dir <path> --h1 "<classes>" --h2 "<classes>" [--enforce]
//
// Report mode (default):
//   - Parse all *.html files in --dir
//   - For each <h1> and <h2>, check class attribute against --h1 / --h2
//   - Print a table:
//     Page         | H1 consistent? | H2 consistent?
//     home.html    | ✓              | ✓
//     about.html   | ✓              | DRIFT: "font-bold" vs "font-extrabold"
//   - Exit 0 if no drift, exit 1 if any drift found
//
// Enforce mode (--enforce):
//   - Same as above, but rewrite drifted class attributes to canonical string
//   - Write modified HTML back to the same file
//   - Log each change: "about.html <h2> line 47: rewrote classes"
//   - Exit 0 always
//
// Implementation notes:
//   - Use Node built-ins only (fs, path, process) — no npm dependencies
//   - Parse class attributes with simple regex: /class="([^"]+)"/
//   - Compare: extract typography-relevant classes (font-*, text-*, tracking-*,
//     leading-*, uppercase, lowercase, capitalize, normal-case) from both the
//     element and the canonical string. If they differ, it's drift.
//   - In enforce mode: replace ONLY the typography-relevant classes; preserve
//     all other classes on the element (layout, colour, spacing, etc.)
//   - If --h1 or --h2 is empty string, skip that heading level
```

**New Step 2e for `pipeline.stitch-design.md`:**

Add after Step 2d (`apply_design_system`) and before Step 3 (download assets):

---

**2e — Heading drift report**

Run the heading drift report across the 5 downloaded HTML files:

```bash
npx tsx tools/stitch-normalize-headings.mjs \
  --dir output/ingestion/$THEME_NAME-stitch/html \
  --h1 "$H1_CLASSES" \
  --h2 "$H2_CLASSES"
```

Review the output table. If the script exits 0 (no drift), proceed to Step 3.

If the script exits 1 (drift detected), show the drift table to the user and ask:

```
Headings drifted on [N] page(s). Choose:
1. Proceed anyway — accept the drift and continue to Step 3
2. Auto-normalise — rewrite drifted classes to match home page, then continue
3. Stop — I will re-generate the drifted pages manually

Enter 1, 2, or 3:
```

If the user chooses 2, re-run with `--enforce`:
```bash
npx tsx tools/stitch-normalize-headings.mjs \
  --dir output/ingestion/$THEME_NAME-stitch/html \
  --h1 "$H1_CLASSES" \
  --h2 "$H2_CLASSES" \
  --enforce
```

Then continue to Step 3.

If the user chooses 3, STOP with instructions to re-generate the specific pages and then resume from Step 3.

---

```bash
# Verification gate — STOP if this fails
# Confirm script exists and is syntactically valid
node --check tools/stitch-normalize-headings.mjs

# Confirm script accepts args without error (dry run with no html dir)
node tools/stitch-normalize-headings.mjs --dir /nonexistent --h1 "font-bold" --h2 "font-semibold" 2>&1 | head -5
# Should print an error about missing dir, not a syntax/parse error

# Confirm Step 2e is in the pipeline skill
grep -n "2e" .claude/commands/pipeline.stitch-design.md
grep -n "stitch-normalize-headings" .claude/commands/pipeline.stitch-design.md
```

**Commit:**
```bash
git add tools/stitch-normalize-headings.mjs .claude/commands/pipeline.stitch-design.md
git commit -m "$(cat <<'EOF'
feat(pipeline): add heading drift report and optional normaliser (Step 2e)

Create tools/stitch-normalize-headings.mjs — parses generated HTML files
and checks H1/H2 Tailwind class consistency. Report mode (default) shows
drift table and prompts user; enforce mode (--enforce) rewrites classes.
Wired into pipeline as new Step 2e after apply_design_system.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4 — Update documentation

**Goal:** Update `docs/architecture/how-stitch-design-pipeline-works.md` to document the heading consistency mechanism.

**Model:** haiku — documentation update, no code logic.

**Files modified:**
- `docs/architecture/how-stitch-design-pipeline-works.md`

Read the file first. Add or update a section titled "Heading consistency mechanism" explaining:
- Why `designMd` enrichment was added (bare-bones brief gave Stitch no typography constraints)
- That the `stitch-design-taste` skill is invoked inline during Step 2b, with local-business dial overrides (Creativity 4, Density 5, Variance 3, Motion 2) and a static fallback embedded in the pipeline
- The H1/H2 class extraction from the home page (Step 2c-i-extract) and injection into remaining page prompts
- The drift report (Step 2e): what it does, when it triggers, and the three user choices
- The optional normaliser (`tools/stitch-normalize-headings.mjs`) and when to use `--enforce`

```bash
# Verification gate — STOP if this fails
grep -n "Heading consistency" docs/architecture/how-stitch-design-pipeline-works.md
grep -n "stitch-design-taste" docs/architecture/how-stitch-design-pipeline-works.md
grep -n "drift" docs/architecture/how-stitch-design-pipeline-works.md
# All must return at least one match
```

**Commit:**
```bash
git add docs/architecture/how-stitch-design-pipeline-works.md
git commit -m "$(cat <<'EOF'
docs: document heading consistency mechanism in stitch pipeline architecture

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Cost Estimate

| Phase | Model | Est. input tokens | Est. output tokens | Est. cost |
|-------|-------|------------------|--------------------|-----------|
| Phase 1: Enrich designMd | sonnet | ~8k | ~2k | ~$0.054 |
| Phase 2: Heading extraction + injection | sonnet | ~10k | ~1.5k | ~$0.053 |
| Phase 3: Normaliser script + Step 2e | sonnet | ~8k | ~3k | ~$0.069 |
| Phase 4: Docs update | haiku | ~5k | ~0.5k | ~$0.002 |
| **Total** | | **~31k** | **~7k** | **~$0.18** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:
1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm lint && pnpm type-check` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model | Est. input tokens | Est. output tokens | Est. cost |
   |-------|------------------|--------------------|-----------|
   | sonnet | [total] | [total] | $X.XX |
   | haiku | [total] | [total] | $X.XX |
   | **Total** | | | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-03-31_stitch-heading-consistency/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits
[list each commit SHA and message]
```

Confirm this was done in the final report.

## Completed

**Date:** 2026-03-31
**Status:** All phases executed successfully

Implemented three-layer heading consistency for the `pipeline.stitch-design` skill. Phase 1 replaced the minimal `designMd` block with a three-part construction: brand identity (same as before), taste-skill invocation with local-business dial overrides (Creativity 4 / Density 5 / Variance 3 / Motion 2), and an embedded static fallback typography contract used if the taste skill fails. Phase 2 inserted a new `2c-i-extract` step that calls `get_screen` after the home page generates, extracts the actual H1/H2 Tailwind class strings, and injects them as hard constraints into all 4 remaining page prompts — with a static fallback if extraction fails. Phase 2 also added a Step 2e heading drift report that runs `stitch-normalize-headings.mjs` across the 5 HTML files after `apply_design_system`, prompting the user to proceed, auto-normalise, or stop. Phase 3 created `tools/stitch-normalize-headings.mjs` — a Node built-ins-only script with report and `--enforce` modes. One minor deviation: Phases 1, 2, and 2e edits to `pipeline.stitch-design.md` were captured in a single commit rather than two, since all three were applied to the file before the first stage. All verification gates passed; lint and type-check are clean.

### Commits
- `388b73f` feat(pipeline): enrich designMd with taste-informed typography system (includes Phase 2 / Step 2e edits)
- `c9e407f` feat(pipeline): add heading drift report and optional normaliser (Step 2e)
- `705246d` docs: document heading consistency mechanism in stitch pipeline architecture

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work (grep, import additions, find-replace); `model: sonnet` for standard edits; `model: opus` only for deep multi-file reasoning
- The Co-Authored-By line in commits must be `Claude Sonnet 4.6 <noreply@anthropic.com>` (the orchestrator model)
- Do not run `pnpm build` — this touches only pipeline skill files, a new script, and docs; a full build is not needed
