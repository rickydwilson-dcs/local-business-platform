# Development Workflow

This document outlines the **enforced development workflow** for the Colossus Scaffolding website to ensure code quality and prevent issues from reaching production.

## ⚠️ CRITICAL: Pre-Push Hooks Prevent Bad Code

**🚫 Git pushes will be BLOCKED if:**

- TypeScript compilation errors exist
- Production build fails
- Import/export issues prevent successful builds

**💡 To avoid blocked pushes, run before committing:**

```bash
npm run type-check    # Check for TypeScript errors
npm run build         # Verify production build works
```

## Branch Structure & Vercel Deployment Mapping

### **CRITICAL: This is the ONLY correct branch structure for this project**

**NEVER create new branches unless explicitly requested by the project owner.**

### **GitHub Branches:**

- **`develop`** - Development environment
- **`staging`** - Preview environment
- **`main`** - Production environment

### **Vercel Deployment Mapping:**

- **Development Environment**: `develop` branch → Development URL
- **Preview Environment**: `staging` branch → Preview URL
- **Production Environment**: `main` branch → Production URL

### **Deployment Rules:**

1. **NEVER create new branches** unless explicitly requested
2. **When deploying to "production"**, ALWAYS push to the `main` branch
3. **When deploying to "preview"**, push to the `staging` branch
4. **When deploying to "development"**, push to the `develop` branch

### **Terminology Reference:**

- 🟢 **"Development"** = Development environment (`develop` branch)
- 🟡 **"Preview"** = Preview environment (`staging` branch)
- 🔴 **"Production"** = Production environment (`main` branch)

**🔒 `staging` and `main` branches are protected but use direct push workflow after explicit approval**

## Development Workflow

### 1. Development Phase

Always work in the `develop` branch:

```bash
git checkout develop
git pull origin develop

# Make your changes
# Test locally with: npm run dev
```

### 2. Automated Quality Checks

**Pre-commit hooks (automatic on every commit):**

- **ESLint** - Code linting and fixes
- **Prettier** - Code formatting
- ⚠️ **Note**: TypeScript errors are NOT caught at commit time

**Pre-push hooks (automatic on every push):**

- **TypeScript** - Type checking (`npm run type-check`)
- **Build Test** - Production build verification (`npm run build`)
- **Smoke Tests** - Minimal E2E validation (develop/staging/main branches)
- 🚫 **CRITICAL**: Push will be blocked if TypeScript, build, or smoke tests fail

**GitHub Actions CI (automatic after push):**

**Phase 2: Tiered Testing Strategy**

| Branch    | Tests Run        | Duration | Status Check Names                    |
| --------- | ---------------- | -------- | ------------------------------------- |
| `develop` | Smoke only       | ~30s     | Quality Checks, Smoke Tests (Fast)    |
| `staging` | Smoke + Standard | ~3-4min  | Quality Checks, Smoke Tests, Standard |
| `main`    | Smoke + Standard | ~3-4min  | Quality Checks, Smoke Tests, Standard |

- **Quality Checks** - ESLint, TypeScript, Tests, Content Validation, Build
- **Smoke Tests (Fast)** - 7 ultra-fast page load tests (all branches)
- **Standard E2E Tests (Auto)** - 51 functional tests (staging/main only)

### 3. Manual Quality Checks

Before committing or pushing to `develop`, run these commands:

```bash
# RECOMMENDED: Run full quality check before any commit
npm run pre-commit-check

# Individual checks:
npm run lint          # ESLint check
npm run lint:fix      # ESLint with auto-fix
npm run type-check    # TypeScript validation ⚠️ CRITICAL
npm run build         # Production build test ⚠️ CRITICAL
npm run format        # Prettier formatting
```

**⚠️ CRITICAL: TypeScript and build errors will block pushes to any branch!**

**💡 TIP: Run `npm run type-check` frequently during development to catch issues early**

### 4. Staging Deployment (Direct Push After Testing)

#### Pre-Promotion Checklist

Before promoting develop → staging, verify ALL items:

**CI Status:**

- [ ] All CI checks passing on `develop` (green checkmarks)
- [ ] No open test failure issues for `develop` branch
- [ ] No recent test failures (check last 3 runs)
- [ ] Pre-push hook passed locally

**Test Coverage:**

- [ ] Smoke tests passing (required)
- [ ] Unit tests passing (required)
- [ ] Standard E2E tests ran locally and passed
- [ ] If UI changed: Visual regression tests ran and baselines updated

**Investigation Complete:**

- [ ] Any previous test failures investigated and resolved
- [ ] No flaky tests detected (all tests pass consistently)
- [ ] No "ignore this failure" comments in code

**Code Quality:**

- [ ] TypeScript compilation successful
- [ ] ESLint warnings addressed
- [ ] Content validation passed
- [ ] Build successful locally and in CI

**Verification Commands:**

```bash
# 1. Verify develop branch status
npm run pre-commit-check              # Must pass
git log --oneline -5                  # Review recent commits
gh run list --branch develop --limit 3  # Check CI history

# 2. Check for open test failure issues
gh issue list --label "test-failure" --label "develop"
# ^ Must return empty!

# 3. Promote to staging
git checkout staging
git merge develop
git push origin staging

# 4. Monitor CI (MANDATORY - do not proceed without this)
gh run watch  # Watch until complete - must show ✅ ALL GREEN

# 5. Verify staging environment
# Visit staging URL and spot-check critical pages
```

**If ANY failures occur:**

1. ⛔ **STOP immediately** - do not proceed to production
2. Investigate via: `gh run view --web`
3. Fix in develop branch
4. Repeat checklist from step 1

**Pre-push hooks automatically run:**

- ✅ ESLint validation
- ✅ TypeScript check
- ✅ Build test
- ✅ Smoke tests (NEW - blocks push if fail)

**🚫 Push will be blocked until all quality checks pass!**

**⚠️ IMPORTANT: Pre-push hooks ≠ GitHub Actions CI**

- Pre-push hooks run locally (may miss environment-specific issues)
- GitHub Actions runs in isolated CI environment (Node 20, Ubuntu)
- **ALWAYS verify GitHub Actions passes after every push**
- Common CI-only failures: ESM compatibility, environment differences, dependency issues

### 5. Production Deployment (Direct Push After Staging Verification)

#### Pre-Promotion Checklist

Before promoting staging → production, verify ALL items:

**Extended Soak Time:**

- [ ] Staging has been stable for at least **24 hours**
- [ ] All CI passing on `staging` (no failures in last 24h)
- [ ] No open test-failure issues
- [ ] No user-reported bugs from staging environment

**CI Status:**

- [ ] All CI checks passing on `staging` (green checkmarks)
- [ ] Performance baseline completed (Phase 3)
- [ ] No flaky tests detected
- [ ] All automated tests passed

**Production Readiness:**

- [ ] Staging environment thoroughly tested
- [ ] Critical user flows verified (contact form, navigation)
- [ ] Mobile responsiveness checked
- [ ] Performance acceptable (CWV thresholds met)

**Approval:**

- [ ] **Explicit approval from project owner**
- [ ] Rollback plan documented (if needed)
- [ ] Team notified of production deployment

**Verification Commands:**

```bash
# 1. Verify staging branch status
gh run list --branch staging --limit 5  # Check last 5 runs - all must pass
gh issue list --label "test-failure"    # Must be empty

# 2. Review recent changes
git checkout staging
git log --oneline main..staging         # What will be deployed

# 3. Promote to production (requires PR approval)
git checkout main
git merge staging

# 4. Push to production
git push origin main

# 5. Monitor CI (MANDATORY)
gh run watch  # Must show ✅ ALL GREEN including Performance Baseline

# 6. Verify production deployment
# Visit production URL
# Check Vercel deployment status
# Monitor for errors in first 15 minutes
```

**If ANY failures occur:**

1. ⛔ **STOP immediately**
2. **Rollback:** `git revert HEAD && git push origin main`
3. Investigate in staging environment
4. Fix and re-test before next attempt

**Post-Deployment Monitoring:**

- [ ] Production site loads correctly
- [ ] No console errors in browser
- [ ] Contact form functional
- [ ] Analytics tracking working
- [ ] Performance baseline metrics logged

**Requirements before push:**

- ✅ All pre-push hooks must pass
- ✅ Staging environment fully tested (24h soak)
- ✅ Explicit approval from project owner
- ✅ Branch must be up to date
- ✅ **GitHub Actions CI passed on staging branch**

**After push to `main`:**

- ✅ **Verify GitHub Actions CI passes on main**
- ✅ Performance baseline test completes (Phase 3)
- ✅ Vercel automatic production deployment triggers
- ✅ Monitor production deployment status
- ✅ Review performance metrics for regressions

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types
npm run test             # Run test suite (68 tests)
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate test coverage report
npm run validate:content # Validate all MDX content files
npm run pre-commit-check # Run all quality checks
npm run deploy:production # Auto-create production deployment PR
```

## GitHub Actions Workflow

The CI pipeline runs automatically on:

- Every push to `develop`, `staging`, `main`
- Every PR to `staging`, `main`

**Pipeline steps (Single Quality Checks Job):**

1. **ESLint** - Code linting and quality checks
2. **TypeScript** - Type checking and compilation validation
3. **Content Validation** - MDX frontmatter validation (all 62 content files)
4. **Tests** - Run full test suite (68 tests with Vitest)
5. **Build** - Production build verification
6. **Cache** - Build cache for faster subsequent runs

**Status checks are required** - PRs cannot be merged if any step fails.

**Optimization:** Consolidated from 3 separate jobs to 1 comprehensive job, reducing CI time by 4-6 minutes per run.

## Quality Gates

### Development Quality Gates ✅

- Pre-commit hooks pass (ESLint + Prettier)
- 🔥 **Pre-push hooks pass (TypeScript + Build)** - BLOCKS PUSH IF FAILED
- Local development server running (`npm run dev`)
- Manual feature testing complete
- **Recommended**: Run `npm run type-check` before every commit

### Staging Quality Gates ✅

- GitHub Actions passing (ESLint + TypeScript + Build)
- Production build successful
- No deployment errors on Vercel staging
- Full application testing on staging URL
- Cross-browser compatibility verified

### Production Quality Gates ✅

- All staging tests passing
- Code review approval obtained
- All GitHub Action checks passing
- All PR conversations resolved
- Branch up to date with latest changes

## Branch Protection Rules

### Main Branch (Production)

- 🔒 **Direct push after explicit approval**
- 🔒 **Pre-push hooks required** (TypeScript + Build must pass)
- 🔒 **Up-to-date branch required**
- 🔒 **No force pushes allowed**
- 🔒 **Staging verification required before push**

### Staging Branch

- 🔒 **Pre-push hooks required** (TypeScript + Build must pass)
- 🔒 **Up-to-date branch required**
- 🔒 **No force pushes allowed**
- 🔒 **Development testing required before push**

### Develop Branch

- ✅ Direct pushes allowed
- ✅ Status checks recommended but not enforced

## Emergency Hotfixes

For critical production issues that need immediate deployment:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Make minimal changes and test thoroughly
npm run pre-commit-check

# Push and create emergency PR
git push origin hotfix/critical-fix
# Create PR: hotfix/critical-fix → main
# Get emergency review approval
# Merge after GitHub Actions pass

# Sync hotfix back to develop
git checkout develop
git merge main
git push origin develop
```

## Common Development Issues

### TypeScript Errors During Push

**Problem**: `git push` fails with TypeScript errors

**Solution**:

```bash
# 1. Check for TypeScript errors
npm run type-check

# 2. Fix all reported errors in your code editor
# 3. Common issues:
#    - Missing type imports: import type { SomeType } from './types'
#    - 'any' types: Replace with proper types or 'unknown'
#    - Function ordering: useCallback functions used before declaration
#    - Missing dependency arrays in React hooks

# 4. Verify fix
npm run type-check

# 5. Now push will succeed
git push origin develop
```

### Pre-Push Hook Failure

**Problem**: Push blocked by pre-push hooks

**Root Causes**:

- TypeScript compilation errors
- Production build failures
- Import/export issues

**Fix Process**:

```bash
# 1. Run the exact same checks as pre-push hook
npm run type-check && npm run build

# 2. Fix any errors shown
# 3. Retry push
```

### Common TypeScript Issues

**1. Missing Type Imports**

```typescript
// ❌ Error: Cannot find name 'ConsentState'
function hasConsent(consent: ConsentState | null): boolean;

// ✅ Fix: Add type import
import type { ConsentState } from "@/lib/analytics/types";
function hasConsent(consent: ConsentState | null): boolean;
```

**2. Function Declaration Ordering**

```typescript
// ❌ Error: Variable used before being assigned
const parentFunction = useCallback(() => {
  childFunction(); // Used before declaration
}, [childFunction]);

const childFunction = useCallback(() => {
  // Implementation
}, []);

// ✅ Fix: Declare child functions first
const childFunction = useCallback(() => {
  // Implementation
}, []);

const parentFunction = useCallback(() => {
  childFunction(); // Now available
}, [childFunction]);
```

**3. 'any' Type Violations**

```typescript
// ❌ Error: TypeScript strict mode violation
const data: any = getData();

// ✅ Fix: Use proper types or 'unknown'
const data: unknown = getData();
const data: SomeInterface = getData();
const data: Record<string, unknown> = getData();
```

**4. React Hook Dependencies**

```typescript
// ❌ Error: Missing dependencies in useCallback
const callback = useCallback(() => {
  someFunction();
}, []); // Missing someFunction dependency

// ✅ Fix: Add all dependencies
const callback = useCallback(() => {
  someFunction();
}, [someFunction]);
```

## Monitoring GitHub Actions CI

### How to Check CI Status

**After every push, verify GitHub Actions passes:**

```bash
# Check latest workflow run status
gh run list --branch develop --limit 1

# View workflow run details
gh run view

# Watch a running workflow in real-time
gh run watch

# Open GitHub Actions page in browser
gh run view --web
```

**Or visit manually:**

- Development: https://github.com/rickydwilson-dcs/colossus-scaffolding/actions?query=branch:develop
- Staging: https://github.com/rickydwilson-dcs/colossus-scaffolding/actions?query=branch:staging
- Production: https://github.com/rickydwilson-dcs/colossus-scaffolding/actions?query=branch:main

### CI Pipeline Steps

The "Quality Checks" job runs automatically on every push:

1. **ESLint** - Code linting and quality checks
2. **TypeScript** - Type checking and compilation validation
3. **Content Validation** - MDX frontmatter validation (62 files)
4. **Tests** - Run full test suite (68 tests with Vitest)
5. **Build** - Production build verification (86 pages)

**All steps must pass ✅ before proceeding to next environment**

### Why CI Might Fail When Local Passes

**Environment differences:**

- CI uses Node 20 on Ubuntu (isolated container)
- Local uses your machine's Node version and OS
- CI runs `npm ci` (clean install) vs `npm install` locally
- CI has stricter module resolution (ESM vs CommonJS)

**Common CI-only failures:**

- ESM/CommonJS module compatibility issues
- Missing environment variables (only affects runtime)
- Platform-specific path issues (Windows vs Unix)
- Dependency version mismatches
- Race conditions in async tests

**⚠️ RULE: If CI fails, deployment stops - even if local works**

## Troubleshooting

### GitHub Actions Failing

**Step 1: Identify the failure**

```bash
gh run list --branch develop --limit 3
gh run view [run-id]  # Get detailed logs
```

**Step 2: Check error logs**

- Visit GitHub Actions tab for full error output
- Look for the specific step that failed (ESLint, TypeScript, Tests, Build)

**Step 3: Reproduce locally**

```bash
# Run the exact same commands as CI
npm ci                    # Clean install
npm run lint             # ESLint check
npm run type-check       # TypeScript check
npm run validate:content # Content validation
npm test                 # Run tests
npm run build            # Production build
```

**Step 4: Common fixes**

- ESLint errors: `npm run lint:fix`
- TypeScript errors: `npm run type-check` and fix reported issues
- Test failures: `npm test` and fix failing tests
- Build failures: `npm run build` and check error output
- Content validation: `npm run validate:content` and fix MDX errors

**Step 5: Push fix and verify**

```bash
git add .
git commit -m "Fix CI failure: [description]"
git push origin develop
gh run watch  # Watch the new run
```

### Pre-commit Hook Issues

- Ensure Husky is installed: `npm run prepare`
- Check hook permissions: `chmod +x .husky/pre-commit .husky/pre-push`
- Test hooks manually: `npx lint-staged`

### PR Cannot Be Merged

- Verify all GitHub Action checks are green
- Ensure branch is up to date: `git pull origin staging`
- Resolve all PR conversations
- Get required code review approvals

### Branch Protection Bypass (Emergency Only)

1. **Contact repository admin** to temporarily disable protection
2. **Make emergency fix** with proper documentation
3. **Re-enable protection immediately**
4. **Create follow-up PR** to document emergency change

## Best Practices

1. **🚫 Never skip quality checks** - They prevent production issues
2. **🔒 Always get explicit approval** - Direct pushes require owner approval
3. **🧪 Test environments thoroughly** - Verify develop → staging → main flow
4. **📝 Write descriptive commit messages** - Include what, why, and how
5. **🧪 Test on staging thoroughly** - Verify changes before production
6. **🔄 Keep branches up to date** - Avoid merge conflicts
7. **⚡ Follow direct push workflow** - develop → staging → main after approval
8. **🏗️ Make focused commits** - Easier to review and rollback

## Automated Production Deployment

### Using the Deployment Script

When ready to deploy staging to production:

```bash
npm run deploy:production
```

**What this script does:**

1. ✅ Switches to staging branch and syncs with remote
2. ✅ Analyzes commits since last production deployment
3. ✅ Generates detailed PR description with change summary
4. ✅ Creates PR from staging → main automatically
5. ✅ Assigns PR to you and adds deployment labels
6. ✅ Provides next steps for completion

**Generated PR includes:**

- **Commit summary** - All changes since last deployment
- **Testing status** - Confirmation of staging verification
- **Quality gates** - Pre-deployment checklist
- **Post-deployment** - Instructions for final production push

### Production Deployment

After the PR is approved and merged to `main`, Vercel automatically deploys to production.

## Quick Reference

**Development Flow:**

1. `develop` → Work and test locally
2. `develop` → `staging` (Direct push after explicit approval)
3. `staging` → `main` (Direct push after staging verification)
4. `main` → Production deployment (automatic via Vercel)

**Quality Checkpoints:**

- ✅ Pre-commit: ESLint + Prettier
- ✅ Pre-push: TypeScript + Build (runs before every push)
- ✅ Push to staging: Pre-push hooks (ESLint + TypeScript + Build)
- ✅ Push to main: Pre-push hooks + staging verification (double validation)

This enforced workflow ensures **zero chance** of linting errors or broken builds reaching production.
