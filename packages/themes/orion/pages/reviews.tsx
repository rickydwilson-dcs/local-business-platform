import type { ReviewsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import {
  Breadcrumbs,
  AggregateRatingDisplay,
  TestimonialCard,
} from '@platform/core-components';

export function OrionReviewsPage({ siteConfig, testimonials }: ReviewsPageTemplateProps) {
  const count = testimonials.length;
  const average =
    count > 0
      ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / count) * 10) / 10
      : 0;
  const featuredTestimonials = testimonials.filter((t) => (t as { featured?: boolean }).featured);

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
        {/* Page header */}
        <section className="section bg-white">
          <div className="container-standard">
            <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                  Testimonials
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-foreground">
                  What our customers say
                </h1>
                <p className="text-surface-muted-foreground mt-4 leading-relaxed max-w-lg">
                  Don&apos;t just take our word for it. Read what homeowners and businesses say about our services.
                </p>
              </div>

              {/* Aggregate rating */}
              {count > 0 && (
                <div className="bg-surface-muted rounded-2xl p-8 border border-surface-card-border">
                  <AggregateRatingDisplay
                    ratingValue={average}
                    reviewCount={count}
                    size="lg"
                    variant="stacked"
                  />
                </div>
              )}
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
              <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                Highlighted
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-foreground mb-10">
                Featured reviews
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.slug}
                    name={testimonial.name}
                    rating={testimonial.rating}
                    text={testimonial.body}
                    date={testimonial.date}
                    featured={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Reviews */}
        <section className="section bg-surface-muted">
          <div className="container-standard">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-foreground mb-10">
              {featuredTestimonials.length > 0 ? 'All Reviews' : 'Customer Reviews'}
            </h2>

            {testimonials.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-surface-muted-foreground">
                  No reviews yet. Check back soon for customer testimonials.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.slug}
                    name={testimonial.name}
                    rating={testimonial.rating}
                    text={testimonial.body}
                    date={testimonial.date}
                    featured={false}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-brand-primary noise-overlay">
          <div className="container-standard">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Ready to experience our service?
                </h2>
                <p className="text-white/80 mt-2 max-w-xl">
                  Join our satisfied customers. Get a free quote for your project today.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-semibold rounded-lg hover:bg-surface-muted transition-colors whitespace-nowrap"
              >
                Get a free quote
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
