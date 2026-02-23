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

  // -------------------------------------------------------------------------
  // NON_COLOR_UTILITIES — standard Tailwind utilities that share colour prefixes
  // -------------------------------------------------------------------------

  test("allows standard Tailwind background utilities", () => {
    expect(isAllowedClass("bg-cover")).toBe(true);
    expect(isAllowedClass("bg-center")).toBe(true);
    expect(isAllowedClass("bg-no-repeat")).toBe(true);
    expect(isAllowedClass("bg-contain")).toBe(true);
    expect(isAllowedClass("bg-fixed")).toBe(true);
    expect(isAllowedClass("bg-clip-text")).toBe(true);
    expect(isAllowedClass("bg-auto")).toBe(true);
  });

  test("allows standard Tailwind decoration/border/outline utilities", () => {
    expect(isAllowedClass("decoration-wavy")).toBe(true);
    expect(isAllowedClass("border-dashed")).toBe(true);
    expect(isAllowedClass("outline-none")).toBe(true);
    expect(isAllowedClass("ring-inset")).toBe(true);
    expect(isAllowedClass("shadow-none")).toBe(true);
  });

  test("still rejects invented colour classes", () => {
    expect(isAllowedClass("bg-brand-dark-purple")).toBe(false);
    expect(isAllowedClass("bg-custom-blue")).toBe(false);
    expect(isAllowedClass("text-fancy-red")).toBe(false);
    expect(isAllowedClass("stroke-neon-green")).toBe(false);
  });

  test("still allows theme tokens", () => {
    expect(isAllowedClass("bg-brand-primary")).toBe(true);
    expect(isAllowedClass("text-surface-foreground")).toBe(true);
    expect(isAllowedClass("border-brand-accent")).toBe(true);
  });

  test("allows standard Tailwind prefixes", () => {
    expect(isAllowedClass("p-4")).toBe(true);
    expect(isAllowedClass("text-lg")).toBe(true);
    expect(isAllowedClass("flex")).toBe(true);
    expect(isAllowedClass("text-center")).toBe(true);
  });

  test("allows responsive and state modifiers", () => {
    expect(isAllowedClass("sm:bg-cover")).toBe(true);
    expect(isAllowedClass("hover:bg-brand-primary")).toBe(true);
    expect(isAllowedClass("md:text-center")).toBe(true);
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
