"use client";

/**
 * TeamBioRonBrennan
 *
 * Team member bio card for Ron Brennan with name, title, description and external links
 * Layout: Full-width colored block, content left-aligned with name, subtitle, bio text and CTA links
 * Category: Content
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamBioRonBrennanProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-image */
  memberImage?: { src?: string; alt?: string };
  /** bio-text */
  bioText?: string;
  /** company-link */
  companyLink?: string;
  /** linkedin-link */
  linkedinLink?: string;
}

export function TeamBioRonBrennan(props: TeamBioRonBrennanProps) {
  return (
    <section className="w-full bg-brand-primary py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Photo */}
            {props.memberImage?.src && (
              <div className="flex-shrink-0">
                <img
                  src={props.memberImage.src}
                  alt={props.memberImage.alt ?? props.memberName ?? "Team member"}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-brand-accent shadow-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col gap-6 flex-1">
              {/* Name & Title */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-on-brand-primary tracking-tight">
                  {props.memberName ?? "Ron Brennan"}
                </h2>
                <p className="mt-2 text-lg md:text-xl text-brand-accent font-semibold uppercase tracking-widest">
                  {props.memberTitle ?? "Co-Founder & Chief Executive Officer"}
                </p>
              </div>

              {/* Divider */}
              <div className="w-16 h-1 bg-brand-accent rounded-full" />

              {/* Bio Text */}
              <p className="text-base md:text-lg text-on-brand-primary leading-relaxed max-w-3xl">
                {props.bioText ??
                  "Ron Brennan is a seasoned technology executive with over two decades of experience building and scaling enterprise software companies. His passion for innovation and deep expertise in product strategy have been instrumental in shaping the company's vision and driving growth across global markets."}
              </p>

              {/* CTA Links */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {props.companyLink && (
                  <a
                    href={props.companyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-accent text-on-brand-secondary font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                    aria-label="Visit company website"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                      />
                    </svg>
                    Company Website
                  </a>
                )}

                {props.linkedinLink && (
                  <a
                    href={props.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-on-brand-primary text-on-brand-primary font-semibold px-6 py-3 rounded-md hover:bg-surface-inverse hover:text-surface-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-on-brand-primary focus:ring-offset-2"
                    aria-label={`View ${props.memberName ?? "Ron Brennan"}'s LinkedIn profile`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.869 0-2.155 1.46-2.155 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.003 3.604 4.609v5.587z" />
                    </svg>
                    LinkedIn Profile
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
