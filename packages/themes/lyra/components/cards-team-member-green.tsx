"use client";

/**
 * TeamMemberBenDunkle
 *
 * Profile card for co-founder Ben Dunkle with bio and LinkedIn link
 * Layout: Full-width colored block with name, title, bio text, and external link aligned right
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
      <section className="w-full bg-brand-secondary py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col gap-6">
              {/* Name and Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-on-brand-secondary tracking-tight">
                  {props["member-name"] ?? "Ben Dunkle"}
                </h2>
                <p className="mt-1 text-lg md:text-xl font-medium text-brand-accent">
                  {props["member-title"] ?? "Co-Founder"}
                </p>
              </div>
  
              {/* Divider */}
              <hr className="border-brand-primary opacity-40 w-16" />
  
              {/* Bio */}
              <p className="text-base md:text-lg leading-relaxed text-on-brand-secondary max-w-2xl">
                {props["member-bio"] ??
                  "Ben Dunkle is a co-founder with a passion for building products that make a real difference. With a background spanning design, engineering, and strategy, Ben brings a holistic perspective to every challenge the team faces. He believes great companies are built on trust, curiosity, and relentless iteration."}
              </p>
  
              {/* LinkedIn Link — aligned right */}
              <div className="flex justify-end mt-4">
                <a
                  href={props["linkedin-link"] ?? "https://www.linkedin.com/in/bendunkle"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${props["member-name"] ?? "Ben Dunkle"}'s LinkedIn profile`}
                  className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm md:text-base border border-brand-primary rounded-full px-5 py-2 hover:bg-brand-primary hover:text-on-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.5c0-1.381-1.119-2.5-2.5-2.5s-2.5 1.119-2.5 2.5v5.5h-3v-10h3v1.464c.809-1.125 2.101-1.964 3.5-1.964 2.485 0 4.5 2.015 4.5 4.5v6z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
