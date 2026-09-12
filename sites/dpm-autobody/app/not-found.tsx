'use client';

/**
 * 404 Not Found Page
 *
 * Custom error page with helpful navigation options. Restyled 2026-09-12 for the same reason as
 * `/privacy-policy` and `/cookie-policy` (see that file's header comment) — this page used
 * base-template's generic `bg-surface-subtle`/`border-surface-border` (undefined in this site's
 * `theme.config.ts`, falling back to the theme-system's light defaults) plus a literal
 * `bg-white`, all rendering as bright white cards on this all-dark site. The base-template
 * services/locations/about grid links were already removed here (DPM has no such routes) —
 * only the colour tokens were never fixed.
 */

import Link from 'next/link';
import { Home, ArrowLeft, Phone, Mail } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL } from '@/lib/contact-info';

const CARD = 'border border-[rgba(232,228,220,0.14)] bg-surface-card p-6';
const P = 'font-prose text-[#CFCAC1]';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface-background">
      <div className="mx-auto w-[min(640px,100%-3rem)] py-16 text-center">
        <h1 className="mb-4 font-heading text-[clamp(3.5rem,10vw,6rem)] font-light leading-none text-ink-neutral">
          404
        </h1>
        <h2 className="mb-4 font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-light text-surface-foreground">
          Page Not Found
        </h2>
        <p className={`mx-auto mb-8 max-w-md ${P}`}>
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-primary px-6 py-3 font-medium text-white transition-colors hover:bg-brand-primary-hover"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-[rgba(232,228,220,0.14)] px-6 py-3 font-medium text-surface-foreground transition-colors hover:bg-surface-card"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        <div className={`mx-auto mb-12 max-w-md ${CARD}`}>
          <h3 className="mb-4 font-medium text-surface-foreground">Need Help?</h3>
          <div className="space-y-3 text-sm">
            <Link
              href={`tel:${PHONE_TEL}`}
              className="flex items-center justify-center gap-2 text-ink-neutral hover:text-surface-foreground"
            >
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </Link>
            <Link
              href={`mailto:${BUSINESS_EMAIL}`}
              className="flex items-center justify-center gap-2 text-ink-neutral hover:text-surface-foreground"
            >
              <Mail className="h-4 w-4" />
              {BUSINESS_EMAIL}
            </Link>
          </div>
        </div>

        <p className={P}>
          Or see{' '}
          <Link
            href="/contact"
            className="text-ink-neutral underline decoration-[rgba(232,228,220,0.35)] hover:text-surface-foreground"
          >
            how to get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
