import { describe, it, expect } from "vitest";
import {
  mapStylesToTokens,
  enhanceSynthesisWithComputedValues,
} from "../lib/computed-style-token-mapper";
import type {
  ComputedStylesResult,
  PageComputedStyles,
  ElementComputedStyles,
} from "../lib/reference-analysis-types";

// ── Helpers ──────────────────────────────────────────────────────────────

function makeElement(
  role: ElementComputedStyles["role"],
  styles: Record<string, string>,
  selector = "body",
): ElementComputedStyles {
  return { selector, role, found: true, styles };
}

function makePage(
  pageType: string,
  elements: ElementComputedStyles[],
  allColours: string[] = [],
): PageComputedStyles {
  return { pageType, url: `https://example.com/${pageType}`, elements, allColours, extractMs: 5 };
}

// ── Tests ────────────────────────────────────────────────────────────────

describe("mapStylesToTokens", () => {
  it("maps body styles to surface.background and surface.foreground", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("page-background", {
            backgroundColor: "rgb(41, 38, 97)",
            color: "rgb(255, 255, 255)",
          }),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    expect(result.config.colors?.surface?.background).toBe("#292661");
    expect(result.config.colors?.surface?.foreground).toBe("#FFFFFF");
    expect(result.provenance["surface.background"]?.source).toBe("computed");
    expect(result.provenance["surface.foreground"]?.source).toBe("computed");
  });

  it("maps primary-button styles to brand.primary and component tokens", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("page-background", { backgroundColor: "rgb(255,255,255)", color: "rgb(0,0,0)" }),
          makeElement("primary-button", {
            backgroundColor: "rgb(59, 130, 246)",
            color: "rgb(255, 255, 255)",
            borderRadius: "12px",
            paddingLeft: "24px",
            paddingTop: "12px",
            fontWeight: "600",
          }, "a.btn-primary"),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    expect(result.config.colors?.brand?.primary).toBe("#3B82F6");
    expect(result.config.colors?.brand?.onPrimary).toBe("#FFFFFF");
    expect(result.config.components?.button).toBeDefined();
    expect((result.config.components?.button as Record<string, unknown>)?.borderRadius).toBe("lg");
    expect(result.provenance["brand.primary"]?.source).toBe("computed");
  });

  it("extracts font family from body-text (first face from stack)", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("body-text", {
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: "400",
          }),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    expect(result.config.typography?.fontFamily?.sans?.[0]).toBe("Inter");
    expect(result.provenance["fontFamily.sans"]?.source).toBe("computed");
  });

  it("extracts typography scale values from headings", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("hero-heading", {
            fontFamily: '"Playfair Display", serif',
            fontSize: "48px",
            lineHeight: "56px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            color: "rgb(0,0,0)",
          }),
          makeElement("body-text", {
            fontFamily: '"Inter", sans-serif',
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: "400",
          }),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    const scale = result.config.typography?.scale as Record<string, Record<string, unknown>>;
    expect(scale?.hero?.size).toBe("48px");
    expect(scale?.hero?.weight).toBe(700);
    // Heading font differs from body → should be set
    expect(result.config.typography?.fontFamily?.heading?.[0]).toBe("Playfair Display");
  });

  it("homepage body background wins when pages disagree", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("page-background", { backgroundColor: "rgb(41, 38, 97)", color: "rgb(255,255,255)" }),
        ]),
        makePage("about", [
          makeElement("page-background", { backgroundColor: "rgb(255, 255, 255)", color: "rgb(0,0,0)" }),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    expect(result.config.colors?.surface?.background).toBe("#292661");
  });

  it("fills missing h3 from about page when not on homepage", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("heading-h1", { fontSize: "48px", fontWeight: "700", lineHeight: "56px" }),
        ]),
        makePage("about", [
          makeElement("heading-h3", { fontSize: "24px", fontWeight: "600", lineHeight: "32px" }),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    const scale = result.config.typography?.scale as Record<string, Record<string, unknown>>;
    expect(scale?.h3?.size).toBe("24px");
  });

  it("quantizes 12px border-radius to lg bucket", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("page-background", { backgroundColor: "rgb(255,255,255)", color: "rgb(0,0,0)" }),
          makeElement("primary-button", {
            backgroundColor: "rgb(59, 130, 246)",
            color: "rgb(255,255,255)",
            borderRadius: "12px",
            paddingLeft: "16px",
            paddingTop: "8px",
          }, "button"),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    expect((result.config.components?.button as Record<string, unknown>)?.borderRadius).toBe("lg");
  });

  it("quantizes small box-shadow to sm bucket", () => {
    const styles: ComputedStylesResult = {
      pages: [
        makePage("home", [
          makeElement("card", {
            backgroundColor: "rgb(255,255,255)",
            borderRadius: "8px",
            boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.1)",
            paddingTop: "24px",
          }, ".card"),
        ]),
      ],
    };

    const result = mapStylesToTokens(styles);
    expect((result.config.components?.card as Record<string, unknown>)?.shadow).toBe("sm");
  });
});

describe("enhanceSynthesisWithComputedValues", () => {
  const baseSynthesis = {
    brand: { primary: "#2D2A6E", primaryHover: "#231F5C", secondary: "#6B7280", accent: "#F59E0B" },
    surface: { background: "#2D2459", foreground: "#FFFFFF", muted: "#F3F4F6" },
    typography: {
      fontFamilySans: ["Inter", "system-ui", "sans-serif"],
      fontFamilyHeading: ["Inter", "system-ui", "sans-serif"],
    },
  };

  it("snaps synthesis value to nearest computed value within threshold", () => {
    const computedTokens = mapStylesToTokens({
      pages: [
        makePage("home", [
          makeElement("page-background", {
            backgroundColor: "rgb(41, 38, 97)",
            color: "rgb(255, 255, 255)",
          }),
          makeElement("primary-button", {
            backgroundColor: "rgb(41, 38, 97)",
            color: "rgb(255,255,255)",
          }),
        ], ["#292661", "#FFFFFF"]),
      ],
    });

    const result = enhanceSynthesisWithComputedValues(baseSynthesis, computedTokens);
    // #2D2459 should snap to #292661 (small ΔE)
    expect(result.surface.background).toBe("#292661");
  });

  it("keeps synthesis value when no computed match within threshold", () => {
    const computedTokens = mapStylesToTokens({
      pages: [
        makePage("home", [
          makeElement("page-background", {
            backgroundColor: "rgb(255, 0, 0)",
            color: "rgb(0, 255, 0)",
          }),
        ], ["#FF0000", "#00FF00"]),
      ],
    });

    const result = enhanceSynthesisWithComputedValues(baseSynthesis, computedTokens);
    // #2D2459 vs #FF0000 → large ΔE → keep original
    expect(result.surface.background).toBe("#2D2459");
  });

  it("uses computed typography when available", () => {
    const computedTokens = mapStylesToTokens({
      pages: [
        makePage("home", [
          makeElement("body-text", {
            fontFamily: '"Roboto", system-ui, sans-serif',
            fontSize: "16px",
          }),
        ]),
      ],
    });

    const result = enhanceSynthesisWithComputedValues(baseSynthesis, computedTokens);
    expect(result.typography.fontFamilySans[0]).toBe("Roboto");
  });
});
