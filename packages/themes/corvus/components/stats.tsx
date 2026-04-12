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
                  { value: "10K+", label: "Happy Customers" },
                  { value: "98%", label: "Satisfaction Rate" },
                  { value: "150+", label: "Countries Served" },
                  { value: "24/7", label: "Support Available" },
                ]
            ).map((item, index) => (
              <div
                key={index}
                className="bg-surface-foreground rounded-2xl p-8 text-center shadow-sm border border-surface-muted flex flex-col items-center justify-center"
              >
                <dt className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                  {item.value}
                </dt>
                <dd className="text-surface-muted-foreground text-base font-medium">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </RevealOnScroll>
      </div>
    </section>
  );
}
