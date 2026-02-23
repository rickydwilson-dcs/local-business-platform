"use client";

/**
 * EventDetailsBanner
 *
 * Displays key event logistics — date, time, venue — alongside a speaker photo and event CTA
 * Layout: Full-width image background with logo left, event details and CTA button right
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
  /** event-info-cta */
  eventInfoCta?: Array<{ label?: string; href?: string }>;
}

export function EventDetailsBanner(props: EventDetailsBannerProps) {
  return (
      <section className="relative w-full min-h-[600px] overflow-hidden bg-surface-inverse">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: props['event-logo']
              ? `url(${props['event-logo']})`
              : undefined,
          }}
          aria-hidden="true"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-surface-inverse opacity-75" />
        </div>
  
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10 lg:gap-16">
  
            {/* Left: Logo / Speaker Photo */}
            <div className="flex-shrink-0 flex items-center justify-center w-full md:w-1/2 lg:w-5/12">
              <RevealOnScroll variant="fade-up">
                {props['event-logo'] ? (
                  <img
                    src={props['event-logo']}
                    alt="Event logo"
                    className="w-full max-w-sm rounded-2xl object-cover shadow-2xl"
                  />
                ) : (
                  <div className="w-full max-w-sm aspect-[4/3] rounded-2xl bg-surface-muted flex items-center justify-center">
                    <span className="text-surface-muted-foreground text-sm">Event Logo</span>
                  </div>
                )}
              </RevealOnScroll>
            </div>
  
            {/* Right: Event Details */}
            <div className="flex flex-col justify-center w-full md:w-1/2 lg:w-7/12 gap-6">
              <RevealOnScroll variant="fade-up">
                {/* Event Date */}
                {props['event-date'] && (
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary"
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-on-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <p className="text-surface-background text-lg font-semibold">
                      {props['event-date']}
                    </p>
                  </div>
                )}
  
                {/* Event Time */}
                {props['event-time'] && (
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary"
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-on-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <p className="text-surface-background text-lg font-semibold">
                      {props['event-time']}
                    </p>
                  </div>
                )}
  
                {/* Event Venue */}
                {props['event-venue'] && (
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary"
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-on-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <p className="text-surface-background text-lg font-semibold">
                      {props['event-venue']}
                    </p>
                  </div>
                )}
  
                {/* Divider */}
                <hr className="border-surface-muted my-2" />
  
                {/* CTA Button */}
                {props['event-info-cta'] && (
                  <div className="pt-2">
                    <a
                      href={props['event-info-cta']}
                      className="inline-block px-8 py-4 rounded-xl bg-brand-accent text-on-brand-secondary font-bold text-base lg:text-lg shadow-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                    >
                      Register Now
                    </a>
                  </div>
                )}
              </RevealOnScroll>
            </div>
  
          </div>
        </div>
      </section>
    );
}
