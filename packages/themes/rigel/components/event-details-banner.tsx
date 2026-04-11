"use client";

/**
 * EventDetailsBanner
 *
 * Displays key event details (date, time, venue) alongside a speaker or stage photo
 * Layout: Two-column split: left dark overlay with logo and event metadata, right with speaker image
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
  /** background-image */
  backgroundImage?: { src?: string; alt?: string };
}

export function EventDetailsBanner(props: EventDetailsBannerProps) {
  return (
    <section className="relative w-full min-h-[600px] flex flex-col md:flex-row overflow-hidden">
      {/* Left Column - Dark overlay with logo and event metadata */}
      <div className="relative z-10 flex flex-col justify-between bg-surface-inverse w-full md:w-1/2 px-8 py-12 lg:px-16 lg:py-16">
        {/* Logo */}
        {props.eventLogo && (
          <div className="mb-8">
            <img src={props.eventLogo} alt="Event Logo" className="h-16 w-auto object-contain" />
          </div>
        )}

        {/* Event Metadata */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6 flex-1 justify-center py-8">
            {/* Date */}
            {props.eventDate && (
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-brand-accent"
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
                  <p className="text-surface-muted-foreground text-xs uppercase tracking-widest mb-1">
                    Date
                  </p>
                  <p className="text-surface-background text-xl font-semibold">{props.eventDate}</p>
                </div>
              </div>
            )}

            {/* Time */}
            {props.eventTime && (
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-brand-accent"
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
                  <p className="text-surface-muted-foreground text-xs uppercase tracking-widest mb-1">
                    Time
                  </p>
                  <p className="text-surface-background text-xl font-semibold">{props.eventTime}</p>
                </div>
              </div>
            )}

            {/* Venue */}
            {props.eventVenue && (
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-brand-accent"
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
                  <p className="text-surface-muted-foreground text-xs uppercase tracking-widest mb-1">
                    Venue
                  </p>
                  <p className="text-surface-background text-xl font-semibold">
                    {props.eventVenue}
                  </p>
                </div>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* CTA */}
        {props.eventInfoCta && (
          <div className="mt-8">
            <a
              href={props.eventInfoCta?.[0]?.href ?? "#"}
              className="inline-flex items-center gap-2 bg-brand-accent text-on-brand-secondary font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface-inverse"
            >
              Get Event Info
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Right Column - Speaker / Stage Image */}
      <div className="relative w-full md:w-1/2 min-h-[320px] md:min-h-full overflow-hidden">
        {props.backgroundImage ? (
          <img
            src={props.backgroundImage?.src}
            alt={props.backgroundImage?.alt ?? "Event speaker or stage"}
            className="absolute inset-0 w-full h-full object-cover object-center animate-scale-up"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-surface-muted flex items-center justify-center">
            <svg
              className="w-24 h-24 text-surface-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Gradient overlay on image for visual blend */}
        <div className="absolute inset-0 bg-surface-inverse opacity-10 md:opacity-0 md:bg-gradient-to-r md:from-surface-inverse md:to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
