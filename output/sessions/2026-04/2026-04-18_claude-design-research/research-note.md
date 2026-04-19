# Claude Design — Research Note

**Date:** 2026-04-18  
**Source:** https://www.anthropic.com/news/claude-design-anthropic-labs  
**Status:** Backlog / revisit when API surface lands

---

## What It Is

Anthropic Labs research preview (Claude Opus 4.7) — a conversational design tool that:

- Generates polished visual designs (slides, prototypes, one-pagers, dashboards) from prompts
- Ingests your codebase + design files to build a **custom design system** on onboarding
- Iterates via inline comments and adjustment controls
- Exports: Canva, PDF, PPTX, or **standalone HTML**
- Produces **developer handoff bundles** with direct Claude Code integration
- Available to Pro, Max, Team, Enterprise — GUI only, no API yet

---

## Where It Could Help Our Pipelines

### 1. Third Ingestion Path (Design from Brief)

Currently: Ingest (scrape existing site) | Stitch (Stitch MCP, 5 pages)  
New: Claude Design → compile design brief → generate visual → export HTML → feed Phase C

Would replace Stitch for clients without a reference site, with higher fidelity than Stitch's generic trade-category output. Our `compileDesignBrief()` output (trade, brandColors, heroVariant, constraints) is exactly the structured input Claude Design appears optimised for.

### 2. Design System Bootstrap

The onboarding step where Claude Design analyses your codebase to extract a design system is directly relevant to our `token-mapping-report.json` pipeline. Potential flow:

1. Feed `site.config.ts` + brand colors from intake
2. Generate visual design via Claude Design
3. Extract HTML export → `extract-theme.ts` seed

Higher-fidelity start than current Stitch token extraction.

### 3. Handoff Bundle → Component Extraction

"Designs packaged into handoff bundles for seamless developer implementation" — if the handoff format includes component boundaries / semantic metadata, this closes the biggest gap in our current pipeline: lossy HTML→JSX conversion in `extract-theme.ts`. Could replace heuristic ComponentRegistry inference.

### 4. Design Brief Adapter

Write a Claude Design adapter that translates `compileDesignBrief()` output into a Claude Design prompt, then captures standalone HTML export as input to Phase C scaffold. Reuses all existing validation (Phase B TPV) and test-site scaffolding unchanged.

---

## What It Doesn't Solve

- **Clone CSS rendering blocker** — Breakdance CSS pipeline issue is unrelated; Claude Design generates fresh HTML which avoids the symptom but doesn't fix the extractor
- **API gap** — GUI only in research preview; standalone HTML is the only extractable artifact right now
- **Token format compatibility** — Claude Design's design system format unknown; will need translation layer to `ThemeConfig` schema

---

## Watch List (revisit triggers)

1. Claude Design API or MCP server announced → build the design brief adapter
2. Handoff bundle format documented → evaluate replacing `extract-theme.ts` heuristics
3. Design system token export format published → map to `ThemeConfig` directly

---

## Recommended Integration Point (when API lands)

New pipeline stage between `compileDesignBrief()` and `scaffold-theme-package.ts`:

- Input: compiled design brief (JSON)
- Action: call Claude Design API, capture HTML per page
- Output: feed HTML into existing Phase C scaffold (reuse TPV + test-site logic)

This would be the highest-leverage integration — replacing the weakest link (structural fidelity of generated components) in both Stitch and Ingest paths without touching downstream infrastructure.
