# YOLO Implementation Brief: Ingestion Pipeline v2 — Fix Generated Output Quality

**Branch:** feature/ingestion-v2 (ALREADY checked out — do NOT create a new branch)
**Session spec:** output/sessions/2026-02-21_pipeline-fixes/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error

---

## Context

The ingestion pipeline v2 was tested against colorcode.events and produced output with 10 categories of defects: invalid TypeScript, wrong CSS classes, broken JSON synthesis, missing `"use client"`, unwired theme package, and more. The synthesis was reviewed and approved via dual-model peer review. Implement it exactly as specified below.

**IMPORTANT:** You are already on `feature/ingestion-v2`. Do NOT switch to develop. Do NOT create a new branch. Just continue committing to this branch.

## Pre-flight

```bash
git status  # confirm on feature/ingestion-v2, working tree clean
pnpm type-check   # must be clean before starting
```

---

## Phase A: Data Pipeline Reliability

**Goal:** Fix upstream data quality so synthesis produces correct colours and the pipeline fails visibly.

### Step A1: Add Zod runtime schemas for analysis types

**Create:** `tools/lib/analysis-schemas.ts`

Define Zod schemas for:

- `PageVisionResponseSchema` — validates per-page vision analysis JSON
- `SiteSynthesisResponseSchema` — validates the synthesis consolidation JSON
- `VisualLanguageSchema` — validates the colour palette sub-object

These schemas replace unsafe `as Record<string, unknown>` casts.

**Modify:** `tools/analyse-site.ts` — Replace unsafe casts with `.safeParse()` calls. On validation failure, log the parse errors and fall back gracefully.

### Step A2: Preserve `visualLanguage` through per-page analysis

**Modify:** `tools/lib/multi-page-analyzer.ts`

- Add `visualLanguage?: VisualLanguageData` to `PerPageAnalysis` interface (proper typed interface)
- In `visionResultToPerPageAnalysis()`, copy `visionResult.visualLanguage` to output
- In `synthesizeSiteAnalysis()` payload assembly, include per-page `visualLanguage` data

### Step A3: Fix synthesis prompt for reliable JSON

**Modify:** `tools/lib/reference-analysis-prompts.ts`

- Replace all `"field": "value1" | "value2"` pipe-unions with comment-style annotations
- Update `registryRecommendation.themeName` to say "pick from constellation namespace"
- Replace "merge colour palettes by averaging" with: "For each colour token, use the hex value that appears most frequently across pages. If tied, prefer the homepage's values. Never output #000000 or #FFFFFF as brand colours."
- Add instruction: "Return ONLY valid JSON. No markdown fences. No commentary."
- Fix `usesInlineColourHighlights` to not be hardcoded false

**Modify:** `tools/lib/multi-page-analyzer.ts`

Harden JSON extraction in `synthesizeSiteAnalysis()`:

1. Try `JSON.parse(fullText)` first
2. Try extracting from markdown fences
3. Try balanced-brace extraction
4. On failure, write raw response to `output/<theme>/debug-synthesis-response.txt`

### Step A4: Fix token reconciliation fallback chain

**Modify:** `tools/analyse-site.ts`

New fallback order:

1. Synthesis tokens (if Zod validation passes)
2. Homepage vision palette (if confidence "high" or "medium")
3. CSS-scraped values (if non-default)
4. Platform defaults

Log which source was used: `TOKEN_SOURCE: synthesis | vision | css | defaults`

### Step A5: Fix dotenv loading

**Modify:** `tools/analyse-site.ts`

Replace current `dotenv.config()` with `import 'dotenv/config';` as line 1 (ESM side-effect import).

Add preflight check:

```ts
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("⚠ ANTHROPIC_API_KEY not set — running in HTML-only mode");
}
```

### Phase A Verification Gate — STOP if this fails

```bash
pnpm type-check
```

### Phase A Commit

```bash
git add tools/lib/analysis-schemas.ts tools/lib/multi-page-analyzer.ts tools/lib/reference-analysis-prompts.ts tools/analyse-site.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): harden data pipeline — Zod schemas, visualLanguage propagation, synthesis JSON reliability

- Add Zod runtime schemas for vision response, synthesis response, and visual language
- Preserve visualLanguage through PerPageAnalysis so synthesis gets real colour data
- Fix synthesis prompt: remove pipe-unions, clearer colour instructions, explicit JSON-only output
- Harden JSON extraction: try parse → fence extraction → balanced-brace → debug dump
- Fix token reconciliation fallback: synthesis → vision palette → CSS → defaults
- Fix dotenv loading with ESM side-effect import pattern
- Add API key preflight check with html-only mode warning

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase B: Component Generation Quality

**Goal:** Generated components are valid TypeScript using standard theme tokens.

### Step B1: Create token class allowlist

**Create:** `tools/lib/token-class-allowlist.ts`

Export:

- `ALLOWED_COLOR_PREFIXES` — set of allowed colour-related CSS class prefixes (bg-brand-_, text-surface-_, etc.)
- `STANDARD_TAILWIND_PREFIXES` — set of non-colour Tailwind prefixes (flex, grid, p-, m-, text-xs, etc.)
- `isAllowedClass(className: string): boolean` — check function
- `looksLikeColorClass(className: string): boolean` — detect colour classes

### Step B2: Fix component generation prompt and templates

**Modify:** `tools/lib/theme-component-generator.ts` → `generateJSXBody()`

Update AI prompt:

1. Explicit colour class allowlist
2. "Return ONLY JSX body starting with `return (`. No interfaces, no imports."
3. "NEVER invent colour names like bg-brand-dark-purple."

**Modify:** `tools/lib/theme-component-templates.ts`

Fix interface generation:

- Sanitise slot names: strip hyphens, convert to camelCase, prefix leading digits
- Detect complex slot types from name patterns:
  - `*Card*`, `*Post*`, `*Item*` → `{ title?: string; description?: string; image?: string; href?: string }`
  - `*Link*`, `*Button*`, `*Cta*` → `{ label?: string; href?: string }`
  - `*Image*`, `*Photo*` → `{ src?: string; alt?: string }`
  - Default → `string`
- Ensure JSX bracket-access keys match interface property names

### Step B3: Add post-generation validation

**Modify:** `tools/lib/theme-component-generator.ts`

After AI generates JSX body:

1. TypeScript syntax check: `ts.createSourceFile()` on wrapped component
2. Token class check: run each className through `isAllowedClass()`
3. Auto-replace common non-standard patterns, retry once on failure, then placeholder
4. Fix regex state leak: reset `.lastIndex = 0` per component

### Step B4: Fix `"use client"` directive logic

**Modify:** `tools/lib/theme-component-templates.ts`

Add `"use client"` when ANY of:

- `interactionNeeds === "stateful"`
- Category is "Navigation"
- JSX body contains `useState`, `useEffect`, `useRef`, `onClick`, `onChange`, `onSubmit`, `<form`
- Category is "Forms" or "Newsletter"

### Phase B Verification Gate — STOP if this fails

```bash
pnpm type-check
```

### Phase B Commit

```bash
git add tools/lib/token-class-allowlist.ts tools/lib/theme-component-generator.ts tools/lib/theme-component-templates.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): harden component generation — valid TS, standard tokens, correct "use client"

- Add token class allowlist for colour validation
- Fix component prompt: explicit token list, JSX-only output
- Sanitise contentSlot names to valid camelCase identifiers
- Infer complex prop types from slot name patterns (cards, links, images)
- Add post-generation TypeScript syntax validation via ts.createSourceFile()
- Add token class validation with auto-replace and retry logic
- Fix regex state leak in class scanner
- Fix "use client" logic: scan for interactive patterns, Navigation always client

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase C: Example Page Generation

**Goal:** Example pages follow Next.js App Router conventions.

### Step C1: Fix page exports and client directives

**Modify:** `tools/lib/page-template-generator.ts`

- Change `export function HomePage()` → `export default function Page()`
- Remove blanket `"use client"` from all pages
- Pages are Server Components by default

### Step C2: Fix import paths

**Modify:** `tools/lib/page-template-generator.ts`

Generate imports using barrel path:

```ts
import { TopNavBar, HeroHeadline } from "@platform/themes/<name>/components";
```

### Phase C Verification Gate — STOP if this fails

```bash
pnpm type-check
```

### Phase C Commit

```bash
git add tools/lib/page-template-generator.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): fix example page generation — default exports, no blanket "use client", barrel imports

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase D: Theme Scaffold Fixes

**Goal:** Scaffolded theme package is wirable into a site without manual fixes.

### Step D1: Fix showcase-registry — only import existing files

**Modify:** `tools/scaffold-theme-package.ts` → `generateShowcaseRegistryTsx()`

- Check which component files actually exist before emitting imports
- Skip blueprints matched to core-components
- Deduplicate export names
- Add `import type { ReactNode } from 'react'`

### Step D2: Generate component barrel file

**Modify:** `tools/scaffold-theme-package.ts`

Generate `components/index.ts` barrel file re-exporting all components.

### Step D3: Fix THEME_NAMES regex for multi-line arrays

**Modify:** `tools/scaffold-theme-package.ts` → `appendThemeName()`

Replace `/export const THEME_NAMES = \[([^\]]*)\] as const;/` with `/export const THEME_NAMES = \[([\s\S]*?)\] as const;/`

### Step D4: Fix require.main ESM detection

**Modify:** `tools/scaffold-theme-package.ts`

Replace `require.main === module` with `import.meta.url` / `process.argv[1]` ESM-safe detection.

### Step D5: Update package.json exports

**Modify:** `tools/scaffold-theme-package.ts`

When updating `packages/themes/package.json`, add:

- `"./<name>": "./<name>/index.ts"`
- `"./<name>/manifest": "./<name>/manifest.ts"`
- `"./<name>/showcase": "./<name>/showcase-registry.tsx"`
- `"./<name>/components": "./<name>/components/index.ts"`

### Step D6: Generate globals.css following vega pattern

**Modify:** `tools/scaffold-theme-package.ts` → `generateGlobalsCss()`

Generate standard utility classes using `@apply` with theme tokens:

- `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- `.card`, `.card-interactive`
- `.section`, `.section-compact`
- `.container-narrow`, `.container-standard`
- `.heading-hero`, `.heading-section`, `.heading-card`

No `@layer`. No `@tailwind`. No custom CSS properties. Plain selectors with `@apply`.

### Step D7: Generate site integration README

**Modify:** `tools/scaffold-theme-package.ts` → `generateReadme()`

Add "Wiring into a site" section with copy-pasteable code blocks for tsconfig, next.config, globals.css, theme.config.

### Phase D Verification Gate — STOP if this fails

```bash
pnpm type-check
```

### Phase D Commit

```bash
git add tools/scaffold-theme-package.ts
git commit -m "$(cat <<'EOF'
fix(pipeline): fix theme scaffold — showcase imports, barrel file, THEME_NAMES regex, ESM compat, globals.css pattern

- Showcase-registry only imports files that actually exist
- Generate components/index.ts barrel file for clean imports
- Fix THEME_NAMES append regex for multi-line arrays
- Replace require.main with ESM-safe import.meta.url detection
- Add deep component barrel export to package.json
- Generate globals.css with standard vega-pattern utilities (no @layer)
- Add site integration instructions to generated README

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase E: Testing

**Goal:** Fixture-driven unit tests that run without API calls.

### Step E1: Create test fixtures

**Create:** `tools/fixtures/mock-synthesis-response.json` — valid synthesis output
**Create:** `tools/fixtures/mock-malformed-synthesis.json` — intentionally broken
**Create:** `tools/fixtures/mock-page-vision-result.json` — valid per-page analysis
**Create:** `tools/fixtures/mock-section-blueprint.json` — for component generation tests

### Step E2: Write unit tests

**Create:** `tools/__tests__/analysis-schemas.test.ts` — Zod schema validation
**Create:** `tools/__tests__/theme-component-templates.test.ts` — prop sanitisation, type inference, "use client" logic
**Create:** `tools/__tests__/token-class-allowlist.test.ts` — standard tokens pass, non-standard fail
**Create:** `tools/__tests__/scaffold-integrity.test.ts` — showcase imports, THEME_NAMES regex, barrel file
**Create:** `tools/__tests__/page-template-generator.test.ts` — default exports, no blanket "use client"

### Phase E Verification Gate — STOP if this fails

```bash
pnpm test
pnpm type-check
```

### Phase E Commit

```bash
git add tools/fixtures/ tools/__tests__/
git commit -m "$(cat <<'EOF'
test(pipeline): add fixture-driven unit tests for pipeline output validation

- Zod schema tests for synthesis and vision responses
- Component template tests: prop sanitisation, type inference, "use client"
- Token class allowlist tests
- Scaffold integrity tests: showcase imports, THEME_NAMES, barrel file
- Page template tests: default exports, server components
- Mock fixtures for all test scenarios

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Pipeline status flags added: `VISION_OK`, `SYNTHESIS_OK`, `FALLBACK_USED`, `TOKEN_SOURCE`
3. Build status — confirm `pnpm lint && pnpm type-check && pnpm test` passes
4. Any exceptions or intentional deviations from the plan

## Update Session File

After completing all phases, append to `output/sessions/2026-02-21_pipeline-fixes/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises, final state]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on `feature/ingestion-v2`
- Parallel reads and independent file edits should be done concurrently using Task agents
- Minimal changes only — implement what the plan says, nothing more
- Do NOT switch branches or create new branches

---

## Completed

**Date:** 2026-02-21
**Status:** All phases executed successfully

All 5 phases implemented as specified. Phase A added Zod runtime schemas for vision/synthesis responses, propagated visualLanguage through PerPageAnalysis, fixed synthesis prompts to remove pipe-unions and add clearer colour instructions, implemented a 4-step token reconciliation fallback chain (synthesis → vision → CSS → defaults) with TOKEN_SOURCE logging, and fixed dotenv to ESM side-effect import pattern. Phase B created a token class allowlist, hardened the component generation prompt with explicit colour class lists, added TypeScript syntax validation via ts.createSourceFile(), token class validation with auto-replacement, and fixed "use client" directive logic for Navigation/Forms/interactive patterns. Phase C changed page exports to `export default function Page()`, removed blanket "use client", and switched to barrel imports. Phase D fixed showcase-registry to only import existing files, generated components/index.ts barrel, fixed THEME_NAMES regex for multi-line arrays, replaced require.main with ESM-safe detection, added component barrel export to package.json, generated globals.css with standard @apply utilities, and added site integration instructions to README. Phase E added 73 tests across 8 test files (6 schema validation, 12 component template, 10 token allowlist, 9 scaffold integrity, 6 page template, plus pre-existing tests) with mock fixtures.

### Commits

- `d569e3a` fix(pipeline): harden data pipeline — Zod schemas, visualLanguage propagation, synthesis JSON reliability
- `6970f4a` fix(pipeline): harden component generation — valid TS, standard tokens, correct "use client"
- `c404c2b` fix(pipeline): fix example page generation — default exports, no blanket "use client", barrel imports
- `e7802e6` fix(pipeline): fix theme scaffold — showcase imports, barrel file, THEME_NAMES regex, ESM compat, globals.css pattern
- `57cecb8` test(pipeline): add fixture-driven unit tests for pipeline output validation
