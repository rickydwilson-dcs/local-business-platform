"use client";

/**
 * TeamMemberTimBouchard
 *
 * Profile card for co-founder Tim Bouchard with bio and external links
 * Layout: Full-width colour block, text right-aligned with name, title, bio, and CTA links
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
  /** agency-link */
  agencyLink?: Array<{ label?: string; href?: string }>;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
}

export function TeamMemberTimBouchard(props: TeamMemberTimBouchardProps) {
  return (
      <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl ml-auto">
          <RevealOnScroll variant="fade-up">
            <div className="text-right">
              <p className="text-brand-accent uppercase tracking-widest text-sm font-semibold mb-2">
                Co-Founder
              </p>
              <h2 className="text-on-brand-primary text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                {props.memberName ?? "Tim Bouchard"}
              </h2>
              <p className="text-brand-accent text-lg md:text-xl font-medium mb-6">
                {props.memberTitle ?? "Creative Director & Co-Founder"}
              </p>
              <div className="w-16 h-1 bg-brand-accent ml-auto mb-8" />
              <p className="text-on-brand-primary text-base md:text-lg leading-relaxed max-w-2xl ml-auto mb-10">
                {props.memberBio ??
                  "Tim Bouchard is a seasoned creative strategist with over a decade of experience building brands that resonate. As co-founder, he drives the vision and creative direction that defines the agency's identity and client success stories."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                {props.agencyLink && (
                  <a
                    href={props.agencyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-brand-accent text-surface-background font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity duration-200 text-sm uppercase tracking-wide"
                  >
                    Visit Agency
                  </a>
                )}
                {props.linkedinLink && (
                  <a
                    href={props.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-brand-accent text-brand-accent font-semibold px-6 py-3 rounded-md hover:bg-brand-accent hover:text-surface-background transition-colors duration-200 text-sm uppercase tracking-wide"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {!props.agencyLink && !props.linkedinLink && (
                  <>
                    <a
                      href="#"
                      className="inline-block bg-brand-accent text-surface-background font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity duration-200 text-sm uppercase tracking-wide"
                    >
                      Visit Agency
                    </a>
                    <a
                      href="#"
                      className="inline-block border border-brand-accent text-brand-accent font-semibold px-6 py-3 rounded-md hover:bg-brand-accent hover:text-surface-background transition-colors duration-200 text-sm uppercase tracking-wide"
                    >
                      LinkedIn Profile
                    </a>
                  </>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
