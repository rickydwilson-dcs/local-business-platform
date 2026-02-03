/**
 * Schema.org JSON-LD Generators
 * ==============================
 *
 * Functions for generating Schema.org structured data markup.
 * These help search engines understand your content and can enable
 * rich search results (knowledge panels, FAQs, breadcrumbs, etc.).
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/advanced/structured-data
 */

import { absUrl } from './site';
import { businessConfig, businessType } from './business-config';

// ============================================================================
// ORGANIZATION & BUSINESS SCHEMAS
// ============================================================================

/**
 * Generate LocalBusiness schema for the homepage
 *
 * This is the main organization schema that links all other schemas together.
 * The @id value (/#organization) is referenced by other schemas.
 *
 * @returns LocalBusiness schema object
 *
 * @example
 * // In layout.tsx or homepage
 * <script type="application/ld+json">
 *   {JSON.stringify(getLocalBusinessSchema())}
 * </script>
 */
export const getLocalBusinessSchema = () => {
  const config = businessConfig;

  // Build base schema with required fields
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': businessType,
    '@id': absUrl('/#organization'),
    name: config.name,
    url: absUrl('/'),
    logo: absUrl('/static/logo.png'),
    description: config.description,
    email: config.email,
    telephone: config.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.address.streetAddress,
      addressLocality: config.address.addressLocality,
      addressRegion: config.address.addressRegion,
      postalCode: config.address.postalCode,
      addressCountry: config.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    },
    areaServed: config.areaServed.map((area) => ({
      '@type': 'Place',
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
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes,
    }));
  }

  // Credentials and certifications
  if (config.credentials && config.credentials.length > 0) {
    schema.hasCredential = config.credentials.map((credential) => ({
      '@type': 'EducationalOccupationalCredential',
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
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      bestRating: '5',
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
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: config.offerCatalog.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
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
 * Backward compatibility alias
 * @deprecated Use getLocalBusinessSchema instead
 */
export const getOrganizationSchema = getLocalBusinessSchema;

// ============================================================================
// WEBSITE SCHEMA
// ============================================================================

/**
 * Generate WebSite schema
 *
 * Enables sitelinks search box in Google results.
 *
 * @returns WebSite schema object
 */
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absUrl('/#website'),
  name: businessConfig.name,
  url: absUrl('/'),
  description: businessConfig.description,
  publisher: {
    '@id': absUrl('/#organization'),
  },
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: absUrl('/?s={search_term_string}'),
    },
    'query-input': 'required name=search_term_string',
  },
});

// ============================================================================
// BREADCRUMB SCHEMA
// ============================================================================

/**
 * Generate BreadcrumbList schema
 *
 * Enables breadcrumb navigation in search results.
 *
 * @param items - Array of breadcrumb items with name and url
 * @returns BreadcrumbList schema object
 *
 * @example
 * getBreadcrumbSchema([
 *   { name: 'Home', url: '/' },
 *   { name: 'Services', url: '/services' },
 *   { name: 'Plumbing', url: '/services/plumbing' },
 * ]);
 */
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absUrl(item.url),
  })),
});

// ============================================================================
// FAQ SCHEMA
// ============================================================================

/**
 * Generate FAQPage schema
 *
 * Enables FAQ rich results in Google search.
 *
 * @param faqs - Array of FAQ objects with question and answer
 * @param pageUrl - URL of the page containing the FAQs
 * @returns FAQPage schema object
 *
 * @example
 * getFAQSchema([
 *   { question: 'How much does it cost?', answer: 'Prices start from...' },
 *   { question: 'How long does it take?', answer: 'Most jobs take...' },
 * ], '/services/plumbing');
 */
export const getFAQSchema = (
  faqs: Array<{ question: string; answer: string }>,
  pageUrl: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': absUrl(`${pageUrl}#faq`),
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// ============================================================================
// SERVICE AREA SCHEMA
// ============================================================================

/**
 * Generate LocalBusiness schema for location pages
 *
 * Links the location to the parent organization for better
 * Google Local Pack visibility.
 *
 * @param locationName - Display name of the location (e.g., "Brighton")
 * @param locationSlug - URL slug of the location (e.g., "brighton")
 * @returns LocalBusiness schema object for the location
 *
 * @example
 * getServiceAreaSchema('Brighton', 'brighton');
 */
export const getServiceAreaSchema = (locationName: string, locationSlug: string) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': absUrl(`/locations/${locationSlug}#localbusiness`),
  name: `${businessConfig.name} - ${locationName}`,
  telephone: businessConfig.telephone,
  priceRange: businessConfig.priceRange,
  areaServed: [
    {
      '@type': 'City',
      name: locationName,
    },
  ],
  parentOrganization: {
    '@id': absUrl('/#organization'),
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement:
      businessConfig.offerCatalog?.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: absUrl(service.url),
        },
      })) || [],
  },
});

// ============================================================================
// ARTICLE SCHEMA
// ============================================================================

/**
 * Article schema options
 */
export interface ArticleSchemaOptions {
  /** Article type - BlogPosting for blog posts, Article for general articles */
  type: 'BlogPosting' | 'Article';
  /** Page URL path */
  url: string;
  /** Article title/headline */
  headline: string;
  /** Article description/excerpt */
  description: string;
  /** Hero image URL */
  image?: string;
  /** Publication date (ISO 8601) */
  datePublished: string;
  /** Last modification date (ISO 8601) */
  dateModified?: string;
  /** Author information */
  author: {
    name: string;
    jobTitle?: string;
  };
}

/**
 * Generate Article/BlogPosting schema
 *
 * Enables article rich results and proper attribution.
 *
 * @param options - Article schema options
 * @returns Article schema object
 *
 * @example
 * getArticleSchema({
 *   type: 'BlogPosting',
 *   url: '/blog/my-article',
 *   headline: 'My Article Title',
 *   description: 'Article excerpt...',
 *   datePublished: '2024-01-15',
 *   author: { name: 'John Smith', jobTitle: 'Senior Writer' },
 * });
 */
export const getArticleSchema = (options: ArticleSchemaOptions) => ({
  '@context': 'https://schema.org',
  '@type': options.type,
  '@id': absUrl(`${options.url}#article`),
  headline: options.headline,
  description: options.description,
  ...(options.image && { image: options.image }),
  datePublished: options.datePublished,
  dateModified: options.dateModified || options.datePublished,
  author: {
    '@type': 'Person',
    name: options.author.name,
    ...(options.author.jobTitle && { jobTitle: options.author.jobTitle }),
  },
  publisher: {
    '@type': 'Organization',
    '@id': absUrl('/#organization'),
    name: businessConfig.name,
    logo: {
      '@type': 'ImageObject',
      url: absUrl('/static/logo.png'),
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': absUrl(options.url),
  },
});

// ============================================================================
// AGGREGATE RATING SCHEMA
// ============================================================================

/**
 * Aggregate rating options
 */
export interface AggregateRatingOptions {
  /** Average rating value */
  ratingValue: number;
  /** Total number of ratings/reviews */
  ratingCount: number;
  /** Page URL for the @id */
  pageUrl?: string;
}

/**
 * Generate AggregateRating schema
 *
 * Shows star ratings in search results.
 *
 * @param options - Rating options
 * @returns AggregateRating schema object
 *
 * @example
 * getAggregateRatingSchema({
 *   ratingValue: 4.9,
 *   ratingCount: 127,
 *   pageUrl: '/reviews',
 * });
 */
export const getAggregateRatingSchema = (options: AggregateRatingOptions) => ({
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  '@id': absUrl(`${options.pageUrl || '/'}#aggregaterating`),
  ratingValue: options.ratingValue,
  bestRating: 5,
  worstRating: 1,
  ratingCount: options.ratingCount,
  itemReviewed: {
    '@id': absUrl('/#organization'),
  },
});
