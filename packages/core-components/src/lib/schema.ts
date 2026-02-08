import { absUrl } from "./site";
import type { LocalBusinessSchemaOptions, ServiceAreaSchemaOptions } from "./schema-types";

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
