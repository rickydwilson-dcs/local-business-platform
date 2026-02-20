# Service Migration Testing Plan

## Overview

This document outlines the testing strategy to ensure zero regression when migrating from serviceDataMap to MDX-first architecture.

## Testing Phases

### Phase 1: Baseline Snapshot ✓

**Goal**: Capture current state before any changes

**Actions**:

1. Build current site: `npm run build`
2. Take screenshots of all 23 service pages
3. Export serviceDataMap to JSON baseline
4. Record current page metadata (titles, descriptions, keywords)
5. Save HTML snapshots of rendered pages

**Tools**:

- Playwright for automated screenshots
- Custom script to extract serviceDataMap
- Lighthouse for performance baseline

**Output**:

```
scripts/migration-snapshots/
├── baseline.json                    # Complete serviceDataMap
├── screenshots/                      # Visual snapshots
│   ├── access-scaffolding.png
│   ├── commercial-scaffolding.png
│   └── ...
├── html-snapshots/                   # Rendered HTML
│   ├── access-scaffolding.html
│   └── ...
└── metadata.json                     # SEO metadata
```

### Phase 2: Data Comparison Testing

**Goal**: Validate MDX data matches serviceDataMap exactly

**Test Cases**:

1. **Field-by-field comparison**
   - title matches
   - description matches
   - badge matches
   - benefits array identical (order + content)
   - FAQs array identical (order + content)
   - images match
   - businessHours match (location-specific)
   - localContact match (location-specific)

2. **Service count validation**
   - 17 base services present
   - 6 location-specific services present
   - No missing services
   - No extra unexpected services

3. **Data type validation**
   - All required fields present
   - Optional fields handled correctly
   - Array lengths match
   - No null/undefined where values expected

**Script**: `npm run test:migration -- --phase compare`

**Pass Criteria**: 100% match on all fields

### Phase 3: Visual Regression Testing

**Goal**: Ensure rendered pages look identical

**Actions**:

1. Build with new MDX implementation
2. Take screenshots of all service pages
3. Pixel-by-pixel comparison with baseline
4. Flag any visual differences

**Tools**:

- Playwright for screenshots
- pixelmatch for image comparison
- Percy.io (optional, for cloud diffing)

**Test Command**:

```bash
npm run test:visual-regression
```

**Pass Criteria**:

- 0 pixel differences on critical content
- Acceptable tolerance: < 0.1% for anti-aliasing

### Phase 4: Functional Testing

**Goal**: Verify all features work correctly

**Test Cases**:

1. **Routing**
   - All 23 service URLs return 200
   - No 404 errors
   - Correct redirects if any

2. **Metadata/SEO**
   - `<title>` tags match baseline
   - Meta descriptions match
   - Keywords match
   - OpenGraph tags present
   - Twitter cards present
   - Canonical URLs correct

3. **Schema.org markup**
   - Service schema present
   - BreadcrumbList present
   - FAQPage schema present (if FAQs)
   - Valid JSON-LD
   - Google Rich Results Test passes

4. **Component rendering**
   - ServiceHero displays correctly
   - ServiceBenefits lists all items
   - ServiceFAQ shows all Q&A
   - ServiceGallery shows images
   - Breadcrumbs correct
   - CTA buttons present

5. **Build process**
   - `generateStaticParams()` finds all services
   - Build completes without errors
   - No TypeScript errors
   - No runtime errors in console

**Test Command**:

```bash
npm run build
npm run test:e2e
```

### Phase 5: Performance Testing

**Goal**: Ensure no performance regression

**Metrics to Compare**:

- Build time
- Bundle size
- Lighthouse scores (Performance, SEO, Accessibility)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)

**Pass Criteria**:

- Build time: Within 10% of baseline
- Bundle size: No increase (should decrease)
- Lighthouse scores: Maintain or improve
- Core Web Vitals: No regression

### Phase 6: Content Quality Testing

**Goal**: Improve content during migration

**Actions**:

1. Replace generic `getServiceFAQs()` with real FAQs
2. Ensure FAQs are unique per service
3. Validate SEO keyword targeting
4. Check content reads naturally (not templated)

**Manual Review Checklist**:

- [ ] Each service has unique FAQs
- [ ] FAQs answer real customer questions
- [ ] No "template" language remains
- [ ] Location-specific content is contextual
- [ ] Keywords used naturally

## Test Execution Order

```bash
# 1. Create baseline (before any changes)
npm run test:snapshot

# 2. Make migration changes
# ... (implementation work)

# 3. Compare data
npm run test:migration -- --phase compare

# 4. Visual regression
npm run test:visual-regression

# 5. Functional tests
npm run build
npm run test:e2e

# 6. Performance comparison
npm run test:performance

# 7. Manual content review
# (Human review of MDX files)
```

## Rollback Plan

If tests fail:

1. Identify specific failures from reports
2. Fix issues in MDX or code
3. Re-run failed tests
4. If unfixable: `git checkout main` (revert branch)

## Success Criteria Summary

✅ **All tests must pass**:

- [x] Data comparison: 100% match
- [x] Visual regression: < 0.1% difference
- [x] Functional tests: All pass
- [x] Build: No errors
- [x] Performance: No regression
- [x] Content: Improved quality

Only merge when all criteria met.

## Automated Test Commands

Add to `package.json`:

```json
{
  "scripts": {
    "test:snapshot": "ts-node scripts/create-baseline-snapshot.ts",
    "test:migration": "ts-node scripts/test-service-migration.ts",
    "test:visual-regression": "playwright test tests/visual-regression.spec.ts",
    "test:e2e": "playwright test tests/services-e2e.spec.ts",
    "test:performance": "lighthouse-ci autorun"
  }
}
```

## Timeline

- Phase 1 (Baseline): 30 minutes
- Phase 2 (Data Comparison): Automated, < 5 minutes
- Phase 3 (Visual): Automated, 10 minutes
- Phase 4 (Functional): Automated, 15 minutes
- Phase 5 (Performance): Automated, 10 minutes
- Phase 6 (Content Review): Manual, 1-2 hours

**Total automated testing time: ~40 minutes**
**Total with manual review: 2-3 hours**
