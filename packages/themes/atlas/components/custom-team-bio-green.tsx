"use client";

/**
 * TeamBioBenDunkle
 *
 * Team member bio card for Ben Dunkle with role, description and LinkedIn link
 * Layout: Full-width colored block with text right-aligned, name large, subtitle and body below
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamBioBenDunkleProps {
  /** member-name */
  memberName?: string;
  /** member-role */
  memberRole?: string;
  /** bio-text */
  bioText?: string;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamBioBenDunkle(props: TeamBioBenDunkleProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl ml-auto text-right">
          <RevealOnScroll variant="fade-up">
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-brand-primary tracking-tight">
                {props['member-name'] ?? 'Ben Dunkle'}
              </h2>
              <p className="mt-2 text-lg md:text-xl text-brand-accent font-semibold uppercase tracking-widest">
                {props['member-role'] ?? 'Co-Founder & Partner'}
              </p>
            </div>
  
            <div className="mt-6 border-t border-brand-secondary pt-6">
              <p className="text-base md:text-lg text-on-brand-primary leading-relaxed max-w-2xl ml-auto">
                {props['bio-text'] ??
                  'Ben brings deep expertise in strategy, operations, and team building. With a background spanning startups and enterprise organisations, he is passionate about helping founders navigate complexity and build companies that last. His hands-on approach and commitment to long-term partnerships set him apart as a trusted advisor and operator.'}
              </p>
            </div>
  
            <div className="mt-8 flex justify-end">
              <a
                href={props['linkedin-link'] ?? 'https://www.linkedin.com/in/bendunkle'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Connect with ${props['member-name'] ?? 'Ben Dunkle'} on LinkedIn`}
                className="inline-flex items-center gap-2 text-brand-accent font-semibold text-sm md:text-base uppercase tracking-wider hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.985V9h3.102v1.561h.046c.432-.818 1.487-1.681 3.062-1.681 3.274 0 3.878 2.155 3.878 4.958v6.614zM5.337 7.433a1.8 1.8 0 1 1 0-3.601 1.8 1.8 0 0 1 0 3.601zM6.956 20.452H3.717V9h3.239v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
