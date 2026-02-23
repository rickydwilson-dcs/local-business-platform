"use client";

/**
 * TeamMemberCard
 *
 * Full-width profile card for a co-founder or team member with bio and external links
 * Layout: Full-width coloured block with member name, title, bio text, and external links aligned left or right alternating
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
      <section className="w-full bg-surface-background">
        <div className="w-full">
          {/* Member block - alternating layout handled via flex-row / flex-row-reverse */}
          <div className="w-full bg-brand-primary">
            <RevealOnScroll variant="fade-up">
              <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
                {/* Avatar placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-surface-muted border-4 border-surface-background flex items-center justify-center overflow-hidden">
                    <span className="text-4xl md:text-5xl font-bold text-on-brand-primary select-none">
                      {props['member-name']
                        ? props['member-name']
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                        : 'TM'}
                    </span>
                  </div>
                </div>
  
                {/* Content */}
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary leading-tight">
                      {props['member-name'] || 'Team Member Name'}
                    </h2>
                    <p className="mt-1 text-lg md:text-xl font-medium text-surface-muted-foreground">
                      {props['member-title'] || 'Co-Founder & CEO'}
                    </p>
                  </div>
  
                  <p className="text-base md:text-lg text-on-brand-primary leading-relaxed max-w-2xl">
                    {props['member-bio'] ||
                      'A passionate builder with a background in product, design, and engineering. Dedicated to creating meaningful experiences that make a real difference for users and teams alike.'}
                  </p>
  
                  {/* External links */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    {props['linkedin-link'] && (
                      <a
                        href={props['linkedin-link']}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${props['member-name'] || 'Team member'} on LinkedIn`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-background text-brand-primary font-semibold text-sm hover:bg-surface-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.002 3.604 4.604v5.592z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
  
                    {props['external-link'] && (
                      <a
                        href={props['external-link']}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${props['member-name'] || 'Team member'} external profile`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-background text-on-brand-primary font-semibold text-sm hover:bg-surface-background hover:text-brand-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2 focus:ring-offset-brand-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
