"use client";

import Link from "next/link";
import { getAllCounties } from "@/lib/locations-dropdown";

export function CountyGatewayCards() {
  const counties = getAllCounties();

  const countyData = [
    {
      name: "East Sussex",
      slug: "east-sussex",
      description:
        "From Brighton's seafront heritage to Hastings' medieval buildings and Eastbourne's Victorian terraces",
      highlights: [
        "Coastal engineering specialists",
        "Heritage building experts",
        "Conservation area compliance",
      ],
    },
    {
      name: "West Sussex",
      slug: "west-sussex",
      description:
        "Crawley's commercial growth to Worthing's coastal developments and Horsham's market town heritage",
      highlights: [
        "Commercial development specialists",
        "Aviation sector experience",
        "Rural property expertise",
      ],
    },
    {
      name: "Kent",
      slug: "kent",
      description:
        "Canterbury's World Heritage sites to Maidstone's county facilities and Dover's port developments",
      highlights: [
        "World Heritage specialists",
        "Cathedral city expertise",
        "Port and marine projects",
      ],
    },
    {
      name: "Surrey",
      slug: "surrey",
      description:
        "Guildford's cathedral city to university campuses and affluent residential developments",
      highlights: [
        "University project specialists",
        "High-value residential",
        "Cathedral and heritage work",
      ],
    },
  ];

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
          {countyData.map((county) => {
            const countyInfo = counties.find((c) => c.slug === county.slug);

            return (
              <div
                key={county.slug}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{county.name}</h3>
                    <div className="text-sm text-gray-700 mb-3">
                      {countyInfo?.towns.length || 0} towns covered
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

                {/* Towns Grid */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Towns Covered:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {countyInfo?.towns.slice(0, 6).map((town) => (
                      <Link
                        key={town.slug}
                        href={town.href}
                        className="text-sm text-gray-800 hover:text-brand-primary transition-colors flex items-center gap-1"
                      >
                        {town.name}
                        {town.isRichContent && (
                          <span
                            className="w-1.5 h-1.5 bg-brand-primary rounded-full"
                            title="Specialist coverage"
                          ></span>
                        )}
                      </Link>
                    ))}
                  </div>
                  {countyInfo && countyInfo.towns.length > 6 && (
                    <Link
                      href={`/locations/${county.slug}`}
                      className="text-sm text-brand-primary hover:text-brand-primary-hover font-medium mt-2 inline-block"
                    >
                      +{countyInfo.towns.length - 6} more towns →
                    </Link>
                  )}
                </div>

                {/* CTA */}
                <Link href={`/locations/${county.slug}`} className="btn-primary w-full text-center">
                  View {county.name} Towns
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
