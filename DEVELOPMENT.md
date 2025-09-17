# Development Workflow

This document outlines the **enforced development workflow** for the Colossus Scaffolding website to ensure code quality and prevent issues from reaching production.

## Branch Structure (Protected)

- **`develop`** - Development branch for all new features and bug fixes
- **`staging`** - Staging branch connected to staging deployment (PR required)
- **`main`** - Main branch for production-ready code (PR required + reviews)
- **`production`** - Production branch connected to live website

**🔒 All branches except `develop` are protected and require Pull Requests**

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

**Pre-push hooks (automatic on every push):**

- **TypeScript** - Type checking
- **Build Test** - Production build verification

### 3. Manual Quality Checks

Before creating PRs, run these commands in the `develop` branch:

```bash
# Run all quality checks
npm run pre-commit-check

# Individual checks:
npm run lint          # ESLint check
npm run lint:fix      # ESLint with auto-fix
npm run type-check    # TypeScript validation
npm run build         # Production build test
npm run format        # Prettier formatting
```

**⚠️ CRITICAL: All checks must pass before creating PRs!**

### 4. Staging Deployment (PR Required)

Once development is complete and all checks pass:

```bash
# Push develop changes
git push origin develop

# Create Pull Request via GitHub UI:
# develop → staging
```

**GitHub Actions automatically run:**

- ✅ ESLint validation
- ✅ TypeScript check
- ✅ Build test
- ✅ Deployment readiness check

**🚫 PR cannot be merged until all GitHub Actions pass!**

### 5. Production Deployment (PR + Review Required)

Only after staging is verified and working correctly:

**Create Pull Request via GitHub UI:**

- `staging → main`

**Requirements before merge:**

- ✅ All GitHub Actions must pass
- ✅ At least 1 code review approval required
- ✅ All conversations resolved
- ✅ Branch must be up to date

After merge to `main`, manually push to production:

```bash
git checkout main
git pull origin main
git push origin main:production
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types
npm run pre-commit-check # Run all quality checks
```

## GitHub Actions Workflow

The CI pipeline runs automatically on:

- Every push to `develop`, `staging`, `main`
- Every PR to `staging`, `main`

**Pipeline steps:**

1. **Quality Checks** - ESLint, TypeScript, Build test
2. **Build Test** - Verify production build works
3. **Deployment Check** - Confirm readiness for deployment

**Status checks are required** - PRs cannot be merged if any step fails.

## Quality Gates

### Development Quality Gates ✅

- Pre-commit hooks pass (ESLint + Prettier)
- Pre-push hooks pass (TypeScript + Build)
- Local development server running
- Manual feature testing complete

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

- 🔒 **PR required** with 1+ review approval
- 🔒 **Status checks required** (GitHub Actions must pass)
- 🔒 **Up-to-date branch required**
- 🔒 **No force pushes allowed**
- 🔒 **No direct commits allowed**

### Staging Branch

- 🔒 **Status checks required** (GitHub Actions must pass)
- 🔒 **Up-to-date branch required**
- 🔒 **No force pushes allowed**

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
2. **🔒 Always use PRs for protected branches** - Direct pushes are blocked
3. **👥 Get code reviews** - Fresh eyes catch issues
4. **📝 Write descriptive PR descriptions** - Include what, why, and how
5. **🧪 Test on staging thoroughly** - Verify changes before production
6. **🔄 Keep branches up to date** - Avoid merge conflicts
7. **📋 Use PR templates** - Ensure consistent review process
8. **🏗️ Make focused commits** - Easier to review and rollback

## Quick Reference

**Development Flow:**

1. `develop` → Work and test locally
2. `develop` → `staging` (via PR + GitHub Actions)
3. `staging` → `main` (via PR + Review + GitHub Actions)
4. `main` → `production` (manual push)

**Quality Checkpoints:**

- ✅ Pre-commit: ESLint + Prettier
- ✅ Pre-push: TypeScript + Build
- ✅ PR to staging: GitHub Actions
- ✅ PR to main: GitHub Actions + Code Review

This enforced workflow ensures **zero chance** of linting errors or broken builds reaching production.
