"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * StatsStaticAndDynamicContentEdi
 *
 * Stats section: Static and dynamic content editing
 * Layout: contained
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface StatsStaticAndDynamicContentEdiProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
}

export function StatsStaticAndDynamicContentEdi(props: StatsStaticAndDynamicContentEdiProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground">
              {props.heading ?? "Our Impact in Numbers"}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(props.statItems && props.statItems.length > 0
              ? props.statItems
              : [
                  {
                    value: "10K+",
                    label: "Happy Customers",
                    description: "Across 50+ countries worldwide",
                  },
                  {
                    value: "99%",
                    label: "Uptime Guaranteed",
                    description: "Reliable service you can count on",
                  },
                  {
                    value: "500+",
                    label: "Integrations",
                    description: "Connect with your favourite tools",
                  },
                  {
                    value: "24/7",
                    label: "Expert Support",
                    description: "Always here when you need us",
                  },
                ]
            ).map((item, index) => (
              <div
                key={index}
                className="bg-surface-foreground rounded-2xl p-8 flex flex-col items-center text-center shadow-sm border border-surface-muted hover:shadow-md transition-shadow duration-300"
              >
                <span className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2">
                  {item.value}
                </span>
                <span className="text-lg font-semibold text-surface-background mb-2">
                  {item.label}
                </span>
                {item.description && (
                  <p className="text-sm text-surface-muted-foreground leading-relaxed">
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
