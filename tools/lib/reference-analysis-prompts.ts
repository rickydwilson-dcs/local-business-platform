/**
 * Reference Analysis Prompts
 *
 * Vision prompt template for Claude to analyse a reference website screenshot
 * and produce structured JSON matching the ReferenceAnalysis schema.
 */

export const REFERENCE_ANALYSIS_PROMPT = `You are analysing a screenshot of a reference website to extract visual design patterns for a white-label website platform.

This screenshot may have been captured at a different time than today. Analyse what is visible, not what may have changed.

Return ONLY a JSON object (no prose, no markdown fences) matching this exact schema:

{
  "analysisVersion": "1",
  "reference": {
    "url": "<url if provided, otherwise null>",
    "screenshotPath": "<path if provided, otherwise null>",
    "capturedAt": "<ISO 8601 timestamp>"
  },
  "visualLanguage": {
    "palette": {
      "background": "<hex>",
      "foreground": "<hex>",
      "primary": "<hex — sample the actual dominant brand colour pixel>",
      "secondary": "<hex — sample secondary brand colour>",
      "accent": "<hex — sample accent/highlight colour>",
      "additional": ["<hex>", ...],
      "confidence": "high" | "medium" | "low"
    },
    "typography": {
      "headingWeight": "bold" | "extrabold" | "black",
      "bodyWeight": "normal" | "medium",
      "headingStyle": "sans" | "serif" | "display",
      "usesInlineColourHighlights": true | false
    },
    "heroPattern": {
      "type": "dark-full-bleed" | "split" | "centered" | "light",
      "hasBackgroundImage": true | false,
      "headerDark": true | false
    },
    "spacingDensity": "compact" | "standard" | "spacious"
  },
  "detectedSections": [
    {
      "name": "<descriptive name>",
      "background": "<hex or description>",
      "layoutType": "full-bleed-band" | "contained" | "split" | "grid" | "strip",
      "purpose": "cta" | "info" | "blog" | "about" | "testimonial" | "nav" | "footer" | "sponsor" | "newsletter" | "hero" | "custom",
      "notes": "<brief description of what this section contains>"
    }
  ],
  "componentMappings": [
    {
      "section": "<section name from detectedSections>",
      "status": "REUSE" | "ADAPT" | "NEW",
      "existingComponent": "<component name or null>",
      "notes": "<how to use/adapt, or what new component is needed>",
      "confidence": "high" | "medium" | "low"
    }
  ],
  "newComponentBacklog": [
    {
      "name": "<PascalCase component name>",
      "description": "<what it does>",
      "propsContract": "<TypeScript interface as a string>",
      "tokenConstraints": "<which theme tokens it must use>",
      "acceptanceCriteria": ["<criterion 1>", ...],
      "referenceSection": "<which detected section this maps to>"
    }
  ],
  "registryRecommendation": {
    "themeName": "<suggested theme slug>",
    "heroVariant": "image-overlay" | "split" | "minimal",
    "headerVariant": "dark" | "light",
    "cardVariant": "icon-circle" | "standard" | "overlay",
    "sectionVariant": "dark-accent" | "gradient" | "standard" | "banded",
    "confidence": "high" | "medium" | "low",
    "reasoning": "<brief explanation>"
  },
  "themeTokenRecommendations": {
    "brand": {
      "primary": "<hex>",
      "primaryHover": "<hex — slightly darker/lighter variant>",
      "secondary": "<hex>",
      "accent": "<hex>"
    },
    "surface": {
      "background": "<hex>",
      "foreground": "<hex>",
      "muted": "<hex>"
    },
    "typography": {
      "fontFamilySans": ["<font name>", "system-ui", "sans-serif"],
      "fontFamilyHeading": ["<font name>", "system-ui", "sans-serif"]
    }
  }
}

IMPORTANT INSTRUCTIONS:
1. For palette colours, sample the ACTUAL pixel colours from the screenshot. Use hex values, not colour names.
2. List sections in order from top to bottom of the page.
3. For componentMappings, map each detected section to one of these known components if possible:
   hero-section, hero-with-image, cta-section, blog-post-card, blog-post-hero, site-header, footer, service-about, service-hero, service-benefits, service-faq, faq-section, testimonial-card, pricing-packages, circular-icon-card, content-card, card-grid
4. If a section has NO matching existing component, set status to "NEW" and include a TypeScript props interface draft in the propsContract field of the newComponentBacklog entry.
5. For registryRecommendation, choose the variant values that best describe the overall visual pattern.
6. Return ONLY the JSON object. No explanation, no markdown fences, no commentary.`;
