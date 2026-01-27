"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllCounties } from "@/lib/locations-dropdown";
import { getCountyAnchorText, getTownAnchorText } from "@/lib/anchor-text";

interface MobileMenuProps {
  phoneNumber: string;
}

export function MobileMenu({ phoneNumber }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locationsExpanded, setLocationsExpanded] = useState(false);
  const counties = getAllCounties();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Reset locations when closing menu
    if (isOpen) {
      setLocationsExpanded(false);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setLocationsExpanded(false);
  };

  const toggleLocations = () => {
    setLocationsExpanded(!locationsExpanded);
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile/tablet */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleMenu();
        }}
        className="mobile-menu-toggle"
        aria-label="Toggle mobile menu"
        aria-expanded={isOpen}
        type="button"
      >
        <div className="mobile-menu-icon">
          <span className={`mobile-menu-line ${isOpen ? "top-open" : ""}`} />
          <span className={`mobile-menu-line ${isOpen ? "middle-open" : ""}`} />
          <span className={`mobile-menu-line ${isOpen ? "bottom-open" : ""}`} />
        </div>
      </button>

      {/* Full Screen Overlay Menu - Matches the prototype exactly */}
      <div className={`mobile-menu-overlay ${isOpen ? "open" : "closed"}`}>
        {/* Header with Logo and Close Button */}
        <div className="mobile-menu-header">
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <div className="relative w-[140px] h-[36px]">
              <Image
                src="/Colossus-Scaffolding-Logo.svg"
                alt="Colossus Scaffolding"
                width={140}
                height={36}
                className="object-contain"
              />
            </div>
          </Link>
          <button onClick={closeMenu} className="mobile-menu-close" aria-label="Close mobile menu">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links - Large vertical layout */}
        <nav className="mobile-menu-nav">
          <Link href="/services" onClick={closeMenu} className="mobile-menu-link">
            Services
          </Link>

          {/* Locations Expandable Section */}
          <div className="mobile-menu-locations">
            <button
              onClick={toggleLocations}
              className="mobile-menu-link w-full flex items-center justify-center gap-2"
            >
              Locations
              <svg
                className={`w-5 h-5 transition-transform ${locationsExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {locationsExpanded && (
              <div className="mobile-menu-locations-content">
                {counties.map((county, countyIndex) => (
                  <div key={county.slug} className="mobile-menu-county">
                    <Link
                      href={county.href}
                      onClick={closeMenu}
                      className="mobile-menu-county-link"
                    >
                      {getCountyAnchorText(county.name, county.slug, countyIndex, counties.length)}
                    </Link>
                    <div className="mobile-menu-towns">
                      {county.towns.slice(0, 4).map((town, townIndex) => (
                        <Link
                          key={town.slug}
                          href={town.href}
                          onClick={closeMenu}
                          className={`mobile-menu-town-link ${
                            town.isRichContent ? "rich-content" : ""
                          }`}
                        >
                          {getTownAnchorText(town.name, town.slug, countyIndex, townIndex)}
                          {town.isRichContent && <span className="rich-indicator" />}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" onClick={closeMenu} className="mobile-menu-link">
            About
          </Link>
          <Link href="/contact" onClick={closeMenu} className="mobile-menu-link">
            Contact
          </Link>
        </nav>

        {/* Bottom Section with Phone and CTA */}
        <div className="mobile-menu-bottom">
          {/* Phone Number Section */}
          <div className="mobile-menu-phone">
            <div className="mobile-menu-phone-container">
              <svg className="w-6 h-6 text-brand-blue" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <a href={`tel:${phoneNumber}`} className="mobile-menu-phone-link" onClick={closeMenu}>
                {phoneNumber}
              </a>
            </div>
            <p className="mobile-menu-phone-text">24/7 Emergency</p>
          </div>

          {/* Get Free Quote Button */}
          <Link href="/contact" onClick={closeMenu} className="mobile-menu-cta">
            Get Free Quote
          </Link>
        </div>
      </div>
    </>
  );
}
