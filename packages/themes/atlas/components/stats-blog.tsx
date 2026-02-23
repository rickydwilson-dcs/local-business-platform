"use client";

/**
 * StatsBlog
 *
 * Stats section: Blog
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface StatsBlogProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function StatsBlog(props: StatsBlogProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
                {props.heading ?? "Blog by the Numbers"}
              </h2>
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {(
                props.statItems ?? [
                  { label: "Articles Published", value: "1,200+" },
                  { label: "Monthly Readers", value: "500K" },
                  { label: "Topics Covered", value: "80+" },
                  { label: "Expert Contributors", value: "340" },
                ]
              ).map((item, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-2xl p-8 flex flex-col items-center text-center shadow-sm border border-surface-muted"
                >
                  <dt className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide mb-3">
                    {item.label}
                  </dt>
                  <dd className="text-4xl md:text-5xl font-extrabold text-brand-primary">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealOnScroll>
        </div>
      </section>
    );
}
