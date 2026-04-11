"use client";

/**
 * TeamBioBlock
 *
 * Team member bio card with name, title, description, and external links (LinkedIn, company)
 * Layout: Full-width coloured block with content aligned left or right depending on member, containing name, subtitle, bio text, and CTA links
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamBioBlockProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** bio-text */
  bioText?: string;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
  /** company-link */
  companyLink?: Array<{ label?: string; href?: string }>;
}

export function TeamBioBlock(props: TeamBioBlockProps) {
  return (
    <section className="w-full bg-surface-background py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 bg-surface-foreground rounded-2xl overflow-hidden shadow-sm">
            {/* Accent bar */}
            <div className="hidden md:block w-2 self-stretch bg-brand-primary flex-shrink-0" />

            {/* Avatar placeholder */}
            <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start pt-8 md:pt-0 px-8 md:px-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-brand-secondary flex items-center justify-center overflow-hidden">
                <span className="text-on-brand-secondary text-4xl font-bold select-none">
                  {props.memberName ? props.memberName.charAt(0).toUpperCase() : "T"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 py-8 px-8 md:px-0 md:pr-12">
              {/* Name & Title */}
              <div className="mb-4">
                <h2 className="text-2xl md:text-3xl font-bold text-surface-foreground leading-tight">
                  {props.memberName || "Team Member Name"}
                </h2>
                <p className="mt-1 text-brand-primary font-semibold text-base md:text-lg tracking-wide">
                  {props.memberTitle || "Job Title"}
                </p>
              </div>

              {/* Divider */}
              <div className="w-12 h-1 bg-brand-accent rounded-full mb-5" />

              {/* Bio text */}
              <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                {props.bioText ||
                  "This team member brings a wealth of experience and passion to their role. Their dedication and expertise make them an invaluable part of the team."}
              </p>

              {/* CTA Links */}
              <div className="flex flex-wrap gap-4">
                {props.linkedinLink && props.linkedinLink.length > 0 && (
                  <a
                    href={props.linkedinLink[0]?.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-on-brand-primary font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    aria-label={`View ${props.memberName || "team member"} on LinkedIn`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.002 3.604 4.604v5.592z" />
                    </svg>
                    LinkedIn
                  </a>
                )}

                {props.companyLink && props.companyLink.length > 0 && (
                  <a
                    href={props.companyLink[0]?.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-primary text-brand-primary font-semibold text-sm hover:bg-surface-muted transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    aria-label={`Visit ${props.memberName || "team member"}'s company page`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Company Page
                  </a>
                )}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
