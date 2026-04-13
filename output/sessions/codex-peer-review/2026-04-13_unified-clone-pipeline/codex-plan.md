File: output/sessions/codex-peer-review/2026-04-13_unified-clone-pipeline/codex-plan.md

```markdown
# Implementation Plan — Unified Clone-to-Theme-to-Scaffold Pipeline

Date: 2026-04-13 • Author: Codex reviewer

---

## 0. Guiding Principles

1. Every stage is **pure-function style**: deterministic output folders whose checksums can be compared in CI.
2. Convergence after Stage-1 is enforced by a **Clone Package Format (CPF)** spec checked by `@theme-system/cpf-validator`.
3. All long-running work is **chunked**; each step writes a `.done.json` with metadata so the orchestrator can resume idempotently.
4. Visual QA loops stop at 3 iterations or earlier if both `home` and `about` diff <5 % (configurable).

---

## 1. Deliverables by Phase

### Phase 1 – Specifications & Skeleton (1 PR)

1.1 `/docs/pipeline/CLONE_PACKAGE_FORMAT.md` — spec.  
1.2 `packages/cpf-validator/` — Zod schema + CLI `npx cpf-validate <path>`.  
1.3 `schemas/JobBrief.ts` — Zod schema used by intake & orchestrator.  
1.4 Scaffolding of new orchestrator: `tools/clone-and-scaffold.ts` (empty pass-thru).  
**Gate P1-G1:** `pnpm test:types && cpf-validate examples/corvus.clone/` passes.

### Phase 2 – Entry-Point Adaptors (2 PRs)

2.1 `tools/clone-entry/ingest-live-site.ts` (wraps old analyse-site, but writes CPF instead of theme).  
2.2 `tools/clone-entry/stitch-mcp.ts` (thin wrapper around Stitch command; adds HTML files + asset folder into CPF).  
2.3 `tools/clone-entry/claude-design-skill.ts` (reads zip/tar of skill output and transforms into CPF).  
2.4 Unit tests: `.spec.ts` for each adaptor with frozen fixtures.  
**Gate P2-G1:** Any of the three adaptors fed into cpf-validator returns OK; folder checksum matches golden fixture.

### Phase 3 – Mechanical HTML➜JSX Converter (1 PR)

3.1 Add dep `htmltojsx` + `posthtml` + custom plugin `plugins/posthtml-strip-js.ts` (removes scripts, noscript).  
3.2 `tools/lib/html-to-jsx-converter.ts`  
 • Parses HTML into PostHTML AST  
 • Normalises classes, removes `<style>` nodes, converts `style=` to Tailwind where trivial else inline CSS block.  
 • Adds `data-cpf-source-id` attrs to every dom node → mapping file `dom-map.json`.  
3.3 Extend CPF spec: `/jsx/pages/*.tsx`, `/styles/imported.css`, `dom-map.json`.  
**Gate P3-G1:** Jest snapshot test diff between HTML fixture ➜ JSX string stable.

### Phase 4 – Visual QA Loop Engine (2 PRs)

4.1 `tools/lib/visual-qa-runner.ts`  
 • Runs Playwright in headed/offscreen mode, captures PNGs per page name.  
 • Calls existing `pipeline-visual-compare.ts` to compute diff.  
 • Publishes `reports/iteration-N/{page}.json/png`.  
4.2 Agent bridge:  
 a. `cs-visual-fidelity-reviewer` already read-only – runner posts diff % + asset paths to OpenAI function call.  
 b. Runner feeds the reviewer output into `cs-frontend-engineer` via conversation JSON; applies returned patch using mm-code-mod.  
4.3 Orchestrator loop inside `runWithQaLoop(stepFn)` higher-order util; capped at 3.  
**Gate P4-G1:** For corvus example diff <5 % after ≤3 loops.

### Phase 5 – Theme Extraction (2 PRs)

5.1 `tools/extract-theme-from-clone.ts`  
 • Input: CPF path, JobBrief brand palette.  
 • Identifies “content nodes” vs layout: heuristic - any text node containing business name/phone/hours OR images under `/assets/raw/*` flagged as content.  
 • Replaces with props; emits `packages/themes/[slug]/` skeleton via existing `scaffold-theme-package.ts`.  
5.2 Token extractor rewrite: `tools/lib/color-token-extractor.ts`  
 • Clusters unique colors (k-means L*a*b\*) → maps to closest semantic token (`primary`, `accent`, `surface`, `section-N-bg`).  
 • For outliers, generates CSS vars in `globals.css` (`--section-3-bg`).  
5.3 Validates with TPV + type-check.  
**Gate P5-G1:** `pnpm tpv packages/themes/foo` passes; `pnpm tsc -p .` passes.

### Phase 6 – Scaffold Stage (1 PR)

6.1 Generalise image manifest  
 • Move `tools/generate-image-manifest.ts` -> `tools/lib/manifest.ts`.  
 • Detect `![` in any MDX under `sites/[client]/content/**`.  
6.2 `tools/scaffold-client-site.ts` combines theme + intake ProjectFile + Gemini manifest.  
6.3 Batch/real-time Gemini toggle via `--batch` flag.  
**Gate P6-G1:** Run against plumbing template -> site boot up `npm run dev`, no missing assets, passes E2E smoke tests.

### Phase 7 – Orchestrator Wiring + CI (1 PR)

7.1 Flesh out `tools/clone-and-scaffold.ts` orchestrator:  
 a. Read JobBrief JSON.  
 b. Spawn entry adaptor.  
 c. Run QA Loop (Stage-1).  
 d. Extract theme, run QA Loop again on extracted theme’s demo pages.  
 e. Scaffold client site, run final Playwright smoke test.  
7.2 Git branching automation in `scripts/ci/create-staging-pr.mjs`.  
**Gate P7-G1 (Acceptance):** Command in brief runs unattended in CI → artifacts uploaded.

---

## 2. Clone Package Format (CPF) v0.1

Folder: `output/clones/<jobId>/`

1. `meta.json` – { jobId, sourceType, sourceRef, capturedAt, cpfVersion }
2. `assets/raw/` – original binary assets (png, jpg, svg, webp, woff)
3. `assets/processed/` – optimised images, fonts subset
4. `html/pages/{slug}.html` – original cleaned HTML (no analytics, no scripts)
5. `css/inline.css` – aggregated inline styles
6. `jsx/pages/{slug}.tsx` – mechanical conversion output
7. `styles/imported.css` – external stylesheets concatenated
8. `dom-map.json` – { nodeId: {page, cssSelector, jsxLine} }
9. `reports/` – per-iteration visual diffs (populated later)  
   Total size target <50 MB.

---

## 3. Job Brief JSON (schemas/JobBrief.ts)

Key fields:  
• id (string, uuid)  
• source: { type: "url"|"stitch"|"designSkill", value: string }  
• businessInfo: ProjectFile (embed, not path)  
• themePrefs: { palette?: string[], fontPrefs?: string[], allowedEffects?: string[] }  
• qa: { maxIterations?: number, thresholds?: {home:number,about:number,default:number}}  
• imageGen: { mode:"batch"|"realtime", stylePrompt:string }  
• runMode: "interactive" | "autonomous"  
Zod validation at intake; orchestrator refuses to start if invalid.

---

## 4. Resumability & Crash Recovery

• Every major function writes `.done.json` including input hash + output hash.  
• On re-run, orchestrator checks for `.done.json` and skips unless `--force`.  
• Temporary artifacts stored in `/tmp/pipeline-<jobId>`; final outputs moved to `/output`.

---

## 5. Testing Strategy

Unit:  
• CPF validator edge cases  
• HTML→JSX converter fixtures (WordPress, Squarespace, Shopify)

Integration:  
• Goldens: colorcode.events, tinywow.com (random)  
• CI matrix: node 18/20, mac/linux.

E2E:  
• Run full pipeline nightly on 2 sites → push visual diff report artifact to GitHub.

---

## 6. Risks & Mitigations

1. High HTML variance → converter errors. Mitigate with AST fallback to React’s `dangerouslySetInnerHTML`.
2. Visual QA loop infinite churn if reviewer suggests non-deterministic fixes. Cap loops; log suggestion history checksum.
3. Gemini quota exceeded. Allow offline placeholder images if quota < needed images.
4. Branch bloat in monorepo. Auto-delete staging branches after merge by bot.

---

## 7. Timeline (ideal)

Week 1: Phase 1  
Week 2: Phase 2 + 3  
Week 3: Phase 4  
Week 4: Phase 5  
Week 5: Phase 6 + 7, freeze  
Week 6: Hardening, docs, hand-off.

---

_(End of plan)_
```

/plan.with.codex synthesise output/sessions/codex-peer-review/2026-04-13_unified-clone-pipeline/
