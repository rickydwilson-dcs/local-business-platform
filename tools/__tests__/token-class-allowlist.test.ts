import { describe, test, expect } from "vitest";
import { isAllowedClass, looksLikeColorClass } from "../lib/token-class-allowlist";

// ---------------------------------------------------------------------------
// isAllowedClass — allowed classes
// ---------------------------------------------------------------------------

describe("isAllowedClass", () => {
  test('returns true for "bg-brand-primary" (theme token)', () => {
    expect(isAllowedClass("bg-brand-primary")).toBe(true);
  });

  test('returns true for "text-surface-foreground" (theme token)', () => {
    expect(isAllowedClass("text-surface-foreground")).toBe(true);
  });

  test('returns true for "p-4" (standard Tailwind spacing)', () => {
    expect(isAllowedClass("p-4")).toBe(true);
  });

  test('returns true for "md:flex" (responsive prefix)', () => {
    expect(isAllowedClass("md:flex")).toBe(true);
  });

  test('returns true for "hover:bg-brand-primary" (state + token)', () => {
    expect(isAllowedClass("hover:bg-brand-primary")).toBe(true);
  });

  test('returns true for empty string (empty is fine)', () => {
    expect(isAllowedClass("")).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // isAllowedClass — rejected classes
  // ---------------------------------------------------------------------------

  test('returns false for "bg-brand-dark-purple" (invented colour)', () => {
    expect(isAllowedClass("bg-brand-dark-purple")).toBe(false);
  });

  test('returns false for "text-accent-light" (invented colour)', () => {
    expect(isAllowedClass("text-accent-light")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// looksLikeColorClass
// ---------------------------------------------------------------------------

describe("looksLikeColorClass", () => {
  test('returns true for "bg-brand-primary"', () => {
    expect(looksLikeColorClass("bg-brand-primary")).toBe(true);
  });

  test('returns false for "flex"', () => {
    expect(looksLikeColorClass("flex")).toBe(false);
  });
});
