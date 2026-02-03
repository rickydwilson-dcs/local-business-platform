import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, generateImageAlt } from '@/lib/image';

/**
 * Content card props
 */
interface ContentCardProps {
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Link URL */
  href: string;
  /** Fallback description if none provided */
  fallbackDescription?: string;
  /** Badge text */
  badge?: string;
  /** Image path */
  image?: string;
  /** List of features/bullet points */
  features?: string[];
  /** List of towns (for location cards) */
  towns?: string[];
  /** Subtitle pills */
  subtitle?: string[];
  /** Whether this is a headquarters location */
  isHeadquarters?: boolean;
  /** Content type for styling */
  contentType?: 'services' | 'locations';
}

/**
 * Content Card Component
 *
 * A versatile card component for displaying services, locations, or other content.
 * Supports images, badges, features, and different content types.
 *
 * @example
 * ```tsx
 * <ContentCard
 *   title="Residential Services"
 *   description="Professional services for homeowners"
 *   href="/services/residential"
 *   image="services/residential.webp"
 *   features={["Quality work", "Fast service", "Fair pricing"]}
 *   contentType="services"
 * />
 * ```
 */
export function ContentCard({
  title,
  description,
  href,
  fallbackDescription,
  badge,
  image,
  features,
  towns,
  subtitle,
  isHeadquarters,
  contentType = 'services',
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="bg-surface-background rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group relative block cursor-pointer overflow-hidden h-full flex flex-col"
    >
      {/* Badge */}
      {(badge || isHeadquarters) && contentType !== 'services' && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-brand-primary text-brand-on-primary text-sm font-medium rounded-full">
            {badge || (isHeadquarters ? 'Headquarters' : '')}
          </span>
        </div>
      )}

      {/* Image section */}
      <div
        className={`relative h-48 rounded-t-2xl overflow-hidden flex items-center justify-center ${
          !(image && contentType === 'services')
            ? 'bg-gradient-to-br from-brand-primary/10 to-brand-primary/20'
            : ''
        }`}
      >
        {/* Subtitle pills */}
        {subtitle && subtitle.length > 0 && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex flex-wrap gap-2">
              {subtitle.map((item, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-brand-primary/90 text-brand-on-primary text-sm font-semibold rounded-full backdrop-blur-sm shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder icon */}
        {!(image && contentType === 'services') && (
          <div className="w-12 h-12 bg-brand-primary/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-brand-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        )}

        {/* Image */}
        {image && contentType === 'services' && (
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(image)}
              alt={generateImageAlt(title)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-surface-foreground mb-3">{title}</h3>

        <p className="text-surface-muted-foreground text-sm leading-relaxed mb-4">
          {description ?? fallbackDescription ?? `Learn more about ${title.toLowerCase()}.`}
        </p>

        {/* Features or Towns list */}
        {(features || towns) && (
          <ul className="space-y-2 mb-6 flex-grow">
            {(features || towns)?.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full flex-shrink-0"></div>
                <span className="text-surface-muted-foreground line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <div className="mt-auto">
          <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-brand-primary text-brand-on-primary font-semibold rounded-lg hover:bg-brand-primary-hover group-hover:scale-105 transition-all duration-200 text-sm">
            {contentType === 'services' ? 'Learn More' : 'View Location Info'}
          </div>
        </div>
      </div>
    </Link>
  );
}
