/**
 * PageHero Component
 *
 * Shorter hero section for interior pages with background image overlay.
 * Designed for service pages, location pages, and content pages.
 *
 * @example
 * ```tsx
 * <PageHero
 *   title="Electrical Services"
 *   subtitle="Professional electrical services across East Sussex"
 *   imageSrc="/images/services-hero.jpg"
 *   imageAlt="Electrical services overview"
 *   breadcrumbs={[
 *     { name: "Home", href: "/" },
 *     { name: "Services", href: "/services", current: true }
 *   ]}
 * />
 * ```
 */

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';

export interface PageHeroProps {
  /** Page title displayed as h1 */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Background image path (relative to R2 bucket root) */
  imageSrc: string;
  /** Alt text for background image */
  imageAlt: string;
  /** Optional breadcrumb navigation */
  breadcrumbs?: Array<{
    name: string;
    href: string;
    current?: boolean;
  }>;
  /** Custom minimum height (default: min-h-[30vh]) */
  minHeight?: string;
}

export function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  breadcrumbs,
  minHeight = 'min-h-[30vh]',
}: PageHeroProps) {
  return (
    <section className={`relative ${minHeight} flex items-center justify-center overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(imageSrc)}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={70}
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/60" aria-hidden="true" />

      {/* Content Container */}
      <div className="relative z-20 container-standard py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumbs at top */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center justify-center space-x-2 text-sm text-white/80">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center">
                    {index > 0 && (
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 mx-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {crumb.current ? (
                      <span className="font-medium text-white" aria-current="page">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-white transition-colors">
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>

          {/* Subtitle */}
          {subtitle && <p className="text-lg md:text-xl text-white/90 font-medium">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
