I’ll draft an independent implementation plan and save it to the requested `codex-plan.md` path, then provide the exact synth command.

Implemented plan content for `output/sessions/codex-peer-review/2026-03-31_stitch-heading-consistency/codex-plan.md`:

```markdown
# Codex Peer Review Plan — Stitch Pipeline Heading Consistency

## 1) Architectural decision and rollout strategy

1. **Adopt a hybrid integration pattern (dynamic taste invocation + embedded fallback).**
   - **Primary path:** In `pipeline.stitch-design.md` Step 2b, explicitly invoke the `stitch-design-taste` skill to generate a run-specific design brief section.
   - **Fallback path:** If skill invocation is unavailable/fails, inject a **static local-business typography contract** (derived from `~/.claude/skills/stitch-design-taste/DESIGN.md`) directly in Step 2b.
   - **Why hybrid:** Satisfies the goal to wire the taste skill in, while keeping pipeline resilience/portability.

2. **Define local-business dial defaults (override SaaS-like defaults).**
   - Creativity: **4/10**
   - Density: **5/10**
   - Variance: **3/10**
   - Motion Intent: **2/10**
   - Rationale: trust, readability, conversion consistency over expressive variation.

3. **Treat heading consistency as a two-layer control problem.**
   - Layer A (primary): rich `designMd` with explicit H1/H2 typography contract.
   - Layer B (belt-and-braces): repeat canonical heading class contract in per-page generation prompts (Step 2c-ii).
   - Optional Layer C (safety net): post-generation heading class normalization if Layer A/B still drift due to model non-determinism.

---

## 2) Phase 1 — Enrich Step 2b `designMd` construction

### Files changed

- **Modify:** `.claude/commands/pipeline.stitch-design.md` (Step 2b block currently around lines 170–191)

### Changes

1. Replace minimal brand brief-only `designMd` construction with:
   - Brand identity/context
   - Audience + conversion intent
   - Local-business taste dials
   - Explicit typography system (H1/H2/body rules)
   - Anti-pattern bans
   - Component/layout behavior guidance

2. Add explicit heading spec in `designMd`:
   - **H1:** `weight 800–900`, `clamp(2.5rem, 5vw, 4rem)`, `tracking -0.025em`, `leading 1.1`, `sentence case`
   - **H2:** `weight 700`, `clamp(1.5rem, 3vw, 2.25rem)`, `tracking -0.015em`, `leading 1.2`, `sentence case`
   - Ban `ALL CAPS` for headings except eyebrow labels.
   - Ban gradient heading text and decorative outline/shadow treatments.
   - Ban Inter for headings if font choice is open.

3. Add a Step 2b instruction to **invoke stitch-design-taste framing**:
   - “Generate taste-aligned design guidance tuned for local trade business (not SaaS/dashboard), then merge into `designMd`.”
   - Include fallback static block if skill cannot be invoked in runtime context.

### Verification gate

- Read Step 2b and confirm `designMd` now includes a dedicated **Typography Rules** section with concrete H1/H2 numeric constraints and anti-patterns.
- Ensure there is explicit mention of local-business tuning and conversion focus.

---

## 3) Phase 2 — Strengthen Step 2c prompting with canonical class contract

### Files changed

- **Modify:** `.claude/commands/pipeline.stitch-design.md` (Step 2c-ii prompt prefix for non-home pages)

### Changes

1. Extend existing cross-page consistency instruction so it references **literal Tailwind utility targets**, not only “be consistent with home page”.
2. Add canonical heading class contract in prompt text:
   - H1 target utilities: `font-extrabold`, `tracking-[-0.025em]`, `leading-[1.1]`, `normal-case`, size equivalent to `clamp(2.5rem,5vw,4rem)` (or nearest Tailwind arbitrary text size).
   - H2 target utilities: `font-bold`, `tracking-[-0.015em]`, `leading-[1.2]`, `normal-case`, size equivalent to `clamp(1.5rem,3vw,2.25rem)`.
3. Explicitly instruct: do not use uppercase transforms for H1/H2 unless element is eyebrow label.

### Verification gate

- Inspect Step 2c-ii text and confirm heading class contract appears in every downstream page prompt.
- Confirm instruction precedence: “follow these heading utilities across all generated pages.”

---

## 4) Phase 3 — Add optional post-generation normalization safety net

### Files changed

- **Create:** `tools/stitch-normalize-headings.mjs`
- **Modify:** `.claude/commands/pipeline.stitch-design.md` (new step after generation, before/after `apply_design_system` as appropriate)

### Changes

1. Implement a lightweight script that:
   - Scans `output/ingestion/$THEME-stitch/html/*.html`
   - For each `<h1>` and `<h2>`, normalizes typography-related Tailwind classes:
     - Replace conflicting `font-*`, `text-*`, `tracking-*`, `leading-*`, `uppercase/lowercase/capitalize` utilities with canonical set.
     - Preserve non-typography classes (spacing/layout/color/etc).
2. Add pipeline step:
   - Run normalization in **enforce mode** by default for now (because acceptance requires consistent classes).
   - Log per-file changes and summary count.

### Verification gate

- Diff HTML before/after normalization and confirm only heading typography utilities changed.
- Run on at least one known inconsistent sample (`nova-stitch`) and verify all H1/H2 class sets match the canonical contract across 5 pages.

---

## 5) Phase 4 — Validate end-to-end behavior on fresh run

### Files changed

- No new files (execution + inspection phase)

### Changes

1. Run full pipeline for at least one trade-business seed.
2. Verify:
   - `designMd` contains explicit heading contract.
   - Generated pages use consistent H1/H2 typography utilities.
   - Post-normalization (if applied) reports zero or low corrections after prompt tuning matures.

### Verification gate (acceptance mapping)

- **AC1:** H1/H2 class consistency across all 5 HTML files ✅
- **AC2:** Step 2b visibly includes explicit typography rules ✅
- **AC3:** Local-business taste dials present and tuned away from SaaS defaults ✅

---

## 6) Risks and trade-offs

1. **Dynamic skill dependency risk**
   - If environment lacks `stitch-design-taste`, dynamic path could fail.
   - Mitigation: embedded fallback block in Step 2b.

2. **Over-constraining creative output**
   - Tight heading contract may reduce visual variety.
   - Mitigation: constrain only heading hierarchy; keep component styling flexible.

3. **Normalizer side effects**
   - Aggressive class rewriting could remove intentional responsive typography utilities.
   - Mitigation: only rewrite heading typography utilities; preserve breakpoint variants where possible; run with clear logs.

4. **Non-determinism still possible upstream**
   - Even rich `designMd` may drift occasionally.
   - Mitigation: Layered approach (designMd + prompt contract + optional normalizer).

---

## 7) Concrete edit targets in `pipeline.stitch-design.md`

1. **Step 2b (around current lines ~170–191):**
   - Replace minimal `designMd` template with expanded multi-section template including typography contract and taste dials.

2. **Step 2c-ii:**
   - Amend consistency prefix to include canonical H1/H2 class instructions and casing rule.

3. **Post-generation step (new, after page generation and before final output finalization):**
   - Add optional/required `tools/stitch-normalize-headings.mjs` invocation.
   - Keep `apply_design_system` unchanged (API contract preserved), but document that it does not control typography scale.
```

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-03-31_stitch-heading-consistency/
