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
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals:** 1 (minimum)
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners** (if you have CODEOWNERS file)
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
- Runs on every PR to `staging`, `main`
- Executes: ESLint → TypeScript check → Build test
- Only allows merge if all checks pass

**First run setup:**

1. Push the workflow file to `develop` branch
2. Create a test PR to `staging` to trigger the first run
3. After first run, the status checks will appear in branch protection settings
4. Add the status checks to branch protection rules

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
2. **Staging** - Preview environment for final testing
3. **Main** - Production deployment

**⚠️ Important:** Never push directly to production (`main`) - always follow the proper branch sequence.

## 4. GitHub Repository Settings

### General Settings

- ✅ **Allow merge commits**
- ✅ **Allow squash merging** (recommended for clean history)
- ❌ **Allow rebase merging** (optional, can cause confusion)
- ✅ **Always suggest updating pull request branches**
- ✅ **Allow auto-merge**
- ✅ **Automatically delete head branches** (cleans up after PR merge)

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

## 7. Issue and PR Templates (Optional)

### Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Local testing completed
- [ ] All status checks passing
- [ ] Staging deployment tested

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Changes generate no new warnings
- [ ] Any dependent changes have been merged
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

2. **Create test PR:**
   - Create PR from `develop` to `staging`
   - Verify GitHub Actions run
   - Verify status checks appear
   - Test that PR cannot be merged if checks fail

3. **Test branch protection:**
   - Try to push directly to `main` (should fail)
   - Try to push directly to `staging` (should fail)
   - Verify only PRs can update protected branches

4. **Test pre-push hooks locally:**
   ```bash
   git push origin develop
   # Should run TypeScript check and build before pushing
   ```

## Emergency Procedures

### Bypass Protection (Emergency Only)

If you need to bypass protection rules in an emergency:

1. **Temporarily disable branch protection**
2. **Make emergency fix**
3. **Re-enable branch protection immediately**
4. **Create follow-up PR to document emergency change**

### Hotfix Process

For critical production issues:

```bash
git checkout main
git checkout -b hotfix/critical-issue
# Make minimal fix
git push origin hotfix/critical-issue
# Create PR to main (will run all checks)
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
