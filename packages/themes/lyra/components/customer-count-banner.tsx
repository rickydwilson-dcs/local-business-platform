/**
 * CustomerCountBanner
 *
 * Highlights the number of satisfied customers to build trust, with a link to more reviews
 * Layout: Full-width two-column: large stat number and label left, reviews CTA button right
 * Category: Social Proof
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface CustomerCountBannerProps {
  /** stat-number */
  statNumber?: number;
  /** stat-label */
  statLabel?: string;
  /** reviews-cta-button */
  reviewsCtaButton?: { label?: string; href?: string };
}
export function CustomerCountBanner(props: CustomerCountBannerProps) {
  return (
    <section className="bg-surface-foreground py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left: Stat number and label */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col items-start gap-2">
              <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-primary leading-none">
                {props.statNumber ?? "10,000+"}
              </span>
              <span className="text-lg md:text-xl font-medium text-surface-secondary-foreground">
                {props.statLabel ?? "Satisfied Customers"}
              </span>
            </div>
          </RevealOnScroll>

          {/* Right: Reviews CTA button */}
          <div className="flex items-center">
            <a
              href={props.reviewsCtaButton?.href ?? "#reviews"}
              className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary bg-surface-background hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200 font-semibold text-base md:text-lg px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              aria-label={props.reviewsCtaButton?.label ?? "Read our reviews"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {props.reviewsCtaButton?.label ?? "Read Our Reviews"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
