"use client";

/**
 * TopNavigation
 *
 * Global site navigation with logo, primary CTA button, and hamburger menu, present on every page
 * Layout: Full-width horizontal bar with logo left, CTA button and hamburger menu right
 * Category: Navigation
 */

import { useState } from "react";

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
          className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between"
          aria-label="Global navigation"
        >
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            {props.logo ? (
              <a href="/" aria-label="Go to homepage">
                {typeof props.logo === 'string' ? (
                  <img
                    src={props.logo}
                    alt="Site logo"
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  props.logo
                )}
              </a>
            ) : (
              <a
                href="/"
                className="text-on-brand-primary text-xl font-bold tracking-tight"
                aria-label="Go to homepage"
              >
                Brand
              </a>
            )}
          </div>
  
          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Primary CTA Button */}
            {props['cta-button'] ? (
              <div className="hidden md:block">
                {props['cta-button']}
              </div>
            ) : (
              <a
                href="/get-started"
                className="hidden md:inline-flex items-center justify-center bg-brand-accent text-on-brand-primary font-semibold text-sm px-5 py-2.5 rounded-md transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                Get Started
              </a>
            )}
  
            {/* Hamburger Menu */}
            {props['hamburger-menu'] ? (
              <div className="flex items-center">
                {props['hamburger-menu']}
              </div>
            ) : (
              <button
                type="button"
                aria-label="Open navigation menu"
                aria-expanded="false"
                aria-controls="mobile-menu"
                className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-md text-on-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-opacity hover:opacity-80"
              >
                <span className="block w-6 h-0.5 bg-brand-on-primary rounded-full" />
                <span className="block w-6 h-0.5 bg-brand-on-primary rounded-full" />
                <span className="block w-6 h-0.5 bg-brand-on-primary rounded-full" />
              </button>
            )}
          </div>
        </nav>
      </header>
    );
}
