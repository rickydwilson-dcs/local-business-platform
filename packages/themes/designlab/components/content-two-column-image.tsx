"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * BusinessAlternativeContent
 *
 * Persuasive content section with heading 'If you mean business, then there's no alternative', supporting copy and imagery
 * Layout: Two-column layout: text left or right, image opposite on dark background
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BusinessAlternativeContentProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** supporting-image */
  supportingImage?: { src?: string; alt?: string };
}

export function BusinessAlternativeContent(props: BusinessAlternativeContentProps) {
  return (
    <section className="bg-surface-inverse py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Column */}
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col justify-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-background leading-tight">
                {props.sectionHeading ?? "If you mean business, then there's no alternative"}
              </h2>
              {props.bodyCopy && (
                <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed">
                  {props.bodyCopy}
                </p>
              )}
              <div className="pt-4">
                <span className="inline-block w-16 h-1 bg-brand-accent rounded-full" />
              </div>
            </div>
          </RevealOnScroll>

          {/* Image Column */}
          <div className="relative flex items-center justify-center">
            {props.supportingImage?.src ? (
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={props.supportingImage.src}
                  alt={props.supportingImage.alt ?? "Business alternative supporting image"}
                  className="w-full h-full object-cover aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-brand-primary opacity-10 rounded-2xl pointer-events-none" />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] rounded-2xl bg-surface-foreground flex items-center justify-center border border-surface-muted">
                <span className="text-surface-muted-foreground text-sm">Image placeholder</span>
              </div>
            )}
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-accent opacity-20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand-primary opacity-20 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
