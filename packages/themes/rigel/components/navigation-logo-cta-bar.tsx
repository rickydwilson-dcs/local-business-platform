"use client";

/**
 * SiteHeader
 *
 * Global site navigation with logo, primary CTA button, and hamburger menu
 * Layout: Horizontal bar with logo left, CTA button and hamburger menu right
 * Category: Navigation
 */

import { useState } from "react";

export interface SiteHeaderProps {
  /** logo */
  logo?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
  /** hamburger-menu */
  hamburgerMenu?: string;
}

export function SiteHeader(props: SiteHeaderProps) {
  return (
      <header className="bg-brand-primary w-full sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            {props.logo ? (
              <div className="text-on-brand-primary font-bold text-xl">
                {props.logo}
              </div>
            ) : (
              <span className="text-on-brand-primary font-bold text-xl tracking-tight">
                MySite
              </span>
            )}
          </div>
  
          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* CTA Button */}
            {props.ctaButton && (
              <div className="hidden sm:block">
                <div className="bg-brand-accent text-on-brand-primary px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer">
                  {props.ctaButton}
                </div>
              </div>
            )}
  
            {/* Hamburger Menu */}
            {props.hamburgerMenu ? (
              <div className="flex items-center justify-center text-on-brand-primary cursor-pointer">
                {props.hamburgerMenu}
              </div>
            ) : (
              <button
                aria-label="Open navigation menu"
                className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-md text-on-brand-primary hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <span className="block w-6 h-0.5 bg-brand-on-primary rounded-full" />
                <span className="block w-6 h-0.5 bg-brand-on-primary rounded-full" />
                <span className="block w-6 h-0.5 bg-brand-on-primary rounded-full" />
              </button>
            )}
          </div>
        </div>
  
        {/* Mobile CTA (visible on small screens) */}
        {props.ctaButton && (
          <div className="sm:hidden border-t border-brand-secondary px-4 py-3 bg-brand-primary">
            <div className="bg-brand-accent text-on-brand-primary px-5 py-2 rounded-full font-semibold text-sm text-center hover:opacity-90 transition-opacity cursor-pointer w-full">
              {props.ctaButton}
            </div>
          </div>
        )}
      </header>
    );
}
