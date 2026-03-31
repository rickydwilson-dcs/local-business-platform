"use client";

/**
 * BlogPostArticle
 *
 * Full blog post content including title, date, body copy, inline images, and back-to-blog link
 * Layout: Single-column article with text wrapping around right-aligned image at top, second image inline mid-content, ordered list, and back link at bottom
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostArticleProps {
  /** post-title */
  postTitle?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-date */
  postDate?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** featured-image */
  featuredImage?: { src?: string; alt?: string };
  /** body-copy */
  bodyCopy?: string;
  /** ordered-list */
  orderedList?: Array<{ label: string; href?: string }>;
  /** inline-image */
  inlineImage?: { src?: string; alt?: string };
  /** back-to-blog-link */
  backToBlogLink?: Array<{ label?: string; href?: string }>;
}

export function BlogPostArticle(props: BlogPostArticleProps) {
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
              <time className="text-sm text-surface-muted-foreground uppercase tracking-wide">
                {props.postDate}
              </time>
            )}
          </header>
  
          {/* Article Body with Float Image */}
          <RevealOnScroll variant="fade-up">
            <section className="mb-10">
              {props.featuredImage && (
                <div className="float-right ml-6 mb-4 w-full max-w-xs md:max-w-sm rounded-lg overflow-hidden shadow-md">
                  <img
                    src={props.featuredImage}
                    alt={props.postTitle || "Featured image"}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              {props.bodyCopy && (
                <div className="text-surface-foreground text-base md:text-lg leading-relaxed space-y-4">
                  <p>{props.bodyCopy}</p>
                </div>
              )}
              <div className="clear-both" />
            </section>
          </RevealOnScroll>
  
          {/* Inline Mid-Content Image */}
          {props.inlineImage && (
            <RevealOnScroll variant="fade-up">
              <figure className="my-10 rounded-lg overflow-hidden shadow-md">
                <img
                  src={props.inlineImage}
                  alt="Inline content image"
                  className="w-full h-auto object-cover"
                />
              </figure>
            </RevealOnScroll>
          )}
  
          {/* Ordered List Section */}
          {props.orderedList && props.orderedList.length > 0 && (
            <RevealOnScroll variant="fade-up">
              <section className="mb-10">
                <ol className="list-decimal list-inside space-y-3 text-surface-foreground text-base md:text-lg leading-relaxed pl-2">
                  {props.orderedList.map((item, index) => (
                    <li key={index} className="pl-2">
                      {item}
                    </li>
                  ))}
                </ol>
              </section>
            </RevealOnScroll>
          )}
  
          {/* Divider */}
          <hr className="border-surface-muted my-10" />
  
          {/* Back to Blog Link */}
          {props.backToBlogLink && (
            <div className="flex items-center">
              <a
                href={props.backToBlogLink}
                className="inline-flex items-center gap-2 text-brand-primary font-medium text-sm md:text-base hover:underline transition-all duration-200"
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
