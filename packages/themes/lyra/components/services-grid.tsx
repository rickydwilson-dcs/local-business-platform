"use client";

/**
 * ServicesGrid
 *
 * Showcases core services with icon, title, description and arrow link in a card grid
 * Layout: Centred heading and subheading above a 3-column grid of service cards
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

interface ServiceCard {
  icon?: string;
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
              <p className="text-brand-accent uppercase tracking-widest text-sm font-semibold mb-3">
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
              <div className="bg-surface-foreground rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group border border-surface-muted">
                {props.serviceCardWebDesign.icon && (
                  <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl bg-brand-primary text-on-brand-primary">
                    <span className="text-2xl">{props.serviceCardWebDesign.icon}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-surface-foreground mb-3">
                  {props.serviceCardWebDesign.title}
                </h3>
                <p className="text-surface-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                  {props.serviceCardWebDesign.description}
                </p>
                {props.serviceCardWebDesign.link?.href && (
                  <a
                    href={props.serviceCardWebDesign.link.href}
                    className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:gap-3 transition-all duration-200"
                  >
                    {props.serviceCardWebDesign.link.label ?? "Learn more"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* SEO Card */}
            {props.serviceCardSeo && (
              <div className="bg-surface-foreground rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group border border-surface-muted">
                {props.serviceCardSeo.icon && (
                  <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl bg-brand-primary text-on-brand-primary">
                    <span className="text-2xl">{props.serviceCardSeo.icon}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-surface-foreground mb-3">
                  {props.serviceCardSeo.title}
                </h3>
                <p className="text-surface-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                  {props.serviceCardSeo.description}
                </p>
                {props.serviceCardSeo.link?.href && (
                  <a
                    href={props.serviceCardSeo.link.href}
                    className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:gap-3 transition-all duration-200"
                  >
                    {props.serviceCardSeo.link.label ?? "Learn more"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Visual Content Card */}
            {props.serviceCardVisualContent && (
              <div className="bg-surface-foreground rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group border border-surface-muted">
                {props.serviceCardVisualContent.icon && (
                  <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl bg-brand-secondary text-on-brand-secondary">
                    <span className="text-2xl">{props.serviceCardVisualContent.icon}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-surface-foreground mb-3">
                  {props.serviceCardVisualContent.title}
                </h3>
                <p className="text-surface-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                  {props.serviceCardVisualContent.description}
                </p>
                {props.serviceCardVisualContent.link?.href && (
                  <a
                    href={props.serviceCardVisualContent.link.href}
                    className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:gap-3 transition-all duration-200"
                  >
                    {props.serviceCardVisualContent.link.label ?? "Learn more"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Social Media Card */}
            {props.serviceCardSocialMedia && (
              <div className="bg-surface-foreground rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col group border border-surface-muted">
                {props.serviceCardSocialMedia.icon && (
                  <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl bg-brand-secondary text-on-brand-secondary">
                    <span className="text-2xl">{props.serviceCardSocialMedia.icon}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-surface-foreground mb-3">
                  {props.serviceCardSocialMedia.title}
                </h3>
                <p className="text-surface-muted-foreground text-sm leading-relaxed flex-grow mb-6">
                  {props.serviceCardSocialMedia.description}
                </p>
                {props.serviceCardSocialMedia.link?.href && (
                  <a
                    href={props.serviceCardSocialMedia.link.href}
                    className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:gap-3 transition-all duration-200"
                  >
                    {props.serviceCardSocialMedia.link.label ?? "Learn more"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
