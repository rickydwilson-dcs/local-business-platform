"use client";

/**
 * BlogPostArticle
 *
 * Full blog post content including title, date, body text, inline images, and back-to-blog link
 * Layout: Single column article with text wrapping around right-aligned image, ordered list mid-content, second image left-aligned with text beside it
 * Category: Blog
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostArticleProps {
  /** post-title */
  postTitle?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-date */
  postDate?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-body */
  postBody?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** inline-image-right */
  inlineImageRight?: { src?: string; alt?: string };
  /** inline-list */
  inlineList?: Array<{ label: string; href?: string }>;
  /** inline-image-left */
  inlineImageLeft?: { src?: string; alt?: string };
  /** author-signature */
  authorSignature?: string;
  /** back-link */
  backLink?: Array<{ label?: string; href?: string }>;
}

export function BlogPostArticle(props: BlogPostArticleProps) {
  return (
      <article className="bg-surface-background min-h-screen py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
  
          {/* Back to Blog Link */}
          <div className="mb-8">
            <a
              href={props.backLink ?? '/blog'}
              className="text-brand-primary hover:text-brand-secondary text-sm font-medium inline-flex items-center gap-2 transition-colors duration-200"
              aria-label="Back to blog listing"
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
  
          {/* Article Header */}
          <header className="mb-8 border-b border-surface-muted pb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground leading-tight mb-4">
              {props.postTitle ?? 'Blog Post Title'}
            </h1>
            <time
              className="text-surface-muted-foreground text-sm md:text-base"
              dateTime={props.postDate}
            >
              {props.postDate ?? 'January 1, 2024'}
            </time>
          </header>
  
          {/* Article Body with Right-Aligned Image */}
          <RevealOnScroll variant="fade-up">
            <section className="mb-10">
              {props.inlineImageRight && (
                <figure className="float-right ml-6 mb-4 w-full max-w-xs md:max-w-sm">
                  <img
                    src={props.inlineImageRight}
                    alt="Inline article image"
                    className="rounded-lg w-full h-auto object-cover shadow-md"
                  />
                </figure>
              )}
              <div className="text-surface-foreground text-base md:text-lg leading-relaxed prose prose-neutral max-w-none">
                {props.postBody ?? (
                  <>
                    <p className="mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="mb-4">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </>
                )}
              </div>
              <div className="clear-both" />
            </section>
          </RevealOnScroll>
  
          {/* Ordered List Mid-Content */}
          {props.inlineList && (
            <section className="mb-10 bg-surface-muted rounded-xl p-6 md:p-8">
              <ol className="list-decimal list-inside space-y-3 text-surface-foreground text-base md:text-lg leading-relaxed">
                {Array.isArray(props.inlineList)
                  ? props.inlineList.map((item: string, index: number) => (
                      <li key={index} className="pl-2">
                        {item}
                      </li>
                    ))
                  : (
                    <>
                      <li className="pl-2">First key point from the article content</li>
                      <li className="pl-2">Second important takeaway for readers</li>
                      <li className="pl-2">Third actionable insight to consider</li>
                      <li className="pl-2">Fourth conclusion drawn from the discussion</li>
                    </>
                  )}
              </ol>
            </section>
          )}
  
          {/* Left-Aligned Image with Text Beside It */}
          <RevealOnScroll variant="fade-up">
            <section className="mb-10">
              <div className="md:flex md:items-start md:gap-8">
                {props.inlineImageLeft && (
                  <figure className="mb-6 md:mb-0 md:flex-shrink-0 w-full md:w-64 lg:w-80">
                    <img
                      src={props.inlineImageLeft}
                      alt="Supporting article image"
                      className="rounded-lg w-full h-auto object-cover shadow-md"
                    />
                  </figure>
                )}
                <div className="text-surface-foreground text-base md:text-lg leading-relaxed flex-1">
                  <p className="mb-4">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </div>
            </section>
          </RevealOnScroll>
  
          {/* Author Signature */}
          {props.authorSignature && (
            <footer className="mt-12 pt-8 border-t border-surface-muted">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-on-brand-primary font-bold text-lg" aria-hidden="true">
                    {typeof props.authorSignature === 'string'
                      ? props.authorSignature.charAt(0).toUpperCase()
                      : 'A'}
                  </span>
                </div>
                <div>
                  <p className="text-surface-muted-foreground text-sm mb-1">Written by</p>
                  <p className="text-surface-foreground font-semibold text-base">
                    {props.authorSignature}
                  </p>
                </div>
              </div>
            </footer>
          )}
  
          {/* Bottom Back to Blog Link */}
          <div className="mt-12 pt-6 border-t border-surface-muted">
            <a
              href={props.backLink ?? '/blog'}
              className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-medium text-sm md:text-base transition-colors duration-200"
              aria-label="Return to blog listing page"
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
              Back to all posts
            </a>
          </div>
  
        </div>
      </article>
    );
}
