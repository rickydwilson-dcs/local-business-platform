"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";

/**
 * BlogStats
 *
 * Displays blog-related stats or metadata items in a structured layout
 * Layout: Contained section with heading and stat items
 * Category: Stats
 */

import { useState } from "react";

export interface BlogStatsProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function BlogStats(props: BlogStatsProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            {props.heading && (
              <h2 className="text-3xl font-bold text-surface-foreground mb-10 text-center">
                {props.heading}
              </h2>
            )}
            {props.statItems && props.statItems.length > 0 && (
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {props.statItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-2xl p-6 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                  >
                    {item.icon && (
                      <div className="mb-3 text-brand-primary text-3xl" aria-hidden="true">
                        {item.icon}
                      </div>
                    )}
                    <dt className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide mb-1">
                      {item.label}
                    </dt>
                    <dd className="text-4xl font-extrabold text-brand-primary">
                      {item.value}
                    </dd>
                    {item.description && (
                      <p className="mt-2 text-sm text-surface-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </dl>
            )}
          </RevealOnScroll>
        </div>
      </section>
    );
}
