"use client";

/**
 * TopNavigation
 *
 * Primary site navigation with logo, nav links and contact CTA button
 * Layout: Horizontal bar with logo left, nav links centre-right, CTA button far right
 * Category: Navigation
 */

import { useState } from "react";

export interface TopNavigationProps {
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
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
}

export function TopNavigation(props: TopNavigationProps) {
  return (
    <nav className="bg-surface-inverse w-full sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <span className="text-on-brand-primary text-xl font-bold tracking-tight">
                {props.logo ?? "Logo"}
              </span>
            </div>
          </div>

          {/* Nav Links - hidden on mobile, visible md+ */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {props.navLinks && props.navLinks.length > 0
              ? props.navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link?.href ?? "#"}
                    className="text-surface-muted-foreground hover:text-on-brand-primary text-sm lg:text-base font-medium transition-colors duration-200 whitespace-nowrap"
                  >
                    {link?.label}
                  </a>
                ))
              : null}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            {props.ctaButton?.label && (
              <a
                href={props.ctaButton?.href ?? "#contact"}
                className="hidden md:inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-sm lg:text-base font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
              >
                {props.ctaButton.label}
              </a>
            )}

            {/* Mobile hamburger menu */}
            <button
              type="button"
              aria-label="Open navigation menu"
              className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-md text-surface-muted-foreground hover:text-on-brand-primary transition-colors duration-200"
            >
              <span className="block w-6 h-0.5 bg-surface-muted-foreground rounded-full"></span>
              <span className="block w-6 h-0.5 bg-surface-muted-foreground rounded-full"></span>
              <span className="block w-6 h-0.5 bg-surface-muted-foreground rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="md:hidden border-t border-surface-muted py-4 flex flex-col gap-3">
          {props.navLinks && props.navLinks.length > 0
            ? props.navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link?.href ?? "#"}
                  className="text-surface-muted-foreground hover:text-on-brand-primary text-base font-medium transition-colors duration-200 py-1"
                >
                  {link?.label}
                </a>
              ))
            : null}
          {props.ctaButton?.label && (
            <a
              href={props.ctaButton?.href ?? "#contact"}
              className="inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-base font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-200 mt-2"
            >
              {props.ctaButton.label}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
