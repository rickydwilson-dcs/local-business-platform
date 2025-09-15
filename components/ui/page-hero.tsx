import Link from "next/link";

interface PageHeroProps {
  title: string;
  description: string;
  badges?: string[];
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export function PageHero({
  title,
  description,
  badges = [],
  ctaText,
  ctaLink,
  className = "bg-gradient-to-br from-gray-50 to-gray-100"
}: PageHeroProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="mx-auto w-full lg:w-[90%] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {description}
          </p>

          {badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {badges.map((badge, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {badge}
                </span>
              ))}
            </div>
          )}

          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className="btn-primary-lg"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
