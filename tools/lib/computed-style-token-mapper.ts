/**
 * Computed Style Token Mapper
 *
 * Maps raw computed CSS values from Playwright extraction to theme tokens
 * with provenance tracking. Uses CIE76 colour distance to snap AI-estimated
 * values to exact computed hex values.
 */

import type { DeepPartialThemeConfig } from "../../packages/theme-system/src/types";
import type {
  ComputedStylesResult,
  PageComputedStyles,
  ElementComputedStyles,
  ElementRole,
} from "./reference-analysis-types";
import type { ReferenceAnalysis } from "./reference-analysis-types";
import {
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  darken,
  lighten,
  colorDistanceCIE76,
} from "../../packages/intake-system/src/theme-extraction/color-utils";

// ── Types ────────────────────────────────────────────────────────────────

export type ThemeTokenRecommendations = ReferenceAnalysis["themeTokenRecommendations"];

export interface TokenProvenance {
  source: "computed" | "derived" | "fallback";
  page?: string;
  selector?: string;
  property?: string;
}

export interface MappedTokens {
  config: DeepPartialThemeConfig;
  provenance: Record<string, TokenProvenance>;
  unmappedColours: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────

function findElement(
  pages: PageComputedStyles[],
  role: ElementRole,
  preferPageType = "home"
): { element: ElementComputedStyles; pageType: string } | null {
  // Try preferred page first
  const preferred = pages.find((p) => p.pageType === preferPageType);
  if (preferred) {
    const el = preferred.elements.find((e) => e.role === role && e.found);
    if (el) return { element: el, pageType: preferred.pageType };
  }
  // Fall back to any page
  for (const page of pages) {
    const el = page.elements.find((e) => e.role === role && e.found);
    if (el) return { element: el, pageType: page.pageType };
  }
  return null;
}

function parseRgbToHex(rgb: string): string | null {
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

function getHexFromStyle(element: ElementComputedStyles, prop: string): string | null {
  const value = element.styles[prop as keyof typeof element.styles];
  if (!value) return null;
  if (value.startsWith("#")) return value.toUpperCase();
  return parseRgbToHex(value);
}

function parseFontFamily(raw: string): string {
  const first = raw.split(",")[0].trim();
  return first.replace(/^["']|["']$/g, "");
}

function parsePx(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.match(/^([\d.]+)px$/);
  return match ? parseFloat(match[1]) : null;
}

function quantizeBorderRadius(px: number): string {
  if (px === 0) return "none";
  if (px <= 4) return "sm";
  if (px <= 8) return "md";
  if (px <= 16) return "lg";
  if (px <= 24) return "xl";
  return "full";
}

function quantizeBoxShadow(raw: string): "none" | "sm" | "md" | "lg" {
  if (!raw || raw === "none") return "none";
  // Heuristic: count offset/blur magnitude
  const numbers = raw.match(/([\d.]+)px/g);
  if (!numbers || numbers.length === 0) return "none";
  const maxBlur = Math.max(...numbers.map((n) => parseFloat(n)));
  if (maxBlur <= 3) return "sm";
  if (maxBlur <= 10) return "md";
  return "lg";
}

function getFrequentColours(pages: PageComputedStyles[], excludeHexes: string[]): string[] {
  const freq = new Map<string, number>();
  for (const page of pages) {
    for (const hex of page.allColours) {
      if (excludeHexes.includes(hex)) continue;
      freq.set(hex, (freq.get(hex) ?? 0) + 1);
    }
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([hex]) => hex);
}

function isNearWhite(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const hsl = rgbToHsl(rgb);
  return hsl.l >= 95;
}

function isNearBlack(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const hsl = rgbToHsl(rgb);
  return hsl.l <= 5;
}

// ── Main Mapper ──────────────────────────────────────────────────────────

export function mapStylesToTokens(styles: ComputedStylesResult): MappedTokens {
  const { pages } = styles;
  const provenance: Record<string, TokenProvenance> = {};
  const config: DeepPartialThemeConfig = {
    colors: { brand: {}, surface: {} },
    typography: { fontFamily: {}, scale: {} },
    components: {},
  };

  // ── Colour Mapping ─────────────────────────────────────────────────

  // 1. surface.background ← body backgroundColor
  const body = findElement(pages, "page-background");
  const bgHex = body ? getHexFromStyle(body.element, "backgroundColor") : null;
  if (bgHex) {
    config.colors!.surface!.background = bgHex;
    provenance["surface.background"] = {
      source: "computed",
      page: body!.pageType,
      selector: body!.element.selector,
      property: "backgroundColor",
    };
  }

  // 2. surface.foreground ← body color
  const fgHex = body ? getHexFromStyle(body.element, "color") : null;
  if (fgHex) {
    config.colors!.surface!.foreground = fgHex;
    provenance["surface.foreground"] = {
      source: "computed",
      page: body!.pageType,
      selector: body!.element.selector,
      property: "color",
    };
  }

  // 3. brand.primary ← primary-button backgroundColor
  const primaryBtn = findElement(pages, "primary-button");
  let primaryHex = primaryBtn ? getHexFromStyle(primaryBtn.element, "backgroundColor") : null;
  const excludeList = [bgHex, fgHex].filter(Boolean) as string[];
  if (!primaryHex || isNearWhite(primaryHex) || isNearBlack(primaryHex)) {
    const frequent = getFrequentColours(pages, excludeList);
    primaryHex = frequent[0] ?? null;
    if (primaryHex) {
      provenance["brand.primary"] = {
        source: "derived",
        property: "most frequent non-bg/fg colour",
      };
    }
  } else {
    provenance["brand.primary"] = {
      source: "computed",
      page: primaryBtn!.pageType,
      selector: primaryBtn!.element.selector,
      property: "backgroundColor",
    };
  }
  if (primaryHex) {
    config.colors!.brand!.primary = primaryHex;
    excludeList.push(primaryHex);
  }

  // 4. brand.primaryHover ← darken primary by 15%
  if (primaryHex) {
    config.colors!.brand!.primaryHover = darken(primaryHex, 15);
    provenance["brand.primaryHover"] = { source: "derived", property: "darken primary 15%" };
  }

  // 5. brand.secondary ← secondary-button backgroundColor
  const secondaryBtn = findElement(pages, "secondary-button");
  let secondaryHex = secondaryBtn ? getHexFromStyle(secondaryBtn.element, "backgroundColor") : null;
  if (!secondaryHex || isNearWhite(secondaryHex) || isNearBlack(secondaryHex)) {
    const frequent = getFrequentColours(pages, excludeList);
    secondaryHex = frequent[0] ?? null;
    if (secondaryHex) {
      provenance["brand.secondary"] = { source: "derived", property: "2nd most frequent colour" };
    }
  } else {
    provenance["brand.secondary"] = {
      source: "computed",
      page: secondaryBtn!.pageType,
      selector: secondaryBtn!.element.selector,
      property: "backgroundColor",
    };
  }
  if (secondaryHex) {
    config.colors!.brand!.secondary = secondaryHex;
    excludeList.push(secondaryHex);
  }

  // 6. brand.accent ← 3rd most frequent distinct colour
  const frequent3 = getFrequentColours(pages, excludeList);
  if (frequent3[0]) {
    config.colors!.brand!.accent = frequent3[0];
    provenance["brand.accent"] = { source: "derived", property: "3rd most frequent colour" };
  }

  // 7. brand.onPrimary ← primary-button color
  if (primaryBtn) {
    const onPrimary = getHexFromStyle(primaryBtn.element, "color");
    if (onPrimary) {
      config.colors!.brand!.onPrimary = onPrimary;
      provenance["brand.onPrimary"] = {
        source: "computed",
        page: primaryBtn.pageType,
        selector: primaryBtn.element.selector,
        property: "color",
      };
    }
  }

  // 8. surface.card ← card backgroundColor
  const card = findElement(pages, "card");
  const cardBg = card ? getHexFromStyle(card.element, "backgroundColor") : null;
  if (cardBg) {
    config.colors!.surface!.card = cardBg;
    provenance["surface.card"] = {
      source: "computed",
      page: card!.pageType,
      selector: card!.element.selector,
      property: "backgroundColor",
    };
  } else if (bgHex) {
    const bgRgb = hexToRgb(bgHex);
    if (bgRgb) {
      const bgHsl = rgbToHsl(bgRgb);
      bgHsl.l = Math.min(100, bgHsl.l + 3);
      config.colors!.surface!.card = rgbToHex(hslToRgb(bgHsl));
      provenance["surface.card"] = { source: "derived", property: "background lightness +3" };
    }
  }

  // 9. surface.muted ← lightest non-white/non-bg background
  const allBgElements = pages.flatMap((p) =>
    p.elements.filter((e) => e.found && e.styles.backgroundColor)
  );
  let lightestNonWhiteBg: string | null = null;
  let lightestL = 0;
  for (const el of allBgElements) {
    const hex = getHexFromStyle(el, "backgroundColor");
    if (!hex || isNearWhite(hex) || hex === bgHex) continue;
    const rgb = hexToRgb(hex);
    if (!rgb) continue;
    const hsl = rgbToHsl(rgb);
    if (hsl.l > lightestL && hsl.l < 95) {
      lightestL = hsl.l;
      lightestNonWhiteBg = hex;
    }
  }
  if (lightestNonWhiteBg) {
    config.colors!.surface!.muted = lightestNonWhiteBg;
    provenance["surface.muted"] = { source: "derived", property: "lightest non-white background" };
  }

  // 10. surface.inverse ← darkest background
  let darkestBg: string | null = null;
  let darkestL = 100;
  for (const el of allBgElements) {
    const hex = getHexFromStyle(el, "backgroundColor");
    if (!hex) continue;
    const rgb = hexToRgb(hex);
    if (!rgb) continue;
    const hsl = rgbToHsl(rgb);
    if (hsl.l < darkestL) {
      darkestL = hsl.l;
      darkestBg = hex;
    }
  }
  if (darkestBg) {
    config.colors!.surface!.inverse = darkestBg;
    provenance["surface.inverse"] = { source: "derived", property: "darkest background" };
  }

  // 11. Derived surface tokens
  if (fgHex) {
    const fgRgb = hexToRgb(fgHex);
    if (fgRgb) {
      const fgHsl = rgbToHsl(fgRgb);
      config.colors!.surface!.secondaryForeground = rgbToHex(
        hslToRgb({ ...fgHsl, l: Math.min(100, fgHsl.l + 10) })
      );
      config.colors!.surface!.tertiaryForeground = rgbToHex(
        hslToRgb({ ...fgHsl, l: Math.min(100, fgHsl.l + 20) })
      );
      config.colors!.surface!.mutedForeground = rgbToHex(
        hslToRgb({ ...fgHsl, l: Math.min(100, fgHsl.l + 35) })
      );
      provenance["surface.secondaryForeground"] = {
        source: "derived",
        property: "foreground +10L",
      };
      provenance["surface.tertiaryForeground"] = { source: "derived", property: "foreground +20L" };
      provenance["surface.mutedForeground"] = { source: "derived", property: "foreground +35L" };
    }
  }

  // ── Typography Mapping ─────────────────────────────────────────────

  const bodyText = findElement(pages, "body-text");
  if (bodyText?.element.styles.fontFamily) {
    const sans = parseFontFamily(bodyText.element.styles.fontFamily);
    config.typography!.fontFamily!.sans = [sans, "system-ui", "sans-serif"];
    provenance["fontFamily.sans"] = {
      source: "computed",
      page: bodyText.pageType,
      selector: bodyText.element.selector,
      property: "fontFamily",
    };
  }

  const heroHeading = findElement(pages, "hero-heading");
  if (heroHeading?.element.styles.fontFamily) {
    const heading = parseFontFamily(heroHeading.element.styles.fontFamily);
    const sans = config.typography!.fontFamily!.sans?.[0];
    if (heading !== sans) {
      config.typography!.fontFamily!.heading = [heading, "system-ui", "sans-serif"];
      provenance["fontFamily.heading"] = {
        source: "computed",
        page: heroHeading.pageType,
        selector: heroHeading.element.selector,
        property: "fontFamily",
      };
    }
  }

  // Scale entries
  const scaleRoles: Array<{ role: ElementRole; key: string }> = [
    { role: "hero-heading", key: "hero" },
    { role: "heading-h1", key: "h1" },
    { role: "heading-h2", key: "h2" },
    { role: "heading-h3", key: "h3" },
    { role: "heading-h4", key: "h4" },
    { role: "body-text", key: "body" },
  ];

  for (const { role, key } of scaleRoles) {
    const found = findElement(pages, role);
    if (!found) continue;
    const { element, pageType } = found;
    const entry: Record<string, string | number> = {};
    if (element.styles.fontSize) entry.size = element.styles.fontSize;
    if (element.styles.lineHeight) entry.lineHeight = element.styles.lineHeight;
    if (element.styles.letterSpacing) entry.letterSpacing = element.styles.letterSpacing;
    if (element.styles.fontWeight) entry.weight = parseInt(element.styles.fontWeight, 10) || 400;
    if (Object.keys(entry).length > 0) {
      (config.typography!.scale as Record<string, unknown>)[key] = entry;
      provenance[`scale.${key}`] = {
        source: "computed",
        page: pageType,
        selector: element.selector,
        property: "fontSize+lineHeight+fontWeight",
      };
    }
  }

  // ── Component Token Mapping ────────────────────────────────────────

  // button
  if (primaryBtn) {
    const el = primaryBtn.element;
    const btnTokens: Record<string, string | number> = {};
    const radiusPx = parsePx(el.styles.borderRadius);
    if (radiusPx !== null) btnTokens.borderRadius = quantizeBorderRadius(radiusPx);
    if (el.styles.paddingLeft) btnTokens.paddingX = el.styles.paddingLeft;
    if (el.styles.paddingTop) btnTokens.paddingY = el.styles.paddingTop;
    if (el.styles.fontWeight) btnTokens.fontWeight = parseInt(el.styles.fontWeight, 10) || 600;
    if (Object.keys(btnTokens).length > 0) {
      config.components!.button = btnTokens as DeepPartialThemeConfig["components"] extends {
        button?: infer B;
      }
        ? B
        : never;
      provenance["button"] = {
        source: "computed",
        page: primaryBtn.pageType,
        selector: el.selector,
        property: "borderRadius+padding",
      };
    }
  }

  // card
  if (card) {
    const el = card.element;
    const cardTokens: Record<string, string> = {};
    const radiusPx = parsePx(el.styles.borderRadius);
    if (radiusPx !== null) cardTokens.borderRadius = quantizeBorderRadius(radiusPx);
    if (el.styles.paddingTop) cardTokens.padding = el.styles.paddingTop;
    if (el.styles.boxShadow) cardTokens.shadow = quantizeBoxShadow(el.styles.boxShadow);
    if (Object.keys(cardTokens).length > 0) {
      config.components!.card = cardTokens as DeepPartialThemeConfig["components"] extends {
        card?: infer C;
      }
        ? C
        : never;
      provenance["card"] = {
        source: "computed",
        page: card.pageType,
        selector: el.selector,
        property: "borderRadius+padding+shadow",
      };
    }
  }

  // navigation.height
  const header = findElement(pages, "header");
  if (header?.element.styles.height) {
    config.components!.navigation = { height: header.element.styles.height };
    provenance["navigation.height"] = {
      source: "computed",
      page: header.pageType,
      selector: header.element.selector,
      property: "height",
    };
  }

  // section.paddingY ← median paddingTop across section elements
  const sectionElements = pages.flatMap((p) =>
    p.elements.filter((e) => e.role === "section" && e.found && e.styles.paddingTop)
  );
  if (sectionElements.length > 0) {
    const pxValues = sectionElements
      .map((e) => parsePx(e.styles.paddingTop))
      .filter((v): v is number => v !== null)
      .sort((a, b) => a - b);
    if (pxValues.length > 0) {
      const median = pxValues[Math.floor(pxValues.length / 2)];
      config.components!.section = { paddingY: `${median}px` };
      provenance["section.paddingY"] = { source: "derived", property: "median section paddingTop" };
    }
  }

  // ── Unmapped Colours ───────────────────────────────────────────────

  const mappedHexes = new Set(
    Object.values(config.colors?.brand ?? {})
      .concat(Object.values(config.colors?.surface ?? {}))
      .filter(Boolean) as string[]
  );
  const allColours = new Set(pages.flatMap((p) => p.allColours));
  const unmappedColours = Array.from(allColours).filter((c) => !mappedHexes.has(c));

  return { config, provenance, unmappedColours };
}

// ── Enhancement Function ─────────────────────────────────────────────────

const CIE76_THRESHOLD = 20;

export function enhanceSynthesisWithComputedValues(
  synthesisTokens: ThemeTokenRecommendations,
  computedTokens: MappedTokens
): ThemeTokenRecommendations {
  const result = JSON.parse(JSON.stringify(synthesisTokens)) as ThemeTokenRecommendations;
  const computed = computedTokens.config;

  // Snap colour tokens: for each synthesis colour, find nearest computed colour within threshold
  const computedColours = new Set<string>();
  if (computed.colors?.brand) {
    for (const v of Object.values(computed.colors.brand)) {
      if (v) computedColours.add(v);
    }
  }
  if (computed.colors?.surface) {
    for (const v of Object.values(computed.colors.surface)) {
      if (v) computedColours.add(v);
    }
  }
  const computedHexList = Array.from(computedColours);

  function snapColour(hex: string): string {
    let best = hex;
    let bestDelta = Infinity;
    for (const candidate of computedHexList) {
      const delta = colorDistanceCIE76(hex, candidate);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = candidate;
      }
    }
    return bestDelta <= CIE76_THRESHOLD ? best : hex;
  }

  // Snap brand colours
  result.brand.primary = snapColour(result.brand.primary);
  result.brand.primaryHover = snapColour(result.brand.primaryHover);
  result.brand.secondary = snapColour(result.brand.secondary);
  result.brand.accent = snapColour(result.brand.accent);

  // Snap surface colours
  result.surface.background = snapColour(result.surface.background);
  result.surface.foreground = snapColour(result.surface.foreground);
  result.surface.muted = snapColour(result.surface.muted);

  // Typography: use computed values directly when available
  if (computed.typography?.fontFamily?.sans) {
    result.typography.fontFamilySans = computed.typography.fontFamily.sans;
  }
  if (computed.typography?.fontFamily?.heading) {
    result.typography.fontFamilyHeading = computed.typography.fontFamily.heading;
  }

  return result;
}

// ── Section color mapping ────────────────────────────────────────────────────

export interface TokenMapping {
  standardMappings: Record<string, string>; // sectionBg → token class
  customProperties: Record<string, string>; // --color-section-N → hex
}

export interface TypographyScale {
  hero?: string;
  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  body?: string;
  small?: string;
  caption?: string;
}

const DELTA_E_THRESHOLD = 5;

export function mapSectionColors(
  sections: import("./computed-style-extractor").SectionComputedStyle[],
  brandPrimary: string,
  brandSecondary: string
): TokenMapping {
  const standardMappings: Record<string, string> = {};
  const customProperties: Record<string, string> = {};

  for (const section of sections) {
    const bg = section.styles.backgroundColor;
    if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") continue;

    const bgHex = bg.startsWith("#") ? bg : null;
    if (!bgHex) continue;

    const sectionKey = `section-${section.index}-${section.tagName}`;

    const deltaPrimary = brandPrimary ? colorDistanceCIE76(bgHex, brandPrimary) : Infinity;
    const deltaSecondary = brandSecondary ? colorDistanceCIE76(bgHex, brandSecondary) : Infinity;

    if (deltaPrimary <= DELTA_E_THRESHOLD) {
      standardMappings[sectionKey] = "bg-brand-primary";
    } else if (deltaSecondary <= DELTA_E_THRESHOLD) {
      standardMappings[sectionKey] = "bg-brand-secondary";
    } else {
      const varName = `--color-section-${section.index}`;
      customProperties[varName] = bgHex;
    }
  }

  return { standardMappings, customProperties };
}

export function extractTypographyScale(
  sections: import("./computed-style-extractor").SectionComputedStyle[]
): TypographyScale {
  // Collect all unique font sizes across sections
  const sizes = new Set<number>();
  for (const section of sections) {
    const fs = section.styles.fontSize;
    if (fs) {
      const px = parseFloat(fs);
      if (!isNaN(px) && px > 0) sizes.add(px);
    }
  }

  // Sort descending
  const sorted = Array.from(sizes).sort((a, b) => b - a);

  // Map to 8-level scale
  const levels: (keyof TypographyScale)[] = [
    "hero",
    "h1",
    "h2",
    "h3",
    "h4",
    "body",
    "small",
    "caption",
  ];

  const scale: TypographyScale = {};
  for (let i = 0; i < Math.min(sorted.length, levels.length); i++) {
    scale[levels[i]] = `${sorted[i]}px`;
  }

  return scale;
}

// ── Convert MappedTokens to ThemeTokenRecommendations ────────────────────

export function computedTokensToRecommendations(
  computedTokens: MappedTokens
): ThemeTokenRecommendations {
  const c = computedTokens.config;
  return {
    brand: {
      primary: c.colors?.brand?.primary ?? "#3B82F6",
      primaryHover: c.colors?.brand?.primaryHover ?? "#2563EB",
      secondary: c.colors?.brand?.secondary ?? "#6B7280",
      accent: c.colors?.brand?.accent ?? "#F59E0B",
    },
    surface: {
      background: c.colors?.surface?.background ?? "#FFFFFF",
      foreground: c.colors?.surface?.foreground ?? "#111827",
      muted: c.colors?.surface?.muted ?? "#F3F4F6",
    },
    typography: {
      fontFamilySans: c.typography?.fontFamily?.sans ?? ["Inter", "system-ui", "sans-serif"],
      fontFamilyHeading: c.typography?.fontFamily?.heading ??
        c.typography?.fontFamily?.sans ?? ["Inter", "system-ui", "sans-serif"],
    },
  };
}
