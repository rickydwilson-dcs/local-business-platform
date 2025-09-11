interface LocationHeroProps {
  title: string;
  description: string;
  phone?: string;
  isHeadquarters?: boolean;
}

export function LocationHero({ title, description, phone, isHeadquarters }: LocationHeroProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {isHeadquarters && (
              <span className="px-3 py-1 bg-brand-blue text-white rounded-full text-sm">Our Headquarters</span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Scaffolding Services in {title}
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            {description}
          </p>

          {phone && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
              >
                Get Free Quote
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
