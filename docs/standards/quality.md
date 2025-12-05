# Quality Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

Quality is enforced through automated checks at multiple stages: pre-commit hooks, pre-push hooks, CI/CD pipeline, and manual review. All code must pass quality gates before reaching production.

## Core Principles

### 1. Quality Gates Block Progress

Failed checks prevent merging and deployment.

### 2. Automation First

All checks run automatically - no manual steps required.

### 3. Fail Fast

Issues caught early in development cycle.

## Quality Gate Stages

### Stage 1: Pre-Commit (Husky)

```bash
# .husky/pre-commit
npm run lint-staged
npm run validate:content
```

**Checks:**

- ESLint on staged files
- Prettier formatting
- MDX content validation

### Stage 2: Pre-Push (Husky)

```bash
# .husky/pre-push
npm run type-check
npm run build
```

**Checks:**

- TypeScript compilation
- Production build success

**Note:** Pre-push hooks **BLOCK** if failed. Run `npm run pre-commit-check` before committing to avoid issues.

### Stage 3: CI/CD (GitHub Actions)

**On every push:**

- ESLint validation
- TypeScript validation
- Unit tests (141+ tests)
- Production build
- Content validation

**Branch-specific E2E:**

- develop: Smoke tests (7 tests)
- staging: Standard tests (58 tests)
- main: Standard tests (58 tests)

### Stage 4: Manual Review

- Code review on PRs
- Visual verification on staging
- Accessibility audit

## Quality Checklist

### Before Committing

- [ ] Code compiles (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Content validates (`npm run validate:content`)

### Before Pushing

- [ ] Pre-commit checks pass
- [ ] Build succeeds (`npm run build`)
- [ ] E2E smoke tests pass (`npm run test:e2e:smoke`)

### Before Merging to Staging

- [ ] All CI checks pass on develop
- [ ] Feature tested locally
- [ ] No console errors

### Before Merging to Main

- [ ] All CI + E2E pass on staging
- [ ] Visual verification complete
- [ ] Team approval obtained

## TypeScript Requirements

### Strict Mode Enabled

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### No `any` Types

```typescript
// ❌ WRONG
const handleData = (data: any) => { ... }

// ✅ CORRECT
interface DataType {
  id: string;
  value: number;
}
const handleData = (data: DataType) => { ... }
```

## ESLint Configuration

### Key Rules

```javascript
// eslint.config.mjs
{
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
  }
}
```

## Performance Requirements

### Core Web Vitals

| Metric                         | Target  | Threshold |
| ------------------------------ | ------- | --------- |
| LCP (Largest Contentful Paint) | < 2.5s  | < 4s      |
| FID (First Input Delay)        | < 100ms | < 300ms   |
| CLS (Cumulative Layout Shift)  | < 0.1   | < 0.25    |

### Build Performance

| Metric              | Target         |
| ------------------- | -------------- |
| Build time (cached) | < 1s           |
| Build time (fresh)  | < 30s          |
| Bundle size         | Monitor growth |

### Lighthouse Scores

| Category       | Minimum |
| -------------- | ------- |
| Performance    | 90+     |
| Accessibility  | 95+     |
| Best Practices | 95+     |
| SEO            | 95+     |

## Architecture Discovery Protocol

**BEFORE implementing ANY feature:**

### Phase 1: Pattern Discovery

```bash
# Identify existing patterns
find app -name "*.tsx" -path "*/[slug]/*" | head -10

# Read relevant routing file FIRST
cat app/services/[slug]/page.tsx
cat app/locations/[slug]/page.tsx
```

### Phase 2: Confirmation

- [ ] Confirmed MDX-only architecture
- [ ] Verified no centralized data files needed
- [ ] Checked existing patterns in codebase
- [ ] Ready to implement following patterns

### Phase 3: Violation Detection

If any of these files exist, there's an architecture violation:

```
❌ lib/locations.ts (centralized data)
❌ lib/services.ts (centralized data)
❌ app/locations/[specific-location]/page.tsx (static page)
❌ app/services/[specific-service]/page.tsx (static page)
```

## Success Criteria

### Services Implementation

- [ ] MDX file created in `/content/services/`
- [ ] Comprehensive frontmatter (hero, FAQs, benefits)
- [ ] 3-15 FAQs included
- [ ] Dynamic routing renders content
- [ ] No centralized data files

### Locations Implementation

- [ ] MDX file created in `/content/locations/`
- [ ] Comprehensive frontmatter (hero, services, pricing)
- [ ] Dynamic routing renders content
- [ ] No centralized data files

## What NOT to Do

| Anti-Pattern            | Why It's Wrong         | Correct Approach   |
| ----------------------- | ---------------------- | ------------------ |
| Skip type-check         | Runtime errors         | Always type-check  |
| Disable ESLint rules    | Tech debt              | Fix the issue      |
| Skip tests              | Regressions            | Run full suite     |
| Hardcode content        | Not maintainable       | Use MDX            |
| Create centralized data | Architecture violation | MDX-only           |
| Push without building   | May break production   | Always build first |

## Verification Commands

```bash
# Full pre-commit check
npm run pre-commit-check

# Type check
npm run type-check

# Lint
npm run lint

# Tests
npm test

# E2E Smoke
npm run test:e2e:smoke

# Content validation
npm run validate:content

# Build
npm run build
```

## CI Status Monitoring

```bash
# Check CI status
gh run list --branch develop --limit 1

# Watch CI in real-time
gh run watch

# Open in browser
gh run view --web
```

## Related Standards

- [Testing](./testing.md) - Test requirements
- [Deployment](./deployment.md) - Deployment quality gates
- [Content](./content.md) - Content architecture

---

**Maintained By:** Digital Consulting Services
