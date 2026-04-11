import type { ReviewsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { Breadcrumbs, AggregateRatingDisplay, TestimonialCard } from '@platform/core-components';

export function CygnusReviewsPage({ siteConfig, testimonials }: ReviewsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Reviews', href: '/reviews', current: true }];

  const average =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      : 0;
  const count = testimonials.length;
  const featuredTestimonials = testimonials.filter((_, i) => i < 4);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-card-border">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero */}
        <section className="section-standard bg-surface-inverse">
          <div className="container-standard text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-surface-foreground">
              What Our Customers Say
            </h1>
            <p className="text-xl text-surface-secondary-foreground">
              Don&apos;t just take our word for it. Read what homeowners and businesses say about
              our services.
            </p>
          </div>
        </section>

        {/* Aggregate Rating */}
        {count > 0 && (
          <section className="section-standard bg-surface-background">
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
                  <div className="bg-surface-card border border-surface-card-border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-surface-foreground mb-4">Why Choose Us?</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { title: 'Quality Assured', desc: 'Industry-standard compliance' },
                        { title: 'Expert Team', desc: 'Trained professionals' },
                        { title: 'Fast Response', desc: 'Quick quotes and efficient service' },
                        { title: 'Fully Insured', desc: 'Public liability coverage' },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-brand-primary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-surface-foreground">{item.title}</h3>
                            <p className="text-sm text-surface-muted-foreground">{item.desc}</p>
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

        {/* Featured Reviews */}
        {featuredTestimonials.length > 0 && (
          <section className="section-standard bg-surface-muted">
            <div className="container-standard">
              <h2 className="text-2xl font-bold text-surface-foreground mb-8">Featured Reviews</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredTestimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.slug}
                    name={testimonial.name}
                    rating={testimonial.rating}
                    text={testimonial.body}
                    date={testimonial.date}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Reviews */}
        <section className="section-standard bg-surface-background">
          <div className="container-standard">
            <h2 className="text-2xl font-bold text-surface-foreground mb-8">
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
                    name={testimonial.name}
                    rating={testimonial.rating}
                    text={testimonial.body}
                    date={testimonial.date}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section-standard bg-brand-primary">
          <div className="container-standard text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-on-brand-primary mb-4">
              Ready to Experience Our Service?
            </h2>
            <p className="text-on-brand-primary/90 mb-8 max-w-2xl mx-auto">
              Join our satisfied customers. Get a free quote for your project today.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-surface-inverse text-surface-foreground font-semibold rounded-lg hover:bg-surface-card transition-colors"
            >
              Get Free Quote
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
