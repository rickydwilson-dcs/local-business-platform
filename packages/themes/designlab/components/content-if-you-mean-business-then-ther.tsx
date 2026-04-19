"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * ContentIfYouMeanBusinessThenTher
 *
 * Content section: If you mean business, then theres no alternative
 * Layout: contained
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentIfYouMeanBusinessThenTherProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
  /** image */
  image?: { src?: string; alt?: string };
}

export function ContentIfYouMeanBusinessThenTher(props: ContentIfYouMeanBusinessThenTherProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <RevealOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground leading-tight">
                {props.heading ?? "If you mean business, then there's no alternative"}
              </h2>
              <p className="text-surface-muted-foreground text-lg leading-relaxed mt-4">
                {props.body ??
                  "When results matter and performance is non-negotiable, serious professionals choose tools built for serious work. No compromises, no shortcuts — just the platform designed to help you win."}
              </p>
            </RevealOnScroll>
          </div>

          {/* Image */}
          <RevealOnScroll variant="fade-up">
            <div className="relative w-full aspect-video md:aspect-square lg:aspect-video overflow-hidden rounded-2xl shadow-lg">
              {props.image?.src ? (
                <img
                  src={props.image.src}
                  alt={props.image.alt ?? "Business professionals at work"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-muted flex items-center justify-center rounded-2xl">
                  <span className="text-surface-muted-foreground text-sm">Image placeholder</span>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
