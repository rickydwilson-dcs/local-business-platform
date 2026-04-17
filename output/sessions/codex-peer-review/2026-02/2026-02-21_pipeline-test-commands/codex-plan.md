# Codex Implementation Plan: Pipeline Test Commands

## 1. Lock command design and safety contract

1. Add three command specs in `.claude/commands/`:

- `pipeline.ingest.md`
- `pipeline.kill-site.md`
- `pipeline.kill-theme.md`

2. Standardize temporary naming and ownership:

- site: `sites/test-<theme-name>/`
- marker: `sites/test-<theme-name>/.pipeline-test-site.json`

3. Require explicit branch precheck in each command (`develop` only).
4. Define idempotency policy:

- missing resources => warn and continue, not fail.

Files to create:

- `.claude/commands/pipeline.ingest.md`
- `.claude/commands/pipeline.kill-site.md`
- `.claude/commands/pipeline.kill-theme.md`

Verification gate:

- Commands contain deterministic preconditions, argument parsing pattern, and safe-stop behavior.

Risks/trade-offs:

- Markdown commands can drift from actual tooling behavior; include explicit validation commands in each flow.

## 2. Choose site creation strategy for `/pipeline.ingest`

1. Use direct copy from `sites/base-template` + targeted rewrites (not `create-site-from-project.ts`).
2. Rationale:

- avoids generating a large valid ProjectFile payload
- faster and deterministic for temporary test sites
- aligns with non-goal of full content generation

3. Copy scope for minimal visual verification:

- keep base-template app/content structure
- prune to minimal content set required by requested pages: home, one service page, blog listing + one blog post, contact

Files modified by command execution (runtime):

- `sites/test-<theme-name>/**` (new)
- `output/ingestion/<theme-name>/` (already produced by pipeline)

Verification gate:

- copied site boots with `pnpm --filter test-<theme-name> dev` (or site-local `pnpm dev`).

Risks/trade-offs:

- Bypassing ProjectFile schema means less formal validation, but this is a temporary test-site workflow.

## 3. Resolve theme wiring without generated registry support

1. Use generated theme tokens/components while keeping a known registry fallback:

- `theme.config.ts`: import `<theme>DefaultConfig` from `@platform/themes/<theme>`
- set `componentRegistry: vegaRegistry` as temporary fallback
- merge generated tokens over vega defaults for visual verification

2. Update site layout wiring:

- `app/layout.tsx` keep `ThemeProvider theme="vega" registry={vegaRegistry}` for compatibility
- test pages/components import generated theme components from `@platform/themes/<theme>/components`

3. Ensure theme CSS import switches to generated theme:

- `app/globals.css` imports `../../../packages/themes/<theme>/globals.css`

Files modified by command execution (runtime in test site):

- `sites/test-<theme-name>/theme.config.ts`
- `sites/test-<theme-name>/app/globals.css`
- optionally `sites/test-<theme-name>/app/layout.tsx` comments/docs only

Verification gate:

- test site renders generated component imports and generated token colors (not pure vega defaults).

Risks/trade-offs:

- registry fallback means structural variant metadata remains vega-like; acceptable for visual theme QA until generated registries exist.

## 4. Define `/pipeline.ingest` command workflow

1. Parse args: required `--url`, optional `--name`.
2. Run ingestion pipeline:

- `npx tsx tools/analyse-site.ts --url <url> [--name <name>]`

3. Determine resulting theme name:

- if `--name` supplied: use it
- else parse from pipeline output or resolve newest folder under `output/ingestion/`.

4. Create `sites/test-<theme-name>/` by copying `sites/base-template/`.
5. Rewrite key files for temporary mode:

- set site name/tagline markers to indicate temp site
- wire `theme.config.ts` and `globals.css` to generated theme
- add marker file `.pipeline-test-site.json` with source URL/theme/timestamp.

6. Minimal content pruning/setup:

- ensure one service MDX and one blog post MDX exist
- keep list/detail routes functional with minimal fixtures.

7. Validate:

- `pnpm --filter test-<theme-name> type-check` (or site-local type-check)
- smoke start command instruction for user.

Files created/modified at runtime:

- `sites/test-<theme-name>/**`
- `sites/test-<theme-name>/.pipeline-test-site.json`

Verification gate:

- command ends with explicit “site ready” output and exact run command for dev server.

Risks/trade-offs:

- if pipeline fails mid-run after theme scaffold, command must stop and report cleanup suggestions.

## 5. Define `/pipeline.kill-site` cleanup scope and idempotency

1. Required arg: site slug (`test-<name>` expected).
2. Safety checks:

- confirm target path under `sites/`
- refuse delete if marker missing unless `--force` specified

3. Cleanup actions:

- remove `sites/<slug>/`
- remove `.next` artifacts in site if present
- remove site-specific temporary caches if present
- run optional workspace prune/install refresh only when needed (`pnpm install` if lock/workspace links stale)

4. Do not touch themes or ingestion outputs in this command.

Files removed by command execution:

- `sites/test-<name>/` directory tree

Verification gate:

- rerunning command on missing site produces clean “already removed” result.
- `git status` shows no residual tracked site files.

Risks/trade-offs:

- aggressive cache cleanup can be slow; keep default narrow and only escalate on detection.

## 6. Define `/pipeline.kill-theme` inverse scaffold cleanup

1. Required arg: `<theme-name>`.
2. Remove theme package directory:

- `packages/themes/<name>/`

3. Update `packages/themes/package.json` exports:

- remove `./<name>`
- remove `./<name>/manifest`
- remove `./<name>/showcase`
- remove `./<name>/components` (if present)

4. Remove from `THEME_NAMES` in `packages/theme-system/src/types.ts`.
5. Remove from `ThemeName` union in `packages/core-components/src/context/theme-context.tsx`.
6. Idempotency:

- if any target already absent, continue with warning.

Files modified by command execution:

- `packages/themes/package.json`
- `packages/theme-system/src/types.ts`
- `packages/core-components/src/context/theme-context.tsx`
- remove `packages/themes/<name>/`

Verification gate:

- no lingering string references to theme in those files.
- `pnpm type-check` passes after removal.

Risks/trade-offs:

- string-based edits can corrupt arrays/unions; command should use minimal structured editing steps and post-checks.

## 7. Add robustness checks for all commands

1. Preflight checks:

- branch is `develop`
- working tree cleanliness warning (do not auto-stash)

2. Post-action checks:

- for ingest: verify theme directory and site directory both exist
- for kill commands: verify targets absent

3. Optional final consistency check:

- `git status --short`
- `pnpm type-check` (for kill-theme).

Files created/modified:

- only command markdown files; runtime affects existing paths above.

Verification gate:

- each command has a final “Success criteria checklist” section.

Risks/trade-offs:

- requiring full type-check on every kill can be slow; keep it required for kill-theme, optional for kill-site.

## 8. Command interaction model

1. `pipeline.ingest.md` syntax:

- `/pipeline.ingest --url https://example.com [--name atlas]`

2. `pipeline.kill-site.md` syntax:

- `/pipeline.kill-site test-atlas [--force]`

3. `pipeline.kill-theme.md` syntax:

- `/pipeline.kill-theme atlas`

4. Commands should echo resolved names before mutating files.

Files created:

- `.claude/commands/pipeline.ingest.md`
- `.claude/commands/pipeline.kill-site.md`
- `.claude/commands/pipeline.kill-theme.md`

Verification gate:

- argument examples in each file match actual command usage.

Risks/trade-offs:

- mismatch between command docs and tooling options causes operator error; keep examples executable as-is.

## 9. Sequencing and rollout

1. Phase A: add command files and dry-run documentation flow.
2. Phase B: validate ingest path with one known URL and explicit `--name`.
3. Phase C: validate cleanup symmetry:

- run ingest
- run kill-site
- run kill-theme
- confirm state with `git status`.

4. Phase D: tighten idempotency and force-mode behavior.

Verification gate:

- full loop returns repository to pre-run state (except intentionally preserved ingestion output if policy says keep it).

Risks/trade-offs:

- “exact same state” can fail if command regenerates lockfiles; commands should avoid touching dependency graph unless necessary.

## 10. Explicit open decisions to include in final synthesis

1. Whether `/pipeline.kill-site` should also delete `output/ingestion/<theme>/` when marker links them.
2. Whether ingest should auto-run `pnpm --filter test-<theme> dev` smoke check or only provide command.
3. Whether generated theme registry fallback should be `vegaRegistry` always or configurable (`--registry-fallback orion|vega`).
