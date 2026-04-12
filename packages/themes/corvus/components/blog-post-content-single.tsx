"use client";

/**
 * BlogPostBody
 *
 * Full blog post content including title, date, body text, inline images, ordered list, author signature, and back-to-blog link
 * Layout: Single column content area with inline right-floated and left-aligned images, ordered list, and closing back link
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface BlogPostBodyProps {
  /** post-title */
  postTitle?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-date */
  postDate?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-body-text */
  postBodyText?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** inline-image-right */
  inlineImageRight?: { src?: string; alt?: string };
  /** inline-image-left */
  inlineImageLeft?: { src?: string; alt?: string };
  /** ordered-list */
  orderedList?: Array<{ label: string; href?: string }>;
  /** author-signature */
  authorSignature?: string;
  /** back-to-blog-link */
  backToBlogLink?: Array<{ label?: string; href?: string }>;
}

export function BlogPostBody(props: BlogPostBodyProps) {
  return (
    <article className="bg-surface-background min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Post Header */}
        <header className="mb-8">
          {props.postTitle && (
            <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground leading-tight mb-3">
              {props.postTitle}
            </h1>
          )}
          {props.postDate && (
            <time className="text-surface-muted-foreground text-sm md:text-base">
              {props.postDate}
            </time>
          )}
          <div className="mt-4 border-b border-surface-muted" />
        </header>

        {/* Body Content */}
        <RevealOnScroll variant="fade-up">
          <section className="prose-section mb-8">
            {/* Inline Right-Floated Image */}
            {props.inlineImageRight && (
              <div className="float-right ml-6 mb-4 w-full max-w-xs rounded-lg overflow-hidden shadow-md">
                <img
                  src={props.inlineImageRight}
                  alt="Inline illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Body Text */}
            {props.postBodyText && (
              <p className="text-surface-foreground text-base md:text-lg leading-relaxed mb-6">
                {props.postBodyText}
              </p>
            )}

            {/* Clear float before left image */}
            <div className="clear-both" />

            {/* Inline Left-Aligned Image */}
            {props.inlineImageLeft && (
              <div className="mr-6 mb-4 w-full max-w-xs rounded-lg overflow-hidden shadow-md">
                <img
                  src={props.inlineImageLeft}
                  alt="Inline illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </section>
        </RevealOnScroll>

        {/* Ordered List */}
        {props.orderedList && props.orderedList.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <section className="mb-8">
              <ol className="list-decimal list-inside space-y-3 pl-2">
                {props.orderedList.map((item, index) => (
                  <li
                    key={index}
                    className="text-surface-foreground text-base md:text-lg leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          </RevealOnScroll>
        )}

        {/* Author Signature */}
        {props.authorSignature && (
          <footer className="mt-10 pt-6 border-t border-surface-muted">
            <div className="flex items-center gap-3">
              <span className="text-surface-muted-foreground text-sm">Written by</span>
              <span className="text-brand-primary font-semibold text-sm md:text-base">
                {props.authorSignature}
              </span>
            </div>
          </footer>
        )}

        {/* Back to Blog Link */}
        {props.backToBlogLink && (
          <div className="mt-8">
            <a
              href={props.backToBlogLink}
              className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-medium text-sm md:text-base transition-colors duration-200"
              aria-label="Back to blog listing"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
