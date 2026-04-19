"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * SiteFooter
 *
 * Site-wide footer with contact details, service links, useful links and social media icons
 * Layout: Four-column grid: contact, services, useful links, follow us — with copyright bar below
 * Category: Footer
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SiteFooterProps {
  /** contact-info */
  contactInfo?: { address?: string; phone?: string; email?: string };
  /** services-links */
  servicesLinks?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** useful-links */
  usefulLinks?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** social-icons */
  socialIcons?: string;
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Contact Info */}
          <RevealOnScroll variant="fade-up">
            <div>
              <h3 className="text-brand-primary text-lg font-semibold mb-4 uppercase tracking-wide">
                Contact Us
              </h3>
              {props.contactInfo ? (
                <div className="space-y-3 text-surface-muted-foreground text-sm leading-relaxed">
                  {props.contactInfo.address && (
                    <p className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0 text-brand-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{props.contactInfo.address}</span>
                    </p>
                  )}
                  {props.contactInfo.phone && (
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 shrink-0 text-brand-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a
                        href={`tel:${props.contactInfo.phone}`}
                        className="hover:text-brand-primary transition-colors duration-200"
                      >
                        {props.contactInfo.phone}
                      </a>
                    </p>
                  )}
                  {props.contactInfo.email && (
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 shrink-0 text-brand-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={`mailto:${props.contactInfo.email}`}
                        className="hover:text-brand-primary transition-colors duration-200"
                      >
                        {props.contactInfo.email}
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-surface-muted-foreground text-sm">
                  <p className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 mt-0.5 shrink-0 text-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <span>123 Business Street, City, Country</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 shrink-0 text-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>+1 (555) 000-0000</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 shrink-0 text-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>hello@example.com</span>
                  </p>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* Column 2: Services Links */}
          <div>
            <h3 className="text-brand-primary text-lg font-semibold mb-4 uppercase tracking-wide">
              Our Services
            </h3>
            <ul className="space-y-2">
              {props.servicesLinks && props.servicesLinks.length > 0
                ? props.servicesLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link?.href ?? "#"}
                        className="text-surface-muted-foreground text-sm hover:text-brand-primary transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          aria-hidden="true"
                        />
                        {link?.label}
                      </a>
                    </li>
                  ))
                : ["Web Design", "Development", "SEO", "Marketing"].map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-surface-muted-foreground text-sm hover:text-brand-primary transition-colors duration-200 flex items-center gap-1.5 group"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          aria-hidden="true"
                        />
                        {item}
                      </a>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
