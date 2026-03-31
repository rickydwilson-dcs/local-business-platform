"use client";

/**
 * TeamMemberCard
 *
 * Full-width profile card for a co-founder or team member with bio and external links
 * Layout: Full-width colour block with name, title, bio, and CTA links; alternates text alignment left/right per member
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamMemberCardProps {
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

export function TeamMemberCard(props: TeamMemberCardProps) {
  return (
      <section className="w-full bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
              {/* Colour block accent bar */}
              <div className="hidden md:block w-2 self-stretch rounded-full bg-brand-primary flex-shrink-0" />
  
              {/* Content block */}
              <div className="flex-1 bg-surface-foreground rounded-2xl px-8 py-10 lg:px-14 lg:py-14 shadow-sm">
                <div className="flex flex-col gap-4">
                  {/* Name & Title */}
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-surface-foreground tracking-tight">
                      {props.memberName ?? "Alex Rivera"}
                    </h2>
                    <p className="mt-1 text-lg font-medium text-brand-primary">
                      {props.memberTitle ?? "Co-Founder & CEO"}
                    </p>
                  </div>
  
                  {/* Divider */}
                  <div className="w-16 h-1 rounded-full bg-brand-accent" />
  
                  {/* Bio */}
                  <p className="text-base lg:text-lg text-surface-muted-foreground leading-relaxed max-w-2xl">
                    {props.memberBio ??
                      "Alex brings over a decade of experience building products at the intersection of design and technology. Passionate about creating tools that empower teams to do their best work, Alex co-founded this company to solve problems they experienced first-hand."}
                  </p>
  
                  {/* CTA Links */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    {props.linkedinLink && (
                      <a
                        href={props.linkedinLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-on-brand-primary font-semibold text-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                        aria-label={`View ${props.memberName ?? "team member"} on LinkedIn`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.002 3.604 4.604v5.592z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
  
                    {props.companyLink && (
                      <a
                        href={props.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-primary text-brand-primary font-semibold text-sm transition-colors hover:bg-brand-primary hover:text-on-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                        aria-label={`Visit ${props.memberName ?? "team member"}'s company page`}
                      >
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
                            d="M13.828 10.172a4 4 0 010 5.656M10.172 13.828a4 4 0 010-5.656M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Company Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
