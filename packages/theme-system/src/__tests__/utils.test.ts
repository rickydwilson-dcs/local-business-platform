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
      const target = { a: { b: 1, c: 2 }, d: 3 } as Record<string, unknown>;
      const source = { a: { b: 3 } } as Record<string, unknown>;
      const result = deepMerge(target, source);

      expect((result.a as Record<string, unknown>).b).toBe(3); // Overridden
      expect((result.a as Record<string, unknown>).c).toBe(2); // Preserved
      expect(result.d).toBe(3); // Preserved
    });

    it("should handle arrays by replacing", () => {
      const target = { arr: [1, 2, 3] } as Record<string, unknown>;
      const source = { arr: [4, 5] } as Record<string, unknown>;
      const result = deepMerge(target, source);

      expect(result.arr).toEqual([4, 5]);
    });

    it("should not mutate original objects", () => {
      const target = { a: { b: 1 } } as Record<string, unknown>;
      const source = { a: { b: 2 } } as Record<string, unknown>;
      const result = deepMerge(target, source);

      expect((target.a as Record<string, unknown>).b).toBe(1); // Unchanged
      expect((result.a as Record<string, unknown>).b).toBe(2); // Changed in result
    });

    it("should handle undefined values", () => {
      const target = { a: 1, b: 2 } as Record<string, unknown>;
      const source = { b: undefined, c: 3 } as Record<string, unknown>;
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
