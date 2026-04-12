"use client";

/**
 * TopNavBar
 *
 * Site-wide navigation with logo, primary nav links, CTA button, and hamburger menu for mobile
 * Layout: Full-width horizontal bar with logo left, CTA button and hamburger menu right
 * Category: Navigation
 */

import { useState } from "react";

export interface TopNavBarProps {
  /** logo */
  logo?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
  /** hamburger-menu */
  hamburgerMenu?: string;
}

export function TopNavBar(props: TopNavBarProps) {
  return (
    <header className="w-full bg-brand-primary border-b border-brand-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {props.logo ? (
              <a href="/" className="flex items-center" aria-label="Go to homepage">
                <img
                  src={props.logo}
                  alt="Site logo"
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </a>
            ) : (
              <a href="/" className="flex items-center" aria-label="Go to homepage">
                <span className="text-on-brand-primary text-xl md:text-2xl font-bold tracking-tight">
                  Brand
                </span>
              </a>
            )}
          </div>

          {/* Primary Nav Links — hidden on mobile */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="Primary navigation"
          >
            <a
              href="/"
              className="text-on-brand-primary text-sm font-medium hover:opacity-80 transition-opacity duration-200"
            >
              Home
            </a>
            <a
              href="/about"
              className="text-on-brand-primary text-sm font-medium hover:opacity-80 transition-opacity duration-200"
            >
              About
            </a>
            <a
              href="/services"
              className="text-on-brand-primary text-sm font-medium hover:opacity-80 transition-opacity duration-200"
            >
              Services
            </a>
            <a
              href="/blog"
              className="text-on-brand-primary text-sm font-medium hover:opacity-80 transition-opacity duration-200"
            >
              Blog
            </a>
            <a
              href="/contact"
              className="text-on-brand-primary text-sm font-medium hover:opacity-80 transition-opacity duration-200"
            >
              Contact
            </a>
          </nav>

          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* CTA Button — visible on all sizes */}
            {props.ctaButton !== undefined ? (
              <div className="hidden sm:block">{props.ctaButton}</div>
            ) : (
              <a
                href="/get-started"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-md bg-surface-background text-brand-primary text-sm font-semibold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              >
                Get Started
              </a>
            )}

            {/* Hamburger Menu — visible on mobile only */}
            {props.hamburgerMenu !== undefined ? (
              <div className="md:hidden">{props.hamburgerMenu}</div>
            ) : (
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-on-brand-primary hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-surface-background"
                aria-label="Open main menu"
                aria-expanded="false"
              >
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
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer placeholder — rendered when hamburger is custom */}
      <div className="md:hidden hidden" id="mobile-menu" aria-label="Mobile navigation">
        <nav className="bg-brand-primary border-t border-brand-primary px-4 pt-2 pb-4 flex flex-col gap-2">
          <a
            href="/"
            className="text-on-brand-primary text-base font-medium py-2 hover:opacity-80 transition-opacity duration-200"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-on-brand-primary text-base font-medium py-2 hover:opacity-80 transition-opacity duration-200"
          >
            About
          </a>
          <a
            href="/services"
            className="text-on-brand-primary text-base font-medium py-2 hover:opacity-80 transition-opacity duration-200"
          >
            Services
          </a>
          <a
            href="/blog"
            className="text-on-brand-primary text-base font-medium py-2 hover:opacity-80 transition-opacity duration-200"
          >
            Blog
          </a>
          <a
            href="/contact"
            className="text-on-brand-primary text-base font-medium py-2 hover:opacity-80 transition-opacity duration-200"
          >
            Contact
          </a>
          <a
            href="/get-started"
            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md bg-surface-background text-brand-primary text-sm font-semibold hover:opacity-90 transition-opacity duration-200"
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}
