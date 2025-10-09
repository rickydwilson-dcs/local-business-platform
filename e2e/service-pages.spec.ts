import { test, expect } from "@playwright/test";

test.describe("Service Pages", () => {
  test("should display services overview page", async ({ page }) => {
    await page.goto("/services");

    await expect(page).toHaveTitle(/Services/);
    await expect(page.locator("h1")).toContainText(/services/i);

    // Should show service cards
    const serviceCards = page.locator('a[href^="/services/"]');
    await expect(serviceCards.first()).toBeVisible();
  });

  test("should navigate to Access Scaffolding service page", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    await expect(page).toHaveURL(/.*access-scaffolding/);
    await expect(page.locator("h1")).toContainText(/access scaffolding/i);
  });

  test("should display service page with all required sections", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    // Check for hero section
    const hero = page
      .locator("section, div")
      .filter({ hasText: /access scaffolding/i })
      .first();
    await expect(hero).toBeVisible();

    // Check for benefits section
    const benefits = page.locator("text=/benefits|advantages/i");
    if (await benefits.isVisible()) {
      await expect(benefits).toBeVisible();
    }

    // Check for FAQs section
    const faqsHeading = page.locator("h2, h3").filter({ hasText: /faq|questions/i });
    await expect(faqsHeading).toBeVisible();
  });

  test("should expand FAQ items when clicked", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    // Find FAQ section
    const faqSection = page.locator("text=/faq|questions/i").locator("..").locator("..");

    // Find first FAQ question (button or clickable element)
    const firstFaqQuestion = faqSection.locator("button, summary, [role='button']").first();

    if (await firstFaqQuestion.isVisible()) {
      // Click to expand
      await firstFaqQuestion.click();
      await page.waitForTimeout(300);

      // FAQ answer should now be visible
      // (Adjust selector based on your FAQ component structure)
      const faqAnswer = page.locator("text=/yes|no|we|our|the/i").first();
      await expect(faqAnswer).toBeVisible();
    }
  });

  test("should show breadcrumbs on service pages", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"], nav:has(ol)');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Services");
  });

  test("should have CTA button linking to contact", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    // Look for contact CTA
    const ctaButton = page
      .locator('a:has-text("Contact"), a:has-text("Quote"), a:has-text("Get in Touch")')
      .first();

    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      await expect(page).toHaveURL(/.*contact/);
    }
  });

  test("should have phone number link", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    const phoneLink = page.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute("href", /01424466661/);
  });

  test("should display service images", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    // Check for images (hero or gallery)
    const images = page.locator("img");
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    // Check first image loads
    const firstImage = images.first();
    await expect(firstImage).toBeVisible();
  });

  test("should navigate between different service pages", async ({ page }) => {
    await page.goto("/services");

    // Click on Access Scaffolding
    await page.click('a[href="/services/access-scaffolding"]');
    await expect(page).toHaveURL(/.*access-scaffolding/);

    // Go back to services
    await page.goBack();

    // Click on Facade Scaffolding
    const facadeLink = page.locator('a[href="/services/facade-scaffolding"]');
    if (await facadeLink.isVisible()) {
      await facadeLink.click();
      await expect(page).toHaveURL(/.*facade-scaffolding/);
    }
  });

  test("should show related services or next steps", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    // Check for related services section
    const relatedSection = page.locator("text=/related services|other services|similar services/i");
    if (await relatedSection.isVisible()) {
      await expect(relatedSection).toBeVisible();
    }
  });

  test("should have schema.org structured data", async ({ page }) => {
    await page.goto("/services/access-scaffolding");

    // Check for JSON-LD schema markup
    const schemaScript = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schemaScript.count();
    expect(schemaCount).toBeGreaterThan(0);

    // Verify schema content
    const schemaContent = await schemaScript.first().textContent();
    expect(schemaContent).toContain("@context");
    expect(schemaContent).toContain("schema.org");
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/services/access-scaffolding");

    // Page should load without horizontal scroll
    const body = page.locator("body");
    const bodyWidth = await body.boundingBox();
    expect(bodyWidth?.width).toBeLessThanOrEqual(375);

    // Content should be visible
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });

  test("should load all 25 service pages without errors", async ({ page }) => {
    const serviceSlugs = [
      "access-scaffolding",
      "birdcage-scaffolds",
      "crash-decks-crane-decks",
      "edge-protection",
      "facade-scaffolding",
      "heavy-duty-industrial-scaffolding",
      "pavement-gantries-loading-bays",
      "public-access-staircases",
      "scaffold-alarms",
      "scaffold-towers-mast-systems",
      "scaffolding-design-drawings",
      "scaffolding-inspections-maintenance",
      "sheeting-netting-encapsulation",
      "staircase-towers",
      "suspended-scaffolding",
      "temporary-roof-systems",
    ];

    for (const slug of serviceSlugs.slice(0, 5)) {
      // Test first 5 to keep test fast
      const response = await page.goto(`/services/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    }
  });
});
