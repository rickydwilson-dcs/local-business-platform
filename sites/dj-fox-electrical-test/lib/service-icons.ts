import {
  Zap,
  Wrench,
  Home,
  Lightbulb,
  Plug,
  Battery,
  Shield,
  Tv,
  Camera,
  Sun,
  Car,
  Settings,
  Search,
  CircuitBoard,
  type LucideIcon,
} from "lucide-react";

/**
 * Map service slugs to appropriate Lucide icons
 * Returns a default icon (Zap) if no match is found
 *
 * Note: The order of conditions matters - more specific checks should come first
 */
export function getServiceIcon(slug: string): LucideIcon {
  // Exact slug matches for homepage services (first 6)
  const slugMap: Record<string, LucideIcon> = {
    "emergency-electrical-callout": Zap,
    "power-outage-restoration": CircuitBoard,
    "fault-finding": Search,
    "consumer-unit-upgrade": Settings,
    rewiring: Home,
    "additional-sockets": Plug,
  };

  if (slugMap[slug]) {
    return slugMap[slug];
  }

  // Emergency services
  if (slug.includes("emergency") || slug.includes("outage")) {
    return Zap;
  }

  // Installations
  if (slug.includes("installation") || slug.includes("install")) {
    if (slug.includes("ev-charger") || slug.includes("car")) return Car;
    if (slug.includes("lighting") || slug.includes("light")) return Lightbulb;
    if (slug.includes("socket") || slug.includes("plug")) return Plug;
    if (slug.includes("cctv") || slug.includes("camera")) return Camera;
    if (slug.includes("solar")) return Sun;
    if (slug.includes("battery")) return Battery;
    return Home;
  }

  // Repairs & Maintenance
  if (slug.includes("repair") || slug.includes("maintenance")) {
    return Wrench;
  }

  // Testing & Certification
  if (slug.includes("testing") || slug.includes("certificate") || slug.includes("inspection")) {
    return Shield;
  }

  // Fault finding / diagnostics
  if (slug.includes("fault") || slug.includes("diagnostic")) {
    return Search;
  }

  // Lighting
  if (slug.includes("lighting") || slug.includes("light") || slug.includes("led")) {
    return Lightbulb;
  }

  // Smart home / Data
  if (slug.includes("smart") || slug.includes("data") || slug.includes("network")) {
    return Tv;
  }

  // Upgrades / Rewiring
  if (slug.includes("upgrade") || slug.includes("rewiring") || slug.includes("rewire")) {
    return Settings;
  }

  // Default fallback
  return Zap;
}
