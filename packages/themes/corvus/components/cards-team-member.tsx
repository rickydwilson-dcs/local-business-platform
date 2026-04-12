"use client";

/**
 * TeamMemberCard
 *
 * Full-width profile card for a team member or co-founder with name, title, bio, and external links
 * Layout: Full-width coloured block with text aligned left or right containing name, title, bio paragraph, and CTA links
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
  /** external-link */
  externalLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberCard(props: TeamMemberCardProps) {
  return (
    <section className="w-full bg-surface-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-16">
            {/* Avatar placeholder */}
            <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-full bg-brand-primary flex items-center justify-center overflow-hidden">
              <span className="text-on-brand-primary text-5xl font-bold select-none">
                {props.memberName ? props.memberName.charAt(0).toUpperCase() : "T"}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 text-left">
              {/* Name */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground leading-tight">
                {props.memberName || "Team Member Name"}
              </h2>

              {/* Title */}
              <p className="mt-2 text-lg md:text-xl font-semibold text-brand-primary uppercase tracking-wide">
                {props.memberTitle || "Co-Founder & CEO"}
              </p>

              {/* Divider */}
              <div className="mt-4 mb-6 w-16 h-1 bg-brand-accent rounded-full" />

              {/* Bio */}
              <p className="text-base md:text-lg text-surface-muted-foreground leading-relaxed max-w-2xl">
                {props.memberBio ||
                  "A passionate leader with a vision for building products that make a difference. Bringing years of experience in technology, strategy, and team building to drive the company forward."}
              </p>

              {/* Links */}
              <div className="mt-8 flex flex-wrap gap-4 items-center">
                {props.linkedinLink && (
                  <a
                    href={props.linkedinLink?.[0]?.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-on-brand-primary font-semibold text-sm hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    aria-label={`View ${props.memberName || "team member"} on LinkedIn`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.609v5.587z" />
                    </svg>
                    {props.linkedinLink?.[0]?.label ?? "LinkedIn"}
                  </a>
                )}

                {props.externalLink && (
                  <a
                    href={props.externalLink?.[0]?.href ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-primary text-brand-primary font-semibold text-sm hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    aria-label={`Visit ${props.memberName || "team member"}'s website`}
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {props.externalLink?.[0]?.label ?? "Visit Website"}
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
