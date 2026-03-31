"use client";

/**
 * TeamBioTimBouchard
 *
 * Team member bio card for Tim Bouchard with role, description and external links
 * Layout: Full-width colored block with text right-aligned, name large, subtitle and body below
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamBioTimBouchardProps {
  /** member-name */
  memberName?: string;
  /** member-role */
  memberRole?: string;
  /** bio-text */
  bioText?: string;
  /** agency-link */
  agencyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamBioTimBouchard(props: TeamBioTimBouchardProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl ml-auto text-right">
          <RevealOnScroll variant="fade-up">
            <div className="mb-2">
              <span className="inline-block text-brand-accent text-sm font-semibold uppercase tracking-widest mb-4">
                Meet the Team
              </span>
            </div>
  
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-on-brand-primary leading-none mb-4">
              {props["member-name"] ?? "Tim Bouchard"}
            </h1>
  
            <p className="text-xl md:text-2xl font-medium text-brand-accent mb-6 tracking-wide">
              {props["member-role"] ?? "Creative Director & Co-Founder"}
            </p>
  
            <p className="text-base md:text-lg text-on-brand-primary opacity-80 leading-relaxed max-w-2xl ml-auto mb-10">
              {props["bio-text"] ??
                "Tim Bouchard is a seasoned creative strategist with over a decade of experience shaping brand identities for forward-thinking companies. His work bridges the gap between bold design and meaningful storytelling, helping organisations connect with their audiences in authentic and lasting ways."}
            </p>
  
            <div className="flex flex-col sm:flex-row gap-4 justify-end items-center">
              {props["agency-link"] && (
                <a
                  href={props["agency-link"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-accent text-on-brand-secondary font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity duration-200 text-sm uppercase tracking-wide"
                  aria-label="Visit Tim Bouchard's agency website"
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
                  Agency
                </a>
              )}
  
              {props["linkedin-link"] && (
                <a
                  href={props["linkedin-link"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brand-primary text-on-brand-primary font-semibold px-6 py-3 rounded-full hover:bg-brand-secondary transition-colors duration-200 text-sm uppercase tracking-wide"
                  aria-label="Connect with Tim Bouchard on LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
