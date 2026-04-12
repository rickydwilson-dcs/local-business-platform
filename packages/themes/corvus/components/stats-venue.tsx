"use client";

/**
 * StatsVenue
 *
 * Stats section: Venue
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface StatsVenueProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function StatsVenue(props: StatsVenueProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <RevealOnScroll variant="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-12">
              {props.heading}
            </h2>
          </RevealOnScroll>
        )}

        {props.statItems && props.statItems.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {props.statItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm"
                >
                  {item.value && (
                    <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                      {item.value}
                    </span>
                  )}
                  {item.label && (
                    <span className="text-sm md:text-base text-surface-muted-foreground font-medium uppercase tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {item.description && (
                    <p className="mt-2 text-sm text-surface-muted-foreground">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {(!props.statItems || props.statItems.length === 0) && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Events Hosted" },
              { value: "12,000", label: "Seat Capacity" },
              { value: "25", label: "Years of History" },
              { value: "98%", label: "Guest Satisfaction" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm"
              >
                <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                  {item.value}
                </span>
                <span className="text-sm md:text-base text-surface-muted-foreground font-medium uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
