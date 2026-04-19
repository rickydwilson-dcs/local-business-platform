"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * ExperienceStats
 *
 * Highlights trade experience metrics or milestones to build credibility, appearing on about and service pages
 * Layout: Single column or grid of stat blocks on dark background with optional supporting images
 * Category: Stats
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ExperienceStatsProps {
  /** section-heading */
  sectionHeading?: string;
  /** stat-items */
  statItems?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** supporting-images */
  supportingImages?: Array<{ src?: string; alt?: string }>;
}

export function ExperienceStats(props: ExperienceStatsProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        {props.sectionHeading && (
          <RevealOnScroll variant="fade-up">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary mb-4">
                {props.sectionHeading}
              </h2>
              <div className="w-16 h-1 bg-brand-accent mx-auto rounded-full" />
            </div>
          </RevealOnScroll>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Stat Items Grid */}
          {props.statItems && props.statItems.length > 0 && (
            <RevealOnScroll variant="fade-up">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {props.statItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground border border-surface-muted rounded-2xl p-6 md:p-8 flex flex-col items-start"
                  >
                    {item.value && (
                      <span className="text-4xl md:text-5xl font-extrabold text-brand-accent leading-none mb-2">
                        {item.value}
                      </span>
                    )}
                    {item.label && (
                      <span className="text-base md:text-lg font-semibold text-on-brand-primary mb-1">
                        {item.label}
                      </span>
                    )}
                    {item.description && (
                      <p className="text-sm text-surface-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          )}

          {/* Supporting Images */}
          {props.supportingImages && props.supportingImages.length > 0 && (
            <div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:flex-col lg:gap-6">
              {props.supportingImages.map(
                (image: { src?: string; alt?: string }, index: number) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-2xl ${
                      index === 0
                        ? "aspect-video w-full"
                        : "aspect-square w-full md:w-1/2 lg:w-full lg:aspect-video"
                    }`}
                  >
                    <img
                      src={image?.src}
                      alt={image?.alt ?? ""}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )
              )}
            </div>
          )}

          {/* Fallback: full-width stats if no images */}
          {(!props.supportingImages || props.supportingImages.length === 0) &&
            props.statItems &&
            props.statItems.length === 0 && (
              <div className="col-span-full text-center text-surface-muted-foreground">
                <p>No stats available.</p>
              </div>
            )}
        </div>

        {/* Bottom accent bar */}
        <div className="mt-16 border-t border-surface-muted pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-surface-muted-foreground text-sm text-center md:text-left">
            Trusted by clients across the region
          </p>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-accent" />
            <span className="w-3 h-3 rounded-full bg-brand-primary" />
            <span className="w-3 h-3 rounded-full bg-brand-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
