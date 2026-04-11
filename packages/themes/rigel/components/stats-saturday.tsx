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
  statItems?: Array<{ value?: string; label?: string; description?: string }>;
}

export function StatsSaturday(props: StatsSaturdayProps) {
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
                  className="bg-surface-foreground rounded-2xl p-8 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                >
                  {item.value && (
                    <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                      {item.value}
                    </span>
                  )}
                  {item.label && (
                    <span className="text-base md:text-lg font-medium text-surface-muted-foreground">
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

        {(!props.statItems || props.statItems.length === 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "12K+", label: "Active Users" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "340+", label: "Projects Completed" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-surface-foreground rounded-2xl p-8 flex flex-col items-center text-center border border-surface-muted"
              >
                <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-base md:text-lg font-medium text-surface-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
