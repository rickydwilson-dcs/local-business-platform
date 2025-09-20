"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getAllCounties } from "@/lib/locations-dropdown";

export function LocationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const counties = getAllCounties();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-slate-700 hover:text-brand-blue transition-colors text-lg font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Locations
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[900px] max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Coverage Areas</h3>
              <p className="text-sm text-gray-800">
                Professional scaffolding services across the South East
              </p>
            </div>

            {/* Counties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
              {counties.map((county) => (
                <div key={county.slug} className="space-y-3">
                  {/* County Header */}
                  <Link
                    href={county.href}
                    className="block text-base font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors border-b border-gray-200 pb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {county.name}
                  </Link>

                  {/* Towns List */}
                  <ul className="space-y-2">
                    {county.towns.slice(0, 6).map((town) => (
                      <li key={town.slug}>
                        <Link
                          href={town.href}
                          className={`block text-sm transition-colors ${
                            town.isRichContent
                              ? "text-gray-900 font-medium hover:text-brand-blue"
                              : "text-gray-800 hover:text-gray-800"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {town.name}
                          {town.isRichContent && (
                            <span
                              className="ml-1 inline-block w-2 h-2 bg-brand-blue rounded-full"
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
                <div>
                  <p className="text-sm text-gray-800">
                    Can&apos;t find your area? We cover the entire South East region.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-brand-blue-hover"
                  onClick={() => setIsOpen(false)}
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
      )}
    </div>
  );
}
