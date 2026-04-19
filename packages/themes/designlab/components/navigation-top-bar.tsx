"use client";

/**
 * SiteNavigation
 *
 * Primary site navigation with logo and menu links including a highlighted contact CTA button
 * Layout: Horizontal bar with logo left, nav links right, CTA button far right
 * Category: Navigation
 */

import { useState } from "react";

export interface SiteNavigationProps {
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

export function SiteNavigation(props: SiteNavigationProps) {
  return (
    <nav className="bg-surface-inverse w-full sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          {props.logo ? (
            <a href="#" className="flex items-center">
              <span className="text-on-brand-primary text-xl font-bold tracking-tight">
                {props.logo}
              </span>
            </a>
          ) : (
            <span className="text-on-brand-primary text-xl font-bold tracking-tight">Brand</span>
          )}
        </div>

        {/* Nav Links — hidden on mobile, visible md+ */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {props.navLinks && props.navLinks.length > 0 ? (
            props.navLinks.map((link, index) => (
              <a
                key={index}
                href={link?.href ?? "#"}
                className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
              >
                {link?.label}
              </a>
            ))
          ) : (
            <>
              <a
                href="#"
                className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="#"
                className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
              >
                Blog
              </a>
            </>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          {props.ctaButton?.href ? (
            <a
              href={props.ctaButton.href}
              className="bg-brand-primary text-on-brand-primary text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
            >
              {props.ctaButton.label ?? "Contact Us"}
            </a>
          ) : (
            <a
              href="#contact"
              className="bg-brand-primary text-on-brand-primary text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
            >
              Contact Us
            </a>
          )}

          {/* Mobile hamburger placeholder */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Open navigation menu"
          >
            <span className="block w-6 h-0.5 bg-surface-muted-foreground"></span>
            <span className="block w-6 h-0.5 bg-surface-muted-foreground"></span>
            <span className="block w-6 h-0.5 bg-surface-muted-foreground"></span>
          </button>
        </div>
      </div>

      {/* Mobile Nav — visible on small screens */}
      <div className="md:hidden border-t border-surface-muted px-4 pb-4 pt-2 flex flex-col gap-3">
        {props.navLinks && props.navLinks.length > 0 ? (
          props.navLinks.map((link, index) => (
            <a
              key={index}
              href={link?.href ?? "#"}
              className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium transition-colors duration-200"
            >
              {link?.label}
            </a>
          ))
        ) : (
          <>
            <a
              href="#"
              className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium"
            >
              Home
            </a>
            <a
              href="#"
              className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium"
            >
              Services
            </a>
            <a
              href="#"
              className="text-surface-muted-foreground hover:text-on-brand-primary text-sm font-medium"
            >
              Blog
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
