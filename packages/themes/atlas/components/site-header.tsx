"use client";

/**
 * SiteHeader
 *
 * Global site navigation with logo, primary CTA button, and hamburger menu, present on every page
 * Layout: Full-width horizontal bar with logo left, CTA button and hamburger menu right
 * Category: Navigation
 */

import { useState } from "react";

export interface SiteHeaderProps {
  /** logo */
  logo?: string;
  /** nav-links */
  navLinks?: Array<{ label?: string; href?: string }>;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
  /** hamburger-menu */
  hamburgerMenu?: string;
}

export function SiteHeader(props: SiteHeaderProps) {
  return (
      <header className="w-full bg-brand-primary sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            {props.logo?.image ? (
              <img
                src={props.logo.image}
                alt={props.logo.alt ?? 'Site logo'}
                className="h-8 md:h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-on-brand-primary text-xl md:text-2xl font-bold tracking-tight">
                {props.logo?.text ?? 'Brand'}
              </span>
            )}
          </div>
  
          {/* Desktop Nav Links */}
          {props['nav-links'] && props['nav-links'].length > 0 && (
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-6 lg:gap-8"
            >
              {props['nav-links'].map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.href ?? '#'}
                  className="text-on-brand-primary text-sm lg:text-base font-medium hover:text-brand-accent transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
  
          {/* Right Side: CTA + Hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* CTA Button */}
            {props['cta-button'] && (
              <a
                href={props['cta-button'].href ?? '#'}
                className="hidden sm:inline-flex items-center justify-center bg-brand-accent text-on-brand-primary text-sm md:text-base font-semibold px-4 py-2 md:px-6 md:py-2.5 rounded-full hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
              >
                {props['cta-button'].label ?? 'Get Started'}
              </a>
            )}
  
            {/* Hamburger Menu */}
            {props['hamburger-menu'] !== false && (
              <button
                type="button"
                aria-label="Open navigation menu"
                aria-expanded="false"
                aria-controls="mobile-menu"
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <span className="block w-6 h-0.5 bg-on-brand-primary rounded-full" />
                <span className="block w-6 h-0.5 bg-on-brand-primary rounded-full" />
                <span className="block w-4 h-0.5 bg-on-brand-primary rounded-full self-start ml-1" />
              </button>
            )}
          </div>
        </div>
  
        {/* Mobile Menu Drawer (static, toggled via JS externally) */}
        <div
          id="mobile-menu"
          className="md:hidden bg-brand-primary border-t border-surface-muted hidden"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col px-4 py-4 gap-4">
            {props['nav-links'] &&
              props['nav-links'].map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.href ?? '#'}
                  className="text-on-brand-primary text-base font-medium py-2 border-b border-surface-muted last:border-0 hover:text-brand-accent transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
  
            {props['cta-button'] && (
              <a
                href={props['cta-button'].href ?? '#'}
                className="inline-flex items-center justify-center bg-brand-accent text-on-brand-primary text-base font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity duration-200 mt-2"
              >
                {props['cta-button'].label ?? 'Get Started'}
              </a>
            )}
          </nav>
        </div>
      </header>
    );
}
