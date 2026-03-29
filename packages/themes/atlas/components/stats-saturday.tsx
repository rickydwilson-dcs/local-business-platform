"use client";

/**
 * StatsSaturday
 *
 * Stats section: Saturday
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface StatsSaturdayProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function StatsSaturday(props: StatsSaturdayProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                {props.heading ?? "Saturday by the Numbers"}
              </h2>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(
                props.statItems ?? [
                  { value: "12K+", label: "Attendees" },
                  { value: "48", label: "Sessions" },
                  { value: "30+", label: "Speakers" },
                  { value: "6", label: "Tracks" },
                ]
              ).map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-surface-muted"
                >
                  <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                    {item.value}
                  </span>
                  <span className="text-base md:text-lg text-surface-muted-foreground font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
