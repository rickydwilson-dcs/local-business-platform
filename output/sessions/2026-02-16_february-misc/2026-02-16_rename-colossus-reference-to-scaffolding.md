# Site Rename Plan: colossus-reference → colossus-scaffolding

**Date**: 2026-02-16
**Status**: Completed — rename executed 2026-02-19
**Estimated Duration**: 15-20 minutes
**Risk Level**: Medium (requires CI/CD updates)

---

## Context

The user wants to rename `sites/colossus-reference` to `sites/colossus-scaffolding` to better reflect the site's purpose (scaffolding business). This is a white-label platform site, and the rename requires updating workspace references, CI/CD configs, and documentation.

**Key Architectural Note**: The platform uses pnpm workspaces with package names as identifiers. Most imports use `@platform/*` packages, so inter-site dependencies are minimal. The main impact is on:

- Turborepo build filters
- GitHub Actions workflow filters
- Vercel deployment configuration
- Internal site configuration (slug, package name)

---

## Pre-Execution Checklist

- [ ] **Verify clean working tree**: `git status` should show no uncommitted changes
- [ ] **Verify current branch**: Should be on `develop` per git workflow
- [ ] **Backup `.env.local`**: The site has environment variables that need to be preserved
- [ ] **Note Vercel project**: Current Vercel project may need reconnection after rename

---

## Execution Steps

### Phase 1: Preparation (Read-Only)

#### Step 1.1: Verify Current State

```bash
cd /Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My\ Drive/Websites/GitHub/local-business-platform
git status
git branch --show-current  # Should be 'develop'
```

#### Step 1.2: Document Current Vercel Configuration

```bash
cd sites/colossus-reference
cat vercel.json
# Note: Record current Vercel project ID if connected
```

#### Step 1.3: Backup Environment Variables

```bash
cp sites/colossus-reference/.env.local /tmp/colossus-scaffolding-env-backup.local
```

---

### Phase 2: File Updates (Critical Path)

#### Step 2.1: Update Site Package Name

**File**: `sites/colossus-reference/package.json`
**Line**: 2
**Change**:

```diff
- "name": "colossus-reference",
+ "name": "colossus-scaffolding",
```

#### Step 2.2: Update Site Slug

**File**: `sites/colossus-reference/site.config.ts`
**Line**: 147
**Change**:

```diff
- slug: "colossus-reference",
+ slug: "colossus-scaffolding",
```

#### Step 2.3: Update Vercel Build Filter

**File**: `sites/colossus-reference/vercel.json`
**Line**: 3
**Change**:

```diff
- "buildCommand": "cd ../.. && pnpm --filter colossus-reference run build",
+ "buildCommand": "cd ../.. && pnpm --filter colossus-scaffolding run build",
```

---

### Phase 3: CI/CD Updates

#### Step 3.1: Update Main CI Workflow

**File**: `.github/workflows/ci.yml`
**Line**: 37
**Change**:

```diff
- run: pnpm --filter colossus-reference run validate:content
+ run: pnpm --filter colossus-scaffolding run validate:content
```

#### Step 3.2: Update E2E Test Workflow

**File**: `.github/workflows/e2e-tests.yml`
**Lines**: 49, 52, 92, 95, 143, 146, 194, 197 (8 total references)

**Pattern to find/replace**:

```diff
- colossus-reference
+ colossus-scaffolding
```

**Affected commands**:

- `pnpm --filter colossus-reference run build`
- `pnpm --filter colossus-reference run test:e2e:smoke`
- Path references in setup steps

---

### Phase 4: Configuration Files

#### Step 4.1: Update Changeset Config

**File**: `.changeset/config.json`
**Line**: 10
**Change**:

```diff
  "ignore": [
    "@platform/theme-system",
    "base-template",
-   "colossus-reference",
+   "colossus-scaffolding",
    "smiths-electrical-cambridge",
    "dj-fox-electrical"
  ]
```

#### Step 4.2: Update Task Management Files

**File**: `tasks/clients/_pipeline.md`
Find and replace: `colossus-reference` → `colossus-scaffolding`

**File**: `tasks/clients/colossus-scaffolding.md`
Find and replace: `colossus-reference` → `colossus-scaffolding`

---

### Phase 5: Directory Rename

#### Step 5.1: Rename Main Site Directory

```bash
cd sites
git mv colossus-reference colossus-scaffolding
```

**Important**: Use `git mv` not `mv` to preserve git history.

#### Step 5.2: Rename Generated Images Directory

```bash
cd output
git mv generated-images/colossus-reference generated-images/colossus-scaffolding
```

---

### Phase 6: Documentation Updates

#### Step 6.1: Update Root README

**File**: `README.md`
**Lines**: 17, 45
**Change**: Replace `colossus-reference` → `colossus-scaffolding`

#### Step 6.2: Update Architecture Docs (Optional but Recommended)

Search and replace in these files:

- `docs/architecture/*.md` (~3 references)
- `docs/standards/*.md` (~2 references)
- `.claude/commands/fix.findings.md` (2 references)

**Command to find all doc references**:

```bash
grep -r "colossus-reference" docs/ .claude/
```

#### Step 6.3: Update Core Components Comments (Optional)

**File**: `packages/core-components/src/lib/content-schemas.ts` - Line 6
**File**: `packages/core-components/src/types/site-config.ts` - Line 25
Update example references in comments (non-functional but good for consistency)

---

### Phase 7: Dependency Refresh

#### Step 7.1: Reinstall Dependencies

```bash
cd /Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My\ Drive/Websites/GitHub/local-business-platform
pnpm install
```

This will:

- Regenerate `pnpm-lock.yaml` with new workspace reference
- Update workspace symlinks in `node_modules`

#### Step 7.2: Clean Build Artifacts

```bash
pnpm clean
```

---

### Phase 8: Verification

#### Step 8.1: Type Check

```bash
pnpm type-check
```

#### Step 8.2: Build Renamed Site

```bash
pnpm --filter colossus-scaffolding run build
```

#### Step 8.3: Run Content Validation

```bash
pnpm --filter colossus-scaffolding run validate:content
```

#### Step 8.4: Run Unit Tests

```bash
pnpm --filter colossus-scaffolding run test
```

#### Step 8.5: Run E2E Smoke Tests

```bash
cd sites/colossus-scaffolding
npm run test:e2e:smoke
```

#### Step 8.6: Verify Dev Server

```bash
cd sites/colossus-scaffolding
npm run dev
# Open http://localhost:3000 and verify site loads correctly
```

---

### Phase 9: Git Commit

#### Step 9.1: Review Changes

```bash
git status
git diff --cached  # If files were staged
git diff          # If files are unstaged
```

#### Step 9.2: Stage All Changes

```bash
git add -A
```

#### Step 9.3: Commit with Descriptive Message

```bash
git commit -m "$(cat <<'EOF'
refactor: Rename colossus-reference to colossus-scaffolding

- Updated package name and site slug in site configuration
- Updated all CI/CD workflow references (ci.yml, e2e-tests.yml)
- Updated Vercel build configuration
- Renamed site directory and generated images directory
- Updated documentation and task management files
- Regenerated pnpm-lock.yaml with new workspace reference

This rename better reflects the site's purpose (scaffolding business).
All builds, tests, and content validation passing.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

---

### Phase 10: Post-Commit Actions

#### Step 10.1: Push to Develop

```bash
git push origin develop
```

#### Step 10.2: Watch CI Pipeline

```bash
gh run watch
```

Verify that:

- ✅ Content validation passes for `colossus-scaffolding`
- ✅ E2E tests run successfully with new site name
- ✅ Build completes without errors

#### Step 10.3: Update Vercel Project (If Needed)

**Option A: Reconnect Deployment**

1. Go to Vercel dashboard
2. Remove old `colossus-reference` project (if it exists)
3. Import new `colossus-scaffolding` site
4. Set environment variables from backup
5. Deploy

**Option B: Update Existing Project**

1. Go to Vercel project settings
2. Update "Root Directory" setting to `sites/colossus-scaffolding`
3. Redeploy

#### Step 10.4: Restore Environment Variables

```bash
# If .env.local was lost during rename:
cp /tmp/colossus-scaffolding-env-backup.local sites/colossus-scaffolding/.env.local
```

---

## Rollback Plan

If something goes wrong:

### Quick Rollback (Before Push)

```bash
git reset --hard HEAD  # Discard all changes
git clean -fd          # Remove untracked files
```

### Rollback After Push

```bash
git revert HEAD        # Create revert commit
git push origin develop
```

Or use Git history to restore:

```bash
git log --oneline -10  # Find commit before rename
git checkout <commit-hash> -- sites/
git checkout <commit-hash> -- .github/
# ... etc for each changed directory
git commit -m "revert: Rollback colossus-reference rename"
```

---

## Known Issues & Considerations

### 1. Vercel Deployment

- **Issue**: Vercel project may be linked to old folder path
- **Solution**: Update project settings or reconnect deployment
- **Impact**: Requires manual Vercel dashboard configuration

### 2. Local Caches

- **Issue**: Next.js cache may reference old paths
- **Solution**: Run `pnpm clean` and delete `sites/colossus-scaffolding/.next`
- **Impact**: Slightly longer first build after rename

### 3. Historical Session Files

- **Issue**: 100+ references in `output/sessions/` files
- **Solution**: Leave unchanged - these are historical context only
- **Impact**: None (documentation only)

### 4. External Documentation

- **Issue**: External docs (Notion, wikis) may reference old name
- **Solution**: Update separately if they exist
- **Impact**: Depends on external documentation system

---

## Files Changed Summary

### Critical (8 files)

- `sites/colossus-reference/package.json`
- `sites/colossus-reference/site.config.ts`
- `sites/colossus-reference/vercel.json`
- `.github/workflows/ci.yml`
- `.github/workflows/e2e-tests.yml`
- `.changeset/config.json`
- `tasks/clients/_pipeline.md`
- `tasks/clients/colossus-scaffolding.md`

### Documentation (10+ files)

- `README.md`
- Various `docs/` files
- Various `.claude/` files
- Comment examples in `packages/core-components/`

### Directories (2)

- `sites/colossus-reference/` → `sites/colossus-scaffolding/`
- `output/generated-images/colossus-reference/` → `output/generated-images/colossus-scaffolding/`

### Auto-Generated (1)

- `pnpm-lock.yaml` (regenerates automatically)

---

## Post-Execution Verification Checklist

After completing all steps, verify:

- [ ] `git status` shows clean working tree (after commit)
- [ ] `pnpm --filter colossus-scaffolding run build` succeeds
- [ ] `pnpm --filter colossus-scaffolding run test` passes
- [ ] `pnpm --filter colossus-scaffolding run test:e2e:smoke` passes
- [ ] `pnpm --filter colossus-scaffolding run validate:content` succeeds
- [ ] Dev server runs: `cd sites/colossus-scaffolding && npm run dev`
- [ ] Site loads at `http://localhost:3000`
- [ ] GitHub Actions CI passes after push
- [ ] Vercel deployment succeeds (if connected)
- [ ] Environment variables are preserved in `.env.local`

---

## Estimated Timeline

| Phase              | Duration   | Notes                                |
| ------------------ | ---------- | ------------------------------------ |
| Preparation        | 2 min      | Backup and verification              |
| File Updates       | 5 min      | 8 critical files                     |
| Documentation      | 3 min      | 10+ files (optional but recommended) |
| Directory Rename   | 1 min      | Using `git mv`                       |
| Dependency Refresh | 2 min      | `pnpm install` + `pnpm clean`        |
| Verification       | 5 min      | Build, test, E2E                     |
| Commit & Push      | 2 min      | Review and commit                    |
| **Total**          | **20 min** | Not including Vercel reconfiguration |

---

## Success Criteria

✅ All critical files updated with new name
✅ CI/CD workflows pass with new site name
✅ Site builds successfully with new workspace name
✅ All tests pass (unit + E2E)
✅ Content validation succeeds
✅ Dev server runs without errors
✅ Git history preserved through `git mv`
✅ Environment variables preserved
✅ Vercel deployment working (if applicable)

---

## References

- **Git Workflow**: `docs/guides/git-workflow.md`
- **Site Creation**: `docs/guides/adding-new-site.md`
- **Deployment**: `docs/guides/deploying-site.md`
- **Build Pipeline**: `docs/architecture/how-build-pipeline-works.md`

---

## Notes for Future Reference

This rename was executed because the site serves a scaffolding business, and `colossus-scaffolding` is a more descriptive name than `colossus-reference`. The platform architecture made this rename relatively straightforward because:

1. Most imports use `@platform/*` packages (not site-to-site imports)
2. Workspace names in package.json are the primary identifiers
3. Turborepo uses package names, not folder paths, for caching
4. The only hardcoded references were in CI/CD filters and site config

**Key Lesson**: When naming sites in this platform, use descriptive business names rather than generic references. This makes the codebase more maintainable and reduces confusion about which site serves which client.
