import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';

/**
 * Service hero props
 */
interface ServiceHeroProps {
  /** Optional badge text */
  badge?: string;
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** Phone number for display */
  phone?: string;
  /** Trust badges to display */
  trustBadges?: string[];
  /** Hero image path */
  heroImage?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button URL */
  ctaUrl?: string;
}

/**
 * Service Hero Component
 *
 * A two-column hero section for service pages with image,
 * call-to-action buttons, and trust badges.
 *
 * @example
 * ```tsx
 * <ServiceHero
 *   badge="Most Popular"
 *   title="Residential Services"
 *   description="Professional services for homeowners..."
 *   phone="01234 567890"
 *   trustBadges={["Licensed", "Insured"]}
 *   heroImage="services/residential.webp"
 *   ctaText="Get Quote"
 *   ctaUrl="/contact"
 * />
 * ```
 */
export function ServiceHero({
  badge,
  title,
  description,
  phone,
  trustBadges = [],
  heroImage,
  ctaText = 'Get Free Quote',
  ctaUrl = '/contact',
}: ServiceHeroProps) {
  // Format phone for tel: link
  const phoneTel = phone?.replace(/\s/g, '');

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-surface-background">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {badge && (
              <div className="mb-6">
                <span className="px-4 py-2 bg-brand-primary text-brand-on-primary text-sm font-medium rounded-full">
                  {badge}
                </span>
              </div>
            )}

            <h1 className="heading-hero">{title}</h1>

            <p className="text-xl text-surface-foreground mb-8 leading-relaxed">{description}</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {trustBadges.map((badgeText, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-surface-subtle px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm"
                  >
                    <svg
                      className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary"
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
          <div className="relative">
            {heroImage ? (
              <Image
                src={getImageUrl(heroImage)}
                alt={`Professional ${title.toLowerCase()} showing quality service delivery`}
                title={`${title} services`}
                width={600}
                height={400}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-2xl shadow-lg w-full object-cover"
                priority
                quality={65}
              />
            ) : (
              <div className="relative h-[400px] bg-surface-subtle rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-surface-muted text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-lg font-medium">Service Hero Image</span>
                  <p className="text-sm mt-2">Professional service photography</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
