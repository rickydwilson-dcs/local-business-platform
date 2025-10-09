# Performance, Visual & Accessibility Testing

## Overview

This project includes comprehensive testing to ensure high quality, fast performance, and accessibility:

1. **Performance Tests** - Core Web Vitals, PageSpeed metrics, resource budgets
2. **Visual Regression Tests** - Screenshot comparison to catch UI changes
3. **Accessibility Tests** - WCAG 2.1 AA compliance with axe-core

---

## Performance Testing

### What It Tests

- **Core Web Vitals** (Google's key metrics):
  - LCP (Largest Contentful Paint) - Main content load time
  - FID (First Input Delay) - Interactivity responsiveness
  - CLS (Cumulative Layout Shift) - Visual stability
  - FCP (First Contentful Paint) - First paint time
  - TTFB (Time to First Byte) - Server response time
  - TBT (Total Blocking Time) - Main thread blocking

- **Resource Budgets**:
  - Total page weight < 2MB
  - Images < 500KB each
  - JS files < 300KB each
  - CSS files < 100KB each
  - Total requests < 50

- **Loading Performance**:
  - DOM Content Loaded < 2s
  - Full Page Load < 3s
  - Mobile performance < 3.5s

### Running Performance Tests

```bash
# Run all performance tests
npm run test:e2e:performance

# View latest performance report and trends
npm run performance:report

# Run with UI to see metrics
npm run test:e2e:performance -- --ui

# Run on specific browser
npm run test:e2e:performance -- --project=chromium
```

### Performance Baseline

Thresholds are defined in [`performance-baseline.json`](performance-baseline.json):

```json
{
  "coreWebVitals": {
    "LCP": { "good": 1200, "warning": 2000, "critical": 3000 },
    "FID": { "good": 100, "warning": 300 },
    "CLS": { "good": 0.1, "warning": 0.15, "critical": 0.2 }
  }
}
```

**Note:** These thresholds are stricter than Google's defaults to maintain high performance standards.

### Example Performance Test

```typescript
test("homepage should meet Core Web Vitals thresholds", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const webVitals = await page.evaluate(() => {
    // Measure LCP, FCP, CLS, TTFB...
    return vitals;
  });

  expect(webVitals.lcp).toBeLessThan(2500); // Under 2.5s
  expect(webVitals.cls).toBeLessThan(0.1); // Good CLS
});
```

### Interpreting Results

**Console Output Example:**

```
Web Vitals: {
  lcp: 987,     // ✅ Good (< 1200ms)
  fcp: 654,     // ✅ Good (< 1800ms)
  cls: 0.08,    // ✅ Good (< 0.1)
  ttfb: 234     // ✅ Good (< 600ms)
}

✅ Performance result saved to test-results/performance/performance-history.json
```

**Performance Report Output:**

```
================================================================================
📊 PERFORMANCE TEST REPORT
================================================================================

Last Run: 2025-10-09T20:30:00.000Z
Total Test Runs: 15

## Latest Results

Page: /
Status: ✅ PASS

### Core Web Vitals

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| LCP | 987ms | <1200ms | ✅ Good |
| CLS | 0.08 | <0.1 | ✅ Good |
| FCP | 654ms | - | - |

### Trends

| Metric | Direction | Change |
|--------|-----------|--------|
| LCP | 📈 ↓ improving | -5.2% |
| CLS | → stable | 1.3% |
```

**When Tests Fail:**

- ❌ LCP > 1200ms - Optimize images, reduce JS bundle size, improve server response
- ⚠️ LCP 1200-2000ms - Warning threshold, consider optimization
- 🚨 LCP > 3000ms - Critical failure, must optimize immediately
- ❌ CLS > 0.1 - Set explicit dimensions on images, reserve space for dynamic content
- ⚠️ CLS 0.1-0.15 - Warning threshold, monitor closely
- ❌ TTFB > 600ms - Optimize server-side rendering, use CDN, enable caching

### Performance Tracking & Historical Data

All performance test results are automatically saved to JSON files for tracking over time:

**Files Generated:**

- `test-results/performance/performance-history.json` - Last 100 test runs with trends
- `test-results/performance/latest-results.json` - Most recent test results

**View Performance Report:**

```bash
npm run performance:report
```

**Features:**

- ✅ Automatic result persistence after each test run
- ✅ Historical comparison (last 10 vs previous 10 runs)
- ✅ Trend detection (improving, degrading, stable)
- ✅ Performance degradation alerts (>10% worse than baseline)
- ✅ Average metrics across all test runs
- ✅ Keeps last 100 results to prevent file bloat

**Degradation Alerts:**
If current performance is >10% worse than historical baseline, you'll see alerts:

```
⚠️ PERFORMANCE ALERTS:
⚠️ LCP degraded by 15% (950ms → 1092ms)
⚠️ CLS degraded by 12% (0.08 → 0.09)
```

---

## Visual Regression Testing

### What It Tests

Captures screenshots and compares them against baseline images to detect:

- Unintended UI changes
- Layout shifts
- CSS regressions
- Responsive design issues

### Test Coverage

- Homepage (desktop + mobile)
- Services pages
- Location pages
- Contact form
- Mobile menu
- Different viewport sizes (7 breakpoints)
- Hover states
- Form validation errors

### Running Visual Tests

```bash
# Run visual regression tests
npm run test:e2e:visual

# Update baseline screenshots (after intentional UI changes)
npm run test:e2e:visual:update

# View differences in UI mode
npm run test:e2e:visual -- --ui
```

### First Time Setup

1. Generate baseline screenshots:

   ```bash
   npm run test:e2e:visual:update
   ```

2. Commit baselines to git:

   ```bash
   git add e2e/**/*-snapshots/
   git commit -m "Add visual regression baselines"
   ```

3. Future runs will compare against these baselines

### Example Visual Test

```typescript
test("homepage should match visual baseline", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000); // Wait for animations

  await expect(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    maxDiffPixels: 100, // Allow 100 pixels difference
  });
});
```

### Handling Failures

**When visual test fails:**

1. View the diff image:

   ```bash
   npx playwright show-report
   ```

2. Three images shown:
   - **Expected** - Baseline screenshot
   - **Actual** - Current screenshot
   - **Diff** - Highlighted differences

3. If change is intentional:

   ```bash
   npm run test:e2e:visual:update
   git add e2e/**/*-snapshots/
   git commit -m "Update visual baselines after button redesign"
   ```

4. If change is unintended:
   - Fix the CSS/layout issue
   - Re-run tests to verify fix

### Configuration

**Sensitivity Settings:**

```typescript
await expect(page).toHaveScreenshot("page.png", {
  maxDiffPixels: 100, // Max 100 pixels can differ
  maxDiffPixelRatio: 0.01, // Max 1% of image can differ
  threshold: 0.2, // Pixel color threshold (0-1)
});
```

---

## Accessibility Testing

### What It Tests

WCAG 2.1 Level AA compliance using axe-core:

- Keyboard navigation
- Screen reader compatibility
- Color contrast (4.5:1 for text)
- Proper heading hierarchy
- Form labels
- ARIA attributes
- Alt text on images
- Semantic HTML

### Running Accessibility Tests

```bash
# Run all accessibility tests
npm run test:e2e:accessibility

# Run with report
npm run test:e2e:accessibility -- --reporter=html

# Test specific page
npx playwright test e2e/accessibility.spec.ts:6
```

### Test Coverage

- Homepage
- Services pages
- Location pages
- Contact form
- About page
- Navigation (desktop + mobile)
- High contrast mode

### Example Accessibility Test

```typescript
test("homepage should have no accessibility violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Interpreting Results

**Violation Example:**

```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Elements must have sufficient color contrast",
  "helpUrl": "https://dequeuniversity.com/rules/axe/4.4/color-contrast",
  "nodes": [
    {
      "html": "<p class=\"text-gray-400\">Light text</p>",
      "target": [".hero p"],
      "failureSummary": "Fix: Element has insufficient contrast ratio..."
    }
  ]
}
```

**Common Violations & Fixes:**

| Violation        | Impact   | Fix                                   |
| ---------------- | -------- | ------------------------------------- |
| `color-contrast` | Serious  | Darken text or lighten background     |
| `label`          | Critical | Add `<label for="id">` to form inputs |
| `link-name`      | Serious  | Add text or `aria-label` to links     |
| `heading-order`  | Moderate | Don't skip heading levels (H1→H2→H3)  |
| `image-alt`      | Critical | Add `alt` attribute to all images     |

### Accessibility Checklist

- ✅ All images have alt text
- ✅ Form inputs have labels
- ✅ Links have accessible names
- ✅ Heading hierarchy is correct (H1→H2→H3)
- ✅ Color contrast ratios meet WCAG AA (4.5:1)
- ✅ Keyboard navigation works
- ✅ ARIA landmarks present (main, nav, header, footer)
- ✅ High contrast mode supported

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Quality Tests

on: [push, pull_request]

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e:performance

      - name: Fail if performance degrades
        run: |
          # Parse results and fail if thresholds exceeded

  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e:accessibility

  visual-regression-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e:visual
```

---

## Best Practices

### Performance

1. **Run performance tests before every deployment**
2. **Set alerts for threshold violations**
3. **Monitor trends over time** (track LCP, CLS weekly)
4. **Test on real mobile devices** when possible
5. **Use lighthouse CI** for automated PageSpeed monitoring

### Visual Regression

1. **Update baselines** only after intentional UI changes
2. **Use semantic versioning** for baseline updates
3. **Review diffs carefully** before approving
4. **Test on same OS/browser** for consistency
5. **Exclude dynamic content** (dates, user-specific data)

### Accessibility

1. **Test with real screen readers** (NVDA, JAWS, VoiceOver)
2. **Test keyboard navigation** manually
3. **Use browser DevTools** Accessibility panel
4. **Get feedback** from users with disabilities
5. **Make accessibility** part of code review

---

## Performance Optimization Checklist

Based on test results, optimize:

- [ ] Images (WebP format, lazy loading, proper dimensions)
- [ ] JavaScript (code splitting, tree shaking, minification)
- [ ] CSS (remove unused styles, inline critical CSS)
- [ ] Fonts (preload, subset, font-display: swap)
- [ ] Caching (service worker, HTTP caching headers)
- [ ] Server (enable compression, HTTP/2, CDN)

---

## Troubleshooting

### Performance Tests Failing

**Problem:** LCP > 2500ms

**Solutions:**

- Optimize largest image (compress, resize)
- Lazy load below-fold images
- Reduce JavaScript execution time
- Enable server-side rendering
- Use CDN for static assets

**Problem:** High CLS (> 0.1)

**Solutions:**

- Add width/height to all images
- Reserve space for ads/embeds
- Avoid inserting content above existing content
- Use CSS `aspect-ratio` for responsive images

### Visual Tests Failing

**Problem:** Font rendering differences

**Solution:**

```typescript
await expect(page).toHaveScreenshot("page.png", {
  maxDiffPixels: 200, // Increase tolerance
  threshold: 0.3, // Less sensitive to small changes
});
```

**Problem:** Dynamic content causing failures

**Solution:**

```typescript
// Hide dynamic elements before screenshot
await page.evaluate(() => {
  document.querySelectorAll(".timestamp").forEach((el) => (el.style.display = "none"));
});
```

### Accessibility Tests Failing

**Problem:** False positives from third-party widgets

**Solution:**

```typescript
const accessibilityScanResults = await new AxeBuilder({ page })
  .exclude("#third-party-widget") // Exclude specific elements
  .withTags(["wcag2aa"])
  .analyze();
```

---

## Resources

- [Web Vitals Guide](https://web.dev/vitals/)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Your site now has comprehensive quality gates to maintain high performance, visual consistency, and accessibility! 🚀♿🎨**
