"use client";

/**
 * BlogPostArticle
 *
 * Full blog post content including title, date, body text, inline images, and back-to-blog link
 * Layout: Single column with inline images floated right and left at various points, ordered list mid-content
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostArticleProps {
  /** post-title */
  postTitle?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-date */
  postDate?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-body-text */
  postBodyText?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** inline-image-right */
  inlineImageRight?: { src?: string; alt?: string };
  /** ordered-list */
  orderedList?: Array<{ label: string; href?: string }>;
  /** inline-image-left */
  inlineImageLeft?: { src?: string; alt?: string };
  /** back-to-blog-link */
  backToBlogLink?: Array<{ label?: string; href?: string }>;
}

export function BlogPostArticle(props: BlogPostArticleProps) {
  return (
      <article className="bg-surface-background min-h-screen py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
  
          {/* Back to Blog Link */}
          <div className="mb-8">
            <a
              href={props.backToBlogLink ?? '#'}
              className="text-brand-primary hover:text-brand-secondary text-sm font-medium inline-flex items-center gap-2 transition-colors duration-200"
              aria-label="Back to blog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </a>
          </div>
  
          {/* Post Header */}
          <RevealOnScroll variant="fade-up">
            <header className="mb-10">
              <h1 className="text-surface-foreground text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {props.postTitle ?? 'Blog Post Title'}
              </h1>
              <time className="text-surface-muted-foreground text-sm md:text-base">
                {props.postDate ?? 'January 1, 2024'}
              </time>
              <div className="mt-6 border-t border-surface-muted" />
            </header>
          </RevealOnScroll>
  
          {/* Post Body - First Section with Inline Image Floated Right */}
          <section className="mb-10">
            {props.inlineImageRight && (
              <div className="float-right ml-6 mb-4 w-full max-w-xs md:max-w-sm">
                <img
                  src={props.inlineImageRight}
                  alt="Inline illustration"
                  className="rounded-lg w-full h-auto object-cover shadow-md"
                />
              </div>
            )}
            <div className="text-surface-foreground text-base md:text-lg leading-relaxed">
              {props.postBodyText ?? (
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              )}
            </div>
            <div className="clear-both" />
          </section>
  
          {/* Ordered List Mid-Content */}
          {props.orderedList && (
            <RevealOnScroll variant="fade-up">
              <section className="mb-10 bg-surface-muted rounded-xl p-6 md:p-8">
                <ol className="list-decimal list-inside space-y-3 text-surface-foreground text-base md:text-lg leading-relaxed">
                  {Array.isArray(props.orderedList)
                    ? props.orderedList.map((item: string, index: number) => (
                        <li key={index} className="pl-2">
                          {item}
                        </li>
                      ))
                    : (
                      <>
                        <li className="pl-2">First key point of the article</li>
                        <li className="pl-2">Second important consideration</li>
                        <li className="pl-2">Third takeaway for readers</li>
                        <li className="pl-2">Fourth actionable insight</li>
                      </>
                    )}
                </ol>
              </section>
            </RevealOnScroll>
          )}
  
          {/* Post Body - Second Section with Inline Image Floated Left */}
          <section className="mb-12">
            {props.inlineImageLeft && (
              <div className="float-left mr-6 mb-4 w-full max-w-xs md:max-w-sm">
                <img
                  src={props.inlineImageLeft}
                  alt="Inline illustration"
                  className="rounded-lg w-full h-auto object-cover shadow-md"
                />
              </div>
            )}
            <div className="text-surface-foreground text-base md:text-lg leading-relaxed space-y-4">
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
            <div className="clear-both" />
          </section>
  
          {/* Footer Divider and Back Link */}
          <footer className="border-t border-surface-muted pt-8 mt-8">
            <a
              href={props.backToBlogLink ?? '#'}
              className="text-brand-primary hover:text-brand-secondary text-sm font-medium inline-flex items-center gap-2 transition-colors duration-200"
              aria-label="Back to blog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </a>
          </footer>
  
        </div>
      </article>
    );
}
