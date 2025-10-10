# E2E Testing Strategy

## Problem: Tests Taking Too Long

Original E2E test suite was taking 10+ minutes to complete:

- 92 tests across 7 test files
- Heavy performance/accessibility/visual regression tests
- Blocking CI pipeline and slowing deployments

## Solution: Tiered Testing Approach

### Test Tiers

#### 1. **Smoke Tests** (~15 seconds local, ~3 minutes CI) ⚡️

**Purpose:** Ultra-fast validation that pages render without crashing

**What It Tests:**

- Critical pages load (HTTP 200 status)
- Basic content is present (H1 visible)

**What It Does NOT Test:**

- ❌ Navigation or interactions
- ❌ Console errors (CSP warnings from analytics are expected)
- ❌ Form elements or complex selectors
- ❌ Mobile menu or responsive behavior

**When To Run:**

- ✅ **Every push** to develop/staging/main (automatic in CI)
- ✅ Local development (`npm run test:e2e:smoke`)
- ✅ Before commits

**File:** `e2e/smoke.spec.ts` (7 tests, 59 lines)

```bash
npm run test:e2e:smoke  # Run smoke tests (Chromium only)
```

#### 2. **Standard Tests** (~2-3 minutes) 🔄

**Purpose:** Functional validation of key user flows

**What It Tests:**

- Contact form functionality
- Navigation (header, footer, mobile menu)
- Service page browsing
- Location page browsing

**When To Run:**

- Manual trigger via GitHub Actions
- Before major releases
- Weekly scheduled runs

**Files:**

- `e2e/contact-form.spec.ts`
- `e2e/navigation.spec.ts`
- `e2e/service-pages.spec.ts`
- `e2e/location-pages.spec.ts`

```bash
npm run test:e2e  # Run standard tests (excludes .full.spec.ts files)
```

#### 3. **Comprehensive Tests** (~10+ minutes) 🔬

**Purpose:** Deep quality validation (performance, accessibility, visual)

**What It Tests:**

- Core Web Vitals performance metrics
- WCAG 2.1 AA accessibility compliance
- Visual regression (screenshot comparison)
- Performance tracking with historical analysis

**When To Run:**

- Manual trigger only (GitHub Actions: "Run workflow" → Select "full")
- Before production deployments
- Monthly scheduled runs
- After major UI changes

**Files:**

- `e2e/performance.full.spec.ts`
- `e2e/accessibility.full.spec.ts`
- `e2e/visual-regression.full.spec.ts`

```bash
npm run test:e2e:full  # Run ALL tests including heavy ones
```

---

## npm Scripts Reference

### Quick Commands

```bash
# Ultra-fast smoke tests (~15s) - USE THIS MOST OFTEN
npm run test:e2e:smoke

# Standard functional tests (2-3min)
npm run test:e2e

# Full comprehensive suite (10min+)
npm run test:e2e:full
```

### Browser-Specific

```bash
npm run test:e2e:chromium  # Chrome only
npm run test:e2e:firefox   # Firefox only
npm run test:e2e:webkit    # Safari only
npm run test:e2e:mobile    # Mobile browsers
```

### Interactive

```bash
npm run test:e2e:ui       # Playwright UI mode
npm run test:e2e:headed   # See browser while testing
npm run test:e2e:debug    # Debug mode
```

### Specific Test Suites

```bash
npm run test:e2e:performance   # Performance tests only
npm run test:e2e:accessibility # Accessibility tests only
npm run test:e2e:visual        # Visual regression only
```

---

## GitHub Actions Workflow

### Automatic Triggers

**Every push** to develop/staging/main runs **smoke tests only** (~30s + CI overhead)

### Manual Triggers

Navigate to: Actions → E2E Tests → Run workflow

**Options:**

1. **smoke** (default) - Fast validation
2. **standard** - Functional tests
3. **full** - Complete test suite

---

## File Naming Conventions

| Pattern          | Purpose             | CI Behavior              |
| ---------------- | ------------------- | ------------------------ |
| `smoke.spec.ts`  | Smoke tests         | ✅ Always run            |
| `*.spec.ts`      | Standard tests      | ✅ Run by default        |
| `*.full.spec.ts` | Comprehensive tests | ❌ Manual/scheduled only |

---

## Test Coverage Matrix

### Smoke Tests (7 tests)

**Pages Tested (HTTP 200 + H1 visible):**

- [x] Homepage loads
- [x] Contact page loads
- [x] Services overview loads
- [x] Sample service page loads (access-scaffolding)
- [x] Locations overview loads
- [x] Sample location page loads (brighton)
- [x] About page loads

**Intentionally Excluded:**

- ❌ Console error checking (CSP warnings from GA4 are expected)
- ❌ Navigation tests (moved to standard tests)
- ❌ Mobile menu tests (moved to standard tests)
- ❌ Form element checks (moved to standard tests)
- ❌ Meta tag validation (moved to standard tests)

### Standard Tests (51 tests)

All smoke tests +

- [x] Contact form validation
- [x] Contact form submission
- [x] Desktop/mobile navigation
- [x] Footer links
- [x] Breadcrumb navigation
- [x] Service page content validation
- [x] Location page content validation
- [x] FAQ interactions
- [x] Trust badges display

### Comprehensive Tests (92 tests)

All standard tests +

- [x] Core Web Vitals (LCP, FID, CLS, FCP, TTFB, TBT)
- [x] Resource budget validation
- [x] Image optimization checks
- [x] Performance tracking & trends
- [x] WCAG 2.1 AA compliance (axe-core)
- [x] Heading hierarchy validation
- [x] Color contrast checking
- [x] Keyboard navigation
- [x] ARIA landmarks
- [x] Visual regression (22 screenshots across 7 viewports)

---

## Development Workflow

### Before Committing

```bash
npm run test:e2e:smoke  # Quick validation (~15s)
```

### Before Pull Request

```bash
npm run test:e2e  # Standard validation (2-3min)
```

### Before Production Deploy

```bash
npm run test:e2e:full  # Complete validation (10min+)
npm run performance:report  # Check performance trends
```

---

## Performance Impact

| Test Tier    | Duration (Local) | Duration (CI)       | Tests | Description                   |
| ------------ | ---------------- | ------------------- | ----- | ----------------------------- |
| **Smoke**    | ~15s             | ~3min (with setup)  | 7     | HTTP 200 + H1 checks only     |
| **Standard** | ~2-3min          | ~5min (with setup)  | 51    | Functional user flows         |
| **Full**     | ~10+min          | ~15min (with setup) | 92    | Performance/a11y/visual tests |

**CI Speedup:** 15min → 3min (80% reduction) ⚡️

**Note:** CI duration includes:

- Installing Node.js and dependencies (~45s)
- Installing Playwright Chromium browser (~60s)
- Starting Next.js dev server (~30s)
- Running tests (~15s for smoke tests)
- Uploading results (~15s)

---

## Troubleshooting

### Smoke Tests Failing

If smoke tests fail, **stop immediately** - something is fundamentally broken:

- Check build succeeds: `npm run build`
- Check TypeScript: `npm run type-check`
- Check unit tests: `npm test`
- Review error logs in test-results/

### Standard Tests Failing

- Review Playwright HTML report: `npx playwright show-report`
- Check specific test file for flaky selectors
- Run locally with headed mode: `npm run test:e2e:headed`

### Full Tests Timing Out

- Increase timeout in playwright.config.ts
- Check network performance
- Review performance baseline thresholds

---

## Future Improvements

- [ ] Add scheduled weekly full test runs
- [ ] Performance regression alerts in CI
- [ ] Visual regression baseline management
- [ ] Parallel test execution optimization
- [ ] Test result trending dashboard

---

## Related Documentation

- [E2E_TESTING.md](E2E_TESTING.md) - Complete E2E setup guide
- [PERFORMANCE_TESTING.md](PERFORMANCE_TESTING.md) - Performance test documentation
- [PERFORMANCE_TRACKING.md](PERFORMANCE_TRACKING.md) - Performance tracking guide

---

**Remember:** Smoke tests should ALWAYS pass. If they fail, don't proceed with deployment.
