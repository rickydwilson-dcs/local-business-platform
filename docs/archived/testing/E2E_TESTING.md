# End-to-End (E2E) Testing with Playwright

**For all sites in the Local Business Platform**

> Originally developed for colossus-reference, this E2E testing approach should be replicated for all client sites to ensure quality before deployment.

## Overview

This project uses **Playwright** for automated end-to-end testing of critical user flows in real browsers. E2E tests complement the existing unit tests (Vitest) by testing the complete application from a user's perspective.

## Test Coverage

### **51 E2E Tests** across 4 test suites:

1. **Contact Form Tests** (`e2e/contact-form.spec.ts`) - 9 tests
   - Form display and validation
   - Error handling (empty fields, invalid email)
   - Successful submissions
   - Accessibility (labels, breadcrumbs)
   - Mobile responsiveness

2. **Navigation Tests** (`e2e/navigation.spec.ts`) - 11 tests
   - Desktop and mobile navigation
   - Header links (Services, About, Contact)
   - Mobile hamburger menu
   - Footer links
   - Breadcrumb navigation
   - Logo click-through
   - Phone links and CTA buttons

3. **Service Pages Tests** (`e2e/service-pages.spec.ts`) - 14 tests
   - Services overview page
   - Individual service pages (Access Scaffolding, Facade, etc.)
   - FAQ expansion/collapse
   - Breadcrumbs and CTAs
   - Schema.org structured data
   - Image loading
   - Mobile responsiveness
   - Batch loading test (all 25 services)

4. **Location Pages Tests** (`e2e/location-pages.spec.ts`) - 17 tests
   - Locations overview page
   - Individual location pages (Brighton, Hastings, Canterbury, etc.)
   - Hero sections with phone numbers
   - Trust badges display
   - Location-specific FAQs
   - Areas served sections
   - Schema.org LocalBusiness markup
   - Mobile responsiveness
   - County navigation

---

## Running E2E Tests

### Quick Start

```bash
# Run all E2E tests (all browsers)
npm run test:e2e

# Run tests in specific browser
npm run test:e2e:chromium    # Chrome only
npm run test:e2e:firefox     # Firefox only
npm run test:e2e:webkit      # Safari (WebKit) only

# Run mobile tests
npm run test:e2e:mobile      # Mobile Chrome + Mobile Safari

# Interactive UI mode (best for development)
npm run test:e2e:ui

# Headed mode (see browser window)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# Run ALL tests (unit + E2E)
npm run test:all
```

### Prerequisites

1. **Install Playwright browsers** (one-time setup):

   ```bash
   npx playwright install
   ```

2. **Development server must be running**:
   - Playwright will automatically start `npm run dev` before tests
   - Tests run against `http://localhost:3000`

---

## Test Configuration

Configuration file: [`playwright.config.ts`](playwright.config.ts)

### Browser Projects

Tests run across 5 browser configurations:

- **Desktop Chrome** (chromium)
- **Desktop Firefox** (firefox)
- **Desktop Safari** (webkit)
- **Mobile Chrome** (Pixel 5 viewport)
- **Mobile Safari** (iPhone 12 viewport)

### Test Settings

- **Timeout**: 30 seconds per test
- **Retries**: 2 retries in CI, 0 locally
- **Parallel execution**: 4 workers locally, 1 in CI
- **Video recording**: Only on failure
- **Screenshots**: Only on failure
- **Traces**: On first retry (for debugging)

---

## Writing New E2E Tests

### Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/your-page");
  });

  test("should do something", async ({ page }) => {
    // Arrange
    const button = page.locator('button[type="submit"]');

    // Act
    await button.click();

    // Assert
    await expect(page.locator("text=Success")).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors:

   ```html
   <button data-testid="submit-button">Submit</button>
   ```

   ```typescript
   await page.getByTestId("submit-button").click();
   ```

2. **Wait for elements properly**:

   ```typescript
   // Good ✅
   await expect(page.locator("text=Success")).toBeVisible({ timeout: 5000 });

   // Bad ❌
   await page.waitForTimeout(5000);
   ```

3. **Group related tests**:

   ```typescript
   test.describe("Contact Form", () => {
     test.describe("Validation", () => {
       // Validation tests
     });

     test.describe("Submission", () => {
       // Submission tests
     });
   });
   ```

4. **Clean up between tests**:

   ```typescript
   test.beforeEach(async ({ page }) => {
     // Setup
   });

   test.afterEach(async ({ page }) => {
     // Cleanup
   });
   ```

---

## Debugging Failed Tests

### 1. View Test Report

```bash
npx playwright show-report
```

Opens HTML report with:

- Screenshots of failures
- Video recordings
- Test traces
- Error logs

### 2. Run in Headed Mode

```bash
npm run test:e2e:headed
```

See the browser window as tests run.

### 3. Debug Mode

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### 4. Run Single Test

```bash
npx playwright test e2e/contact-form.spec.ts:41
```

Run specific test by line number.

### 5. Check Screenshots/Videos

Failed tests save artifacts to `test-results/`:

```
test-results/
  contact-form-should-submit/
    test-failed-1.png          # Screenshot at failure
    video.webm                 # Video recording
    trace.zip                  # Trace file
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Common Test Patterns

### Testing Forms

```typescript
test("should submit contact form", async ({ page }) => {
  await page.goto("/contact");

  await page.fill('input[name="name"]', "John Doe");
  await page.fill('input[name="email"]', "john@example.com");
  await page.fill('textarea[name="message"]', "Test message");

  await page.click('button[type="submit"]');

  await expect(page.locator("text=Thank you")).toBeVisible();
});
```

### Testing Navigation

```typescript
test("should navigate to services", async ({ page }) => {
  await page.goto("/");

  await page.click('a[href="/services"]');

  await expect(page).toHaveURL(/.*services/);
  await expect(page.locator("h1")).toContainText("Services");
});
```

### Testing Mobile

```typescript
test("should work on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto("/");

  // Test mobile menu
  await page.click('button[aria-label="menu"]');
  await expect(page.locator(".mobile-menu")).toBeVisible();
});
```

### Testing Accessibility

```typescript
test("should have accessible form", async ({ page }) => {
  await page.goto("/contact");

  // Check ARIA labels
  const submitButton = page.locator('button[type="submit"]');
  await expect(submitButton).toHaveAccessibleName();

  // Check form labels
  const nameInput = page.locator('input[name="name"]');
  await expect(nameInput).toHaveAttribute("aria-label");
});
```

---

## Test vs E2E Testing

| Aspect             | Unit/Integration Tests (Vitest)      | E2E Tests (Playwright)             |
| ------------------ | ------------------------------------ | ---------------------------------- |
| **Speed**          | Very fast (~4 seconds for 141 tests) | Slower (~2-3 minutes for 51 tests) |
| **Scope**          | Individual functions, components     | Complete user flows                |
| **Dependencies**   | Mocked (no network, no DB)           | Real browser, real network         |
| **What They Test** | Business logic, validation, schemas  | UI interactions, navigation, forms |
| **When to Run**    | Every commit, pre-push               | Before deployment, nightly builds  |
| **Debugging**      | Easy (stack traces)                  | Harder (need screenshots/videos)   |

### Recommendation

- **Run unit tests frequently** (every commit)
- **Run E2E tests before deployment** (staging, production)
- **Use both** for comprehensive coverage

---

## Troubleshooting

### Tests timing out

**Problem**: Tests fail with timeout errors

**Solution**:

```typescript
// Increase timeout for specific test
test("slow test", async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ...
});
```

### Flaky tests

**Problem**: Tests pass/fail randomly

**Solution**:

- Use `toBeVisible()` instead of `toHaveText()` when checking visibility
- Add proper `await` before all async operations
- Use `waitForLoadState()` for page loads
- Avoid `waitForTimeout()` - use explicit waits instead

### Tests fail in CI but pass locally

**Problem**: Different behavior in CI environment

**Solution**:

- Run tests in CI mode locally: `CI=true npm run test:e2e`
- Check browser versions: `npx playwright --version`
- Ensure all dependencies installed: `npm ci`
- Check for timing issues (CI is often slower)

### Browser not installed

**Problem**: "Executable doesn't exist" error

**Solution**:

```bash
npx playwright install chromium
# or install all browsers
npx playwright install
```

---

## Current Test Status

✅ **51 E2E tests created**
✅ **Playwright configured** for 5 browser/device combinations
✅ **npm scripts added** for easy test execution
⚠️ **Some tests need adjustment** based on actual UI implementation:

- Contact form success message selector
- Form label accessibility attributes
- Loading state behavior

These can be fixed by updating selectors in test files to match your actual component implementation.

---

## Next Steps

1. **Fix failing tests** by adjusting selectors to match actual UI
2. **Add more test scenarios**:
   - Analytics tracking
   - Cookie consent banner
   - Rate limiting behavior
   - Error pages (404, 500)
3. **Add visual regression testing** with Playwright's screenshot comparison
4. **Integrate with CI/CD** pipeline
5. **Add performance tests** using Playwright's performance APIs

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests Guide](https://playwright.dev/docs/writing-tests)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI Integration](https://playwright.dev/docs/ci)

---

**Happy Testing! 🎭**
