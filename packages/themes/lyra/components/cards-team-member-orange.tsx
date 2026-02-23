"use client";

/**
 * TeamMemberRonBrennan
 *
 * Profile card for co-founder Ron Brennan with bio and external links
 * Layout: Full-width colored block with name, title, bio text, and external links aligned left
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamMemberRonBrennanProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** cani-link */
  caniLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberRonBrennan(props: TeamMemberRonBrennanProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-on-brand-primary tracking-tight">
                  {props['member-name'] ?? 'Ron Brennan'}
                </h2>
                <p className="mt-2 text-xl md:text-2xl font-medium text-brand-accent">
                  {props['member-title'] ?? 'Co-Founder'}
                </p>
              </div>
  
              <p className="text-base md:text-lg text-on-brand-primary leading-relaxed max-w-2xl">
                {props['member-bio'] ??
                  'Ron Brennan is a seasoned entrepreneur and technology leader with decades of experience building and scaling innovative companies. As co-founder, he brings deep expertise in strategy, operations, and community development to drive meaningful impact.'}
              </p>
  
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {props['cani-link'] && (
                  <a
                    href={props['cani-link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-on-brand-primary font-semibold rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary w-fit"
                    aria-label="Visit Ron Brennan's CANI profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    CANI Profile
                  </a>
                )}
  
                {props['linkedin-link'] && (
                  <a
                    href={props['linkedin-link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-on-brand-primary text-on-brand-primary font-semibold rounded-md hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-on-brand-primary focus:ring-offset-2 focus:ring-offset-brand-primary w-fit"
                    aria-label="Visit Ron Brennan's LinkedIn profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
