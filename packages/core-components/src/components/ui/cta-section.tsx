interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  trustBadges?: string[];
}

export function CTASection({
  title,
  description,
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl,
  trustBadges = ["Industry Certified", "Fully Accredited", "Fully Insured"],
}: CTASectionProps) {
  return (
    <section className="section-standard bg-brand-primary text-white">
      <div className="container-standard text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 mx-auto max-w-4xl opacity-90 leading-relaxed">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            href={primaryButtonUrl}
          >
            {primaryButtonText}
          </a>

          {secondaryButtonText && secondaryButtonUrl && (
            <a
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-primary transition-colors"
              href={secondaryButtonUrl}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              {secondaryButtonText}
            </a>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
