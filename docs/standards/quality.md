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

## Dead code from an in-place redesign

When a site is redesigned in place — DCS's solaris → r9 migration is the reference case — the old
components stop being imported but are almost never deleted. Each port phase records them as "out
of scope", and **nothing ever fails**:

- `type-check` passes, because an unimported file is still valid TypeScript
- `lint` passes, because being unused is not an error
- the tests never import them, so coverage says nothing
- Tailwind's purge removes only the utilities **it** generates — hand-authored rules in
  `globals.css` ship forever
- a dead script in the root layout keeps executing on every page, observing elements that no
  longer exist

DCS, September 2026: 11 orphaned components (1,596 lines), ~27 dead CSS classes, a dead
`IntersectionObserver` on every page, and a cross-origin Google Fonts request for an icon font no
live page used. All of it had been green in CI for months.

### Detecting it

```bash
npx tsx tools/find-dead-code.ts --site sites/<name>   # one site
npx tsx tools/find-dead-code.ts --all                 # the whole estate
```

It walks the import graph from what Next.js actually routes (plus every test file, wherever it
lives) and reports unreachable modules, then reports authored CSS classes no source references.

**Its output is candidates, not findings.** Two things it cannot know, both of which have already
produced false positives here:

- **Runtime-built class names.** ``className={`svccard svccard--${color}`}`` means the literal
  `svccard--magenta` appears nowhere. The tool detects the `svccard--${` prefix and files these
  under "probably fine" — check that bucket rather than deleting from it.
- **Verbatim-guarded stylesheets.** DCS's `home-r9.css` and `inner-pages.css` are asserted
  byte-for-byte against frozen sources by `home-css-parity.test.ts` and `chrome-parity.test.ts`.
  Classes reported dead in those files **must not be removed** — the guard is the point.

Always confirm a deletion the way the tool cannot: does anything import the path (not the symbol
name — r9 replacements frequently export the _same_ symbol from a new path, which defeats a
name-based grep), and does the site still build and render.

### Preventing it

- **A redesign is not finished when the new pages ship.** It is finished when the old ones are
  deleted. If a phase genuinely must defer that, the deferral belongs in the handoff as an
  explicit task, not as a comment on the orphan saying "left in place".
- **Run the audit before closing out any in-place redesign**, and before any performance work —
  dead code is the cheapest thing to remove and the easiest to overlook, because no metric names it.
- **Prefer deleting to commenting.** Git has the old version; an orphan in the tree is a file the
  next agent must reason about and a stylesheet every visitor downloads.
- **Watch the root layout in particular.** Anything rendered there runs on every page of the site,
  so a dead component costs more there than anywhere else, and reachability analysis will NOT flag
  it — it is genuinely imported. Removing it needs the judgement the tool cannot supply: does the
  thing it acts on still exist?

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
- [ ] Build succeeds (`pnpm build`)
- [ ] Site lint passes (`pnpm --filter <site> run lint` — repeat for each site modified)
- [ ] Type-check passes (`pnpm type-check`)
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
