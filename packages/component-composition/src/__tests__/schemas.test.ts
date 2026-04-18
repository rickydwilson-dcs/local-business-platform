import { describe, it, expect } from "vitest";
import { SiteCompositionConfigSchema, ConditionConfigSchema } from "../schemas";

const validConfig = {
  version: "1",
  siteId: "test-site",
  pages: [
    {
      pageType: "home",
      sections: [
        {
          id: "hero",
          component: "HeroSection",
          slots: { showEyebrow: true, showSubheading: false },
          layout: { align: "center", background: "surface" },
          condition: { type: "always" },
        },
      ],
    },
  ],
};

describe("SiteCompositionConfigSchema", () => {
  it("parses a valid config with each component type", () => {
    const components = [
      "HeroSection",
      "ServiceCards",
      "FeatureGrid",
      "TestimonialGrid",
      "StatsStrip",
      "CTASection",
      "ContentSection",
    ] as const;

    for (const component of components) {
      const config = {
        version: "1",
        siteId: "test",
        pages: [{ pageType: "home", sections: [{ component }] }],
      };
      expect(() => SiteCompositionConfigSchema.parse(config)).not.toThrow();
    }
  });

  it("throws ZodError for invalid component name", () => {
    const config = {
      version: "1",
      siteId: "test",
      pages: [{ pageType: "home", sections: [{ component: "UnknownWidget" }] }],
    };
    expect(() => SiteCompositionConfigSchema.parse(config)).toThrow();
  });

  it("parses a full valid config without error", () => {
    expect(() => SiteCompositionConfigSchema.parse(validConfig)).not.toThrow();
  });

  it("merges optional defaultSlots", () => {
    const config = {
      ...validConfig,
      defaultSlots: { HeroSection: { showEyebrow: false } },
    };
    const parsed = SiteCompositionConfigSchema.parse(config);
    expect(parsed.defaultSlots?.HeroSection?.showEyebrow).toBe(false);
  });
});

describe("ConditionConfigSchema", () => {
  it("validates always type", () => {
    expect(() => ConditionConfigSchema.parse({ type: "always" })).not.toThrow();
  });

  it("validates flag type with key and equals", () => {
    expect(() =>
      ConditionConfigSchema.parse({ type: "flag", key: "feature", equals: "pro" })
    ).not.toThrow();
  });

  it("validates data-present type with key", () => {
    expect(() =>
      ConditionConfigSchema.parse({ type: "data-present", key: "services" })
    ).not.toThrow();
  });

  it("throws for invalid type", () => {
    expect(() => ConditionConfigSchema.parse({ type: "never" })).toThrow();
  });
});
