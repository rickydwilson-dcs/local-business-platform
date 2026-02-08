/**
 * Type definitions for configurable schema generation
 * Allows reuse of schema utilities across different business sites
 */

export interface BusinessConfig {
  /** Business name (e.g., "Acme Services") */
  name: string;

  /** Legal business name (e.g., "Acme Services Ltd") */
  legalName?: string;

  /** Business description for SEO and schema markup */
  description: string;

  /** Business slogan or tagline */
  slogan?: string;

  /** Business founding date (ISO 8601 format: YYYY or YYYY-MM-DD) */
  foundingDate?: string;

  /** Employee count (e.g., "10-50", "50-100", "100+") */
  numberOfEmployees?: string;

  /** Price range indicator (e.g., "$$", "$$$") */
  priceRange?: string;

  /** Contact email address */
  email: string;

  /** Contact phone number (with country code, e.g., "+441424466661") */
  telephone: string;

  /** Physical business address */
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };

  /** Geographic coordinates for location-based services */
  geo: {
    latitude: string;
    longitude: string;
  };

  /** Opening hours specification */
  openingHours: Array<{
    /** Days of week this schedule applies to */
    dayOfWeek: string[];
    /** Opening time (e.g., "09:00") */
    opens: string;
    /** Closing time (e.g., "17:00") */
    closes: string;
  }>;

  /** Areas served by the business (cities, regions, countries) */
  areaServed: string[];

  /** Professional credentials, certifications, and memberships */
  credentials?: Array<{
    name: string;
    description: string;
    category: "certification" | "compliance" | "membership";
  }>;

  /** Social media profile URLs */
  socialProfiles?: string[];

  /** Aggregate rating information */
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };

  /** Topics and services the business is knowledgeable about */
  knowsAbout?: string[];

  /** Service/product catalog for schema markup */
  offerCatalog?: Array<{
    name: string;
    description: string;
    url: string;
  }>;
}

export interface LocalBusinessSchemaOptions {
  /**
   * Type of business for schema.org @type
   * Common types:
   * - LocalBusiness: Generic local business
   * - HomeAndConstructionBusiness: Construction, renovation, scaffolding
   * - ProfessionalService: Consulting, legal, accounting
   * - Plumber: Plumbing services
   * - Electrician: Electrical services
   * - RoofingContractor: Roofing services
   */
  businessType:
    | "LocalBusiness"
    | "HomeAndConstructionBusiness"
    | "ProfessionalService"
    | "Plumber"
    | "Electrician"
    | "RoofingContractor";

  /** Business configuration data */
  config: BusinessConfig;
}

export interface ServiceAreaSchemaOptions {
  /** Name of the location/area being served */
  locationName: string;

  /** Reference to parent business @id (e.g., "https://example.com/#organization") */
  parentBusinessId: string;

  /** Specific cities/areas served from this location */
  areaServed: string[];

  /** Services offered in this location */
  services?: string[];
}
