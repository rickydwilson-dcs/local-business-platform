"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * AboutHeroSplit
 *
 * Introduces the company with a headline, body copy and a team photo beside a branded van
 * Layout: Two-column split: text left, image right on dark background
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface AboutHeroSplitProps {
  /** eyebrow-label */
  eyebrowLabel?: string;
  /** heading */
  heading?: string;
  /** divider */
  divider?: string;
  /** body-copy */
  bodyCopy?: string;
  /** team-photo */
  teamPhoto?: { src?: string; alt?: string };
}

export function AboutHeroSplit(props: AboutHeroSplitProps) {
  return (
    <section className="bg-surface-inverse min-h-screen flex items-center py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Text Content */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            {props.eyebrowLabel && (
              <span className="text-brand-primary text-sm font-semibold uppercase tracking-widest">
                {props.eyebrowLabel}
              </span>
            )}

            {props.heading && (
              <h1 className="text-surface-background text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {props.heading}
              </h1>
            )}

            {props.divider && <div className="w-16 h-1 bg-brand-primary rounded-full" />}

            {props.bodyCopy && (
              <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed max-w-prose">
                {props.bodyCopy}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Right: Team Photo */}
        <RevealOnScroll variant="fade-up">
          <div className="relative w-full h-72 md:h-96 lg:h-[520px] rounded-2xl overflow-hidden border border-surface-muted">
            {props.teamPhoto?.src ? (
              <img
                src={props.teamPhoto.src}
                alt={props.teamPhoto.alt ?? "Our team beside a branded van"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-muted flex items-center justify-center">
                <span className="text-surface-muted-foreground text-sm">Team photo</span>
              </div>
            )}
            {/* Decorative accent border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
