# Codex Implementation Plan — End-to-End Client Ingestion Pipeline (2026-02-20)

1. Baseline & guardrails

- Read current outputs quickly: skim `packages/intake-system/src/theme-extraction/theme-generator.ts` around L399–442, `tools/create-site-from-project.ts` around L624–743, `packages/intake-system/src/schemas/project-file.schema.ts`, and `packages/intake-system/src/chat-intake/system-prompt.ts` to confirm defects and interfaces. No code changes yet.
- Verification: none; just context to avoid regressions.

2. Fix theme generator output (Defect 1)

- File: `packages/intake-system/src/theme-extraction/theme-generator.ts`.
- Change `generateThemeConfigContent()` to emit the same shape as production sites:
  - Named export only: `export const themeConfig: DeepPartialThemeConfig = { ... }`.
  - Include `import type { DeepPartialThemeConfig } from '@platform/theme-system';`.
  - Do not use `defineTheme`; remove default export.
- Include a placeholder `componentRegistry` entry parameterised by caller: function accepts a registry name string so callers (orion/vega/other) can inject the correct import and assignment. If a registry name is not provided, default to `vegaRegistry` to keep tool usable.
- Add `componentRegistry` property to the returned string alongside colours/typography.
- Verification: run targeted unit (if present) or `pnpm lint` in package; additionally, run `node tools/generate-theme-from-reference.ts --help` to ensure it loads without runtime import errors.

3. Wire `generate-theme-from-reference.ts` to the corrected template

- File: `tools/generate-theme-from-reference.ts`.
- Remove or simplify regex patching now that `generateThemeConfigContent()` already outputs the correct imports/shape. Keep minimal logic to switch between `orionRegistry` and `vegaRegistry` imports based on classifier result.
- Verification: `node tools/generate-theme-from-reference.ts --url https://example.com --dry-run` prints a theme.config.ts that matches gold-standard format (visually check componentRegistry line present).

4. Add `themeVariant` to ProjectFile schema (Defect 3)

- File: `packages/intake-system/src/schemas/project-file.schema.ts`.
- Add optional field `themeVariant: z.enum(["orion", "vega"]).optional()` under the `theme` section.
- Export inferred type update if needed. Because optional, change is non-breaking.
- Verification: `pnpm lint` for the package; optionally run schema unit tests if exist.

5. Capture theme choice during intake (Defect 4)

- File: `packages/intake-system/src/chat-intake/system-prompt.ts`.
- Add a concise question/branch that asks which visual style fits the client (dark/bold trades vs light/clean professional), mapping explicitly to `orion` or `vega`. Ensure the prompt instructs the model to set `project.theme.themeVariant` in the final `generate_project_file` tool call.
- Verification: manual prompt read-through; optionally run a dry intake session to confirm `themeVariant` appears in generated JSON.

6. Fix site generator missing registry (Defect 2)

- File: `tools/create-site-from-project.ts`.
- In `generateThemeConfig(project)` ensure the emitted template includes `componentRegistry: orionRegistry | vegaRegistry` chosen from `project.theme.themeVariant` (default to vega if absent for backward compatibility).
- Add the corresponding import at the top of the generated file based on the variant.
- Verification: `node tools/create-site-from-project.ts --project sample.json --dry-run` and inspect output; ensure theme.config.ts contains componentRegistry and correct import.

7. End-to-end smoke

- Create a small fixture ProjectFile JSON with `themeVariant` set (both orion and vega cases). Run `tools/create-site-from-project.ts --project fixtures/... --dry-run` to generate output; check:
  - Generated `theme.config.ts` matches gold format, includes componentRegistry.
  - `pnpm --filter <generated-site> lint` or `type-check` passes (use the dry-run output if the tool supports writing to a temp dir; otherwise run on a throwaway site dir).
- Run `tools/generate-theme-from-reference.ts --url https://example.com --dry-run` to confirm it now emits valid theme config without manual edits.

8. Documentation & guard tests

- Add a short note in `packages/intake-system/README.md` (if exists) describing `themeVariant` field and expected values.
- Consider adding a lightweight jest/vitest snapshot for `generateThemeConfigContent()` to lock the emitted string format (imports + componentRegistry).
- Verification: tests pass.

Risks & mitigations

- Missing registry import defaults: default to vega to preserve existing behaviour; log a warning if themeVariant is absent to prompt operators.
- Intake prompt drift: keep the new question short and deterministic to avoid model verbosity; ensure the system prompt explicitly maps choices to enum values.
- Regex removal in theme generator tool: double-check that any previous edge cases (logo mode) still work; add a snapshot test to prevent regressions.

Next step

- Run `/plan.with.codex synthesise` in Claude Code after reviewing this plan.
