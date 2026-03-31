"use client";

/**
 * LegalContent
 *
 * Displays long-form legal or policy content such as Privacy Policy with heading and body
 * Layout: Contained single-column layout with heading and rich body text
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface LegalContentProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
}

export function LegalContent(props: LegalContentProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <header className="mb-10 border-b border-surface-muted pb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-surface-foreground leading-tight">
                {props.heading ?? "Privacy Policy"}
              </h1>
            </header>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="prose prose-neutral max-w-none text-surface-foreground">
              {props.body ? (
                <div
                  className="space-y-6 text-base md:text-lg leading-relaxed text-surface-foreground [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-surface-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-surface-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_a]:text-brand-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-surface-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-surface-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-surface-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: props.body }}
                />
              ) : (
                <div className="space-y-6 text-base md:text-lg leading-relaxed text-surface-muted-foreground">
                  <p>
                    No content has been provided for this policy document. Please
                    check back later or contact us for more information.
                  </p>
                </div>
              )}
            </div>
          </RevealOnScroll>
  
          <footer className="mt-12 pt-6 border-t border-surface-muted">
            <p className="text-sm text-surface-muted-foreground">
              If you have any questions about this policy, please{" "}
              <a
                href="/contact"
                className="text-brand-primary underline hover:opacity-80 transition-opacity"
              >
                contact us
              </a>
              .
            </p>
          </footer>
        </div>
      </section>
    );
}
