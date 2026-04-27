"use client";

/**
 * PrimaryNavigation
 *
 * Main site navigation with logo, nav links, search and contact CTA
 * Layout: Horizontal bar: logo left, nav links center, search icon and contact button right
 * Category: Navigation
 */

import { useState } from "react";

export interface PrimaryNavigationProps {
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
  /** search-icon */
  searchIcon?: string;
  /** contact-button */
  contactButton?: { label?: string; href?: string };
}

export function PrimaryNavigation(props: PrimaryNavigationProps) {
  return (
    <nav className="bg-surface-background border-b border-surface-muted sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-brand-primary font-bold text-xl md:text-2xl">
              {props.logo ?? "Logo"}
            </span>
          </div>

          {/* Nav Links — center, hidden on mobile */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {props.navLinks && Array.isArray(props.navLinks) ? (
              props.navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link?.href ?? "#"}
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  {link?.label}
                </a>
              ))
            ) : (
              <>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  Services
                </a>
                <a
                  href="#"
                  className="text-surface-foreground hover:text-brand-primary text-sm lg:text-base font-medium transition-colors duration-200"
                >
                  Blog
                </a>
              </>
            )}
          </div>

          {/* Right side: Search + Contact CTA */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Icon */}
            <button
              aria-label="Search"
              className="text-surface-foreground hover:text-brand-primary transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {props.searchIcon ? (
                <img src={props.searchIcon} alt="Search" className="w-5 h-5" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              )}
            </button>

            {/* Contact CTA Button */}
            <a
              href={props.contactButton?.href ?? "#contact"}
              className="hidden md:inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-sm lg:text-base font-semibold px-4 py-2 lg:px-6 lg:py-2.5 rounded-md hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              {props.contactButton?.label ?? "Contact Us"}
            </a>

            {/* Mobile menu button */}
            <button
              aria-label="Open menu"
              className="md:hidden text-surface-foreground hover:text-brand-primary transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="md:hidden border-t border-surface-muted py-3 flex flex-col gap-2">
          {props.navLinks && Array.isArray(props.navLinks) ? (
            props.navLinks.map((link, index) => (
              <a
                key={index}
                href={link?.href ?? "#"}
                className="text-surface-foreground hover:text-brand-primary text-base font-medium px-2 py-1.5 rounded-md transition-colors duration-200"
              >
                {link?.label}
              </a>
            ))
          ) : (
            <>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-base font-medium px-2 py-1.5 rounded-md transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-base font-medium px-2 py-1.5 rounded-md transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-base font-medium px-2 py-1.5 rounded-md transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="#"
                className="text-surface-foreground hover:text-brand-primary text-base font-medium px-2 py-1.5 rounded-md transition-colors duration-200"
              >
                Blog
              </a>
            </>
          )}
          <a
            href={props.contactButton?.href ?? "#contact"}
            className="mt-2 inline-flex items-center justify-center bg-brand-primary text-on-brand-primary text-base font-semibold px-4 py-2 rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            {props.contactButton?.label ?? "Contact Us"}
          </a>
        </div>
      </div>
    </nav>
  );
}
