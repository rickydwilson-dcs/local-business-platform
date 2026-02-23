"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";

/**
 * SiteFooter
 *
 * Site-wide footer with navigation links grouped by category, logo, social icons, and copyright, present on every page
 * Layout: Dark purple background; four-column link groups (Events, Support, Legal, Company) with logo, social icons, and copyright
 * Category: Footer
 */

import { useState } from "react";

export interface SiteFooterProps {
  /** events-links */
  eventsLinks?: Array<{ label?: string; href?: string }>;
  /** support-links */
  supportLinks?: Array<{ label?: string; href?: string }>;
  /** legal-links */
  legalLinks?: Array<{ label?: string; href?: string }>;
  /** company-links */
  companyLinks?: Array<{ label?: string; href?: string }>;
  /** footer-logo */
  footerLogo?: string;
  /** social-icons */
  socialIcons?: string;
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
      <footer className="bg-brand-primary text-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
              {/* Logo + Social */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                {props['footer-logo'] && (
                  <div className="mb-2">
                    <img
                      src={props['footer-logo'].src}
                      alt={props['footer-logo'].alt ?? 'Site logo'}
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                )}
                {props['social-icons'] && props['social-icons'].length > 0 && (
                  <div className="flex items-center gap-4">
                    {props['social-icons'].map((icon, index) => (
                      <a
                        key={index}
                        href={icon.href}
                        aria-label={icon.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200"
                      >
                        {icon.icon ? (
                          <span className="w-5 h-5 block">{icon.icon}</span>
                        ) : (
                          <span className="w-5 h-5 block text-sm">{icon.label}</span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
  
              {/* Events Links */}
              <div className="flex flex-col gap-3">
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                  Events
                </h3>
                <nav aria-label="Events navigation">
                  <ul className="flex flex-col gap-2">
                    {props['events-links']?.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
  
              {/* Support Links */}
              <div className="flex flex-col gap-3">
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                  Support
                </h3>
                <nav aria-label="Support navigation">
                  <ul className="flex flex-col gap-2">
                    {props['support-links']?.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
  
              {/* Legal Links */}
              <div className="flex flex-col gap-3">
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                  Legal
                </h3>
                <nav aria-label="Legal navigation">
                  <ul className="flex flex-col gap-2">
                    {props['legal-links']?.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
  
              {/* Company Links */}
              <div className="flex flex-col gap-3">
                <h3 className="text-brand-accent font-semibold text-sm uppercase tracking-widest mb-2">
                  Company
                </h3>
                <nav aria-label="Company navigation">
                  <ul className="flex flex-col gap-2">
                    {props['company-links']?.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-surface-muted-foreground hover:text-brand-accent text-sm transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </RevealOnScroll>
  
          {/* Divider */}
          <div className="border-t border-surface-muted pt-8">
            <p className="text-surface-muted-foreground text-sm text-center md:text-left">
              {props.copyright ?? `© ${new Date().getFullYear()} All rights reserved.`}
            </p>
          </div>
        </div>
      </footer>
    );
}
