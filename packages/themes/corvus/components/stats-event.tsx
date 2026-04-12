"use client";

/**
 * EventStats
 *
 * Displays key event statistics such as speaker count, attendee count, schedule highlights, or venue details
 * Layout: Contained section with heading and a row or grid of stat items
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface EventStatsProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function EventStats(props: EventStatsProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          {props.heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-12">
              {props.heading}
            </h2>
          )}
          {!props.heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground text-center mb-12">
              Event at a Glance
            </h2>
          )}
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {props.statItems && props.statItems.length > 0 ? (
              props.statItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                >
                  {item.icon && <div className="text-brand-primary text-4xl mb-3">{item.icon}</div>}
                  <span className="text-4xl lg:text-5xl font-extrabold text-brand-primary mb-2">
                    {item.value}
                  </span>
                  <span className="text-sm md:text-base font-medium text-surface-muted-foreground uppercase tracking-wide">
                    {item.label}
                  </span>
                  {item.description && (
                    <p className="mt-2 text-sm text-surface-muted-foreground">{item.description}</p>
                  )}
                </div>
              ))
            ) : (
              <>
                {[
                  { value: "50+", label: "Speakers" },
                  { value: "2,000+", label: "Attendees" },
                  { value: "3", label: "Days" },
                  { value: "12", label: "Venues" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                  >
                    <span className="text-4xl lg:text-5xl font-extrabold text-brand-primary mb-2">
                      {item.value}
                    </span>
                    <span className="text-sm md:text-base font-medium text-surface-muted-foreground uppercase tracking-wide">
                      {item.label}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
