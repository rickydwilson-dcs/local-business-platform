"use client";

/**
 * Hero
 *
 * Hero section
 * Layout: contained
 * Category: Hero
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface HeroProps {
  /** subheading */
  subheading?: string;
  /** ctaButtons */
  ctaButtons?: Array<{ label?: string; href?: string }>;
  /** backgroundImage */
  backgroundImage?: { src?: string; alt?: string };
}

export function Hero(props: HeroProps) {
  return (
    <section className="relative w-full bg-brand-primary overflow-hidden">
      {props.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${props.backgroundImage})` }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          <RevealOnScroll variant="fade-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-surface-background leading-tight max-w-4xl">
              {props.heading ?? "Welcome to Our Platform"}
            </h1>
          </RevealOnScroll>

          {props.subheading && (
            <RevealOnScroll variant="fade-up">
              <p className="text-base md:text-lg lg:text-xl text-surface-background opacity-80 max-w-2xl leading-relaxed">
                {props.subheading}
              </p>
            </RevealOnScroll>
          )}

          {props.ctaButtons && props.ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              {props.ctaButtons.map((button, index) => (
                <a
                  key={index}
                  href={button.href}
                  className={
                    index === 0
                      ? "inline-flex items-center justify-center px-8 py-3 rounded-lg bg-surface-background text-brand-primary font-semibold text-base hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                      : "inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-surface-muted text-surface-background font-semibold text-base hover:bg-surface-background hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                  }
                >
                  {button.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
