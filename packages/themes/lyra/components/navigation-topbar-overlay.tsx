"use client";

/**
 * SiteHeader
 *
 * Global site navigation with logo, CTA button, and hamburger menu
 * Layout: Horizontal bar with logo left, nav actions right
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
      <header className="w-full bg-surface-background border-b border-surface-muted sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
  
            {/* Logo */}
            <div className="flex-shrink-0">
              {props.logo ? (
                <a href="/" aria-label="Go to homepage" className="flex items-center gap-2">
                  {props.logo.image ? (
                    <img
                      src={props.logo.image}
                      alt={props.logo.alt || 'Site logo'}
                      className="h-8 md:h-10 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-xl md:text-2xl font-bold text-brand-primary">
                      {props.logo.text || 'Brand'}
                    </span>
                  )}
                </a>
              ) : (
                <a href="/" aria-label="Go to homepage">
                  <span className="text-xl md:text-2xl font-bold text-brand-primary">
                    Brand
                  </span>
                </a>
              )}
            </div>
  
            {/* Desktop Nav Actions */}
            <nav
              className="hidden md:flex items-center gap-4 lg:gap-6"
              aria-label="Primary navigation"
            >
              {props['cta-button'] && (
                <a
                  href={props['cta-button'].href || '#'}
                  className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-brand-primary text-on-brand-primary text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  {props['cta-button'].label || 'Get Started'}
                </a>
              )}
            </nav>
  
            {/* Mobile: CTA + Hamburger */}
            <div className="flex md:hidden items-center gap-3">
              {props['cta-button'] && (
                <a
                  href={props['cta-button'].href || '#'}
                  className="inline-flex items-center justify-center px-4 py-1.5 rounded-md bg-brand-primary text-on-brand-primary text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  {props['cta-button'].label || 'Get Started'}
                </a>
              )}
  
              {props['hamburger-menu'] && (
                <button
                  type="button"
                  aria-label="Open navigation menu"
                  aria-expanded={props['hamburger-menu'].isOpen || false}
                  aria-controls="mobile-menu"
                  onClick={props['hamburger-menu'].onToggle}
                  className="inline-flex items-center justify-center p-2 rounded-md text-surface-foreground hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <span className="sr-only">Toggle menu</span>
                  {props['hamburger-menu'].isOpen ? (
                    /* Close icon */
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    /* Hamburger icon */
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
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
  
        {/* Mobile Drawer Menu */}
        {props['hamburger-menu']?.isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden bg-surface-background border-t border-surface-muted animate-fade-in-up"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {props['hamburger-menu'].links?.map((link: { href: string; label: string }, index: number) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-surface-foreground text-base font-medium hover:text-brand-primary transition-colors py-1 border-b border-surface-muted last:border-0"
                >
                  {link.label}
                </a>
              ))}
              {props['cta-button'] && (
                <a
                  href={props['cta-button'].href || '#'}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-brand-primary text-on-brand-primary text-sm font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 mt-2"
                >
                  {props['cta-button'].label || 'Get Started'}
                </a>
              )}
            </div>
          </div>
        )}
      </header>
    );
}
