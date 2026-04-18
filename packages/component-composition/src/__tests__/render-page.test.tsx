import { describe, it, expect } from "vitest";
import { renderComposedPage } from "../render-page";
import type { SiteCompositionConfig } from "../types";

const baseConfig: SiteCompositionConfig = {
  version: "1",
  siteId: "test",
  defaultSlots: {},
  pages: [
    {
      pageType: "home",
      sections: [
        { id: "hero", component: "HeroSection", condition: { type: "always" } },
        { id: "features", component: "FeatureGrid", condition: { type: "always" } },
      ],
    },
  ],
};

const data: Record<string, unknown> = { heading: "Test Heading", features: [{ title: "A" }] };

describe("renderComposedPage", () => {
  it("renders correct number of sections in order", () => {
    const { elements, diagnostics } = renderComposedPage({
      composition: baseConfig,
      pageType: "home",
      data,
    });
    expect(elements).toHaveLength(2);
    expect(diagnostics).toHaveLength(0);
  });

  it("skips sections with false conditions", () => {
    const config: SiteCompositionConfig = {
      ...baseConfig,
      pages: [
        {
          pageType: "home",
          sections: [
            { id: "hero", component: "HeroSection", condition: { type: "always" } },
            {
              id: "conditional",
              component: "ServiceCards",
              condition: { type: "flag", key: "showServices" },
            },
          ],
        },
      ],
    };
    const { elements } = renderComposedPage({
      composition: config,
      pageType: "home",
      data,
      flags: { showServices: false },
    });
    expect(elements).toHaveLength(1);
  });

  it("collects diagnostic for unknown component, does not throw", () => {
    const config: SiteCompositionConfig = {
      ...baseConfig,
      pages: [
        {
          pageType: "home",
          sections: [{ id: "bad", component: "HeroSection", condition: { type: "always" } }],
        },
      ],
    };
    const badConfig = {
      ...config,
      pages: [
        {
          pageType: "home",
          sections: [{ id: "bad", component: "UnknownWidget" as "HeroSection" }],
        },
      ],
    };
    const { elements, diagnostics } = renderComposedPage({
      composition: badConfig,
      pageType: "home",
      data,
    });
    expect(elements).toHaveLength(0);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe("error");
  });

  it("returns empty elements with diagnostic when page type not found", () => {
    const { elements, diagnostics } = renderComposedPage({
      composition: baseConfig,
      pageType: "about",
      data,
    });
    expect(elements).toHaveLength(0);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0].severity).toBe("warning");
  });

  it("merges defaultSlots from config with section-level slots (section overrides)", () => {
    const config: SiteCompositionConfig = {
      ...baseConfig,
      defaultSlots: { HeroSection: { showEyebrow: false, showSubheading: true } },
      pages: [
        {
          pageType: "home",
          sections: [
            {
              id: "hero",
              component: "HeroSection",
              slots: { showEyebrow: true },
              condition: { type: "always" },
            },
          ],
        },
      ],
    };
    const { elements } = renderComposedPage({ composition: config, pageType: "home", data });
    expect(elements).toHaveLength(1);
    const el = elements[0];
    expect(el.props.slots.showEyebrow).toBe(true);
    expect(el.props.slots.showSubheading).toBe(true);
  });
});
