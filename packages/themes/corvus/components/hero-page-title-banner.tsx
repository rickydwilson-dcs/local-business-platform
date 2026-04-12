/**
 * PageTitleBanner
 *
 * Full-width page title banner identifying the current section with decorative slash marks and large heading text
 * Layout: Full-width solid colour band with left-aligned heading and decorative icon or slash prefix
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
    <section className="w-full bg-brand-primary py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Decorative slash marks */}
          <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
            <span className="text-brand-accent font-black text-4xl md:text-5xl lg:text-6xl leading-none select-none">
              /
            </span>
            <span className="text-brand-accent font-black text-4xl md:text-5xl lg:text-6xl leading-none select-none opacity-60">
              /
            </span>
          </div>

          {/* Optional decorative icon */}
          {props.decorativeIcon && (
            <div className="shrink-0 text-on-brand-primary text-3xl md:text-4xl" aria-hidden="true">
              {props.decorativeIcon}
            </div>
          )}

          {/* Page title */}
          <h1 className="text-on-brand-primary font-black text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight uppercase">
            {props.pageTitle ?? "Page Title"}
          </h1>
        </div>

        {/* Bottom accent line */}
        <div className="mt-6 md:mt-8 flex items-center gap-2" aria-hidden="true">
          <div className="h-1 w-16 md:w-24 bg-brand-accent rounded-full" />
          <div className="h-1 w-8 md:w-12 bg-brand-accent rounded-full opacity-50" />
          <div className="h-1 w-4 md:w-6 bg-brand-accent rounded-full opacity-25" />
        </div>
      </div>
    </section>
  );
}
