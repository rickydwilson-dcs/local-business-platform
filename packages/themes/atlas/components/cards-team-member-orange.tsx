"use client";

/**
 * TeamMemberRonBrennan
 *
 * Profile card for co-founder Ron Brennan with bio and external links
 * Layout: Full-width colour block, text left-aligned with name, title, bio, and CTA links
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
  /** company-link */
  companyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberRonBrennan(props: TeamMemberRonBrennanProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              {/* Name & Title */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary tracking-tight">
                  {props.memberName ?? "Ron Brennan"}
                </h2>
                <p className="mt-2 text-lg md:text-xl font-medium text-brand-accent uppercase tracking-widest">
                  {props.memberTitle ?? "Co-Founder"}
                </p>
              </div>
  
              {/* Divider */}
              <div className="w-16 h-1 bg-brand-accent rounded-full" />
  
              {/* Bio */}
              <p className="text-base md:text-lg leading-relaxed text-on-brand-primary max-w-2xl">
                {props.memberBio ??
                  "Ron Brennan is a seasoned entrepreneur and technologist with decades of experience building companies from the ground up. As co-founder, he brings strategic vision and deep industry expertise to drive innovation and growth across every facet of the organisation."}
              </p>
  
              {/* CTA Links */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {props.companyLink && (
                  <a
                    href={props.companyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-on-brand-primary font-semibold rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                    aria-label="Visit company website"
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
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Company Website
                  </a>
                )}
  
                {props.linkedinLink && (
                  <a
                    href={props.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-accent text-on-brand-primary font-semibold rounded-md hover:bg-brand-accent hover:text-on-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                    aria-label="View Ron Brennan on LinkedIn"
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
