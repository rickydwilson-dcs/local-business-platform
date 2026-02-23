"use client";

/**
 * EventDetailsBanner
 *
 * Displays key event details — date, time, venue — alongside a speaker photo with CTA button
 * Layout: Two-column split: left text details with logo and event info, right full-height image of speaker
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface EventDetailsBannerProps {
  /** event-logo */
  eventLogo?: string;
  /** event-date */
  eventDate?: string;
  /** event-time */
  eventTime?: string;
  /** event-venue */
  eventVenue?: string;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
  /** speaker-image */
  speakerImage?: { src?: string; alt?: string };
}

export function EventDetailsBanner(props: EventDetailsBannerProps) {
  return (
      <section className="relative w-full min-h-screen bg-surface-inverse overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left Column: Event Details */}
          <div className="flex flex-col justify-center px-8 py-16 md:px-12 lg:px-16 bg-surface-inverse">
            <RevealOnScroll variant="fade-up">
              {/* Logo */}
              {props["event-logo"] && (
                <div className="mb-10">
                  <img
                    src={props["event-logo"]}
                    alt="Event Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
  
              {/* Label */}
              <p className="text-brand-accent uppercase tracking-widest text-sm font-semibold mb-4">
                Upcoming Event
              </p>
  
              {/* Heading */}
              <h1 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
                Join Us for an Unmissable Experience
              </h1>
  
              {/* Divider */}
              <div className="w-16 h-1 bg-brand-accent mb-8 rounded-full" />
  
              {/* Event Details List */}
              <ul className="space-y-5 mb-10">
                {props["event-date"] && (
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-on-brand-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-surface-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                        Date
                      </p>
                      <p className="text-surface-background text-base font-medium">
                        {props["event-date"]}
                      </p>
                    </div>
                  </li>
                )}
  
                {props["event-time"] && (
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-on-brand-primary"
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
                    </span>
                    <div>
                      <p className="text-surface-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                        Time
                      </p>
                      <p className="text-surface-background text-base font-medium">
                        {props["event-time"]}
                      </p>
                    </div>
                  </li>
                )}
  
                {props["event-venue"] && (
                  <li className="flex items-start gap-4">
                    <span className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-on-brand-primary"
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
                    </span>
                    <div>
                      <p className="text-surface-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                        Venue
                      </p>
                      <p className="text-surface-background text-base font-medium">
                        {props["event-venue"]}
                      </p>
                    </div>
                  </li>
                )}
              </ul>
  
              {/* CTA Button */}
              {props["cta-button"] && (
                <div>
                  <a
                    href={props["cta-button"].href || "#"}
                    className="inline-block bg-brand-accent text-on-brand-secondary font-semibold px-8 py-4 rounded-lg text-base hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface-inverse"
                  >
                    {props["cta-button"].label || "Register Now"}
                  </a>
                </div>
              )}
            </RevealOnScroll>
          </div>
  
          {/* Right Column: Speaker Image */}
          <div className="relative w-full min-h-64 lg:min-h-full overflow-hidden">
            {props["speaker-image"] ? (
              <img
                src={props["speaker-image"]}
                alt="Featured Speaker"
                className="absolute inset-0 w-full h-full object-cover object-top animate-fade-in-up"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-surface-muted flex items-center justify-center">
                <span className="text-surface-muted-foreground text-sm">
                  Speaker photo
                </span>
              </div>
            )}
  
            {/* Gradient overlay on left edge for blending */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-inverse to-transparent pointer-events-none hidden lg:block" />
  
            {/* Bottom gradient for text legibility on mobile */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-inverse to-transparent pointer-events-none lg:hidden" />
          </div>
        </div>
      </section>
    );
}
