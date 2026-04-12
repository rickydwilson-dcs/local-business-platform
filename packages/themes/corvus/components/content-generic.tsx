"use client";

/**
 * ContentBlock
 *
 * Generic content section with body text and optional image
 * Layout: Contained single or two-column block with body text and optional image
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentBlockProps {
  /** body */
  body?: string;
  /** image */
  image?: { src?: string; alt?: string };
}

export function ContentBlock(props: ContentBlockProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid gap-10 items-center ${props.image ? "md:grid-cols-2" : "grid-cols-1"}`}
        >
          <RevealOnScroll variant="fade-up">
            <div className={`${!props.image ? "max-w-3xl mx-auto text-center" : ""}`}>
              {props.body && (
                <p className="text-surface-foreground text-lg leading-relaxed">{props.body}</p>
              )}
            </div>
          </RevealOnScroll>

          {props.image && (
            <RevealOnScroll variant="fade-up">
              <div className="w-full overflow-hidden rounded-2xl shadow-md">
                <img src={props.image} alt="" className="w-full h-full object-cover" />
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>
    </section>
  );
}
