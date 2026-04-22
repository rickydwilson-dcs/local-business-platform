import { test, expect } from "@playwright/test";

// One canonical snapshot per template type.
// Covers every unique page layout without redundantly testing each dynamic route.
// maxDiffPixels is permissive enough to survive font-rendering differences across OS/CI.

test.use({ screenshot: "on" });

const SETTLE_MS = 600;

test.describe("Visual Regression — Template Snapshots", () => {
  test("home page template", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-home.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("services list template", async ({ page }) => {
    await page.goto("/services", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-services-list.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("service detail template", async ({ page }) => {
    await page.goto("/services/access-scaffolding", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-service-detail.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("locations list template", async ({ page }) => {
    await page.goto("/locations", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-locations-list.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("location detail template", async ({ page }) => {
    await page.goto("/locations/brighton", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-location-detail.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("blog list template", async ({ page }) => {
    await page.goto("/blog", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-blog-list.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("blog post template", async ({ page }) => {
    // Navigate to first blog post via the list
    await page.goto("/blog");
    const firstPost = page.locator('main a[href^="/blog/"]').first();
    const href = await firstPost.getAttribute("href");
    if (href) {
      await page.goto(href, { waitUntil: "networkidle" });
      await page.waitForTimeout(SETTLE_MS);
      await expect(page).toHaveScreenshot("template-blog-post.png", {
        fullPage: true,
        maxDiffPixels: 200,
      });
    }
  });

  test("contact page template", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-contact.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("about page template", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-about.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("projects list template", async ({ page }) => {
    await page.goto("/projects", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-projects-list.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test("project detail template", async ({ page }) => {
    await page.goto("/projects");
    const firstProject = page.locator('main a[href^="/projects/"]').first();
    const href = await firstProject.getAttribute("href");
    if (href) {
      await page.goto(href, { waitUntil: "networkidle" });
      await page.waitForTimeout(SETTLE_MS);
      await expect(page).toHaveScreenshot("template-project-detail.png", {
        fullPage: true,
        maxDiffPixels: 200,
      });
    }
  });

  // Mobile viewport: home only (catches responsive layout regressions without full duplication)
  test("home page — mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(SETTLE_MS);
    await expect(page).toHaveScreenshot("template-home-mobile.png", {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});
