"use client";

/**
 * EventStatsBlock
 *
 * Displays key event statistics and details such as schedule, venue, speakers, and Saturday highlights
 * Layout: Contained section with heading and a row or grid of stat items
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface EventStatsBlockProps {
  /** heading */
  heading?: string;
  /** stat-items */
  statItems?: Array<{ icon?: string; label?: string; value?: string; description?: string }>;
}

export function EventStatsBlock(props: EventStatsBlockProps) {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {props.statItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                >
                  {item.icon && <div className="mb-4 text-brand-primary text-4xl">{item.icon}</div>}
                  {item.label && (
                    <p className="text-sm font-semibold uppercase tracking-widest text-surface-muted-foreground mb-1">
                      {item.label}
                    </p>
                  )}
                  {item.value && (
                    <p className="text-2xl md:text-3xl font-bold text-surface-foreground mb-2">
                      {item.value}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-sm text-surface-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}

        {(!props.statItems || props.statItems.length === 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Schedule",
                value: "9AM – 6PM",
                description: "Full day of sessions and workshops",
              },
              {
                label: "Venue",
                value: "Main Hall",
                description: "Central Convention Centre, Floor 2",
              },
              {
                label: "Speakers",
                value: "24+",
                description: "Industry leaders and innovators",
              },
              {
                label: "Saturday Highlights",
                value: "3 Stages",
                description: "Keynotes, panels, and live demos",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-surface-foreground rounded-2xl p-6 flex flex-col items-center text-center border border-surface-muted"
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-surface-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-surface-foreground mb-2">
                  {item.value}
                </p>
                <p className="text-sm text-surface-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
