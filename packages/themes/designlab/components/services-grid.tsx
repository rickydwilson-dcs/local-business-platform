"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * ServicesGrid
 *
 * Showcases the range of signage and design services offered with image cards and labels in a grid layout
 * Layout: Centred heading and subtext above a grid of service cards with images and labels on dark background
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ServicesGridProps {
  /** section-label */
  sectionLabel?: string;
  /** section-heading */
  sectionHeading?: string;
  /** section-subtext */
  sectionSubtext?: string;
  /** service-cards */
  serviceCards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
}

export function ServicesGrid(props: ServicesGridProps) {
  return (
    <section className="bg-surface-inverse py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12 md:mb-16">
            {props.sectionLabel && (
              <span className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
                {props.sectionLabel}
              </span>
            )}
            {props.sectionHeading && (
              <h2 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {props.sectionHeading}
              </h2>
            )}
            {props.sectionSubtext && (
              <p className="text-surface-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                {props.sectionSubtext}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Services Grid */}
        {props.serviceCards && props.serviceCards.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {props.serviceCards.map((card, index) => (
                <div
                  key={index}
                  className="group relative bg-surface-foreground border border-surface-muted rounded-xl overflow-hidden cursor-pointer hover:border-brand-accent transition-all duration-300"
                >
                  {/* Card Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.label ?? "Service"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-muted flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-surface-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-surface-inverse opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  </div>

                  {/* Card Label */}
                  <div className="p-4">
                    {card.label && (
                      <h3 className="text-surface-background text-base md:text-lg font-semibold leading-snug group-hover:text-brand-accent transition-colors duration-200">
                        {card.label}
                      </h3>
                    )}
                    {card.description && (
                      <p className="text-surface-muted-foreground text-sm mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    )}
                    {card.href && (
                      <a
                        href={card.href}
                        className="inline-flex items-center gap-1 mt-3 text-brand-accent text-sm font-medium hover:underline"
                        aria-label={`Learn more about ${card.label}`}
                      >
                        {"Learn more"}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
