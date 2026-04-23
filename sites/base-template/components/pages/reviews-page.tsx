import type { ReviewsPageTemplateProps } from '@platform/core-components';
import {
  Breadcrumbs,
  TestimonialCard,
  AggregateRatingDisplay,
} from '@platform/core-components';

export function ReviewsPage({ testimonials }: ReviewsPageTemplateProps) {
  const breadcrumbItems = [{ name: 'Reviews', href: '/reviews', current: true }];

  // Compute average rating
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

      {/* Page Title */}
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
      {count > 0 && (
        <section className="section-standard bg-surface-subtle">
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
    </>
  );
}
