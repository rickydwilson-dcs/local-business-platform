"use client";

/**
 * HelpCTABanner
 *
 * Dark full-width banner encouraging users to contact the team if they have website issues, with a CTA button and illustrated team avatars
 * Layout: Two-column dark background: heading, body text and CTA button left; illustrated character avatars right
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface HelpCTABannerProps {
  /** heading */
  heading?: string;
  /** body-text */
  bodyText?: string;
  /** cta-button */
  ctaButton?: { label?: string; href?: string };
  /** avatar-illustrations */
  avatarIllustrations?: { src?: string; alt?: string }[];
}

export function HelpCTABanner(props: HelpCTABannerProps) {
  return (
    <section className="bg-surface-inverse w-full py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text and CTA */}
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col gap-6">
            <h2 className="text-surface-background text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {props.heading ?? "Having trouble with our website?"}
            </h2>
            <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              {props.bodyText ??
                "Our team is here to help. Whether it's a technical issue or a general question, don't hesitate to reach out and we'll get back to you as soon as possible."}
            </p>
            {props.ctaButton ? (
              <a
                href={props.ctaButton?.href ?? "#"}
                className="inline-flex items-center justify-center self-start bg-brand-primary text-on-brand-primary font-semibold text-base px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                {props.ctaButton?.label ?? "Contact Us"}
              </a>
            ) : (
              <a
                href="#"
                className="inline-flex items-center justify-center self-start bg-brand-primary text-on-brand-primary font-semibold text-base px-6 py-3 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              >
                Contact Us
              </a>
            )}
          </div>
        </RevealOnScroll>

        {/* Right Column: Avatar Illustrations */}
        <RevealOnScroll variant="fade-up">
          <div className="flex items-center justify-center md:justify-end">
            {props.avatarIllustrations && props.avatarIllustrations.length > 0 ? (
              <div className="flex -space-x-4">
                {props.avatarIllustrations.map(
                  (avatar: { src?: string; alt?: string }, index: number) => (
                    <div
                      key={index}
                      className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-surface-inverse bg-surface-muted flex items-center justify-center"
                      aria-label={avatar.alt ?? `Team member ${index + 1}`}
                    >
                      {avatar.src ? (
                        <img
                          src={avatar.src}
                          alt={avatar.alt ?? `Team member ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12 text-surface-muted-foreground"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              /* Fallback illustrated placeholder avatars */
              <div className="flex -space-x-4">
                {[
                  { bg: "bg-brand-primary", label: "Team member 1" },
                  { bg: "bg-brand-secondary", label: "Team member 2" },
                  { bg: "bg-brand-accent", label: "Team member 3" },
                  { bg: "bg-surface-muted", label: "Team member 4" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-4 border-surface-inverse ${item.bg} flex items-center justify-center`}
                    aria-label={item.label}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-surface-background"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
