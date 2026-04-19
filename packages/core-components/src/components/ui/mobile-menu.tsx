"use client";

/**
 * Mobile Menu Component
 *
 * Full-screen mobile navigation with animated hamburger toggle.
 * All configuration is passed via props for cross-site compatibility.
 * Supports both light and dark theme variants.
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFocusTrap } from "../../hooks/useFocusTrap";

interface LocationItem {
  name: string;
  slug: string;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface MobileMenuProps {
  /** Formatted phone number for display */
  phoneDisplay: string;
  /** Phone number for tel: link (digits only) */
  phoneTel: string;
  /** Locations to show in expandable section */
  locations?: LocationItem[];
  /** Site name for logo alt text */
  siteName?: string;
  /** Navigation items (defaults to standard nav if not provided) */
  navigation?: NavItem[];
  /** Whether to show the phone CTA */
  showPhone?: boolean;
  /** Primary CTA button config */
  primaryCta?: {
    label: string;
    href: string;
  };
  /** Theme variant - controls hamburger and header background colors */
  variant?: "light" | "dark";
}

export function MobileMenu({
  phoneDisplay,
  phoneTel,
  locations = [],
  siteName = "",
  navigation,
  showPhone = true,
  primaryCta = { label: "Get Free Quote", href: "/contact" },
  variant = "light",
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locationsExpanded, setLocationsExpanded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    setLocationsExpanded(false);
  };

  const { containerRef: menuRef } = useFocusTrap({
    isOpen,
    onEscape: closeMenu,
    initialFocusRef: closeButtonRef,
  });

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const hasLocations = locations.length > 0;

  // Default navigation items if none provided
  const navItems: NavItem[] = navigation || [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Locations", href: "/locations", hasDropdown: true },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Theme-specific classes
  const isDark = variant === "dark";
  const hamburgerColor = isDark ? "bg-white" : "bg-surface-foreground";
  const menuBg = isDark ? "bg-surface-inverse" : "bg-surface-card";
  const menuTextColor = isDark ? "text-white" : "text-surface-foreground";
  const menuBorderColor = isDark ? "border-surface-subtle" : "border-surface-subtle";
  const hoverBg = isDark ? "hover:bg-surface-inverse" : "hover:bg-surface-subtle";

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden p-2 rounded-md transition-colors ${hoverBg}`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 ${hamburgerColor} transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 ${hamburgerColor} transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 ${hamburgerColor} transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`fixed inset-0 ${menuBg} z-50 lg:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${menuBorderColor}`}>
          <Link href="/" onClick={closeMenu} className="relative h-10 w-36">
            <Image
              src="/logo.svg"
              alt={siteName || "Home"}
              fill
              className="object-contain object-left"
              sizes="144px"
            />
          </Link>
          <button
            ref={closeButtonRef}
            onClick={closeMenu}
            className={`p-2 rounded-md transition-colors ${hoverBg}`}
            aria-label="Close menu"
          >
            <svg
              className={`w-6 h-6 ${menuTextColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* Navigation Links */}
        <nav aria-label="Mobile navigation" className="px-6 py-6">
          <ul className="space-y-4">
            {navItems.map((item: NavItem) => {
              // Handle locations dropdown separately
              if (item.hasDropdown && hasLocations) {
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => setLocationsExpanded(!locationsExpanded)}
                      aria-expanded={locationsExpanded}
                      className={`flex items-center justify-between w-full text-xl font-medium ${menuTextColor} py-2`}
                    >
                      <span>{item.label}</span>
                      <svg
                        aria-hidden="true"
                        className={`w-5 h-5 transition-transform duration-200 ${
                          locationsExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                      <div className={`mt-2 ml-4 space-y-2 border-l-2 border-surface-subtle pl-4`}>
                        <Link
                          href="/locations"
                          onClick={closeMenu}
                          className="block text-base text-brand-primary font-semibold py-1"
                        >
                          View All Locations
                        </Link>
                        {locations.slice(0, 8).map((location: LocationItem) => (
                          <Link
                            key={location.slug}
                            href={`/locations/${location.slug}`}
                            onClick={closeMenu}
                            className={`block text-base py-1 hover:text-brand-primary ${isDark ? "text-surface-muted-foreground" : "text-surface-tertiary"}`}
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
                    className={`block text-xl font-medium ${menuTextColor} py-2 hover:text-brand-primary transition-colors`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom CTA Section */}
        <div
          className={`absolute bottom-0 left-0 right-0 px-6 py-6 border-t ${menuBorderColor} ${isDark ? "bg-surface-inverse" : "bg-surface-muted"}`}
        >
          {showPhone && (
            <Link
              href={`tel:${phoneTel}`}
              className={`flex items-center justify-center gap-2 text-2xl font-bold ${menuTextColor} mb-4`}
            >
              <svg
                className="w-6 h-6 text-brand-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {phoneDisplay}
            </Link>
          )}
          <Link
            href={primaryCta.href}
            onClick={closeMenu}
            className="block w-full bg-brand-primary text-on-brand-primary text-center py-3 px-6 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
          >
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </>
  );
}
