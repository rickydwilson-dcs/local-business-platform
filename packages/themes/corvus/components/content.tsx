"use client";

/**
 * Content
 *
 * Content section
 * Layout: contained
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentProps {
  /** body */
  body?: string;
  /** image */
  image?: { src?: string; alt?: string };
}

export function Content(props: ContentProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {props.image && (
            <div className="w-full rounded-xl overflow-hidden shadow-md">
              <img
                src={props.image.src}
                alt={props.image.alt ?? "Content illustration"}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <RevealOnScroll variant="fade-up">
            <div className={props.image ? "" : "md:col-span-2 max-w-2xl mx-auto text-center"}>
              {props.body && (
                <div className="text-surface-foreground text-base md:text-lg leading-relaxed space-y-4">
                  <p>{props.body}</p>
                </div>
              )}
              {!props.body && !props.image && (
                <p className="text-surface-muted-foreground text-base italic">
                  No content available.
                </p>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
