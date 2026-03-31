"use client";

/**
 * EventDetailsBanner
 *
 * Displays key event logistics — date, time, venue — alongside a speaker photo and event CTA
 * Layout: Full-width image background with overlay; left side has logo lockup, right side has event date/time/location text and CTA button
 * Category: Hero
 */

import { useState } from "react";

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
  /** speaker-photo */
  speakerPhoto?: { src?: string; alt?: string };
}

export function EventDetailsBanner(props: EventDetailsBannerProps) {
  return (
      <section className="relative w-full min-h-[600px] overflow-hidden">
        {/* Background: speaker photo as full-width image */}
        <div className="absolute inset-0 z-0">
          {props['speaker-photo'] ? (
            <img
              src={props['speaker-photo']}
              alt="Event speaker"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-surface-inverse" />
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/65" />
        </div>
  
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center md:items-stretch gap-12 md:gap-0 min-h-[600px]">
  
          {/* Left: Logo lockup */}
          <div className="flex flex-col items-center md:items-start justify-center md:w-1/2 md:pr-12 md:border-r border-surface-muted">
            <RevealOnScroll variant="fade-up">
              {props['event-logo'] ? (
                <img
                  src={props['event-logo']}
                  alt="Event logo"
                  className="max-w-[220px] md:max-w-[300px] w-full object-contain mb-6"
                />
              ) : (
                <div className="w-48 h-16 bg-surface-muted rounded-md mb-6 flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm font-medium">Event Logo</span>
                </div>
              )}
              <p className="text-surface-muted-foreground text-sm uppercase tracking-widest text-center md:text-left">
                Official Event Partner
              </p>
            </RevealOnScroll>
          </div>
  
          {/* Right: Event details + CTA */}
          <div className="flex flex-col items-center md:items-start justify-center md:w-1/2 md:pl-12">
            <RevealOnScroll variant="fade-up">
              <div className="flex flex-col gap-5">
  
                {/* Date */}
                {props['event-date'] && (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-on-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="text-white text-lg md:text-xl font-semibold">
                      {props['event-date']}
                    </span>
                  </div>
                )}
  
                {/* Time */}
                {props['event-time'] && (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-on-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-white text-lg md:text-xl font-semibold">
                      {props['event-time']}
                    </span>
                  </div>
                )}
  
                {/* Venue */}
                {props['event-venue'] && (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-on-brand-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span className="text-white text-lg md:text-xl font-semibold">
                      {props['event-venue']}
                    </span>
                  </div>
                )}
  
                {/* CTA Button */}
                {props['event-info-cta'] && (
                  <div className="mt-4">
                    <a
                      href={props['event-info-cta']}
                      className="inline-block bg-brand-accent text-on-brand-secondary font-bold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-transparent"
                      aria-label="Register for the event"
                    >
                      Register Now
                    </a>
                  </div>
                )}
  
              </div>
            </RevealOnScroll>
          </div>
  
        </div>
      </section>
    );
}
