"use client";

/**
 * TeamBioTimBouchard
 *
 * Team member bio card for Tim Bouchard with name, title, description and external links
 * Layout: Full-width colored block, content right-aligned with name, subtitle, bio text and CTA links
 * Category: Content
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamBioTimBouchardProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** bio-text */
  bioText?: string;
  /** agency-link */
  agencyLink?: string;
  /** linkedin-link */
  linkedinLink?: string;
}

export function TeamBioTimBouchard(props: TeamBioTimBouchardProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-end text-right">
          <RevealOnScroll variant="fade-up">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-brand-primary mb-2 tracking-tight">
                {props.memberName ?? "Tim Bouchard"}
              </h2>
              <p className="text-brand-accent text-lg md:text-xl font-semibold uppercase tracking-widest mb-6">
                {props.memberTitle ?? "Founder & Creative Director"}
              </p>
              <div className="w-16 h-1 bg-brand-accent ml-auto mb-6" />
              <p className="text-on-brand-primary text-base md:text-lg leading-relaxed mb-8 opacity-90">
                {props.bioText ??
                  "Tim Bouchard is a seasoned creative strategist with over a decade of experience building brands that resonate. His work bridges the gap between bold design thinking and measurable business outcomes, helping organizations tell their stories with clarity and conviction."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                {props.agencyLink && (
                  <a
                    href={props.agencyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-on-brand-primary transition-colors duration-200 font-semibold px-6 py-3 text-sm uppercase tracking-wider"
                    aria-label={`Visit ${props.memberName ?? "Tim Bouchard"}'s agency`}
                  >
                    <span>Visit Agency</span>
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
                )}
                {props.linkedinLink && (
                  <a
                    href={props.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-brand-accent text-on-brand-primary hover:opacity-90 transition-opacity duration-200 font-semibold px-6 py-3 text-sm uppercase tracking-wider"
                    aria-label={`Connect with ${props.memberName ?? "Tim Bouchard"} on LinkedIn`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
