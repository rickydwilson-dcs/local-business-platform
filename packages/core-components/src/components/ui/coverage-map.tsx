"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TOWN_LOCATIONS, MAP_CENTER, MAP_ZOOM, type TownLocation } from "@/lib/town-locations";

// Dynamically import the MapContainer to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface CoverageMapProps {
  className?: string;
  height?: string;
}

export function CoverageMap({ className = "", height = "h-96" }: CoverageMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletModule, setLeafletModule] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      setLeafletModule(L);

      // Fix for default markers not showing
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });
    });

    // Add accessibility labels to Leaflet controls after map loads
    const timer = setTimeout(() => {
      const zoomInBtn = document.querySelector(".leaflet-control-zoom-in");
      const zoomOutBtn = document.querySelector(".leaflet-control-zoom-out");
      const attributionLinks = document.querySelectorAll(".leaflet-control-attribution a");

      if (zoomInBtn) {
        zoomInBtn.setAttribute("aria-label", "Zoom in");
        zoomInBtn.setAttribute("title", "Zoom in");
      }
      if (zoomOutBtn) {
        zoomOutBtn.setAttribute("aria-label", "Zoom out");
        zoomOutBtn.setAttribute("title", "Zoom out");
      }

      // Add accessible names to attribution links
      attributionLinks.forEach((link) => {
        const href = (link as HTMLAnchorElement).href;
        if (href.includes("openstreetmap.org")) {
          link.setAttribute("aria-label", "OpenStreetMap contributors");
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const createCustomIcon = (leaflet: typeof import("leaflet"), county: string) => {
    /* eslint-disable no-restricted-syntax -- Leaflet map markers require inline hex colors */
    const colors: { [key: string]: string } = {
      "East Sussex": "#2563eb",
      "West Sussex": "#059669",
      Kent: "#dc2626",
      Surrey: "#7c3aed",
    };

    const color = colors[county] || "#4DB2E4";
    /* eslint-enable no-restricted-syntax */
    const size = 28;

    return new leaflet.DivIcon({
      html: `
        <div class="relative" role="button" aria-label="${county} coverage area" tabindex="0">
          <div
            class="rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            style="
              background-color: ${color};
              width: ${size}px;
              height: ${size}px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            "
          >
            <svg width="12" height="12" fill="white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        </div>
      `,
      className: "custom-div-icon",
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  };

  if (!isClient || !leafletModule) {
    return (
      <div
        className={`${height} bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-brand-primary animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <div className="text-gray-800">Loading interactive map...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${height} bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Colossus Scaffolding Coverage'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {TOWN_LOCATIONS.map((location: TownLocation) => (
          <Marker
            key={location.name}
            position={location.coords}
            icon={createCustomIcon(leafletModule, location.county)}
            eventHandlers={{
              click: () => {
                window.location.href = location.url;
              },
            }}
            aria-label={`View ${location.name} scaffolding services`}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{location.name}</h3>
                </div>

                <div className="text-sm text-gray-800 mb-2">{location.county}</div>

                {location.description && (
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {location.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      /* eslint-disable no-restricted-syntax -- Map legend requires inline hex colors */
                      style={{
                        backgroundColor:
                          {
                            "East Sussex": "#2563eb",
                            "West Sussex": "#059669",
                            Kent: "#dc2626",
                            Surrey: "#7c3aed",
                          }[location.county] || "#4DB2E4",
                      }}
                      /* eslint-enable no-restricted-syntax */
                    ></div>
                    <span className="text-xs text-gray-700">{location.county}</span>
                  </div>

                  <button
                    onClick={() => (window.location.href = location.url)}
                    className="text-xs bg-brand-primary text-white px-2 py-1 rounded hover:bg-brand-primary-hover transition-colors"
                    aria-label={`View ${location.name} details`}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
