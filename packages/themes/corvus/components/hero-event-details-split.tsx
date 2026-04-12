"use client";

/**
 * EventDetailsBanner
 *
 * Displays event date, time, and venue details alongside a speaker or event photo
 * Layout: Two-column split: left dark overlay with logo and event info text, right with speaker image
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
  /** background-image */
  backgroundImage?: { src?: string; alt?: string };
}

export function EventDetailsBanner(props: EventDetailsBannerProps) {
  return (
    <section className="relative w-full min-h-[600px] flex flex-col md:flex-row overflow-hidden">
      {/* Left Column - Dark overlay with event info */}
      <div className="relative flex flex-col justify-between w-full md:w-1/2 bg-surface-inverse px-8 py-12 lg:px-16 lg:py-20 z-10">
        {/* Background image with dark overlay */}
        {props.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${props.backgroundImage})` }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 flex flex-col gap-10 h-full justify-between">
          {/* Logo */}
          {props.eventLogo && (
            <div className="animate-fade-in-up">
              <img src={props.eventLogo} alt="Event logo" className="h-14 w-auto object-contain" />
            </div>
          )}

          {/* Event Details */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
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
                    <p className="text-surface-muted-foreground text-xs uppercase tracking-widest mb-1 font-semibold">
                      Date
                    </p>
                    <p className="text-surface-background text-lg font-bold leading-snug">
                      {props.eventDate}
                    </p>
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
                    <p className="text-surface-muted-foreground text-xs uppercase tracking-widest mb-1 font-semibold">
                      Time
                    </p>
                    <p className="text-surface-background text-lg font-bold leading-snug">
                      {props.eventTime}
                    </p>
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
                    <p className="text-surface-muted-foreground text-xs uppercase tracking-widest mb-1 font-semibold">
                      Venue
                    </p>
                    <p className="text-surface-background text-lg font-bold leading-snug">
                      {props.eventVenue}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </RevealOnScroll>

          {/* CTA Button */}
          {props.ctaButton && (
            <div className="animate-fade-in-up">
              <a
                href={props.ctaButton.url ?? "#"}
                className="inline-block bg-brand-accent text-on-brand-secondary font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-sm hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-surface-inverse"
              >
                {props.ctaButton.label ?? "Register Now"}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Speaker / Event Image */}
      <div className="relative w-full md:w-1/2 min-h-[400px] md:min-h-0 overflow-hidden">
        {props.backgroundImage ? (
          <img
            src={props.backgroundImage}
            alt="Event speaker or highlight"
            className="absolute inset-0 w-full h-full object-cover object-top animate-scale-up"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-muted flex items-center justify-center">
            <svg
              className="w-24 h-24 text-surface-muted-foreground opacity-40"
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

        {/* Gradient overlay blending into left column on desktop */}
        <div
          className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-inverse to-transparent hidden md:block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
