"use client";

/**
 * NavDarkBar
 *
 * Primary site navigation with logo, event info button and mobile menu toggle
 * Layout: full-bleed horizontal bar with flex space-between
 * Category: Navigation
 */

import { useState } from "react";

export interface NavDarkBarProps {
  /** logo */
  logo?: string;
  /** eventInfoButton */
  eventInfoButton?: { label?: string; href?: string };
  /** mobileMenuToggle */
  mobileMenuToggle?: string;
  /** navLinks */
  navLinks?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
  }>;
}

export function NavDarkBar(props: NavDarkBarProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-muted-foreground text-sm uppercase tracking-wider mb-2">
          Navigation
        </p>
        <h2 className="text-h2 text-surface-foreground mb-4">NavDarkBar</h2>
        <p className="text-body text-surface-secondary-foreground">
          Primary site navigation with logo, event info button and mobile menu toggle
        </p>
      </div>
    </section>
  );
}
