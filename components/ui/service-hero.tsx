import Link from "next/link";
import Image from "next/image";

interface ServiceHeroProps {
  badge?: string;
  title: string;
  description: string;
  phone?: string;
  trustBadges?: string[];
  heroImage?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function ServiceHero(props: ServiceHeroProps) {
  const {
    badge,
    title,
    description,
    phone = "01424 466661",
    trustBadges = ["TG20:21 Compliant", "CHAS Accredited", "£10M Insured"],
    heroImage,
    ctaText = "Get Free Quote",
    ctaUrl = "/contact"
  } = props;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {badge && (
              <div className="mb-6">
                <span className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-full">
                  {badge}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
              {title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href={ctaUrl}
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
              >
                {ctaText}
              </Link>
              <Link
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: {phone}
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              {trustBadges.map((badgeText, index) => (
                <div key={index} className="inline-flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {badgeText}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={`${title} service image`}
                width={600}
                height={500}
                className="rounded-2xl shadow-lg w-full object-cover"
              />
            ) : (
              <div className="relative h-[400px] bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-medium">Service Hero Image</span>
                  <p className="text-sm text-gray-500 mt-2">Professional scaffolding photography</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
