# Testing Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Scope:** All sites in local-business-platform

---

## Overview

The Local Business Platform uses a comprehensive testing strategy with Vitest for unit tests and Playwright for E2E tests. Tests run automatically in CI/CD pipeline and via pre-push hooks.

## Core Principles

### 1. Test Coverage Requirements

- **Unit tests:** Critical business logic, API routes, utilities
- **E2E tests:** User journeys, critical paths, accessibility
- **Content validation:** MDX frontmatter, schema compliance

### 2. Testing Stack

| Tool       | Purpose                | Config File            |
| ---------- | ---------------------- | ---------------------- |
| Vitest     | Unit/integration tests | vitest.config.ts       |
| Playwright | E2E tests              | playwright.config.ts   |
| Zod        | Content validation     | lib/content-schemas.ts |

## Unit Testing (Vitest)

### Current Coverage

- **141+ passing tests** executing in ~2 seconds
- **Contact API Tests** (13 tests) - Form validation, email handling, rate limiting
- **Rate Limiter Tests** (17 tests) - Redis mocking, IP isolation, fail-open
- **Content Schema Tests** (21 tests) - Zod validation for frontmatter
- **Location Utils Tests** (17 tests) - Location detection and area logic
- **Schema Tests** - JSON-LD generation
- **Analytics Tests** - dataLayer implementation

### Test Commands

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Interactive test UI
npm run test:ui
```

### Test File Structure

```
sites/colossus-reference/
├── app/api/contact/__tests__/
│   └── route.test.ts
├── lib/__tests__/
│   ├── rate-limiter.test.ts
│   ├── content-schemas.test.ts
│   ├── location-utils.test.ts
│   └── schema.test.ts
└── vitest.config.ts
```

### Writing Unit Tests

```typescript
// Example: API route test
import { describe, it, expect, vi } from "vitest";
import { POST } from "../route";

describe("Contact API", () => {
  it("should validate required fields", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("required");
  });
});
```

### Mocking Strategy

- **Upstash Redis:** Mocked for rate limiter tests
- **Resend Email:** Mocked for contact API tests
- **File System:** Mocked for content validation tests

```typescript
// Example: Redis mock
vi.mock("@upstash/redis", () => ({
  Redis: vi.fn().mockImplementation(() => ({
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
  })),
}));
```

## E2E Testing (Playwright)

### Tiered Test Strategy

| Tier     | Tests      | Duration | When Run              |
| -------- | ---------- | -------- | --------------------- |
| Smoke    | 7 tests    | ~30s     | Every push to develop |
| Standard | 51 tests   | 2-3 min  | Staging pushes        |
| Full     | 100+ tests | 10+ min  | Manual trigger        |

### E2E Commands

```bash
# Smoke tests (fast, critical paths)
npm run test:e2e:smoke

# Standard tests (functional validation)
npm run test:e2e

# Full tests (comprehensive)
npm run test:e2e:full

# Single browser
npm run test:e2e:chromium

# Interactive UI mode
npm run test:e2e:ui
```

### Smoke Tests (Critical Paths)

```typescript
// e2e/smoke.spec.ts - Always run
test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});

test("contact form displays", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("form")).toBeVisible();
});

test("location page loads", async ({ page }) => {
  await page.goto("/locations/brighton");
  await expect(page.locator("h1")).toContainText("Brighton");
});
```

### Accessibility Testing

```typescript
// e2e/accessibility.spec.ts
import { AxeBuilder } from "@axe-core/playwright";

test("meets WCAG AA standards", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### Performance Testing

```typescript
// e2e/performance.spec.ts
test('meets Core Web Vitals', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => ({
    lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
    cls: /* cumulative layout shift */,
    fid: /* first input delay */
  }));

  expect(metrics.lcp).toBeLessThan(2500); // < 2.5s
});
```

## Content Validation

### Zod Schema Validation

```bash
# Validate all content
npm run validate:content

# Validate services only
npm run validate:services

# Validate locations only
npm run validate:locations
```

### Validation Rules

- **Description length:** 50-200 characters
- **FAQ requirements:** 3-15 FAQs per service
- **YAML syntax:** Proper formatting
- **Required fields:** All mandatory frontmatter

## CI/CD Integration

### GitHub Actions

```yaml
# Runs on every push
- name: Run Unit Tests
  run: npm test

- name: Run E2E Smoke Tests
  run: npm run test:e2e:smoke

- name: Validate Content
  run: npm run validate:content
```

### Branch-Specific Tests

| Branch  | Tests Run                   |
| ------- | --------------------------- |
| develop | Smoke (7 tests)             |
| staging | Smoke + Standard (58 tests) |
| main    | Smoke + Standard (58 tests) |

## What NOT to Do

| Anti-Pattern           | Why It's Wrong    | Correct Approach       |
| ---------------------- | ----------------- | ---------------------- |
| Skipping tests         | Quality risk      | Always run full suite  |
| No mocking             | Slow, flaky tests | Mock external services |
| Testing implementation | Brittle tests     | Test behavior          |
| Hard-coded waits       | Slow, unreliable  | Use Playwright waitFor |

## Verification Checklist

Before merging any code:

- [ ] All unit tests pass (`npm test`)
- [ ] E2E smoke tests pass (`npm run test:e2e:smoke`)
- [ ] Content validation passes (`npm run validate:content`)
- [ ] No console errors in browser tests
- [ ] Coverage meets minimum threshold
- [ ] New functionality has tests

## Related Standards

- [Quality](./quality.md) - Quality gates and CI requirements
- [Deployment](./deployment.md) - Pre-deployment testing

---

**Maintained By:** Digital Consulting Services
