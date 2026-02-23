# Codex Peer Review Prompt

Paste this entire file into Codex in VS Code.

---

## Your task

You are doing an independent architectural peer review. Read the brief below, then produce your own implementation plan.

Save your plan as `codex-plan.md` in this folder:
`output/sessions/codex-peer-review/2026-02-21_pipeline-ingestion-fixes/`

When done, output this exact command so the user can copy-paste it into Claude Code:

```
/plan.with.codex synthesise output/sessions/codex-peer-review/2026-02-21_pipeline-ingestion-fixes/
```

---

## Brief: Fix Three Ingestion Pipeline Issues

**Date:** 2026-02-21
**Project:** Local Business Platform monorepo
**Note:** This brief is sent to both Claude and Codex independently. Your plans will be synthesised into a final implementation spec. Do not look at `claude-plan.md` before writing your own plan.

### Problem Statement

The ingestion pipeline (`tools/analyse-site.ts` + supporting libraries) has three confirmed bugs discovered during the first real end-to-end test (`/pipeline.ingest --url https://colorcode.events/ --name atlas`):

**Issue 1: Synthesis JSON truncation → vega fallback**
The site synthesis API call (`multi-page-analyzer.ts:synthesizeSiteAnalysis()`) uses `max_tokens: 4096`. For complex sites (10+ pages, 16+ section blueprints), the AI response exceeds this limit. The JSON gets truncated mid-field — in the atlas test, it cut off inside `visualLanguage.palette.accent`, before reaching `themeTokenRecommendations` and `registryRecommendation`. Since `registryRecommendation` is missing from the parsed result, the fallback in `analyse-site.ts:502-507` kicks in with `{ themeName: "vega", confidence: "low" }`. This means every complex site gets vega regardless of what the AI would have recommended.

**Issue 2: Computed styles extraction `__name is not defined`**
The computed style extractor (`tools/lib/computed-style-extractor.ts`) uses Playwright's `page.evaluate()` to run JS in the browser context. When `tsx` (which uses esbuild) transpiles the code, esbuild can inject `__name` helper variables for function name tracking. These variables exist in Node.js scope but not in the browser's `page.evaluate()` scope, causing `ReferenceError: __name is not defined`. The code already mitigates this for `rgbToHex` (line 127 uses an arrow function), but the error still occurs — likely from other constructs in the evaluate callback. The pipeline catches this gracefully (screenshot-capture.ts:83-89), but it means computed styles are never extracted, degrading the token fallback chain from "synthesis+computed" to just "synthesis" (or worse).

**Issue 3: Token class allowlist false positives**
The token class allowlist (`tools/lib/token-class-allowlist.ts`) rejects standard Tailwind background utility classes like `bg-cover`, `bg-center`, `bg-no-repeat`. The `COLOR_CLASS_REGEX` (line 129) matches anything starting with `bg-`, `text-`, `border-`, etc. The `isAllowedClass()` function then checks if the class starts with a known prefix from `STANDARD_TAILWIND_PREFIXES` — but that set only has `bg-white`, `bg-black`, `bg-transparent`, `bg-current`, and `bg-gradient-` for background classes. So `bg-cover` matches the color regex, isn't in the allowlist, and gets rejected. These show up as "non-standard colour classes auto-fixed" warnings in the pipeline output. They aren't actually auto-fixed (no replacement exists in `CLASS_REPLACEMENTS`), but they create noisy false-positive warnings and could theoretically be stripped in future if the auto-fix logic becomes more aggressive.

### Goals

1. **Issue 1:** Synthesis responses complete without truncation for sites with up to ~20 pages
2. **Issue 2:** Computed styles extract successfully in the `tsx`/esbuild runtime
3. **Issue 3:** Standard Tailwind utility classes that happen to start with color-related prefixes are not flagged

### Non-Goals

- Changing the synthesis prompt content or schema
- Rewriting the computed style extractor architecture
- Adding new classes to the theme token system
- Modifying the Tailwind configuration

### Acceptance Criteria

1. Run `/pipeline.ingest --url https://colorcode.events/ --name atlas2` — synthesis JSON should parse completely with `registryRecommendation` present
2. No `__name is not defined` error in computed styles extraction
3. `bg-cover`, `bg-center`, `bg-no-repeat`, `bg-contain`, `bg-fixed`, `bg-scroll`, `bg-clip-text`, `bg-auto` are all accepted by `isAllowedClass()`
4. All existing tests pass (`pnpm type-check`, existing unit tests)
5. No regression in the allowlist — it should still reject invented classes like `bg-brand-dark-purple`

### Constraints

- **Cannot use `--no-verify` or skip type-check** — all changes must pass strict TypeScript
- **Must stay on `develop` branch** — git workflow is `develop → staging → main`
- **Arrow functions inside `page.evaluate()`** — esbuild's `__name` transform targets named function declarations, not arrow functions
- **Token limit increase must be bounded** — don't set `max_tokens` to something absurd; the synthesis response should fit comfortably without wasting API cost
- **Allowlist changes must be precise** — don't just allow all `bg-*` classes, as that would defeat the purpose of catching invented color classes like `bg-brand-dark-purple`

### Relevant Architecture

**Token fallback chain** (`analyse-site.ts:384-474`):
1. synthesis+computed (best) → 2. synthesis → 3. computed → 4. vision palette → 5. CSS-scraped → 6. defaults

When synthesis JSON is truncated, `validatedSynthesis` becomes null (line 356), so the chain skips to level 3 or 4 depending on whether computed styles succeeded. If both synthesis AND computed styles fail (as happened in the atlas test), the chain falls to vision palette (level 4).

**Synthesis call** (`multi-page-analyzer.ts:538-609`): Uses `VISION_MAX_TOKENS = 4096` for both per-page vision calls and the synthesis call. The synthesis call needs more tokens because it produces a larger response (deduplicated blueprints + visual language + token recommendations + registry recommendation).

**Computed style extractor** (`computed-style-extractor.ts`): Single `page.evaluate()` call per page. Serialises `SELECTOR_STRATEGIES` and passes them to the browser context. The callback must be self-contained — no imports, no closures over Node.js variables.

**Token class allowlist** (`token-class-allowlist.ts`): The `isAllowedClass()` function has a specific order: exact color tokens → typography tokens → utility tokens → standard Tailwind prefix check → arbitrary values → negated utilities → color-class rejection → allow everything else.

### Codebase Snapshot

| File | What it does | Lines |
|------|-------------|-------|
| `tools/lib/multi-page-analyzer.ts` | Per-page vision analysis + site synthesis | ~680 |
| `tools/lib/computed-style-extractor.ts` | Playwright `page.evaluate()` style extraction | 217 |
| `tools/lib/screenshot-capture.ts` | Screenshot + computed style orchestration | ~110 |
| `tools/lib/token-class-allowlist.ts` | Class validation for generated components | 189 |
| `tools/lib/theme-component-generator.ts` | AI component generation + token validation | ~300 |
| `tools/analyse-site.ts` | Main pipeline orchestrator (14 steps) | ~600 |
| `tools/lib/analysis-schemas.ts` | Zod schemas for synthesis response | ~200 |

### What a Good Plan Should Cover

1. **For Issue 1 (truncation):** What should `VISION_MAX_TOKENS` be increased to for the synthesis call? Should it be a separate constant from the per-page vision calls? Should we add a `stop_reason` check to detect truncation and warn/retry?
2. **For Issue 2 (__name):** What constructs inside the `page.evaluate()` callback trigger the `__name` injection? Is converting all functions to arrow functions sufficient? Should we use a string-based evaluate instead of a function? What about the `for...of` loop and object destructuring?
3. **For Issue 3 (allowlist):** What's the right granularity — add individual classes (`bg-cover`, `bg-center`, etc.) or add a structural exclusion in the validation logic (e.g., a set of known non-color `bg-*` classes)? Should similar prefixes like `text-left`, `text-center`, `text-wrap` be checked too (they're already covered by `STANDARD_TAILWIND_PREFIXES` but worth verifying)?

---

## Deliverable

Produce a numbered implementation plan with:
- Clear phases/steps
- Which files are created or modified at each step
- Verification gates between steps (how to confirm each step succeeded before moving on)
- Any risks or trade-offs worth calling out

Save your response as `codex-plan.md` in `output/sessions/codex-peer-review/2026-02-21_pipeline-ingestion-fixes/`.

Then output this command for the user to copy-paste into Claude Code:
`/plan.with.codex synthesise output/sessions/codex-peer-review/2026-02-21_pipeline-ingestion-fixes/`
