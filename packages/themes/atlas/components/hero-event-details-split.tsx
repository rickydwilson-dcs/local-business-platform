"use client";

/**
 * EventDetailsBanner
 *
 * Displays key event logistics — date, time, venue — alongside a speaker photo with event info CTA
 * Layout: Two-column split: left text details, right image with overlay logo
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
      <section className="w-full bg-surface-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
          {/* Left Column: Event Details */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20 bg-surface-background">
            {props.eventLogo && (
              <div className="mb-8">
                <img
                  src={props.eventLogo}
                  alt="Event logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
  
            <RevealOnScroll variant="fade-up">
              <div className="space-y-6">
                {props.eventDate && (
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-on-brand-secondary"
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
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-surface-muted-foreground font-semibold mb-0.5">
                        Date
                      </p>
                      <p className="text-surface-foreground font-semibold text-lg">
                        {props.eventDate}
                      </p>
                    </div>
                  </div>
                )}
  
                {props.eventTime && (
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-on-brand-secondary"
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
                      <p className="text-xs uppercase tracking-widest text-surface-muted-foreground font-semibold mb-0.5">
                        Time
                      </p>
                      <p className="text-surface-foreground font-semibold text-lg">
                        {props.eventTime}
                      </p>
                    </div>
                  </div>
                )}
  
                {props.eventVenue && (
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-on-brand-secondary"
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
                      <p className="text-xs uppercase tracking-widest text-surface-muted-foreground font-semibold mb-0.5">
                        Venue
                      </p>
                      <p className="text-surface-foreground font-semibold text-lg">
                        {props.eventVenue}
                      </p>
                    </div>
                  </div>
                )}
  
                {props.ctaButton && (
                  <div className="pt-4">
                    <a
                      href="#register"
                      className="inline-block bg-brand-primary text-on-brand-primary font-bold px-8 py-4 rounded-lg text-base hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    >
                      {props.ctaButton}
                    </a>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          </div>
  
          {/* Right Column: Speaker Image with Overlay */}
          <div className="relative w-full min-h-[360px] md:min-h-full overflow-hidden">
            {props.speakerImage ? (
              <img
                src={props.speakerImage}
                alt="Event speaker"
                className="absolute inset-0 w-full h-full object-cover object-top animate-fade-in-up"
              />
            ) : (
              <div className="absolute inset-0 bg-surface-muted" />
            )}
  
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-inverse via-transparent to-transparent opacity-70" />
  
            {/* Bottom overlay with logo/brand info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <RevealOnScroll variant="fade-up">
                <div className="flex items-center gap-4">
                  {props.eventLogo && (
                    <img
                      src={props.eventLogo}
                      alt="Event logo"
                      className="h-10 w-auto object-contain brightness-0 invert"
                    />
                  )}
                  <div className="h-px flex-1 bg-surface-background opacity-30" />
                  <span className="text-surface-background text-xs uppercase tracking-widest font-semibold opacity-80">
                    Official Event
                  </span>
                </div>
              </RevealOnScroll>
            </div>
  
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-accent" />
          </div>
        </div>
      </section>
    );
}
