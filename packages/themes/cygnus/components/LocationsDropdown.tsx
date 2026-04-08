"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface LocationItem {
  name: string;
  slug: string;
}

interface CygnusLocationsDropdownProps {
  locations: LocationItem[];
  label: string;
  buttonClassName: string;
}

export function CygnusLocationsDropdown({
  locations,
  label,
  buttonClassName,
}: CygnusLocationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
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
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClassName}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="cygnus-locations-menu"
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          id="cygnus-locations-menu"
          role="menu"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] max-w-[95vw] bg-[#1c1b1b] border border-[#544435] rounded-lg shadow-2xl z-50"
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-[#544435]/60">
            <p className="text-[#f7941d] font-body uppercase tracking-[0.25em] font-bold text-[10px]">
              Service Areas — East Sussex
            </p>
          </div>

          {/* Locations grid */}
          <div className="p-4 grid grid-cols-3 gap-1">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/locations/${location.slug}`}
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="px-3 py-2 rounded text-sm text-[#e5e2e1] font-body hover:bg-[#f7941d]/10 hover:text-[#f7941d] transition-colors duration-150"
              >
                {location.name}
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#544435]/60">
            <Link
              href="/locations"
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#f7941d] font-body font-semibold uppercase tracking-widest hover:text-[#e8850a] transition-colors"
            >
              View all locations &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
