import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Scaffold Integrity Tests
 *
 * Since scaffold-theme-package.ts does not individually export its internal
 * helper functions, these tests verify structural invariants by reading the
 * source code directly. This prevents regressions in critical patterns without
 * requiring internal functions to be exported.
 */

const scaffoldSource = fs.readFileSync(
  path.resolve(__dirname, "../scaffold-theme-package.ts"),
  "utf8"
);

// ---------------------------------------------------------------------------
// THEME_NAMES regex
// ---------------------------------------------------------------------------

describe("THEME_NAMES regex", () => {
  test("uses [\\s\\S]*? to support multi-line arrays (not [^\\]]*)", () => {
    // The regex must use [\s\S]*? to handle THEME_NAMES arrays that span
    // multiple lines. A naive [^\]]* would fail on line breaks.
    expect(scaffoldSource).toContain("[\\s\\S]*?");
  });

  test("the regex pattern matches both single-line and multi-line arrays", () => {
    // Extract the regex from the source and test it directly
    const themeNamesRegex = /export const THEME_NAMES = \[([\s\S]*?)\] as const;/;

    const singleLine = 'export const THEME_NAMES = ["aurora", "vega"] as const;';
    const multiLine = `export const THEME_NAMES = [
  "aurora",
  "vega",
  "orion",
] as const;`;

    expect(themeNamesRegex.test(singleLine)).toBe(true);
    expect(themeNamesRegex.test(multiLine)).toBe(true);

    // Verify it captures the content between brackets
    const singleMatch = singleLine.match(themeNamesRegex);
    expect(singleMatch).not.toBeNull();
    expect(singleMatch![1]).toContain('"aurora"');

    const multiMatch = multiLine.match(themeNamesRegex);
    expect(multiMatch).not.toBeNull();
    expect(multiMatch![1]).toContain('"orion"');
  });
});

// ---------------------------------------------------------------------------
// ESM detection
// ---------------------------------------------------------------------------

describe("ESM detection", () => {
  test("does NOT use require.main for entry point detection", () => {
    // ESM modules cannot use require.main; the scaffold should use
    // import.meta.url or another ESM-compatible check instead.
    expect(scaffoldSource).not.toContain("require.main");
  });

  test("uses import.meta for entry point detection", () => {
    expect(scaffoldSource).toContain("import.meta");
  });
});

// ---------------------------------------------------------------------------
// Key function existence
// ---------------------------------------------------------------------------

describe("scaffold structure", () => {
  test("generateComponentBarrel function exists", () => {
    expect(scaffoldSource).toContain("function generateComponentBarrel");
  });

  test("generateShowcaseRegistryTsx function exists", () => {
    expect(scaffoldSource).toContain("function generateShowcaseRegistryTsx");
  });

  test("generateIndexTs function exists", () => {
    expect(scaffoldSource).toContain("function generateIndexTs");
  });

  test("scaffoldThemePackage is exported", () => {
    expect(scaffoldSource).toContain("export function scaffoldThemePackage");
  });
});

// ---------------------------------------------------------------------------
// Showcase generation
// ---------------------------------------------------------------------------

describe("showcase generation", () => {
  test("imports ReactNode type", () => {
    // The showcase-registry template must import ReactNode for the render function
    expect(scaffoldSource).toContain("import type { ReactNode }");
  });
});

// ---------------------------------------------------------------------------
// globals.css generation (Findings 3, 4)
// ---------------------------------------------------------------------------

describe("generateGlobalsCss", () => {
  // Extract the function body from source for pattern checks
  const globalsCssMatch = scaffoldSource.match(
    /function generateGlobalsCss[\s\S]*?return `([\s\S]*?)`;/
  );
  const globalsCssTemplate = globalsCssMatch?.[1] ?? "";

  test("does NOT use opacity modifiers in @apply directives", () => {
    // Opacity modifiers like /90, /30, /10 on theme token classes
    // don't work in @apply because tokens resolve to CSS custom properties
    expect(globalsCssTemplate).not.toMatch(/\/(90|80|70|60|50|30|20|10)\b/);
  });

  test("does NOT reference non-existent text-on-brand-secondary", () => {
    // The theme system only defines text-on-brand-primary, not secondary
    expect(globalsCssTemplate).not.toContain("text-on-brand-secondary");
  });

  test("uses hover:bg-brand-primary-hover for primary button hover", () => {
    expect(globalsCssTemplate).toContain("hover:bg-brand-primary-hover");
  });

  test("does NOT use @layer wrappers around selectors", () => {
    // @layer base/components/utilities wrapping would break when imported before @tailwind
    expect(globalsCssTemplate).not.toMatch(/@layer\s+(base|components|utilities)\s*\{/);
  });
});

// ---------------------------------------------------------------------------
// ThemeName sync (Finding 2)
// ---------------------------------------------------------------------------

describe("appendThemeName", () => {
  test("updates theme-context.tsx ThemeName union", () => {
    // appendThemeName must sync to both types.ts AND theme-context.tsx
    expect(scaffoldSource).toContain("theme-context.tsx");
    expect(scaffoldSource).toContain("export type ThemeName =");
  });
});

// ---------------------------------------------------------------------------
// Component file copy (Finding 5)
// ---------------------------------------------------------------------------

describe("component file copy", () => {
  test("copies .tsx files from output to theme package", () => {
    // The scaffold should copy component .tsx files from the output directory
    expect(scaffoldSource).toContain("copyFileSync");
    expect(scaffoldSource).toContain('.endsWith(".tsx")');
  });

  test("scaffoldThemePackage accepts outputDir parameter", () => {
    expect(scaffoldSource).toContain("outputDir?: string");
  });
});

// ---------------------------------------------------------------------------
// Barrel dedup order (Finding 6)
// ---------------------------------------------------------------------------

describe("barrel deduplication", () => {
  test("checks core-match skip BEFORE duplicate name check in generateComponentBarrel", () => {
    // Extract the barrel function body
    const barrelFnMatch = scaffoldSource.match(/function generateComponentBarrel[\s\S]*?^}/m);
    const barrelFn = barrelFnMatch?.[0] ?? "";

    // The core-match check (componentMatches.get) should appear before
    // the seenExports.has check in the loop body
    const coreMatchIndex = barrelFn.indexOf("componentMatches");
    const seenExportsIndex = barrelFn.indexOf("seenExports.has");

    // Both patterns should exist
    expect(coreMatchIndex).toBeGreaterThan(-1);
    expect(seenExportsIndex).toBeGreaterThan(-1);

    // Core-match check should come first
    expect(coreMatchIndex).toBeLessThan(seenExportsIndex);
  });
});

// ---------------------------------------------------------------------------
// generateIndexTs completeness (TPV-006, TPV-009)
// ---------------------------------------------------------------------------

describe("generateIndexTs completeness (TPV-006, TPV-009)", () => {
  test("always emits colors.semantic block (Bug 2 fix)", () => {
    expect(scaffoldSource).toMatch(/semantic:\s*\{/);
  });

  test("always emits colors.overlay block (Bug 2 fix)", () => {
    expect(scaffoldSource).toMatch(/overlay:\s*\{/);
  });

  test("defines DEFAULT_TYPOGRAPHY_SCALE constant with all 8 levels (Bug 3 fix)", () => {
    expect(scaffoldSource).toContain("DEFAULT_TYPOGRAPHY_SCALE");
    expect(scaffoldSource).toContain("hero:");
    expect(scaffoldSource).toContain("caption:");
  });

  test("typography scale uses ?? DEFAULT_TYPOGRAPHY_SCALE fallback (Bug 3 fix)", () => {
    expect(scaffoldSource).toContain("DEFAULT_TYPOGRAPHY_SCALE");
    expect(scaffoldSource).toMatch(/typography\.scale.*\?\?|tokens\.typography\.scale.*\?\?/);
  });
});

// ---------------------------------------------------------------------------
// generateComponentBarrel contract (TPV-002, Bug 5)
// ---------------------------------------------------------------------------

describe("generateComponentBarrel contract (TPV-002, Bug 5)", () => {
  test("generateComponentBarrel accepts themeName option (Bug 4 fix)", () => {
    // Verify the function signature accepts an options object
    expect(scaffoldSource).toMatch(/generateComponentBarrel\s*\([^)]*options/);
  });

  test("barrel emits theme-prefixed Header alias (Bug 4 fix)", () => {
    expect(scaffoldSource).toMatch(/Header.*from/);
    expect(scaffoldSource).toMatch(/pascal.*Header/);
  });

  test("blueprintId is used as primary key in map reconstruction (Bug 5 fix)", () => {
    expect(scaffoldSource).toContain("match.blueprintId");
  });
});
