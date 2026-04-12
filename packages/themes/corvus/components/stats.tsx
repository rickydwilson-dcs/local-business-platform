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
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(props.statItems && props.statItems.length > 0
              ? props.statItems
              : [
                  { title: "10K+", description: "Happy Customers" },
                  { title: "98%", description: "Satisfaction Rate" },
                  { title: "150+", description: "Countries Served" },
                  { title: "24/7", description: "Support Available" },
                ]
            ).map((item, index) => (
              <div
                key={index}
                className="bg-surface-foreground rounded-2xl p-8 text-center shadow-sm border border-surface-muted flex flex-col items-center justify-center"
              >
                <dt className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                  {item.title}
                </dt>
                <dd className="text-surface-muted-foreground text-base font-medium">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </RevealOnScroll>
      </div>
    </section>
  );
}
