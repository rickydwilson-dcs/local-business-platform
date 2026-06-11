/**
 * FeaturedBlogPost
 *
 * Highlights the latest or featured blog post with image, tags, title, excerpt and author
 * Layout: Two-column split: image left, text content right with category tags, title, excerpt and author avatar
 * Category: Blog
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface FeaturedBlogPostProps {
  /** post-image */
  postImage?: { src?: string; alt?: string };
  /** category-tags */
  categoryTags?: string;
  /** post-title */
  postTitle?: string;
  /** post-excerpt */
  postExcerpt?: string;
  /** author-avatar */
  authorAvatar?: { src?: string; alt?: string };
  /** author-name */
  authorName?: string;
}
export function FeaturedBlogPost(props: FeaturedBlogPostProps) {
  return (
    <section className="bg-surface-background py-12 px-4 md:py-20">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg bg-surface-foreground">
            {/* Left: Featured Image */}
            <div className="md:w-1/2 w-full relative">
              {props.postImage?.src ? (
                <img
                  src={props.postImage.src}
                  alt={props.postImage.alt ?? "Featured blog post image"}
                  className="w-full h-64 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-surface-muted flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">No image available</span>
                </div>
              )}
            </div>

            {/* Right: Text Content */}
            <div className="md:w-1/2 w-full flex flex-col justify-center p-8 md:p-12 gap-5">
              {/* Category Tags */}
              {props.categoryTags && props.categoryTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-brand-accent text-on-brand-secondary">
                    {props.categoryTags}
                  </span>
                </div>
              )}

              {/* Post Title */}
              {props.postTitle && (
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-foreground leading-tight">
                  {props.postTitle}
                </h2>
              )}

              {/* Post Excerpt */}
              {props.postExcerpt && (
                <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed line-clamp-4">
                  {props.postExcerpt}
                </p>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 mt-2">
                {props.authorAvatar?.src ? (
                  <img
                    src={props.authorAvatar.src}
                    alt={props.authorAvatar.alt ?? props.authorName ?? "Author avatar"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand-primary"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                    <span className="text-on-brand-primary text-sm font-bold">
                      {props.authorName ? props.authorName.charAt(0).toUpperCase() : "A"}
                    </span>
                  </div>
                )}
                {props.authorName && (
                  <div>
                    <p className="text-sm font-semibold text-surface-foreground">
                      {props.authorName}
                    </p>
                    <p className="text-xs text-surface-muted-foreground">Author</p>
                  </div>
                )}
              </div>

              {/* Read More CTA */}
              <div className="mt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm hover:underline transition-all"
                  aria-label="Read full blog post"
                >
                  Read Full Article
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
