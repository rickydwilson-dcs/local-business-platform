"use client";

/**
 * TeamMemberBio
 *
 * Full-width founder bio card with name, title, description, and external links on a coloured background
 * Layout: Full-width coloured block with name, title, bio text, and CTA links, alternating left/right text alignment
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamMemberBioProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
  /** company-link */
  companyLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberBio(props: TeamMemberBioProps) {
  return (
      <section className="w-full bg-brand-primary py-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row md:items-start gap-10">
              {/* Left column: Name + Title */}
              <div className="md:w-1/3 flex flex-col gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary leading-tight">
                  {props["member-name"] ?? "Founder Name"}
                </h2>
                <p className="text-lg font-semibold text-on-brand-secondary uppercase tracking-widest">
                  {props["member-title"] ?? "Co-Founder & CEO"}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row md:flex-col gap-3">
                  {props["linkedin-link"] && (
                    <a
                      href={props["linkedin-link"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-accent font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent rounded"
                      aria-label={`View ${props["member-name"] ?? "founder"} on LinkedIn`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.609v5.587z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {props["company-link"] && (
                    <a
                      href={props["company-link"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-accent font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent rounded"
                      aria-label={`Visit ${props["member-name"] ?? "founder"}'s company website`}
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
                          d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"
                        />
                      </svg>
                      Company Site
                    </a>
                  )}
                </div>
              </div>
  
              {/* Divider */}
              <div className="hidden md:block w-px bg-brand-secondary self-stretch opacity-40" aria-hidden="true" />
  
              {/* Right column: Bio */}
              <div className="md:w-2/3">
                <p className="text-on-brand-primary text-lg md:text-xl leading-relaxed">
                  {props["member-bio"] ??
                    "A visionary leader with decades of experience building transformative companies. Passionate about technology, people, and creating lasting impact in the industries they serve. Their journey from early-stage startup to global enterprise has shaped a unique perspective on what it takes to build something truly meaningful."}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
