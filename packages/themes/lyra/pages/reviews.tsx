import type { ReviewsPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import {
  Breadcrumbs,
  TestimonialCard,
  AggregateRatingDisplay,
} from '@platform/core-components';

export function LyraReviewsPage({ testimonials }: ReviewsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Reviews', href: '/reviews', current: true }];

  const count = testimonials.length;
  const average =
    count > 0
      ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / count) * 10) / 10
      : 0;

  const featuredTestimonials = testimonials.filter((t) => t.platform !== undefined || t.date);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b border-surface-cardBorder">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Page Title */}
      <section className="py-20 md:py-24 bg-surface-background">
        <div className="container-standard">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground mb-6">
              What Our Customers Say
            </h1>
            <p className="text-xl text-surface-muted-foreground">
              Don&apos;t just take our word for it. Read what homeowners and businesses say about our
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Aggregate Rating */}
      {count > 0 && (
        <section className="py-16 bg-surface-muted">
          <div className="container-standard">
            <div className="flex justify-center">
              <AggregateRatingDisplay
                ratingValue={average}
                reviewCount={count}
                size="lg"
                variant="stacked"
              />
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <section className="py-20 md:py-24 bg-surface-background">
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

      {/* CTA Section */}
      <section className="py-16 bg-brand-primary">
        <div className="container-standard text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Experience Our Service?
          </h2>
          <p className="text-brand-light mb-8 max-w-2xl mx-auto">
            Join our satisfied customers. Get a free quote for your project today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-surface-background text-brand-primary font-semibold rounded-lg hover:bg-surface-muted transition-colors"
          >
            Get Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}
