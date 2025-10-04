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
- 🚫 **CRITICAL**: Push will be blocked if TypeScript or build errors exist

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

Once development is complete and all checks pass:

```bash
# Push develop changes
git push origin develop

# Test thoroughly on development environment
# Then push to staging after explicit approval:
git checkout staging
git merge develop
git push origin staging
```

**Pre-push hooks automatically run:**

- ✅ ESLint validation
- ✅ TypeScript check
- ✅ Build test
- ✅ Deployment readiness check

**🚫 Push will be blocked until all quality checks pass!**

### 5. Production Deployment (Direct Push After Staging Verification)

Only after staging is verified and working correctly:

```bash
# After thorough testing on staging environment
# Push to production after explicit approval:
git checkout main
git merge staging
git push origin main
```

**Requirements before push:**

- ✅ All pre-push hooks must pass
- ✅ Staging environment fully tested
- ✅ Explicit approval from project owner
- ✅ Branch must be up to date

After push to `main`, the production deployment is automatic via Vercel.

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

## Troubleshooting

### GitHub Actions Failing

- Check the Actions tab in GitHub for detailed error logs
- Common issues:
  - ESLint errors: `npm run lint:fix`
  - TypeScript errors: `npm run type-check`
  - Build failures: `npm run build`

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
