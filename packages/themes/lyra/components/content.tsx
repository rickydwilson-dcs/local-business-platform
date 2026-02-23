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
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {props.image && (
              <div className="order-2 md:order-1">
                <img
                  src={props.image}
                  alt=""
                  className="w-full h-auto rounded-lg object-cover shadow-md"
                />
              </div>
            )}
            <RevealOnScroll variant="fade-up">
              <div className={`order-1 ${props.image ? 'md:order-2' : 'md:col-span-2 max-w-3xl mx-auto text-center'}`}>
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
