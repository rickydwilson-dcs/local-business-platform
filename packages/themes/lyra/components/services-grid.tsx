/**
 * ServicesGrid
 *
 * Showcases the agency's core service offerings in a grid of icon cards with descriptions and arrow links
 * Layout: Centered heading and subheading above a 3-column grid of service cards each with icon, title, description and arrow link
 * Category: Cards
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface ServiceCard {
  title?: string;
  description?: string;
  link?: {
    href?: string;
    label?: string;
  };
}
export interface ServicesGridProps {
  /** section-eyebrow */
  sectionEyebrow?: string;
  /** section-heading */
  sectionHeading?: string;
  /** section-subheading */
  sectionSubheading?: string;
  /** service-card-web-design */
  serviceCardWebDesign?: ServiceCard;
  /** service-card-seo */
  serviceCardSeo?: ServiceCard;
  /** service-card-visual-content */
  serviceCardVisualContent?: ServiceCard;
  /** service-card-social-media */
  serviceCardSocialMedia?: ServiceCard;
  /** service-card-branding */
  serviceCardBranding?: ServiceCard;
  /** service-card-print-design */
  serviceCardPrintDesign?: ServiceCard;
}
export function ServicesGrid(props: ServicesGridProps) {
  return (
    <section className="py-16 px-4 bg-surface-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            {props.sectionEyebrow && (
              <p className="text-brand-accent text-sm font-semibold uppercase tracking-widest mb-3">
                {props.sectionEyebrow}
              </p>
            )}
            {props.sectionHeading && (
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                {props.sectionHeading}
              </h2>
            )}
            {props.sectionSubheading && (
              <p className="text-surface-muted-foreground text-lg max-w-2xl mx-auto">
                {props.sectionSubheading}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Services Grid */}
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Web Design Card */}
            {props.serviceCardWebDesign && (
              <div className="bg-surface-foreground rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                <div className="mb-5">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center mb-5">
                    <svg
                      className="w-6 h-6 text-on-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {props.serviceCardWebDesign.title ?? "Web Design"}
                  </h3>
                  <p className="text-surface-muted-foreground text-sm leading-relaxed flex-grow">
                    {props.serviceCardWebDesign.description}
                  </p>
                </div>
                {props.serviceCardWebDesign.link && (
                  <a
                    href={props.serviceCardWebDesign.link.href}
                    className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm mt-auto group-hover:gap-3 transition-all duration-200"
                  >
                    {props.serviceCardWebDesign.link.label ?? "Learn more"}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* SEO Card */}
            {props.serviceCardSeo && (
              <div className="bg-surface-foreground rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                <div className="mb-5">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center mb-5">
                    <svg
                      className="w-6 h-6 text-on-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {props.serviceCardSeo.title ?? "SEO"}
                  </h3>
                  <p className="text-surface-muted-foreground text-sm leading-relaxed flex-grow">
                    {props.serviceCardSeo.description}
                  </p>
                </div>
                {props.serviceCardSeo.link && (
                  <a
                    href={props.serviceCardSeo.link.href}
                    className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm mt-auto group-hover:gap-3 transition-all duration-200"
                  >
                    {props.serviceCardSeo.link.label ?? "Learn more"}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Visual Content Card */}
            {props.serviceCardVisualContent && (
              <div className="bg-surface-foreground rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                <div className="mb-5">
                  <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center mb-5">
                    <svg
                      className="w-6 h-6 text-on-brand-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {props.serviceCardVisualContent.title ?? "Visual Content"}
                  </h3>
                  <p className="text-surface-muted-foreground text-sm leading-relaxed flex-grow">
                    {props.serviceCardVisualContent.description}
                  </p>
                </div>
                {props.serviceCardVisualContent.link && (
                  <a
                    href={props.serviceCardVisualContent.link.href}
                    className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm mt-auto group-hover:gap-3 transition-all duration-200"
                  >
                    {props.serviceCardVisualContent.link.label ?? "Learn more"}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
