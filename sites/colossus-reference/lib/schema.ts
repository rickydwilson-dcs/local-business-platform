import { absUrl } from "./site";
import { colossusBusinessConfig, businessType } from "./business-config";

/**
 * Generate LocalBusiness schema using the configured business type
 * The business type is configured in business-config.ts and can vary per site
 */
export const getLocalBusinessSchema = () => {
  const config = colossusBusinessConfig;

  // Build base schema with required fields
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": businessType,
    "@id": absUrl("/#organization"),
    name: config.name,
    url: absUrl("/"),
    logo: absUrl("/static/logo.png"),
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
    schema.hasCredential = config.credentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: credential.category,
      name: credential.name,
      description: credential.description,
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
      itemListElement: config.offerCatalog.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          url: absUrl(service.url),
        },
      })),
    };
  }

  return schema;
};

/**
 * Backward compatibility: Export as getOrganizationSchema
 * This ensures existing code continues to work while we transition
 */
export const getOrganizationSchema = getLocalBusinessSchema;

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
 * Generate ServiceArea schema for location pages
 * Links the location to the parent organization
 */
export const getServiceAreaSchema = (locationName: string, locationSlug: string) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": absUrl(`/locations/${locationSlug}#localbusiness`),
  name: `Colossus Scaffolding - ${locationName}`,
  areaServed: [
    {
      "@type": "City",
      name: locationName,
    },
  ],
  parentOrganization: {
    "@id": absUrl("/#organization"),
  },
});
