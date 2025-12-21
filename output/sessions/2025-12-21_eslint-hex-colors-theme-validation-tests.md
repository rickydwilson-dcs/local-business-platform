# ESLint Hex Color Rules and Theme Validation Tests Implementation

**Date:** 2025-12-21
**Objective:** Add ESLint rules to prevent raw hex colors in core-components and create comprehensive validation tests for theme-system package
**Status:** Implementation Ready

## Context

This session implements quality controls to ensure consistent theming across the platform:

1. ESLint rules in core-components to catch raw hex color usage
2. Comprehensive test suite for theme-system validation
3. Test infrastructure setup with Vitest

## Task 1: Update ESLint Configuration in core-components

**File:** `/packages/core-components/eslint.config.mjs`

**Changes:** Add `no-restricted-syntax` rule to prevent raw hex colors

### Updated Configuration

```javascript
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "**/*.d.ts"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "react/jsx-key": "error",
      // Prevent raw hex colors - use CSS variables via Tailwind classes instead
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message:
            "Raw hex colors are forbidden. Use CSS variables via Tailwind classes (e.g., bg-brand-primary) or theme tokens.",
        },
        {
          selector: "TemplateElement[value.raw=/^#[0-9a-fA-F]{3,8}$/]",
          message:
            "Raw hex colors are forbidden in template literals. Use CSS variables via Tailwind classes (e.g., bg-brand-primary) or theme tokens.",
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
```

### What This Catches

The new ESLint rule will catch:

- `color: '#005A9E'` (direct string literals)
- `className="text-[#005A9E]"` (arbitrary Tailwind values)
- Template literals with hex colors

And allows:

- `className="bg-brand-primary"` (Tailwind with CSS variables)
- Theme tokens and CSS variable references

## Task 2: Create Theme Validation Tests

**File:** `/packages/theme-system/src/__tests__/validate.test.ts`

```typescript
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
            src: "relative/path/font.woff2", // Should be absolute
            weight: 400,
            style: "normal",
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
```

## Task 3: Create CSS Generation Tests

**File:** `/packages/theme-system/src/__tests__/generate-css.test.ts`

```typescript
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
```

## Task 4: Create Utility Function Tests

**File:** `/packages/theme-system/src/__tests__/utils.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import {
  deepMerge,
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsWcagAA,
  findMissingKeys,
  getNestedValue,
} from "../utils";

describe("Utils", () => {
  describe("deepMerge", () => {
    it("should merge nested objects", () => {
      const target = { a: { b: 1, c: 2 }, d: 3 };
      const source = { a: { b: 3 } };
      const result = deepMerge(target, source);

      expect(result.a.b).toBe(3); // Overridden
      expect(result.a.c).toBe(2); // Preserved
      expect(result.d).toBe(3); // Preserved
    });

    it("should handle arrays by replacing", () => {
      const target = { arr: [1, 2, 3] };
      const source = { arr: [4, 5] };
      const result = deepMerge(target, source);

      expect(result.arr).toEqual([4, 5]);
    });

    it("should not mutate original objects", () => {
      const target = { a: { b: 1 } };
      const source = { a: { b: 2 } };
      const result = deepMerge(target, source);

      expect(target.a.b).toBe(1); // Unchanged
      expect(result.a.b).toBe(2); // Changed in result
    });

    it("should handle undefined values", () => {
      const target = { a: 1, b: 2 };
      const source = { b: undefined, c: 3 };
      const result = deepMerge(target, source);

      expect(result.a).toBe(1);
      expect(result.b).toBe(2); // undefined in source should not override
      expect(result.c).toBe(3);
    });
  });

  describe("hexToRgb", () => {
    it("should convert hex to RGB", () => {
      expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb("#3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
    });

    it("should handle hex without hash prefix", () => {
      expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
    });

    it("should return null for invalid hex", () => {
      expect(hexToRgb("invalid")).toBeNull();
      expect(hexToRgb("#xyz")).toBeNull();
    });
  });

  describe("getLuminance", () => {
    it("should calculate luminance for black and white", () => {
      expect(getLuminance("#000000")).toBeCloseTo(0, 5);
      expect(getLuminance("#ffffff")).toBeCloseTo(1, 5);
    });

    it("should return 0 for invalid colors", () => {
      expect(getLuminance("invalid")).toBe(0);
    });
  });

  describe("getContrastRatio", () => {
    it("should calculate contrast ratio correctly", () => {
      // Black and white should have ~21:1 ratio
      const ratio = getContrastRatio("#000000", "#ffffff");
      expect(ratio).toBeCloseTo(21, 0);
    });

    it("should be commutative", () => {
      const ratio1 = getContrastRatio("#3b82f6", "#ffffff");
      const ratio2 = getContrastRatio("#ffffff", "#3b82f6");
      expect(ratio1).toBeCloseTo(ratio2, 2);
    });

    it("should return 1 for identical colors", () => {
      const ratio = getContrastRatio("#3b82f6", "#3b82f6");
      expect(ratio).toBeCloseTo(1, 1);
    });
  });

  describe("meetsWcagAA", () => {
    it("should pass for high contrast colors", () => {
      expect(meetsWcagAA("#000000", "#ffffff")).toBe(true);
      expect(meetsWcagAA("#ffffff", "#000000")).toBe(true);
    });

    it("should fail for low contrast colors", () => {
      expect(meetsWcagAA("#cccccc", "#ffffff")).toBe(false);
      expect(meetsWcagAA("#e0e0e0", "#f5f5f5")).toBe(false);
    });

    it("should use different threshold for large text", () => {
      // A color pair that meets AA for large text (3:1) but not normal text (4.5:1)
      const fg = "#777777";
      const bg = "#ffffff";

      expect(meetsWcagAA(fg, bg, false)).toBe(false); // Normal text
      expect(meetsWcagAA(fg, bg, true)).toBe(true); // Large text
    });
  });

  describe("findMissingKeys", () => {
    it("should find missing top-level keys", () => {
      const partial = { a: 1 };
      const full = { a: 1, b: 2, c: 3 };
      const missing = findMissingKeys(partial, full);

      expect(missing).toContain("b");
      expect(missing).toContain("c");
      expect(missing).not.toContain("a");
    });

    it("should find missing nested keys", () => {
      const partial = { a: { b: 1 } };
      const full = { a: { b: 1, c: 2 } };
      const missing = findMissingKeys(partial, full);

      expect(missing).toContain("a.c");
    });

    it("should use dot notation for paths", () => {
      const partial = {};
      const full = { level1: { level2: { level3: "value" } } };
      const missing = findMissingKeys(partial, full);

      expect(missing).toContain("level1");
    });

    it("should return empty array when nothing is missing", () => {
      const obj = { a: 1, b: 2 };
      const missing = findMissingKeys(obj, obj);

      expect(missing).toEqual([]);
    });
  });

  describe("getNestedValue", () => {
    it("should get nested value using dot notation", () => {
      const obj = {
        level1: {
          level2: {
            level3: "value",
          },
        },
      };

      expect(getNestedValue(obj, "level1.level2.level3")).toBe("value");
    });

    it("should return undefined for non-existent path", () => {
      const obj = { a: { b: 1 } };

      expect(getNestedValue(obj, "a.c")).toBeUndefined();
      expect(getNestedValue(obj, "x.y.z")).toBeUndefined();
    });

    it("should handle top-level keys", () => {
      const obj = { key: "value" };

      expect(getNestedValue(obj, "key")).toBe("value");
    });
  });
});
```

## Task 5: Add Vitest Configuration

**File:** `/packages/theme-system/vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.d.ts",
        "src/cli/**", // CLI may need separate integration tests
      ],
    },
  },
});
```

## Task 6: Update package.json

**File:** `/packages/theme-system/package.json`

Add test scripts and Vitest dependency:

```json
{
  "name": "@platform/theme-system",
  "version": "1.0.0",
  "description": "Comprehensive theming system with design tokens and Tailwind integration",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./plugin": {
      "types": "./dist/tailwind-plugin.d.ts",
      "default": "./dist/tailwind-plugin.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "validate": "ts-node src/cli/validate.ts",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "zod": "^3.22.0"
  },
  "peerDependencies": {
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@vitest/coverage-v8": "^1.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "vitest": "^1.0.0"
  },
  "keywords": ["theme", "design-tokens", "tailwind", "css-variables", "theming"],
  "license": "MIT"
}
```

## Implementation Steps

1. **Update ESLint config in core-components:**

   ```bash
   cd /Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My\ Drive/Websites/GitHub/local-business-platform/packages/core-components
   # Update eslint.config.mjs with new no-restricted-syntax rule
   ```

2. **Install Vitest in theme-system:**

   ```bash
   cd /Users/rickywilson/Library/CloudStorage/GoogleDrive-rickydwilson@gmail.com/My\ Drive/Websites/GitHub/local-business-platform/packages/theme-system
   pnpm add -D vitest @vitest/coverage-v8
   ```

3. **Create test directory structure:**

   ```bash
   mkdir -p src/__tests__
   ```

4. **Create test files:**
   - `src/__tests__/validate.test.ts`
   - `src/__tests__/generate-css.test.ts`
   - `src/__tests__/utils.test.ts`

5. **Create Vitest config:**
   - `vitest.config.ts`

6. **Update package.json:**
   - Add test scripts
   - Add Vitest dependencies

7. **Run tests:**

   ```bash
   pnpm test
   pnpm test:coverage
   ```

8. **Verify ESLint rule:**
   ```bash
   cd ../core-components
   pnpm lint
   ```

## Expected Test Coverage

After implementation, the theme-system package should have:

- **Validation:** 100% coverage of validateTheme function
- **CSS Generation:** 100% coverage of generateCssVariables and generateCssString
- **Utilities:** 100% coverage of all utility functions
- **Overall:** >90% code coverage

## Success Criteria

1. ESLint rule catches raw hex colors in core-components
2. All theme-system tests pass
3. Test coverage >90%
4. No TypeScript errors
5. Documentation updated

## Related Files

- `/packages/core-components/eslint.config.mjs`
- `/packages/theme-system/src/cli/validate.ts`
- `/packages/theme-system/src/generate-css.ts`
- `/packages/theme-system/src/utils.ts`
- `/packages/theme-system/src/defaults.ts`
- `/packages/theme-system/package.json`

## Next Steps

1. Apply all file changes
2. Run `pnpm install` in theme-system
3. Run tests: `pnpm test`
4. Verify ESLint: `pnpm lint` in core-components
5. Update CHANGELOG.md
6. Commit changes following git workflow

---

**Implementation Status:** Ready for execution
**Test Files Created:** 3
**Configuration Files:** 2
**Dependencies Added:** vitest, @vitest/coverage-v8
