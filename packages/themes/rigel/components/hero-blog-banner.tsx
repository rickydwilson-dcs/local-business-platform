/**
 * BlogPageBanner
 *
 * Page-level banner identifying the Blog section with decorative slash marks
 * Layout: Full-width teal/dark background with left-aligned heading and icon marks
 * Category: Hero
 */

export interface BlogPageBannerProps {
  /** section-label */
  sectionLabel?: string;
  /** decorative-slashes */
  decorativeSlashes?: string;
}

export function BlogPageBanner(props: BlogPageBannerProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-brand-accent text-3xl font-bold leading-none select-none" aria-hidden="true">
              //
            </span>
            <span className="text-brand-accent text-3xl font-bold leading-none select-none" aria-hidden="true">
              //
            </span>
            {props.decorativeSlashes && (
              <span className="text-brand-accent text-3xl font-bold leading-none select-none" aria-hidden="true">
                //
              </span>
            )}
          </div>
  
          <h1 className="text-on-brand-primary text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {props.sectionLabel ?? "Blog"}
          </h1>
  
          <div className="flex items-center gap-3 mt-2" aria-hidden="true">
            <span className="text-brand-secondary text-2xl font-bold opacity-60">/</span>
            <span className="text-brand-secondary text-2xl font-bold opacity-40">/</span>
            <span className="text-brand-secondary text-2xl font-bold opacity-20">/</span>
          </div>
        </div>
      </section>
    );
}
