"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

/**
 * ContentBringYourIdeaToLifeWithD
 *
 * Content section: Bring your idea to life with Design Lab
 * Layout: contained
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentBringYourIdeaToLifeWithDProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
  /** image */
  image?: { src?: string; alt?: string };
}

export function ContentBringYourIdeaToLifeWithD(props: ContentBringYourIdeaToLifeWithDProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <RevealOnScroll variant="fade-up">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground leading-tight">
                {props.heading ?? "Bring your idea to life with Design Lab"}
              </h2>
              <p className="mt-4 text-lg text-surface-muted-foreground leading-relaxed">
                {props.body ??
                  "Design Lab gives you the tools, templates, and creative freedom to turn your vision into reality. Whether you're starting from scratch or refining an existing concept, we're here to help every step of the way."}
              </p>
            </RevealOnScroll>
          </div>

          {/* Image */}
          <RevealOnScroll variant="fade-up">
            <div className="w-full rounded-2xl overflow-hidden shadow-lg">
              {props.image?.src ? (
                <img
                  src={props.image.src}
                  alt={props.image.alt ?? "Design Lab illustration"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-surface-muted flex items-center justify-center rounded-2xl">
                  <span className="text-surface-muted-foreground text-sm">Image coming soon</span>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
