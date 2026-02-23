"use client";

/**
 * TeamMemberRonBrennan
 *
 * Founder bio card for Ron Brennan with title, description and external links
 * Layout: Full-width coloured block, text left-aligned with name, title, bio and CTA links
 * Category: Custom
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
  /** company-link */
  companyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberRonBrennan(props: TeamMemberRonBrennanProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:py-24">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {props['member-name'] ?? 'Ron Brennan'}
                </h2>
                <p className="text-brand-accent text-lg md:text-xl font-semibold mt-2">
                  {props['member-title'] ?? 'Co-Founder & CEO'}
                </p>
              </div>
  
              <div className="w-16 h-1 bg-brand-accent rounded-full" />
  
              <p className="text-on-brand-primary text-base md:text-lg leading-relaxed max-w-2xl">
                {props['member-bio'] ??
                  'Ron Brennan is a seasoned entrepreneur and technology leader with decades of experience building and scaling innovative companies. His passion for solving complex problems drives the mission and vision behind every venture he leads.'}
              </p>
  
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {props['company-link'] && (
                  <a
                    href={props['company-link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-accent text-surface-background font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                    aria-label={`Visit ${props['member-name'] ?? 'Ron Brennan'}'s company website`}
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                    Company Website
                  </a>
                )}
  
                {props['linkedin-link'] && (
                  <a
                    href={props['linkedin-link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-brand-primary text-on-brand-primary font-semibold px-6 py-3 rounded-lg hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-on-brand-primary focus:ring-offset-2 focus:ring-offset-brand-primary"
                    aria-label={`Connect with ${props['member-name'] ?? 'Ron Brennan'} on LinkedIn`}
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
