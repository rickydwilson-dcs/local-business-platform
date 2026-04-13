/**
 * Computed Style Extractor
 *
 * Extracts computed CSS values from key DOM elements during the screenshot
 * step using Playwright's page.evaluate(). Uses selector strategies with
 * fallbacks per semantic role. Single page.evaluate() call per page for
 * minimal overhead.
 *
 * Uses string-based evaluate to bypass esbuild __name transform that breaks
 * in browser context. RGB-to-hex conversion happens Node-side.
 */

import type { Page } from "@playwright/test";
import type { ElementRole, PageComputedStyles } from "./reference-analysis-types";

// ── Section-level extraction types ──────────────────────────────────────────

export interface SectionComputedStyle {
  index: number;
  headingText: string | null; // first heading text inside section
  tagName: string; // 'section', 'div', etc.
  styles: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    padding: string;
    margin: string;
    borderRadius: string;
  };
}

// ── RGB-to-hex converter (Node-side) ────────────────────────────────────

function rgbToHex(rgb: string): string | null {
  const match = rgb.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return null;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  return (
    "#" +
    [r, g, b]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

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
    selectors: [
      "a[class*='btn-primary']",
      "button[class*='primary']",
      ".btn-primary",
      ".cta",
      "section:first-of-type a[href]",
    ],
    properties: [
      "backgroundColor",
      "color",
      "borderRadius",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "fontWeight",
      "fontSize",
      "borderColor",
    ],
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
    properties: [
      "backgroundColor",
      "borderRadius",
      "boxShadow",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "borderColor",
    ],
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

// ── Colour properties that need rgb→hex conversion ──────────────────────

const COLOUR_PROPERTIES = new Set(["backgroundColor", "color", "borderColor"]);

// ── Extractor ────────────────────────────────────────────────────────────

export async function extractComputedStyles(
  page: Page,
  pageType: string,
  url: string
): Promise<PageComputedStyles> {
  const serialisedStrategies = SELECTOR_STRATEGIES.map((s) => ({
    role: s.role,
    selectors: s.selectors,
    properties: s.properties,
  }));

  // String-based evaluate bypasses esbuild transforms completely
  const result = (await page.evaluate(`
    (function(strategies) {
      var startTime = performance.now();
      var colourSet = new Set();
      var elements = [];

      for (var i = 0; i < strategies.length; i++) {
        var strategy = strategies[i];
        var matchedSelector = "";
        var el = null;

        for (var j = 0; j < strategy.selectors.length; j++) {
          try {
            el = document.querySelector(strategy.selectors[j]);
          } catch (e) {
            continue;
          }
          if (el) {
            matchedSelector = strategy.selectors[j];
            break;
          }
        }

        if (!el) {
          elements.push({
            selector: strategy.selectors[0],
            role: strategy.role,
            found: false,
            styles: {}
          });
          continue;
        }

        try {
          var computed = getComputedStyle(el);
          var styles = {};

          for (var k = 0; k < strategy.properties.length; k++) {
            var prop = strategy.properties[k];
            var cssProp = prop.replace(/[A-Z]/g, function(m) { return "-" + m.toLowerCase(); });
            var value = computed.getPropertyValue(cssProp);
            if (value) {
              styles[prop] = value;
              if (prop === "backgroundColor" || prop === "color" || prop === "borderColor") {
                colourSet.add(value);
              }
            }
          }

          elements.push({
            selector: matchedSelector,
            role: strategy.role,
            found: true,
            styles: styles
          });
        } catch (e) {
          elements.push({
            selector: matchedSelector || strategy.selectors[0],
            role: strategy.role,
            found: false,
            styles: {}
          });
        }
      }

      var endTime = performance.now();
      return {
        elements: elements,
        allColours: Array.from(colourSet),
        extractMs: Math.round(endTime - startTime)
      };
    })(${JSON.stringify(serialisedStrategies)})
  `)) as {
    elements: Array<{
      selector: string;
      role: string;
      found: boolean;
      styles: Record<string, string>;
    }>;
    allColours: string[];
    extractMs: number;
  };

  // Node-side post-processing: convert rgb colours to hex
  const hexColourSet = new Set<string>();

  for (const colour of result.allColours) {
    const hex = rgbToHex(colour);
    if (hex) {
      hexColourSet.add(hex);
    }
  }

  for (const element of result.elements) {
    for (const prop of Object.keys(element.styles)) {
      if (COLOUR_PROPERTIES.has(prop)) {
        const hex = rgbToHex(element.styles[prop]);
        if (hex) {
          element.styles[prop] = hex;
        }
      }
    }
  }

  return {
    pageType,
    url,
    elements: result.elements as PageComputedStyles["elements"],
    allColours: Array.from(hexColourSet),
    extractMs: result.extractMs,
  };
}

// ── Section-level extractor ──────────────────────────────────────────────────

export async function extractAllSectionStyles(page: Page): Promise<SectionComputedStyle[]> {
  const raw = (await page.evaluate(`
    (function() {
      var SECTION_SELECTORS = ['section', 'header', 'footer', 'nav', 'main'];
      var STYLE_PROPS = [
        'backgroundColor', 'color', 'fontFamily', 'fontSize',
        'fontWeight', 'lineHeight', 'padding', 'margin', 'borderRadius'
      ];

      function rgbToHex(rgb) {
        var match = rgb && rgb.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/);
        if (!match) return rgb || '';
        var r = parseInt(match[1], 10);
        var g = parseInt(match[2], 10);
        var b = parseInt(match[3], 10);
        return '#' + [r, g, b].map(function(c) {
          return c.toString(16).padStart(2, '0');
        }).join('').toUpperCase();
      }

      function toCssProp(camel) {
        return camel.replace(/[A-Z]/g, function(m) { return '-' + m.toLowerCase(); });
      }

      var results = [];
      var index = 0;

      SECTION_SELECTORS.forEach(function(sel) {
        var els = document.querySelectorAll(sel);
        els.forEach(function(el) {
          var computed = getComputedStyle(el);
          var styles = {};
          STYLE_PROPS.forEach(function(prop) {
            var val = computed.getPropertyValue(toCssProp(prop)) || '';
            if (prop === 'backgroundColor' || prop === 'color') {
              val = rgbToHex(val);
            }
            styles[prop] = val;
          });

          var headingEl = el.querySelector('h1,h2,h3,h4,h5,h6');
          var headingText = headingEl ? (headingEl.textContent || '').trim().slice(0, 80) : null;

          results.push({
            index: index++,
            headingText: headingText,
            tagName: el.tagName.toLowerCase(),
            styles: styles
          });
        });
      });

      return results;
    })()
  `)) as SectionComputedStyle[];

  return raw;
}
