"use client";

/**
 * Locations Dropdown Component
 *
 * Desktop navigation dropdown for service areas/locations.
 * Two modes:
 * - Simple: flat list of locations (for sites with few locations)
 * - Mega menu: county-grouped layout (for sites with many locations)
 *
 * Pass `counties` for the grouped mega-menu, or just `locations` for the simple grid.
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface LocationItem {
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
  /** Array of location items for simple dropdown */
  locations: LocationItem[];
  /** County groups for mega-menu layout (used instead of simple grid when provided) */
  counties?: CountyGroup[];
  /** Label for the dropdown trigger button */
  label?: string;
  /** Maximum towns to show per county in mega-menu */
  maxTownsPerCounty?: number;
}

export function LocationsDropdown({
  locations,
  counties,
  label = "Locations",
  maxTownsPerCounty = 6,
}: LocationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (locations.length === 0 && (!counties || counties.length === 0)) {
    return (
      <Link
        href="/locations"
        className="text-gray-700 hover:text-brand-primary transition-colors font-medium"
      >
        {label}
      </Link>
    );
  }

  const useMegaMenu = counties && counties.length > 0;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-700 hover:text-brand-primary transition-colors font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen &&
        (useMegaMenu ? (
          <MegaMenuDropdown
            counties={counties}
            maxTownsPerCounty={maxTownsPerCounty}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <SimpleDropdown locations={locations} onClose={() => setIsOpen(false)} />
        ))}
    </div>
  );
}

/** Simple grid dropdown for sites with few locations */
function SimpleDropdown({
  locations,
  onClose,
}: {
  locations: LocationItem[];
  onClose: () => void;
}) {
  const gridCols =
    locations.length > 8 ? "grid-cols-3" : locations.length > 4 ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px] max-w-[600px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Service Areas</h3>
        <p className="text-sm text-gray-500">We proudly serve these locations</p>
      </div>

      {/* Locations Grid */}
      <div className={`grid ${gridCols} gap-1 p-2`}>
        {locations.map((location: LocationItem) => (
          <Link
            key={location.slug}
            href={`/locations/${location.slug}`}
            onClick={onClose}
            className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
          >
            {location.name}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-surface-muted rounded-b-lg">
        <Link
          href="/locations"
          onClick={onClose}
          className="text-sm text-brand-primary hover:text-brand-primary-hover font-medium"
        >
          View all service areas &rarr;
        </Link>
      </div>
    </div>
  );
}

/** Mega-menu dropdown for sites with county-grouped locations */
function MegaMenuDropdown({
  counties,
  maxTownsPerCounty,
  onClose,
}: {
  counties: CountyGroup[];
  maxTownsPerCounty: number;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full left-0 mt-2 w-[900px] max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Coverage Areas</h3>
          <p className="text-sm text-gray-800">Professional services across the region</p>
        </div>

        {/* Counties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
          {counties.map((county) => (
            <div key={county.slug} className="space-y-3">
              {/* County Header */}
              <Link
                href={county.href}
                className="block text-base font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors border-b border-gray-200 pb-2"
                onClick={onClose}
              >
                {county.name}
              </Link>

              {/* Towns List */}
              <ul className="space-y-2">
                {county.towns.slice(0, maxTownsPerCounty).map((town) => (
                  <li key={town.slug}>
                    <Link
                      href={town.href}
                      className={`block text-sm transition-colors ${
                        town.isRichContent
                          ? "text-gray-900 font-medium hover:text-brand-primary"
                          : "text-gray-800 hover:text-gray-900"
                      }`}
                      onClick={onClose}
                    >
                      {town.name}
                      {town.isRichContent && (
                        <span
                          className="ml-1 inline-block w-2 h-2 bg-brand-primary rounded-full"
                          title="Detailed coverage"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <p className="text-sm text-gray-800">
              Can&apos;t find your area? We cover the entire region.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
              onClick={onClose}
            >
              Get Free Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
