import { describe, test, expect } from "vitest";
import {
  PageVisionResponseSchema,
  SiteSynthesisResponseSchema,
  VisualLanguageSchema,
} from "../lib/analysis-schemas";

import pageVisionFixture from "./fixtures/mock-page-vision-result.json";
import synthesisFixture from "./fixtures/mock-synthesis-response.json";
import malformedFixture from "./fixtures/mock-malformed-synthesis.json";

// ---------------------------------------------------------------------------
// PageVisionResponseSchema
// ---------------------------------------------------------------------------

describe("PageVisionResponseSchema", () => {
  test("accepts a valid page vision fixture", () => {
    const result = PageVisionResponseSchema.safeParse(pageVisionFixture);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// SiteSynthesisResponseSchema
// ---------------------------------------------------------------------------

describe("SiteSynthesisResponseSchema", () => {
  test("accepts a valid synthesis fixture", () => {
    const result = SiteSynthesisResponseSchema.safeParse(synthesisFixture);
    expect(result.success).toBe(true);
  });

  test("rejects a malformed synthesis fixture", () => {
    const result = SiteSynthesisResponseSchema.safeParse(malformedFixture);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// VisualLanguageSchema
// ---------------------------------------------------------------------------

describe("VisualLanguageSchema", () => {
  test("accepts the visualLanguage sub-object from a valid fixture", () => {
    const result = VisualLanguageSchema.safeParse(synthesisFixture.visualLanguage);
    expect(result.success).toBe(true);
  });

  test("rejects when palette.primary is missing", () => {
    const incomplete = {
      palette: {
        background: "#FFFFFF",
        foreground: "#1A1A2E",
        // primary is missing
        secondary: "#2D8CFF",
        accent: "#FF6B35",
        additional: [],
        confidence: "high",
      },
      typography: {
        headingWeight: "bold",
        bodyWeight: "normal",
        headingStyle: "sans",
        usesInlineColourHighlights: false,
      },
      heroPattern: {
        type: "dark-full-bleed",
        hasBackgroundImage: true,
        headerDark: true,
      },
      spacingDensity: "standard",
    };

    const result = VisualLanguageSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  test("rejects when required palette fields are missing", () => {
    const noPalette = {
      typography: {
        headingWeight: "bold",
        bodyWeight: "normal",
        headingStyle: "sans",
        usesInlineColourHighlights: false,
      },
      heroPattern: {
        type: "dark-full-bleed",
        hasBackgroundImage: true,
        headerDark: true,
      },
      spacingDensity: "standard",
    };

    const result = VisualLanguageSchema.safeParse(noPalette);
    expect(result.success).toBe(false);
  });
});
