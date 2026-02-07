/**
 * Locations Dropdown - Stub for smiths-electrical-cambridge
 *
 * Provides type-compatible exports required by shared components
 * (MobileMenu, LocationsDropdown, TownFinderSection, CountyGatewayCards).
 *
 * Customize with your business's actual location data if you use these components.
 */

export interface LocationItem {
  name: string;
  slug: string;
  county: string;
  isRichContent?: boolean;
}

export interface County {
  name: string;
  slug: string;
  towns: LocationItem[];
}

export const LOCATIONS_DROPDOWN: County[] = [];

export function getAllCounties(): County[] {
  return LOCATIONS_DROPDOWN;
}

export function getCountyBySlug(slug: string): County | undefined {
  return LOCATIONS_DROPDOWN.find((c) => c.slug === slug);
}

export function getAllRichTownPages(): LocationItem[] {
  return [];
}

export function getTownsByCounty(countySlug: string): LocationItem[] {
  const county = getCountyBySlug(countySlug);
  return county?.towns ?? [];
}

export function getAllLocations(): LocationItem[] {
  return LOCATIONS_DROPDOWN.flatMap((c) => c.towns);
}
