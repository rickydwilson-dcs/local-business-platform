"use client";

/**
 * AboutSplitDark
 *
 * About section with heading on left and descriptive body text on right on dark background
 * Layout: 2-column split: heading left, body text and CTA right, dark background
 * Category: Content
 */

import React, { useState } from "react";

export interface AboutSplitDarkProps {
  /** heading */
  heading?: string;
  /** bodyText */
  bodyText?: string;
  /** ctaButton */
  ctaButton?: { label?: string; href?: string };
}

export function AboutSplitDark(props: AboutSplitDarkProps) {
  return (
    <section className="bg-brand-primary py-10">
      <div className="flex flex-col items-center text-center px-4 w-full">
        <div className="w-full max-w-[700px]">
          <div className="w-full">
            <h1 className="text-[30px] font-medium tracking-[0.1rem] text-on-brand-primary mb-4 font-sans">
              {props.heading}
            </h1>

            <p className="text-on-brand-primary mb-5 leading-relaxed">{props.bodyText}</p>

            <div className="w-full mb-5">
              <form className="flex flex-row flex-nowrap w-full">
                <input
                  type="email"
                  placeholder="username@example.com *"
                  required
                  className="flex-1 min-w-0 bg-brand-secondary text-on-brand-primary placeholder-on-brand-primary/70 py-[18px] px-4 rounded-l-full outline-none border-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-brand-secondary text-on-brand-primary font-semibold py-[18px] px-6 rounded-r-full whitespace-nowrap text-sm hover:opacity-90 transition-opacity border-none cursor-pointer"
                >
                  {props.ctaButton?.label ?? "Notify Me!"}
                </button>
              </form>
            </div>

            <div className="w-full mt-4">
              <div className="border-t border-on-brand-primary/20 w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
