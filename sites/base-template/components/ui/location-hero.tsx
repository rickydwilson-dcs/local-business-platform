import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/image';

/**
 * Location hero props
 */
interface LocationHeroProps {
  /** Location title/name */
  title: string;
  /** Location description */
  description: string;
  /** Optional badge text */
  badge?: string;
  /** Hero image path */
  heroImage?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button URL */
  ctaUrl?: string;
  /** Phone number */
  phone?: string;
  /** Trust badges to display */
  trustBadges?: string[];
}

/**
 * Location Hero Component
 *
 * A two-column hero section for location pages.
 * Features image on left, content with CTA on right.
 *
 * @example
 * ```tsx
 * <LocationHero
 *   title="Brighton"
 *   description="Serving the Brighton area with professional services..."
 *   badge="Local Experts"
 *   heroImage="locations/brighton.webp"
 *   ctaText="Get Quote"
 *   ctaUrl="/contact"
 *   phone="01234 567890"
 *   trustBadges={["Local Team", "24/7 Service"]}
 * />
 * ```
 */
export function LocationHero({
  title,
  description,
  badge,
  heroImage,
  ctaText = 'Get Free Quote',
  ctaUrl = '/contact',
  phone,
  trustBadges = [],
}: LocationHeroProps) {
  const phoneTel = phone?.replace(/\s/g, '');

  return (
    <section className="py-16 sm:py-20 bg-surface-background">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              {badge && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4">
                  {badge}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-foreground leading-tight">
                Services in {title}
              </h1>
              <p className="text-xl text-surface-foreground mt-6 leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ctaUrl} className="btn-primary-lg">
                {ctaText}
              </Link>
              {phone && (
                <Link
                  href={`tel:${phoneTel}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-surface-border text-surface-foreground font-semibold rounded-lg hover:bg-surface-subtle transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call: {phone}
                </Link>
              )}
            </div>

            {trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-6 text-sm text-surface-foreground">
                {trustBadges.map((badgeText, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-brand-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {badgeText}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className="lg:order-first">
            <div className="relative h-[400px] rounded-2xl shadow-lg overflow-hidden bg-surface-subtle">
              {heroImage ? (
                <Image
                  src={getImageUrl(heroImage)}
                  alt={`Professional services in ${title} - quality installations for residential and commercial projects`}
                  title={`Services in ${title}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={65}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-surface-muted text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-medium">Location Hero Image</span>
                    <p className="text-sm mt-1">{title} service area</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
