import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Professional Scaffolding|Colossus Scaffolding/);
    await expect(page.locator('img[alt*="Colossus"]').first()).toBeVisible();
  });

  test("should have working main navigation links", async ({ page }) => {
    await page.goto("/");

    // Check desktop navigation (hidden on mobile)
    const desktopNav = page.locator("nav.hidden.lg\\:flex");

    // Services link
    const servicesLink = desktopNav.locator('a[href="/services"]');
    await expect(servicesLink).toBeVisible();
    await servicesLink.click();
    await expect(page).toHaveURL(/.*services/);
    await page.goBack();

    // About link
    const aboutLink = desktopNav.locator('a[href="/about"]');
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(/.*about/);
    await page.goBack();

    // Contact link
    const contactLink = desktopNav.locator('a[href="/contact"]');
    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL(/.*contact/);
  });

  test("should have working mobile menu", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Target the hamburger button specifically by its aria-label.
    // Note: button[aria-expanded].first() matches the desktop Locations dropdown
    // which is hidden at mobile viewport, so we must be specific.
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible({ timeout: 10000 });

    // Click to open the menu
    await menuButton.click();

    // Verify the menu opened — the aria-label changes to "Close menu" when open
    const closeButton = page.locator('button[aria-label="Close menu"]');
    await expect(closeButton).toBeVisible({ timeout: 5000 });

    // Wait for the 300ms CSS slide-in transition to complete
    await page.waitForTimeout(500);

    // Navigate via mobile menu — use force:true because Playwright may still
    // consider the translated element as not fully "visible" during animation
    const mobileMenu = page.locator('[role="dialog"][aria-label="Mobile navigation menu"]');
    const mobileServicesLink = mobileMenu.locator('a[href="/services"]');
    await mobileServicesLink.click({ force: true });
    await expect(page).toHaveURL(/.*services/);
  });

  test("should expand locations dropdown on desktop", async ({ page }) => {
    await page.goto("/");

    // Hover over or click the Locations dropdown (use .first() for strict mode - 2 buttons: desktop + mobile)
    const locationsButton = page.locator('button:has-text("Locations")').first();
    if (await locationsButton.isVisible()) {
      await locationsButton.click();

      // Wait for dropdown to appear
      await page.waitForTimeout(300);

      // Check that location links are visible (use .first() to avoid strict mode)
      const eastSussexLink = page.locator('a[href="/locations/east-sussex"]').first();
      await expect(eastSussexLink).toBeVisible();
    }
  });

  test("should have working footer links", async ({ page }) => {
    await page.goto("/");

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Check footer service links
    const accessScaffoldingLink = page
      .locator('footer a[href="/services/access-scaffolding"]')
      .first();
    await expect(accessScaffoldingLink).toBeVisible();
    await accessScaffoldingLink.click();
    await expect(page).toHaveURL(/.*access-scaffolding/);
    await page.goBack();

    // Check footer location links
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const brightonLink = page.locator('footer a[href="/locations/brighton"]').first();
    await expect(brightonLink).toBeVisible();
    await brightonLink.click();
    await expect(page).toHaveURL(/.*brighton/);
  });

  test("should have clickable logo that navigates home", async ({ page, baseURL }) => {
    await page.goto("/services");

    const logoLink = page.locator('a[href="/"]').first();
    await expect(logoLink).toBeVisible();
    await logoLink.click();

    await expect(page).toHaveURL(new RegExp(`^${baseURL}/?$`));
  });

  test("should have working phone link in header", async ({ page }) => {
    await page.goto("/");

    const phoneLink = page.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute("href", /tel:/);
  });

  test("should have Get Free Quote CTA button", async ({ page }) => {
    await page.goto("/");

    const ctaButton = page.locator('a:has-text("Get Free Quote")').first();
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();

    await expect(page).toHaveURL(/.*contact/);
  });

  test("should navigate through breadcrumbs", async ({ page, baseURL }) => {
    // Navigate to a service page
    await page.goto("/services/access-scaffolding");

    // Check breadcrumbs exist
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"], nav:has(ol)');
    await expect(breadcrumbs).toBeVisible();

    // Click home breadcrumb
    const homeBreadcrumb = breadcrumbs.locator('a[href="/"]');
    if (await homeBreadcrumb.isVisible()) {
      await homeBreadcrumb.click();
      await expect(page).toHaveURL(new RegExp(`^${baseURL}/?$`));
    }
  });

  test("should persist navigation across page loads", async ({ page }) => {
    await page.goto("/");

    // Navigate to Services
    await page.click('a[href="/services"]');
    await expect(page).toHaveURL(/.*services/);

    // Navigate to About
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/.*about/);

    // Navigate to Contact
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL(/.*contact/);

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL(/.*about/);

    await page.goBack();
    await expect(page).toHaveURL(/.*services/);
  });
});
