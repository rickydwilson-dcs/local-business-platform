/**
 * Town Locations - Stub for smiths-electrical-cambridge
 *
 * This file provides type-compatible exports required by shared components
 * (e.g., CoverageMap) that import from "@/lib/town-locations".
 *
 * Customize this file with your business's actual town/location data
 * if you use the CoverageMap component.
 */

export interface TownLocation {
  name: string;
  coords: [number, number];
  county: string;
  url: string;
  isRichContent?: boolean;
  description?: string;
}

export const TOWN_LOCATIONS: TownLocation[] = [];

export const MAP_CENTER: [number, number] = [51.5074, -0.1278]; // London default
export const MAP_ZOOM = 9;
