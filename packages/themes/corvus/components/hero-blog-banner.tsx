/**
 * BlogPageBanner
 *
 * Page-level banner identifying the Blog section with decorative slash marks
 * Layout: Full-width dark background band with left-aligned heading and icon accent
 * Category: Hero
 */

export interface BlogPageBannerProps {
  /** section-icon */
  sectionIcon?: string;
  /** page-title */
  pageTitle?: string;
}

export function BlogPageBanner(props: BlogPageBannerProps) {
  return (
    <section className="w-full bg-surface-inverse py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Decorative slash marks */}
          <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
            <span className="block w-1.5 h-10 md:h-12 bg-brand-accent skew-x-[-12deg]" />
            <span className="block w-1.5 h-10 md:h-12 bg-brand-accent skew-x-[-12deg] opacity-70" />
            <span className="block w-1.5 h-10 md:h-12 bg-brand-accent skew-x-[-12deg] opacity-40" />
          </div>

          {/* Section icon */}
          {props.sectionIcon && (
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-primary shrink-0">
              <span className="text-on-brand-primary text-xl md:text-2xl" aria-hidden="true">
                {props.sectionIcon}
              </span>
            </div>
          )}

          {/* Page title */}
          <div>
            <p className="text-brand-accent text-xs md:text-sm font-semibold uppercase tracking-widest mb-1">
              Our
            </p>
            <h1 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              {props.pageTitle ?? "Blog"}
            </h1>
          </div>
        </div>

        {/* Bottom decorative rule */}
        <div className="mt-8 md:mt-10 flex items-center gap-2" aria-hidden="true">
          <div className="h-px flex-1 bg-surface-muted opacity-30" />
          <div className="flex gap-1">
            <span className="block w-2 h-2 bg-brand-accent skew-x-[-12deg]" />
            <span className="block w-2 h-2 bg-brand-accent skew-x-[-12deg] opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}
