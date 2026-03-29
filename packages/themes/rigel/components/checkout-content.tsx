"use client";

/**
 * CheckoutContent
 *
 * Displays the ticket checkout flow content with heading and body
 * Layout: Contained single-column layout with heading and checkout body content
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CheckoutContentProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
}

export function CheckoutContent(props: CheckoutContentProps) {
  return (
      <div className="bg-surface-background min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <RevealOnScroll variant="fade-up">
            {props.heading && (
              <h1 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-8 text-center">
                {props.heading}
              </h1>
            )}
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            {props.body && (
              <div className="bg-surface-foreground rounded-2xl shadow-md p-6 md:p-10 text-surface-foreground">
                {props.body}
              </div>
            )}
          </RevealOnScroll>
        </div>
      </div>
    );
}
