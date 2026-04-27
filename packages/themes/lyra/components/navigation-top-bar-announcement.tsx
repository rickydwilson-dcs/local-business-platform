"use client";

/**
 * AnnouncementBar
 *
 * Top-of-page announcement strip with a CTA link to meet the team
 * Layout: Full-width single row centered text with inline link
 * Category: Navigation
 */

import { useState } from "react";

export interface AnnouncementBarProps {
  /** announcement-text */
  announcementText?: string;
  /** announcement-link */
  announcementLink?: { label?: string; href?: string };
}

export function AnnouncementBar(props: AnnouncementBarProps) {
  return (
    <div className="bg-brand-primary w-full py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <p className="text-on-brand-primary text-sm font-medium">
          {props.announcementText ?? "Meet the team behind the product."}{" "}
          {props.announcementLink && (
            <a
              href={props.announcementLink.href}
              className="text-on-brand-primary underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity duration-200"
              aria-label="Learn more about our team"
            >
              {props.announcementLink.label ?? "Meet the team \u2192"}
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
