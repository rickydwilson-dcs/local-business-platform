"use client";

/**
 * TeamBioCard
 *
 * Full-width profile card for a co-founder with name, title, bio text, and external links; background colour varies per person
 * Layout: Full-width solid colour block with name, title, bio text, and external links; content alternates left/right alignment
 * Category: Custom
 */

import { useState } from "react";

export interface TeamBioCardProps {
  /** person-name */
  personName?: string;
  /** person-title */
  personTitle?: string;
  /** bio-text */
  bioText?: string;
  /** linkedin-link */
  linkedinLink?: Array<{ label?: string; href?: string }>;
  /** external-link */
  externalLink?: Array<{ label?: string; href?: string }>;
}

export function TeamBioCard(props: TeamBioCardProps) {
  return (
      <section className="w-full bg-surface-background">
        <div className="w-full">
          {/* Profile Card */}
          <div className="bg-brand-primary w-full">
            <RevealOnScroll variant="fade-up">
              <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32">
                <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
                  {/* Name & Title Block */}
                  <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
                    <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                      {props['person-name'] || 'Co-Founder Name'}
                    </h2>
                    <p className="mt-3 text-on-brand-primary text-base md:text-lg font-medium opacity-80 uppercase tracking-widest">
                      {props['person-title'] || 'Co-Founder & CEO'}
                    </p>
                    {/* Divider */}
                    <div className="mt-6 w-12 h-1 bg-brand-accent rounded-full" />
                  </div>
  
                  {/* Bio & Links Block */}
                  <div className="md:w-2/3 lg:w-3/4 flex flex-col gap-8">
                    <p className="text-on-brand-primary text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl">
                      {props['bio-text'] ||
                        'A passionate builder and visionary leader dedicated to creating meaningful products that make a difference. With years of experience across technology and business, they bring a unique perspective to every challenge.'}
                    </p>
  
                    {/* External Links */}
                    <div className="flex flex-wrap items-center gap-4">
                      {props['linkedin-link'] && (
                        <a
                          href={props['linkedin-link']}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${props['person-name'] || 'Co-Founder'} on LinkedIn`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-muted text-on-brand-primary text-sm font-semibold hover:bg-brand-secondary hover:border-brand-secondary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
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
                          LinkedIn
                        </a>
                      )}
  
                      {props['external-link'] && (
                        <a
                          href={props['external-link']}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${props['person-name'] || 'Co-Founder'} external profile`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-accent text-surface-background text-sm font-semibold hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                            aria-hidden="true"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Visit Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    );
}
