/**
 * Location-specific service utilities
 *
 * Handles detection and context extraction for location-specific services
 * (e.g., commercial-scaffolding-brighton, residential-scaffolding-canterbury)
 *
 * This module is generic and does not hardcode any location data. Callers must
 * provide known location slugs and area maps from their own content or config.
 */

export interface LocationContext {
  isLocationSpecific: boolean;
  location: string;
  locationName: string;
  locationSlug: string;
}

/**
 * Extracts location context from a service slug by matching against known locations.
 *
 * @param slug - Service slug (e.g., "commercial-scaffolding-brighton")
 * @param knownLocations - Array of known location slugs (e.g., ["brighton", "canterbury", "hastings"])
 * @returns LocationContext or null if not location-specific
 *
 * @example
 * deriveLocationContext("commercial-scaffolding-brighton", ["brighton", "canterbury"])
 * // Returns: { isLocationSpecific: true, location: "brighton", locationName: "Brighton", locationSlug: "brighton" }
 *
 * @example
 * deriveLocationContext("access-scaffolding", ["brighton", "canterbury"])
 * // Returns: null
 */
export function deriveLocationContext(
  slug: string,
  knownLocations?: string[]
): LocationContext | null {
  if (!knownLocations || knownLocations.length === 0) {
    return null;
  }

  for (const loc of knownLocations) {
    if (slug.endsWith(`-${loc}`)) {
      const locationName = loc.charAt(0).toUpperCase() + loc.slice(1);
      return {
        isLocationSpecific: true,
        location: loc,
        locationName,
        locationSlug: loc,
      };
    }
  }

  return null;
}

/**
 * Checks if a slug represents a location-specific service
 *
 * @param slug - Service slug
 * @param knownLocations - Array of known location slugs
 * @returns true if location-specific, false otherwise
 */
export function isLocationSpecificService(slug: string, knownLocations?: string[]): boolean {
  return deriveLocationContext(slug, knownLocations) !== null;
}

/**
 * Gets area served list for schema.org markup based on location
 *
 * @param location - Location slug (e.g., "brighton")
 * @param areaMap - Optional mapping of location slugs to area name arrays
 * @param defaultAreas - Optional default areas when location is not in areaMap
 * @returns Array of area names served
 *
 * @example
 * const areas = { brighton: ["Brighton", "Hove"], canterbury: ["Canterbury", "Whitstable"] };
 * getAreaServed("brighton", areas)
 * // Returns: ["Brighton", "Hove"]
 *
 * @example
 * getAreaServed("unknown", areas, ["East Sussex"])
 * // Returns: ["East Sussex"]
 *
 * @example
 * getAreaServed("unknown")
 * // Returns: ["Unknown"]
 */
export function getAreaServed(
  location: string,
  areaMap?: Record<string, string[]>,
  defaultAreas: string[] = []
): string[] {
  if (areaMap && areaMap[location]) {
    return areaMap[location];
  }

  if (defaultAreas.length > 0) {
    return defaultAreas;
  }

  // Fallback: capitalize the location name
  return location ? [location.charAt(0).toUpperCase() + location.slice(1)] : [];
}
