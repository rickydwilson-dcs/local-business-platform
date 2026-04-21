"use client";

import { useEffect, useState } from "react";
import type { Marker } from "./coverage-map-section";

// react-leaflet is loaded dynamically inside this client component so SSR
// doesn't try to evaluate it (it references `window`/`document` at load).

interface CoverageMapClientProps {
  center: [number, number];
  zoom: number;
  markers: Marker[];
  className?: string;
}

export function CoverageMapClient({ center, zoom, markers, className }: CoverageMapClientProps) {
  const [mod, setMod] = useState<typeof import("react-leaflet") | null>(null);
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, L]) => {
      if (cancelled) return;
      setMod(rl);
      setLeaflet(L);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mod || !leaflet) {
    return (
      <div
        role="img"
        aria-label="Coverage map loading"
        className={`bg-surface-subtle border border-surface-subtle rounded-2xl ${className ?? ""}`}
        style={{ aspectRatio: "16 / 9", minHeight: "320px" }}
      />
    );
  }

  const { MapContainer, TileLayer, Marker: RLMarker, Popup } = mod;
  const icon = leaflet.divIcon({
    className: "",
    html: `<span style="display:inline-block;width:12px;height:12px;border-radius:9999px;background:var(--color-brand-primary);box-shadow:0 0 0 4px rgba(255,255,255,0.85);" data-map-marker></span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  return (
    <div className={`rounded-2xl overflow-hidden border border-surface-subtle ${className ?? ""}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "420px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <RLMarker
            key={`${marker.name}-${marker.lat}-${marker.lng}`}
            position={[marker.lat, marker.lng]}
            icon={icon}
          >
            <Popup>
              <strong>{marker.name}</strong>
            </Popup>
          </RLMarker>
        ))}
      </MapContainer>
    </div>
  );
}
