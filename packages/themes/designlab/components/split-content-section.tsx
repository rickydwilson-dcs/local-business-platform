"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * SplitContentSection
 *
 * Persuasive content section reinforcing a service value proposition with body copy and supporting imagery in a two-column layout
 * Layout: Two-column split: text content one side, image other side on dark background
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SplitContentSectionProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** supporting-image */
  supportingImage?: { src?: string; alt?: string };
}

export function SplitContentSection(props: SplitContentSectionProps) {
  return (
    <section className="bg-surface-inverse py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              {props.heading && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
                  {props.heading}
                </h2>
              )}
              {props.bodyText && (
                <p className="text-lg md:text-xl text-surface-muted-foreground leading-relaxed">
                  {props.bodyText}
                </p>
              )}
              <div className="mt-2">
                <span className="inline-block w-16 h-1 bg-brand-accent rounded-full" />
              </div>
            </div>
          </RevealOnScroll>

          {/* Supporting Image */}
          <RevealOnScroll variant="fade-up">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              {props.supportingImage?.src ? (
                <img
                  src={props.supportingImage.src}
                  alt={props.supportingImage.alt ?? "Supporting visual"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-muted flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">Image coming soon</span>
                </div>
              )}
              {/* Decorative overlay accent */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-brand-primary opacity-20 pointer-events-none" />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
