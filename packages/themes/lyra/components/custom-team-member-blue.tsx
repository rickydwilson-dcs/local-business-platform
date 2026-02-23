"use client";

/**
 * TeamMemberTimBouchard
 *
 * Founder bio card for Tim Bouchard with title, description and external links
 * Layout: Full-width coloured block, text right-aligned with name, title, bio and CTA links
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamMemberTimBouchardProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** agency-link */
  agencyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberTimBouchard(props: TeamMemberTimBouchardProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col items-end text-right">
              <h2 className="text-on-brand-primary text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
                {props['member-name'] ?? 'Tim Bouchard'}
              </h2>
              <p className="text-brand-accent text-lg md:text-xl font-semibold uppercase tracking-widest mb-6">
                {props['member-title'] ?? 'Founder & Creative Director'}
              </p>
              <div className="w-16 h-1 bg-brand-accent mb-8 self-end" aria-hidden="true" />
              <p className="text-on-brand-primary text-base md:text-lg leading-relaxed max-w-2xl mb-10">
                {props['member-bio'] ??
                  'Tim Bouchard is a seasoned creative strategist and entrepreneur with over a decade of experience building brands that resonate. His work sits at the intersection of design, storytelling, and technology — helping businesses find their voice and amplify it with purpose.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-end">
                <a
                  href={props['agency-link'] ?? 'https://agency.example.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-accent text-surface-background font-semibold px-6 py-3 rounded-sm hover:opacity-90 transition-opacity duration-200 text-sm uppercase tracking-wider"
                  aria-label="Visit Tim Bouchard's agency website"
                >
                  Visit Agency
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 3h7m0 0v7m0-7L10 14M5 5H3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2"
                    />
                  </svg>
                </a>
                <a
                  href={props['linkedin-link'] ?? 'https://linkedin.com/in/timbouchard'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brand-primary text-on-brand-primary font-semibold px-6 py-3 rounded-sm hover:bg-brand-secondary transition-colors duration-200 text-sm uppercase tracking-wider"
                  aria-label="Connect with Tim Bouchard on LinkedIn"
                >
                  LinkedIn
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.609v5.587z" />
                  </svg>
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
