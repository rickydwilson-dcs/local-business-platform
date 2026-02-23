'use client';

/**
 * 404 Not Found Page
 *
 * Custom error page with helpful navigation options.
 */

import Link from 'next/link';
import { Home, ArrowLeft, Phone, Mail } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL } from '@/lib/contact-info';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-surface-background">
      <div className="container-narrow text-center py-16">
        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-bold text-brand-primary/20 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-surface-muted-foreground mb-8 max-w-md mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-surface-border text-surface-foreground px-6 py-3 rounded-lg font-semibold hover:bg-surface-subtle transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Contact Info */}
        <div className="bg-surface-subtle rounded-lg p-6 max-w-md mx-auto mb-12">
          <h3 className="font-semibold text-surface-foreground mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm">
            <Link
              href={`tel:${PHONE_TEL}`}
              className="flex items-center justify-center gap-2 text-brand-primary hover:underline"
            >
              <Phone className="w-4 h-4" />
              {PHONE_DISPLAY}
            </Link>
            <Link
              href={`mailto:${BUSINESS_EMAIL}`}
              className="flex items-center justify-center gap-2 text-brand-primary hover:underline"
            >
              <Mail className="w-4 h-4" />
              {BUSINESS_EMAIL}
            </Link>
          </div>
        </div>

        {/* Popular Pages */}
        <div>
          <h3 className="font-semibold text-surface-foreground mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Link
              href="/services"
              className="block p-4 bg-white rounded-lg border border-surface-border hover:border-brand-primary hover:shadow-sm transition-all"
            >
              <span className="font-medium text-surface-foreground">Services</span>
            </Link>
            <Link
              href="/locations"
              className="block p-4 bg-white rounded-lg border border-surface-border hover:border-brand-primary hover:shadow-sm transition-all"
            >
              <span className="font-medium text-surface-foreground">Locations</span>
            </Link>
            <Link
              href="/about"
              className="block p-4 bg-white rounded-lg border border-surface-border hover:border-brand-primary hover:shadow-sm transition-all"
            >
              <span className="font-medium text-surface-foreground">About</span>
            </Link>
            <Link
              href="/contact"
              className="block p-4 bg-white rounded-lg border border-surface-border hover:border-brand-primary hover:shadow-sm transition-all"
            >
              <span className="font-medium text-surface-foreground">Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
