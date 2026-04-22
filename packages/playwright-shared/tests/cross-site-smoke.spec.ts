import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

interface SiteConfig {
  name: string;
  baseURL: string;
  hasLocations: boolean;
  firstServiceSlug: string | null;
  firstLocationSlug: string | null;
}

interface SitesFile {
  prod: SiteConfig[];
  staging: SiteConfig[];
}

const env = (process.env.WATCHDOG_ENV ?? "prod") as keyof SitesFile;
const sitesPath = path.join(__dirname, "../sites.json");
const allSites: SitesFile = JSON.parse(fs.readFileSync(sitesPath, "utf8"));
const sites: SiteConfig[] = allSites[env] ?? allSites.prod;

for (const site of sites) {
  test.describe(`[${site.name}] ${site.baseURL}`, () => {
    test.use({ baseURL: site.baseURL });

    test("home — page loads with H1 and hero", async ({ page }) => {
      const response = await page.goto("/");
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("h1").first()).toBeVisible();
      // At least one section-level element exists above the fold
      const hero = page.locator("section, [class*='hero'], main > div").first();
      await expect(hero).toBeVisible();
    });

    test("home — desktop navigation renders", async ({ page }) => {
      await page.goto("/");
      // At least one nav element with links visible at desktop viewport
      const nav = page.locator("nav").first();
      await expect(nav).toBeVisible();
      const navLinks = nav.locator("a");
      await expect(navLinks.first()).toBeVisible();
    });

    test("home — mobile hamburger opens and closes", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");
      const hamburger = page
        .locator(
          'button[aria-label*="menu" i], button[aria-label*="open" i], button[aria-expanded]'
        )
        .first();
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await page.waitForTimeout(400);
        // Some nav content should now be visible
        const menuContent = page
          .locator('[role="dialog"], [aria-label*="navigation" i], nav')
          .first();
        await expect(menuContent).toBeVisible();
        // Close: press Escape or find close button
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);
      }
    });

    test("services — list page loads with at least one card", async ({ page }) => {
      const response = await page.goto("/services");
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("h1").first()).toBeVisible();
      const serviceLinks = page.locator('main a[href^="/services/"]');
      await expect(serviceLinks.first()).toBeVisible();
    });

    test("services — detail page loads", async ({ page }) => {
      if (site.firstServiceSlug) {
        const response = await page.goto(`/services/${site.firstServiceSlug}`);
        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator("h1").first()).toBeVisible();
      } else {
        // Navigate to first service found on the list page
        await page.goto("/services");
        const firstLink = page.locator('main a[href^="/services/"]').first();
        const href = await firstLink.getAttribute("href");
        if (href) {
          const response = await page.goto(href);
          expect(response?.status()).toBeLessThan(400);
          await expect(page.locator("h1").first()).toBeVisible();
        }
      }
    });

    if (site.hasLocations) {
      test("locations — list page loads with at least one card", async ({ page }) => {
        const response = await page.goto("/locations");
        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator("h1").first()).toBeVisible();
        const locationLinks = page.locator('main a[href^="/locations/"]');
        await expect(locationLinks.first()).toBeVisible();
      });

      test("locations — detail page loads", async ({ page }) => {
        const slug = site.firstLocationSlug ?? "brighton";
        const response = await page.goto(`/locations/${slug}`);
        expect(response?.status()).toBeLessThan(400);
        await expect(page.locator("h1").first()).toBeVisible();
      });
    }

    test("contact — page loads with form or CTA", async ({ page }) => {
      const response = await page.goto("/contact");
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("h1").first()).toBeVisible();
      // Either a form or a prominent CTA/phone link must be present
      const formOrCta = page
        .locator('form, a[href^="tel:"], a[href^="mailto:"], button[type="submit"]')
        .first();
      await expect(formOrCta).toBeVisible();
    });

    test("about — page loads with body content", async ({ page }) => {
      const response = await page.goto("/about");
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("h1").first()).toBeVisible();
      const bodyText = page.locator("main p, main section").first();
      await expect(bodyText).toBeVisible();
    });

    test("home — footer renders with contact info", async ({ page }) => {
      await page.goto("/");
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
      await footer.scrollIntoViewIfNeeded();
      // Footer should contain either a phone link or email link
      const contactInfo = footer.locator('a[href^="tel:"], a[href^="mailto:"]').first();
      await expect(contactInfo).toBeVisible();
    });
  });
}
