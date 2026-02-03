'use client';

/**
 * Locations Dropdown Component
 *
 * Desktop navigation dropdown for service areas/locations.
 * Shows a grid of locations when expanded.
 */

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface LocationItem {
  name: string;
  slug: string;
}

interface LocationsDropdownProps {
  locations: LocationItem[];
  label?: string;
}

export function LocationsDropdown({ locations, label = 'Locations' }: LocationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (locations.length === 0) {
    return (
      <Link
        href="/locations"
        className="text-gray-700 hover:text-brand-primary transition-colors font-medium"
      >
        {label}
      </Link>
    );
  }

  // Determine grid columns based on number of locations
  const gridCols =
    locations.length > 8 ? 'grid-cols-3' : locations.length > 4 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-700 hover:text-brand-primary transition-colors font-medium"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px] max-w-[600px]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Service Areas</h3>
            <p className="text-sm text-gray-500">We proudly serve these locations</p>
          </div>

          {/* Locations Grid */}
          <div className={`grid ${gridCols} gap-1 p-2`}>
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
              >
                {location.name}
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <Link
              href="/locations"
              onClick={() => setIsOpen(false)}
              className="text-sm text-brand-primary hover:text-brand-primary-hover font-medium"
            >
              View all service areas &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
