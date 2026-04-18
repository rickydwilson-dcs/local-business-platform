import { describe, it, expect } from "vitest";
import { evaluateCondition } from "../conditions";

describe("evaluateCondition", () => {
  it("returns true for undefined condition", () => {
    expect(evaluateCondition(undefined, {})).toBe(true);
  });

  it("returns true for always type", () => {
    expect(evaluateCondition({ type: "always" }, {})).toBe(true);
  });

  it("flag: returns true when flag is set and truthy", () => {
    expect(
      evaluateCondition({ type: "flag", key: "featureX" }, { flags: { featureX: true } })
    ).toBe(true);
  });

  it("flag: returns false when flag is absent", () => {
    expect(evaluateCondition({ type: "flag", key: "featureX" }, { flags: {} })).toBe(false);
  });

  it("flag: returns true when value matches equals", () => {
    expect(
      evaluateCondition({ type: "flag", key: "tier", equals: "pro" }, { flags: { tier: "pro" } })
    ).toBe(true);
  });

  it("flag: returns false when value does not match equals", () => {
    expect(
      evaluateCondition({ type: "flag", key: "tier", equals: "pro" }, { flags: { tier: "free" } })
    ).toBe(false);
  });

  it("data-present: returns true when data key has non-empty array", () => {
    expect(
      evaluateCondition({ type: "data-present", key: "items" }, { data: { items: [1, 2, 3] } })
    ).toBe(true);
  });

  it("data-present: returns false when data key has empty array", () => {
    expect(evaluateCondition({ type: "data-present", key: "items" }, { data: { items: [] } })).toBe(
      false
    );
  });

  it("data-present: returns false when data key is null", () => {
    expect(
      evaluateCondition({ type: "data-present", key: "items" }, { data: { items: null } })
    ).toBe(false);
  });

  it("data-present: returns false when key is missing from data", () => {
    expect(evaluateCondition({ type: "data-present", key: "items" }, { data: {} })).toBe(false);
  });
});
