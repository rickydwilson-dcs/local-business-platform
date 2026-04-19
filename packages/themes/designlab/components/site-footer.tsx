"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * SiteFooter
 *
 * Site-wide footer with contact details, service links, useful links, social media icons, and copyright bar
 * Layout: Four-column grid: contact, services, useful links, social follow; dark background with copyright bar below
 * Category: Footer
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SiteFooterProps {
  /** contact-info */
  contactInfo?: Array<{ icon?: string; text?: string; [key: string]: string | undefined }>;
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
  socialIcons?: Array<{
    href?: string;
    label?: string;
    icon?: string;
    [key: string]: string | undefined;
  }>;
  /** copyright */
  copyright?: string;
}

export function SiteFooter(props: SiteFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Contact Info */}
          <RevealOnScroll variant="fade-up">
            <div>
              <h3 className="text-brand-primary text-lg font-semibold mb-6 uppercase tracking-wider">
                Contact Us
              </h3>
              {props.contactInfo && (
                <ul className="space-y-3">
                  {props.contactInfo.map(
                    (
                      item: { icon?: string; text?: string; [key: string]: string | undefined },
                      index: number
                    ) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-surface-muted-foreground text-sm leading-relaxed"
                      >
                        {item.icon && (
                          <span className="text-brand-primary mt-0.5 shrink-0" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        <span>{item.text}</span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </RevealOnScroll>

          {/* Column 2: Services Links */}
          <div>
            <h3 className="text-brand-primary text-lg font-semibold mb-6 uppercase tracking-wider">
              Our Services
            </h3>
            {props.servicesLinks && (
              <ul className="space-y-3">
                {props.servicesLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link?.href}
                      className="text-surface-muted-foreground text-sm hover:text-brand-primary transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                        aria-hidden="true"
                      />
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h3 className="text-brand-primary text-lg font-semibold mb-6 uppercase tracking-wider">
              Useful Links
            </h3>
            {props.usefulLinks && (
              <ul className="space-y-3">
                {props.usefulLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link?.href}
                      className="text-surface-muted-foreground text-sm hover:text-brand-primary transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                        aria-hidden="true"
                      />
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 4: Social Follow */}
          <RevealOnScroll variant="fade-up">
            <div>
              <h3 className="text-brand-primary text-lg font-semibold mb-6 uppercase tracking-wider">
                Follow Us
              </h3>
              <p className="text-surface-muted-foreground text-sm mb-6 leading-relaxed">
                Stay connected with us on social media for the latest updates and news.
              </p>
              {props.socialIcons && (
                <div className="flex flex-wrap gap-3">
                  {props.socialIcons.map(
                    (
                      social: {
                        href?: string;
                        label?: string;
                        icon?: string;
                        [key: string]: string | undefined;
                      },
                      index: number
                    ) => (
                      <a
                        key={index}
                        href={social?.href}
                        aria-label={social?.label}
                        className="w-10 h-10 rounded-full bg-surface-foreground flex items-center justify-center text-surface-background hover:bg-brand-primary transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social?.icon && (
                          <span className="text-base" aria-hidden="true">
                            {social.icon}
                          </span>
                        )}
                      </a>
                    )
                  )}
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-muted" />

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-surface-muted-foreground text-sm text-center md:text-left">
            {props.copyright ?? `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              className="text-surface-muted-foreground text-xs hover:text-brand-primary transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-surface-muted-foreground text-xs hover:text-brand-primary transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="/sitemap"
              className="text-surface-muted-foreground text-xs hover:text-brand-primary transition-colors duration-200"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
