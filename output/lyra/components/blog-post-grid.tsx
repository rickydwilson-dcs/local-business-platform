/**
 * BlogPostGrid
 *
 * Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA
 * Layout: Two-column card grid on white background, each card with top image, heading, date, body text, and button
 * Category: Blog
 */

export interface BlogPostGridProps {
  /** post-thumbnail */
  postThumbnail?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-title */
  postTitle?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-date */
  postDate?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** post-excerpt */
  postExcerpt?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
  /** read-more-button */
  readMoreButton?: Array<{ label?: string; href?: string }>;
}

export function BlogPostGrid(props: BlogPostGridProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[0, 1, 2, 3].map((index) => (
            <article
              key={index}
              className="bg-surface-foreground rounded-2xl overflow-hidden shadow-sm border border-surface-muted flex flex-col"
            >
              {props["post-thumbnail"] ? (
                <div className="w-full aspect-video overflow-hidden">
                  <img
                    src={props["post-thumbnail"]}
                    alt={props["post-title"] || "Blog post thumbnail"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-surface-muted flex items-center justify-center">
                  <span className="text-surface-muted-foreground text-sm">No image available</span>
                </div>
              )}

              <div className="flex flex-col flex-1 p-6 gap-4">
                {props["post-date"] && (
                  <time className="text-surface-muted-foreground text-sm font-medium uppercase tracking-wide">
                    {props["post-date"]}
                  </time>
                )}

                {props["post-title"] && (
                  <h2 className="text-surface-foreground text-xl font-bold leading-snug">
                    {props["post-title"]}
                  </h2>
                )}

                {props["post-excerpt"] && (
                  <p className="text-surface-muted-foreground text-base leading-relaxed flex-1">
                    {props["post-excerpt"]}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    className="inline-block border-2 border-brand-primary text-brand-primary font-semibold px-6 py-2 rounded-full hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    aria-label={`Read more about ${props["post-title"] || "this post"}`}
                  >
                    {props["read-more-button"] || "Read More"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
