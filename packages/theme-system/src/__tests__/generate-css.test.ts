import { describe, it, expect } from "vitest";
import { generateCssVariables, generateCssString } from "../generate-css";
import { defaultTheme } from "../defaults";

describe("CSS Generation", () => {
  describe("generateCssVariables", () => {
    it("should generate all required CSS variables", () => {
      const vars = generateCssVariables(defaultTheme);

      // Brand colors
      expect(vars["--color-brand-primary"]).toBe("#3b82f6");
      expect(vars["--color-brand-primary-hover"]).toBe("#2563eb");
      expect(vars["--color-brand-secondary"]).toBe("#1e40af");
      expect(vars["--color-brand-accent"]).toBe("#f59e0b");

      // Surface colors
      expect(vars["--color-surface-background"]).toBe("#ffffff");
      expect(vars["--color-surface-foreground"]).toBe("#111827");
      expect(vars["--color-surface-muted"]).toBe("#f3f4f6");
      expect(vars["--color-surface-muted-foreground"]).toBe("#6b7280");

      // Semantic colors
      expect(vars["--color-success"]).toBe("#10b981");
      expect(vars["--color-warning"]).toBe("#f59e0b");
      expect(vars["--color-error"]).toBe("#ef4444");
      expect(vars["--color-info"]).toBe("#3b82f6");

      // Spacing
      expect(vars["--spacing-xs"]).toBe("0.25rem");
      expect(vars["--spacing-md"]).toBe("1rem");
      expect(vars["--spacing-xl"]).toBe("2rem");

      // Typography
      expect(vars["--font-family-sans"]).toContain("Inter");
    });

    it("should handle custom theme overrides", () => {
      const customTheme = {
        ...defaultTheme,
        colors: {
          ...defaultTheme.colors,
          brand: {
            primary: "#ff0000",
            primaryHover: "#cc0000",
            secondary: "#00ff00",
            accent: "#0000ff",
          },
        },
      };

      const vars = generateCssVariables(customTheme);
      expect(vars["--color-brand-primary"]).toBe("#ff0000");
      expect(vars["--color-brand-primary-hover"]).toBe("#cc0000");
    });

    it("should generate z-index as strings", () => {
      const vars = generateCssVariables(defaultTheme);
      expect(typeof vars["--z-dropdown"]).toBe("string");
      expect(typeof vars["--z-modal"]).toBe("string");
    });

    it("should handle font families with spaces", () => {
      const customTheme = {
        ...defaultTheme,
        typography: {
          ...defaultTheme.typography,
          fontFamily: {
            sans: ["Open Sans", "Arial", "sans-serif"],
            heading: ["Roboto Slab", "serif"],
          },
        },
      };

      const vars = generateCssVariables(customTheme);
      expect(vars["--font-family-sans"]).toContain('"Open Sans"');
      expect(vars["--font-family-heading"]).toContain('"Roboto Slab"');
    });
  });

  describe("generateCssString", () => {
    it("should generate valid CSS string", () => {
      const css = generateCssString(defaultTheme);

      expect(css).toContain(":root {");
      expect(css).toContain("--color-brand-primary:");
      expect(css).toContain("}");
      expect(css).toMatch(/--color-brand-primary:\s*#3b82f6;/);
    });

    it("should format with proper indentation", () => {
      const css = generateCssString(defaultTheme);
      const lines = css.split("\n");

      // First line should be :root {
      expect(lines[0]).toBe(":root {");

      // Last line should be }
      expect(lines[lines.length - 1]).toBe("}");

      // Middle lines should be indented
      for (let i = 1; i < lines.length - 1; i++) {
        expect(lines[i]).toMatch(/^\s{2}--/);
      }
    });

    it("should include all required CSS variables", () => {
      const css = generateCssString(defaultTheme);

      // Check for various variable categories
      expect(css).toContain("--color-brand-");
      expect(css).toContain("--color-surface-");
      expect(css).toContain("--color-success");
      expect(css).toContain("--spacing-");
      expect(css).toContain("--radius-");
      expect(css).toContain("--shadow-");
      expect(css).toContain("--z-");
      expect(css).toContain("--font-family-");
    });
  });
});
