"use client";

/**
 * BlogStats
 *
 * Displays blog post metadata and stats such as read time or post count
 * Layout: Contained section with heading and stat items
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogStatsProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function BlogStats(props: BlogStatsProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <h2 className="text-3xl font-bold text-surface-foreground mb-10 text-center">
              {props.heading ?? 'Blog Statistics'}
            </h2>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(
                props.statItems ?? [
                  { label: 'Total Posts', value: '128' },
                  { label: 'Avg. Read Time', value: '5 min' },
                  { label: 'Categories', value: '12' },
                  { label: 'Authors', value: '8' },
                ]
              ).map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-surface-muted"
                >
                  <span className="text-4xl font-extrabold text-brand-primary mb-2">
                    {item.value}
                  </span>
                  <span className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide">
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
