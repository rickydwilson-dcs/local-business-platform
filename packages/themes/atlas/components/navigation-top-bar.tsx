"use client";

/**
 * TopNavigation
 *
 * Global site navigation with logo, event info button, and hamburger menu
 * Layout: Horizontal bar with logo left, CTA button and hamburger right
 * Category: Navigation
 */

import { useState } from "react";

export interface TopNavigationProps {
  /** logo */
  logo?: string;
  /** event-info-cta */
  eventInfoCta?: Array<{ label?: string; href?: string }>;
  /** hamburger-menu */
  hamburgerMenu?: string;
}

export function TopNavigation(props: TopNavigationProps) {
  return (
      <nav className="bg-brand-primary w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              {props.logo ? (
                <a href="/" aria-label="Go to homepage">
                  <img
                    src={props.logo.src}
                    alt={props.logo.alt ?? 'Site logo'}
                    className="h-8 md:h-10 w-auto object-contain"
                  />
                </a>
              ) : (
                <a
                  href="/"
                  aria-label="Go to homepage"
                  className="text-on-brand-primary font-bold text-xl md:text-2xl tracking-tight"
                >
                  EventBrand
                </a>
              )}
            </div>
  
            {/* Right side: CTA + Hamburger */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Event Info CTA Button */}
              {props['event-info-cta'] && (
                <a
                  href={props['event-info-cta'].href ?? '#event-info'}
                  className="
                    inline-flex items-center justify-center
                    bg-brand-accent text-on-brand-secondary
                    text-sm md:text-base font-semibold
                    px-4 py-2 md:px-6 md:py-2.5
                    rounded-full
                    border border-transparent
                    hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2
                    transition-opacity duration-200
                    whitespace-nowrap
                  "
                  aria-label={props['event-info-cta'].label ?? 'View event information'}
                >
                  {props['event-info-cta'].label ?? 'Event Info'}
                </a>
              )}
  
              {/* Hamburger Menu */}
              {props['hamburger-menu'] && (
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  aria-expanded={props['hamburger-menu'].isOpen ?? false}
                  aria-controls="mobile-menu"
                  onClick={props['hamburger-menu'].onToggle}
                  className="
                    inline-flex items-center justify-center
                    p-2 rounded-md
                    text-on-brand-primary
                    hover:bg-brand-secondary
                    focus:outline-none focus:ring-2 focus:ring-on-brand-primary focus:ring-offset-1
                    transition-colors duration-200
                  "
                >
                  <span className="sr-only">Toggle menu</span>
                  {props['hamburger-menu'].isOpen ? (
                    /* Close icon */
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    /* Hamburger icon */
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
  
        {/* Mobile Menu Drawer */}
        {props['hamburger-menu']?.isOpen && (
          <div
            id="mobile-menu"
            className="bg-brand-primary border-t border-brand-secondary animate-fade-in-up"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {props['hamburger-menu'].links?.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="
                    text-on-brand-primary text-base font-medium
                    py-3 px-2
                    border-b border-brand-secondary last:border-b-0
                    hover:text-brand-accent
                    focus:outline-none focus:text-brand-accent
                    transition-colors duration-150
                  "
                >
                  {link.label}
                </a>
              ))}
              {props['event-info-cta'] && (
                <a
                  href={props['event-info-cta'].href ?? '#event-info'}
                  className="
                    mt-3 inline-flex items-center justify-center
                    bg-brand-accent text-on-brand-secondary
                    text-base font-semibold
                    px-6 py-3 rounded-full
                    hover:opacity-90
                    focus:outline-none focus:ring-2 focus:ring-brand-accent
                    transition-opacity duration-200
                  "
                >
                  {props['event-info-cta'].label ?? 'Event Info'}
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    );
}
