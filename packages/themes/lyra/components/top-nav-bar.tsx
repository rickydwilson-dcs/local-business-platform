"use client";

/**
 * TopNavBar
 *
 * Site-wide navigation with logo, primary nav links, CTA button, and hamburger menu for mobile
 * Layout: Horizontal bar with logo left, nav links center-right, CTA button and hamburger menu icon right
 * Category: Navigation
 */

import { useState } from "react";

export interface TopNavBarProps {
  /** logo */
  logo?: string;
  /** nav-links */
  navLinks?: Array<{ label?: string; href?: string }>;
  /** cta-button */
  ctaButton?: Array<{ label?: string; href?: string }>;
  /** hamburger-menu */
  hamburgerMenu?: string;
}

export function TopNavBar(props: TopNavBarProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">Navigation</p>
        <h2 className="text-h2 text-surface-foreground mb-4">TopNavBar</h2>
        <p className="text-body text-surface-secondary-foreground">Site-wide navigation with logo, primary nav links, CTA button, and hamburger menu for mobile</p>
      </div>
    </section>
  );
}
