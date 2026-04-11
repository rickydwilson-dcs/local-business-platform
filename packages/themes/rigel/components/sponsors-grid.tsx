"use client";

/**
 * SponsorsGrid
 *
 * Displays sponsor logos or cards in a grid layout
 * Layout: Contained section with heading and a grid of sponsor logo cards
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SponsorsGridProps {
  /** heading */
  heading?: string;
  /** sponsor-cards */
  sponsorCards?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** card-images */
  cardImages?: Array<{ src?: string; alt?: string }>;
}

export function SponsorsGrid(props: SponsorsGridProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <RevealOnScroll variant="fade-up">
            <h2 className="text-3xl font-bold text-surface-foreground text-center mb-12">
              {props.heading}
            </h2>
          </RevealOnScroll>
        )}

        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-items-center">
            {props.sponsorCards && props.sponsorCards.length > 0
              ? props.sponsorCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground border border-surface-muted rounded-xl p-6 flex items-center justify-center w-full min-h-[120px] hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="font-semibold text-surface-foreground">{card.title}</span>
                  </div>
                ))
              : props.cardImages && props.cardImages.length > 0
                ? props.cardImages.map((image, index) => (
                    <div
                      key={index}
                      className="bg-surface-foreground border border-surface-muted rounded-xl p-6 flex items-center justify-center w-full min-h-[120px] hover:shadow-md transition-shadow duration-300"
                    >
                      <img
                        src={image.src}
                        alt={image.alt || `Sponsor ${index + 1}`}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                  ))
                : Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-surface-muted border border-surface-muted rounded-xl p-6 flex items-center justify-center w-full min-h-[120px] animate-pulse"
                    >
                      <span className="text-surface-muted-foreground text-sm font-medium">
                        Sponsor Logo
                      </span>
                    </div>
                  ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
