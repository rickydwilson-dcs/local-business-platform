/**
 * Location-specific service utilities
 *
 * Handles detection and context extraction for location-specific services
 * (e.g., commercial-scaffolding-brighton, residential-scaffolding-canterbury)
 */

export interface LocationContext {
  isLocationSpecific: boolean;
  location: string;
  locationName: string;
  locationSlug: string;
}

const LOCATION_PATTERNS = ["-brighton", "-canterbury", "-hastings"] as const;

/**
 * Extracts location context from a service slug
 *
 * @param slug - Service slug (e.g., "commercial-scaffolding-brighton")
 * @returns LocationContext or null if not location-specific
 *
 * @example
 * deriveLocationContext("commercial-scaffolding-brighton")
 * // Returns: { isLocationSpecific: true, location: "brighton", locationName: "Brighton", locationSlug: "brighton" }
 *
 * deriveLocationContext("access-scaffolding")
 * // Returns: null
 */
export function deriveLocationContext(slug: string): LocationContext | null {
  const matchedPattern = LOCATION_PATTERNS.find((pattern) => slug.includes(pattern));

  if (!matchedPattern) {
    return null;
  }

  const location = matchedPattern.replace("-", "");
  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  return {
    isLocationSpecific: true,
    location,
    locationName,
    locationSlug: location,
  };
}

/**
 * Checks if a slug represents a location-specific service
 *
 * @param slug - Service slug
 * @returns true if location-specific, false otherwise
 */
export function isLocationSpecificService(slug: string): boolean {
  return LOCATION_PATTERNS.some((pattern) => slug.includes(pattern));
}

/**
 * Gets area served list for schema.org markup based on location
 *
 * @param location - Location name (e.g., "brighton")
 * @returns Array of areas served
 */
export function getAreaServed(location: string): string[] {
  const areaMap: Record<string, string[]> = {
    brighton: [
      "Brighton",
      "Brighton & Hove",
      "Hove",
      "The Lanes",
      "Kemptown",
      "Churchill Square",
      "Brighton Marina",
      "North Laine",
      "Preston Park",
      "Fiveways",
    ],
    canterbury: [
      "Canterbury",
      "Canterbury City Centre",
      "World Heritage Site Canterbury",
      "University of Kent",
      "Canterbury Cathedral Precinct",
      "Whitstable",
      "Herne Bay",
      "Faversham",
    ],
    hastings: [
      "Hastings",
      "Old Town Hastings",
      "St Leonards",
      "East Hill",
      "West Hill",
      "Ore",
      "Hollington",
      "Silverhill",
    ],
  };

  return areaMap[location] || ["East Sussex", "West Sussex", "Kent", "Surrey"];
}
