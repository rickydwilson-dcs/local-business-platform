/**
 * PageTitleBanner
 *
 * Full-width page-level banner identifying interior sections with decorative slash marks and large heading
 * Layout: Full-width solid colour band with left-aligned heading and decorative icon prefix
 * Category: Hero
 */

export interface PageTitleBannerProps {
  /** page-title */
  pageTitle?: string;
  /** decorative-prefix */
  decorativePrefix?: string;
  /** decorative-icon */
  decorativeIcon?: string;
}

export function PageTitleBanner(props: PageTitleBannerProps) {
  return (
      <section className="w-full bg-brand-secondary py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-4 md:gap-6">
            {/* Decorative icon or slash prefix */}
            {props.decorativeIcon ? (
              <span
                className="text-brand-accent text-3xl md:text-4xl lg:text-5xl flex-shrink-0"
                aria-hidden="true"
              >
                {props.decorativeIcon}
              </span>
            ) : (
              <span
                className="flex items-center gap-1 flex-shrink-0"
                aria-hidden="true"
              >
                <span className="block w-1.5 h-10 md:h-12 lg:h-14 bg-brand-accent skew-x-[-12deg]" />
                <span className="block w-1.5 h-10 md:h-12 lg:h-14 bg-brand-accent skew-x-[-12deg] opacity-60" />
                <span className="block w-1.5 h-10 md:h-12 lg:h-14 bg-brand-accent skew-x-[-12deg] opacity-30" />
              </span>
            )}
  
            <div className="flex flex-col gap-1">
              {props.decorativePrefix && (
                <span className="text-brand-accent text-xs md:text-sm font-semibold uppercase tracking-widest">
                  {props.decorativePrefix}
                </span>
              )}
              <h1 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                {props.pageTitle ?? "Page Title"}
              </h1>
            </div>
          </div>
        </div>
      </section>
    );
}
