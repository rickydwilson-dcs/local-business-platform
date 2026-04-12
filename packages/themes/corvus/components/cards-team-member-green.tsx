"use client";

/**
 * TeamMemberBenDunkle
 *
 * Profile card for co-founder Ben Dunkle with bio and LinkedIn link
 * Layout: Full-width coloured block, text right-aligned with name, title, bio paragraph and CTA link
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

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
    <section className="w-full bg-brand-secondary py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl ml-auto text-right">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-end gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-secondary tracking-tight">
                {props.memberName ?? "Ben Dunkle"}
              </h2>
              <p className="mt-2 text-lg md:text-xl font-medium text-brand-accent uppercase tracking-widest">
                {props.memberTitle ?? "Co-Founder"}
              </p>
            </div>

            <div className="w-16 h-1 bg-brand-accent rounded-full" />

            <p className="max-w-2xl text-base md:text-lg text-surface-background leading-relaxed">
              {props.memberBio ??
                "Ben Dunkle is a co-founder with a passion for building products that matter. With a background spanning technology, strategy, and design, he brings a unique perspective to every challenge the team faces. Ben believes that great companies are built on trust, curiosity, and relentless execution."}
            </p>

            <a
              href={props.linkedinLink ?? "https://www.linkedin.com/in/bendunkle"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-brand-accent text-on-brand-secondary font-semibold rounded-full hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
              aria-label={`Connect with ${props.memberName ?? "Ben Dunkle"} on LinkedIn`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.985V9h3.102v1.561h.046c.432-.818 1.487-1.681 3.061-1.681 3.274 0 3.878 2.155 3.878 4.958v6.614zM5.337 7.433a1.8 1.8 0 1 1 0-3.601 1.8 1.8 0 0 1 0 3.601zM6.956 20.452H3.717V9h3.239v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
