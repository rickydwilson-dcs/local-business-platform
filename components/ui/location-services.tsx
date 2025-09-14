import Link from "next/link";

interface ServiceItem {
  name: string;
  description: string;
  href: string;
}

interface LocationServicesProps {
  title?: string;
  description?: string;
  services: ServiceItem[];
  location: string;
}

export function LocationServices({
  title = "Our Services",
  description,
  services,
  location
}: LocationServicesProps) {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="mx-auto w-full lg:w-[90%] text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
            {title} in {location}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto w-full lg:w-[90%]">
          {services.map((service, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center group-hover:bg-brand-blue-hover transition-colors">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-serif font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover transition-colors"
                  >
                    Learn About {service.name}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Need a custom scaffolding solution for your {location} project?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}