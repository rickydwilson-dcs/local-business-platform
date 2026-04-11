"use client";

/**
 * BlogPostArticle
 *
 * Full blog post content including title, date, body copy, inline images, ordered list, and back-to-blog link
 * Layout: Single-column article with text wrapping around right-aligned image at top, second image inline mid-content, ordered list, and back link at bottom
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostArticleProps {
  /** post-title */
  postTitle?: string;
  /** post-date */
  postDate?: string;
  /** featured-image */
  featuredImage?: { src?: string; alt?: string };
  /** body-copy */
  bodyCopy?: string;
  /** ordered-list */
  orderedList?: Array<{ label: string; href?: string }>;
  /** inline-image */
  inlineImage?: { src?: string; alt?: string };
  /** author-signature */
  authorSignature?: string;
  /** back-to-blog-link */
  backToBlogLink?: { label?: string; href?: string };
}

export function BlogPostArticle(props: BlogPostArticleProps) {
  return (
    <article className="bg-surface-background min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          {props.postTitle && (
            <h1 className="text-4xl md:text-5xl font-bold text-surface-foreground leading-tight mb-3">
              {props.postTitle}
            </h1>
          )}
          {props.postDate && (
            <time className="text-sm text-surface-muted-foreground uppercase tracking-wide">
              {props.postDate}
            </time>
          )}
        </header>

        {/* Featured Image — right-aligned, text wraps around */}
        {props.featuredImage && (
          <div className="float-right ml-6 mb-4 w-full max-w-xs md:max-w-sm rounded-lg overflow-hidden shadow-md">
            <img
              src={props.featuredImage.src}
              alt={props.featuredImage.alt || props.postTitle || "Featured image"}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Body Copy */}
        <RevealOnScroll variant="fade-up">
          {props.bodyCopy && (
            <div className="prose max-w-none text-surface-foreground leading-relaxed text-base md:text-lg mb-8">
              <p>{props.bodyCopy}</p>
            </div>
          )}
        </RevealOnScroll>

        {/* Clear float before inline image */}
        <div className="clear-both" />

        {/* Inline Image — mid-content, full width */}
        {props.inlineImage && (
          <figure className="my-10 rounded-lg overflow-hidden shadow-md">
            <img
              src={props.inlineImage.src}
              alt={props.inlineImage.alt || "Inline article image"}
              className="w-full h-auto object-cover"
            />
          </figure>
        )}

        {/* Ordered List */}
        <RevealOnScroll variant="fade-up">
          {props.orderedList &&
            Array.isArray(props.orderedList) &&
            props.orderedList.length > 0 && (
              <section className="my-8 bg-surface-muted rounded-lg p-6 md:p-8">
                <ol className="list-decimal list-inside space-y-3 text-surface-foreground text-base md:text-lg">
                  {props.orderedList.map((item, index) => (
                    <li key={index} className="leading-relaxed pl-2">
                      {item.label}
                    </li>
                  ))}
                </ol>
              </section>
            )}
        </RevealOnScroll>

        {/* Author Signature */}
        {props.authorSignature && (
          <div className="mt-10 pt-6 border-t border-surface-muted">
            <p className="text-surface-muted-foreground italic text-sm md:text-base">
              {props.authorSignature}
            </p>
          </div>
        )}

        {/* Back to Blog Link */}
        {props.backToBlogLink && (
          <div className="mt-10 pt-6 border-t border-surface-muted">
            <a
              href={props.backToBlogLink.href ?? "#"}
              className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm md:text-base hover:underline transition-all duration-200"
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
