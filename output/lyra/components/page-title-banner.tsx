/**
 * PageTitleBanner
 *
 * Page title banner identifying interior pages with decorative icon and large heading
 * Layout: Full-width solid colour band with decorative slash marks or icon and heading text left-aligned
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
    <div className="w-full bg-brand-primary py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Decorative slash marks */}
          <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
            <span className="block w-2 h-10 md:h-14 lg:h-16 bg-brand-accent skew-x-[-12deg]" />
            <span className="block w-2 h-10 md:h-14 lg:h-16 bg-brand-secondary skew-x-[-12deg]" />
          </div>

          {/* Optional decorative icon */}
          {props['decorative-icon'] && (
            <div
              className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl shrink-0"
              aria-hidden="true"
            >
              {props['decorative-icon']}
            </div>
          )}

          {/* Page title */}
          <h1 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {props['page-title'] ?? 'Page Title'}
          </h1>
        </div>
      </div>
    </div>
  );
}
