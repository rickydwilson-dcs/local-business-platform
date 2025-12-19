import { absUrl } from "./site";
import type { LocalBusinessSchemaOptions, ServiceAreaSchemaOptions } from "./schema-types";

/**
 * LEGACY: Original hardcoded Organization schema for Colossus Scaffolding
 * Kept for backward compatibility with existing sites
 * @deprecated Use getLocalBusinessSchema() for new implementations
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": absUrl("/#organization"),
  name: "Colossus Scaffolding",
  legalName: "Colossus Scaffolding Ltd",
  url: absUrl("/"),
  logo: absUrl("/static/logo.png"),
  description:
    "Professional scaffolding specialists serving the South East UK with TG20:21 compliant solutions, CISRS qualified teams, and comprehensive insurance coverage.",
  foundingDate: "2009",
  numberOfEmployees: "10-50",
  email: "info@colossusscaffolding.com",
  telephone: "+441424466661",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office 7, 15-20 Gresley Road",
    addressLocality: "St Leonards On Sea",
    addressRegion: "East Sussex",
    postalCode: "TN38 9PL",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "50.8549",
    longitude: "0.5736",
  },
  areaServed: [
    { "@type": "Place", name: "East Sussex" },
    { "@type": "Place", name: "West Sussex" },
    { "@type": "Place", name: "Kent" },
    { "@type": "Place", name: "Surrey" },
    { "@type": "Place", name: "Essex" },
    { "@type": "Place", name: "London" },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "CHAS Accreditation",
      description: "Health and safety assessment scheme approved contractor",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "CISRS Qualified Teams",
      description: "Construction Industry Scaffolders Record Scheme certified scaffolders",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "compliance",
      name: "TG20:21 Compliance",
      description: "Latest technical guidance for scaffold design and installation compliance",
    },
  ],
  slogan: "Safe, compliant and fully insured scaffolding specialists serving the South East UK",
  knowsAbout: [
    "Access Scaffolding",
    "Facade Scaffolding",
    "Industrial Scaffolding",
    "Edge Protection",
    "Scaffold Design",
    "TG20:21 Compliance",
    "Scaffold Inspections",
    "Temporary Roof Systems",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Scaffolding Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Access Scaffolding",
          description: "Professional access scaffolding for residential and commercial projects",
          url: absUrl("/services/access-scaffolding"),
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Facade Scaffolding",
          description: "Specialist facade scaffolding for building maintenance and renovation",
          url: absUrl("/services/facade-scaffolding"),
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Edge Protection",
          description: "HSE compliant edge protection systems for construction sites",
          url: absUrl("/services/edge-protection"),
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Temporary Roof Systems",
          description: "Weather protection and temporary roofing solutions",
          url: absUrl("/services/temporary-roof-systems"),
        },
      },
    ],
  },
  sameAs: [
    "https://www.facebook.com/colossusscaffolding",
    "https://www.linkedin.com/company/colossus-scaffolding",
  ],
});

/**
 * LEGACY: WebSite schema for Colossus Scaffolding
 * Kept for backward compatibility
 * @deprecated Consider making this configurable in the future
 */
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": absUrl("/#website"),
  name: "Colossus Scaffolding",
  url: absUrl("/"),
  description:
    "Professional scaffolding services across South East England with TG20:21 compliance and CISRS qualified teams.",
  publisher: {
    "@id": absUrl("/#organization"),
  },
  inLanguage: "en-GB",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: absUrl("/?s={search_term_string}"),
    },
    "query-input": "required name=search_term_string",
  },
});

/**
 * Generate Breadcrumb List schema
 * Universal utility - works for all sites
 */
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absUrl(item.url),
  })),
});

/**
 * Generate FAQ Page schema
 * Universal utility - works for all sites
 */
export const getFAQSchema = (
  faqs: Array<{ question: string; answer: string }>,
  pageUrl: string
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": absUrl(`${pageUrl}#faq`),
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

/**
 * NEW: Configurable LocalBusiness schema factory
 *
 * Creates a comprehensive LocalBusiness schema with all standard fields.
 * Use this for new site implementations instead of hardcoded schemas.
 *
 * @example
 * ```ts
 * const schema = getLocalBusinessSchema({
 *   businessType: 'HomeAndConstructionBusiness',
 *   config: {
 *     name: 'Acme Plumbing',
 *     description: 'Professional plumbing services',
 *     email: 'info@acme.com',
 *     telephone: '+1234567890',
 *     address: { ... },
 *     geo: { latitude: '51.5074', longitude: '-0.1278' },
 *     openingHours: [
 *       { dayOfWeek: ['Monday', 'Tuesday'], opens: '09:00', closes: '17:00' }
 *     ],
 *     areaServed: ['London', 'Surrey'],
 *   }
 * });
 * ```
 */
export const getLocalBusinessSchema = (options: LocalBusinessSchemaOptions) => {
  const { businessType, config } = options;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": businessType,
    "@id": absUrl("/#organization"),
    name: config.name,
    url: absUrl("/"),
    description: config.description,
    email: config.email,
    telephone: config.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: config.address.streetAddress,
      addressLocality: config.address.addressLocality,
      addressRegion: config.address.addressRegion,
      postalCode: config.address.postalCode,
      addressCountry: config.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    },
    areaServed: config.areaServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
  };

  // Add optional fields only if provided
  if (config.legalName) {
    schema.legalName = config.legalName;
  }

  if (config.slogan) {
    schema.slogan = config.slogan;
  }

  if (config.foundingDate) {
    schema.foundingDate = config.foundingDate;
  }

  if (config.numberOfEmployees) {
    schema.numberOfEmployees = config.numberOfEmployees;
  }

  if (config.priceRange) {
    schema.priceRange = config.priceRange;
  }

  // Opening hours specification
  if (config.openingHours && config.openingHours.length > 0) {
    schema.openingHoursSpecification = config.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    }));
  }

  // Credentials and certifications
  if (config.credentials && config.credentials.length > 0) {
    schema.hasCredential = config.credentials.map((cred) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: cred.category,
      name: cred.name,
      description: cred.description,
    }));
  }

  // Social media profiles
  if (config.socialProfiles && config.socialProfiles.length > 0) {
    schema.sameAs = config.socialProfiles;
  }

  // Aggregate rating
  if (config.aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: config.aggregateRating.ratingValue,
      bestRating: "5",
      ratingCount: config.aggregateRating.ratingCount,
    };
  }

  // Knowledge topics
  if (config.knowsAbout && config.knowsAbout.length > 0) {
    schema.knowsAbout = config.knowsAbout;
  }

  // Offer catalog
  if (config.offerCatalog && config.offerCatalog.length > 0) {
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: config.offerCatalog.map((offer) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: offer.name,
          description: offer.description,
          url: absUrl(offer.url),
        },
      })),
    };
  }

  return schema;
};

/**
 * NEW: Service Area schema for location-specific pages
 *
 * Creates schema for location/service area pages that reference the parent business.
 * Useful for multi-location businesses or service areas.
 *
 * @example
 * ```ts
 * const schema = getServiceAreaSchema({
 *   locationName: 'Brighton',
 *   parentBusinessId: absUrl('/#organization'),
 *   areaServed: ['Brighton', 'Hove', 'Worthing'],
 *   services: ['Plumbing', 'Heating', 'Boiler Installation']
 * });
 * ```
 */
export const getServiceAreaSchema = (options: ServiceAreaSchemaOptions) => {
  const { locationName, parentBusinessId, areaServed, services } = options;

  // Generate slug from location name
  const locationSlug = locationName.toLowerCase().replace(/\s+/g, "-");

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absUrl(`/locations/${locationSlug}#localbusiness`),
    name: `${locationName} Service Area`,
    areaServed: areaServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    parentOrganization: {
      "@id": parentBusinessId,
    },
  };

  // Add services if provided
  if (services && services.length > 0) {
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: `${locationName} Services`,
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service,
        },
      })),
    };
  }

  return schema;
};
