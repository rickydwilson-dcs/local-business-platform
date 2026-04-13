/**
 * Reviews Page
 * ============
 *
 * Customer testimonials and reviews with aggregate rating display.
 */

import type { Metadata } from 'next';
import type { SiteConfigSummary } from '@platform/core-components';
import { Schema } from '@platform/core-components';
import { CorvusReviewsPage } from '@platform/themes/corvus/pages';
import { getTestimonials, calculateAggregateRating } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY } from '@/lib/contact-info';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Customer Reviews | What Our Clients Say | ${siteConfig.business.name}`,
  description: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses for professional services.`,
  keywords: [
    'reviews',
    'testimonials',
    'customer reviews',
    'client testimonials',
    'company reviews',
  ],
  openGraph: {
    title: 'Customer Reviews | What Our Clients Say',
    description: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses.`,
    url: '/reviews',
    type: 'website',
  },
};

export default async function ReviewsPage() {
  const testimonials = await getTestimonials();
  const { average, count } = calculateAggregateRating(testimonials);

  const siteSummary: SiteConfigSummary = {
    name: siteConfig.business.name,
    tagline: siteConfig.tagline,
    phone: siteConfig.business.phone,
    phoneDisplay: PHONE_DISPLAY,
    address: { city: siteConfig.business.address.city },
    cta: siteConfig.cta,
    stats: siteConfig.credentials?.stats,
  };

  return (
    <>
      <CorvusReviewsPage
        siteConfig={siteSummary}
        testimonials={testimonials.map((t) => ({
          slug: t.slug || t.customerName,
          name: t.customerName,
          rating: t.rating,
          body: t.text,
          platform: t.platform,
          date: t.date,
        }))}
      />

      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Reviews', url: '/reviews' },
        ]}
        webpage={{
          '@type': 'WebPage',
          '@id': absUrl('/reviews#webpage'),
          url: absUrl('/reviews'),
          name: 'Customer Reviews',
          description: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses.`,
        }}
        aggregateRating={
          count > 0
            ? {
                '@type': 'AggregateRating',
                '@id': absUrl('/reviews#aggregaterating'),
                ratingValue: average,
                bestRating: 5,
                worstRating: 1,
                ratingCount: count,
              }
            : undefined
        }
      />
    </>
  );
}
