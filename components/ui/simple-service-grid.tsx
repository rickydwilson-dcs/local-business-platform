import Link from "next/link";

interface ServiceItem {
  title: string;
  description?: string;
  href: string;
  fallbackDescription?: string;
}

interface SimpleServiceGridProps {
  services: ServiceItem[];
}

export function SimpleServiceGrid({ services }: SimpleServiceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto w-full lg:w-[90%]">
      {services.map((service, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center group-hover:bg-brand-blue-hover transition-colors">
              <svg
                className="h-6 w-6 text-white"
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
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                {service.description ||
                  service.fallbackDescription ||
                  `Learn more about ${service.title.toLowerCase()}.`}
              </p>
              <Link
                href={service.href}
                className="inline-flex items-center justify-center gap-2 w-full bg-brand-blue text-white font-semibold py-3 px-4 rounded-lg group-hover:bg-brand-blue-hover transition-colors"
              >
                Learn More
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
