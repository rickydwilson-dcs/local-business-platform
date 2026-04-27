"use client";

/**
 * AnnouncementBar
 *
 * Top-of-page promotional announcement strip with centered text and a CTA link
 * Layout: Full-width single row with centered text and inline arrow CTA link
 * Category: Navigation
 */

import { useState } from "react";

export interface AnnouncementBarProps {
  /** announcement-text */
  announcementText?: string;
  /** announcement-cta */
  announcementCta?: { href?: string; label?: string };
}

export function AnnouncementBar(props: AnnouncementBarProps) {
  return (
    <div className="bg-brand-primary w-full py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <p className="text-on-brand-primary text-sm text-center">
          {props.announcementText ?? "🎉 Special offer available for a limited time!"}
        </p>
        {props.announcementCta?.href && (
          <a
            href={props.announcementCta.href}
            className="text-on-brand-primary text-sm font-semibold underline underline-offset-2 inline-flex items-center gap-1 hover:opacity-80 transition-opacity whitespace-nowrap"
            aria-label={props.announcementCta.label}
          >
            {props.announcementCta.label ?? "Learn more"}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </div>
  );
}
