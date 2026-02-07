// MDX-driven location data utilities
// Replaces hardcoded town-locations.ts and locations-dropdown.ts
// All location data is now sourced from content/locations/*.mdx frontmatter

import { getContentItems } from "./content";

// Types for map markers
export interface TownLocation {
  name: string;
  slug: string;
  coords: [number, number];
  county: string;
  url: string;
  description: string;
}

// Types for navigation dropdown and county cards
export interface CountyInfo {
  name: string;
  slug: string;
  href: string;
  description: string;
  highlights: string[];
  towns: {
    name: string;
    slug: string;
    href: string;
  }[];
}

// Map display configuration
export const MAP_CENTER: [number, number] = [51.0, 0.5];
export const MAP_ZOOM = 9;

// County page slugs — used to distinguish county vs town pages
const COUNTY_PAGE_SLUGS = ["east-sussex", "west-sussex", "kent", "surrey"];

// Build-time cache
let cachedTowns: TownLocation[] | null = null;
let cachedCounties: CountyInfo[] | null = null;

/**
 * Get all town locations from MDX frontmatter.
 * Returns only town pages (excludes county overview pages).
 * Used by CoverageMap for map markers.
 */
export async function getAllTownLocations(): Promise<TownLocation[]> {
  if (cachedTowns) return cachedTowns;

  const locations = await getContentItems("locations");

  cachedTowns = locations
    .filter(
      (loc) =>
        loc.county &&
        loc.coords &&
        Array.isArray(loc.coords) &&
        !COUNTY_PAGE_SLUGS.includes(loc.slug)
    )
    .map((loc) => ({
      name: loc.title,
      slug: loc.slug,
      coords: loc.coords as [number, number],
      county: loc.county as string,
      url: `/locations/${loc.slug}`,
      description: (loc.mapDescription as string) || loc.description || "",
    }));

  return cachedTowns;
}

/**
 * Get all counties with their towns, descriptions, and highlights.
 * Builds the county hierarchy from MDX frontmatter.
 * Used by navigation dropdown, CountyGatewayCards, TownFinderSection.
 */
export async function getAllCounties(): Promise<CountyInfo[]> {
  if (cachedCounties) return cachedCounties;

  const locations = await getContentItems("locations");
  const allTowns = await getAllTownLocations();

  const counties: CountyInfo[] = [];

  for (const countySlug of COUNTY_PAGE_SLUGS) {
    const countyData = locations.find((loc) => loc.slug === countySlug);
    if (!countyData) continue;

    const countyName = (countyData.county as string) || countyData.title;

    // Get towns belonging to this county
    const countyTowns = allTowns
      .filter((t) => t.county === countyName)
      .map((t) => ({
        name: t.name,
        slug: t.slug,
        href: t.url,
      }));

    // Special case: Hove redirects to Brighton (part of Brighton & Hove)
    if (countySlug === "east-sussex") {
      countyTowns.push({
        name: "Hove",
        slug: "hove",
        href: "/locations/brighton",
      });
    }

    counties.push({
      name: countyData.title,
      slug: countyData.slug,
      href: `/locations/${countyData.slug}`,
      description: (countyData.countyDescription as string) || countyData.description || "",
      highlights: (countyData.countyHighlights as string[]) || [],
      towns: countyTowns,
    });
  }

  cachedCounties = counties;
  return counties;
}

/**
 * Get a single county by slug.
 */
export async function getCountyBySlug(slug: string): Promise<CountyInfo | undefined> {
  const counties = await getAllCounties();
  return counties.find((c) => c.slug === slug);
}
