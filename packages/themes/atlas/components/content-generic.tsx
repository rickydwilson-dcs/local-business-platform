"use client";

/**
 * ContentBlock
 *
 * Generic content section with body text and optional image, used for legal pages, checkout, and utility pages
 * Layout: Contained single-column block with heading and body text, optional inline image
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentBlockProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
  /** image */
  image?: { src?: string; alt?: string };
}

export function ContentBlock(props: ContentBlockProps) {
  return (
      <section className="bg-surface-background py-12 px-4 md:py-16">
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll variant="fade-up">
            {props.heading && (
              <h2 className="text-2xl md:text-3xl font-semibold text-surface-foreground mb-6">
                {props.heading}
              </h2>
            )}
  
            {props.image && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={props.image.src}
                  alt={props.image.alt ?? ''}
                  className="w-full md:w-1/2 float-none md:float-right md:ml-8 md:mb-4 rounded-lg object-cover"
                />
              </div>
            )}
  
            {props.body && (
              <div className="text-surface-foreground text-base md:text-lg leading-relaxed space-y-4 clearfix">
                {typeof props.body === 'string' ? (
                  <p>{props.body}</p>
                ) : (
                  props.body
                )}
              </div>
            )}
          </RevealOnScroll>
        </div>
      </section>
    );
}
