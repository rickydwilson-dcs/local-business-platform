"use client";

/**
 * Stats
 *
 * Stats section
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface StatsProps {
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function Stats(props: StatsProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-surface-muted-foreground text-lg max-w-2xl mx-auto">
                Trusted by thousands of customers worldwide, we continue to grow and deliver results.
              </p>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(props.statItems && props.statItems.length > 0
                ? props.statItems
                : [
                    { value: "10K+", label: "Happy Customers", description: "Across 50+ countries" },
                    { value: "98%", label: "Satisfaction Rate", description: "Based on user feedback" },
                    { value: "500+", label: "Projects Delivered", description: "On time and on budget" },
                    { value: "24/7", label: "Support Available", description: "Always here to help" },
                  ]
              ).map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-8 text-center shadow-sm border border-surface-muted hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                    {item.value}
                  </div>
                  <div className="text-lg font-semibold text-surface-background mb-1">
                    {item.label}
                  </div>
                  {item.description && (
                    <p className="text-sm text-surface-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
