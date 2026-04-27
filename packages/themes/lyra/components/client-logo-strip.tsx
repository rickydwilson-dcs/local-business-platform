"use client";

/**
 * ClientLogoStrip
 *
 * Displays logos of notable clients in a horizontal row to build trust and credibility
 * Layout: Full-width horizontal row of client logos evenly spaced with reduced opacity
 * Category: Social Proof
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ClientLogoStripProps {
  /** client-logo-1 */
  clientLogo1?: string;
  /** client-logo-2 */
  clientLogo2?: string;
  /** client-logo-3 */
  clientLogo3?: string;
  /** client-logo-4 */
  clientLogo4?: string;
  /** client-logo-5 */
  clientLogo5?: string;
  /** client-logo-6 */
  clientLogo6?: string;
}

export function ClientLogoStrip(props: ClientLogoStripProps) {
  return (
    <section className="bg-surface-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {props.clientLogo1 && (
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo1}
                  alt="Client logo"
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                />
              </div>
            )}
            {props.clientLogo2 && (
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo2}
                  alt="Client logo"
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                />
              </div>
            )}
            {props.clientLogo3 && (
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo3}
                  alt="Client logo"
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                />
              </div>
            )}
            {props.clientLogo4 && (
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo4}
                  alt="Client logo"
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                />
              </div>
            )}
            {props.clientLogo5 && (
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo5}
                  alt="Client logo"
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                />
              </div>
            )}
            {props.clientLogo6 && (
              <div className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo6}
                  alt="Client logo"
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
