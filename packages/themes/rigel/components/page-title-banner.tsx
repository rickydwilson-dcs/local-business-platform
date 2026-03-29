/**
 * PageTitleBanner
 *
 * Page-level banner identifying the current section with decorative slash marks and a large heading
 * Layout: Full-width solid colour band with left-aligned heading and decorative triple-slash icon
 * Category: Hero
 */

export interface PageTitleBannerProps {
  /** decorative-icon */
  decorativeIcon?: string;
  /** page-title */
  pageTitle?: string;
  /** section-label */
  sectionLabel?: string;
}

export function PageTitleBanner(props: PageTitleBannerProps) {
  return (
      <section className="w-full bg-brand-primary py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-3 md:gap-4">
            {props.sectionLabel && (
              <span className="text-on-brand-primary text-sm md:text-base font-semibold uppercase tracking-widest opacity-80">
                {props.sectionLabel}
              </span>
            )}
  
            <div className="flex items-center gap-4 md:gap-6">
              {props.decorativeIcon ? (
                <span className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-black leading-none select-none" aria-hidden="true">
                  {props.decorativeIcon}
                </span>
              ) : (
                <span className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-black leading-none select-none" aria-hidden="true">
                  ///
                </span>
              )}
  
              <h1 className="text-on-brand-primary text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                {props.pageTitle ?? "Page Title"}
              </h1>
            </div>
  
            <div className="mt-2 flex items-center gap-2" aria-hidden="true">
              <span className="block w-12 md:w-16 h-1 bg-brand-on-primary opacity-40 rounded-full" />
              <span className="block w-6 md:w-8 h-1 bg-brand-on-primary opacity-25 rounded-full" />
              <span className="block w-3 md:w-4 h-1 bg-brand-on-primary opacity-15 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
}
