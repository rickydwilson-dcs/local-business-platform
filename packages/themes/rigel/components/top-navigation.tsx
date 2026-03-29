"use client";

/**
 * TopNavigation
 *
 * Site-wide navigation bar with logo, primary CTA button, and hamburger menu for mobile
 * Layout: Horizontal bar with logo left, CTA button and hamburger menu icon right
 * Category: Navigation
 */

import { useState } from "react";

export interface TopNavigationProps {
  /** logo image src path */
  logo?: string;
  /** nav links — defaults to About, Blog, Contact */
  navLinks?: Array<{ label: string; href: string }>;
  /** cta label */
  ctaLabel?: string;
  /** cta href */
  ctaHref?: string;
}

const DEFAULT_NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function TopNavigation(props: TopNavigationProps) {
  const [open, setOpen] = useState(false);
  const links = props.navLinks ?? DEFAULT_NAV_LINKS;

  return (
    <nav className="bg-surface-background border-b border-surface-muted sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              {props.logo ? (
                <img src={props.logo} alt="Site logo" className="h-8 w-auto" />
              ) : (
                <span className="text-brand-secondary font-bold text-xl tracking-tight">
                  COLOR // CODE
                </span>
              )}
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Inline links — desktop */}
            <div className="hidden md:flex items-center gap-6 mr-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-surface-foreground hover:text-brand-secondary font-medium text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <a
              href={props.ctaHref ?? '/contact'}
              className="hidden md:inline-flex items-center justify-center bg-brand-secondary text-brand-primary font-semibold text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              {props.ctaLabel ?? 'Get Started'}
            </a>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-surface-foreground hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {open ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="border-t border-surface-muted bg-surface-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-surface-foreground hover:text-brand-secondary hover:bg-surface-muted rounded-md font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-surface-muted">
              <a
                href={props.ctaHref ?? '/contact'}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 bg-brand-secondary text-brand-primary font-semibold rounded-md text-center hover:opacity-90 transition-opacity"
              >
                {props.ctaLabel ?? 'Get Started'}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
