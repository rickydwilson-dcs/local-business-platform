/**
 * PageTitleBanner
 *
 * Page title banner identifying this as the About page
 * Layout: Full-width colored band with decorative slash marks and large heading
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
      <section className="relative w-full bg-brand-primary overflow-hidden">
        {/* Decorative slash marks */}
        <div className="absolute inset-0 flex items-center pointer-events-none" aria-hidden="true">
          <span className="text-brand-accent text-[12rem] font-black leading-none opacity-20 select-none ml-8 md:ml-16 lg:ml-24">/</span>
          <span className="text-brand-accent text-[12rem] font-black leading-none opacity-15 select-none -ml-8">/</span>
          <span className="text-brand-accent text-[12rem] font-black leading-none opacity-10 select-none -ml-8">/</span>
        </div>
  
        {/* Right-side decorative slashes */}
        <div className="absolute right-0 inset-y-0 flex items-center pointer-events-none" aria-hidden="true">
          <span className="text-brand-secondary text-[12rem] font-black leading-none opacity-10 select-none mr-4 md:mr-12">/</span>
          <span className="text-brand-secondary text-[12rem] font-black leading-none opacity-10 select-none -ml-8">/</span>
        </div>
  
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20 lg:py-24 flex flex-col items-start gap-4">
          {/* Decorative icon */}
          {props['decorative-icon'] && (
            <div className="text-brand-accent text-4xl md:text-5xl mb-2" aria-hidden="true">
              {props['decorative-icon']}
            </div>
          )}
  
          {/* Page label */}
          <p className="text-on-brand-primary text-sm md:text-base font-semibold uppercase tracking-widest opacity-80">
            Who We Are
          </p>
  
          {/* Main heading */}
          <h1 className="text-on-brand-primary text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight max-w-3xl">
            {props['page-title'] ?? 'About Us'}
          </h1>
  
          {/* Accent underline */}
          <div className="mt-4 h-1.5 w-24 md:w-32 bg-brand-accent rounded-full" aria-hidden="true" />
        </div>
      </section>
    );
}
