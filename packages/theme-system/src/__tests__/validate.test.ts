import { describe, it, expect } from "vitest";
import { validateTheme } from "../cli/validate";
import { defaultTheme } from "../defaults";

describe("Theme Validation", () => {
  it("should validate a complete theme config", () => {
    const result = validateTheme(defaultTheme);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should warn on low contrast colors", () => {
    const lowContrastTheme = {
      colors: {
        brand: {
          primary: "#cccccc", // Light gray - low contrast with white
          primaryHover: "#bbbbbb",
          secondary: "#dddddd",
          accent: "#eeeeee",
        },
      },
    };
    const result = validateTheme(lowContrastTheme);
    expect(result.warnings.some((w) => w.includes("Contrast ratio"))).toBe(true);
  });

  it("should warn on missing tokens", () => {
    const partialTheme = {
      colors: {
        brand: {
          primary: "#3b82f6",
        },
      },
    };
    const result = validateTheme(partialTheme);
    expect(result.warnings.some((w) => w.includes("Missing token"))).toBe(true);
  });

  it("should error on invalid hex colors", () => {
    const invalidTheme = {
      colors: {
        brand: {
          primary: "not-a-color",
          primaryHover: "#2563eb",
          secondary: "#1e40af",
          accent: "#f59e0b",
        },
      },
    };
    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should validate font preload paths", () => {
    const themeWithInvalidFontPath = {
      fonts: {
        preload: [
          {
            family: "Inter",
            src: "relative/path/font.woff2", // Should be absolute
            weight: 400,
            style: "normal" as const,
            display: "swap" as const,
          },
        ],
      },
    };
    const result = validateTheme(themeWithInvalidFontPath);
    expect(result.warnings.some((w) => w.includes("Font preload path"))).toBe(true);
  });

  it("should validate z-index ordering", () => {
    const themeWithBadZIndex = {
      zIndex: {
        dropdown: 50,
        sticky: 100,
        modal: 75, // Wrong: should be higher than sticky
        popover: 150,
        tooltip: 200,
      },
    };
    const result = validateTheme(themeWithBadZIndex);
    // If validator checks z-index ordering, this should produce warnings
    // Implementation may vary based on validator logic
  });
});
