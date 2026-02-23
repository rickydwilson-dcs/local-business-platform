/**
 * PageTitleBanner
 *
 * Full-width page title banner identifying the current section with decorative icon or slash marks
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
      <div className="w-full bg-brand-accent py-10 md:py-14 lg:py-16 px-4 md:px-8 lg:px-16 overflow-hidden relative">
        {/* Decorative slash marks background */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none" aria-hidden="true">
          <span className="text-[10rem] md:text-[14rem] lg:text-[18rem] font-black text-on-brand-primary opacity-5 leading-none tracking-tighter pr-4">
            //
          </span>
        </div>
  
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 relative z-10">
          {/* Decorative icon or slash prefix */}
          <div className="flex items-center gap-3 shrink-0" aria-hidden="true">
            {props['decorative-icon'] ? (
              <span className="text-3xl md:text-4xl lg:text-5xl text-on-brand-primary opacity-80">
                {props['decorative-icon']}
              </span>
            ) : (
              <span className="text-2xl md:text-3xl lg:text-4xl font-black text-on-brand-primary opacity-60 tracking-tighter leading-none">
                //
              </span>
            )}
            <div className="w-px h-8 md:h-10 bg-brand-on-primary opacity-30" />
          </div>
  
          {/* Page title */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-on-brand-primary leading-tight tracking-tight animate-fade-in-up">
            {props['page-title'] ?? 'Page Title'}
          </h1>
        </div>
  
        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-on-primary opacity-10" aria-hidden="true" />
      </div>
    );
}
