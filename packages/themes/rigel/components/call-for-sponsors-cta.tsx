"use client";

/**
 * CallForSponsorsCTA
 *
 * Invites potential sponsors to support the event with a link to sponsor levels
 * Layout: Full-width blue background block with heading and body text right-aligned, sponsor levels button
 * Category: CTA
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface CallForSponsorsCTAProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-text */
  bodyText?: string;
  /** sponsor-levels-button */
  sponsorLevelsButton?: Array<{ label?: string; href?: string }>;
}

export function CallForSponsorsCTA(props: CallForSponsorsCTAProps) {
  return (
    <section className="bg-[#1a56db] w-full py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-end text-right">
        <RevealOnScroll variant="fade-up">
          <div className="max-w-2xl">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {props.sectionHeading ?? "Call For Sponsors"}
            </h2>
            <p className="text-white text-base md:text-lg lg:text-xl mb-8 leading-relaxed opacity-90">
              {props.bodyText ??
                "Support our event and connect your brand with a passionate community. Your sponsorship helps us create an unforgettable experience for all attendees."}
            </p>
            {props.sponsorLevelsButton && (
              <a
                href={props.sponsorLevelsButton[0]?.href ?? "#"}
                className="inline-block bg-white text-[#1a56db] font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                aria-label={props.sponsorLevelsButton[0]?.label ?? "View sponsor levels"}
              >
                {props.sponsorLevelsButton[0]?.label ?? "View Sponsor Levels"}
              </a>
            )}
            {!props.sponsorLevelsButton && (
              <a
                href="#sponsor-levels"
                className="inline-block bg-white text-[#1a56db] font-semibold text-base md:text-lg px-8 py-4 rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                View Sponsor Levels
              </a>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
