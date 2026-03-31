"use client";

/**
 * StatsSpeakers
 *
 * Stats section: Speakers
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface StatsSpeakersProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function StatsSpeakers(props: StatsSpeakersProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground">
                {props.heading ?? "Our Speakers"}
              </h2>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {(
                props.statItems ?? [
                  { value: "120+", label: "Expert Speakers" },
                  { value: "40+", label: "Countries Represented" },
                  { value: "80+", label: "Sessions Delivered" },
                  { value: "95%", label: "Attendee Satisfaction" },
                ]
              ).map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm"
                >
                  <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-primary mb-2">
                    {item.value}
                  </span>
                  <span className="text-sm md:text-base text-surface-muted-foreground font-medium uppercase tracking-wide">
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
