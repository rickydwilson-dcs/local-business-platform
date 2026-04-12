import type { ReviewsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import {
  Breadcrumbs,
  TestimonialCard,
  AggregateRatingDisplay,
} from '@platform/core-components';

export function NovaReviewsPage({ siteConfig, testimonials }: ReviewsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Reviews', href: '/reviews', current: true }];

  const count = testimonials.length;
  const average =
    count > 0
      ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / count) * 10) / 10
      : 0;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-subtle border-b border-surface-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-brand-primary py-16 md:py-24">
        <div className="container-standard text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Customers Say
          </h1>
          <p className="text-xl text-white/90 mx-auto max-w-3xl">
            Don&apos;t just take our word for it. Read what homeowners and businesses say about our
            services.
          </p>
        </div>
      </section>

      {/* Aggregate Rating */}
      {count > 0 && (
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
                <div className="bg-surface-card border border-surface-cardBorder rounded-xl p-8">
                  <h2 className="text-xl font-bold text-surface-foreground mb-4">Why Choose Us?</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Quality Assured', detail: 'Industry-standard compliance' },
                      { label: 'Expert Team', detail: 'Trained professionals' },
                      { label: 'Fast Response', detail: 'Quick quotes and efficient service' },
                      { label: 'Fully Insured', detail: 'Public liability coverage' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-brand-primary font-bold text-lg">&#10003;</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-surface-foreground">{item.label}</h3>
                          <p className="text-sm text-surface-muted-foreground">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <section className="section-standard bg-surface-background">
        <div className="container-standard">
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

      {/* CTA Strip */}
      <section className="py-12 bg-brand-primary">
        <div className="container-standard text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Experience Our Service?
          </h2>
          <p className="text-white/90 mb-6">
            Join our satisfied customers. Get a free quote for your project today.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-surface-subtle transition-colors"
          >
            Get Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}
