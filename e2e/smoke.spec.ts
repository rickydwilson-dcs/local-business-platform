import { test, expect } from "@playwright/test";

/**
 * Smoke Test Suite - FAST CI Validation
 *
 * Purpose: Verify pages render without crashes
 * Duration: ~30 seconds
 *
 * This minimal test suite provides quick confidence that:
 * - Core pages load successfully (200 status)
 * - No JavaScript errors in console
 * - Basic content is present
 *
 * For comprehensive testing, run full E2E suite separately.
 */

test.describe("Smoke Tests - Critical Pages", () => {
  test("homepage loads successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // Check key content exists
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('a[href="/contact"]')).toBeVisible();
  });

  test("contact page loads and form is present", async ({ page }) => {
    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);

    // Check form exists
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("services overview page loads", async ({ page }) => {
    const response = await page.goto("/services");
    expect(response?.status()).toBe(200);

    // Check services are listed
    await expect(page.locator("h1")).toBeVisible();
  });

  test("sample service page loads", async ({ page }) => {
    const response = await page.goto("/services/access-scaffolding");
    expect(response?.status()).toBe(200);

    // Check hero content
    await expect(page.locator("h1")).toBeVisible();
  });

  test("locations overview page loads", async ({ page }) => {
    const response = await page.goto("/locations");
    expect(response?.status()).toBe(200);

    // Check locations are listed
    await expect(page.locator("h1")).toBeVisible();
  });

  test("sample location page loads", async ({ page }) => {
    const response = await page.goto("/locations/brighton");
    expect(response?.status()).toBe(200);

    // Check hero content
    await expect(page.locator("h1")).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toBeVisible();
  });

  test("no console errors on homepage", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });
});

test.describe("Smoke Tests - Navigation", () => {
  test("header navigation links work", async ({ page }) => {
    await page.goto("/");

    // Click services link
    await page.click('a[href="/services"]');
    await expect(page).toHaveURL(/.*services/);

    // Click locations link
    await page.click('a[href="/locations"]');
    await expect(page).toHaveURL(/.*locations/);

    // Click contact link
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL(/.*contact/);
  });

  test("mobile menu opens and works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")');
    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Check menu is visible
      const mobileNav = page.locator('nav[aria-label*="Mobile"], nav.mobile-menu, [role="dialog"]');
      await expect(mobileNav).toBeVisible({ timeout: 2000 });
    }
  });
});

test.describe("Smoke Tests - SEO Basics", () => {
  test("pages have proper meta tags", async ({ page }) => {
    await page.goto("/");

    // Check meta title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    // Check meta description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
  });
});
