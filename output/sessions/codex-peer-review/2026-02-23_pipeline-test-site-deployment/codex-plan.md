# Codex Implementation Plan — Pipeline Test Site Deployment Safety

## 1. Clarify safety contract and close scope gaps
1. Lock the operational contract for test sites: they are local preview workspaces, installable by pnpm, but must be CI-inert by default.
2. Explicitly separate two classes of failures:
- `Install-time` failures (`ERR_PNPM_OUTDATED_LOCKFILE`) from workspace graph drift.
- `Task-time` failures (Turbo running `build/type-check/lint` scripts in `sites/test-*`).
3. Decide fail policy for generation quality:
- Hard-fail component generation at file level when prop access is invalid after fixer.
- Do not hard-fail whole ingestion run unless configured; generate placeholder component instead and surface warning.

Files to touch:
- `.claude/commands/pipeline.ingest.md`
- `.claude/commands/pipeline.kill-site.md`
- `tools/lib/theme-component-generator.ts`
- `tools/__tests__/theme-component-generator.test.ts`
- Add command docs/tests as needed

Verification gate:
- Baseline `pnpm type-check` before edits.

Risks/trade-offs:
- If whole-run hard-fail is chosen, operator experience worsens for noisy AI output. Placeholder fallback is safer for throughput.

## 2. Make test sites CI-inert at creation time (upstream fix)
1. Update `/pipeline.ingest` Step 5c to rewrite `sites/test-<theme>/package.json` with an explicit script allowlist, not just `name`:
- Keep only: `dev`, `start`, `clean`.
- Remove: `build`, `type-check`, `lint`, `test`, `validate:*`, `test:*`.
2. Add a hard verification immediately after rewrite:
- Read back `package.json` and fail if any blocked script keys remain.
3. Add a marker field in package metadata (e.g., `"pipelineTestSite": true`) for deterministic guardrails in future tooling.

Files to modify:
- `.claude/commands/pipeline.ingest.md`

Verification gate:
- `cat sites/test-<theme>/package.json` contains only allowed scripts.
- `pnpm -r run build` no longer schedules `sites/test-*` tasks.

Risks/trade-offs:
- Copying full dependencies/devDependencies is still heavy; acceptable because non-goal excludes workspace glob changes.

## 3. Enforce lockfile hygiene in ingest and cleanup flows
1. In `/pipeline.ingest`, make lockfile update an explicit required gate after site/theme generation:
- Run `pnpm install --lockfile-only` (fast, deterministic lock update).
- If it fails, fallback to `pnpm install` and report why.
2. Add report instruction: do not push unless `pnpm-lock.yaml` changes are staged with generated site/theme changes.
3. In `/pipeline.kill-site`, add lockfile reconciliation step:
- After deleting site, run `pnpm install --lockfile-only`.
- If lockfile-only fails due to environment, instruct fallback `pnpm install`.
4. Keep kill-site idempotent: if site absent, skip install step unless `--reconcile-lockfile` option is requested.

Files to modify:
- `.claude/commands/pipeline.ingest.md`
- `.claude/commands/pipeline.kill-site.md`

Verification gate:
- After ingest: `git status --short pnpm-lock.yaml` shows expected update.
- After kill-site: `pnpm install --frozen-lockfile` succeeds locally.

Risks/trade-offs:
- Lockfile-only can still be slow in large repos; still materially faster than full install.

## 4. Harden `fixBracketNotationProps()` beyond lowercase kebab-case
1. Broaden match coverage from lowercase-hyphen only to quoted literal keys generally used in AI output:
- Support single/double quotes.
- Support mixed case, underscores, numbers, and hyphens.
- Keep restriction to `props["..."]`/`props['...']` only.
2. Normalize matched keys via `sanitiseSlotName()`-equivalent transformation so fixer and interface naming rules stay aligned.
3. Preserve safe expressions:
- Convert `props['post-thumbnail']` -> `props.postThumbnail`.
- Convert `props['cta_button']` -> `props.ctaButton`.
- Keep indexing behavior (`props['items'][0]` -> `props.items[0]`).
- Do not touch dynamic access (`props[key]`).
4. Add a second-pass detector for any residual quoted bracket access on `props` and treat as generation failure for that component (placeholder fallback + warning).

Files to modify:
- `tools/lib/theme-component-generator.ts`
- Optionally `tools/lib/theme-component-templates.ts` (if shared sanitizer exported/used)

Verification gate:
- Unit tests cover all supported/unsupported patterns.
- Generated TSX in `output/ingestion/<theme>/components` contains zero `props['` or `props["` patterns.

Risks/trade-offs:
- Aggressive regex can rewrite legitimate object maps if over-broad; constrain to direct `props['literal']` only.

## 5. Add strict generation validation gates (component-level hardfail)
1. Keep existing syntax validation, then enforce additional gate order:
- Token class validation
- Bracket prop fix
- Residual bracket detection (hard-fail component)
- Named export verification
2. Add optional semantic smoke gate for generated files:
- Parse AST and detect `ElementAccessExpression` rooted at `props` with string literal argument; if present, fail component.
3. Keep failure mode deterministic:
- Replace invalid component with placeholder, record warning in generation summary.

Files to modify:
- `tools/lib/theme-component-generator.ts`

Verification gate:
- Unit tests for residual detection and fallback path.
- Quick local generation test yields warnings, not broken TS.

Risks/trade-offs:
- More placeholders may appear initially; this is preferable to shipping invalid TS into theme package.

## 6. Strengthen prompt-level prevention (defense in depth)
1. Update component generation prompt rules to explicitly ban bracket notation on props:
- Required: `props.camelCase`
- Forbidden examples: `props['post-thumbnail']`, `props["hero-title"]`.
2. Keep post-processor as primary safety net because model output remains non-deterministic.

Files to modify:
- `tools/lib/theme-component-templates.ts`

Verification gate:
- Prompt unit/snapshot test (if present) or string assertion in tests.
- Reduced fixer hit-rate in generation logs over repeated runs.

Risks/trade-offs:
- Prompt changes alone are insufficient; must retain hard validator.

## 7. Add CI-facing safeguards without workspace exclusion
1. Add command-level verification in `/pipeline.ingest` report block:
- Run `pnpm build`, `pnpm type-check`, `pnpm lint` at root and report pass/fail before recommending push.
2. Add a lightweight policy check script/test (optional but recommended):
- Assert any `sites/test-*` package.json contains no CI scripts.
- Run this in existing test suite to prevent regressions in command instructions/manual edits.
3. Do not change `pnpm-workspace.yaml` or Turbo filters (explicit non-goal).

Files to modify/add:
- `.claude/commands/pipeline.ingest.md`
- `tools/__tests__/` new policy test (e.g., `test-site-package-policy.test.ts`)

Verification gate:
- Policy test fails if someone reintroduces `build/type-check/lint/test` in `sites/test-*`.

Risks/trade-offs:
- Command docs are not executable code; a policy test is the enforceable backstop.

## 8. Update `/pipeline.kill-site` lifecycle behavior
1. Keep current marker-based deletion logic.
2. Add post-delete cleanup gate:
- `pnpm install --lockfile-only` (or fallback `pnpm install`) to reconcile workspace graph.
3. Report explicit next-step status:
- Whether lockfile changed.
- Whether repo is back to pre-ingest state (via `git status --short`).

Files to modify:
- `.claude/commands/pipeline.kill-site.md`

Verification gate:
- Running kill-site twice remains success (idempotent).
- Second run does not break lockfile or install.

Risks/trade-offs:
- Automatic install may be undesirable for some workflows; provide a documented `--no-install` escape hatch if needed.

## 9. Testing plan (targeted, low-cost)
1. Unit tests for prop fixer/detector:
- Existing lowercase kebab cases.
- Mixed-case keys.
- Underscore keys.
- Numeric segments.
- Nested/index expressions.
- Dynamic keys unaffected.
2. Snapshot-style tests for test-site package trimming behavior (command-driven policy check).
3. Fast integration smoke (no full ingestion API cost):
- Use fixture JSX strings through generator post-processing.
- Validate lockfile reconciliation commands in dry-run docs or scripted assertions.

Files to modify/add:
- `tools/__tests__/theme-component-generator.test.ts`
- `tools/__tests__/test-site-package-policy.test.ts` (new)

Verification gate:
- `pnpm type-check`
- `pnpm --filter tools test` (or repo test equivalent)

Risks/trade-offs:
- Some command-file behavior is hard to unit test directly; policy tests should verify filesystem outputs instead of markdown text where possible.

## 10. Implementation order
1. Harden generator fixer + residual detector + tests (highest correctness impact).
2. Update prompt rules (prevention layer).
3. Update `/pipeline.ingest` package trimming + lockfile gates.
4. Update `/pipeline.kill-site` lockfile reconciliation.
5. Add policy test to prevent CI-script regressions in `sites/test-*`.
6. Run validation gates and one real ingest smoke run on `develop`.

## 11. Definition of done
1. Fresh `/pipeline.ingest` creates `sites/test-<theme>` with CI-inert scripts only.
2. Root `pnpm build`, `pnpm type-check`, `pnpm lint` do not fail because of test sites.
3. Lockfile is always reconciled by ingest/kill workflow before push.
4. Generated components have zero bracket-notation prop access (`props['...']` / `props["..."]`).
5. Automated tests cover the widened fixer patterns and policy regression checks.
6. Workflow remains `develop -> staging -> main` with no manual hotfix steps required.
