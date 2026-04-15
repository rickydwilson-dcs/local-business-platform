"use client";

/**
 * FooterMultiColumn
 *
 * Site footer with multi-column link groups, logo, and copyright
 * Layout: full-bleed dark band with 4-column link grid, logo and copyright below
 * Category: Footer
 */

import React, { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface FooterMultiColumnProps {
  /** logo */
  logo?: string;
  /** linkColumns */
  linkColumns?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** columnHeadings */
  columnHeadings?: string;
  /** columnLinks */
  columnLinks?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** copyright */
  copyright?: string;
}

export function FooterMultiColumn(props: FooterMultiColumnProps) {
  return (
    <footer className="bg-brand-primary w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Link Columns Grid */}
        <RevealOnScroll variant="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {props.linkColumns && props.linkColumns.length > 0
              ? props.linkColumns.map((column, colIndex) => (
                  <div key={colIndex}>
                    {props.columnHeadings && props.columnHeadings[colIndex] && (
                      <h3 className="text-on-brand-primary font-semibold text-sm uppercase tracking-wider mb-4">
                        {props.columnHeadings[colIndex]}
                      </h3>
                    )}
                    <ul className="space-y-3">
                      {Object.entries(column).filter(([k]) => k === "label" || k === "href")
                        .length > 0 && (
                        <li>
                          <a
                            href={column?.href}
                            className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200 text-sm"
                          >
                            {column?.label}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                ))
              : props.columnHeadings &&
                Array.from(props.columnHeadings).map((heading, colIndex) => (
                  <div key={colIndex}>
                    <h3 className="text-on-brand-primary font-semibold text-sm uppercase tracking-wider mb-4">
                      {heading}
                    </h3>
                    <ul className="space-y-3">
                      {props.columnLinks &&
                        props.columnLinks
                          .filter((_, i) => i % (props.columnHeadings?.length ?? 4) === colIndex)
                          .map((link, linkIndex) => (
                            <li key={linkIndex}>
                              <a
                                href={link?.href}
                                className="text-surface-muted-foreground hover:text-brand-accent transition-colors duration-200 text-sm"
                              >
                                {link?.label}
                              </a>
                            </li>
                          ))}
                    </ul>
                  </div>
                ))}
          </div>
        </RevealOnScroll>

        {/* Divider */}
        <div className="border-t border-surface-muted mb-8" />

        {/* Logo and Copyright Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          {props.logo && (
            <div className="flex-shrink-0">
              <span className="text-on-brand-primary font-bold text-xl">{props.logo}</span>
            </div>
          )}

          {/* Copyright */}
          {props.copyright && (
            <p className="text-surface-muted-foreground text-sm text-center md:text-right">
              {props.copyright}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
