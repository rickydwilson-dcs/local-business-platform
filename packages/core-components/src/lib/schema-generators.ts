import type { BusinessConfig } from './schema-types';

export interface SchemaContext {
  absUrl: (path: string) => string;
  businessConfig: BusinessConfig;
  businessType: string;
}

export interface ArticleSchemaOptions {
  type: 'BlogPosting' | 'Article';
  url: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    jobTitle?: string;
  };
}

export interface AggregateRatingOptions {
  ratingValue: number;
  ratingCount: number;
  pageUrl?: string;
}

export function createSchemaGenerators(ctx: SchemaContext) {
  const { absUrl, businessConfig, businessType } = ctx;

  const getLocalBusinessSchema = () => {
    const config = businessConfig;

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

    if (config.legalName) { schema.legalName = config.legalName; }
    if (config.slogan) { schema.slogan = config.slogan; }
    if (config.foundingDate) { schema.foundingDate = config.foundingDate; }
    if (config.numberOfEmployees) { schema.numberOfEmployees = config.numberOfEmployees; }
    if (config.priceRange) { schema.priceRange = config.priceRange; }

    if (config.openingHours && config.openingHours.length > 0) {
      schema.openingHoursSpecification = config.openingHours.map((hours) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours.dayOfWeek,
        opens: hours.opens,
        closes: hours.closes,
      }));
    }

    if (config.credentials && config.credentials.length > 0) {
      schema.hasCredential = config.credentials.map((credential) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: credential.category,
        name: credential.name,
        description: credential.description,
      }));
    }

    if (config.socialProfiles && config.socialProfiles.length > 0) {
      schema.sameAs = config.socialProfiles;
    }

    if (config.aggregateRating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: config.aggregateRating.ratingValue,
        bestRating: '5',
        ratingCount: config.aggregateRating.ratingCount,
      };
    }

    if (config.knowsAbout && config.knowsAbout.length > 0) {
      schema.knowsAbout = config.knowsAbout;
    }

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

  const getWebSiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absUrl('/#website'),
    name: businessConfig.name,
    url: absUrl('/'),
    description: businessConfig.description,
    publisher: { '@id': absUrl('/#organization') },
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

  const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absUrl(item.url),
    })),
  });

  const getFAQSchema = (
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

  const getServiceAreaSchema = (locationName: string, locationSlug: string) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': absUrl(`/locations/${locationSlug}#localbusiness`),
    name: `${businessConfig.name} - ${locationName}`,
    telephone: businessConfig.telephone,
    priceRange: businessConfig.priceRange,
    areaServed: [{ '@type': 'City', name: locationName }],
    parentOrganization: { '@id': absUrl('/#organization') },
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

  const getArticleSchema = (options: ArticleSchemaOptions) => ({
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

  const getAggregateRatingSchema = (options: AggregateRatingOptions) => ({
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    '@id': absUrl(`${options.pageUrl || '/'}#aggregaterating`),
    ratingValue: options.ratingValue,
    bestRating: 5,
    worstRating: 1,
    ratingCount: options.ratingCount,
    itemReviewed: { '@id': absUrl('/#organization') },
  });

  return {
    getLocalBusinessSchema,
    getWebSiteSchema,
    getBreadcrumbSchema,
    getFAQSchema,
    getServiceAreaSchema,
    getArticleSchema,
    getAggregateRatingSchema,
  };
}
