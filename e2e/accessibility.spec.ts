import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility Testing Suite
 * Tests WCAG 2.1 AA compliance using axe-core
 * Ensures the site is accessible to users with disabilities
 */

test.describe("Accessibility Tests", () => {
  test("homepage should have no accessibility violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    console.log("Accessibility violations found:", accessibilityScanResults.violations.length);

    if (accessibilityScanResults.violations.length > 0) {
      console.log("Violations:", JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("services page should have no accessibility violations", async ({ page }) => {
    await page.goto("/services", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("service detail page should have no accessibility violations", async ({ page }) => {
    await page.goto("/services/access-scaffolding", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("location page should have no accessibility violations", async ({ page }) => {
    await page.goto("/locations/brighton", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("contact form should have no accessibility violations", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("about page should have no accessibility violations", async ({ page }) => {
    await page.goto("/about", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const headings = await page.evaluate(() => {
      const headingElements = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      return headingElements.map((h) => ({
        level: parseInt(h.tagName.substring(1)),
        text: h.textContent?.trim().substring(0, 50),
      }));
    });

    console.log("Heading hierarchy:", headings);

    // Should have exactly one H1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count, "Page should have exactly one H1").toBe(1);

    // Check heading order (no skipping levels)
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level;
      const currLevel = headings[i].level;

      if (currLevel > prevLevel) {
        expect(
          currLevel - prevLevel,
          `Heading level should not skip (from H${prevLevel} to H${currLevel})`
        ).toBeLessThanOrEqual(1);
      }
    }
  });

  test("all images should have alt text", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll("img"));
      return images.filter((img) => !img.alt && !img.hasAttribute("role")).map((img) => img.src);
    });

    console.log("Images without alt text:", imagesWithoutAlt);

    expect(imagesWithoutAlt, "All images should have alt text").toHaveLength(0);
  });

  test("all links should have accessible names", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const linksWithoutText = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links
        .filter((link) => {
          const text = link.textContent?.trim();
          const ariaLabel = link.getAttribute("aria-label");
          const ariaLabelledBy = link.getAttribute("aria-labelledby");
          const title = link.getAttribute("title");

          return !text && !ariaLabel && !ariaLabelledBy && !title;
        })
        .map((link) => link.href);
    });

    console.log("Links without accessible names:", linksWithoutText);

    expect(linksWithoutText, "All links should have accessible names").toHaveLength(0);
  });

  test("form inputs should have proper labels", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });

    const inputsWithoutLabels = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll('input:not([type="hidden"]), textarea, select')
      );
      return inputs
        .filter((input) => {
          const id = input.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const ariaLabel = input.getAttribute("aria-label");
          const ariaLabelledBy = input.getAttribute("aria-labelledby");

          return !hasLabel && !ariaLabel && !ariaLabelledBy;
        })
        .map((input) => ({
          type: input.tagName,
          name: (input as HTMLInputElement).name,
          id: input.id,
        }));
    });

    console.log("Inputs without labels:", inputsWithoutLabels);

    expect(inputsWithoutLabels, "All form inputs should have labels").toHaveLength(0);
  });

  test("should have sufficient color contrast", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["cat.color"])
      .analyze();

    console.log("Color contrast violations:", accessibilityScanResults.violations.length);

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("interactive elements should be keyboard accessible", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Get all interactive elements
    const interactiveElements = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('a, button, [role="button"], input, select, textarea')
      );
      return elements.map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim().substring(0, 30),
        tabindex: el.getAttribute("tabindex"),
      }));
    });

    console.log("Interactive elements found:", interactiveElements.length);

    // Try tabbing through page
    await page.keyboard.press("Tab");
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);

    expect(firstFocused, "Should be able to focus interactive elements with keyboard").toBeTruthy();
  });

  test("mobile menu should be keyboard accessible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/", { waitUntil: "networkidle" });

    // Find menu button
    const menuButton = page.locator('button[aria-label*="menu" i]').first();

    // Should be able to focus with keyboard
    await menuButton.focus();
    const isFocused = await menuButton.evaluate((el) => el === document.activeElement);

    expect(isFocused, "Menu button should be keyboard focusable").toBe(true);

    // Should be able to activate with keyboard
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);

    const menuVisible = await page.locator(".mobile-menu-overlay").isVisible();
    expect(menuVisible, "Menu should open with keyboard").toBe(true);
  });

  test("should have proper ARIA landmarks", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const landmarks = await page.evaluate(() => {
      const landmarkSelectors = [
        "header",
        "nav",
        "main",
        "footer",
        '[role="banner"]',
        '[role="navigation"]',
        '[role="main"]',
        '[role="contentinfo"]',
      ];

      return landmarkSelectors.map((selector) => ({
        selector,
        count: document.querySelectorAll(selector).length,
      }));
    });

    console.log("Landmarks found:", landmarks);

    // Should have main landmark
    const mainCount =
      landmarks.find((l) => l.selector === "main")?.count ||
      landmarks.find((l) => l.selector === '[role="main"]')?.count ||
      0;
    expect(mainCount, "Should have exactly one main landmark").toBe(1);

    // Should have header
    const headerCount =
      landmarks.find((l) => l.selector === "header")?.count ||
      landmarks.find((l) => l.selector === '[role="banner"]')?.count ||
      0;
    expect(headerCount, "Should have header landmark").toBeGreaterThan(0);
  });

  test("should support high contrast mode", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Emulate forced colors (high contrast mode)
    await page.emulateMedia({ forcedColors: "active" });

    // Check that content is still visible
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible, "Content should be visible in high contrast mode").toBe(true);

    // Run accessibility scan in high contrast mode
    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(["wcag2a"]).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("should generate accessibility report", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const report = {
      url: page.url(),
      timestamp: new Date().toISOString(),
      violations: accessibilityScanResults.violations.length,
      passes: accessibilityScanResults.passes.length,
      incomplete: accessibilityScanResults.incomplete.length,
      inapplicable: accessibilityScanResults.inapplicable.length,
      violationDetails: accessibilityScanResults.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
      })),
    };

    console.log("📋 Accessibility Report:");
    console.log(JSON.stringify(report, null, 2));

    expect(report.violations, "Should have no accessibility violations").toBe(0);
  });
});
