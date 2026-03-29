# Codex Implementation Plan: `pipeline.stitch-design`

## 1. Scope and Design Decisions (before editing)

1. Add a new parallel command skill at `.claude/commands/pipeline.stitch-design.md`.
2. Keep `pipeline.ingest` unchanged; reuse its test-site wiring patterns where valid.
3. Use `pickNextThemeName()` as the only theme-name source (no `--name`).
4. Adopt the brief’s site naming `sites/<theme-name>-test` and patch cleanup compatibility in `pipeline.kill-site` so both `test-<name>` and `<name>-test` work.
5. Do not auto-commit or auto-push.
6. Treat Stitch MCP as a hard dependency: fail fast if tools are unreachable.

Verification gate:
1. Confirm branch is `develop`.
2. Confirm working tree status is reported (warn if dirty, continue).

Files modified:
1. `.claude/commands/pipeline.stitch-design.md` (new)
2. `.claude/commands/pipeline.kill-site.md` (update parsing/normalization rules)

---

## 2. Command Contract and Preflight

1. Parse arguments:
1. `--trade` required string.
2. `--colors` optional free-text palette guidance.
2. Reject missing `--trade` with explicit usage string.
3. Resolve `themeName = pickNextThemeName()` using `node -e`/`tsx` call against `tools/lib/theme-name-picker.ts`.
4. Define output root as `output/ingestion/<themeName>-stitch/`.
5. Create folders:
1. `output/ingestion/<themeName>-stitch/design-system/`
2. `output/ingestion/<themeName>-stitch/html/`
3. `output/ingestion/<themeName>-stitch/meta/`
6. Fail-fast Stitch availability check:
1. Attempt lightweight Stitch MCP call (list/create dry-run flow per available MCP tooling).
2. On failure, stop with pointer to user-level MCP config location and required Stitch tools.

Verification gate:
1. `themeName` is non-empty and not already in `packages/themes/`.
2. Output folders exist.
3. Stitch tools reachable.

Files modified:
1. `.claude/commands/pipeline.stitch-design.md` (instructions + checks)

---

## 3. Stitch Generation Workflow (5-page contract)

1. Create Stitch project named `<ThemeName> <Trade> Website`.
2. Build one project-level “design intent” prompt:
1. Trade-specific constraints: trust, locality, conversion-first sections.
2. Reusable component language across pages.
3. Token-driven consistency request (colors/typography/spacing/components).
4. If `--colors` present, inject as guidance; if absent, explicitly allow Stitch to choose palette.
3. Generate exactly 5 screens with deterministic names:
1. `home`
2. `about`
3. `contact`
4. `services`
5. `service-detail` (service/location detail template)
4. Use page-specific prompts to enforce route purpose and avoid duplicate layouts.
5. Persist raw Stitch artifacts:
1. `design-system/tokens.raw.json`
2. `html/<page>.html` for all 5 pages
3. `meta/project.json` and `meta/screens.json`

Prompt strategy:
1. Global prompt defines brand voice, spacing rhythm, hierarchy, component style.
2. Per-page prompts only define unique information architecture and key sections.
3. Keep prompts strict about semantic HTML and predictable section landmarks.

Verification gate:
1. Exactly 5 screens returned.
2. Tokens payload exists and parses as JSON.
3. Each screen HTML export succeeds and is non-empty.

Files modified:
1. `.claude/commands/pipeline.stitch-design.md`
2. `output/ingestion/<themeName>-stitch/**` (generated artifacts)

---

## 4. Design Tokens to ThemeConfig Mapping

Implement a deterministic mapping policy in command instructions (plus small inline script blocks where needed). Use fallback layers: exact token match -> semantic alias match -> derived value -> platform default.

### 4.1 Mapping table (minimum required)

1. `colors.brand.primary`:
1. Prefer Stitch `color.brand.primary` or equivalent semantic primary.
2. Fallback to dominant CTA/background brand token.
2. `colors.brand.primaryHover`:
1. Prefer explicit hover token.
2. Else derive by darkening primary ~8-12%.
3. `colors.brand.secondary`:
1. Prefer secondary brand token.
2. Else use darkest neutral-accent mix from palette.
4. `colors.brand.accent`:
1. Prefer accent/highlight token.
2. Else use alternate chroma color distinct from primary.
5. `colors.brand.onPrimary`:
1. Use contrast-checked foreground for primary (`#FFFFFF`/`#111827` based on WCAG target).
6. `colors.surface.*`:
1. Map background/surface/container/text/border token families.
2. Derive missing `secondaryForeground`, `tertiaryForeground`, `subtle`, `subtleBorder`, `inverse` from neutral ramp.
7. `colors.semantic.*`:
1. Map if present.
2. Else assign platform-safe defaults currently used by orion/vega.
8. `colors.overlay.*`:
1. If Stitch has overlay tokens, map directly.
2. Else derive rgba using brand/background (dark: 0.75-0.85 alpha, light: 0.75-0.85 alpha, primary tint from brand primary).

### 4.2 Non-color token handling

1. Keep theme package minimal `DeepPartialThemeConfig` at first: include `colors` plus only component keys confidently inferred.
2. Do not force typography/spacing token expansion unless Stitch tokens are structurally reliable.

Verification gate:
1. Generated `index.ts` passes `ThemeConfigSchema` compatibility via `pnpm type-check`.
2. All required brand/surface keys expected by schema are present in emitted config payload.

Files modified:
1. `.claude/commands/pipeline.stitch-design.md` (mapping rules)
2. `packages/themes/<themeName>/index.ts` (generated config)

Risks/trade-offs:
1. Stitch token taxonomies may vary by model/version.
2. Aggressive derivation can hide bad token extraction; mitigate by writing `meta/token-mapping-report.json` with source/fallback provenance.

---

## 5. ComponentRegistry Inference Heuristics

Infer and emit registry variants from Stitch HTML + token cues:

1. `heroVariant`:
1. `image-overlay` if hero uses background media or full-width image with text overlay.
2. `split` if first fold has two-column media/content split.
3. `minimal` fallback.
2. `headerVariant`:
1. `dark` if header background luminance is dark and nav text is light.
2. `light` otherwise.
3. `cardVariant`:
1. `icon-circle` if repeated feature cards use circular icon containers.
2. `overlay` if cards rely on image overlays.
3. `standard` fallback.
4. `sectionVariant`:
1. `dark-accent` if alternating sections include dark brand block.
2. `gradient` if gradient backgrounds are recurring section motif.
3. `banded` if repeated alternating tinted bands are dominant.
4. `standard` fallback.

Verification gate:
1. Registry values are valid union members in `ComponentRegistry`.
2. Emitted `theme` equals new `ThemeName` literal after `THEME_NAMES` update.

Files modified:
1. `.claude/commands/pipeline.stitch-design.md`
2. `packages/themes/<themeName>/index.ts`

---

## 6. Theme Package Generation

1. Create `packages/themes/<themeName>/index.ts` with exact orion/vega export contract:
1. `<themeName>Registry: ComponentRegistry`
2. `<themeName>DefaultConfig: DeepPartialThemeConfig`
3. `registerTheme({ name: '<themeName>', label: '<ThemeNameTitle>', config: <themeName>DefaultConfig })`
2. Create `packages/themes/<themeName>/globals.css`.

`globals.css` decision:
1. Include it always.
2. Reason: both current `pipeline.ingest` wiring and acceptance path import `packages/themes/<name>/globals.css`; omission creates fragile conditional logic and broken imports.
3. Content strategy: start from `packages/themes/vega/globals.css`, then token-safe normalize class utilities; no hardcoded hex.

Verification gate:
1. Theme package contains `index.ts` and `globals.css`.
2. No default exports.
3. Imports use `@platform/theme-system` types.

Files created:
1. `packages/themes/<themeName>/index.ts`
2. `packages/themes/<themeName>/globals.css`

---

## 7. THEME_NAMES Synchronization

1. Update `packages/theme-system/src/types.ts` `THEME_NAMES` to append the new name.
2. Do this automatically in the skill (not manual), because `pickNextThemeName()` reads this list and will collide on next run if unchanged.
3. Validate no duplicate insertion.

Verification gate:
1. `pickNextThemeName()` returns the next constellation after rerun simulation.
2. `ThemeNameSchema` includes new value (via `z.enum(THEME_NAMES)`).

Files modified:
1. `packages/theme-system/src/types.ts`

Risk/trade-off:
1. Editing source-of-truth type file during exploratory pipeline runs expands union quickly. Acceptable because this pipeline intentionally creates implemented named themes, not throwaway artifacts.

---

## 8. Test Site Scaffold (`<themeName>-test`)

Replicate ingest wiring with Stitch-specific adjustments:

1. Copy `sites/base-template` -> `sites/<themeName>-test`.
2. Remove `.next`, `.turbo`, `node_modules`.
3. Write marker file `.pipeline-test-site.json`:
1. `createdAt`
2. `themeName`
3. `sourceUrl: ""`
4. `pipelineOutput: "output/ingestion/<themeName>-stitch/"`
5. Rewrite `theme.config.ts` to import registry/default config from `@platform/themes/<themeName>`.
6. Rewrite `app/globals.css` to import `../../../packages/themes/<themeName>/globals.css`.
7. Generate CI-inert `package.json` via `generateTestSitePackageJson('<themeName>-test', basePkg)`.
8. Update `site.config.ts` tagline.
9. Rewrite `app/layout.tsx` to bare shell + `ThemeProvider` + `ReviewPanel` pattern used in ingest.

Example pages decision:
1. Do not convert Stitch HTML to TSX in v1.
2. Use base-template pages for runtime verification of tokenized components.
3. Save raw Stitch HTML under output for visual/manual reference.
4. Optional future phase can add HTML->TSX conversion, but it is high-risk for brittle transforms and not required for acceptance.

Verification gate:
1. Marker file exists.
2. `theme.config.ts` imports resolve.
3. Site boots with `npm run dev` from site folder.

Files created/modified:
1. `sites/<themeName>-test/**`
2. `sites/<themeName>-test/.pipeline-test-site.json`

---

## 9. Visual Comparison Strategy

Recommendation for v1:
1. Do not add automated pixel diff against Stitch HTML exports in this command.
2. Reason: Stitch HTML is not guaranteed to match Next runtime DOM/CSS architecture; direct pixel parity will generate noisy false failures and slow approval loop.
3. Instead, provide manual review bundle:
1. raw Stitch HTML files
2. exported design tokens
3. running themed test site

If needed in v2:
1. Add a separate optional `/pipeline.stitch-compare` command that snapshots static renderings of Stitch HTML and compares only key regions with tolerance.

Verification gate:
1. `pnpm build` succeeds for monorepo (or at minimum `pnpm --filter <themeName>-test build` if command scope is narrowed).
2. `pnpm type-check` succeeds after theme + `THEME_NAMES` update.

Files modified:
1. `.claude/commands/pipeline.stitch-design.md` (explicitly document no v1 auto visual diff)

---

## 10. Lockfile and Cleanup Compatibility

1. Run `pnpm install --lockfile-only`; fallback `pnpm install`.
2. Stage guidance in command should include `pnpm-lock.yaml`, `packages/themes/<themeName>/`, `sites/<themeName>-test/`, `packages/theme-system/src/types.ts` (still no commit).
3. Update `.claude/commands/pipeline.kill-site.md` normalization logic:
1. Accept `test-<name>` and `<name>-test` as direct names.
2. Accept bare `<name>` and resolve to `<name>-test` first, fallback `test-<name>` for backward compatibility.

Verification gate:
1. `pipeline.kill-site <themeName>-test` removes new-style folder.
2. Existing old-style test folders still removable.

Files modified:
1. `.claude/commands/pipeline.kill-site.md`
2. `.claude/commands/pipeline.stitch-design.md`

---

## 11. Reporting Contract

Command output should include:
1. Assigned theme name.
2. Stitch project id/name.
3. Paths:
1. `output/ingestion/<themeName>-stitch/`
2. `packages/themes/<themeName>/`
3. `sites/<themeName>-test/`
4. Run command: `cd sites/<themeName>-test && npm run dev`.
5. Cleanup command: `/pipeline.kill-site <themeName>-test`.
6. Explicit note: no commit/push performed.

---

## 12. Risks and Mitigations

1. Stitch MCP schema/tool drift.
1. Mitigation: add explicit tool capability checks and clear hard-fail diagnostics.
2. Token incompleteness causing invalid theme config.
1. Mitigation: deterministic fallback table + mapping report artifact.
3. Naming divergence (`test-<name>` vs `<name>-test`).
1. Mitigation: dual-format support in cleanup command.
4. Overfitting globals.css to one generated design.
1. Mitigation: keep globals token-driven and conservative; avoid hardcoded palette values.

---

## 13. Execution Order (recommended)

1. Implement `.claude/commands/pipeline.stitch-design.md` end-to-end (preflight -> Stitch -> theme -> test site -> verify -> report).
2. Update `.claude/commands/pipeline.kill-site.md` for naming compatibility.
3. Dry-run with `--trade "electrical contractor"`.
4. Validate gates: output artifacts, theme package, `THEME_NAMES`, test site marker, type-check/build.
5. Document any Stitch-tool-specific prompt tuning discovered during dry run in command file comments.
