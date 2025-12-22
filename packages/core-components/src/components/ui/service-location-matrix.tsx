import Link from "next/link";

interface ServiceLocationMatrixProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ServiceLocationMatrix({
  title = "Services by Location",
  description = "Specialized scaffolding services tailored to each location's unique requirements.",
  className = "",
}: ServiceLocationMatrixProps) {
  const mainServices = [
    {
      title: "Commercial Scaffolding",
      slug: "commercial-scaffolding",
      description:
        "Business districts, retail centers, office buildings, and commercial developments.",
      icon: "🏢",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      textColor: "text-blue-900",
      locations: [
        { name: "Brighton", slug: "commercial-scaffolding-brighton" },
        { name: "Canterbury", slug: "commercial-scaffolding-canterbury" },
        { name: "Hastings", slug: "commercial-scaffolding-hastings" },
      ],
    },
    {
      title: "Residential Scaffolding",
      slug: "residential-scaffolding",
      description:
        "Victorian terraces, modern homes, loft conversions, and residential extensions.",
      icon: "🏠",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      textColor: "text-green-900",
      locations: [
        { name: "Brighton", slug: "residential-scaffolding-brighton" },
        { name: "Canterbury", slug: "residential-scaffolding-canterbury" },
        { name: "Hastings", slug: "residential-scaffolding-hastings" },
      ],
    },
    {
      title: "Industrial Scaffolding",
      slug: "industrial-scaffolding",
      description:
        "Heavy-duty systems for ports, manufacturing, and specialized industrial applications.",
      icon: "🏭",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      textColor: "text-orange-900",
      locations: [
        // Note: Industrial location-specific pages don't exist yet, linking to main service
        { name: "Brighton", slug: "industrial-scaffolding" },
        { name: "Canterbury", slug: "industrial-scaffolding" },
        { name: "Hastings", slug: "industrial-scaffolding" },
      ],
    },
  ];

  return (
    <section className={`section-standard bg-gray-50 ${className}`}>
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">{title}</h2>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">{description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {mainServices.map((service) => (
            <div
              key={service.slug}
              className={`border-2 rounded-2xl p-8 transition-all duration-300 ${service.color}`}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <Link
                  href={`/services/${service.slug}`}
                  className={`text-2xl font-bold hover:underline ${service.textColor}`}
                >
                  {service.title}
                </Link>
                <p className="text-gray-800 mt-2 text-sm">{service.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className={`font-semibold ${service.textColor} mb-3`}>Featured Locations:</h4>
                {service.locations.map((location) => (
                  <Link
                    key={location.slug}
                    href={`/services/${location.slug}`}
                    className={`flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200 group`}
                  >
                    <span className="font-medium text-gray-900">{location.name}</span>
                    <svg
                      className="h-4 w-4 text-gray-400 group-hover:text-brand-primary transition-colors"
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
                ))}
                <Link
                  href={`/services/${service.slug}`}
                  className={`block text-center p-3 border-2 border-dashed rounded-lg ${service.textColor} hover:bg-white transition-colors duration-200`}
                >
                  View All {service.title.split(" ")[0]} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            View All Coverage Areas
          </Link>
        </div>
      </div>
    </section>
  );
}
