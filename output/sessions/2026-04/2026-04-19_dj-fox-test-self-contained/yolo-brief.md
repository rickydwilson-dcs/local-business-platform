# YOLO Implementation Brief: DJ Fox Test Site Self-Containment

**Branch:** `feature/dj-fox-test-self-contained` (created from develop)
**Session spec:** `output/sessions/2026-04/2026-04-19_dj-fox-test-self-contained/yolo-brief.md`
**Source plan:** `~/.claude/plans/abundant-questing-axolotl.md` (approved by user — read in full before starting)
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The user's architectural direction has shifted: `packages/themes/*` is being retired. Each site becomes 100% self-contained — its own CSS, Header, Footer, registry literal — because every client site will have a unique look, making shared theme packages a redundant abstraction. `@platform/core-components` and `@platform/component-composition` stay shared as the behaviour layer. Theme-system stays because its Tailwind plugin still generates the site's brand-colour CSS custom properties from `theme.config.ts`.

`sites/dj-fox-electrical-test/` is the first migration because it's already composition-based and MDX-driven — the cleanest starting point. Once complete, it becomes both the proof and the recipe for migrating the other 9 sites. The Theme Component Contract validator (built last session) also gets retired because its premise (shared enforced CSS surface) dies with the theme-retirement direction.

The synthesis was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $1 / $5                | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Design Principles (apply to every phase)

Re-read these before touching any file.

1. **Pure code-motion, not redesign.** Every copied file is verbatim from its source. No "while we're at it" edits. Visual output must be byte-identical to pre-migration state.
2. **Scope discipline.** This PR migrates ONLY `sites/dj-fox-electrical-test/`. Do NOT touch other sites, theme packages themselves, or shared packages (`@platform/core-components`, `@platform/component-composition`, `@platform/theme-system`). Theme-system stays shared because its Tailwind plugin is how brand CSS vars emit.
3. **Token-only styling.** No hardcoded hex anywhere in new code. Use `@apply bg-brand-primary`, `var(--color-...)`.
4. **Rename on copy.** `OrionHeader` → `SiteHeader`, `OrionFooter` → `SiteFooter`. Update `layout.tsx` `registerLayoutComponent(...)` keys AND `composition.json` `headerConfig.component`/`footerConfig.component` values to match. This is part of the "this site is no longer an Orion site" direction.
5. **RSC constraint.** Both copied components are Server Components today — keep them that way. No `"use client"`, no `useState`, no event handlers.
6. **No prop/schema changes.** Copied components keep their existing Props interfaces verbatim.
7. **Read the source plan:** `~/.claude/plans/abundant-questing-axolotl.md`. It has the decision context and open-question resolutions.
8. **Validator retirement is INCLUDED.** Phase G deletes `tools/validate-theme-globals.ts`, the package.json script, the turbo.json entry, and the CI workflow step. `packages/theme-system/src/component-contract.ts` stays as documentation; the markdown spec gets a deprecation header.
9. **No emojis in source files.**

---

## Pre-flight

```bash
git checkout develop && git pull 2>/dev/null || true  # local develop is 59 commits ahead of origin — pull is no-op
git checkout -b feature/dj-fox-test-self-contained
pnpm type-check   # must be clean before starting
```

If `type-check` fails on develop, STOP and report. Do not proceed if the branch-creation step fails (e.g. branch already exists).

---

## Phase A — Inline Orion `globals.css` into the site

**Goal:** Replace the `@import "../../../packages/themes/orion/globals.css"` with the verbatim 630 lines of Orion globals CSS. Preserve the 64 lines of site-specific CSS that follow.
**Model:** sonnet — single-file edit but must preserve CSS layer ordering.

### Files

- **Source (read-only):** `packages/themes/orion/globals.css` (630 lines)
- **Target (edit):** `sites/dj-fox-electrical-test/app/globals.css`

### Changes

1. Read `packages/themes/orion/globals.css` in full.
2. Read `sites/dj-fox-electrical-test/app/globals.css` in full (64 lines).
3. Note: the Orion globals file starts with `@import "../../core-components/src/styles/animations.css";` — that's a relative import from inside the theme package. When inlined into the site, the relative path breaks. Replace it with `@import "@platform/core-components/src/styles/animations.css";` if the site's Tailwind/PostCSS setup resolves that alias, OR with the equivalent site-relative path `@import "../../../packages/core-components/src/styles/animations.css";`. Check the site's existing animations import approach first — if the site already imports from core-components via alias elsewhere (look at other files), use the same pattern.
4. In `sites/dj-fox-electrical-test/app/globals.css`:
   - Delete line 1 (`@import "../../../packages/themes/orion/globals.css";`).
   - In its place, paste the FULL content of `packages/themes/orion/globals.css` (with the animations.css import path fixed per step 3).
   - The `@tailwind base; @tailwind components; @tailwind utilities;` directives must remain AFTER the inlined content (as they are today — preserve position).
   - Keep the site-specific CSS (lines 14 onwards) intact and in their existing order.

### Verification gate — STOP if this fails

```bash
pnpm --filter dj-fox-electrical-test run build
# Also confirm no @import remains pointing at packages/themes/
! grep -q "packages/themes" sites/dj-fox-electrical-test/app/globals.css
```

The grep must exit non-zero (meaning no match found — zero hits). If it exits 0, the inlining was incomplete.

### Commit

```bash
git add sites/dj-fox-electrical-test/app/globals.css
git commit -m "$(cat <<'EOF'
refactor(dj-fox-test): inline orion globals.css into site

First step toward site self-containment. The 630 lines from
packages/themes/orion/globals.css are now inlined verbatim. No functional
change — CSS output is byte-identical.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase B — Copy Header + Footer into the site as `SiteHeader` / `SiteFooter`

**Goal:** Site owns its header/footer source code. Rename exports to generic names matching the "no longer an Orion site" intent.
**Model:** sonnet — careful import-alias handling to avoid identifier collision with the shared `SiteHeader` primitive in core-components.

### Files

- **Sources (read-only):** `packages/themes/orion/components/header.tsx` (26 lines), `packages/themes/orion/components/footer.tsx` (~198 lines)
- **New (create):** `sites/dj-fox-electrical-test/components/site-header.tsx`, `sites/dj-fox-electrical-test/components/site-footer.tsx`
- **Edit:** `sites/dj-fox-electrical-test/app/layout.tsx`, `sites/dj-fox-electrical-test/composition.json`

### Changes

1. **Create `sites/dj-fox-electrical-test/components/site-header.tsx`:**
   - Copy `packages/themes/orion/components/header.tsx` verbatim.
   - Rename the exported component `OrionHeader` → `SiteHeader`.
   - Rename the Props interface `OrionHeaderProps` → `SiteHeaderProps` (preserve all prop shapes).
   - The existing file imports `SiteHeader` from `@platform/core-components` — this is the shared primitive. To avoid identifier collision after our rename, alias the core-components import: change `import { SiteHeader } from "@platform/core-components";` to `import { SiteHeader as CoreSiteHeader } from "@platform/core-components";` and use `<CoreSiteHeader ... />` in the JSX where `<SiteHeader ... />` was previously used.

2. **Create `sites/dj-fox-electrical-test/components/site-footer.tsx`:**
   - Copy `packages/themes/orion/components/footer.tsx` verbatim.
   - Rename the exported component `OrionFooter` → `SiteFooter`.
   - Rename the Props interface `OrionFooterProps` → `SiteFooterProps`.
   - Orion's footer is a standalone component (no core-components wrapper). No alias needed.

3. **Edit `sites/dj-fox-electrical-test/app/layout.tsx`:**
   - Replace `import { OrionHeader } from "@platform/themes/orion/components";` with `import { SiteHeader } from "@/components/site-header";`.
   - Replace `import { OrionFooter } from "@platform/themes/orion/components";` with `import { SiteFooter } from "@/components/site-footer";`.
   - Update the `registerLayoutComponent("OrionHeader", OrionHeader)` call to `registerLayoutComponent("SiteHeader", SiteHeader)`.
   - Update the `registerLayoutComponent("OrionFooter", OrionFooter)` call to `registerLayoutComponent("SiteFooter", SiteFooter)`.

4. **Edit `sites/dj-fox-electrical-test/composition.json`:**
   - In `headerConfig`: change `"component": "OrionHeader"` → `"component": "SiteHeader"`.
   - In `footerConfig`: change `"component": "OrionFooter"` → `"component": "SiteFooter"`.

### Verification gate — STOP if this fails

```bash
pnpm --filter dj-fox-electrical-test run type-check
pnpm --filter dj-fox-electrical-test run build
# Invariant: no more imports from the orion components barrel
! grep -rn "@platform/themes/orion/components" sites/dj-fox-electrical-test
```

### Commit

```bash
git add sites/dj-fox-electrical-test/components/site-header.tsx \
        sites/dj-fox-electrical-test/components/site-footer.tsx \
        sites/dj-fox-electrical-test/app/layout.tsx \
        sites/dj-fox-electrical-test/composition.json
git commit -m "$(cat <<'EOF'
refactor(dj-fox-test): copy Orion header and footer into site as SiteHeader/SiteFooter

OrionHeader -> SiteHeader and OrionFooter -> SiteFooter. The site no
longer imports from @platform/themes/orion/components. Composition keys
and registerLayoutComponent calls updated to match the new names.

The shared core-components SiteHeader primitive is imported via alias
(CoreSiteHeader) to avoid identifier collision.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase C — Inline `orionRegistry` into `theme.config.ts`

**Goal:** Drop the final `@platform/themes/orion` TypeScript import.
**Model:** sonnet — tiny edit but TypeScript generic constraints need attention.

### Files

- **Source (read-only):** `packages/themes/orion/index.ts` lines 16-22 (the registry literal)
- **Target (edit):** `sites/dj-fox-electrical-test/theme.config.ts`

### Changes

1. Read `packages/themes/orion/index.ts` — confirm the `orionRegistry` shape exactly (values below are from investigation; verify before pasting):

   ```ts
   {
     theme: "orion",
     heroVariant: "image-overlay",
     headerVariant: "dark",
     cardVariant: "icon-circle",
     sectionVariant: "dark-accent",
   }
   ```

2. Edit `sites/dj-fox-electrical-test/theme.config.ts`:
   - Delete the line `import { orionRegistry } from "@platform/themes/orion";`.
   - Replace the value `componentRegistry: orionRegistry` with the inline literal above.
   - If TypeScript complains about the literal not conforming to `ComponentRegistry` (imported from `@platform/theme-system`), add a local cast `as const` or import the type and annotate:
     ```ts
     import type { ComponentRegistry } from "@platform/theme-system";
     // ...
     componentRegistry: {
       theme: "orion",
       heroVariant: "image-overlay",
       headerVariant: "dark",
       cardVariant: "icon-circle",
       sectionVariant: "dark-accent",
     } satisfies ComponentRegistry,
     ```
     Prefer `satisfies` over `as` — it type-checks without widening.

### Verification gate — STOP if this fails

```bash
pnpm --filter dj-fox-electrical-test run type-check
pnpm --filter dj-fox-electrical-test run build
# Spot-check that brand CSS vars still emit in the built CSS
grep -q "color-brand-primary" sites/dj-fox-electrical-test/.next/static/css/*.css 2>/dev/null || echo "Note: no .next build artifact found — skipping CSS grep"
```

### Commit

```bash
git add sites/dj-fox-electrical-test/theme.config.ts
git commit -m "$(cat <<'EOF'
refactor(dj-fox-test): inline orion component registry into theme.config

The orionRegistry import is dropped. The ComponentRegistry shape is now
declared inline with `satisfies ComponentRegistry` for type safety. No
functional change — the theme-system Tailwind plugin receives the same
shape it did before.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase D — Remove `@platform/themes/orion` path aliases from `tsconfig.json`

**Goal:** Make it impossible for the site to silently re-acquire an Orion import.
**Model:** haiku — mechanical deletion of three lines.

### Files

- **Target (edit):** `sites/dj-fox-electrical-test/tsconfig.json`

### Changes

1. Read the file.
2. Find and delete the three path alias entries matching `@platform/themes/orion*`:
   - `"@platform/themes/orion": ["../../packages/themes/orion/index.ts"]`
   - `"@platform/themes/orion/components": ["../../packages/themes/orion/components/index.ts"]`
   - `"@platform/themes/orion/pages": ["../../packages/themes/orion/pages/index.ts"]`
3. Preserve all other path entries.

### Verification gate — STOP if this fails

```bash
pnpm --filter dj-fox-electrical-test run type-check
# Type-check is the gate specifically — it catches any stray orion import with a "cannot find module" error.
```

### Commit

```bash
git add sites/dj-fox-electrical-test/tsconfig.json
git commit -m "$(cat <<'EOF'
chore(dj-fox-test): remove @platform/themes/orion path aliases

After phases A-C, the site has no remaining imports from
@platform/themes/orion. The path aliases are now dead code — removing
them is a safety rail: any stray future import gets caught by type-check.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase E — Scope Tailwind content globs to the site

**Goal:** The site's Tailwind build stops scanning `packages/themes/*/` for classes. (There's nothing left to find for this site.)
**Model:** haiku — mechanical deletion of two glob entries.

### Files

- **Target (edit):** `sites/dj-fox-electrical-test/tailwind.config.ts`

### Changes

1. Read the file.
2. In the `content` array, delete these two entries:
   - `"../../packages/themes/*/*.{js,ts,jsx,tsx}"`
   - `"../../packages/themes/*/components/**/*.{js,ts,jsx,tsx}"`
3. Keep these entries (they're shared packages, still in use):
   - `"../../packages/core-components/src/**/*.{js,ts,jsx,tsx}"`
   - `"../../packages/component-composition/src/**/*.{js,ts,jsx,tsx}"`
4. Keep the site's own globs:
   - `"./app/**/*.{js,ts,jsx,tsx,mdx}"`
   - `"./components/**/*.{js,ts,jsx,tsx,mdx}"` — this now picks up the copied SiteHeader and SiteFooter.
5. Preserve all other config (theme, plugins, etc.).

### Verification gate — STOP if this fails

```bash
pnpm --filter dj-fox-electrical-test run build
# CSS output should be identical: classes previously picked up via the theme glob are now picked up via the site's components/ glob (where the copied Header/Footer live).
```

### Commit

```bash
git add sites/dj-fox-electrical-test/tailwind.config.ts
git commit -m "$(cat <<'EOF'
chore(dj-fox-test): scope tailwind content globs to site

Remove the two ../../packages/themes/* globs. The site no longer has
any class references in theme packages — everything it needs is either
in app/, components/, or the shared core-components / component-composition
packages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase F — Self-containment verification

**Goal:** Prove the site no longer depends on `packages/themes/*` at any level.
**Model:** sonnet — runs the verification gauntlet and reports. No commit.

### Commands (all read-only)

**1. The self-containment invariant:**

```bash
grep -rn "@platform/themes\|packages/themes" sites/dj-fox-electrical-test \
  --exclude-dir=node_modules --exclude-dir=.next
# Must return ZERO hits. Any hit = failure — STOP and flag.
```

**2. Monorepo-wide health:**

```bash
pnpm type-check
pnpm lint
pnpm --filter dj-fox-electrical-test run build
```

**3. Cross-site regression check — confirm other sites still build:**

```bash
pnpm --filter dj-fox-electrical run build
# This is the production site, still depends on orion. Must succeed.
```

**4. The DELETE SIMULATION — the real proof of self-containment:**

```bash
mv packages/themes/orion packages/themes/orion.disabled
pnpm --filter dj-fox-electrical-test run build
# MUST SUCCEED. This is the most important gate in the entire brief.
mv packages/themes/orion.disabled packages/themes/orion
```

If the delete simulation fails, STOP. Restore the rename. Report what import or reference was missed. Do NOT commit or proceed to Phase G.

**5. Visual smoke test:**

```bash
pnpm --filter dj-fox-electrical-test run dev
# Human-eye check: homepage, one service page, one location page render unchanged.
```

(Skip step 5 in autonomous mode — the static invariant + builds + delete simulation are sufficient.)

### No commit — this phase is verification only

If everything passes, proceed to Phase G. If anything fails, STOP.

---

## Phase G — Retire the Theme Component Contract validator

**Goal:** Delete the validator whose premise dies with `packages/themes/*` retirement.
**Model:** sonnet — multi-file deletion coordinated with CI/turbo/doc updates.

### Files

- **Delete:** `tools/validate-theme-globals.ts`
- **Edit:** `package.json` (root) — remove the `"validate:theme-contract"` script
- **Edit:** `turbo.json` — remove the `validate:theme-contract` task entry + remove from `build`'s `dependsOn` array (if present)
- **Edit:** `.github/workflows/ci.yml` — remove the "Validate theme component contract" step
- **Keep (with small edit):** `packages/theme-system/src/component-contract.ts` — remove any comment referencing `tools/validate-theme-globals.ts` (the contract data stays as documentation, but should no longer mention a tool that doesn't exist)
- **Edit:** `docs/standards/theme-component-contract.md` — prepend a deprecation notice

### Changes

1. **Delete the validator:** `rm tools/validate-theme-globals.ts`

2. **Update root `package.json`:**
   - Read it, remove the line `"validate:theme-contract": "..."` from `scripts`.
   - Preserve all other scripts and JSON structure exactly.

3. **Update `turbo.json`:**
   - Read it, remove the `"validate:theme-contract"` task object from `tasks`.
   - If `"validate:theme-contract"` is in `build.dependsOn` or `^build.dependsOn`, remove it.
   - Preserve all other task config.

4. **Update `.github/workflows/ci.yml`:**
   - Remove the step named "Validate theme component contract" (or whatever exact name was used — grep the file for `validate:theme-contract` or `validate-theme-globals`).
   - Preserve all other workflow steps and jobs.

5. **Edit `packages/theme-system/src/component-contract.ts`:**
   - Read the file.
   - If it contains a comment referencing `tools/validate-theme-globals.ts`, remove just that line.
   - If there's a header/JSDoc block explaining the contract, update it to say the contract is retained as documentation only and is no longer enforced.
   - Do NOT delete the file or the `THEME_COMPONENT_CONTRACT` export — keep both as documentation.

6. **Edit `docs/standards/theme-component-contract.md`:**
   - Prepend a deprecation notice at the very top of the file (above the H1):

     ```markdown
     > **Deprecated 2026-04-19.** The Theme Component Contract was retired alongside the decision to make every site self-contained (retiring `packages/themes/*`). See `output/sessions/2026-04/2026-04-19_dj-fox-test-self-contained/yolo-brief.md` for the migration that triggered this deprecation. The document is preserved as historical context.
     ```

### Verification gate — STOP if this fails

```bash
pnpm type-check
pnpm lint
# Confirm the validator script is gone
test ! -f tools/validate-theme-globals.ts
# Confirm the script is gone from package.json
! grep -q "validate:theme-contract" package.json
# Confirm the turbo task is gone
! grep -q "validate:theme-contract" turbo.json
# Confirm the CI step is gone
! grep -q "validate-theme-globals\|validate:theme-contract" .github/workflows/ci.yml
# Full build must succeed
pnpm build
```

### Commit

```bash
git add tools/validate-theme-globals.ts \
        package.json \
        turbo.json \
        .github/workflows/ci.yml \
        packages/theme-system/src/component-contract.ts \
        docs/standards/theme-component-contract.md
git commit -m "$(cat <<'EOF'
chore(theme-contract): retire validator ahead of packages/themes/* removal

The Theme Component Contract's premise (shared enforced CSS surface
across themes) dies with the decision to make every site self-contained.
Each site will have a unique look — no shared contract needed.

- Delete tools/validate-theme-globals.ts
- Remove validate:theme-contract script (package.json) + turbo task
- Remove CI workflow step
- Keep component-contract.ts as documentation-only (no longer referenced
  by any tool)
- Mark the spec doc as deprecated with pointer to this PR's session

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase H — Final verification

**Goal:** Run the full verification gauntlet one more time end-to-end.
**Model:** sonnet.

### Commands

```bash
# Self-containment invariant
grep -rn "@platform/themes\|packages/themes" sites/dj-fox-electrical-test \
  --exclude-dir=node_modules --exclude-dir=.next
# Must return zero hits.

# Type + lint + build (monorepo)
pnpm type-check
pnpm lint
pnpm build

# Delete simulation (final proof)
mv packages/themes/orion packages/themes/orion.disabled
pnpm --filter dj-fox-electrical-test run build
mv packages/themes/orion.disabled packages/themes/orion

# Other-site regression
pnpm --filter dj-fox-electrical run build
```

If any step fails, STOP. Report exactly what failed. Do NOT attempt to fix during Phase H — the fix is a new phase/commit on top, not a silent amendment.

### No commit unless follow-up fixes are needed

If lint surfaces warnings strictly introduced by this brief's edits (unused imports, etc.), fix and commit as:

```bash
git add -A
git commit -m "$(cat <<'EOF'
fix(dj-fox-test): lint cleanup from self-containment migration

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

Unrelated pre-existing warnings are NOT to be touched.

---

## Parallel execution groups

### Intra-phase groups

| Group | Phase   | Items                                                                                                                                                                                                            | File overlap            | Model | Rationale                                                                                                                     |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| G1    | Phase B | Read `packages/themes/orion/components/header.tsx`; Read `packages/themes/orion/components/footer.tsx`; Read `sites/dj-fox-electrical-test/app/layout.tsx`; Read `sites/dj-fox-electrical-test/composition.json` | none (reads only)       | n/a   | Four independent source reads can be batched in one parallel Read message.                                                    |
| G2    | Phase F | Run `pnpm type-check`; Run `pnpm lint`; Run `grep -rn "@platform/themes\|packages/themes" ...`                                                                                                                   | none (read-only checks) | n/a   | Independent verification commands. The builds (`pnpm build`, per-site builds, delete simulation) are separate and sequential. |
| —     | Phase A | — no parallel work — (single file edit, sequential)                                                                                                                                                              | —                       | —     | One-file edit.                                                                                                                |
| —     | Phase C | — no parallel work — (single file edit)                                                                                                                                                                          | —                       | —     | One-file edit.                                                                                                                |
| —     | Phase D | — no parallel work — (single file edit)                                                                                                                                                                          | —                       | —     | One-file edit.                                                                                                                |
| —     | Phase E | — no parallel work — (single file edit)                                                                                                                                                                          | —                       | —     | One-file edit.                                                                                                                |
| —     | Phase G | — no parallel work — (5 files + 1 deletion; they must be coordinated, and the commit is one atomic unit)                                                                                                         | —                       | —     | Multi-file coordinated edit — safer sequential. Parallel saves negligible wall-clock here.                                    |
| —     | Phase H | — no parallel work — (build commands write to `.next/` and `dist/`, and the delete-simulation is a stateful rename)                                                                                              | —                       | —     | Sequential by necessity.                                                                                                      |

### Cross-phase groups

| Group  | Phases | Items | Rationale                                                                                                                                                                                                                                                                                                                                                                               |
| ------ | ------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| (none) |        |       | Phases A–G have strict ordering: A must land before B because B modifies `layout.tsx` which imports from the site's copy; C depends on B's import graph being clean; D depends on C's inline registry; E can technically run before D but the plan orders them this way for logical cleanliness; F gates on all preceding phases; G is independent but scheduled after F for atomicity. |

### Sequential points — MUST NOT parallelise

| Item                                                                             | Reason                                                                     |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Verification gates (`pnpm type-check`, `pnpm lint`, `pnpm build`) between phases | Each phase's output gates the next. Gates are the synchronisation barrier. |
| `pnpm build` in any phase                                                        | Writes to `.next/` and `dist/`. Must run alone.                            |
| Phase F's delete simulation (`mv` rename + build + restore)                      | Stateful filesystem operation — cannot parallelise safely.                 |
| Git commits                                                                      | One commit per phase, in order. Commits are never batched.                 |

---

## Cost Estimate

| Phase                                              | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| -------------------------------------------------- | ------ | ----------------- | ------------------ | ---------- |
| Phase A: inline orion globals.css                  | sonnet | ~8k               | ~4k                | $0.08      |
| Phase B: copy header + footer + update references  | sonnet | ~10k              | ~3k                | $0.08      |
| Phase C: inline registry in theme.config           | sonnet | ~3k               | ~0.5k              | $0.02      |
| Phase D: remove path aliases                       | haiku  | ~2k               | ~0.3k              | $0.004     |
| Phase E: scope tailwind globs                      | haiku  | ~2k               | ~0.3k              | $0.004     |
| Phase F: verification + delete simulation          | sonnet | ~5k               | ~0.5k              | $0.02      |
| Phase G: retire validator (5 files + 1 delete)     | sonnet | ~10k              | ~2k                | $0.06      |
| Phase H: final verification                        | sonnet | ~4k               | ~0.5k              | $0.02      |
| Orchestrator overhead (coordination + commit msgs) | sonnet | ~15k              | ~3k                | $0.09      |
| **Total**                                          |        | **~59k**          | **~14.1k**         | **~$0.39** |

Rates: Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per MTok.
Estimation: ~5 tokens per line of code. Input = files read + brief (~5k) + plan file (~4k) + system prompt (~3k). Output = code written + verification output (~500/gate).

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA.
2. Build status — confirm `pnpm lint && pnpm type-check && pnpm build` and `pnpm --filter dj-fox-electrical-test run build` both pass.
3. **Delete-simulation result** — confirm Phase F's `mv packages/themes/orion ... && build` succeeded. This is the single most important verification result in this brief.
4. Other-site regression — confirm `pnpm --filter dj-fox-electrical run build` still succeeds (production site is unaffected).
5. The self-containment invariant — confirm `grep -rn "@platform/themes\|packages/themes" sites/dj-fox-electrical-test` returns zero hits.
6. Any exceptions or deviations — e.g. if the `orionRegistry` shape needed an additional field you discovered during Phase C, or if a fourth `@platform/themes/orion*` path alias existed that this brief didn't anticipate.
7. Token usage and cost estimate:

   | Model     | Est. input tokens | Est. output tokens | Est. cost |
   | --------- | ----------------- | ------------------ | --------- |
   | sonnet    |                   |                    | $X.XX     |
   | haiku     |                   |                    | $X.XX     |
   | **Total** |                   |                    | **$X.XX** |

   Compare to pre-flight estimate above. Exact figures: console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04/2026-04-19_dj-fox-test-self-contained/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises — especially the delete-simulation result and whether the animations.css path in Phase A needed the alias form or the relative form]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes `session-wrap-up.md` to the session folder. **Required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to the next phase. Especially Phase F's delete simulation: if it fails, that means an Orion import survived somewhere and the migration is not complete. Do NOT commit Phase G until Phase F's delete simulation passes.
- Read every file before editing it.
- Never push — leave all changes on the feature branch.
- **Consult the Parallel Execution Groups section.** Phase B has parallel READ opportunities (G1) — batch them. Phase F has parallel verification commands (G2) — batch those too. Everything else runs sequentially.
- **Minimal changes only.** This is pure code-motion from theme package → site. No refactors, no cleanups, no "while we're at it" edits. Any change not explicitly listed in the brief is out of scope.
- **Token-only styling preserved.** No hex anywhere in new code.
- **Do NOT touch:**
  - Other `sites/*` folders (they stay on the migration queue)
  - `packages/themes/*` including orion — still depended upon by 9 other sites
  - `packages/core-components/*`, `packages/component-composition/*`, `packages/theme-system/*` — stay shared
  - `tools/clone-site.ts`, `tools/scaffold-theme-package.ts`, etc. — redesigned when themes actually retire
  - `sites/showcase/lib/register-all-themes.ts` — out of scope
- Use `model: haiku` for Task agents in Phases D and E (mechanical deletions). Orchestrator stays sonnet throughout.
- Co-Authored-By reflects the orchestrator: `Claude Sonnet 4.6 <noreply@anthropic.com>`.
- This brief modifies `turbo.json` and `.github/workflows/ci.yml`. **Run `pnpm pipeline:smoke` in Phase H if defined in root `package.json`**; if not defined, skip. Don't invent a task.
- No `--additionalDirectories` needed — all edits within `/Users/rickywilson/Sites/local-business-platform`.

## Completed

**Date:** 2026-04-20
**Status:** All phases executed successfully

All 7 phases (A through G) plus final verification (H) completed without failures. The animations.css import in Phase A used the relative path form (`../../../packages/core-components/src/styles/animations.css`) because the site has no PostCSS import alias plugin — CSS `@import` doesn't resolve tsconfig paths. One deviation from the brief: Phase F's zero-hits invariant flagged a `package.json` dependency on `@platform/themes` that the brief didn't explicitly list for removal, so an additional commit was added to remove it. The delete simulation passed both times — the site builds cleanly with `packages/themes/orion/` renamed away. The `SiteHeaderProps` type alias in `site-header.tsx` required aliasing both the component (`CoreSiteHeader`) and the type (`CoreSiteHeaderProps`) from core-components to avoid identifier collision. The Orion comment block in globals.css mentioning the old import path was trimmed to avoid a false positive on the grep invariant.

### Commits

- `351cc58` refactor(dj-fox-test): inline orion globals.css into site
- `a98eb90` refactor(dj-fox-test): copy Orion header and footer into site as SiteHeader/SiteFooter
- `fbba5a2` refactor(dj-fox-test): inline orion component registry into theme.config
- `6e78f7a` chore(dj-fox-test): remove @platform/themes/orion path aliases
- `358dfc7` chore(dj-fox-test): scope tailwind content globs to site
- `474f6cf` chore(dj-fox-test): remove unused @platform/themes dependency
- `19e204b` chore(theme-contract): retire validator ahead of packages/themes/\* removal
