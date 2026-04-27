"use client";

/**
 * FAQSection
 *
 * Answers common customer questions via an accordion and links to support resources
 * Layout: Two-column layout: accordion FAQ list left, support links and all-FAQs CTA right
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface FAQSectionProps {
  /** section-heading */
  sectionHeading?: string;
  /** section-subheading */
  sectionSubheading?: string;
  /** faq-accordion-items */
  faqAccordionItems?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** cant-find-answer-card */
  cantFindAnswerCard?: {
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    icon?: string;
    heading?: string;
    cta?: { href?: string; label?: string };
  };
  /** support-centre-card */
  supportCentreCard?: {
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    icon?: string;
    heading?: string;
    cta?: { href?: string; label?: string };
    links?: Array<{ href?: string; label?: string }>;
  };
}

export function FAQSection(props: FAQSectionProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: FAQ Accordion */}
          <div className="lg:col-span-2">
            <RevealOnScroll variant="fade-up">
              {props.faqAccordionItems && props.faqAccordionItems.length > 0 ? (
                <div className="divide-y divide-surface-muted border border-surface-muted rounded-xl overflow-hidden">
                  {props.faqAccordionItems.map((item, index) => (
                    <details
                      key={index}
                      className="group bg-surface-foreground open:bg-surface-muted transition-colors duration-200"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-surface-foreground font-semibold text-base md:text-lg list-none select-none">
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
                      <div className="px-6 pb-5 pt-2 text-surface-muted-foreground text-sm md:text-base leading-relaxed">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <div className="border border-surface-muted rounded-xl p-8 text-center text-surface-muted-foreground">
                  No FAQs available at this time.
                </div>
              )}
            </RevealOnScroll>
          </div>

          {/* Right: Support Links */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <RevealOnScroll variant="fade-up">
              {/* Can't Find Answer Card */}
              {props.cantFindAnswerCard && (
                <div className="bg-brand-primary rounded-xl p-6 flex flex-col gap-4">
                  {props.cantFindAnswerCard.icon && (
                    <div className="text-on-brand-primary text-3xl" aria-hidden="true">
                      {props.cantFindAnswerCard.icon}
                    </div>
                  )}
                  {props.cantFindAnswerCard.heading && (
                    <h3 className="text-on-brand-primary font-bold text-xl">
                      {props.cantFindAnswerCard.heading}
                    </h3>
                  )}
                  {props.cantFindAnswerCard.description && (
                    <p className="text-on-brand-primary text-sm leading-relaxed opacity-90">
                      {props.cantFindAnswerCard.description}
                    </p>
                  )}
                  {props.cantFindAnswerCard.cta?.href && (
                    <a
                      href={props.cantFindAnswerCard.cta.href}
                      className="inline-block mt-2 bg-surface-background text-brand-primary font-semibold text-sm px-5 py-3 rounded-lg hover:bg-surface-muted transition-colors duration-200 text-center"
                    >
                      {props.cantFindAnswerCard.cta.label ?? "Contact Us"}
                    </a>
                  )}
                </div>
              )}

              {/* Support Centre Card */}
              {props.supportCentreCard && (
                <div className="bg-surface-foreground border border-surface-muted rounded-xl p-6 flex flex-col gap-4">
                  {props.supportCentreCard.icon && (
                    <div className="text-brand-primary text-3xl" aria-hidden="true">
                      {props.supportCentreCard.icon}
                    </div>
                  )}
                  {props.supportCentreCard.heading && (
                    <h3 className="text-surface-foreground font-bold text-xl">
                      {props.supportCentreCard.heading}
                    </h3>
                  )}
                  {props.supportCentreCard.description && (
                    <p className="text-surface-muted-foreground text-sm leading-relaxed">
                      {props.supportCentreCard.description}
                    </p>
                  )}
                  {props.supportCentreCard.links && props.supportCentreCard.links.length > 0 && (
                    <ul className="flex flex-col gap-2 mt-1">
                      {props.supportCentreCard.links.map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={link?.href}
                            className="flex items-center gap-2 text-brand-primary text-sm font-medium hover:underline"
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
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                            {link?.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {props.supportCentreCard.cta?.href && (
                    <a
                      href={props.supportCentreCard.cta.href}
                      className="inline-block mt-2 border border-brand-primary text-brand-primary font-semibold text-sm px-5 py-3 rounded-lg hover:bg-surface-muted transition-colors duration-200 text-center"
                    >
                      {props.supportCentreCard.cta.label ?? "Visit Support Centre"}
                    </a>
                  )}
                </div>
              )}
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
