# Parallel Self-Containment Migration — 2026-04-23

## Per-Site Status

| Site          | Branch                               | Baseline Build | 7 Steps Done | Pages/ Copied    | Type-Check | Build     | Visual Capture | Commit SHA                               | Notes                                                                           |
| ------------- | ------------------------------------ | -------------- | ------------ | ---------------- | ---------- | --------- | -------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| base-template | feature/self-contained-base-template | ❌ (pre-exist) | ✅           | ✅ 10 pages      | ✅ EXIT 0  | ✅ EXIT 0 | ✅ Valid HTML  | d102b770d31855a0765af45f9c6dc03f1b20b9ff | Needed theme-system build; vega had 10 page components                          |
| dcs           | feature/self-contained-dcs           | ❌ (pre-exist) | ✅           | ✅ 12 pages      | ✅ EXIT 0  | ✅ EXIT 0 | ✅ Valid HTML  | 7e1d432                                  | Needed theme-system build; solaris had 12 page + scroll-reveal                  |
| mad-graphics  | feature/self-contained-mad-graphics  | ❌ (pre-exist) | ✅           | ✅ (header deps) | ✅ EXIT 0  | ✅ EXIT 0 | ✅ Valid HTML  | 5dbed5a1bee4c14873ab973c22f949272c805f05 | Cygnus header had LocationsDropdown sibling; app/page.tsx registry import fixed |

Note: Baseline builds failed in all 3 worktrees due to `@platform/theme-system` having no `dist/` in fresh worktrees — this was a pre-existing environment issue, not caused by migration.

## Invariant Results

All three sites return zero hits after migration:

```
grep -rn "@platform/themes\|packages/themes" sites/<name> --exclude-dir=node_modules --exclude-dir=.next
```

- base-template: 0 hits ✅
- dcs: 0 hits ✅
- mad-graphics: 0 hits ✅

## Shared Issues Found (Cross-Cutting)

### 1. @platform/theme-system dist/ not built in fresh worktrees (all 3 sites)

**Root cause:** Git worktrees share the git object store but not build artifacts. The `packages/theme-system/dist/` directory is gitignored and was absent in all 3 worktrees, causing all site builds to fail with `Cannot find module '...theme-system/dist/tailwind-plugin.js'`.

**Fix applied:** Each agent ran `pnpm --filter @platform/theme-system run build` before the site build. No package code changed.

**Doc update:** Added Worktree Pre-flight section to `docs/briefs/component-library-migration.md` (commit `160e5b1` on develop).

### 2. Theme packages/\*/pages/ components also imported by app pages (all 3 sites)

**Root cause:** The migration brief's per-site table only listed header.tsx and footer.tsx layout components. All 3 theme packages also had a `pages/` directory with page-level templates (10 for vega, 12+ for solaris, and cygnus). These were imported by the site's `app/` page files and caused invariant failures if not copied.

**Fix applied:** Each agent copied all pages/ components and renamed exports. No package code changed.

**Doc update:** Added "Discovered in Parallel Run" section to `docs/briefs/component-library-migration.md` (commit `160e5b1` on develop).

### 3. Header sibling component dependencies (cygnus / mad-graphics only)

**Root cause:** The cygnus header.tsx imported `CygnusLocationsDropdown` from a sibling file (`./LocationsDropdown`) in the theme's components directory. This needed copying alongside the header.

**Fix applied:** mad-graphics agent created `sites/mad-graphics/components/locations-dropdown.tsx`. Noted in brief update as a pattern to check for all future migrations.

### 4. app/page.tsx registry import (mad-graphics only)

**Root cause:** `sites/mad-graphics/app/page.tsx` imported `cygnusRegistry` for conditional logic (`cygnusRegistry.heroVariant === 'image-overlay'`), which the invariant grep would catch.

**Fix applied:** Swapped import source to `import { registry } from '@/theme.config'`. Logic unchanged.

## Deferred Items

None — all three sites completed the full 7-step recipe, passed type-check, passed build, and produced valid HTML on visual capture.

## Next Steps

1. **Review each feature branch** before merging to develop:
   - `feature/self-contained-base-template`
   - `feature/self-contained-dcs`
   - `feature/self-contained-mad-graphics`

2. **Merge order:** Any order is safe — the three feature branches touch independent site directories.

3. **Run `/deploy.changes`** after merge to develop to push through staging → main.

4. **Consider retiring `packages/themes/`** once all sites are migrated. The packages are still referenced by other sites (e.g. `sites/dj-fox-electrical` uses orion). Check with: `grep -rn "@platform/themes" sites/ --include="package.json"`.

5. **Update pnpm lockfile** after any merges that remove `@platform/themes` workspace dependency from package.json files. Run `pnpm install` at root and commit the updated lockfile.

## Develop Commits During This Run

| SHA     | Message                                                                            |
| ------- | ---------------------------------------------------------------------------------- |
| 83d98ac | docs(briefs): add component-library-migration self-containment recipe              |
| 160e5b1 | fix(core): update migration brief with pages/ copy pattern and worktree pre-flight |
