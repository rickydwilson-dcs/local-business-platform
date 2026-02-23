/**
 * PageBanner
 *
 * Page title banner identifying this as the Blog section
 * Layout: Full-width solid colour band with left-aligned heading and decorative slash marks
 * Category: Hero
 */

export interface PageBannerProps {
  /** page-title */
  pageTitle?: string;
  /** decorative-icon */
  decorativeIcon?: string;
}

export function PageBanner(props: PageBannerProps) {
  return (
      <section className="w-full bg-brand-secondary py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-on-brand-secondary text-2xl font-bold opacity-40 select-none" aria-hidden="true">/</span>
            <span className="text-on-brand-secondary text-2xl font-bold opacity-60 select-none" aria-hidden="true">/</span>
            <span className="text-on-brand-secondary text-2xl font-bold opacity-80 select-none" aria-hidden="true">/</span>
          </div>
          <h1 className="text-on-brand-secondary text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {props['page-title'] ?? 'Blog'}
          </h1>
          {props['decorative-icon'] && (
            <span className="mt-2 text-on-brand-secondary text-3xl" aria-hidden="true">
              {props['decorative-icon']}
            </span>
          )}
        </div>
      </section>
    );
}
