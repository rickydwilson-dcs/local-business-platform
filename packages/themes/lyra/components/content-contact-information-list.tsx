/**
 * ContactInformation
 *
 * Displays physical address, opening hours, phone number, support centre link and Zendesk website update link
 * Layout: Left-aligned stacked list with icon-prefixed items and chevron-linked cards
 * Category: Content
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface ContactInformationProps {
  /** address-label */
  addressLabel?: string;
  /** address-text */
  addressText?: string;
  /** opening-hours */
  openingHours?: string;
  /** call-us-card */
  callUsCard?: { title?: string; description?: string; image?: string; href?: string };
  /** support-centre-card */
  supportCentreCard?: { title?: string; description?: string; image?: string; href?: string };
  /** zendesk-card */
  zendeskCard?: { title?: string; description?: string; image?: string; href?: string };
}
export function ContactInformation(props: ContactInformationProps) {
  return (
    <section className="bg-surface-background py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-2xl mx-auto lg:mx-0">
        {/* Address Block */}
        {(props.addressLabel || props.addressText) && (
          <div className="mb-8">
            {props.addressLabel && (
              <div className="flex items-start gap-3 mb-2">
                <svg
                  className="w-5 h-5 mt-0.5 text-brand-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-surface-muted-foreground text-sm font-semibold uppercase tracking-wide">
                  {props.addressLabel}
                </p>
              </div>
            )}
            {props.addressText && (
              <p className="text-surface-foreground text-base leading-relaxed pl-8">
                {props.addressText}
              </p>
            )}
          </div>
        )}

        {/* Opening Hours */}
        {props.openingHours && (
          <RevealOnScroll variant="fade-up">
            <div className="mb-8">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 mt-0.5 text-brand-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-surface-foreground text-base leading-relaxed">
                  {props.openingHours}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* Call Us Card */}
        {props.callUsCard && (
          <div className="mb-4">
            <a
              href={props.callUsCard?.href}
              className="flex items-center justify-between bg-surface-foreground border border-surface-muted rounded-xl px-5 py-4 group hover:border-brand-primary transition-colors duration-200"
              aria-label={props.callUsCard?.title}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-on-brand-primary flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="text-surface-foreground font-medium text-base group-hover:text-brand-primary transition-colors duration-200">
                  {props.callUsCard?.title}
                </span>
              </div>
              <svg
                className="w-5 h-5 text-surface-muted-foreground group-hover:text-brand-primary transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Support Centre Card */}
        {props.supportCentreCard && (
          <RevealOnScroll variant="fade-up">
            <div className="mb-4">
              <a
                href={props.supportCentreCard?.href}
                className="flex items-center justify-between bg-surface-foreground border border-surface-muted rounded-xl px-5 py-4 group hover:border-brand-primary transition-colors duration-200"
                aria-label={props.supportCentreCard?.title}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-secondary text-on-brand-secondary flex-shrink-0">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-surface-foreground font-medium text-base group-hover:text-brand-primary transition-colors duration-200">
                    {props.supportCentreCard?.title}
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-surface-muted-foreground group-hover:text-brand-primary transition-colors duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
