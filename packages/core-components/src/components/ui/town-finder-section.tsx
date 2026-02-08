"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Town {
  name: string;
  slug: string;
  href: string;
}

interface County {
  name: string;
  slug: string;
  towns: Town[];
}

interface TownFinderSectionProps {
  counties: County[];
}

export function TownFinderSection({ counties }: TownFinderSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("all");

  const allTowns = useMemo(() => {
    return counties.flatMap((county) =>
      county.towns.map((town) => ({
        ...town,
        county: county.name,
        countySlug: county.slug,
      }))
    );
  }, [counties]);

  const filteredTowns = useMemo(() => {
    let filtered = allTowns;

    if (selectedCounty !== "all") {
      filtered = filtered.filter((town) => town.countySlug === selectedCounty);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (town) =>
          town.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          town.county.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.slice(0, 12); // Limit results
  }, [allTowns, searchTerm, selectedCounty]);

  return (
    <section id="town-finder" className="section-standard bg-white">
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">Find Your Local Specialist</h2>
          <p className="text-lg text-gray-800 mx-auto w-full lg:w-[85%]">
            Enter your town name or select a county to connect with local experts who understand
            your requirements.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label htmlFor="town-search" className="sr-only">
                Search for your town
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  id="town-search"
                  type="text"
                  placeholder="Enter town name or postcode..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="md:w-48">
              <label htmlFor="county-filter" className="sr-only">
                Filter by county
              </label>
              <select
                id="county-filter"
                className="block w-full py-3 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                value={selectedCounty}
                onChange={(e) => setSelectedCounty(e.target.value)}
              >
                <option value="all">All Counties</option>
                {counties.map((county) => (
                  <option key={county.slug} value={county.slug}>
                    {county.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {filteredTowns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTowns.map((town) => (
                <Link
                  key={town.slug}
                  href={town.href}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-brand-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                        {town.name}
                      </div>
                      <div className="text-sm text-gray-700">{town.county}</div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors"
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
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-700 mb-4">
                <svg
                  className="w-12 h-12 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                No towns found matching your search.
              </div>
              <p className="text-gray-800 mb-6">
                We may still be able to help. Contact us to discuss your project location.
              </p>
              <Link href="/contact" className="btn-primary">
                Contact Our Team
              </Link>
            </div>
          )}

          {searchTerm === "" && selectedCounty === "all" && (
            <div className="text-center mt-8">
              <p className="text-gray-800 mb-4">
                Showing a sample of our coverage areas. Use the search above to find your specific
                location.
              </p>
              <Link
                href="#county-gateways"
                className="text-brand-primary hover:text-brand-primary-hover font-medium"
              >
                Browse by County →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
