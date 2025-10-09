import { test, expect } from "@playwright/test";

/**
 * Visual Regression Testing Suite
 * Captures screenshots and compares them against baseline images
 * Ensures UI changes don't introduce unintended visual regressions
 */

test.describe("Visual Regression Tests", () => {
  // Configure screenshot comparison
  test.use({
    screenshot: "on",
  });

  test("homepage should match visual baseline", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Wait for any animations to complete
    await page.waitForTimeout(1000);

    // Take full page screenshot
    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
      maxDiffPixels: 100, // Allow small differences (fonts, anti-aliasing)
    });
  });

  test("homepage hero section should match baseline", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Screenshot just the hero section
    const hero = page.locator("section").first();
    await expect(hero).toHaveScreenshot("homepage-hero.png", {
      maxDiffPixels: 50,
    });
  });

  test("services overview page should match baseline", async ({ page }) => {
    await page.goto("/services", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("services-overview.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test("service page should match baseline", async ({ page }) => {
    await page.goto("/services/access-scaffolding", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("service-access-scaffolding.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test("location page should match baseline", async ({ page }) => {
    await page.goto("/locations/brighton", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("location-brighton.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test("contact form should match baseline", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const form = page.locator("form").first();
    await expect(form).toHaveScreenshot("contact-form.png", {
      maxDiffPixels: 50,
    });
  });

  test("about page should match baseline", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("about-page.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test("mobile homepage should match baseline", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("mobile-homepage.png", {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test("mobile menu should match baseline", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu" i]').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Screenshot the open menu
    const mobileMenu = page.locator(".mobile-menu-overlay");
    await expect(mobileMenu).toHaveScreenshot("mobile-menu-open.png", {
      maxDiffPixels: 50,
    });
  });

  test("footer should match baseline", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const footer = page.locator("footer");
    await expect(footer).toHaveScreenshot("footer.png", {
      maxDiffPixels: 50,
    });
  });

  test("service card grid should match baseline", async ({ page }) => {
    await page.goto("/services", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const serviceGrid = page.locator("main").first();
    await expect(serviceGrid).toHaveScreenshot("service-grid.png", {
      maxDiffPixels: 100,
    });
  });

  test("FAQ section should match baseline (collapsed)", async ({ page }) => {
    await page.goto("/services/access-scaffolding", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Find FAQ section
    const faqSection = page.locator('h2:has-text("FAQ"), h3:has-text("FAQ")').locator("..");
    if (await faqSection.isVisible()) {
      await expect(faqSection).toHaveScreenshot("faq-collapsed.png", {
        maxDiffPixels: 50,
      });
    }
  });

  test("tablet viewport should match baseline", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot("tablet-homepage.png", {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test("dark hover states should match baseline", async ({ page }) => {
    await page.goto("/services", { waitUntil: "networkidle" });

    // Hover over first service card
    const firstCard = page.locator('a[href^="/services/"]').first();
    await firstCard.hover();
    await page.waitForTimeout(300);

    await expect(firstCard).toHaveScreenshot("service-card-hover.png", {
      maxDiffPixels: 50,
    });
  });

  test("form validation errors should match baseline", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });

    // Submit empty form to trigger validation
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const form = page.locator("form").first();
    await expect(form).toHaveScreenshot("contact-form-errors.png", {
      maxDiffPixels: 50,
    });
  });
});

test.describe("Visual Regression - Different Screen Sizes", () => {
  const viewports = [
    { name: "mobile-small", width: 320, height: 568 }, // iPhone SE
    { name: "mobile-medium", width: 375, height: 667 }, // iPhone 6/7/8
    { name: "mobile-large", width: 414, height: 896 }, // iPhone XR
    { name: "tablet-portrait", width: 768, height: 1024 }, // iPad
    { name: "tablet-landscape", width: 1024, height: 768 }, // iPad landscape
    { name: "desktop-small", width: 1280, height: 720 }, // Small desktop
    { name: "desktop-large", width: 1920, height: 1080 }, // Full HD
  ];

  for (const viewport of viewports) {
    test(`homepage at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        fullPage: false, // Just above the fold
        maxDiffPixels: 150,
      });
    });
  }
});
