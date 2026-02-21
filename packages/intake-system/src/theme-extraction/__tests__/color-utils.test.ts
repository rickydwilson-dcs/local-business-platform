import { describe, it, expect } from "vitest";
import { colorDistanceCIE76, rgbToLab } from "../color-utils";

describe("colorDistanceCIE76", () => {
  it("returns 0 for identical colours", () => {
    expect(colorDistanceCIE76("#292661", "#292661")).toBe(0);
  });

  it("returns small value for similar colours", () => {
    const delta = colorDistanceCIE76("#292661", "#2D2459");
    expect(delta).toBeLessThan(20);
    expect(delta).toBeGreaterThan(0);
  });

  it("returns large value for very different colours", () => {
    const delta = colorDistanceCIE76("#292661", "#FF0000");
    expect(delta).toBeGreaterThan(50);
  });

  it("returns max-ish value for black vs white", () => {
    const delta = colorDistanceCIE76("#000000", "#FFFFFF");
    expect(delta).toBeGreaterThan(100);
  });
});

describe("rgbToLab", () => {
  it("converts white to L≈100, a≈0, b≈0", () => {
    const lab = rgbToLab({ r: 255, g: 255, b: 255 });
    expect(lab.L).toBeCloseTo(100, 0);
    expect(Math.abs(lab.a)).toBeLessThan(1);
    expect(Math.abs(lab.b)).toBeLessThan(1);
  });

  it("converts black to L≈0, a≈0, b≈0", () => {
    const lab = rgbToLab({ r: 0, g: 0, b: 0 });
    expect(lab.L).toBeCloseTo(0, 0);
    expect(Math.abs(lab.a)).toBeLessThan(1);
    expect(Math.abs(lab.b)).toBeLessThan(1);
  });
});
