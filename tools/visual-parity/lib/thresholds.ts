/**
 * Visual parity thresholds. Defended in the Colossus migration synthesis:
 * tight enough to catch DJ Fox-class drift (missing sections, placeholder
 * forms, invisible text), loose enough to tolerate anti-aliasing noise.
 */

export type Viewport = "desktop" | "tablet" | "mobile";

export const VIEWPORTS: Record<Viewport, { width: number; height: number }> = {
  desktop: { width: 1440, height: 1800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

export const PER_PAGE_THRESHOLD = 0.018;
export const CRITICAL_TEMPLATE_THRESHOLD = 0.012;
export const SUITE_MEAN_THRESHOLD = 0.0075;
export const WARN_THRESHOLD = 0.012;

export const CRITICAL_PAGE_TYPES = new Set<string>([
  "home",
  "locations",
  "county-detail",
  "location-detail",
  "service-location-detail",
]);

export const SEMANTIC_TOLERANCES = {
  imageCount: 1,
  linkCountRatio: 0.1,
};

export function thresholdFor(pageType: string): number {
  return CRITICAL_PAGE_TYPES.has(pageType) ? CRITICAL_TEMPLATE_THRESHOLD : PER_PAGE_THRESHOLD;
}

export type Verdict = "PASS" | "WARN" | "FAIL";

export function verdictFor(diffPercent: number, pageType: string): Verdict {
  const hard = thresholdFor(pageType);
  if (diffPercent > hard) return "FAIL";
  if (diffPercent > WARN_THRESHOLD) return "WARN";
  return "PASS";
}
