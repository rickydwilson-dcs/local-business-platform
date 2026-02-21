/**
 * Computed Style Extractor
 *
 * Extracts computed CSS values from key DOM elements during the screenshot
 * step using Playwright's page.evaluate(). Uses selector strategies with
 * fallbacks per semantic role. Single page.evaluate() call per page for
 * minimal overhead.
 */

import type { Page } from "@playwright/test";
import type { ElementRole, PageComputedStyles } from "./reference-analysis-types";

// ── Selector Strategies ──────────────────────────────────────────────────

interface SelectorStrategy {
  role: ElementRole;
  selectors: string[];
  properties: string[];
}

export const SELECTOR_STRATEGIES: SelectorStrategy[] = [
  {
    role: "page-background",
    selectors: ["body"],
    properties: ["backgroundColor", "color", "fontFamily", "fontSize", "lineHeight"],
  },
  {
    role: "header",
    selectors: ["header", "nav", "[role='banner']", ".header", ".navbar"],
    properties: ["backgroundColor", "color", "height", "paddingTop", "paddingBottom"],
  },
  {
    role: "hero-section",
    selectors: ["section:first-of-type", "main > section:first-child", ".hero", "[class*='hero']"],
    properties: ["backgroundColor", "color", "paddingTop", "paddingBottom"],
  },
  {
    role: "hero-heading",
    selectors: ["section:first-of-type h1", ".hero h1", "main h1:first-of-type", "h1"],
    properties: ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color"],
  },
  {
    role: "hero-subheading",
    selectors: ["section:first-of-type h2", ".hero h2", "section:first-of-type p:first-of-type"],
    properties: ["fontFamily", "fontSize", "fontWeight", "color"],
  },
  {
    role: "primary-button",
    selectors: ["a[class*='btn-primary']", "button[class*='primary']", ".btn-primary", ".cta", "section:first-of-type a[href]"],
    properties: ["backgroundColor", "color", "borderRadius", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontWeight", "fontSize", "borderColor"],
  },
  {
    role: "secondary-button",
    selectors: ["a[class*='btn-secondary']", "button[class*='secondary']", ".btn-secondary"],
    properties: ["backgroundColor", "color", "borderRadius", "borderColor", "fontWeight"],
  },
  {
    role: "heading-h1",
    selectors: ["h1"],
    properties: ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color"],
  },
  {
    role: "heading-h2",
    selectors: ["h2"],
    properties: ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color"],
  },
  {
    role: "heading-h3",
    selectors: ["h3"],
    properties: ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color"],
  },
  {
    role: "heading-h4",
    selectors: ["h4"],
    properties: ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color"],
  },
  {
    role: "body-text",
    selectors: ["main p", "article p", "p"],
    properties: ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color"],
  },
  {
    role: "card",
    selectors: ["article", ".card", "[class*='card']"],
    properties: ["backgroundColor", "borderRadius", "boxShadow", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderColor"],
  },
  {
    role: "section",
    selectors: ["main > section", "section"],
    properties: ["backgroundColor", "paddingTop", "paddingBottom"],
  },
  {
    role: "footer",
    selectors: ["footer", "[role='contentinfo']"],
    properties: ["backgroundColor", "color"],
  },
  {
    role: "link",
    selectors: ["main a", "a"],
    properties: ["color", "fontWeight"],
  },
  {
    role: "nav-link",
    selectors: ["nav a", "header a"],
    properties: ["color", "fontWeight", "fontSize"],
  },
];

// ── Extractor ────────────────────────────────────────────────────────────

export async function extractComputedStyles(
  page: Page,
  pageType: string,
  url: string,
): Promise<PageComputedStyles> {
  const serialisedStrategies = SELECTOR_STRATEGIES.map((s) => ({
    role: s.role,
    selectors: s.selectors,
    properties: s.properties,
  }));

  const result = await page.evaluate((strategies) => {
    const startTime = performance.now();

    // Self-contained RGB-to-hex converter (cannot import modules inside evaluate)
    function rgbToHex(rgb: string): string | null {
      const match = rgb.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (!match) return null;
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
    }

    const colourSet = new Set<string>();
    const elements: Array<{
      selector: string;
      role: string;
      found: boolean;
      styles: Record<string, string>;
    }> = [];

    for (const strategy of strategies) {
      let matchedSelector = "";
      let el: Element | null = null;

      for (const sel of strategy.selectors) {
        try {
          el = document.querySelector(sel);
        } catch {
          continue;
        }
        if (el) {
          matchedSelector = sel;
          break;
        }
      }

      if (!el) {
        elements.push({
          selector: strategy.selectors[0],
          role: strategy.role,
          found: false,
          styles: {},
        });
        continue;
      }

      const computed = getComputedStyle(el);
      const styles: Record<string, string> = {};

      for (const prop of strategy.properties) {
        const value = computed.getPropertyValue(
          prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()),
        );
        if (value) {
          styles[prop] = value;

          // Collect hex colours
          if (prop === "backgroundColor" || prop === "color" || prop === "borderColor") {
            const hex = rgbToHex(value);
            if (hex && hex !== "#000000" && hex !== "#FFFFFF") {
              colourSet.add(hex);
            }
            // Also add black/white when they're actually present
            if (hex) colourSet.add(hex);
          }
        }
      }

      elements.push({
        selector: matchedSelector,
        role: strategy.role,
        found: true,
        styles,
      });
    }

    const endTime = performance.now();

    return {
      elements,
      allColours: Array.from(colourSet),
      extractMs: Math.round(endTime - startTime),
    };
  }, serialisedStrategies);

  return {
    pageType,
    url,
    elements: result.elements as PageComputedStyles["elements"],
    allColours: result.allColours,
    extractMs: result.extractMs,
  };
}
