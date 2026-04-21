import { CoverageMapClient } from "./coverage-map-section.client";
import type { LayoutParams } from "./layout-params";

export interface CoverageMapSectionSlots {
  showSectionHeading: boolean;
  showIntro: boolean;
  showMarkerList: boolean;
}

export const COVERAGE_MAP_DEFAULT_SLOTS: CoverageMapSectionSlots = {
  showSectionHeading: true,
  showIntro: true,
  showMarkerList: true,
};

export interface Marker {
  name: string;
  lat: number;
  lng: number;
  href?: string;
}

export interface CoverageMapData {
  center: [number, number];
  zoom: number;
  markers: Marker[];
  heading?: string;
  intro?: string;
}

interface CoverageMapSectionProps {
  slots?: Partial<CoverageMapSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function CoverageMapSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: CoverageMapSectionProps) {
  const slots = { ...COVERAGE_MAP_DEFAULT_SLOTS, ...slotOverrides };
  const coverage = data as unknown as CoverageMapData;
  const markers = Array.isArray(coverage.markers) ? coverage.markers : [];
  if (!coverage.center || !coverage.zoom || markers.length === 0) return null;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-on-brand-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="CoverageMapSection">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        {slots.showSectionHeading && coverage.heading && (
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
            {coverage.heading}
          </h2>
        )}
        {slots.showIntro && coverage.intro && (
          <p className="text-base text-center opacity-80 mb-10 max-w-2xl mx-auto leading-relaxed">
            {coverage.intro}
          </p>
        )}
        <CoverageMapClient center={coverage.center} zoom={coverage.zoom} markers={markers} />

        {slots.showMarkerList && (
          <ul className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {markers.map((marker) => (
              <li
                key={`${marker.name}-${marker.lat}-${marker.lng}`}
                data-map-marker="list"
                className="text-sm text-surface-foreground"
              >
                {marker.href ? (
                  <a href={marker.href} className="hover:text-brand-primary transition-colors">
                    {marker.name}
                  </a>
                ) : (
                  marker.name
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
