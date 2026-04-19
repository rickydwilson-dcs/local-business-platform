"use client";
import { RevealOnScroll } from "@platform/core-components/components/animation";
("use client");

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
}

export function Content(props: ContentProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="prose prose-lg text-surface-foreground max-w-none">
            {props.body ? (
              <div
                className="text-surface-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: props.body }}
              />
            ) : (
              <p className="text-surface-muted-foreground italic">No content available.</p>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
