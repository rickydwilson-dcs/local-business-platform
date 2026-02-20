"use client";

import { CoverageMap, type TownLocation } from "./coverage-map";

interface CountySummary {
  name: string;
  slug: string;
  townCount: number;
}

interface CoverageMapSectionProps {
  locations: TownLocation[];
  counties: CountySummary[];
  center?: [number, number];
  zoom?: number;
}

export function CoverageMapSection({ locations, counties, center, zoom }: CoverageMapSectionProps) {
  return (
    <section className="section-standard bg-gradient-to-br from-surface-subtle to-surface-subtle">
      <div className="container-standard">
        <div className="text-center mb-12">
          <h2 className="heading-section">Interactive Coverage Map</h2>
          <p className="text-lg text-surface-foreground mx-auto w-full lg:w-[85%]">
            Explore our comprehensive coverage across the South East. Click on any town marker to
            learn about our local specialists and area expertise.
          </p>
        </div>

        {/* Interactive Map */}
        <div className="relative bg-surface-card rounded-2xl shadow-sm border border-surface-subtle p-4 md:p-8">
          <CoverageMap
            locations={locations}
            center={center}
            zoom={zoom}
            height="h-[500px] md:h-96"
          />

          {/* Map Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-surface-foreground">East Sussex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <span className="text-surface-foreground">West Sussex</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-surface-foreground">Kent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-surface-foreground">Surrey</span>
            </div>
          </div>

          {/* Mobile Map Instructions */}
          <div className="mt-4 text-center md:hidden">
            <p className="text-sm text-surface-secondary">
              Tap any marker to view town details • Pinch to zoom • Drag to explore
            </p>
          </div>
        </div>

        {/* Quick Access Counties */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {counties.map((county) => (
            <a
              key={county.slug}
              href={`/locations/${county.slug}`}
              className="block bg-surface-card rounded-lg p-4 border border-surface-subtle hover:border-brand-primary hover:shadow-md transition-all group"
            >
              <div className="text-center">
                <div className="font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors">
                  {county.name}
                </div>
                <div className="text-sm text-surface-secondary mt-1">{county.townCount} towns covered</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
