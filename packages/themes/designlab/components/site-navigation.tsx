"use client";

/**
 * SiteNavigation
 *
 * Primary site navigation with logo, nav links including a services dropdown, and a highlighted contact CTA button
 * Layout: Horizontal bar with logo left, nav links centre-right, CTA button far right
 * Category: Navigation
 */

import { useState } from "react";

export interface SiteNavigationProps {
  /** logo */
  logo?: string;
  /** nav-links */
  navLinks?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** services-dropdown */
  servicesDropdown?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
}

export function SiteNavigation(props: SiteNavigationProps) {
  return (
    <nav className="bg-surface-inverse w-full sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {props.logo ? (
              <a href="#" className="flex items-center">
                <span className="text-on-brand-primary text-xl font-bold tracking-tight">
                  {props.logo ?? "Brand"}
                </span>
              </a>
            ) : (
              <span className="text-on-brand-primary text-xl font-bold tracking-tight">
                {props.logo ?? "Brand"}
              </span>
            )}
          </div>

          {/* Desktop Nav Links + CTA */}
          <div className="hidden md:flex items-center gap-6">
            {/* Nav Links */}
            {props.navLinks &&
              Array.isArray(props.navLinks) &&
              props.navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link?.href ?? "#"}
                  className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
                >
                  {link?.label}
                </a>
              ))}

            {/* Services Dropdown */}
            {props.servicesDropdown && (
              <div className="relative group">
                <button
                  className="flex items-center gap-1 text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {props.servicesDropdown ?? "Services"}
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* CTA Button */}
            {props.ctaButton && (
              <a
                href={props.ctaButton?.href ?? "#"}
                className="ml-4 inline-flex items-center justify-center px-5 py-2 rounded-full bg-brand-primary text-on-brand-primary text-sm font-semibold hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              >
                {props.ctaButton?.label ?? "Contact Us"}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-surface-muted-foreground hover:text-on-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
              aria-label="Open main menu"
              aria-expanded="false"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer (static, no JS toggle for SSR safety) */}
      <div
        className="md:hidden border-t border-surface-muted bg-surface-inverse px-4 pb-4 pt-2 hidden"
        aria-label="Mobile navigation"
      >
        {props.navLinks &&
          Array.isArray(props.navLinks) &&
          props.navLinks.map((link, index) => (
            <a
              key={index}
              href={link?.href ?? "#"}
              className="block py-2 text-sm text-surface-muted-foreground hover:text-on-brand-primary transition-colors duration-150"
            >
              {link?.label}
            </a>
          ))}

        {props.servicesDropdown && (
          <div className="py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted-foreground mb-1">
              {props.servicesDropdown ?? "Services"}
            </p>
          </div>
        )}

        {props.ctaButton && (
          <a
            href={props.ctaButton?.href ?? "#"}
            className="mt-3 block w-full text-center px-5 py-2 rounded-full bg-brand-primary text-on-brand-primary text-sm font-semibold hover:bg-brand-secondary transition-colors duration-200"
          >
            {props.ctaButton?.label ?? "Contact Us"}
          </a>
        )}
      </div>
    </nav>
  );
}
