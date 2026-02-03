'use client';

/**
 * Mobile Menu Component
 *
 * Full-screen mobile navigation with animated hamburger toggle.
 * Reads navigation items from site.config.ts.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/site.config';

interface LocationItem {
  name: string;
  slug: string;
}

interface MobileMenuProps {
  phoneDisplay: string;
  phoneTel: string;
  locations?: LocationItem[];
}

export function MobileMenu({ phoneDisplay, phoneTel, locations = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locationsExpanded, setLocationsExpanded] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    setLocationsExpanded(false);
  };

  const hasLocations = locations.length > 0;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-md hover:bg-gray-200 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-50 lg:hidden transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <Link href="/" onClick={closeMenu} className="relative h-10 w-36">
            <Image
              src="/logo.svg"
              alt={siteConfig.name}
              fill
              className="object-contain object-left"
              sizes="144px"
            />
          </Link>
          <button
            onClick={closeMenu}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-6 py-6">
          <ul className="space-y-4">
            {siteConfig.navigation.main.map((item) => {
              // Handle locations dropdown separately
              if (item.hasDropdown && hasLocations) {
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => setLocationsExpanded(!locationsExpanded)}
                      className="flex items-center justify-between w-full text-xl font-medium text-slate-800 py-2"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          locationsExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {locationsExpanded && (
                      <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                        <Link
                          href="/locations"
                          onClick={closeMenu}
                          className="block text-base text-brand-primary font-semibold py-1"
                        >
                          View All Locations
                        </Link>
                        {locations.slice(0, 8).map((location) => (
                          <Link
                            key={location.slug}
                            href={`/locations/${location.slug}`}
                            onClick={closeMenu}
                            className="block text-base text-slate-600 hover:text-brand-primary py-1"
                          >
                            {location.name}
                          </Link>
                        ))}
                        {locations.length > 8 && (
                          <Link
                            href="/locations"
                            onClick={closeMenu}
                            className="block text-sm text-brand-primary py-1"
                          >
                            + {locations.length - 8} more areas
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block text-xl font-medium text-slate-800 py-2 hover:text-brand-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom CTA Section */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-gray-200 bg-gray-50">
          {siteConfig.cta.phone.show && (
            <Link
              href={`tel:${phoneTel}`}
              className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-800 mb-4"
            >
              <Phone className="w-6 h-6 text-brand-primary" />
              {phoneDisplay}
            </Link>
          )}
          <Link
            href={siteConfig.cta.primary.href}
            onClick={closeMenu}
            className="block w-full bg-brand-primary text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
          >
            {siteConfig.cta.primary.label}
          </Link>
        </div>
      </div>
    </>
  );
}
