"use client";

/**
 * SponsorsGrid
 *
 * Displays sponsor logos in a card grid layout
 * Layout: Contained grid of sponsor logo cards on a surface background
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SponsorsGridProps {
  /** section-heading */
  sectionHeading?: string;
  /** sponsor-logo-cards */
  sponsorLogoCards?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function SponsorsGrid(props: SponsorsGridProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {props.sectionHeading && (
            <RevealOnScroll variant="fade-up">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-surface-foreground">
                  {props.sectionHeading}
                </h2>
              </div>
            </RevealOnScroll>
          )}
  
          {props.sponsorLogoCards && props.sponsorLogoCards.length > 0 && (
            <RevealOnScroll variant="fade-up">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {props.sponsorLogoCards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-surface-foreground rounded-xl p-6 flex items-center justify-center shadow-sm border border-surface-muted hover:shadow-md transition-shadow duration-300"
                  >
                    {card.logoImage && (
                      <img
                        src={card.logoImage}
                        alt={card.sponsorName || `Sponsor ${index + 1}`}
                        className="max-h-16 w-auto object-contain"
                      />
                    )}
                    {!card.logoImage && card.sponsorName && (
                      <span className="text-surface-foreground font-semibold text-center text-sm">
                        {card.sponsorName}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          )}
  
          {(!props.sponsorLogoCards || props.sponsorLogoCards.length === 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-surface-foreground rounded-xl p-6 flex items-center justify-center border border-surface-muted h-28"
                >
                  <div className="w-24 h-10 bg-surface-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
}
