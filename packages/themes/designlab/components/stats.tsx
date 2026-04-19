"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

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
  statItems?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
}

export function Stats(props: StatsProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {props.statItems && props.statItems.length > 0 ? (
              props.statItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm border border-surface-muted"
                >
                  {item.value && (
                    <span className="text-4xl font-bold text-brand-primary mb-2">{item.value}</span>
                  )}
                  {item.label && (
                    <span className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {item.description && (
                    <p className="mt-2 text-sm text-surface-muted-foreground">{item.description}</p>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm border border-surface-muted">
                  <span className="text-4xl font-bold text-brand-primary mb-2">10K+</span>
                  <span className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide">
                    Customers
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm border border-surface-muted">
                  <span className="text-4xl font-bold text-brand-primary mb-2">98%</span>
                  <span className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide">
                    Satisfaction
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm border border-surface-muted">
                  <span className="text-4xl font-bold text-brand-primary mb-2">50+</span>
                  <span className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide">
                    Countries
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-surface-foreground rounded-2xl shadow-sm border border-surface-muted">
                  <span className="text-4xl font-bold text-brand-primary mb-2">5M+</span>
                  <span className="text-sm font-medium text-surface-muted-foreground uppercase tracking-wide">
                    Transactions
                  </span>
                </div>
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
