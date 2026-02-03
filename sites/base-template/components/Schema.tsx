/**
 * Schema Component
 * =================
 *
 * Renders Schema.org JSON-LD structured data as a script tag.
 * Supports multiple schema types that can be combined into a single @graph.
 *
 * Usage:
 * - Pass individual schema props to include them in the output
 * - Multiple schemas are combined into a @graph array
 * - Only non-null props are rendered
 *
 * @example
 * // Service page with FAQ and breadcrumbs
 * <Schema
 *   service={{ ... }}
 *   faqs={[...]}
 *   breadcrumbs={[...]}
 * />
 *
 * @example
 * // Blog post with article schema
 * <Schema
 *   article={{ ... }}
 *   breadcrumbs={[...]}
 * />
 */

import React from 'react';
import { absUrl } from '@/lib/site';

// ============================================================================
// TYPES
// ============================================================================

/** FAQ item */
type FAQ = {
  question: string;
  answer: string;
};

/** Breadcrumb navigation item */
type BreadcrumbItem = {
  name: string;
  url: string;
};

/** Service schema props */
type ServiceSchema = {
  /** Schema @id (e.g., "/services/plumbing#service") */
  id: string;
  /** Service page URL */
  url: string;
  /** Service name */
  name: string;
  /** Service description */
  description: string;
  /** Type of service (e.g., "Plumbing Service") */
  serviceType: string;
  /** Areas served by this service */
  areaServed?: string[];
};

/** Organization schema props */
type OrgSchema = {
  /** Organization name */
  name: string;
  /** Organization website URL */
  url: string;
  /** Logo image URL */
  logo?: string;
  /** Schema @id */
  id?: string;
};

/** Article/BlogPosting schema props */
type ArticleSchema = {
  '@type': 'BlogPosting' | 'Article';
  '@id': string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    jobTitle?: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
};

/** WebPage schema props */
type WebpageSchema = {
  '@type': 'WebPage' | 'Blog' | 'CollectionPage';
  '@id': string;
  url: string;
  name: string;
  description: string;
};

/** Individual review schema props */
type ReviewSchema = {
  '@type': 'Review';
  '@id': string;
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished: string;
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  reviewBody: string;
};

/** Aggregate rating schema props */
type AggregateRatingSchema = {
  '@type': 'AggregateRating';
  '@id': string;
  ratingValue: number;
  bestRating: number;
  worstRating: number;
  ratingCount: number;
};

/** Schema component props */
type Props = {
  /** Service schema for service pages */
  service?: ServiceSchema;
  /** FAQ items to render as FAQPage schema */
  faqs?: FAQ[];
  /** Organization schema (standalone or as provider) */
  org?: OrgSchema;
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[];
  /** Article/BlogPosting schema for content pages */
  article?: ArticleSchema;
  /** WebPage schema for general pages */
  webpage?: WebpageSchema;
  /** Individual review schemas */
  reviews?: ReviewSchema[];
  /** Aggregate rating schema */
  aggregateRating?: AggregateRatingSchema;
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Schema component that renders JSON-LD structured data
 *
 * Combines multiple schema types into a single @graph array.
 * Only renders schemas that are explicitly passed as props.
 */
export function Schema({
  service,
  faqs,
  org,
  breadcrumbs,
  article,
  webpage,
  reviews,
  aggregateRating,
}: Props) {
  const graph: Array<Record<string, unknown>> = [];

  // Service schema
  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': absUrl(service.id),
      name: service.name,
      description: service.description,
      url: absUrl(service.url),
      serviceType: service.serviceType,
      ...(org && {
        provider: {
          '@type': 'Organization',
          ...(org.id ? { '@id': absUrl(org.id) } : {}),
          name: org.name,
          url: absUrl(org.url),
          ...(org.logo ? { logo: absUrl(org.logo) } : {}),
        },
      }),
      ...(service.areaServed?.length
        ? { areaServed: service.areaServed.map((c) => ({ '@type': 'City', name: c })) }
        : {}),
    });
  }

  // FAQ schema
  if (faqs && faqs.length > 0) {
    const faqUrl = service?.url || webpage?.url || '/';
    graph.push({
      '@type': 'FAQPage',
      '@id': absUrl(faqUrl + (faqUrl.includes('#') ? '' : '#faq')),
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  // Breadcrumb schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbUrl = service?.url || webpage?.url || article?.mainEntityOfPage?.['@id'] || '/';
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': absUrl(breadcrumbUrl + '#breadcrumb'),
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: absUrl(breadcrumb.url),
      })),
    });
  }

  // Article/BlogPosting schema
  if (article) {
    graph.push({
      '@type': article['@type'],
      '@id': article['@id'],
      headline: article.headline,
      description: article.description,
      ...(article.image && { image: article.image }),
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      author: article.author,
      ...(article.publisher && { publisher: article.publisher }),
      ...(article.mainEntityOfPage && { mainEntityOfPage: article.mainEntityOfPage }),
    });
  }

  // Webpage schema
  if (webpage) {
    graph.push({
      '@type': webpage['@type'],
      '@id': webpage['@id'],
      url: webpage.url,
      name: webpage.name,
      description: webpage.description,
      ...(org && {
        publisher: {
          '@type': 'Organization',
          name: org.name,
          url: absUrl(org.url),
          ...(org.logo ? { logo: absUrl(org.logo) } : {}),
        },
      }),
    });
  }

  // Review schemas
  if (reviews && reviews.length > 0) {
    reviews.forEach((review) => {
      graph.push({
        '@type': 'Review',
        '@id': review['@id'],
        author: review.author,
        datePublished: review.datePublished,
        reviewRating: review.reviewRating,
        reviewBody: review.reviewBody,
      });
    });
  }

  // Aggregate rating schema
  if (aggregateRating) {
    graph.push({
      '@type': 'AggregateRating',
      '@id': aggregateRating['@id'],
      ratingValue: aggregateRating.ratingValue,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
      ratingCount: aggregateRating.ratingCount,
    });
  }

  // Organization schema (standalone if no service)
  if (org && !service) {
    graph.push({
      '@type': 'Organization',
      ...(org.id ? { '@id': absUrl(org.id) } : { '@id': absUrl('/#organization') }),
      name: org.name,
      url: absUrl(org.url),
      ...(org.logo ? { logo: absUrl(org.logo) } : {}),
    });
  }

  // Don't render anything if no schemas
  if (graph.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
