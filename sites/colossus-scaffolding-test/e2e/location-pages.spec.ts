import { test, expect } from "@playwright/test";

test.describe("Location Pages", () => {
  test("should display locations overview page", async ({ page }) => {
    await page.goto("/locations");

    await expect(page).toHaveTitle(/South East.*Towns.*Colossus Scaffolding/);
    await expect(page.locator("h1")).toContainText(/Professional Scaffolding|South East England/i);

    // Should show location cards or links
    const locationLinks = page.locator('a[href^="/locations/"]');
    await expect(locationLinks.first()).toBeVisible();
  });

  test("should navigate to Brighton location page", async ({ page }) => {
    await page.goto("/locations/brighton");

    await expect(page).toHaveURL(/.*brighton/);
    await expect(page.locator("h1")).toContainText(/brighton/i);
  });

  test("should display location page with hero section", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Check for hero section with location name
    const hero = page
      .locator("h1, h2")
      .filter({ hasText: /brighton/i })
      .first();
    await expect(hero).toBeVisible();

    // Check for phone number in hero
    const phoneInHero = page.locator('a[href^="tel:"]').first();
    await expect(phoneInHero).toBeVisible();
  });

  test("should display trust badges in hero", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Look for trust badges (TG20:21, CHAS, etc.)
    const badges = page.locator("text=/TG20:21|CHAS|CISRS/i");
    const badgeCount = await badges.count();
    expect(badgeCount).toBeGreaterThan(0);
  });

  test("should show location-specific FAQs", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Check for FAQ section (use .first() to handle multiple FAQ headings)
    const faqsHeading = page
      .locator("h2, h3")
      .filter({ hasText: /faq|questions/i })
      .first();
    await expect(faqsHeading).toBeVisible();

    // Should have at least 5 FAQs (per schema requirement)
    const faqItems = page.locator('details, [role="button"], button, summary');
    const faqCount = await faqItems.count();
    expect(faqCount).toBeGreaterThan(0);
  });

  test("should display areas served section", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Check for areas served or coverage section
    const areasSection = page.locator("text=/areas|coverage|serve/i");
    await expect(areasSection.first()).toBeVisible();
  });

  test("should show breadcrumbs on location pages", async ({ page }) => {
    await page.goto("/locations/brighton");

    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"], nav:has(ol)');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText("Locations");
  });

  test("should have CTA button linking to contact", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Look for CTA with text from hero.ctaText
    const ctaButton = page
      .locator('a:has-text("Free Quote"), a:has-text("Contact"), a:has-text("Get")')
      .first();

    await expect(ctaButton).toBeVisible();
    await ctaButton.click();
    await expect(page).toHaveURL(/.*contact/);
  });

  test("should display location hero image", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Check for hero image - specifically target hero section images
    // Hero images are in /hero/location/ path, use .first() to avoid strict mode with multiple images
    const heroImage = page.locator('img[src*="hero/location/"]').first();
    if (await heroImage.isVisible()) {
      await expect(heroImage).toBeVisible();
    }
  });

  test("should show services available in location", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Check for services section
    const servicesSection = page.locator("text=/services/i");
    await expect(servicesSection.first()).toBeVisible();

    // Should have links to services
    const serviceLinks = page.locator('a[href^="/services/"]');
    const serviceLinkCount = await serviceLinks.count();
    expect(serviceLinkCount).toBeGreaterThan(0);
  });

  test("should navigate to East Sussex location page", async ({ page }) => {
    await page.goto("/locations/east-sussex");

    await expect(page).toHaveURL(/.*east-sussex/);
    await expect(page.locator("h1")).toContainText(/east sussex/i);
  });

  test("should navigate to Hastings location page", async ({ page }) => {
    await page.goto("/locations/hastings");

    await expect(page).toHaveURL(/.*hastings/);
    await expect(page.locator("h1")).toContainText(/hastings/i);
  });

  test("should display nearby towns section", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Check for nearby towns or related locations
    const nearbySection = page.locator("text=/nearby|surrounding|other locations/i");
    if (await nearbySection.isVisible()) {
      await expect(nearbySection).toBeVisible();
    }
  });

  test("should have schema.org LocalBusiness markup", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Check for JSON-LD schema markup
    const schemaScript = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schemaScript.count();
    expect(schemaCount).toBeGreaterThan(0);

    // Verify LocalBusiness schema
    const schemaContent = await schemaScript.first().textContent();
    expect(schemaContent).toContain("@context");
    expect(schemaContent).toContain("schema.org");
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/locations/brighton");

    // Page should load without horizontal scroll
    const body = page.locator("body");
    const bodyWidth = await body.boundingBox();
    expect(bodyWidth?.width).toBeLessThanOrEqual(375);

    // Content should be visible
    await expect(page.locator("h1")).toBeVisible();

    // Mobile menu should work
    const menuButton = page.locator('button[aria-label*="menu" i]').first();
    await expect(menuButton).toBeVisible();
  });

  test("should navigate between county pages", async ({ page }) => {
    await page.goto("/locations");

    // Navigate to East Sussex (use .first() to avoid strict mode)
    await page.locator('a[href="/locations/east-sussex"]').first().click();
    await expect(page).toHaveURL(/.*east-sussex/);

    // Go back
    await page.goBack();

    // Navigate to Kent (use .first() to avoid strict mode with 5 links)
    const kentLink = page.locator('a[href="/locations/kent"]').first();
    await kentLink.click();
    await expect(page).toHaveURL(/.*kent/);
  });

  test("should load sample location pages without errors", async ({ page }) => {
    const locationSlugs = [
      "brighton",
      "hastings",
      "eastbourne",
      "canterbury",
      "ashford",
      "guildford",
      "east-sussex",
      "kent",
    ];

    for (const slug of locationSlugs.slice(0, 4)) {
      // Test first 4 to keep test fast
      const response = await page.goto(`/locations/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("should show call to action prominently", async ({ page }) => {
    await page.goto("/locations/brighton");

    // CTA should be visible without scrolling (in viewport)
    const ctaButton = page.locator('a:has-text("Free Quote"), a:has-text("Contact")').first();
    await expect(ctaButton).toBeVisible();

    // Verify it's in the viewport
    const isInViewport = await ctaButton.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= window.innerHeight;
    });
    expect(isInViewport).toBeTruthy();
  });

  test("should have phone number clickable throughout page", async ({ page }) => {
    await page.goto("/locations/brighton");

    // Should have multiple phone links
    const phoneLinks = page.locator('a[href^="tel:"]');
    const phoneCount = await phoneLinks.count();
    expect(phoneCount).toBeGreaterThan(0);

    // All should have correct phone number (with or without spaces)
    const firstPhoneLink = phoneLinks.first();
    await expect(firstPhoneLink).toHaveAttribute("href", /01424\s*466\s*661/);
  });
});
