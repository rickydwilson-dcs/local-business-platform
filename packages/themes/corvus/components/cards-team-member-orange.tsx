"use client";

/**
 * TeamMemberRonBrennan
 *
 * Profile card for co-founder Ron Brennan with bio and external links
 * Layout: Full-width coloured block, text left-aligned with name, title, bio paragraph and multiple CTA links
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface TeamMemberRonBrennanProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** external-link */
  externalLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberRonBrennan(props: TeamMemberRonBrennanProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                {props.memberName ?? "Ron Brennan"}
              </h2>
              <p className="text-brand-accent text-lg md:text-xl font-semibold mt-2">
                {props.memberTitle ?? "Co-Founder"}
              </p>
            </div>

            <div className="w-16 h-1 bg-brand-accent rounded-full" />

            <p className="text-on-brand-primary text-base md:text-lg leading-relaxed max-w-2xl">
              {props.memberBio ??
                "Ron Brennan is a visionary co-founder with decades of experience building transformative technology companies. His passion for innovation and deep industry expertise have been instrumental in shaping the company's strategic direction and culture."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              {props.externalLink && (
                <a
                  href={props.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-accent text-on-brand-secondary font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200 w-fit"
                  aria-label={`Visit ${props.memberName ?? "Ron Brennan"}'s website`}
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Visit Website
                </a>
              )}

              {props.linkedinLink && (
                <a
                  href={props.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-surface-inverse text-surface-background font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200 w-fit"
                  aria-label={`Connect with ${props.memberName ?? "Ron Brennan"} on LinkedIn`}
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
