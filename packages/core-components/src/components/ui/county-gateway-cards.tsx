"use client";

import Link from "next/link";

interface Town {
  name: string;
  slug: string;
  href: string;
}

interface CountyData {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  towns: Town[];
}

interface CountyGatewayCardsProps {
  counties: CountyData[];
}

export function CountyGatewayCards({ counties }: CountyGatewayCardsProps) {
  return (
    <section
      id="county-gateways"
      className="section-standard bg-gradient-to-br from-slate-50 to-slate-100"
    >
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">Explore Our County Coverage</h2>
          <p className="text-lg text-gray-800 mx-auto w-full lg:w-[85%]">
            Each county has unique challenges and requirements. Our local teams understand the
            specific needs of your area.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {counties.map((county) => (
            <div
              key={county.slug}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{county.name}</h3>
                  <div className="text-sm text-gray-700 mb-3">
                    {county.towns.length} towns covered
                  </div>
                </div>
                <Link
                  href={`/locations/${county.slug}`}
                  className="text-brand-primary hover:text-brand-primary-hover"
                  aria-label={`View ${county.name} locations`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>

              <p className="text-gray-800 mb-6">{county.description}</p>

              {/* Highlights */}
              {county.highlights.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Our Specialties:</h4>
                  <div className="space-y-2">
                    {county.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Towns Grid */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Towns Covered:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {county.towns.slice(0, 6).map((town) => (
                    <Link
                      key={town.slug}
                      href={town.href}
                      className="text-sm text-gray-800 hover:text-brand-primary transition-colors flex items-center gap-1"
                    >
                      {town.name}
                    </Link>
                  ))}
                </div>
                {county.towns.length > 6 && (
                  <Link
                    href={`/locations/${county.slug}`}
                    className="text-sm text-brand-primary hover:text-brand-primary-hover font-medium mt-2 inline-block"
                  >
                    +{county.towns.length - 6} more towns →
                  </Link>
                )}
              </div>

              {/* CTA */}
              <Link href={`/locations/${county.slug}`} className="btn-primary w-full text-center">
                View {county.name} Towns
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
