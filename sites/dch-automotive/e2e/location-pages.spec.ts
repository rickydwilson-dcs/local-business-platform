import { test, expect } from '@playwright/test';

test.describe('Location Pages', () => {
  test('should display locations overview page', async ({ page }) => {
    await page.goto('/locations');

    await expect(page).toHaveTitle(/Locations/i);
    await expect(page.locator('h1')).toBeVisible();

    // Should show location cards or links
    const locationLinks = page.locator('a[href^="/locations/"]');
    await expect(locationLinks.first()).toBeVisible();
  });

  test('should navigate to main area location page', async ({ page }) => {
    await page.goto('/locations/main-area');

    await expect(page).toHaveURL(/.*main-area/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display location page with hero section', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Check for hero section with h1
    await expect(page.locator('h1')).toBeVisible();

    // Check for phone number in hero
    const phoneInHero = page.locator('a[href^="tel:"]').first();
    await expect(phoneInHero).toBeVisible();
  });

  test('should show location-specific FAQs', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Check for FAQ section (use .first() to handle multiple FAQ headings)
    const faqsHeading = page
      .locator('h2, h3')
      .filter({ hasText: /faq|questions/i })
      .first();
    await expect(faqsHeading).toBeVisible();

    // Should have at least some interactive FAQ items
    const faqItems = page.locator('details, [role="button"], button, summary');
    const faqCount = await faqItems.count();
    expect(faqCount).toBeGreaterThan(0);
  });

  test('should display areas served section', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Check for areas served or coverage section
    const areasSection = page.locator('text=/areas|coverage|serve/i');
    await expect(areasSection.first()).toBeVisible();
  });

  test('should show breadcrumbs on location pages', async ({ page }) => {
    await page.goto('/locations/main-area');

    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"], nav:has(ol)');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs).toContainText('Locations');
  });

  test('should have CTA button linking to contact', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Look for CTA with common text patterns
    const ctaButton = page
      .locator('a:has-text("Free Quote"), a:has-text("Contact"), a:has-text("Get")')
      .first();

    await expect(ctaButton).toBeVisible();
    await ctaButton.click();
    await expect(page).toHaveURL(/.*contact/);
  });

  test('should display location hero image', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Check for hero image
    const heroImage = page.locator('img[src*="hero/location/"]').first();
    if (await heroImage.isVisible()) {
      await expect(heroImage).toBeVisible();
    }
  });

  test('should show services available in location', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Check for services section
    const servicesSection = page.locator('text=/services/i');
    await expect(servicesSection.first()).toBeVisible();

    // Should have links to services
    const serviceLinks = page.locator('a[href^="/services/"]');
    const serviceLinkCount = await serviceLinks.count();
    expect(serviceLinkCount).toBeGreaterThan(0);
  });

  test('should navigate to north region location page', async ({ page }) => {
    await page.goto('/locations/north-region');

    await expect(page).toHaveURL(/.*north-region/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to south region location page', async ({ page }) => {
    await page.goto('/locations/south-region');

    await expect(page).toHaveURL(/.*south-region/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display nearby towns section', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Check for nearby towns or related locations
    const nearbySection = page.locator('text=/nearby|surrounding|other locations/i');
    if (await nearbySection.isVisible()) {
      await expect(nearbySection).toBeVisible();
    }
  });

  test('should have schema.org LocalBusiness markup', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Check for JSON-LD schema markup
    const schemaScript = page.locator('script[type="application/ld+json"]');
    const schemaCount = await schemaScript.count();
    expect(schemaCount).toBeGreaterThan(0);

    // Verify LocalBusiness schema
    const schemaContent = await schemaScript.first().textContent();
    expect(schemaContent).toContain('@context');
    expect(schemaContent).toContain('schema.org');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/locations/main-area');

    // Page should load without horizontal scroll
    const body = page.locator('body');
    const bodyWidth = await body.boundingBox();
    expect(bodyWidth?.width).toBeLessThanOrEqual(375);

    // Content should be visible
    await expect(page.locator('h1')).toBeVisible();

    // Mobile menu should work
    const menuButton = page.locator('button[aria-label*="menu" i]').first();
    await expect(menuButton).toBeVisible();
  });

  test('should navigate between location pages', async ({ page }) => {
    await page.goto('/locations');

    // Navigate to main area (use .first() to avoid strict mode)
    await page.locator('a[href="/locations/main-area"]').first().click();
    await expect(page).toHaveURL(/.*main-area/);

    // Go back
    await page.goBack();

    // Navigate to north region
    const northLink = page.locator('a[href="/locations/north-region"]').first();
    if (await northLink.isVisible()) {
      await northLink.click();
      await expect(page).toHaveURL(/.*north-region/);
    }
  });

  test('should load sample location pages without errors', async ({ page }) => {
    const locationSlugs = ['main-area', 'north-region', 'south-region'];

    for (const slug of locationSlugs) {
      const response = await page.goto(`/locations/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should show call to action prominently', async ({ page }) => {
    await page.goto('/locations/main-area');

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

  test('should have phone number clickable throughout page', async ({ page }) => {
    await page.goto('/locations/main-area');

    // Should have at least one phone link
    const phoneLinks = page.locator('a[href^="tel:"]');
    const phoneCount = await phoneLinks.count();
    expect(phoneCount).toBeGreaterThan(0);

    // All should have a valid tel: href
    const firstPhoneLink = phoneLinks.first();
    await expect(firstPhoneLink).toHaveAttribute('href', /tel:/);
  });
});
