'use client';

export function CoverageMapSection() {
  return (
    <section className="section-standard bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">
            Interactive Coverage Map
          </h2>
          <p className="text-lg text-gray-600 mx-auto w-full lg:w-[85%]">
            Explore our comprehensive coverage across the South East. Click on any town to learn about our local specialists and area expertise.
          </p>
        </div>

        {/* Map Container - Ready for Leaflet.js integration */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                South East Coverage Map
              </h3>
              <p className="text-gray-600 mb-4">
                Interactive map showing our 30+ towns across 4 counties
              </p>
              <div className="text-sm text-gray-500">
                Map integration coming soon - use the town finder above to locate your area
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
              <span className="text-gray-600">Specialist Coverage Towns</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">County Overview Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Heritage Specialists</span>
            </div>
          </div>
        </div>

        {/* Quick Access Counties */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "East Sussex", slug: "east-sussex", towns: 10 },
            { name: "West Sussex", slug: "west-sussex", towns: 8 },
            { name: "Kent", slug: "kent", towns: 7 },
            { name: "Surrey", slug: "surrey", towns: 5 }
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
                <div className="text-sm text-gray-500 mt-1">
                  {county.towns} towns covered
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}