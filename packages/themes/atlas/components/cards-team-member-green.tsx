"use client";

/**
 * TeamMemberBenDunkle
 *
 * Profile card for co-founder Ben Dunkle with bio and LinkedIn link
 * Layout: Full-width colour block, text right-aligned with name, title, bio, and CTA link
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamMemberBenDunkleProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberBenDunkle(props: TeamMemberBenDunkleProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl ml-auto text-right">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col items-end gap-6">
              {/* Name */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-on-brand-primary tracking-tight">
                  {props.memberName ?? "Ben Dunkle"}
                </h2>
                {/* Title */}
                <p className="mt-2 text-lg md:text-xl font-semibold text-brand-accent uppercase tracking-widest">
                  {props.memberTitle ?? "Co-Founder"}
                </p>
              </div>
  
              {/* Divider */}
              <div className="w-24 h-1 bg-brand-accent rounded-full" />
  
              {/* Bio */}
              <p className="max-w-2xl text-base md:text-lg leading-relaxed text-on-brand-primary opacity-90">
                {props.memberBio ??
                  "Ben Dunkle is a co-founder with a passion for building products that matter. With a background spanning technology, strategy, and design, he brings a unique perspective to every challenge. Ben believes that great companies are built on trust, curiosity, and relentless execution."}
              </p>
  
              {/* LinkedIn CTA */}
              <a
                href={props.linkedinLink ?? "https://www.linkedin.com/in/bendunkle"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-brand-accent text-surface-background font-semibold rounded-full text-sm md:text-base hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
                aria-label={`Connect with ${props.memberName ?? "Ben Dunkle"} on LinkedIn`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
