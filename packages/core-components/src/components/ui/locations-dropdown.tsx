"use client";

import { HeaderNavDropdown } from "./header-nav-dropdown";
import type { HeaderDropdownConfig } from "./header-nav-dropdown";

export interface LocationItem {
  name: string;
  slug: string;
}

export interface CountyGroup {
  name: string;
  slug: string;
  href: string;
  towns: Array<{
    name: string;
    slug: string;
    href: string;
    isRichContent?: boolean;
  }>;
}

export interface LocationsDropdownProps {
  locations?: LocationItem[];
  counties?: CountyGroup[];
  maxTownsPerCounty?: number;
  label?: string;
  variant?: "dark" | "light";
  /** @deprecated No longer used. */
  buttonClassName?: string;
}

/**
 * @deprecated Use HeaderNavDropdown with a `dropdown` config on the
 * nav item instead. This wrapper remains for backwards compat only.
 */
export function LocationsDropdown({
  locations = [],
  counties = [],
  maxTownsPerCounty = 10,
  label = "Locations",
  variant = "light",
}: LocationsDropdownProps) {
  const config: HeaderDropdownConfig =
    counties.length > 0
      ? {
          mode: "mega",
          groups: counties.map((c) => ({
            label: c.name,
            items: c.towns
              .slice(0, maxTownsPerCounty)
              .map((t) => ({ label: t.name, href: t.href })),
          })),
          title: "Our Coverage Areas",
          subtitle: "Professional services across the region",
          footerCta: { label: "Get Free Quote", href: "/contact" },
        }
      : {
          mode: "mega",
          items: locations.map((l) => ({
            label: l.name,
            href: `/locations/${l.slug}`,
          })),
          title: "Service Areas",
          subtitle: "We proudly serve these locations",
          footerLink: {
            label: "View all service areas →",
            href: "/locations",
          },
        };
  return <HeaderNavDropdown config={config} label={label} variant={variant} />;
}
