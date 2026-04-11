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
  statItems?: Array<{ value?: string; label?: string; description?: string }>;
}

export function StatsVenue(props: StatsVenueProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                {props.heading}
              </h2>
            </div>
          </RevealOnScroll>
        )}

        {props.statItems && props.statItems.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {props.statItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-surface-foreground rounded-2xl p-8 shadow-sm border border-surface-muted"
                >
                  {item.value && (
                    <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                      {item.value}
                    </span>
                  )}
                  {item.label && (
                    <span className="text-base md:text-lg font-medium text-surface-muted-foreground uppercase tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {item.description && (
                    <p className="mt-3 text-sm text-surface-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
