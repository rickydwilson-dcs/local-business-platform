/**
 * Reviews Page
 *
 * Customer testimonials and reviews with aggregate rating display.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Schema,
  Breadcrumbs,
  AggregateRatingDisplay,
  TestimonialCard,
} from '@platform/core-components';
import { getTestimonials, calculateAggregateRating } from '@/lib/content';
import { absUrl } from '@/lib/site';
import { siteConfig } from '@/site.config';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerChildren, StaggerItem } from '@/components/motion/stagger-children';
import { MagneticButton } from '@/components/motion/magnetic-button';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Customer Reviews | What Our Clients Say | ${siteConfig.business.name}`,
  description: `Read what our customers say about ${siteConfig.business.name}. Trusted by homeowners and businesses for professional services.`,
  keywords: ['reviews', 'testimonials', 'customer reviews', 'client testimonials', 'company reviews'],
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

  const trustPoints = [
    { label: 'Quality assured', sub: 'Industry-standard compliance' },
    { label: 'Expert team', sub: 'Trained professionals' },
    { label: 'Fast response', sub: 'Quick quotes and efficient service' },
    { label: 'Fully insured', sub: 'Public liability coverage' },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">

        {/* Page header — left-aligned, not centered */}
        <section className="section bg-white">
          <div className="container-standard">
            <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-end">
              <FadeIn direction="left">
                <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                  Testimonials
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground">
                  What our customers say
                </h1>
                <p className="text-surface-muted-foreground mt-4 leading-relaxed max-w-lg">
                  Don&apos;t just take our word for it. Read what homeowners and businesses say about our services.
                </p>
              </FadeIn>

              {/* Aggregate rating — right side of header */}
              <FadeIn direction="right" delay={0.1}>
                <div className="bg-surface-muted rounded-2xl p-8 border border-surface-card-border">
                  <AggregateRatingDisplay
                    ratingValue={average}
                    reviewCount={count}
                    size="lg"
                    variant="stacked"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Trust points strip */}
        <section className="bg-surface-inverse border-y border-surface-border">
          <div className="container-standard">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-surface-border">
              {trustPoints.map(({ label, sub }) => (
                <div key={label} className="px-6 py-7">
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-surface-muted-foreground text-xs mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Reviews */}
        {featuredTestimonials.length > 0 && (
          <section className="section bg-surface-background">
            <div className="container-standard">
              <FadeIn>
                <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                  Highlighted
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-foreground mb-10">
                  Featured reviews
                </h2>
              </FadeIn>
              <StaggerChildren className="grid md:grid-cols-2 gap-8" staggerDelay={0.1}>
                {featuredTestimonials.map((testimonial) => (
                  <StaggerItem key={testimonial.slug}>
                    <TestimonialCard
                      name={testimonial.customerName}
                      location={testimonial.location}
                      rating={testimonial.rating}
                      text={testimonial.text}
                      date={testimonial.date}
                      featured={testimonial.featured}
                    />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </section>
        )}

        {/* All Reviews */}
        <section className="section bg-surface-muted">
          <div className="container-standard">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-foreground mb-10">
                {featuredTestimonials.length > 0 ? 'All Reviews' : 'Customer Reviews'}
              </h2>
            </FadeIn>

            {testimonials.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-surface-muted-foreground">
                  No reviews yet. Check back soon for customer testimonials.
                </p>
              </div>
            ) : (
              <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.07}>
                {testimonials.map((testimonial) => (
                  <StaggerItem key={testimonial.slug}>
                    <TestimonialCard
                      name={testimonial.customerName}
                      location={testimonial.location}
                      rating={testimonial.rating}
                      text={testimonial.text}
                      date={testimonial.date}
                      featured={testimonial.featured}
                    />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-brand-primary noise-overlay">
          <div className="container-standard">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <FadeIn direction="left">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Ready to experience our service?
                </h2>
                <p className="text-white/80 mt-2 max-w-xl">
                  Join our satisfied customers. Get a free quote for your project today.
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.1}>
                <MagneticButton>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-semibold rounded-lg hover:bg-surface-muted transition-colors whitespace-nowrap"
                  >
                    Get a free quote
                  </Link>
                </MagneticButton>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>

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
