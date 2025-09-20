"use client";

import { CoverageMap } from "@/components/ui/coverage-map";

export function CoverageMapSection() {
  return (
    <section className="section-standard bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">Interactive Coverage Map</h2>
          <p className="text-lg text-gray-800 mx-auto w-full lg:w-[85%]">
            Explore our comprehensive coverage across the South East. Click on any town marker to
            learn about our local specialists and area expertise.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-8">
          <CoverageMap height="h-[500px] md:h-96" />

          {/* Map Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-gray-800">East Sussex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <span className="text-gray-800">West Sussex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-gray-800">Kent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-gray-800">Surrey</span>
            </div>
          </div>

          {/* Mobile Map Instructions */}
          <div className="mt-4 text-center md:hidden">
            <p className="text-sm text-gray-700">
              Tap any marker to view town details • Pinch to zoom • Drag to explore
            </p>
          </div>
        </div>

        {/* Quick Access Counties */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "East Sussex", slug: "east-sussex", towns: 10 },
            { name: "West Sussex", slug: "west-sussex", towns: 8 },
            { name: "Kent", slug: "kent", towns: 7 },
            { name: "Surrey", slug: "surrey", towns: 5 },
          ].map((county) => (
            <a
              key={county.slug}
              href={`/locations/${county.slug}`}
              className="block bg-white rounded-lg p-4 border border-gray-200 hover:border-brand-blue hover:shadow-md transition-all group"
            >
              <div className="text-center">
                <div className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                  {county.name}
                </div>
                <div className="text-sm text-gray-700 mt-1">{county.towns} towns covered</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
