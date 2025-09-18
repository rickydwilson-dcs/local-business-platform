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
    <div className="grid-responsive grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <div
          key={i}
          className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
        >
          <div className="relative">
            <div className="h-48 bg-gradient-to-br from-brand-blue/10 to-brand-blue/20 flex items-center justify-center">
              <div className="w-12 h-12 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-brand-blue"
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
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {service.description ||
                service.fallbackDescription ||
                `Learn more about ${service.title.toLowerCase()}.`}
            </p>

            <Link
              href={service.href}
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#005A9E] text-white font-semibold rounded-lg hover:bg-[#004a85] group-hover:scale-105 transition-all duration-200 text-sm focus:ring-2 focus:ring-[#005A9E] focus:ring-offset-2"
              aria-label={`Learn More for ${service.title}`}
            >
              Learn More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
