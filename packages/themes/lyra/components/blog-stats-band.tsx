"use client";

/**
 * BlogStatsBand
 *
 * Displays blog post metadata or site stats in a structured band
 * Layout: Contained horizontal band with heading and stat items
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogStatsBandProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function BlogStatsBand(props: BlogStatsBandProps) {
  return (
      <section className="bg-surface-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {props.heading && (
            <RevealOnScroll variant="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-foreground text-center mb-10 md:mb-12">
                {props.heading}
              </h2>
            </RevealOnScroll>
          )}
  
          {props.statItems && props.statItems.length > 0 && (
            <RevealOnScroll variant="fade-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {props.statItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl border border-surface-muted shadow-sm"
                  >
                    {item.icon && (
                      <span className="text-brand-primary text-3xl mb-3" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-3xl md:text-4xl font-extrabold text-brand-primary leading-tight">
                      {item.value}
                    </span>
                    {item.label && (
                      <span className="mt-2 text-sm md:text-base font-medium text-surface-muted-foreground uppercase tracking-wide">
                        {item.label}
                      </span>
                    )}
                    {item.description && (
                      <p className="mt-1 text-xs text-surface-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </section>
    );
}
