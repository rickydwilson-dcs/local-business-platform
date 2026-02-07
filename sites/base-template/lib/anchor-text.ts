/**
 * Anchor Text - Stub for base-template
 *
 * Provides type-compatible exports required by shared components
 * (Footer, MobileMenu, LocationsDropdown).
 *
 * Customize with your business's SEO anchor text patterns if needed.
 */

export type AnchorVariationType = 'exact' | 'partial' | 'semantic' | 'generic';

export function getServiceAnchorText(serviceName: string): string {
  return serviceName;
}

export function getLocationAnchorText(locationName: string): string {
  return locationName;
}

export function getCountyAnchorText(countyName: string): string {
  return countyName;
}

export function getTownAnchorText(townName: string): string {
  return townName;
}
