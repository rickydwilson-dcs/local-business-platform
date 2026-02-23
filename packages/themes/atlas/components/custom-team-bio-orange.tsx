"use client";

/**
 * TeamBioRonBrennan
 *
 * Team member bio card for Ron Brennan with role, description and external links
 * Layout: Full-width colored block with text left-aligned, name large, subtitle and body below
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamBioRonBrennanProps {
  /** member-name */
  memberName?: string;
  /** member-role */
  memberRole?: string;
  /** bio-text */
  bioText?: string;
  /** company-link */
  companyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamBioRonBrennan(props: TeamBioRonBrennanProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-brand-primary leading-tight">
                  {props['member-name'] ?? 'Ron Brennan'}
                </h1>
                <p className="mt-2 text-lg md:text-xl text-on-brand-secondary font-medium tracking-wide">
                  {props['member-role'] ?? 'Co-Founder & Managing Partner'}
                </p>
              </div>
  
              <div className="w-16 h-1 bg-brand-accent rounded-full" />
  
              <p className="text-base md:text-lg text-on-brand-primary leading-relaxed max-w-2xl">
                {props['bio-text'] ??
                  'Ron Brennan brings decades of experience in venture capital, strategic advisory, and operational leadership. He has guided numerous companies from early-stage startups to successful exits, with a focus on building resilient teams and scalable business models across technology and financial services sectors.'}
              </p>
  
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {props['company-link'] && (
                  <a
                    href={props['company-link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-on-brand-primary font-semibold rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                    aria-label="Visit Ron Brennan's company website"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                      />
                    </svg>
                    Company Website
                  </a>
                )}
  
                {props['linkedin-link'] && (
                  <a
                    href={props['linkedin-link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-surface-muted text-on-brand-primary font-semibold rounded-md hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                    aria-label="View Ron Brennan's LinkedIn profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
