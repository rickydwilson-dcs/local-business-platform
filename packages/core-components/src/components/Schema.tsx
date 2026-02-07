import React from "react";
import { absUrl } from "@/lib/site";

type FAQ = { question: string; answer: string };

type BreadcrumbItem = {
  name: string;
  url: string;
};

type ServiceSchema = {
  id: string;
  url: string;
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string[];
};

type OrgSchema = {
  name: string;
  url: string;
  logo?: string;
  id?: string;
};

type ArticleSchema = {
  "@type": "BlogPosting" | "Article";
  "@id": string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
    jobTitle?: string;
  };
  publisher?: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
};

type WebpageSchema = {
  "@type": "WebPage" | "AboutPage" | "Blog" | "CollectionPage";
  "@id": string;
  url: string;
  name: string;
  description: string;
};

type ReviewSchema = {
  "@type": "Review";
  "@id": string;
  author: {
    "@type": "Person";
    name: string;
  };
  datePublished: string;
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  reviewBody: string;
};

type AggregateRatingSchema = {
  "@type": "AggregateRating";
  "@id": string;
  ratingValue: number;
  bestRating: number;
  worstRating: number;
  ratingCount: number;
};

type Props = {
  service?: ServiceSchema;
  faqs?: FAQ[];
  org?: OrgSchema;
  breadcrumbs?: BreadcrumbItem[];
  article?: ArticleSchema;
  webpage?: WebpageSchema;
  reviews?: ReviewSchema[];
  aggregateRating?: AggregateRatingSchema;
};

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
      "@type": "Service",
      "@id": absUrl(service.id),
      name: service.name,
      description: service.description,
      url: absUrl(service.url),
      serviceType: service.serviceType,
      ...(org && {
        provider: {
          "@type": "Organization",
          ...(org.id ? { "@id": absUrl(org.id) } : {}),
          name: org.name,
          url: absUrl(org.url),
          ...(org.logo ? { logo: absUrl(org.logo) } : {}),
        },
      }),
      ...(service.areaServed?.length
        ? { areaServed: service.areaServed.map((c) => ({ "@type": "City", name: c })) }
        : {}),
    });
  }

  // FAQ schema
  if (faqs && faqs.length > 0) {
    const faqUrl = service?.url || webpage?.url || "/";
    graph.push({
      "@type": "FAQPage",
      "@id": absUrl(faqUrl + (faqUrl.includes("#") ? "" : "#faq")),
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  // Breadcrumb schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbUrl = service?.url || webpage?.url || article?.mainEntityOfPage?.["@id"] || "/";
    graph.push({
      "@type": "BreadcrumbList",
      "@id": absUrl(breadcrumbUrl + "#breadcrumb"),
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: breadcrumb.name,
        item: absUrl(breadcrumb.url),
      })),
    });
  }

  // Article/BlogPosting schema
  if (article) {
    graph.push({
      "@type": article["@type"],
      "@id": article["@id"],
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
      "@type": webpage["@type"],
      "@id": webpage["@id"],
      url: webpage.url,
      name: webpage.name,
      description: webpage.description,
      ...(org && {
        publisher: {
          "@type": "Organization",
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
        "@type": "Review",
        "@id": review["@id"],
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
      "@type": "AggregateRating",
      "@id": aggregateRating["@id"],
      ratingValue: aggregateRating.ratingValue,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
      ratingCount: aggregateRating.ratingCount,
    });
  }

  // Organization schema (standalone if no service)
  if (org && !service) {
    graph.push({
      "@type": "Organization",
      ...(org.id ? { "@id": absUrl(org.id) } : { "@id": absUrl("/#organization") }),
      name: org.name,
      url: absUrl(org.url),
      ...(org.logo ? { logo: absUrl(org.logo) } : {}),
    });
  }

  if (graph.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
