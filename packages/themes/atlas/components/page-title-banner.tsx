/**
 * PageTitleBanner
 *
 * Full-width solid colour page title banner with decorative icon identifying the current section, used on interior pages
 * Layout: Full-width solid colour band with left-aligned heading and decorative icon or slash marks
 * Category: Hero
 */

export interface PageTitleBannerProps {
  /** decorative-icon */
  decorativeIcon?: string;
  /** page-title */
  pageTitle?: string;
}

export function PageTitleBanner(props: PageTitleBannerProps) {
  return (
      <section className="w-full bg-brand-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="flex items-center gap-4 md:gap-6">
            {props['decorative-icon'] && (
              <span
                className="text-brand-accent text-4xl md:text-5xl lg:text-6xl flex-shrink-0"
                aria-hidden="true"
              >
                {props['decorative-icon']}
              </span>
            )}
  
            {!props['decorative-icon'] && (
              <div
                className="flex items-center gap-1 flex-shrink-0"
                aria-hidden="true"
              >
                <span className="block w-1.5 h-10 md:h-12 lg:h-14 bg-brand-accent rotate-12 rounded-sm" />
                <span className="block w-1.5 h-10 md:h-12 lg:h-14 bg-brand-accent rotate-12 rounded-sm opacity-60" />
              </div>
            )}
  
            <h1 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {props['page-title'] ?? 'Page Title'}
            </h1>
          </div>
        </div>
  
        <div className="w-full h-1 bg-brand-accent" aria-hidden="true" />
      </section>
    );
}
