"use client";

/**
 * PrimaryNavigation
 *
 * Main site navigation with logo, nav links, search and contact button
 * Layout: Horizontal bar with logo left, nav links center, icons and button right
 * Category: Navigation
 */

import { useState } from "react";

export interface PrimaryNavigationProps {
  /** logo */
  logo?: string;
  /** nav-links */
  navLinks?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** search-icon */
  searchIcon?: string;
  /** contact-button */
  contactButton?: { label?: string; href?: string };
}

export function PrimaryNavigation(props: PrimaryNavigationProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">
          Navigation
        </p>
        <h2 className="text-h2 text-surface-foreground mb-4">PrimaryNavigation</h2>
        <p className="text-body text-surface-secondary-foreground">
          Main site navigation with logo, nav links, search and contact button
        </p>
      </div>
    </section>
  );
}
