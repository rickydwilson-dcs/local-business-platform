# E2E Testing Strategy

## Problem: Tests Taking Too Long

Original E2E test suite was taking 10+ minutes to complete:

- 92 tests across 7 test files
- Heavy performance/accessibility/visual regression tests
- Blocking CI pipeline and slowing deployments

## Solution: Tiered Testing Approach

### Test Tiers

#### 1. **Smoke Tests** (~30 seconds) ⚡️

**Purpose:** Fast validation that pages render without crashing

**What It Tests:**

- Critical pages load (200 status)
- No JavaScript console errors
- Basic content is present (H1, CTAs exist)
- Simple navigation works

**When To Run:**

- ✅ **Every push** to develop/staging/main
- ✅ Local development (`npm run test:e2e:smoke`)
- ✅ Before commits

**File:** `e2e/smoke.spec.ts` (12 tests)

```bash
npm run test:e2e:smoke  # Run smoke tests
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
# Fast smoke tests (30s) - USE THIS MOST OFTEN
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

### Smoke Tests (12 tests)

- [x] Homepage loads
- [x] Contact page & form present
- [x] Services overview loads
- [x] Sample service page loads
- [x] Locations overview loads
- [x] Sample location page loads
- [x] About page loads
- [x] No console errors
- [x] Header navigation works
- [x] Mobile menu works
- [x] Meta tags present

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
npm run test:e2e:smoke  # Quick validation (30s)
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

| Test Tier    | Duration | Tests | CI Time             |
| ------------ | -------- | ----- | ------------------- |
| **Smoke**    | 30s      | 12    | ~2min (with setup)  |
| **Standard** | 2-3min   | 51    | ~5min (with setup)  |
| **Full**     | 10+min   | 92    | ~15min (with setup) |

**CI Speedup:** 15min → 2min (87% reduction) ⚡️

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
