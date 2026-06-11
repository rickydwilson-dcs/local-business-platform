/**
 * FAQAccordion
 *
 * Answers common customer questions using an accordion layout with links to full FAQ and support centre
 * Layout: Two-column: left accordion list of questions, right support links panel
 * Category: Content
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface FAQLink {
  href?: string;
  label?: string;
}
export interface FAQItem {
  question?: string;
  answer?: string;
  link?: FAQLink;
}
export interface CantFindAnswerPanel {
  heading?: string;
  description?: string;
  cta?: FAQLink;
}
export interface SupportCentrePanel {
  heading?: string;
  description?: string;
  links?: FAQLink[];
}
export interface FAQAccordionProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subheading */
  sectionSubheading?: string;
  /** faq-item-1 */
  faqItem1?: FAQItem;
  /** faq-item-2 */
  faqItem2?: FAQItem;
  /** faq-item-3 */
  faqItem3?: FAQItem;
  /** faq-item-4 */
  faqItem4?: FAQItem;
  /** cant-find-answer-panel */
  cantFindAnswerPanel?: CantFindAnswerPanel;
  /** support-centre-panel */
  supportCentrePanel?: SupportCentrePanel;
}
export function FAQAccordion(props: FAQAccordionProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-12">
            {props.sectionHeading && (
              <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                {props.sectionHeading}
              </h2>
            )}
            {props.sectionSubheading && (
              <p className="text-lg text-surface-muted-foreground max-w-2xl mx-auto">
                {props.sectionSubheading}
              </p>
            )}
          </div>
        </RevealOnScroll>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start">
          {/* Left: Accordion */}
          <div className="lg:col-span-2 space-y-3">
            {[props.faqItem1, props.faqItem2, props.faqItem3, props.faqItem4].map((item, index) => {
              if (!item) return null;
              return (
                <details
                  key={index}
                  className="group border border-surface-muted rounded-lg bg-surface-foreground overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-surface-foreground font-semibold text-base md:text-lg list-none select-none hover:bg-surface-muted transition-colors duration-200">
                    <span>{item.question}</span>
                    <span className="ml-4 flex-shrink-0 text-brand-primary transition-transform duration-300 group-open:rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-surface-muted-foreground text-sm md:text-base leading-relaxed border-t border-surface-muted">
                    <p>{item.answer}</p>
                    {item.link?.href && item.link?.label && (
                      <a
                        href={item.link.href}
                        className="inline-flex items-center gap-1 mt-4 text-brand-primary font-medium text-sm hover:underline"
                      >
                        {item.link.label}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </a>
                    )}
                  </div>
                </details>
              );
            })}
          </div>

          {/* Right: Support Links Panel */}
          <RevealOnScroll variant="fade-up">
            <div className="space-y-6">
              {/* Can't Find Answer Panel */}
              {props.cantFindAnswerPanel && (
                <div className="bg-surface-muted rounded-xl p-6 border border-surface-muted">
                  {props.cantFindAnswerPanel.heading && (
                    <h3 className="text-lg font-bold text-surface-foreground mb-2">
                      {props.cantFindAnswerPanel.heading}
                    </h3>
                  )}
                  {props.cantFindAnswerPanel.description && (
                    <p className="text-sm text-surface-muted-foreground mb-4">
                      {props.cantFindAnswerPanel.description}
                    </p>
                  )}
                  {props.cantFindAnswerPanel.cta?.href && (
                    <a
                      href={props.cantFindAnswerPanel.cta.href}
                      className="inline-flex items-center gap-2 bg-brand-primary text-on-brand-primary font-semibold text-sm px-5 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                      {props.cantFindAnswerPanel.cta.label ?? "Contact Us"}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {/* Support Centre Panel */}
              {props.supportCentrePanel && (
                <div className="bg-brand-secondary rounded-xl p-6 border border-surface-muted">
                  {props.supportCentrePanel.heading && (
                    <h3 className="text-lg font-bold text-on-brand-secondary mb-2">
                      {props.supportCentrePanel.heading}
                    </h3>
                  )}
                  {props.supportCentrePanel.description && (
                    <p className="text-sm text-on-brand-secondary opacity-80 mb-4">
                      {props.supportCentrePanel.description}
                    </p>
                  )}
                  {props.supportCentrePanel.links && props.supportCentrePanel.links.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {props.supportCentrePanel.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link?.href}
                            className="inline-flex items-center gap-1 text-on-brand-secondary text-sm font-medium hover:underline"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                            {link?.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
