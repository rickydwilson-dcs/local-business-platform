"use client";

/**
 * TeamMemberTimBouchard
 *
 * Profile card for co-founder Tim Bouchard with bio and external links
 * Layout: Full-width coloured block, text right-aligned with name, title, bio paragraph and multiple CTA links
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/src/components/animation";

export interface TeamMemberTimBouchardProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** agency-link */
  agencyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberTimBouchard(props: TeamMemberTimBouchardProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl ml-auto text-right">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-end gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary tracking-tight">
                {props.memberName ?? "Tim Bouchard"}
              </h2>
              <p className="mt-2 text-lg md:text-xl font-medium text-brand-accent uppercase tracking-widest">
                {props.memberTitle ?? "Co-Founder"}
              </p>
            </div>

            <div className="w-16 h-1 bg-brand-accent rounded-full" />

            <p className="max-w-2xl text-base md:text-lg text-on-brand-primary leading-relaxed opacity-90">
              {props.memberBio ??
                "Tim Bouchard is a co-founder with a passion for building meaningful digital experiences. With years of expertise in strategy, design, and technology, he helps brands grow with purpose and clarity."}
            </p>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 mt-2">
              {props.agencyLink && (
                <a
                  href={props.agencyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-on-brand-primary font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 text-sm md:text-base"
                  aria-label="Visit Tim Bouchard's agency website"
                >
                  <span>Visit Agency</span>
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
                      d="M14 3h7m0 0v7m0-7L10 14M5 5H3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2"
                    />
                  </svg>
                </a>
              )}

              {props.linkedinLink && (
                <a
                  href={props.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-accent text-on-brand-primary font-semibold rounded-lg hover:bg-brand-accent hover:text-on-brand-primary transition-colors duration-200 text-sm md:text-base"
                  aria-label="Connect with Tim Bouchard on LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.985V9h3.102v1.561h.046c.432-.818 1.487-1.681 3.061-1.681 3.274 0 3.878 2.155 3.878 4.958v6.614zM5.337 7.433a1.8 1.8 0 110-3.6 1.8 1.8 0 010 3.6zm1.554 13.019H3.783V9h3.108v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
