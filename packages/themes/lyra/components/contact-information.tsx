/**
 * ContactInformation
 *
 * Displays physical address, opening hours, phone number, support centre link and additional contact resource links
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
          <RevealOnScroll variant="fade-up">
            <div className="mb-8">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 text-brand-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div>
                  {props.addressLabel && (
                    <p className="text-sm font-semibold text-surface-muted-foreground uppercase tracking-wide mb-1">
                      {props.addressLabel}
                    </p>
                  )}
                  {props.addressText && (
                    <p className="text-surface-foreground text-base leading-relaxed whitespace-pre-line">
                      {props.addressText}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* Opening Hours */}
        {props.openingHours && (
          <div className="mb-8">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex-shrink-0 text-brand-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 10.414V7a1 1 0 10-2 0v6a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L13 12.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-surface-muted-foreground uppercase tracking-wide mb-1">
                  Opening Hours
                </p>
                <p className="text-surface-foreground text-base leading-relaxed whitespace-pre-line">
                  {props.openingHours}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        {(props.callUsCard || props.supportCentreCard || props.zendeskCard) && (
          <hr className="border-surface-muted my-8" />
        )}

        {/* Contact Cards */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-4">
            {/* Call Us Card */}
            {props.callUsCard && (
              <a
                href={props.callUsCard?.href}
                className="flex items-center justify-between bg-surface-foreground border border-surface-muted rounded-xl px-5 py-4 group hover:border-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={props.callUsCard?.title ?? "Call us"}
              >
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 text-brand-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                    </svg>
                  </span>
                  <span className="text-surface-foreground font-medium text-base group-hover:text-brand-primary transition-colors duration-200">
                    {props.callUsCard?.title ?? "Call us"}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-surface-muted-foreground group-hover:text-brand-primary transition-colors duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            )}

            {/* Support Centre Card */}
            {props.supportCentreCard && (
              <a
                href={props.supportCentreCard?.href}
                className="flex items-center justify-between bg-surface-foreground border border-surface-muted rounded-xl px-5 py-4 group hover:border-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={props.supportCentreCard?.title ?? "Support centre"}
              >
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 text-brand-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 14a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 01-1-1V8a1 1 0 112 0v4a1 1 0 01-1 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-surface-foreground font-medium text-base group-hover:text-brand-primary transition-colors duration-200">
                    {props.supportCentreCard?.title ?? "Support centre"}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-surface-muted-foreground group-hover:text-brand-primary transition-colors duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
