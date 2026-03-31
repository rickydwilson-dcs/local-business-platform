/**
 * PageBanner
 *
 * Page-level banner identifying the Blog section with decorative slash marks
 * Layout: Full-width dark background band with left-aligned heading and decorative icon prefix
 * Category: Hero
 */

export interface PageBannerProps {
  /** section-label */
  sectionLabel?: string;
  /** decorative-icon */
  decorativeIcon?: string;
}

export function PageBanner(props: PageBannerProps) {
  return (
      <section className="w-full bg-surface-inverse py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            {props.decorativeIcon && (
              <span
                className="text-brand-accent text-2xl md:text-3xl lg:text-4xl font-bold select-none"
                aria-hidden="true"
              >
                {props.decorativeIcon}
              </span>
            )}
            {!props.decorativeIcon && (
              <span
                className="text-brand-accent text-2xl md:text-3xl lg:text-4xl font-bold select-none"
                aria-hidden="true"
              >
                //
              </span>
            )}
            <h1 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {props.sectionLabel ? props.sectionLabel : "Blog"}
            </h1>
          </div>
          <div className="mt-3 flex items-center gap-2" aria-hidden="true">
            <span className="text-brand-accent font-bold text-lg md:text-xl select-none">
              /
            </span>
            <span className="text-brand-accent font-bold text-lg md:text-xl select-none">
              /
            </span>
            <span className="text-brand-accent font-bold text-lg md:text-xl select-none">
              /
            </span>
          </div>
        </div>
      </section>
    );
}
