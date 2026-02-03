import Link from 'next/link';

/**
 * Page hero props
 */
interface PageHeroProps {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Optional badges to display */
  badges?: string[];
  /** CTA button text */
  ctaText?: string;
  /** CTA button link */
  ctaLink?: string;
  /** Additional CSS classes for background customization */
  className?: string;
}

/**
 * Page Hero Component
 *
 * A centered hero section for index/listing pages.
 * Supports badges and optional CTA button.
 *
 * @example
 * ```tsx
 * <PageHero
 *   title="Our Services"
 *   description="Explore our range of professional services"
 *   badges={["Quality Guaranteed", "Certified Experts"]}
 *   ctaText="Get a Quote"
 *   ctaLink="/contact"
 * />
 * ```
 */
export function PageHero({
  title,
  description,
  badges = [],
  ctaText,
  ctaLink,
  className = 'bg-gradient-to-br from-surface-subtle to-surface-background',
}: PageHeroProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="mx-auto w-full lg:w-[90%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground mb-6">{title}</h1>
          <p className="text-xl text-surface-foreground mb-8">{description}</p>

          {badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-surface-subtle text-surface-foreground rounded-full text-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {ctaText && ctaLink && (
            <Link href={ctaLink} className="btn-primary-lg">
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
