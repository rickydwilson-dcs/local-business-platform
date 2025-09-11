import Link from "next/link";
import Image from "next/image";

interface ServiceHeroProps {
  badge?: string;
  title?: string;
  description: string;
  phone: string;
  badges: string[];
  heroImage: string;
  ctaText: string;
  ctaUrl: string;
}

export function ServiceHero(props: ServiceHeroProps) {
  const {
    badge = "Popular Service",
    title,
    description,
    phone,
    badges = [],
    heroImage,
    ctaText = "Get Free Quote",
    ctaUrl = "/contact"
  } = props;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <div className="h-8 w-8 bg-blue-600 rounded"></div>
              </div>
              {badge && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {badge}
                </span>
              )}
            </div>

            {title && (
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                {title}
              </h1>
            )}

            <p className="text-xl text-gray-600 mb-8">
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
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Call: {phone}
              </Link>
            </div>

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((badgeText, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {badgeText}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Image
              src={heroImage}
              alt="Service hero image"
              width={600}
              height={500}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
