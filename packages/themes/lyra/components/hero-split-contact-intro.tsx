"use client";

/**
 * ContactHero
 *
 * Left-side heading and contact information panel introducing the contact page
 * Layout: Two-column split: left has label, heading and contact info cards; right has contact form
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContactHeroProps {
  /** section-label */
  sectionLabel?: string;
  /** heading */
  heading?: string;
  /** address */
  address?: string;
  /** business-hours */
  businessHours?: string;
  /** phone-cta */
  phoneCta?: { label?: string; href?: string };
  /** support-centre-link */
  supportCentreLink?: { label?: string; href?: string };
  /** zendesk-link */
  zendeskLink?: { label?: string; href?: string };
}

export function ContactHero(props: ContactHeroProps) {
  return (
    <section className="bg-surface-background py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Panel */}
        <div className="flex flex-col gap-8">
          <RevealOnScroll variant="fade-up">
            {props.sectionLabel && (
              <span className="text-brand-primary text-sm font-semibold uppercase tracking-widest">
                {props.sectionLabel}
              </span>
            )}
            {props.heading && (
              <h1 className="text-surface-foreground text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mt-3">
                {props.heading}
              </h1>
            )}
          </RevealOnScroll>

          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-4">
              {/* Address Card */}
              {props.address && (
                <div className="bg-surface-foreground rounded-2xl p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-on-brand-primary"
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
                  </div>
                  <div>
                    <p className="text-surface-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-surface-background text-sm leading-relaxed whitespace-pre-line">
                      {props.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Business Hours Card */}
              {props.businessHours && (
                <div className="bg-surface-foreground rounded-2xl p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-on-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-surface-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
                      Business Hours
                    </p>
                    <p className="text-surface-background text-sm leading-relaxed whitespace-pre-line">
                      {props.businessHours}
                    </p>
                  </div>
                </div>
              )}

              {/* Phone CTA Card */}
              {props.phoneCta && (
                <div className="bg-surface-foreground rounded-2xl p-6 flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-on-brand-primary"
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
                  </div>
                  <div>
                    <p className="text-surface-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <a
                      href={props.phoneCta?.href}
                      className="text-brand-primary text-sm font-semibold hover:underline"
                    >
                      {props.phoneCta?.label}
                    </a>
                  </div>
                </div>
              )}

              {/* Support Links */}
              {(props.supportCentreLink || props.zendeskLink) && (
                <div className="bg-surface-muted rounded-2xl p-6 flex flex-col gap-3">
                  <p className="text-surface-foreground text-xs font-semibold uppercase tracking-wider">
                    Support Resources
                  </p>
                  {props.supportCentreLink && (
                    <a
                      href={props.supportCentreLink?.href}
                      className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      {props.supportCentreLink?.label}
                    </a>
                  )}
                  {props.zendeskLink && (
                    <a
                      href={props.zendeskLink?.href}
                      className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      ></svg>
                      {props.zendeskLink?.label}
                    </a>
                  )}
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
