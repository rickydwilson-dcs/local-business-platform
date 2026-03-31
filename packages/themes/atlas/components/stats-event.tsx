"use client";

/**
 * EventStats
 *
 * Displays key event statistics such as attendee count, session count, or schedule highlights
 * Layout: Contained horizontal stat items with heading
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface EventStatsProps {
  /** section-heading */
  sectionHeading?: string;
  /** stat-items */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function EventStats(props: EventStatsProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {props.sectionHeading && (
            <RevealOnScroll variant="fade-up">
              <h2 className="text-3xl font-bold text-surface-foreground text-center mb-12">
                {props.sectionHeading}
              </h2>
            </RevealOnScroll>
          )}
  
          <RevealOnScroll variant="fade-up">
            <div className="bg-surface-foreground rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-surface-muted">
              {props.statItems && props.statItems.length > 0 ? (
                props.statItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center w-full md:w-auto px-4 py-6 md:py-0 first:pt-0 last:pb-0 md:first:pt-0 md:last:pb-0"
                  >
                    {item.icon && (
                      <span className="text-brand-primary text-4xl mb-3" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-4xl lg:text-5xl font-extrabold text-brand-primary leading-none mb-2">
                      {item.value}
                    </span>
                    <span className="text-base font-semibold text-surface-background uppercase tracking-widest">
                      {item.label}
                    </span>
                    {item.description && (
                      <p className="text-sm text-surface-muted-foreground mt-2 max-w-xs">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col items-center text-center w-full md:w-auto px-4 py-6 md:py-0">
                    <span className="text-4xl lg:text-5xl font-extrabold text-brand-primary leading-none mb-2">
                      5,000+
                    </span>
                    <span className="text-base font-semibold text-surface-background uppercase tracking-widest">
                      Attendees
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center w-full md:w-auto px-4 py-6 md:py-0">
                    <span className="text-4xl lg:text-5xl font-extrabold text-brand-primary leading-none mb-2">
                      120
                    </span>
                    <span className="text-base font-semibold text-surface-background uppercase tracking-widest">
                      Sessions
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center w-full md:w-auto px-4 py-6 md:py-0">
                    <span className="text-4xl lg:text-5xl font-extrabold text-brand-primary leading-none mb-2">
                      3
                    </span>
                    <span className="text-base font-semibold text-surface-background uppercase tracking-widest">
                      Days
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center w-full md:w-auto px-4 py-6 md:py-0">
                    <span className="text-4xl lg:text-5xl font-extrabold text-brand-primary leading-none mb-2">
                      80+
                    </span>
                    <span className="text-base font-semibold text-surface-background uppercase tracking-widest">
                      Speakers
                    </span>
                  </div>
                </>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
