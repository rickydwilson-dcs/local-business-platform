"use client";

/**
 * StatsSchedule
 *
 * Stats section: Schedule
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface StatsScheduleProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function StatsSchedule(props: StatsScheduleProps) {
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {props.statItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                  >
                    {item.label && (
                      <p className="text-sm font-medium text-surface-muted-foreground uppercase tracking-widest mb-2">
                        {item.label}
                      </p>
                    )}
                    {item.value && (
                      <p className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
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
                { label: "Games Played", value: "38", description: "Total matches this season" },
                { label: "Wins", value: "24", description: "Victories recorded" },
                { label: "Goals Scored", value: "87", description: "Across all competitions" },
                { label: "Clean Sheets", value: "12", description: "Defensive shutouts" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                >
                  <p className="text-sm font-medium text-surface-muted-foreground uppercase tracking-widest mb-2">
                    {item.label}
                  </p>
                  <p className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
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
