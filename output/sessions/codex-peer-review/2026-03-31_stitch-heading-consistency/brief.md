# Brief: Stitch Pipeline — Cross-Page Heading Consistency

**Date:** 2026-03-31
**Status:** Updated — taste skill already installed, changes the approach

---

## Problem Statement

The `pipeline.stitch-design` skill generates 5 pages via Stitch AI. Heading typography (H1/H2 size, weight, casing) varies significantly between pages even with a consistency instruction in the prompt. The `apply_design_system` step only enforces font family, colour, and border radius — it cannot enforce typography scale (weight, size, letter-spacing, text-transform). Each page's heading treatment is decided independently by Stitch's LLM.

**Observed on Nova theme:** Contact page uses bold + italic + sentence case; Service page uses uppercase heavy H1; Services listing uses lighter mixed-case H2; About page uses ALL CAPS with an entirely different treatment — all from the same pipeline run.

**Root cause:** The `designMd` passed to `create_design_system` is a bare-bones brand brief (company name, trade, services, phone, 3 bullet design principles). It contains no typography specification — no weights, no sizes, no casing rules, no anti-patterns. Stitch fills the gap with its own defaults, and those defaults vary per page.

---

## Key Discovery: `stitch-design-taste` Skill Already Installed

The `stitch-design-taste` skill exists at `~/.claude/skills/stitch-design-taste/` and is available to Claude Code. It generates `DESIGN.md` files that provide exactly the missing typography specification — track-tight display fonts with explicit weight hierarchy (700–900), scale constraints, anti-pattern bans, and visual atmosphere rules.

**The skill is not wired into `pipeline.stitch-design` at all.** The pipeline constructs its own minimal `designMd` from scratch without referencing the taste skill.

The `DESIGN.md` template from the taste skill includes:
- Typography rules: exact font stack, weight range, tracking, leading, scale (`clamp(2.25rem, 5vw, 3.75rem)`)
- Explicit bans: Inter banned, generic serifs banned
- Layout principles: asymmetric structures, anti-3-column grids
- Anti-pattern list: copywriting clichés, overlapping elements, neon accents
- Per-project configuration dials: Creativity, Density, Variance, Motion Intent

---

## Goals

1. Wire `stitch-design-taste` into `pipeline.stitch-design` — the taste skill's DESIGN.md output should become the `designMd` sent to `create_design_system`
2. Adapt the taste skill output to the local business context (trade sites need trust signals and conversion focus, not the default SaaS/dashboard aesthetic — e.g. Variance and Motion dial values should be lower than the taste defaults of 8/6)
3. Ensure heading hierarchy (H1, H2 weight, size, casing) is explicitly defined in the designMd so Stitch has no ambiguity per page
4. Decide whether a post-generation normalisation step is also needed (belt-and-braces) or whether a rich designMd is sufficient to achieve consistency on its own

---

## Non-Goals

- Rebuilding the taste skill itself (use it as-is)
- Enforcing heading consistency within a single page (intra-page variation is acceptable)
- Changing the Stitch design system API
- Fixing already-generated test sites (new pipeline runs only)

---

## User Interactions / Happy Path

1. User runs `/pipeline.stitch-design --trade "signage studio" --name "Design Lab Eastbourne" ...`
2. **[New]** Pipeline invokes `stitch-design-taste` to generate a project-appropriate `DESIGN.md` — or constructs one from the taste skill's template with trade-appropriate dial values
3. The generated `DESIGN.md` (with explicit typography rules and anti-patterns) replaces the current bare-bones `designMd` in the `create_design_system` call
4. Home page generates first — heading treatment is now constrained by the design system
5. Remaining 4 pages reference the home screen and the same design system
6. `apply_design_system` runs as now
7. **[Optional — to decide in plan]** Post-processing step normalises any H1/H2 drift by checking HTML files against the typography rules in the design system
8. Test site opens with consistent heading treatment across all 5 pages

---

## Acceptance Criteria

- Given a completed pipeline run, when inspecting all 5 HTML files in `output/ingestion/$THEME-stitch/html/`, then H1 heading classes (weight, size, text-transform) are the same across all pages
- Given a completed pipeline run, the `designMd` sent to `create_design_system` includes explicit typography rules (weight, scale, tracking) not just brand identity
- Given the `pipeline.stitch-design` skill file, when reading Step 2b, then the `designMd` construction step references the taste skill or a structured typography block
- Given a pipeline run for a trade business, the taste skill dials are tuned for local service business context (not the default SaaS aesthetic)

---

## Constraints

- **`stitch-design-taste` is a skill, not a tool** — it runs as part of Claude's context. The pipeline must either (a) invoke the skill inline during Step 2b, or (b) define a static "local business" variant of the taste template baked into the pipeline
- **`apply_design_system` cannot enforce typography scale** — this remains a prompt-level problem; the designMd enrichment is the primary fix
- **Stitch non-determinism** — even with a rich designMd, Stitch may still vary. A post-processing normalisation step should be evaluated as a safety net
- **Local business aesthetic** — the taste skill defaults target premium SaaS/creative contexts (Variance 8, Creativity 8). For trade businesses (electricians, plumbers, signage studios) the right dials are different: higher trust/conversion focus, lower variance, more predictable layout, conversion-first CTA patterns
- **Pipeline skill is a Claude `.md` file** — all new steps must be natural language instructions Claude can follow at runtime

---

## Open Questions for Planning Models

1. **Integration pattern:** Should the pipeline call `stitch-design-taste` as a skill (generating the full DESIGN.md dynamically per run) or should the pipeline embed a static "local business" taste template directly in the skill file? Static is more predictable; dynamic allows per-trade variation.

2. **Local business dial values:** What Creativity, Density, Variance, and Motion Intent values are appropriate for trade service websites? Default taste (Creativity 8, Variance 8) may be too expressive for a plumber's site.

3. **Is the taste skill + richer designMd sufficient, or do we also need HTML post-processing?** If Stitch is given explicit weight/size rules in the design system, does it reliably follow them across 5 independent page generations, or will it still drift?

4. **Typography spec format in designMd:** The taste skill uses natural language descriptions (e.g. "Track-tight, controlled fluid scale, weight-driven hierarchy (700–900)"). Should the pipeline also inject literal Tailwind class strings (e.g. "H1 must use `font-extrabold text-5xl md:text-7xl tracking-tight`") as a harder constraint in the per-page prompts?
