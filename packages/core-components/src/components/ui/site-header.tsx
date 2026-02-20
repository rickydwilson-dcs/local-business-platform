/**
 * SiteHeader — Shared header component for all platform sites.
 *
 * Supports two visual appearances driven by the named theme:
 * - dark  (Orion): black background, white text, red CTA (industrial style)
 * - light (Vega):  white background, gray text, brand CTA (professional style)
 *
 * This is a Server Component — no 'use client' directive.
 * MobileMenu and LocationsDropdown are client components and manage their
 * own interactivity.
 */

import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { MobileMenu } from "./mobile-menu";
import { LocationsDropdown } from "./locations-dropdown";
import type { CountyGroup } from "./locations-dropdown";

export interface SiteHeaderNavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface SiteHeaderProps {
  /**
   * Visual appearance — controls background, text, and nav colours.
   * dark  = Orion theme (black header)
   * light = Vega theme (white header)
   * Defaults to 'light'.
   */
  appearance?: "dark" | "light";

  /** Business / site name, used as logo alt text */
  siteName: string;

  /** Formatted phone number shown to users (e.g. "01234 567 890") */
  phoneDisplay?: string;

  /** Raw phone number for tel: link (e.g. "01234567890") */
  phoneTel?: string;

  /** Whether to show the phone link in desktop actions. Defaults to true. */
  showPhone?: boolean;

  /** Primary CTA button config */
  primaryCta: { label: string; href: string };

  /** Navigation items */
  navigation: SiteHeaderNavItem[];

  /**
   * County-grouped locations for mega-menu (typically used by Orion sites
   * with many locations organised by region).
   */
  counties?: CountyGroup[];

  /**
   * Flat location list for the simple dropdown (used when county grouping
   * is not needed).
   */
  locations?: Array<{ name: string; slug: string }>;

  /** Maximum towns to show per county in the mega-menu. Defaults to 10. */
  maxTownsPerCounty?: number;

  /** Whether to use sticky positioning. Defaults to true. */
  sticky?: boolean;

  /** Logo dimensions. Defaults to width=160, height=40. */
  logoWidth?: number;
  logoHeight?: number;
}

export function SiteHeader({
  appearance = "light",
  siteName,
  phoneDisplay,
  phoneTel,
  showPhone = true,
  primaryCta,
  navigation,
  counties = [],
  locations = [],
  maxTownsPerCounty = 10,
  sticky = true,
  logoWidth = 160,
  logoHeight = 40,
}: SiteHeaderProps) {
  const isDark = appearance === "dark";

  const headerClasses = [
    sticky ? "sticky top-0" : "",
    "z-40",
    isDark ? "bg-surface-inverse border-b border-surface-subtle" : "bg-surface-card border-b border-surface-subtle",
  ]
    .filter(Boolean)
    .join(" ");

  const navLinkClasses = `${isDark ? "text-white" : "text-surface-secondary"} hover:text-brand-primary transition-colors font-medium`;
  const phoneClasses = `flex items-center gap-2 ${isDark ? "text-white" : "text-surface-secondary"} hover:text-brand-primary transition-colors`;

  return (
    <header className={headerClasses}>
      <div className="mx-auto w-full lg:w-[90%] px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex-shrink-0"
            style={{ width: logoWidth, height: logoHeight }}
          >
            <Image
              src="/logo.svg"
              alt={siteName}
              fill
              sizes={`${logoWidth}px`}
              priority
              className="object-contain object-left"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              if (item.hasDropdown && (counties.length > 0 || locations.length > 0)) {
                return (
                  <LocationsDropdown
                    key={item.href}
                    counties={counties}
                    locations={locations}
                    label={item.label}
                    variant={isDark ? "dark" : "light"}
                    maxTownsPerCounty={maxTownsPerCounty}
                  />
                );
              }
              return (
                <Link key={item.href} href={item.href} className={navLinkClasses}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {showPhone && phoneDisplay && phoneTel && (
              <Link href={`tel:${phoneTel}`} className={phoneClasses}>
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">{phoneDisplay}</span>
              </Link>
            )}
            <Link
              href={primaryCta.href}
              className="bg-brand-primary text-on-brand-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
            >
              {primaryCta.label}
            </Link>
          </div>

          {/* Mobile Menu (client component) */}
          <MobileMenu
            phoneDisplay={phoneDisplay ?? ""}
            phoneTel={phoneTel ?? ""}
            locations={locations}
            siteName={siteName}
            navigation={navigation}
            showPhone={showPhone}
            primaryCta={primaryCta}
            variant={isDark ? "dark" : "light"}
          />
        </div>
      </div>
    </header>
  );
}
