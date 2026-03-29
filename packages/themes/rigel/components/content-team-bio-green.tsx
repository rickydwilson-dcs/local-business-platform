"use client";

/**
 * TeamBioBenDunkle
 *
 * Team member bio card for Ben Dunkle with name, title, description and LinkedIn link
 * Layout: Full-width colored block, content right-aligned with name, subtitle, bio text and CTA link
 * Category: Content
 */

import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface TeamBioBenDunkleProps {
  /** member-name */
  memberName?: string;
  /** member-title */
  memberTitle?: string;
  /** member-image */
  memberImage?: { src?: string; alt?: string };
  /** bio-text */
  bioText?: string;
  /** linkedin-link */
  linkedinLink?: string;
}

export function TeamBioBenDunkle(props: TeamBioBenDunkleProps) {
  return (
    <section className="w-full bg-brand-secondary py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
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
          <div className="flex flex-col items-end text-right flex-1">
            <RevealOnScroll variant="fade-up">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-brand-secondary mb-2 tracking-tight">
                  {props.memberName ?? "Ben Dunkle"}
                </h2>
                <p className="text-brand-accent text-lg md:text-xl font-semibold uppercase tracking-widest mb-6">
                  {props.memberTitle ?? "Partner & Creative Director"}
                </p>
                <div className="w-16 h-1 bg-brand-accent ml-auto mb-6" />
                <p className="text-surface-background text-base md:text-lg leading-relaxed mb-8">
                  {props.bioText ??
                    "Ben brings over two decades of experience shaping brand identities and creative strategies for organisations across the globe. His work sits at the intersection of storytelling and design, helping teams communicate with clarity, purpose, and impact. Ben is passionate about building cultures where creativity thrives and ideas are given the space to grow."}
                </p>
                <a
                  href={props.linkedinLink ?? "https://www.linkedin.com/in/bendunkle"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-on-brand-secondary transition-colors duration-200 px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm"
                  aria-label={`Connect with ${props.memberName ?? "Ben Dunkle"} on LinkedIn`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
