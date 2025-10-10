import { test, expect } from "@playwright/test";

/**
 * Smoke Test Suite - ULTRA FAST CI Validation
 *
 * Purpose: Verify pages render without crashes (HTTP 200 + H1 visible)
 * Duration: ~20 seconds
 *
 * This minimal test suite provides quick confidence that:
 * - Core pages load successfully (200 status)
 * - Page has rendered (H1 is present)
 *
 * NO navigation tests, NO console error checks, NO complex interactions.
 * For comprehensive testing, run full E2E suite separately.
 */

test.describe("Smoke Tests - Page Load Only", () => {
  test("homepage loads", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("services page loads", async ({ page }) => {
    const response = await page.goto("/services");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("sample service page loads", async ({ page }) => {
    const response = await page.goto("/services/access-scaffolding");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("locations page loads", async ({ page }) => {
    const response = await page.goto("/locations");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("sample location page loads", async ({ page }) => {
    const response = await page.goto("/locations/brighton");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });
});
