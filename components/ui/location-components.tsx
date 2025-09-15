import Link from "next/link";

interface LocationServicesProps {
  services: Array<{ name: string; url: string }>;
  title?: string;
}

export function LocationServices({ services, title = "Popular Services" }: LocationServicesProps) {
  return (
    <div className="py-16 bg-white">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Link
              key={i}
              href={service.url}
              className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <svg className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <span className="text-brand-blue font-medium">Learn About {service.name} <span aria-hidden="true">→</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LocationFeaturesProps {
  features: string[];
  title?: string;
}

export function LocationFeatures({ features, title = "Why Choose Our Local Service?" }: LocationFeaturesProps) {
  return (
    <div className="py-16 bg-gray-50">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-900">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LocationFAQItem {
  question: string;
  answer: string;
}

interface LocationFAQProps {
  items: LocationFAQItem[];
  title?: string;
}

export function LocationFAQ({ items, title = "Frequently Asked Questions" }: LocationFAQProps) {
  return (
    <div className="py-16 bg-white">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          {title}
        </h2>
        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {item.question}
              </h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LocationCTAProps {
  title: string;
  description: string;
  phone?: string;
}

export function LocationCTA({ title, description, phone }: LocationCTAProps) {
  return (
    <div className="py-16 bg-brand-blue text-white">
      <div className="mx-auto w-full lg:w-[90%] px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8 opacity-90">{description}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Free Quote
          </Link>
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-blue transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}