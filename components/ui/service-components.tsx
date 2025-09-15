// components/ui/service-components.tsx
import Link from "next/link";
import Image from "next/image";

interface ServiceHeroProps {
  badge?: string;
  description?: string;
  phone?: string;
  badges?: string[];
  heroImage?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function ServiceHero({
  badge = "Popular Service",
  description,
  phone,
  badges = [],
  heroImage,
  ctaText = "Get Free Quote",
  ctaUrl = "/contact"
}: ServiceHeroProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 py-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <svg className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          {badge && (
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="text-xl text-gray-600 mb-8">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href={ctaUrl}
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
          >
            {ctaText}
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </a>
          )}
        </div>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map(badge => (
              <span key={badge} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {heroImage && (
          <Image
            src={heroImage}
            alt="Service hero image"
            width={600}
            height={500}
            className="rounded-lg shadow-lg w-full"
          />
        )}
      </div>
    </div>
  );
}

interface GalleryProps {
  images: string[];
}

export function Gallery({ images }: GalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {images.map((src, i) => (
        <div key={i} className="relative h-64 rounded-lg overflow-hidden">
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}

interface BenefitsProps {
  items: string[];
  title?: string;
}

export function Benefits({ items, title = "Why Choose Our Service?" }: BenefitsProps) {
  return (
    <div className="py-16 bg-gray-50 -mx-4 px-4 mb-16 rounded-lg">
      <div className="mx-auto w-full lg:w-[90%]">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-900">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  return (
    <div className="space-y-6 mb-16">
      {items.map((item, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {item.question}
          </h3>
          <p className="text-gray-600">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}

interface CoverageAreasProps {
  areas: Array<{ name: string; slug: string }>;
  phone?: string;
}

export function CoverageAreas({ areas, phone }: CoverageAreasProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Professional Service Across the South East
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Our services are available throughout the South East UK, with local teams familiar
          with regional planning requirements and building regulations. We provide rapid response times and
          competitive pricing for all project sizes.
        </p>
        <p className="text-gray-600">
          From small residential projects to large commercial developments, our experienced team
          delivers safe, compliant solutions that meet your specific requirements and timeline.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Coverage Areas</h3>
        <ul className="space-y-2 text-sm">
          {areas.map(area => (
            <li key={area.slug}>
              <Link href={`/locations/${area.slug}`} className="text-brand-blue hover:underline">
                {area.name}
              </Link>
            </li>
          ))}
        </ul>
        {phone && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Need immediate assistance?</p>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-hover transition-colors"
            >
              Call Now: {phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

interface CTAProps {
  title: string;
  description: string;
  primaryAction: string;
  primaryUrl: string;
  secondaryAction?: string;
  secondaryUrl?: string;
}

export function CTA({
  title,
  description,
  primaryAction,
  primaryUrl,
  secondaryAction,
  secondaryUrl
}: CTAProps) {
  return (
    <div className="py-16 bg-brand-blue text-white -mx-4 px-4 rounded-lg text-center">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-xl mb-8 mx-auto w-full lg:w-[90%] opacity-90">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={primaryUrl}
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          {primaryAction}
        </Link>
        {secondaryAction && secondaryUrl && (
          <Link
            href={secondaryUrl}
            className="inline-flex items-center justify-center px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-blue transition-colors"
          >
            {secondaryAction}
          </Link>
        )}
      </div>
    </div>
  );
}
