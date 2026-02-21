'use client';

/**
 * TopNavigation
 *
 * Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile
 * Layout: Full-width horizontal bar with logo left, CTA button and hamburger menu right
 * Category: Navigation
 */

import { useState } from 'react';

export interface TopNavigationProps {
  /** logo */
  logo?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
  /** hamburger-menu */
  hamburgerMenu?: string;
}

export function TopNavigation(props: TopNavigationProps) {
  return (
    <header className="w-full bg-brand-primary shadow-md">
      <nav
        className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          {props.logo ? (
            props.logo
          ) : (
            <span className="text-on-brand-primary text-xl font-bold tracking-tight">
              EventBrand
            </span>
          )}
        </div>

        {/* Right side: CTA + Hamburger */}
        <div className="flex items-center gap-3">
          {/* CTA Button */}
          <div className="hidden sm:block">
            {props["cta-button"] ? (
              props["cta-button"]
            ) : (
              <button
                type="button"
                className="bg-brand-accent text-on-brand-secondary font-semibold text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                Get Event Info
              </button>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="flex items-center">
            {props["hamburger-menu"] ? (
              props["hamburger-menu"]
            ) : (
              <button
                type="button"
                aria-label="Open menu"
                className="text-on-brand-primary p-2 rounded-md hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-accent"
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
            )}
          </div>

          {/* CTA visible on mobile below sm */}
          <div className="block sm:hidden">
            {!props["cta-button"] && (
              <button
                type="button"
                className="bg-brand-accent text-on-brand-secondary font-semibold text-xs px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                Event Info
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
