/**
 * TestimonialsGrid
 *
 * Displays customer testimonials with star ratings and reviewer names to build trust
 * Layout: Four-column grid of testimonial cards with star ratings, reviewer name and review text
 * Category: Social Proof
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface TestimonialsGridProps {
  /** reviewer-name */
  reviewerName?: string[];
  /** star-rating */
  starRating?: number[];
  /** review-text */
  reviewText?: string[];
  /** read-more-link */
  readMoreLink?: { label?: string; href?: string }[];
}
export function TestimonialsGrid(props: TestimonialsGridProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">What Our Customers Say</h2>
            <p className="text-surface-muted-foreground text-lg max-w-2xl mx-auto">
              Real reviews from real customers who trust us every day.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(props.reviewerName) &&
              props.reviewerName.map((name, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-surface-muted hover:shadow-md transition-shadow duration-300"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({
                        length: props.starRating?.[index] ?? 5,
                      }).map((_, starIndex) => (
                        <svg
                          key={starIndex}
                          className="w-5 h-5 text-brand-accent fill-current"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="sr-only">
                        {props.starRating?.[index] ?? 5} out of 5 stars
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-surface-secondary-foreground text-sm leading-relaxed mb-6">
                      &ldquo;{props.reviewText?.[index] ?? ""}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Reviewer Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-on-brand-primary font-semibold text-sm uppercase">
                        {name?.charAt(0) ?? "?"}
                      </div>
                      <span className="text-surface-foreground font-semibold text-sm">{name}</span>
                    </div>

                    {/* Read More Link */}
                    {props.readMoreLink?.[index] && (
                      <a
                        href={props.readMoreLink[index]?.href}
                        className="text-brand-primary text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary rounded"
                        aria-label={`Read full review by ${name}`}
                      >
                        Read more
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
