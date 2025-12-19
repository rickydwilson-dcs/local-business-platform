/**
 * Anchor text variation utilities to avoid SEO over-optimization
 *
 * Provides deterministic anchor text variation for internal links
 * based on index position and content type.
 *
 * Target distribution:
 * - Exact match (40%): "Access Scaffolding"
 * - Partial match (30%): "Learn about access scaffolding"
 * - Semantic match (20%): "Safe working platforms"
 * - Generic (10%): "View this service"
 */

export type AnchorVariationType = "exact" | "partial" | "semantic" | "generic";

// Service-specific semantic alternatives (maintains SEO value)
const SERVICE_SEMANTIC_MAP: Record<string, string> = {
  "access-scaffolding": "Safe working platforms",
  "residential-scaffolding": "Home scaffolding solutions",
  "commercial-scaffolding": "Business scaffolding services",
  "industrial-scaffolding": "Heavy-duty access systems",
  "facade-scaffolding": "Building exterior access",
  "edge-protection": "Fall prevention systems",
  "temporary-roof-systems": "Weather protection solutions",
  "birdcage-scaffolds": "Independent access structures",
  "scaffold-towers-mast-systems": "Mobile access towers",
  "scaffolding-inspections-maintenance": "Safety inspection services",
  "crash-decks-crane-decks": "Protective deck systems",
  "heavy-duty-industrial-scaffolding": "Large-scale access systems",
  "pavement-gantries-loading-bays": "Pedestrian protection systems",
  "public-access-staircases": "Safe stairway solutions",
  "scaffold-alarms": "Site security systems",
  "scaffolding-design-drawings": "Technical design services",
  "sheeting-netting-encapsulation": "Site protection systems",
  "staircase-towers": "Vertical access solutions",
  "suspended-scaffolding": "Hanging platform systems",
};

// Location-specific semantic alternatives
const LOCATION_SEMANTIC_MAP: Record<string, string> = {
  "east-sussex": "South East coverage",
  "west-sussex": "Sussex scaffolding",
  kent: "Kent area services",
  surrey: "Surrey coverage area",
  brighton: "Coastal city services",
  hastings: "Seaside town coverage",
  eastbourne: "South coast services",
  canterbury: "Historic city coverage",
  maidstone: "County town services",
  crawley: "Gatwick area coverage",
  guildford: "Surrey town services",
  worthing: "Coastal town coverage",
};

// Generic phrases for services
const SERVICE_GENERIC_PHRASES = [
  "View this service",
  "Learn more",
  "Explore options",
  "See details",
];

// Generic phrases for locations
const LOCATION_GENERIC_PHRASES = ["View area", "See coverage", "Explore services", "Learn more"];

/**
 * Determines which variation type to use based on index position
 * First items get exact match, later items get more variation
 */
function getVariationType(index: number, totalItems: number): AnchorVariationType {
  // First 40% get exact match (most visible, highest SEO value)
  const exactThreshold = Math.ceil(totalItems * 0.4);
  // Next 30% get partial match
  const partialThreshold = Math.ceil(totalItems * 0.7);
  // Next 20% get semantic match
  const semanticThreshold = Math.ceil(totalItems * 0.9);
  // Last 10% get generic

  if (index < exactThreshold) return "exact";
  if (index < partialThreshold) return "partial";
  if (index < semanticThreshold) return "semantic";
  return "generic";
}

/**
 * Generate anchor text for a service link
 */
export function getServiceAnchorText(
  title: string,
  slug: string,
  index: number,
  totalItems: number
): string {
  const variationType = getVariationType(index, totalItems);
  const cleanTitle = title.replace(" Services", "").replace(" Service", "");

  switch (variationType) {
    case "exact":
      return cleanTitle;
    case "partial":
      return `Learn about ${cleanTitle.toLowerCase()}`;
    case "semantic":
      return SERVICE_SEMANTIC_MAP[slug] || `${cleanTitle} solutions`;
    case "generic":
      return SERVICE_GENERIC_PHRASES[index % SERVICE_GENERIC_PHRASES.length];
  }
}

/**
 * Generate anchor text for a location link
 */
export function getLocationAnchorText(
  title: string,
  slug: string,
  index: number,
  totalItems: number
): string {
  const variationType = getVariationType(index, totalItems);

  switch (variationType) {
    case "exact":
      return title;
    case "partial":
      return `Scaffolding in ${title}`;
    case "semantic":
      return LOCATION_SEMANTIC_MAP[slug] || `${title} area`;
    case "generic":
      return LOCATION_GENERIC_PHRASES[index % LOCATION_GENERIC_PHRASES.length];
  }
}

/**
 * Generate anchor text for county links (more important, keep mostly exact)
 */
export function getCountyAnchorText(
  name: string,
  slug: string,
  index: number,
  totalCounties: number
): string {
  // Counties are important - 60% exact, 40% partial
  if (index < Math.ceil(totalCounties * 0.6)) {
    return name;
  }
  return LOCATION_SEMANTIC_MAP[slug] || `${name} coverage`;
}

/**
 * Generate anchor text for town links
 */
export function getTownAnchorText(
  name: string,
  slug: string,
  countyIndex: number,
  townIndex: number
): string {
  // Alternate pattern based on position
  const pattern = (countyIndex + townIndex) % 4;

  switch (pattern) {
    case 0:
      return name; // Exact
    case 1:
      return `${name} scaffolding`; // Partial
    case 2:
      return LOCATION_SEMANTIC_MAP[slug] || name; // Semantic or exact
    case 3:
      return `Services in ${name}`; // Partial variant
    default:
      return name;
  }
}
