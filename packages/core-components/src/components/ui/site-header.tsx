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
import { HeaderNavDropdown } from "./header-nav-dropdown";
import type { HeaderDropdownConfig } from "./header-nav-dropdown";
import type { CountyGroup } from "./locations-dropdown";

export interface SiteHeaderNavItem {
  label: string;
  href: string;
  /** @deprecated Use `dropdown` instead. */
  hasDropdown?: boolean;
  dropdown?: HeaderDropdownConfig;
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
   * @deprecated Pass per-item `dropdown` config on `navigation` items instead.
   * County-grouped locations for mega-menu (typically used by Orion sites
   * with many locations organised by region).
   */
  counties?: CountyGroup[];

  /**
   * @deprecated Pass per-item `dropdown` config on `navigation` items instead.
   * Flat location list for the simple dropdown (used when county grouping
   * is not needed).
   */
  locations?: Array<{ name: string; slug: string }>;

  /**
   * @deprecated Pass per-item `dropdown` config on `navigation` items instead.
   * Maximum towns to show per county in the mega-menu. Defaults to 10.
   */
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
    isDark
      ? "bg-surface-inverse border-b border-surface-subtle"
      : "bg-surface-card border-b border-surface-subtle",
  ]
    .filter(Boolean)
    .join(" ");

  const navLinkClasses = `text-xs ${isDark ? "text-white" : "text-surface-secondary"} hover:text-brand-primary transition-colors font-medium`;
  const phoneClasses = `text-xs flex items-center gap-2 ${isDark ? "text-white" : "text-surface-secondary"} hover:text-brand-primary transition-colors`;

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
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              // 1. Explicit per-item dropdown config wins.
              if (item.dropdown) {
                return (
                  <HeaderNavDropdown
                    key={item.href}
                    config={item.dropdown}
                    label={item.label}
                    variant={isDark ? "dark" : "light"}
                  />
                );
              }

              // 2. Legacy adapter: synthesise a config from top-level props.
              if (item.hasDropdown && (counties.length > 0 || locations.length > 0)) {
                const legacyConfig: HeaderDropdownConfig =
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
                return (
                  <HeaderNavDropdown
                    key={item.href}
                    config={legacyConfig}
                    label={item.label}
                    variant={isDark ? "dark" : "light"}
                  />
                );
              }

              // 3. Plain nav link.
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
              className="text-xs bg-brand-primary text-on-brand-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
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
