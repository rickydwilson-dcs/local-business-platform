# GitHub Repository Setup Guide

This guide documents the current GitHub repository configuration and branch protection rules for the Colossus Scaffolding project.

## Current Branch Structure

- **`main`** → Production environment (colossus-scaffolding.vercel.app)
- **`staging`** → Preview environment
- **`develop`** → Development environment

## 1. Branch Protection Rules Setup

### Main Branch Protection (Production)

Go to: **Settings** → **Branches** → **Add rule**

**Branch name pattern:** `main`

**Enable these settings:**

- ✅ **Restrict pushes that create files larger than 100MB**
- ✅ **Restrict pushes that create files larger than 100MB** (enforced)
- ❌ **Require a pull request before merging** (disabled for direct push workflow)
- ❌ **Require approvals** (not applicable with direct push)
- ❌ **Dismiss stale PR approvals** (not applicable with direct push)
- ❌ **Require review from code owners** (not applicable with direct push)
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - ✅ **Status checks:** (Select these after first GitHub Action runs)
    - `Quality Checks`
    - `Build Test`
    - `Deployment Readiness`
- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators** (enforces rules on repo admins too)
- ✅ **Allow force pushes:** ❌ (disabled)
- ✅ **Allow deletions:** ❌ (disabled)

### Staging Branch Protection

Go to: **Settings** → **Branches** → **Add rule**

**Branch name pattern:** `staging`

**Enable these settings:**

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - ✅ **Status checks:**
    - `Quality Checks`
    - `Build Test`
- ✅ **Include administrators**
- ✅ **Allow force pushes:** ❌ (disabled)

### Development Branch (Optional)

**Branch name pattern:** `develop`

- ✅ **Require status checks to pass before merging**
  - ✅ **Status checks:**
    - `Quality Checks`

## 2. GitHub Actions Setup

The GitHub Actions workflow is automatically created in `.github/workflows/ci.yml`.

**What it does:**

- Runs on every push to `develop`, `staging`, `main`
- Executes: ESLint → TypeScript check → Content Validation → Tests → Build
- Uses Node 20 on Ubuntu (isolated CI environment)
- Only allows merge if all checks pass

**CI Pipeline Steps:**

1. **ESLint** - Code linting and quality checks
2. **TypeScript** - Type checking and compilation validation
3. **Content Validation** - MDX frontmatter validation (62 files)
4. **Tests** - Run full test suite (68 tests with Vitest)
5. **Build** - Production build verification (86 pages)

**⚠️ CRITICAL: Always verify CI passes after every push**

```bash
# Check CI status after pushing
gh run list --branch develop --limit 1
gh run watch              # Watch in real-time
gh run view --web         # Open in browser

# OR visit manually
# https://github.com/rickydwilson-dcs/colossus-scaffolding/actions
```

**Why CI verification is mandatory:**

- Pre-push hooks run locally (may miss environment-specific issues)
- CI runs in isolated Node 20/Ubuntu container
- CI uses `npm ci` (clean install) vs `npm install` locally
- Common CI-only failures: ESM/CommonJS compatibility, env differences, dependency versions

**If CI fails:**

1. Stop immediately - do not proceed to staging/production
2. Check error logs: `gh run view` or visit Actions tab
3. Reproduce locally: `npm ci && npm run lint && npm run type-check && npm test && npm run build`
   - Note: `npm run lint` uses `eslint .` (Next.js 16 removed `next lint` command)
4. Fix the issue and push again
5. Wait for CI to pass ✅ before proceeding

**First run setup:**

1. Push the workflow file to `develop` branch
2. Push changes to `staging` to trigger the first run
3. Pre-push hooks will automatically run quality checks
4. **Verify GitHub Actions CI passes** before proceeding

## 3. Vercel Deployment Settings

### Production Deployment

- **Project:** `colossus-scaffolding`
- **URL:** `https://colossus-scaffolding.vercel.app`
- **Framework Preset:** Next.js 15
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm ci`
- **Development Command:** `npm run dev`

**Git Integration:**

- **Production Branch:** `main`
- **Preview Deployments:** Enabled for `develop` and `staging` branches

**Environment Variables:**

- All production environment variables configured in Vercel Dashboard
- See `.env.example` for complete list of required variables

### Current Deployment Workflow

**Required Flow:** `develop` → `staging` → `main`

1. **Develop** - Feature development and testing
   - ✅ Push to develop
   - ⚠️ **Verify GitHub Actions CI passes** before proceeding
2. **Staging** - Preview environment for final testing (push after explicit approval)
   - ✅ Merge develop to staging after CI passes ✅
   - ⚠️ **Verify GitHub Actions CI passes** before proceeding
3. **Main** - Production deployment (push after staging verification)
   - ✅ Merge staging to main after CI passes ✅
   - ⚠️ **Verify GitHub Actions CI passes** on main

**⚠️ Important:**

- Always get explicit approval before pushing to `staging` or `main`
- **MANDATORY: Verify CI passes after every push**
- Stop immediately if CI fails - do not proceed to next environment
- Follow the proper testing sequence: develop → staging → main

## 4. GitHub Repository Settings

### General Settings

- ✅ **Allow merge commits**
- ✅ **Allow squash merging** (recommended for clean history)
- ❌ **Allow rebase merging** (optional, can cause confusion)
- ✅ **Direct push workflow enabled**
- ❌ **Auto-merge** (not applicable with direct push)
- ❌ **Automatically delete head branches** (not applicable with direct push)

### Actions Settings

Go to: **Settings** → **Actions** → **General**

**Actions permissions:**

- ✅ **Allow all actions and reusable workflows**
- ✅ **Allow actions created by GitHub**

**Workflow permissions:**

- ✅ **Read repository contents and packages permissions**

## 5. Team Access (if applicable)

### Collaborators Setup

Go to: **Settings** → **Manage access**

**Roles:**

- **Admin:** Can override branch protection (use sparingly)
- **Maintain:** Can manage PRs and issues
- **Write:** Can push to non-protected branches, create PRs
- **Triage:** Can manage issues and PRs
- **Read:** Can view and clone repository

## 6. Code Owners (Optional but recommended)

Create `.github/CODEOWNERS` file:

```
# Global owners
* @yourusername

# Frontend specific
*.tsx @frontend-team
*.ts @frontend-team

# Configuration files
*.json @devops-team
*.yml @devops-team
*.md @documentation-team
```

## 7. Quality Assurance Templates (Optional)

### Pre-Push Checklist Template

Create `PUSH_CHECKLIST.md`:

```markdown
## Pre-Push Quality Checklist

### Development to Staging

- [ ] Local testing completed
- [ ] TypeScript check passes (`npm run type-check`)
- [ ] Build test passes (`npm run build`)
- [ ] ESLint check passes (`npm run lint` - uses `eslint .` in Next.js 16)
- [ ] Development environment tested

### Staging to Production

- [ ] Staging deployment tested thoroughly
- [ ] Cross-browser compatibility verified
- [ ] All functionality working as expected
- [ ] Explicit approval obtained from project owner
- [ ] No critical issues identified
```

## 8. Verification Steps

After setup:

1. **Test the workflow:**

   ```bash
   git checkout develop
   # Make a small change
   git commit -m "Test workflow"
   git push origin develop
   ```

2. **Test direct push workflow:**
   - Push from `develop` to `staging` directly
   - Verify pre-push hooks run quality checks
   - Test that pushes are blocked if TypeScript/build errors exist
   - **Verify GitHub Actions CI passes** before proceeding
   - Verify deployment happens after successful push

3. **Test branch protection:**
   - Try to push to `main` without approval (should require explicit approval)
   - Try to push to `staging` without testing (should require development verification)
   - Verify pre-push hooks block pushes with quality issues
   - **Verify GitHub Actions CI passes** for each push

4. **Test pre-push hooks locally:**

   ```bash
   git push origin develop
   # Should run TypeScript check and build before pushing

   # ⚠️ CRITICAL: Verify CI passes
   gh run watch
   # OR: gh run list --branch develop --limit 1
   ```

5. **Test CI monitoring:**

   ```bash
   # Make a change that will fail CI (e.g., add TypeScript error)
   git push origin develop

   # Watch CI fail
   gh run watch

   # Fix the error and push again
   git push origin develop

   # Verify CI passes ✅
   gh run watch
   ```

## Emergency Procedures

### Bypass Protection (Emergency Only)

If you need to bypass protection rules in an emergency:

1. **Temporarily disable branch protection**
2. **Make emergency fix**
3. **Re-enable branch protection immediately**
4. **Create follow-up commit to document emergency change**

### Hotfix Process

For critical production issues:

```bash
git checkout main
git checkout -b hotfix/critical-issue
# Make minimal fix
git push origin hotfix/critical-issue
# Push to main after testing (will run all checks)
# After merge, ensure fix is also in develop branch
```

## 9. Current Project Features & Configuration

### Security Implementation

- **Security Headers:** CSP, X-Frame-Options, X-Content-Type-Options
- **API Rate Limiting:** 5 requests per 5 minutes per IP on contact endpoint
- **Environment Security:** Comprehensive `.env.example` with secure defaults
- **GDPR Compliance:** Cookie consent management with smart page detection

### Performance Optimizations

- **Image Optimization:** 20% compression with quality preservation
- **Critical CSS Inlining:** 100-150ms latency reduction
- **Modern Browser Targeting:** ES2022 targeting eliminates 11.4KB polyfills
- **Static Generation:** Pre-rendered pages for optimal loading

### Analytics & Tracking

- **Google Analytics 4:** GDPR-compliant implementation
- **Feature Flag System:** Environment-controlled analytics toggles
- **Consent Management:** Privacy-first cookie banner system

### Content Architecture

- **37+ Location Pages:** Comprehensive South East England coverage
- **25+ Service Pages:** Professional scaffolding services
- **Dual Content System:** MDX-first locations, TypeScript-driven services
- **SEO Optimization:** Schema.org markup, meta tags, sitemaps

### Documentation

- **ARCHITECTURE.md:** Complete technical documentation
- **TODO.md:** Project history and future planning
- **.env.example:** Environment configuration template

This setup ensures that no code reaches production without proper review, testing, and approval while maintaining enterprise-grade security and performance standards.
