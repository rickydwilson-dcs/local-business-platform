'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  /** Display name for the breadcrumb */
  name: string;
  /** URL path for the breadcrumb link */
  href: string;
  /** Whether this is the current/active page */
  current?: boolean;
}

/**
 * Breadcrumbs component props
 */
interface BreadcrumbsProps {
  /** Array of breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Home icon SVG component
 */
const HomeIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Chevron separator icon SVG component
 */
const ChevronRightIcon = () => (
  <svg
    className="h-5 w-5 flex-shrink-0 text-surface-muted"
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Breadcrumbs Navigation Component
 *
 * Displays a breadcrumb trail for navigation with home icon and chevron separators.
 * Supports accessibility with proper ARIA attributes.
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { name: "Services", href: "/services" },
 *     { name: "Residential", href: "/services/residential", current: true }
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {/* Home link */}
        <li>
          <div>
            <Link
              href="/"
              className="text-surface-muted hover:text-surface-foreground transition-colors"
              aria-label="Home"
            >
              <HomeIcon />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={`${item.href}-${index}`}>
            <div className="flex items-center">
              <ChevronRightIcon />
              {item.current ? (
                <span
                  className="ml-2 text-sm font-medium text-surface-foreground"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="ml-2 text-sm font-medium text-surface-muted hover:text-surface-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
