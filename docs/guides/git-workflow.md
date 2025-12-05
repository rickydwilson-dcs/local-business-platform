# Git Workflow Guide

**Estimated Time:** 5-10 minutes
**Prerequisites:** Git installed, repository access
**Difficulty:** Beginner

---

## Overview

The Local Business Platform uses a three-branch workflow for quality control: develop → staging → main. This guide explains how to work with this branching strategy.

## Branch Structure

```
develop  →  staging  →  main
(dev)       (preview)    (production)
```

| Branch    | Environment | Purpose                                 |
| --------- | ----------- | --------------------------------------- |
| `develop` | Development | Active development, fast iteration      |
| `staging` | Preview     | Pre-production testing, QA verification |
| `main`    | Production  | Live customer-facing sites              |

## Standard Workflow

### Step 1: Start on Develop

Always start work on the develop branch:

```bash
git checkout develop
git pull origin develop
```

### Step 2: Make Changes

```bash
# Make your changes...
git add .
git commit -m "feat(content): add Brighton location page"
```

### Step 3: Push to Develop

```bash
git push origin develop
```

**Wait for CI:**

```bash
gh run watch
```

### Step 4: Promote to Staging

```bash
git checkout staging
git merge develop
git push origin staging
```

**Wait for CI + E2E:**

```bash
gh run watch
```

### Step 5: Verify on Staging

1. Visit staging URL
2. Test affected functionality
3. Verify no console errors

### Step 6: Promote to Production

```bash
git checkout main
git merge staging
git push origin main
```

**Monitor deployment:**

```bash
gh run watch
```

## Commit Message Convention

Use conventional commits for clear history:

```
type(scope): description

Examples:
feat(content): add Brighton location page
fix(contact): resolve form validation error
docs(readme): update installation instructions
style(hero): improve mobile responsiveness
refactor(api): simplify rate limiting logic
test(e2e): add service page tests
chore(deps): update dependencies
```

### Types

| Type       | Description                          |
| ---------- | ------------------------------------ |
| `feat`     | New feature                          |
| `fix`      | Bug fix                              |
| `docs`     | Documentation                        |
| `style`    | Styling/formatting (no logic change) |
| `refactor` | Code refactoring                     |
| `test`     | Adding/updating tests                |
| `chore`    | Maintenance tasks                    |

### Scopes

| Scope       | Description                    |
| ----------- | ------------------------------ |
| `content`   | MDX files, locations, services |
| `component` | UI components                  |
| `api`       | API routes                     |
| `config`    | Configuration files            |
| `deps`      | Dependencies                   |
| `ci`        | CI/CD workflows                |

## Pre-Push Hooks

The repository has pre-push hooks that run automatically:

```bash
# What runs before every push:
npm run type-check    # TypeScript validation
npm run build         # Production build test
npm run test:e2e:smoke  # Smoke tests (develop/staging only)
```

**If hooks fail, the push is blocked.** Fix the issues and retry.

### Running Checks Manually

```bash
# Run all pre-commit checks
npm run pre-commit-check

# Or individually:
npm run type-check
npm run build
npm run test:e2e:smoke
```

## Common Scenarios

### Feature Development

```bash
# Start on develop
git checkout develop
git pull origin develop

# Make changes and commit
git add .
git commit -m "feat(service): add chimney scaffolding service"
git push origin develop

# Wait for CI, then promote
git checkout staging && git merge develop && git push origin staging
git checkout main && git merge staging && git push origin main
```

### Quick Bug Fix

```bash
# Start on develop
git checkout develop
git pull origin develop

# Fix and commit
git add .
git commit -m "fix(contact): prevent duplicate form submissions"
git push origin develop

# Rapid promotion after CI passes
git checkout staging && git merge develop && git push origin staging
git checkout main && git merge staging && git push origin main
```

### Documentation Update

```bash
git checkout develop
git add docs/
git commit -m "docs(guide): update deployment instructions"
git push origin develop

# Promote through pipeline
```

## Handling Conflicts

### Merge Conflict on Staging

```bash
git checkout staging
git merge develop
# If conflict:
# 1. Edit conflicting files
# 2. Remove conflict markers
# 3. Stage and commit
git add .
git commit -m "merge: resolve staging conflict"
git push origin staging
```

### Merge Conflict on Main

```bash
git checkout main
git merge staging
# If conflict:
# 1. Edit conflicting files
# 2. Remove conflict markers
# 3. Stage and commit
git add .
git commit -m "merge: resolve production conflict"
git push origin main
```

## Emergency Procedures

### Rollback Production

```bash
# Option 1: Revert last commit
git checkout main
git revert HEAD
git push origin main

# Option 2: Reset to previous commit (caution!)
git checkout main
git reset --hard HEAD~1
git push origin main --force
```

### Skip Pre-Push Hooks (Emergency Only)

```bash
# Only in genuine emergency!
git push origin main --no-verify
```

## Branch Protection Rules

### develop

- Requires CI to pass before merge
- Smoke tests must pass

### staging

- Requires CI to pass before merge
- Full E2E tests must pass

### main

- Requires CI to pass before merge
- Full E2E tests must pass
- Should only receive merges from staging

## Syncing Branches

If branches get out of sync:

```bash
# Ensure develop is current
git checkout develop
git pull origin develop

# Update staging from develop
git checkout staging
git merge develop
git push origin staging

# Update main from staging
git checkout main
git merge staging
git push origin main
```

## Best Practices

### Do

- ✅ Always start on develop
- ✅ Wait for CI to pass before promoting
- ✅ Verify on staging before production
- ✅ Use descriptive commit messages
- ✅ Pull latest changes before starting work

### Don't

- ❌ Push directly to main
- ❌ Skip staging verification
- ❌ Force push to shared branches
- ❌ Use generic commit messages like "fix"
- ❌ Merge to main without staging approval

## Related

- [GitHub Actions](./github-actions.md) - CI/CD pipeline details
- [Deploying a Site](./deploying-site.md) - Deployment procedures
- [Quality Standards](../standards/quality.md) - Quality gates

---

**Last Updated:** 2025-12-05
