# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-03-31_stitch-heading-consistency/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-03-31_stitch-heading-consistency/
```

---

## Brief: Stitch Pipeline — Cross-Page Heading Consistency

**Date:** 2026-03-31
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The `pipeline.stitch-design` skill generates 5 pages via Stitch AI. Heading typography (H1/H2 size, weight, casing) varies significantly between pages even with a consistency instruction in the prompt. The `apply_design_system` step only enforces font family, colour, and border radius — it cannot enforce typography scale (weight, size, letter-spacing, text-transform). Each page's heading treatment is decided independently by Stitch's LLM.

**Observed example (Nova theme run):** Contact page uses bold + italic + sentence case; Service page uses uppercase heavy H1; Services listing uses lighter mixed-case H2; About page uses ALL CAPS with a different treatment — all from the same pipeline run.

**Root cause:** The `designMd` passed to `create_design_system` is a bare-bones brand brief (company name, trade, services, phone, 3 bullet design principles). It contains no typography specification — no weights, no sizes, no casing rules, no anti-patterns. Stitch fills the gap with its own defaults, and those defaults vary per page.

**Key discovery:** A `stitch-design-taste` skill is already installed at `~/.claude/skills/stitch-design-taste/`. It generates `DESIGN.md` files with explicit typography rules: weight range (700–900), tracking (`-0.025em`), leading (`1.1`), fluid scale (`clamp(2.25rem, 5vw, 3.75rem)`), anti-pattern bans (Inter banned, neon accents banned, overlapping elements banned). This skill is not wired into the pipeline at all.

### Goals

1. Wire `stitch-design-taste` into `pipeline.stitch-design` so that the `designMd` sent to `create_design_system` includes explicit typography rules
2. Adapt the taste skill output to local business context (trade sites need trust/conversion focus, not default SaaS/dashboard aesthetic)
3. Ensure H1 and H2 heading hierarchy (weight, size, casing) is explicitly defined in `designMd` so Stitch has no ambiguity per page
4. Decide whether a post-generation HTML normalisation step is also needed, or whether a rich `designMd` is sufficient

### Non-Goals

- Rebuilding the `stitch-design-taste` skill itself
- Enforcing heading consistency within a single page (intra-page variation is acceptable)
- Changing the Stitch design system API
- Fixing already-generated test sites (new pipeline runs only)

### Acceptance Criteria

- Given a completed pipeline run, when inspecting all 5 HTML files in `output/ingestion/$THEME-stitch/html/`, then H1 and H2 heading classes (weight, size, text-transform) are consistent across pages
- Given the pipeline skill file, when reading Step 2b, the `designMd` construction includes explicit typography rules, not just brand identity
- Given a pipeline run for a trade business, taste skill dials are tuned for local service business context

### Constraints

1. **`stitch-design-taste` is a Claude skill** — it runs as part of Claude's execution context. The pipeline can either (a) invoke it inline during Step 2b, or (b) embed a static "local business" typography block derived from the taste template directly in the pipeline skill file
2. **`apply_design_system` cannot enforce typography scale** — this remains a prompt-level problem; `designMd` enrichment is the primary fix
3. **Stitch non-determinism** — even with a rich `designMd`, Stitch may still vary per page. A post-processing HTML normalisation step should be evaluated as a safety net
4. **Local business aesthetic** — taste skill defaults target premium SaaS/creative (Creativity 8, Variance 8). For trade businesses (plumbers, electricians, signage studios), the right dials are lower: higher trust/conversion focus, less variance, more predictable layout
5. **Pipeline skill is a Claude `.md` file** — all new steps must be natural language instructions Claude can follow at runtime; no compiled tooling unless it already exists in `tools/`
6. **No change to the Stitch MCP API contract** — `create_design_system` signature stays the same; we are only enriching the `designMd` string value

### Relevant Architecture

**Pipeline skill:** `.claude/commands/pipeline.stitch-design.md`
- Step 2b constructs `designMd` as a minimal brand brief (lines 170–191 of the skill file)
- Step 2c-ii prepends a consistency instruction to each of the 4 remaining page prompts — this references home screen ID but does not reference any CSS class values
- Step 2d calls `apply_design_system` after all 5 pages are generated — enforces font family, colour, roundness only (not typography scale)

**Taste skill:** `~/.claude/skills/stitch-design-taste/SKILL.md` + `DESIGN.md`
- `SKILL.md` defines how to generate a DESIGN.md — 9 sections: atmosphere, colour palette, typography rules, component stylings, hero section, layout principles, responsive rules, motion philosophy, anti-patterns
- `DESIGN.md` is a filled template with configuration dials: Creativity, Density, Variance, Motion Intent
- Key typography section specifies: Display font at track-tight `-0.025em`, weight 700–900, leading 1.1, scale `clamp(2.25rem, 5vw, 3.75rem)`; body at weight 400, leading 1.65, 65ch max-width
- Fonts: Geist, Outfit, Cabinet Grotesk, Satoshi preferred; Inter BANNED

**What Stitch does with `designMd`:** It is passed as the `designMd` field in `create_design_system`. Stitch uses it as a design brief when generating screens. The richer and more explicit this document, the more constrained Stitch's generative decisions become.

### Codebase Snapshot

```
.claude/commands/pipeline.stitch-design.md    # The pipeline skill — primary file to modify
~/.claude/skills/stitch-design-taste/SKILL.md # Taste skill instructions
~/.claude/skills/stitch-design-taste/DESIGN.md # Taste skill template (dials + full design system)
output/ingestion/nova-stitch/html/            # Example output — 5 HTML files with Tailwind classes
output/ingestion/nova-stitch/design-system/tokens.json  # Example design system tokens
```

**Current `designMd` structure (minimal):**
```markdown
# Brand Identity
Company: $COMPANY_NAME
Trade: $TRADE
Location: $LOCATION
Tagline: $TAGLINE
Logo: $LOGO_DESC

# Design Principles
- Trustworthy, local, and conversion-focused — not generic SaaS
- Mobile-first layout, clean navigation, prominent CTA buttons
- Consistent spacing rhythm and component language across all pages

# Content
Services offered: $SERVICES_LIST
Phone: $PHONE
```

**Taste skill typography section (what we want to add):**
```markdown
## Typography Rules
- Display: [Font] — Track-tight (-0.025em), controlled fluid scale, weight-driven hierarchy (700–900), leading 1.1
- Body: [Font] at weight 400 — Relaxed leading (1.65), 65ch max-width
- Scale: Display at clamp(2.25rem, 5vw, 3.75rem). Body at 1rem/1.125rem
- H1: weight 800–900, size clamp(2.5rem, 5vw, 4rem), tracking -0.025em, sentence case
- H2: weight 700, size clamp(1.5rem, 3vw, 2.25rem), tracking -0.015em
- BANNED: Inter, generic serifs, ALL CAPS headings except for eyebrow labels, gradient text on headings
```

### What a Good Plan Should Cover

1. **Integration pattern decision:** Should the pipeline invoke `stitch-design-taste` skill dynamically (generating a full `DESIGN.md` per run, adapting to the specific trade and colors) or embed a static "local business" typography block directly in the pipeline? What are the trade-offs?

2. **Dial values for local business:** What Creativity, Density, Variance, and Motion Intent values are appropriate for trade service websites vs. the default SaaS values?

3. **Sufficiency question:** If Stitch is given explicit H1/H2 weight and size rules in the design system, does it reliably follow them across 5 independent page generations? Or should Tailwind literal class strings also be injected into the per-page prompts as belt-and-braces?

4. **Post-processing decision:** Is an HTML normalisation step warranted? If so, does it live as a step in the pipeline skill, or as a separate script in `tools/`?

5. **Which files change:** Exactly which lines of `pipeline.stitch-design.md` are modified, and what is the new `designMd` construction block?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-03-31_stitch-heading-consistency/`.

Then output this command for the user to copy-paste into Claude Code:
```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-03-31_stitch-heading-consistency/
```
