/**
 * Reviews Page
 * ============
 *
 * Customer testimonials and reviews with aggregate rating display.
 * Uses theme CSS variables for consistent branding.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { Schema } from '@/components/Schema';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { AggregateRatingDisplay } from '@/components/ui/aggregate-rating-display';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { getTestimonials, calculateAggregateRating } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';

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
  const featuredTestimonials = testimonials.filter((t) => t.featured);

  const breadcrumbItems = [{ name: 'Reviews', href: '/reviews', current: true }];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-surface-subtle to-surface-background">
        {/* Hero Section */}
        <section className="section-standard lg:py-24 bg-surface-background">
          <div className="container-standard">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="heading-hero">What Our Customers Say</h1>
              <p className="text-xl text-surface-foreground mb-8">
                Don&apos;t just take our word for it. Read what homeowners and businesses say about
                our services.
              </p>
            </div>
          </div>
        </section>

        {/* Aggregate Rating */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <AggregateRatingDisplay
                  ratingValue={average}
                  reviewCount={count}
                  size="lg"
                  variant="stacked"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-surface-background rounded-2xl shadow-lg p-8 border border-surface-border">
                  <h2 className="text-xl font-bold text-surface-foreground mb-4">Why Choose Us?</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-foreground">Quality Assured</h3>
                        <p className="text-sm text-surface-muted-foreground">
                          Industry-standard compliance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-foreground">Expert Team</h3>
                        <p className="text-sm text-surface-muted-foreground">
                          Trained professionals
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-foreground">Fast Response</h3>
                        <p className="text-sm text-surface-muted-foreground">
                          Quick quotes and efficient service
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-brand-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path
                            fillRule="evenodd"
                            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-foreground">Fully Insured</h3>
                        <p className="text-sm text-surface-muted-foreground">
                          Public liability coverage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Reviews */}
        {featuredTestimonials.length > 0 && (
          <section className="section-standard bg-surface-background">
            <div className="container-standard">
              <h2 className="heading-section mb-8">Featured Reviews</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.slug}
                    name={testimonial.customerName}
                    location={testimonial.location}
                    rating={testimonial.rating}
                    text={testimonial.text}
                    date={testimonial.date}
                    featured={testimonial.featured}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Reviews */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <h2 className="heading-section mb-8">
              {featuredTestimonials.length > 0 ? 'All Reviews' : 'Customer Reviews'}
            </h2>

            {testimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-surface-muted-foreground text-lg">
                  No reviews yet. Check back soon for customer testimonials.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.slug}
                    name={testimonial.customerName}
                    location={testimonial.location}
                    rating={testimonial.rating}
                    text={testimonial.text}
                    date={testimonial.date}
                    featured={testimonial.featured}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-compact bg-brand-primary">
          <div className="container-standard text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-on-primary mb-4">
              Ready to Experience Our Service?
            </h2>
            <p className="text-brand-on-primary/90 mb-8 max-w-2xl mx-auto">
              Join our satisfied customers. Get a free quote for your project today.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-surface-background text-brand-primary font-semibold rounded-lg hover:bg-surface-subtle transition-colors"
            >
              Get Free Quote
            </Link>
          </div>
        </section>
      </main>

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
