"use client";

/**
 * TopNavBar
 *
 * Global site navigation with logo, primary CTA button, and hamburger menu, present on every page
 * Layout: Horizontal bar with logo left, CTA button and hamburger menu right
 * Category: Navigation
 */

import { useState } from "react";

export interface TopNavBarProps {
  /** site-logo */
  siteLogo?: string;
  /** nav-links */
  navLinks?: Array<{ label?: string; href?: string }>;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
  /** hamburger-menu */
  hamburgerMenu?: string;
}

export function TopNavBar(props: TopNavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle ctaButton as array (pages pass [{label, href}])
  const cta = Array.isArray(props.ctaButton) ? props.ctaButton[0] : props.ctaButton;
  const ctaHref = cta?.href ?? '#';
  const ctaLabel = cta?.label ?? 'Get Started';

  return (
    <header className="w-full bg-brand-primary border-b border-brand-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {props.siteLogo ? (
              <a href="/" aria-label="Go to homepage" className="flex items-center">
                <img
                  src={props.siteLogo}
                  alt="Site logo"
                  className="h-8 w-auto object-contain"
                />
              </a>
            ) : (
              <a href="/" aria-label="Go to homepage" className="text-on-brand-primary font-bold text-xl tracking-tight">
                Brand
              </a>
            )}
          </div>

          {/* Desktop Nav Links */}
          {props.navLinks && props.navLinks.length > 0 && (
            <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
              {props.navLinks.map((link: { label?: string; href?: string }, index: number) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-on-brand-primary text-sm font-medium hover:text-brand-accent transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            {/* CTA Button — visible on desktop */}
            {cta && (
              <a
                href={ctaHref}
                className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-md bg-brand-accent text-on-brand-primary text-sm font-semibold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                {ctaLabel}
              </a>
            )}

            {/* Hamburger Menu Button — visible on mobile */}
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-on-brand-primary hover:bg-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-accent"
            >
              {props.hamburgerMenu ? (
                <img src={props.hamburgerMenu} alt="" aria-hidden="true" className="h-6 w-6" />
              ) : menuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-brand-primary border-t border-brand-primary"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
            {props.navLinks && props.navLinks.map((link: { label?: string; href?: string }, index: number) => (
              <a
                key={index}
                href={link.href}
                className="block px-3 py-2 rounded-md text-on-brand-primary text-sm font-medium hover:bg-brand-secondary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            {cta && (
              <a
                href={ctaHref}
                className="mt-2 inline-flex items-center justify-center px-5 py-2 rounded-md bg-brand-accent text-on-brand-primary text-sm font-semibold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
              >
                {ctaLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
