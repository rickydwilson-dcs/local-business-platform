"use client";

/**
 * BlogPostBody
 *
 * Full blog post content including title, date, body text, inline images, and numbered list
 * Layout: Single column with text wrapping around right-aligned image, numbered list mid-content, second image left-aligned with text beside
 * Category: Blog
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface BlogPostBodyProps {
  /** post-title */
  postTitle?: string;
  /** post-date */
  postDate?: string;
  /** post-body-text — array of paragraph strings */
  postBodyText?: string[];
  /** inline-image-right */
  inlineImageRight?: { src?: string; alt?: string };
  /** numbered-list */
  numberedList?: string[];
  /** inline-image-left */
  inlineImageLeft?: { src?: string; alt?: string };
  /** author-signature */
  authorSignature?: string;
  /** back-to-blog-link */
  backToBlogLink?: string;
}

export function BlogPostBody(props: BlogPostBodyProps) {
  return (
    <article className="bg-surface-background min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Back to Blog Link */}
        <div className="mb-8">
          <a
            href={props.backToBlogLink ?? "/blog"}
            className="text-brand-primary text-sm font-medium hover:underline inline-flex items-center gap-2"
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

        {/* Post Title */}
        <h1 className="text-surface-foreground text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          {props.postTitle ?? "Blog Post"}
        </h1>

        {/* Post Date */}
        {props.postDate && (
          <time
            dateTime={props.postDate}
            className="text-surface-muted-foreground text-sm block mb-8"
          >
            {props.postDate}
          </time>
        )}

        <hr className="border-surface-muted mb-8" />

        {/* Body Text with Right-Aligned Inline Image */}
        <RevealOnScroll variant="fade-up">
          <section className="mb-10">
            {props.inlineImageRight?.src && (
              <figure className="float-right ml-6 mb-4 w-full max-w-xs">
                <img
                  src={props.inlineImageRight.src}
                  alt={props.inlineImageRight.alt ?? "Inline illustration"}
                  className="rounded-lg w-full h-auto object-cover shadow-md"
                />
              </figure>
            )}
            {props.postBodyText && props.postBodyText.length > 0 ? (
              <div className="text-surface-foreground text-base md:text-lg leading-relaxed space-y-4">
                {props.postBodyText.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="text-surface-foreground text-base md:text-lg leading-relaxed">
                <p>Content coming soon.</p>
              </div>
            )}
            <div className="clear-both" />
          </section>
        </RevealOnScroll>

        {/* Numbered List */}
        {props.numberedList && Array.isArray(props.numberedList) && props.numberedList.length > 0 && (
          <RevealOnScroll variant="fade-up">
            <section className="mb-10 bg-surface-muted rounded-xl p-6 md:p-8">
              <ol className="list-none space-y-4">
                {props.numberedList.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary text-on-brand-primary text-sm font-bold flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="text-surface-foreground text-base md:text-lg leading-relaxed pt-1">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </RevealOnScroll>
        )}

        {/* Left-Aligned Inline Image */}
        {props.inlineImageLeft?.src && (
          <section className="mb-10">
            <figure className="w-full md:w-2/5">
              <img
                src={props.inlineImageLeft.src}
                alt={props.inlineImageLeft.alt ?? "Supporting illustration"}
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
            </figure>
          </section>
        )}

        <hr className="border-surface-muted mb-8" />

        {/* Author Signature */}
        {props.authorSignature && (
          <footer className="mt-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center flex-shrink-0">
              <span className="text-on-brand-secondary text-sm font-bold" aria-hidden="true">
                {props.authorSignature.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-surface-muted-foreground text-sm">
              Written by{' '}
              <span className="text-surface-foreground font-semibold">
                {props.authorSignature}
              </span>
            </p>
          </footer>
        )}

      </div>
    </article>
  );
}
