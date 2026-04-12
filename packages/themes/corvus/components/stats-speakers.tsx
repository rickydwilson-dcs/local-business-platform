"use client";

/**
 * StatsSpeakers
 *
 * Stats section: Speakers
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

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
          {props.heading && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                {props.heading}
              </h2>
            </div>
          )}
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {props.statItems && props.statItems.length > 0 ? (
              props.statItems.map((item, index) => (
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
              ))
            ) : (
              <>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm">
                  <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                    120+
                  </span>
                  <span className="text-sm md:text-base text-surface-muted-foreground font-medium uppercase tracking-wide">
                    Speakers
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm">
                  <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                    40+
                  </span>
                  <span className="text-sm md:text-base text-surface-muted-foreground font-medium uppercase tracking-wide">
                    Countries
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm">
                  <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                    3 Days
                  </span>
                  <span className="text-sm md:text-base text-surface-muted-foreground font-medium uppercase tracking-wide">
                    Of Talks
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm">
                  <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                    5,000+
                  </span>
                  <span className="text-sm md:text-base text-surface-muted-foreground font-medium uppercase tracking-wide">
                    Attendees
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
