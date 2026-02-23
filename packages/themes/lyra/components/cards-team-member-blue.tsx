"use client";

/**
 * TeamMemberTimBouchard
 *
 * Profile card for co-founder Tim Bouchard with bio and external links
 * Layout: Full-width colored block with name, title, bio text, and external links aligned right
 * Category: Cards
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamMemberTimBouchardProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-bio */
  memberBio?: string;
  /** luminus-link */
  luminusLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberTimBouchard(props: TeamMemberTimBouchardProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              {/* Name and Title */}
              <div className="flex-shrink-0">
                <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary tracking-tight">
                  {props["member-name"] ?? "Tim Bouchard"}
                </h2>
                <p className="mt-2 text-lg font-medium text-brand-accent uppercase tracking-widest">
                  {props["member-title"] ?? "Co-Founder"}
                </p>
              </div>
  
              {/* Bio */}
              <div className="flex-1 md:max-w-2xl">
                <p className="text-on-brand-primary text-base md:text-lg leading-relaxed">
                  {props["member-bio"] ??
                    "Tim Bouchard is a co-founder with a passion for building meaningful products and empowering teams to do their best work. With a background spanning design, strategy, and technology, Tim brings a human-centred approach to every challenge."}
                </p>
              </div>
            </div>
          </RevealOnScroll>
  
          {/* External Links */}
          <RevealOnScroll variant="fade-up">
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
              {props["luminus-link"] && (
                <a
                  href={props["luminus-link"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-on-brand-primary font-semibold rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  aria-label="Visit Tim Bouchard's Luminus profile"
                >
                  <span>Luminus Profile</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
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
  
              {props["linkedin-link"] && (
                <a
                  href={props["linkedin-link"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-surface-muted text-on-brand-primary font-semibold rounded-full hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  aria-label="Visit Tim Bouchard's LinkedIn profile"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.985V9h3.102v1.561h.046c.432-.818 1.487-1.681 3.061-1.681 3.274 0 3.878 2.155 3.878 4.958v6.614zM5.337 7.433a1.8 1.8 0 110-3.6 1.8 1.8 0 010 3.6zm1.554 13.019H3.782V9h3.109v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
